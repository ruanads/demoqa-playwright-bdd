# Desafio QA Automation — DemoQA

Automação do desafio de QA (API + Frontend) do site [demoqa.com](https://demoqa.com) usando **Playwright + TypeScript** com **BDD (Gherkin/Cucumber)** via [playwright-bdd](https://github.com/vitalets/playwright-bdd).

> O desafio sugere Selenium/Cypress. Optei por Playwright + TypeScript por ser minha stack principal. O playwright-bdd permite escrever os cenários em Gherkin (Cucumber) e executá-los no runner nativo do Playwright, mantendo paralelismo, traces, vídeos e relatórios.

## Stack

| Item | Uso |
|---|---|
| `@playwright/test` | Runner, automação de browser e cliente HTTP para a API |
| `playwright-bdd` | Features em Gherkin (pt-BR) convertidas em testes Playwright |
| `@faker-js/faker` | Massa de dados aleatória |
| TypeScript | Tipagem dos modelos da API, Page Objects e steps |

## Estrutura

```
features/
  api/bookStore.feature          # Parte 1 — API
  ui/*.feature                   # Parte 2 — Frontend
src/
  api/                           # Client da API (BookStoreApi) e modelos tipados
  pages/                         # Page Objects (+ components/SideMenu)
  steps/api, steps/ui            # Step definitions
  fixtures/fixtures.ts           # Fixtures: Page Objects, client da API e contexto do cenário
  utils/dataFactory.ts           # Geração de dados com faker
test-data/files/upload.txt       # Arquivo usado no upload do Practice Form
```

## Como executar

Pré-requisito: Node.js 20+.

```bash
npm install
npx playwright install chromium

npm test              # tudo (API + UI)
npm run test:api      # apenas a Parte 1
npm run test:ui       # apenas a Parte 2
npm run test:headed   # UI com o browser visível
npm run report        # abre o relatório HTML do Playwright
```

Filtrar por tag: `npx bddgen && npx playwright test --grep @webtables`.

Relatórios gerados:
- `playwright-report/` — relatório do Playwright (com trace, screenshot e vídeo das falhas)
- `cucumber-report/index.html` — relatório no formato Cucumber

## Cobertura

### Parte 1 — API (`@api`)
Um único cenário executa o fluxo completo e contínuo:
criar usuário → gerar token → validar autorização → listar livros → alugar 2 livros aleatórios → consultar o usuário e validar os livros alugados.
Ao final, um hook `After` remove o usuário criado.

### Parte 2 — Frontend (`@ui`)
| Feature | Tag | O que valida |
|---|---|---|
| Practice Form | `@forms` | Preenche todo o formulário com dados aleatórios (incluindo upload do `.txt`), submete, valida **todos** os dados exibidos no popup e o fecha |
| Browser Windows | `@windows` | Abre nova janela, valida "This is a sample page" e a fecha |
| Web Tables | `@webtables` | Cria, edita e deleta um registro |
| Web Tables (bônus) | `@bonus` | Cria 12 registros dinamicamente (`Esquema do Cenário`) e deleta todos |
| Progress Bar | `@progressbar` | Para antes dos 25%, valida o valor ≤ 25%, completa até 100% e reseta |
| Sortable | `@sortable` | A lista já começa ordenada, então ela é **embaralhada** via drag and drop e depois ordenada em ordem crescente (pelo valor numérico) |

Todos os cenários navegam a partir da página inicial (card → submenu), como pede o desafio.

## Bugs encontrados no DemoQA

Os bugs abaixo estão documentados como cenários `@bug @fail`. A tag especial `@fail` do playwright-bdd marca uma falha esperada: o teste fica verde enquanto o bug existir e passa a falhar quando o site for corrigido.

1. **Practice Form — botão "Close" não fecha o popup.** O clique chega ao botão, mas o modal continua aberto. No fluxo principal o popup é fechado com `ESC`.
2. **Web Tables — deletar um registro remove todos os registros adicionados.** Por isso o passo "deletar todos" só remove os registros que ainda estiverem na tabela.

## Decisões técnicas

- **Page Object Model**, com Page Objects injetados via fixtures do Playwright, sem instanciação manual nos steps.
- **Contexto por cenário** (`ctx` fixture) para compartilhar estado entre steps sem variáveis globais, o que mantém a execução em paralelo segura.
- **Bloqueio de anúncios**: requisições para fora de `demoqa.com` são abortadas, porque os anúncios deixam o site lento e cobrem elementos.
- **Web Tables**: as linhas são localizadas pelo e-mail usando a busca da tabela, para não depender da paginação.
- **Datepicker**: a data é selecionada pelo calendário (mês/ano/dia) em vez de digitada.
