import { Page } from '@playwright/test';
import { createBdd, test as base } from 'playwright-bdd';
import { BookStoreApi } from '../api/BookStoreApi';
import { Book, Credentials, UserResponse } from '../api/models';
import { BrowserWindowsPage } from '../pages/BrowserWindowsPage';
import { HomePage } from '../pages/HomePage';
import { PracticeFormPage } from '../pages/PracticeFormPage';
import { ProgressBarPage } from '../pages/ProgressBarPage';
import { SideMenu } from '../pages/components/SideMenu';
import { SortablePage } from '../pages/SortablePage';
import { WebTablesPage } from '../pages/WebTablesPage';
import { StudentData, WebTableRecord } from '../utils/dataFactory';

/** Estado compartilhado entre os steps de um mesmo cenário. */
export type ScenarioContext = {
  credentials?: Credentials;
  userId?: string;
  token?: string;
  availableBooks?: Book[];
  rentedBooks?: Book[];
  userDetails?: UserResponse;
  student?: StudentData;
  record?: WebTableRecord;
  records?: WebTableRecord[];
  progressValue?: number;
  newWindow?: Page;
};

type Fixtures = {
  ctx: ScenarioContext;
  bookStoreApi: BookStoreApi;
  homePage: HomePage;
  sideMenu: SideMenu;
  practiceFormPage: PracticeFormPage;
  browserWindowsPage: BrowserWindowsPage;
  webTablesPage: WebTablesPage;
  progressBarPage: ProgressBarPage;
  sortablePage: SortablePage;
};

export const test = base.extend<Fixtures>({
  // O demoqa carrega muitos anúncios de terceiros que deixam a página lenta e cobrem
  // elementos. Bloqueamos tudo que não for do próprio domínio (vale também para popups).
  context: async ({ context }, use) => {
    await context.route('**/*', (route) => {
      const { hostname } = new URL(route.request().url());
      return hostname.endsWith('demoqa.com') ? route.continue() : route.abort();
    });
    await use(context);
  },
  ctx: async ({}, use) => use({}),
  bookStoreApi: async ({ request }, use) => use(new BookStoreApi(request)),
  homePage: async ({ page }, use) => use(new HomePage(page)),
  sideMenu: async ({ page }, use) => use(new SideMenu(page)),
  practiceFormPage: async ({ page }, use) => use(new PracticeFormPage(page)),
  browserWindowsPage: async ({ page }, use) => use(new BrowserWindowsPage(page)),
  webTablesPage: async ({ page }, use) => use(new WebTablesPage(page)),
  progressBarPage: async ({ page }, use) => use(new ProgressBarPage(page)),
  sortablePage: async ({ page }, use) => use(new SortablePage(page)),
});

export const { Given, When, Then, After } = createBdd(test);
