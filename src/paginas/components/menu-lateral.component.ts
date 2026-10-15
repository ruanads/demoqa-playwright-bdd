import { Page } from '@playwright/test';

export class MenuLateral {
  constructor(private readonly page: Page) {}

  /** Clica em um submenu visível do menu lateral e aguarda a página carregar. */
  async clicarItem(nome: string): Promise<void> {
    await this.page.locator('.menu-list').getByRole('link', { name: nome, exact: true }).click();
    await this.page.getByRole('heading', { level: 1, name: nome, exact: true }).waitFor();
  }
}
