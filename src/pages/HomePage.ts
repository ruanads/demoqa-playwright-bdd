import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  async open(): Promise<void> {
    await this.page.goto('/');
  }

  /** Clica em um dos cards da página inicial (Elements, Forms, Widgets...). */
  async selectCard(name: string): Promise<void> {
    await this.page
      .getByRole('link')
      .filter({ has: this.page.getByRole('heading', { name, exact: true }) })
      .click();
  }
}
