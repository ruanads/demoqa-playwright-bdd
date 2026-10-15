import { expect } from '@playwright/test';
import { BasePage } from './BasePage';

/** Margem (em %) para parar a barra antes do limite, já que ela avança ~10% por segundo. */
const STOP_SAFETY_MARGIN = 10;

export class ProgressBarPage extends BasePage {
  readonly progressBar = this.page.getByRole('progressbar');
  private readonly startStopButton = this.page.locator('#startStopButton');
  private readonly resetButton = this.page.locator('#resetButton');

  async start(): Promise<void> {
    await expect(this.startStopButton).toHaveText('Start');
    await this.startStopButton.click();
  }

  async stop(): Promise<void> {
    await expect(this.startStopButton).toHaveText('Stop');
    await this.startStopButton.click();
  }

  async value(): Promise<number> {
    return Number(await this.progressBar.getAttribute('aria-valuenow'));
  }

  /** Inicia a barra e a interrompe antes de atingir o limite informado. */
  async startAndStopBefore(limit: number): Promise<number> {
    await this.start();
    await this.page.waitForFunction(
      (threshold) => Number(document.querySelector('[role=progressbar]')?.getAttribute('aria-valuenow')) >= threshold,
      limit - STOP_SAFETY_MARGIN,
      { polling: 'raf' },
    );
    await this.stop();
    return this.value();
  }

  async waitUntilComplete(): Promise<void> {
    await expect(this.progressBar).toHaveAttribute('aria-valuenow', '100', { timeout: 20_000 });
  }

  async reset(): Promise<void> {
    await this.resetButton.click();
  }
}
