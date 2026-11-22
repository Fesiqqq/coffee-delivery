# PRD_SPEC — Café Lua (Coffee Delivery)

> Product Requirements Document do projeto final da disciplina **Single Page Application (SPA)**.
> Referência visual: [Figma *Coffee Delivery | Projeto Final React*](https://www.figma.com/design/Cm9aS21UxifX9IdLSTRKTE/coffee-delivery?node-id=1-3) (Home `2:1550`, Checkout `217:511`, Confirmação `222:824`, Style Guide).
> Documentos relacionados: [TECH_SPEC](./TECH_SPEC.md) · [TASKS_SPEC](./TASKS_SPEC.md) · [AI_USAGE](./AI_USAGE.md) · [AGENTS](../AGENTS.md)

## 1. Visão geral

**Café Lua** é uma SPA de delivery de cafés. O cliente navega pelo catálogo, escolhe quantidades, monta um carrinho, informa o endereço (com preenchimento automático via CEP), escolhe a forma de pagamento e recebe a confirmação de um **pedido fictício**.

| Item | Descrição |
| --- | --- |
| **Problema** | Pedir café para entrega costuma exigir apps pesados, cadastro e muitos passos. |
| **Proposta** | Fluxo curto, em três telas, que funciona bem no celular e respeita a preferência de tema do usuário. |
| **Público-alvo** | Pessoas que pedem café pelo celular durante o dia (trabalho/estudo) ou à noite; inclui usuários de teclado e leitores de tela. |
| **Objetivos** | (1) concluir um pedido em menos de 1 minuto; (2) zero inconsistência de valores; (3) carrinho que sobrevive a refresh; (4) acessível em WCAG 2.2 AA. |

## 2. Escopo

### 2.1 Dentro do escopo
- Catálogo local tipado de 14 cafés (imagem, nome, descrição, preço, tags).
- Carrinho global com Context API + `useReducer`, persistido em `localStorage`.
- Checkout com React Hook Form + Zod e consulta obrigatória ao **ViaCEP**.
- Seleção de pagamento (crédito, débito, dinheiro) apenas informativa.
- Tela de sucesso baseada em *snapshot* do pedido.
- Tema claro/escuro persistido, com fallback para `prefers-color-scheme`.
- Layout mobile first (320 px → 1440 px).
- Logo original criada com IA, favicon e documentação de marca.

### 2.2 Fora do escopo (exclusões)
- Backend, banco de dados, autenticação, cadastro de usuário.
- Pagamento real, cálculo de frete por distância, cupons de desconto.
- Histórico de pedidos (apenas o último pedido confirmado é mantido).
- Painel administrativo e edição do catálogo.

## 3. Fluxos de usuário

```
Home (/)
 ├─ escolhe quantidade (QuantityInput) ─▶ "Adicionar ao carrinho"
 ├─ badge do Header soma unidades
 └─ clica no carrinho ─▶ Checkout (/checkout)
        ├─ informa CEP ─▶ ViaCEP preenche rua/bairro/cidade/UF
        ├─ digita número e (opcional) complemento
        ├─ escolhe pagamento
        ├─ revisa itens (+ / − / remover) e totais
        └─ "Confirmar pedido" (somente se tudo válido)
              └─ Sucesso (/success) — mostra snapshot; carrinho é esvaziado
```

Fluxos alternativos:
- **Carrinho vazio no checkout** → mensagem de estado vazio + link para o catálogo; botão de confirmar desabilitado.
- **/success sem pedido** → mensagem "Nenhum pedido encontrado" + link para a Home.
- **CEP inválido / não encontrado / API indisponível** → mensagem de erro no campo; campos ficam editáveis para correção manual.

## 4. Requisitos funcionais

| ID | Requisito | Critério de aceite verificável |
| --- | --- | --- |
| RF-01 | Catálogo com imagem, nome, descrição, preço e tags | Home lista os 14 cafés; cada card exibe os 5 elementos; nenhuma imagem quebrada. |
| RF-02 | Selecionar quantidade antes de adicionar | `QuantityInput` inicia em 1, mínimo 1, máximo 99; botões `−`/`+` com `aria-label`. |
| RF-03 | Adicionar e acumular produto repetido | Adicionar 2× "Expresso" com qtd 1 resulta em **uma** linha com qtd 2. |
| RF-04 | Contador de unidades no Header | Badge mostra a **soma das quantidades** (ex.: 2 Expresso + 3 Latte = 5). |
| RF-05 | Aumentar, diminuir e remover itens no carrinho | Totais e badge mudam imediatamente após cada ação. |
| RF-06 | Persistir carrinho em `localStorage` | Após F5, itens e quantidades são restaurados. |
| RF-07 | Navegação com React Router | Rotas `/`, `/checkout`, `/success` sem recarregar a página. |
| RF-08 | Endereço com consulta de CEP | CEP válido preenche rua, bairro, cidade e UF; número/complemento manuais; erros para CEP inválido, não encontrado e falha da API. |
| RF-09 | Forma de pagamento obrigatória | Sem escolha, o formulário exibe erro e não confirma. |
| RF-10 | Subtotal, entrega e total | `total = subtotal + entrega`; exibidos em BRL. |
| RF-11 | Bloquear finalização inválida | Carrinho vazio ou formulário inválido → botão desabilitado/erro anunciado (`role="alert"`). |
| RF-12 | Confirmar e mostrar endereço e pagamento | `/success` mostra endereço completo, pagamento e total do pedido. |
| RF-13 | Limpar carrinho preservando o pedido | Após confirmar, badge = 0 e `/success` continua correto (inclusive após F5). |
| RF-14 | Light/dark mode | Botão no Header; aplica em todas as telas; persiste após F5. |
| RF-15 | Responsividade | Fluxo completo utilizável em 320, 375, 768, 1280 e 1440 px sem rolagem horizontal. |
| RF-16 | Logo original criada com IA | Logo no Header, favicon e seção "Branding com IA" no README. |

## 5. Regras de negócio

| ID | Regra | Decisão adotada |
| --- | --- | --- |
| RN-01 | Quantidades | Adição exige inteiro ≥ 1 (reducer ignora valores inválidos). **No carrinho, o botão `−` fica desabilitado em 1**; a remoção é feita pelo botão "Remover". Limite máximo de 99 unidades por item. |
| RN-02 | Produto único | Reducer usa `find` pelo `coffeeId`; se existir, soma quantidades (respeitando o máximo). |
| RN-03 | Cálculo | `subtotal = Σ(preçoUnitário × qtd)`; `total = subtotal + entrega`. **Taxa de entrega fixa fictícia de R$ 3,50**, definida em uma única constante (`DELIVERY_FEE_IN_CENTS`). Com carrinho vazio, a entrega é R$ 0,00. |
| RN-04 | Valores monetários | Todos os preços em **centavos (inteiros)**; formatação com `Intl.NumberFormat('pt-BR', { currency: 'BRL' })`. |
| RN-05 | Pagamento | Apenas informativo: `credit`, `debit`, `cash`. Nenhuma transação. |
| RN-06 | Persistência | Carrinho em `coffee-delivery:cart`; pedido confirmado em `coffee-delivery:last-order` como **snapshot independente** (cópia dos itens, preços e totais). |
| RN-07 | Endereço | CEP com 8 dígitos (máscara `00000-000`) consultado no ViaCEP; complemento opcional; demais campos obrigatórios; UF com 2 letras de UF brasileira válida. Estados: carregando, sucesso, inválido, não encontrado, indisponível. |
| RN-08 | Dados | Catálogo em `src/data/coffees.ts` tipado; sem backend próprio. |
| RN-09 | Estados vazios | Mensagens para carrinho vazio e para `/success` sem pedido válido. |
| RN-10 | Navegação | Só navega para `/success` após validação completa e carrinho com itens existentes no catálogo. |

## 6. Requisitos não funcionais

| ID | Categoria | Requisito |
| --- | --- | --- |
| RNF-01 | Acessibilidade | WCAG 2.2 AA: contraste ≥ 4.5:1 para texto, foco visível (`:focus-visible`), labels associados, erros com `aria-invalid` + `aria-describedby`, alvos de toque ≥ 24×24 px (preferência 40 px), navegação completa por teclado, link "Pular para o conteúdo". |
| RNF-02 | Responsividade | Mobile first; breakpoints 480/768/1024/1280 px. |
| RNF-03 | Desempenho | Imagens SVG leves; *bundle* inicial < 250 kB gzip; consulta de CEP disparada uma única vez por CEP completo, com cancelamento (`AbortController`). |
| RNF-04 | Persistência | Dados corrompidos no `localStorage` não quebram a aplicação (fallback para o valor inicial). |
| RNF-05 | Compatibilidade | Últimas 2 versões de Chrome, Edge, Firefox e Safari (desktop e mobile). |
| RNF-06 | Qualidade | TypeScript estrito, sem `any`; lint sem erros; testes automatizados de reducer, cálculos, schema e fluxo. |

## 7. Marca, logo e temas

- **Nome:** Café Lua — "do café da manhã ao café da madrugada".
- **Conceito:** xícara vista de lado cujo vapor forma uma **lua crescente**. O amarelo (café/lua) e o roxo (céu noturno) da referência do Figma foram mantidos e ganharam significado.
- **Logo:** gerada com IA (ver [README → Branding com IA](../README.md#branding-com-ia)); versões para fundo claro e escuro; favicon simplificado (somente o símbolo).
- **Tipografia:** Baloo 2 (títulos) e Roboto (textos), como no Style Guide.
- **Temas:** tokens semânticos (`background`, `surface`, `text`, `border`, `brand`, `accent`, `danger`, `focus`…) com valores próprios para claro e escuro; cards, formulários, carrinho e sucesso respeitam o tema.
- **Legibilidade:** símbolo testado a 16 px (favicon) e 32 px (Header mobile).

## 8. Critérios de aceite gerais e decisões de produto

1. O fluxo Home → Checkout → Sucesso funciona no celular (375 px) e no desktop (1440 px), nos dois temas.
2. Nenhum valor monetário é calculado fora de `src/utils/cart.ts`.
3. Nenhum estado global é mutado diretamente (verificado por testes do reducer).
4. A tela de sucesso continua correta após limpar o carrinho e após F5.

**Decisões registradas**

| Decisão | Motivo |
| --- | --- |
| `−` desabilitado em 1 no carrinho (em vez de remover) | Evita remoção acidental em telas de toque; "Remover" é explícito. |
| Frete fixo de R$ 3,50 | Mantém o valor do protótipo; regra simples e centralizada. |
| Entrega R$ 0,00 com carrinho vazio | Evita mostrar total positivo sem produtos. |
| Snapshot do pedido em `localStorage` | Sucesso sobrevive a refresh mesmo com carrinho limpo (RF-13/RN-06). |
| ViaCEP | API pública, gratuita, sem chave, com CORS liberado. |
