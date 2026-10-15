import { Page } from '@playwright/test';

export class PaginaInicial {
  constructor(private readonly page: Page) {}

  async abrir(): Promise<void> {
    await this.page.goto('/');
  }

  /** Clica em um dos cards da página inicial (Elements, Forms, Widgets...). */
  async selecionarCard(nome: string): Promise<void> {
    await this.page
      .getByRole('link')
      .filter({ has: this.page.getByRole('heading', { name: nome, exact: true }) })
      .click();
  }
}
