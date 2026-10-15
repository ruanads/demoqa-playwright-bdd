import { expect, Locator } from '@playwright/test';
import { WebTableRecord } from '../utils/dataFactory';
import { BasePage } from './BasePage';

export class WebTablesPage extends BasePage {
  private readonly addButton = this.page.locator('#addNewRecordButton');
  private readonly searchBox = this.page.locator('#searchBox');
  private readonly modal = this.page.locator('.modal-content');
  private readonly rows = this.page.locator('table tbody tr');

  async create(record: WebTableRecord): Promise<void> {
    await this.addButton.click();
    await this.fillForm(record);
  }

  async edit(currentEmail: string, updated: WebTableRecord): Promise<void> {
    await this.rowByEmail(currentEmail).locator('[title="Edit"]').click();
    await this.fillForm(updated);
  }

  async delete(email: string): Promise<void> {
    await this.rowByEmail(email).locator('[title="Delete"]').click();
    await this.clearSearch();
  }

  /**
   * Filtra a tabela pelo e-mail antes de buscar a linha, evitando
   * problemas com a paginação quando existem muitos registros.
   */
  rowByEmail(email: string): Locator {
    return this.rows.filter({ has: this.page.getByRole('cell', { name: email, exact: true }) });
  }

  async isDisplayed(email: string): Promise<boolean> {
    await this.search(email);
    const displayed = (await this.rowByEmail(email).count()) > 0;
    await this.clearSearch();
    return displayed;
  }

  async search(term: string): Promise<void> {
    await this.searchBox.fill(term);
  }

  async clearSearch(): Promise<void> {
    await this.searchBox.clear();
  }

  async expectRecordDisplayed(record: WebTableRecord): Promise<void> {
    await this.search(record.email);
    const cells = this.rowByEmail(record.email).locator('td');
    await expect(cells.first()).toBeVisible();
    await expect(cells).toHaveText([
      record.firstName,
      record.lastName,
      record.age,
      record.email,
      record.salary,
      record.department,
      '',
    ]);
    await this.clearSearch();
  }

  async expectRecordNotDisplayed(email: string): Promise<void> {
    await this.search(email);
    await expect(this.rowByEmail(email)).toHaveCount(0);
    await this.clearSearch();
  }

  private async fillForm(record: WebTableRecord): Promise<void> {
    await expect(this.modal).toBeVisible();
    await this.modal.locator('#firstName').fill(record.firstName);
    await this.modal.locator('#lastName').fill(record.lastName);
    await this.modal.locator('#userEmail').fill(record.email);
    await this.modal.locator('#age').fill(record.age);
    await this.modal.locator('#salary').fill(record.salary);
    await this.modal.locator('#department').fill(record.department);
    await this.modal.locator('#submit').click();
    await expect(this.modal).toBeHidden();
  }
}
