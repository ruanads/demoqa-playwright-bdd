import { expect } from '@playwright/test';
import { BasePage } from '../BasePage';

export class SideMenu extends BasePage {
  /** Clica em um submenu visível do menu lateral e aguarda a página carregar. */
  async clickItem(name: string): Promise<void> {
    await this.page.locator('.menu-list').getByRole('link', { name, exact: true }).click();
    await expect(this.page.getByRole('heading', { level: 1 })).toHaveText(name);
  }
}
