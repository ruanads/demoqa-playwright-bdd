import { Page } from '@playwright/test';
import { PaginaBase } from '@paginas/base.pagina';

export class PaginaBrowserWindows extends PaginaBase {
  private readonly botaoNovaJanela = this.page.locator('#windowButton');

  /** Clica em "New Window" e retorna a nova janela aberta. */
  async abrirNovaJanela(): Promise<Page> {
    const [novaJanela] = await Promise.all([this.page.waitForEvent('popup'), this.botaoNovaJanela.click()]);
    await novaJanela.waitForLoadState();
    return novaJanela;
  }

  static tituloPaginaExemplo(janela: Page) {
    return janela.locator('#sampleHeading');
  }
}
