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
import { ContextoCenario } from './contexto-cenario';

type Fixtures = {
  contexto: ContextoCenario;
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
  // O demoqa carrega muitos anúncios de terceiros que deixam a página lenta e cobrem
  // elementos. Bloqueamos tudo que não for do próprio domínio (vale também para popups).
  context: async ({ context }, use) => {
    await context.route('**/*', (rota) => {
      const { hostname } = new URL(rota.request().url());
      return hostname.endsWith(dominioDoSite) ? rota.continue() : rota.abort();
    });
    await use(context);
  },
  contexto: async ({}, use) => use({}),
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
export const { Given, When, Then, After } = createBdd(test);
