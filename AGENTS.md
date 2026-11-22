# AGENTS.md — Diretrizes para assistentes de IA

## Contexto
Projeto final da disciplina **Single Page Application**: **Café Lua**, uma adaptação do desafio *Coffee Delivery* (catálogo → carrinho → checkout → confirmação de pedido fictício). Referência visual: [Figma *Coffee Delivery | Projeto Final React*](https://www.figma.com/design/Cm9aS21UxifX9IdLSTRKTE/coffee-delivery?node-id=1-3) (Home `2:1550`, Checkout `217:511`, Confirmação `222:824`, Style Guide com Baloo 2/Roboto, amarelo e roxo).

## Leia antes de escrever código
1. [`docs/PRD_SPEC.md`](docs/PRD_SPEC.md) — requisitos RF-01..RF-16, regras RN-01..RN-10.
2. [`docs/TECH_SPEC.md`](docs/TECH_SPEC.md) — arquitetura, tipos, reducer, schema, tokens.
3. [`docs/TASKS_SPEC.md`](docs/TASKS_SPEC.md) — próxima tarefa pendente.

Se um pedido contradizer os SPEC, aponte a contradição e proponha atualizar o SPEC **antes** do código.

## Stack
React 19 · Vite · TypeScript estrito · React Router 7 · Context API + `useReducer` · React Hook Form + Zod · styled-components · Phosphor Icons · Vitest + Testing Library · ViaCEP.

## Regras de atuação
- Trabalhe **uma tarefa do TASKS_SPEC por vez**; não gere a aplicação inteira de uma só vez.
- Antes de codar, descreva o plano, os arquivos afetados e o teste que comprovará a tarefa.
- Explique as decisões (por que reducer, por que centavos, por que snapshot) — o aluno precisa saber defender o código.
- Ao final de cada tarefa: rodar `npm test`, `npm run lint` e `npm run build`; marcar a tarefa no TASKS_SPEC; sugerir o commit.

## Boas práticas obrigatórias
- Sem `any`; tipos em `src/types`. Sem `// @ts-ignore`.
- Estado global **imutável**: use `map`, `filter`, `find`, `reduce` e spread. Nunca `push`, `splice` ou atribuição direta no estado.
- Valores monetários **sempre em centavos**; formatação só em `formatBRL`.
- Cálculos só em `src/utils/cart.ts`; validações só em `src/schemas/`; I/O só em `src/services/` e hooks.
- Cores apenas via tokens do tema (`theme.colors.*`) — nada de cor *hardcoded* em componentes.
- Acessibilidade: labels associados, `aria-invalid`/`aria-describedby` em erros, foco visível, alvos ≥ 40 px.
- Mobile first (`min-width`).

## Limites de escopo
Não adicionar backend, login, pagamento real, frete por distância, cupons, bibliotecas de UI (MUI, Chakra) ou de estado (Redux, Zustand) sem atualizar o PRD/TECH e justificar.

## Commits
Conventional Commits em inglês, no imperativo: `feat:`, `fix:`, `docs:`, `test:`, `refactor:`, `style:`, `chore:`. Um commit por tarefa (ou menor).

## Testes
- Lógica pura (reducer, utils, schema, serviço) → testes de unidade.
- Fluxo de compra → teste de integração em `src/tests/flow.test.tsx` com `fetch` simulado.
- Nunca chamar a API real nos testes.
