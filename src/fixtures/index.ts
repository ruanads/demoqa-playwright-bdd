import { faker } from '@faker-js/faker';
import { createBdd, test as base } from 'playwright-bdd';
import { ClienteBookStore } from '@api/clientes/book-store.cliente';
import { ambiente } from '@config/ambiente';
import { PaginaBrowserWindows } from '@paginas/alerts-frame-windows/browser-windows.pagina';
import { MenuLateral } from '@paginas/components/menu-lateral.component';
import { PaginaWebTables } from '@paginas/elements/web-tables.pagina';
import { PaginaPracticeForm } from '@paginas/forms/practice-form.pagina';
import { PaginaInicial } from '@paginas/inicial.pagina';
import { PaginaSortable } from '@paginas/interactions/sortable.pagina';
import { PaginaProgressBar } from '@paginas/widgets/progress-bar.pagina';
import {
  Contexto,
  DadosBookStore,
  DadosBrowserWindows,
  DadosPracticeForm,
  DadosProgressBar,
  DadosWebTables,
} from './contexto';

type Fixtures = {
  sementeFaker: number;
  contextoBookStore: Contexto<DadosBookStore>;
  contextoPracticeForm: Contexto<DadosPracticeForm>;
  contextoBrowserWindows: Contexto<DadosBrowserWindows>;
  contextoWebTables: Contexto<DadosWebTables>;
  contextoProgressBar: Contexto<DadosProgressBar>;
  clienteBookStore: ClienteBookStore;
  paginaInicial: PaginaInicial;
  menuLateral: MenuLateral;
  paginaPracticeForm: PaginaPracticeForm;
  paginaBrowserWindows: PaginaBrowserWindows;
  paginaWebTables: PaginaWebTables;
  paginaProgressBar: PaginaProgressBar;
  paginaSortable: PaginaSortable;
};

const dominioDoSite = new URL(ambiente.urlBase).hostname;

export const test = base.extend<Fixtures>({
  // Fixa a semente do faker em cada teste e a registra no relatório. Para reproduzir
  // uma falha com os mesmos dados: FAKER_SEED=<semente do relatório> npm test
  sementeFaker: [
    async ({}, use, testInfo) => {
      const semente = Number(process.env.FAKER_SEED) || Math.floor(Math.random() * 1_000_000_000);
      faker.seed(semente);
      testInfo.annotations.push({ type: 'faker-seed', description: String(semente) });
      await use(semente);
    },
    { auto: true },
  ],
  // O demoqa carrega muitos anúncios de terceiros que deixam a página lenta e cobrem
  // elementos. Bloqueamos tudo que não for do próprio domínio (vale também para popups).
  context: async ({ context }, use) => {
    await context.route('**/*', (rota) => {
      const { hostname } = new URL(rota.request().url());
      // Aceita só o domínio exato ou subdomínios dele (evita liberar, por exemplo, "maliciosodemoqa.com").
      const ehDoSite = hostname === dominioDoSite || hostname.endsWith(`.${dominioDoSite}`);
      return ehDoSite ? rota.continue() : rota.abort();
    });
    await use(context);
  },
  contextoBookStore: async ({}, use) => use(new Contexto()),
  contextoPracticeForm: async ({}, use) => use(new Contexto()),
  contextoBrowserWindows: async ({}, use) => use(new Contexto()),
  contextoWebTables: async ({}, use) => use(new Contexto()),
  contextoProgressBar: async ({}, use) => use(new Contexto()),
  clienteBookStore: async ({ request }, use) => use(new ClienteBookStore(request)),
  paginaInicial: async ({ page }, use) => use(new PaginaInicial(page)),
  menuLateral: async ({ page }, use) => use(new MenuLateral(page)),
  paginaPracticeForm: async ({ page }, use) => use(new PaginaPracticeForm(page)),
  paginaBrowserWindows: async ({ page }, use) => use(new PaginaBrowserWindows(page)),
  paginaWebTables: async ({ page }, use) => use(new PaginaWebTables(page)),
  paginaProgressBar: async ({ page }, use) => use(new PaginaProgressBar(page)),
  paginaSortable: async ({ page }, use) => use(new PaginaSortable(page)),
});

// Given/When/Then são mantidos em inglês para que a extensão do Cucumber no VS Code
// reconheça os steps. Nas features eles aparecem como Dado/Quando/Então.
export const { Given, When, Then, Before, After } = createBdd(test);
