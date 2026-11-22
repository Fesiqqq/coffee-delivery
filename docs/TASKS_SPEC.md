# TASKS_SPEC — Plano de implementação

> Tarefas pequenas, em ordem de execução. Cada uma termina com teste registrado e commit semântico.
> Status: `[x]` concluída · `[ ]` pendente · `[~]` em andamento.

| ID | Status | Objetivo | Requisitos | Arquivos afetados | Critério de pronto | Teste realizado | Commit |
| --- | --- | --- | --- | --- | --- | --- | --- |
| T-01 | [x] | Criar projeto Vite React + TS, Git e dependências | RF-07 | `package.json`, `vite.config.ts`, `tsconfig*.json` | `npm run dev` abre a página; `npm test` roda | `npm run build` OK | `chore: scaffold vite react-ts project` |
| T-02 | [x] | Escrever PRD, TECH, TASKS e AGENTS | todos | `docs/*.md`, `AGENTS.md` | Documentos revisados e versionados | Revisão manual contra o enunciado | `docs: add PRD, TECH and TASKS specs and AGENTS guide` |
| T-03 | [x] | Identidade visual com IA (logo, símbolo, favicon) | RF-16 | `src/assets/logo-*.svg`, `public/favicon.svg`, `README.md` | Logo legível em 16 px e 32 px nos 2 temas | Inspeção visual nos temas | `feat: add AI-assisted Café Lua brand assets` |
| T-04 | [x] | Tokens de tema, estilos globais e tipagem do tema | RF-14, RF-15 | `src/styles/*` | Temas com mesma forma; contraste AA | Revisão de contraste | `style: add theme tokens and global styles` |
| T-05 | [x] | Tipos e catálogo tipado + ilustrações | RF-01, RN-08 | `src/types`, `src/data/coffees.ts`, `scripts/generate-coffee-art.mjs` | 14 cafés com preço em centavos | `tsc` sem erros | `feat: add typed coffee catalog` |
| T-06 | [x] | Utilitários de moeda e cálculo | RN-03, RN-04 | `src/utils/*` | Cálculos em centavos, formatação BRL | `utils/*.test.ts` | `feat: add cart math and BRL formatting` |
| T-07 | [x] | Reducer e ações do carrinho | RN-01, RN-02, RF-03, RF-05 | `src/reducers/cart/*` | Sem mutação; regras de qtd | `reducers/cart.test.ts` | `feat: add immutable cart reducer` |
| T-08 | [x] | `useLocalStorage`, CartProvider e ThemeProvider | RF-06, RF-13, RF-14 | `src/hooks/*`, `src/contexts/*` | Carrinho e tema persistem após F5 | `useLocalStorage.test.ts` + F5 manual | `feat: add cart and theme providers with persistence` |
| T-09 | [x] | Layout, Header, Logo, ThemeToggle, CartBadge | RF-04, RF-14, RF-16 | `src/components/*` | Badge soma unidades; toggle acessível | `ThemeToggle.test.tsx` | `feat: add header with cart badge and theme toggle` |
| T-10 | [x] | Home: Hero, catálogo, CoffeeCard, QuantityInput | RF-01, RF-02, RF-03 | `src/pages/Home`, componentes | Adicionar acumula sem duplicar | Fluxo manual + `flow.test.tsx` | `feat: build home with catalog and quantity input` |
| T-11 | [x] | Serviço ViaCEP + `useCepLookup` | RF-08, RN-07 | `src/services/viaCep.ts`, `src/hooks/useCepLookup.ts` | Estados loading/sucesso/erros | `services/viaCep.test.ts` | `feat: add ViaCEP lookup service` |
| T-12 | [x] | Schema Zod do checkout | RF-08, RF-09, RN-07 | `src/schemas/checkout.ts` | Mensagens em PT-BR | `schemas/checkout.test.ts` | `feat: add checkout zod schema` |
| T-13 | [x] | Checkout: endereço, pagamento, itens e resumo | RF-05, RF-08..RF-11 | `src/pages/Checkout`, componentes | Botão bloqueado se inválido/vazio | `flow.test.tsx` | `feat: build checkout page` |
| T-14 | [x] | Sucesso com snapshot e limpeza do carrinho | RF-12, RF-13, RN-06, RN-09 | `src/pages/Success`, `CartProvider` | Sucesso correto após F5 | `flow.test.tsx` + F5 manual | `feat: add order success page with snapshot` |
| T-15 | [x] | Dark mode completo e responsividade | RF-14, RF-15 | estilos dos componentes | Sem rolagem horizontal em 320 px | Verificação em 320/375/768/1280/1440 | `style: refine dark mode and responsive layout` |
| T-16 | [x] | Acessibilidade (foco, labels, erros, skip link) | RNF-01 | componentes | Fluxo completo só com teclado | Navegação por teclado manual | `fix: improve accessibility of forms and controls` |
| T-17 | [x] | README, AI_USAGE e screenshots | — | `README.md`, `docs/AI_USAGE.md`, `docs/screenshots/` | Seções exigidas presentes | Revisão do checklist final | `docs: add README, AI usage log and screenshots` |
| T-18 | [ ] | Publicar no GitHub e na Vercel/Netlify | — | — | Link público funcionando | Fluxo completo na URL publicada | — |
| T-19 | [ ] | Ensaio da apresentação | — | — | Saber explicar reducer, Context, Zod e persistência | — | — |

## Checklist final do enunciado (seção 10)

- [x] O projeto inicia e compila sem erros.
- [x] Catálogo mostra imagem, nome, descrição, preço e quantidade.
- [x] É possível adicionar o mesmo café sem duplicar linhas do carrinho.
- [x] O badge do Header soma todas as unidades.
- [x] Incrementar, decrementar e remover itens atualiza os valores.
- [x] O carrinho persiste após refresh e exibe estado vazio adequado.
- [x] Formulário consulta o ViaCEP e preenche rua, bairro, cidade e UF; trata erros; número manual e complemento opcional.
- [x] Forma de pagamento é obrigatória e não executa pagamento real.
- [x] Subtotal, entrega e total são calculados e formatados corretamente.
- [x] Não é possível confirmar pedido inválido ou carrinho vazio.
- [x] Página de sucesso mostra dados corretos do pedido confirmado.
- [x] A logo criada com IA está presente, nítida e documentada.
- [x] Light/dark mode funciona em todas as telas e persiste.
- [x] Home, Checkout e Sucesso funcionam em desktop, tablet e celular.
- [x] Existem componentes reutilizáveis, tipos, Hooks e reducer sem mutações indevidas.
- [ ] PRD_SPEC, TECH_SPEC, TASKS_SPEC, AGENTS e README estão no GitHub. *(depende de T-18)*
- [x] O uso de IA foi documentado com pelo menos três evidências.
- [ ] Testes, evidências visuais e link de publicação estão disponíveis. *(link depende de T-18)*
