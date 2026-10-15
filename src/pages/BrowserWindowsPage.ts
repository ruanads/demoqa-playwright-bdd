import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class BrowserWindowsPage extends BasePage {
  private readonly newWindowButton = this.page.locator('#windowButton');

  /** Clica em "New Window" e retorna a nova janela aberta. */
  async openNewWindow(): Promise<Page> {
    const [newWindow] = await Promise.all([this.page.waitForEvent('popup'), this.newWindowButton.click()]);
    await newWindow.waitForLoadState();
    return newWindow;
  }

  static sampleHeading(window: Page) {
    return window.locator('#sampleHeading');
  }
}
