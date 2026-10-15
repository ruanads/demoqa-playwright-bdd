# Desafio QA Automation — DemoQA

Automação do desafio de QA (API + Frontend) do site [demoqa.com](https://demoqa.com) usando **Playwright + TypeScript** com **BDD (Gherkin/Cucumber)** via [playwright-bdd](https://github.com/vitalets/playwright-bdd).

## Stack

| Item | Uso |
|---|---|
| `@playwright/test` | Runner, automação de browser e cliente HTTP para a API |
| `playwright-bdd` | Features em Gherkin (pt-BR) convertidas em testes Playwright |
| `@faker-js/faker` | Massa de dados aleatória |
| TypeScript | Tipagem dos modelos da API, Page Objects e steps |

## Estrutura

O projeto separa **o que é testado** (`testes/`) de **como é testado** (`src/`):

```
testes/                                       # Cenários: cada feature fica junto dos seus steps
  api/
    book-store/                               # Parte 1 — API
      book-store.feature
      book-store.steps.ts
  ui/                                         # Parte 2 — Frontend (pastas seguem o menu do DemoQA)
    shared/navegacao.steps.ts                 # Steps reutilizados (página inicial → card → submenu)
    elements/web-tables/
    forms/practice-form/
    alerts-frame-windows/browser-windows/
    widgets/progress-bar/
    interactions/sortable/
src/                                          # Framework de automação
  api/
    clientes/book-store.cliente.ts            # Cliente HTTP da Book Store
    modelos/book-store.modelos.ts             # Tipos de request/response
  paginas/                                    # Page Objects, organizados como os testes
    inicial.pagina.ts
    components/menu-lateral.component.ts
    elements/ forms/ widgets/ ...
  fixtures/
    index.ts                                  # Entrega Page Objects, cliente da API e contextos aos steps
    contexto.ts                               # Estado compartilhado entre os steps (um contexto por funcionalidade)
  data/
    factories/                                # Geração de massa com faker (usuário, aluno, registro)
    constants/                                # Opções fixas do DemoQA (estados, matérias...)
    files/upload.txt                          # Arquivo usado no upload do Practice Form
  config/ambiente.ts                          # URL do ambiente (BASE_URL)
```

Os imports usam **atalhos** (`@paginas/*`, `@api/*`, `@data/*`, `@config/*`, `@fixtures`) definidos no `tsconfig.json`, sem caminhos relativos como `../../../`.

### Convenção de nomes

O projeto é escrito em português, com três exceções:

1. **Nomes das telas e seções do DemoQA** ficam como aparecem no site e no enunciado (Practice Form, Web Tables, Book Store, Elements, Forms...), inclusive nas pastas de categoria, para facilitar encontrar a tela correspondente.
2. **Termos técnicos sem tradução natural ou exigidos pelas ferramentas**: `src`, `fixtures`, `data`, `factories`, `constants`, `components`, `shared`, `.feature`, `.steps.ts`, `Given/When/Then` no código (a extensão do Cucumber no VS Code depende desses nomes; nas features eles aparecem como `Dado/Quando/Então`).
3. **Contratos externos**: API do Playwright e campos JSON da API (`userName`, `isbn`...).

## Como executar

Pré-requisito: Node.js 22+ (versão fixada em `.nvmrc`).

```bash
npm install
npx playwright install chromium

npm test                 # suíte do desafio (API + UI)
npm run test:api         # apenas a Parte 1
npm run test:ui          # apenas a Parte 2
npm run test:headed      # UI com o browser visível
npm run test:bugs        # cenários dos bugs conhecidos do DemoQA (ver abaixo)
npm run report           # abre o relatório HTML do Playwright
npm run report:cucumber  # abre o relatório em Gherkin (formato Cucumber)
npm run typecheck        # checagem de tipos do TypeScript
npm run lint             # ESLint (inclui regras do Playwright, como await esquecido)
```

Filtrar por tag: `npx bddgen && npx playwright test --grep @webtables`.

Tudo que a execução gera fica em `relatorios/`:
- `relatorios/cucumber/index.html` — relatório em Gherkin: funcionalidades, cenários e cada passo (`Dado/Quando/Então`) com status e tempo
- `relatorios/playwright/` — relatório HTML do Playwright, também com os passos em Gherkin, além de trace, screenshot e vídeo das falhas
- `relatorios/resultados/` — arquivos brutos de trace, screenshots e vídeos
- `relatorios/bugs/` — os mesmos relatórios, para a execução de `npm run test:bugs`

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

Os bugs abaixo estão documentados como cenários `@bug @fail`, que validam o comportamento **correto**. Eles ficam fora da suíte principal e rodam com `npm run test:bugs` (no CI, em uma etapa separada), com relatórios próprios em `relatorios/bugs/`. Assim os relatórios da suíte do desafio mostram só o que foi pedido.

A tag especial `@fail` do playwright-bdd marca uma falha esperada: a execução fica verde enquanto o bug existir e passa a falhar quando o site for corrigido, avisando que o cenário pode voltar para a suíte principal. O relatório Cucumber de bugs mostra esses cenários em vermelho, que é o esperado: ele lista os bugs ainda presentes.

1. **Practice Form — botão "Close" não fecha o popup.** O clique chega ao botão, mas o modal continua aberto. No fluxo principal o popup é fechado com `ESC`.
2. **Web Tables — deletar um registro remove todos os registros adicionados.** Por isso o passo "deletar todos" só remove os registros que ainda estiverem na tabela.

## Decisões técnicas

- **Feature e steps lado a lado**, agrupados por assunto, como recomenda a documentação do playwright-bdd. Steps compartilhados ficam em `testes/ui/shared`.
- **Ambiente configurável**: `BASE_URL=https://outro-ambiente npm test`.
- **Page Object Model** no formato da documentação do Playwright (o construtor recebe o `page` e cria os locators), entregues aos steps pelas fixtures. Page Objects só executam ações e esperas de sincronização; **todas as validações (`expect`) ficam nos steps**.
- **Contexto por funcionalidade** (`contextoWebTables`, `contextoBookStore`...): os steps compartilham estado com `definir()` / `obter()`, cada funcionalidade só enxerga as próprias chaves, de forma tipada e sem variáveis globais (seguro para execução em paralelo). Se um step tentar ler algo que ainda não foi definido, o erro diz exatamente o quê.
- **Progress Bar determinística**: o cenário usa o relógio falso do Playwright (`page.clock`). O tempo só avança quando o teste manda, então o resultado não depende da velocidade da máquina.
- **Dados reproduzíveis**: cada teste registra a semente do faker no relatório (anotação `faker-seed`). Para repetir uma falha com os mesmos dados: `FAKER_SEED=<semente> npm test`.
- **Bloqueio de anúncios**: requisições para fora do domínio do site são abortadas, porque os anúncios deixam o site lento e cobrem elementos.
- **Web Tables**: as linhas são localizadas pelo e-mail usando a busca da tabela, para não depender da paginação.
- **Asserções que esperam a tela** (`await expect(locator).toHaveText(...)`) em vez de ler um valor e comparar, para o teste não depender do tempo de renderização. Na Web Tables, a pesquisa só retorna depois que a tabela terminou de filtrar.
- **CI**: roda typecheck e lint antes dos testes. Teste que só passa na segunda tentativa faz o CI falhar (`failOnFlakyTests`), para instabilidade não passar despercebida.
- **Datepicker**: a data é selecionada pelo calendário (mês/ano/dia) em vez de digitada.
- **Selects de Estado/Cidade** localizados pelo container (`#state input`), e não pelos ids gerados pelo react-select, que mudam conforme a ordem dos componentes.
