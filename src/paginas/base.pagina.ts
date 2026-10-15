import { Page } from '@playwright/test';

export abstract class PaginaBase {
  constructor(protected readonly page: Page) {}
}
