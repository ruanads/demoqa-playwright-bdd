import { Locator, Page } from '@playwright/test';
import { PaginaSample } from './sample.pagina';

export class PaginaBrowserWindows {
  private readonly botaoNovaJanela: Locator;

  constructor(private readonly page: Page) {
    this.botaoNovaJanela = page.locator('#windowButton');
  }

  /** Clica em "New Window" e retorna a página aberta na nova janela. */
  async abrirNovaJanela(): Promise<PaginaSample> {
    const [novaJanela] = await Promise.all([this.page.waitForEvent('popup'), this.botaoNovaJanela.click()]);
    await novaJanela.waitForLoadState();
    return new PaginaSample(novaJanela);
  }
}
