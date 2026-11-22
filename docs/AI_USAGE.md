# AI_USAGE — Registro do uso de IA no desenvolvimento

**Assistente:** Claude (modelo Claude Opus 5.5, Anthropic) usado pelo **Claude Code** (app desktop), com acesso ao terminal, aos arquivos do projeto e a um navegador embutido para testar a aplicação.
**Regras dadas ao assistente:** [`AGENTS.md`](../AGENTS.md).

> ⚠️ **Para o aluno:** as interações abaixo descrevem o que aconteceu na sessão com a IA. Antes de entregar, revise cada linha, complete a coluna "Minha avaliação" com as suas palavras e acrescente as suas próprias interações (dúvidas sobre Context API, reducer, Zod etc.). O professor avalia **como você usou a IA**, não apenas o resultado.

## Interações relevantes

| # | Objetivo | Prompt (resumo) | Resposta resumida da IA | Decisão tomada | Evidência | Minha avaliação |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Planejar antes de codar | Enunciado completo do Projeto Final 05 + imagem do Style Guide do Figma (cores, tipografia, componentes Button/Cart/Select/Input). | Extraiu RF-01..16 e RN-01..10, propôs decisões de produto (frete fixo R$ 3,50, `−` travado em 1 no carrinho, snapshot do pedido em `localStorage`, ViaCEP) e escreveu PRD, TECH, TASKS e AGENTS **antes** do código. | Manter frete fixo e regra de quantidade mínima 1; registrar no PRD. | Commit `docs: add PRD, TECH and TASKS specs and AGENTS guide`; [`PRD_SPEC.md`](./PRD_SPEC.md) seção 8. | _(preencher)_ |
| 2 | Criar a identidade visual | "Crie uma marca original para uma cafeteria delivery que funcione em tema claro e escuro, mantendo amarelo/roxo e Baloo 2/Roboto do Figma." | Propôs o nome **Café Lua** (café do dia à noite → combina com light/dark), símbolo de xícara cujo vapor vira lua crescente, e gerou o desenho como **código SVG** (script `scripts/generate-brand.mjs`) com variações clara, escura e favicon. | Usar SVG em vez de imagem raster: nítido em 16 px e 1440 px, leve e sem dúvidas de direito de uso de fotos. | [`README` → Branding com IA](../README.md#branding-com-ia); `src/assets/brand/`. | _(preencher)_ |
| 3 | Modelar o estado global | Implementar o carrinho com Context API + `useReducer` seguindo o TECH_SPEC. | Separou `actions.ts`/`reducer.ts`; carrinho guarda só `{ coffeeId, quantity }` e preços vêm do catálogo; totais são **derivados** com `useMemo`; reducer devolve o mesmo objeto quando nada muda. | Aceito. Pedi testes que congelam o estado (`Object.freeze`) para provar imutabilidade. | `src/reducers/cart/`, `src/tests/cart.reducer.test.ts`. | _(preencher)_ |
| 4 | Depurar teste de integração | Rodar `npm test` após escrever o fluxo de compra. | A própria IA tinha calculado errado o total esperado no teste (R$ 40,70); o teste falhou e ela corrigiu para **R$ 41,20** (2×11,90 + 13,90 + 3,50). | Manter o valor correto; reforça por que cálculo em centavos + testes importam. | Histórico do arquivo `src/tests/flow.test.tsx`. | _(preencher)_ |
| 5 | Validar responsividade de verdade | Criar um script que percorra o fluxo no navegador e verifique rolagem horizontal em 320–1440 px. | Criou `scripts/screenshots.mjs` (Playwright + Edge instalado, ViaCEP simulado). O script **encontrou um bug**: em 1280 px o rodapé dos cards estourava 24 px. A IA compactou os controles e reduziu o espaçamento do grid. | Aceito; o script fica no projeto como regressão visual. | Commits `fix: prevent coffee card footer overflow at 1280px` e `test: add browser flow script…`; `docs/screenshots/`. | _(preencher)_ |
| 6 | Desempenho | Build de produção avisou bundle > 500 kB. | Sugeriu `React.lazy` nas rotas `/checkout` e `/success` (React Hook Form + Zod só carregam no checkout). Bundle inicial caiu de 158 kB para 110 kB gzip. | Aceito; `Suspense` fica no `PageLayout` para o Header não sumir. | Commit `refactor: lazy-load checkout and success routes`. | _(preencher)_ |

## O que **não** foi aceito / pontos de atenção

- A IA não colocou chatbot na aplicação (não é exigido).
- Fotos do Figma não foram reutilizadas: as ilustrações dos cafés são SVG gerados por script próprio (`scripts/generate-coffee-art.mjs`).
- A consulta real ao ViaCEP **nunca** é feita nos testes automatizados (regra do `AGENTS.md`); foi validada manualmente no navegador com o CEP 01310-100.

## Perguntas para estudar antes da apresentação

1. Por que o carrinho guarda só `coffeeId` e `quantity`, e não o objeto `Coffee` inteiro?
2. O que acontece se o `cartReducer` usar `state.items.push(...)`? Por que o React não re-renderiza?
3. Por que o pedido confirmado é um *snapshot* e não uma referência ao carrinho?
4. Como o `zodResolver` conecta o schema ao React Hook Form? Qual a diferença entre `z.input` e `z.output`?
5. Por que o `useCepLookup` usa `AbortController`?
