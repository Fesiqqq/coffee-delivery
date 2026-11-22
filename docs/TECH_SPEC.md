# TECH_SPEC — Café Lua (Coffee Delivery)

> Especificação técnica. Cada decisão referencia os IDs do [PRD_SPEC](./PRD_SPEC.md) (RF-xx, RN-xx, RNF-xx).

## 1. Stack e justificativa

| Tecnologia | Versão | Uso | Por quê | Requisitos |
| --- | --- | --- | --- | --- |
| React | 19 | UI em componentes | Base da disciplina | todos |
| Vite | 8 | Dev server e build | Rápido, template oficial `react-ts` | RNF-03 |
| TypeScript | 7 (estrito) | Tipagem | Contratos de `Coffee`, `CartItem`, `Order`…; proíbe `any` | RNF-06 |
| React Router (`react-router-dom`) | 7 | Rotas `/`, `/checkout`, `/success` | SPA sem reload | RF-07 |
| Context API + `useReducer` | nativo | Estado global do carrinho | Ações explícitas e testáveis, sem lib externa | RF-03..06, RF-13 |
| React Hook Form | 7 | Formulário de endereço | Pouca re-renderização, integra com Zod | RF-08, RF-09 |
| Zod + `@hookform/resolvers` | 4 / 5+ | Schema de validação | Mesma fonte para tipos (`z.infer`) e regras | RF-08, RF-11, RN-07 |
| styled-components | 6 | Estilos + tema | Herdado do desafio original; `ThemeProvider` facilita light/dark com tokens tipados | RF-14, RF-15 |
| Phosphor Icons | 2 | Ícones | Mesmo set do Style Guide do Figma | — |
| Vitest + Testing Library + jsdom | 5 / 16 | Testes | Integrado ao Vite, API compatível com Jest | RNF-06 |
| oxlint | 1 | Lint | Vem no template do Vite, muito rápido | RNF-06 |
| ViaCEP | — | API pública de CEP | Gratuita, sem chave, CORS liberado | RF-08, RN-07 |

## 2. Arquitetura

```
             ┌──────────────── main.tsx ────────────────┐
             │ BrowserRouter                             │
             │  └ AppThemeProvider (ThemeContext + SC)   │
             │     └ CartProvider (CartContext)          │
             │        └ App (Routes)                     │
             └───────────────────────────────────────────┘
App ─ PageLayout (Header + <Outlet/>)
       ├─ "/"         Home      → Hero, CoffeeCatalog → CoffeeCard → QuantityInput
       ├─ "/checkout" Checkout  → DeliveryAddressForm, PaymentMethodSelector, CartItem, CartSummary, EmptyState
       └─ "/success"  Success   → OrderSuccess | EmptyState
```

**Fluxo de dados**
1. Componentes chamam `useCart()` → recebem `items` (já resolvidos com dados do catálogo), totais e *action creators* (`addItem`, `increment`, `decrement`, `removeItem`, `placeOrder`).
2. Cada *action creator* faz `dispatch` para `cartReducer` (função pura, imutável).
3. Um `useEffect` no `CartProvider` grava o estado em `localStorage` sempre que ele muda (RF-06).
4. `placeOrder(form)` monta um **snapshot** `Order` (cópia de itens, preços e totais), salva em `lastOrder` (persistido), despacha `CLEAR` e retorna o pedido (RF-12, RF-13, RN-06).

**Separação de responsabilidades**
- *Regras de cálculo*: apenas em `src/utils/cart.ts` (RN-03).
- *Regras de estado*: apenas em `src/reducers/cart/` (RN-01, RN-02).
- *Regras de validação*: apenas em `src/schemas/checkout.ts` (RN-07).
- *I/O externo*: `src/services/viaCep.ts` (RF-08) e `src/hooks/useLocalStorage.ts` (RF-06, RF-14).
- `App.tsx` contém apenas as rotas.

## 3. Estrutura de diretórios

```
src/
├── assets/            logo (claro/escuro), símbolo e ilustrações dos cafés (SVG)
├── components/        Header, Logo, ThemeToggle, CartBadge, Hero, CoffeeCatalog, CoffeeCard,
│                      QuantityInput, CartItem, CartSummary, DeliveryAddressForm,
│                      PaymentMethodSelector, OrderSuccess, EmptyState, PageLayout
├── contexts/          CartContext / CartProvider, ThemeContext / AppThemeProvider
├── data/              coffees.ts (catálogo tipado)
├── hooks/             useCart, useTheme, useLocalStorage, useCepLookup
├── pages/             Home, Checkout, Success
├── reducers/cart/     actions.ts, reducer.ts
├── schemas/           checkout.ts (Zod)
├── services/          viaCep.ts
├── styles/            themes.ts (tokens), global.ts, styled.d.ts
├── tests/             setup.ts + testes de unidade e integração
├── types/             index.ts
├── utils/             currency.ts, cart.ts, cep.ts, storage-keys.ts
├── App.tsx
└── main.tsx
public/                favicon.svg
scripts/               generate-coffee-art.mjs (gera as ilustrações SVG)
```

## 4. Tipos principais (`src/types/index.ts`)

```ts
type CoffeeTag = 'tradicional' | 'gelado' | 'com leite' | 'especial' | 'alcoólico'

interface Coffee {
  id: string            // slug estável, ex.: 'expresso-tradicional'
  name: string
  description: string
  tags: CoffeeTag[]
  priceInCents: number  // RN-04
  image: string         // URL do asset
}

interface CartItem { coffeeId: string; quantity: number }          // persistido
interface CartLine extends CartItem { coffee: Coffee; lineTotalInCents: number } // derivado

type PaymentMethod = 'credit' | 'debit' | 'cash'                    // RN-05

interface DeliveryAddress {
  cep: string; street: string; number: string; complement?: string
  neighborhood: string; city: string; uf: string
}

interface OrderItem { coffeeId: string; name: string; image: string; unitPriceInCents: number; quantity: number }

interface Order {                                                    // snapshot (RN-06)
  id: string; createdAt: string
  items: OrderItem[]
  address: DeliveryAddress
  paymentMethod: PaymentMethod
  subtotalInCents: number; deliveryFeeInCents: number; totalInCents: number
}
```

O carrinho guarda apenas `coffeeId` + `quantity`. Preço e nome vêm sempre do catálogo, então um item persistido que não existe mais no catálogo é descartado ao montar as linhas (RN-10).

## 5. Context API + `useReducer`

```ts
type CartAction =
  | { type: 'ADD_ITEM';  payload: { coffeeId: string; quantity: number } }
  | { type: 'INCREMENT'; payload: { coffeeId: string } }
  | { type: 'DECREMENT'; payload: { coffeeId: string } }
  | { type: 'REMOVE';    payload: { coffeeId: string } }
  | { type: 'CLEAR' }
```

| Ação | Regra | Método de array |
| --- | --- | --- |
| `ADD_ITEM` | ignora qtd não inteira ou < 1; soma se já existe (máx. 99) | `find` + `map` / spread |
| `INCREMENT` | +1 até 99 | `map` |
| `DECREMENT` | −1, **mínimo 1** (RN-01) | `map` |
| `REMOVE` | remove a linha | `filter` |
| `CLEAR` | `items: []` | — |

O reducer sempre retorna **um novo objeto** (ou o mesmo estado quando nada muda, evitando renders inúteis). Testes verificam que o estado anterior não é alterado (`Object.freeze`).

`CartContext` expõe: `items: CartLine[]`, `totalQuantity`, `subtotalInCents`, `deliveryFeeInCents`, `totalInCents`, `lastOrder`, `addItem`, `increment`, `decrement`, `removeItem`, `placeOrder`.

## 6. Hooks, efeitos e persistência

| Hook | Responsabilidade |
| --- | --- |
| `useLocalStorage<T>(key, initial, validate?)` | Lê com `try/catch` + validação de formato (RNF-04); grava via `useEffect`. |
| `useCart()` | Lê o `CartContext`; lança erro se usado fora do provider. |
| `useTheme()` | Lê `ThemeContext` (`mode`, `toggleTheme`). |
| `useCepLookup()` | Estado da consulta (`idle`/`loading`/`success`/`invalid`/`not-found`/`error`), cancela requisição anterior com `AbortController`. |

| Chave `localStorage` | Conteúdo |
| --- | --- |
| `coffee-delivery:cart` | `{ items: CartItem[] }` |
| `coffee-delivery:last-order` | `Order` ou `null` |
| `coffee-delivery:theme` | `'light'` ou `'dark'` |

Inicialização *lazy* do `useReducer` (`useReducer(reducer, undefined, init)`) lê o carrinho salvo uma única vez.

## 7. Rotas, formulário e cálculos

**Rotas** (`App.tsx`): `/` Home, `/checkout` Checkout, `/success` Success, `*` → redireciona para `/`. Navegação via `<Link>` e `useNavigate` (RF-07).

**Schema Zod** (`src/schemas/checkout.ts`, RN-07):

| Campo | Regra |
| --- | --- |
| `cep` | obrigatório; 8 dígitos após remover máscara |
| `street`, `neighborhood`, `city` | obrigatórios, *trim*, 2–120 caracteres |
| `number` | obrigatório; até 10 caracteres; aceita "S/N" |
| `complement` | opcional, até 60 caracteres |
| `uf` | uma das 27 UFs, normalizada em maiúsculas |
| `paymentMethod` | `enum(['credit','debit','cash'])` com mensagem "Selecione uma forma de pagamento" |

**Consulta de CEP** (`src/services/viaCep.ts`): `GET https://viacep.com.br/ws/{cep}/json/`.
- `{ erro: true }` → `not-found`; HTTP ≠ 2xx ou falha de rede → `error`; < 8 dígitos → não consulta (erro de formato do Zod).
- Sucesso → `setValue` em `street`, `neighborhood`, `city`, `uf` com `shouldValidate`, e foco vai para `number`. Os campos continuam editáveis para correção.

**Cálculos** (`src/utils/cart.ts`, RN-03/RN-04): `DELIVERY_FEE_IN_CENTS = 350`; `calculateSubtotal`, `calculateDeliveryFee` (0 se vazio), `calculateTotal`, `countUnits`. Formatação em `src/utils/currency.ts` (`formatBRL`).

**Bloqueio de finalização** (RF-11/RN-10): botão desabilitado com carrinho vazio; no submit, o RHF impede envio com erros, foca o primeiro campo inválido e um resumo `role="alert"` anuncia o problema.

## 8. Tema, tokens, breakpoints e acessibilidade

- `src/styles/themes.ts` define `lightTheme` e `darkTheme` com **a mesma forma** (`DefaultTheme` tipado em `styled.d.ts`).
- Tokens semânticos: `background`, `surface`, `surfaceAlt`, `input`, `border`, `title`, `text`, `textMuted`, `brand` (amarelo), `brandStrong`, `accent` (roxo), `accentStrong`, `accentSoft`, `onAccent`, `danger`, `success`, `focus`, `shadow`.
- Escolha: `localStorage` → senão `matchMedia('(prefers-color-scheme: dark)')`. Um script inline no `index.html` aplica a cor de fundo antes do React para evitar *flash*.
- Breakpoints: `sm 480`, `md 768`, `lg 1024`, `xl 1280` (mobile first com `min-width`).
- Grid do catálogo: 1 → 2 (≥ 560) → 3 (≥ 900) → 4 colunas (≥ 1200).
- Checkout: coluna única no celular; duas colunas (formulário | resumo) a partir de 1024 px.
- A11y: `:focus-visible` com contorno de 3 px, `prefers-reduced-motion`, "Pular para o conteúdo", `aria-live` no badge e no status do CEP, `fieldset/legend` em pagamento (radios nativos estilizados), alvos ≥ 40 px.

## 9. Testes e qualidade

| Arquivo | Cobre |
| --- | --- |
| `utils/cart.test.ts`, `utils/currency.test.ts` | RN-03, RN-04, RF-04, RF-10 |
| `reducers/cart.test.ts` | RN-01, RN-02, RF-03, RF-05, imutabilidade |
| `schemas/checkout.test.ts` | RF-08, RF-09, RN-07 |
| `services/viaCep.test.ts` | RF-08 (sucesso, não encontrado, falha, cancelamento) |
| `hooks/useLocalStorage.test.ts` | RF-06, RNF-04 |
| `components/ThemeToggle.test.tsx` | RF-14 |
| `flow.test.tsx` (integração) | RF-01..RF-13 de ponta a ponta com `fetch` simulado |

Execução:

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # Vitest (uma vez)
npm run lint       # oxlint
npm run build      # tsc -b && vite build
```

Validação manual responsiva: DevTools nas larguras 320, 375, 390, 768, 1280 e 1440 px, nos dois temas (evidências em `docs/screenshots/`).
