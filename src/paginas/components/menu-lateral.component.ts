import { expect } from '@playwright/test';
import { PaginaBase } from '@paginas/base.pagina';

export class MenuLateral extends PaginaBase {
  /** Clica em um submenu visível do menu lateral e aguarda a página carregar. */
  async clicarItem(nome: string): Promise<void> {
    await this.page.locator('.menu-list').getByRole('link', { name: nome, exact: true }).click();
    await expect(this.page.getByRole('heading', { level: 1 })).toHaveText(nome);
  }
}
