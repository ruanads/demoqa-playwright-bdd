import { Locator, Page } from '@playwright/test';

/** A barra avança 1% a cada 100 ms. */
const INTERVALO_POR_PORCENTO_MS = 100;

/**
 * A página roda com o relógio falso do Playwright (instalado no Before do cenário).
 * O tempo só avança quando o teste manda, então a barra não se move entre a leitura
 * do valor e o clique em "Stop": o teste é determinístico mesmo em máquinas lentas.
 */
export class PaginaProgressBar {
  readonly barraProgresso: Locator;
  private readonly botaoIniciarParar: Locator;
  private readonly botaoResetar: Locator;

  constructor(private readonly page: Page) {
    this.barraProgresso = page.getByRole('progressbar');
    this.botaoIniciarParar = page.locator('#startStopButton');
    this.botaoResetar = page.locator('#resetButton');
  }

  /** Pausa o relógio da página; a partir daqui o tempo só passa via `avancarAte`. */
  async congelarTempo(): Promise<void> {
    await this.page.clock.pauseAt(Date.now() + 1000);
  }

  async iniciar(): Promise<void> {
    await this.botaoIniciarParar.click();
  }

  async parar(): Promise<void> {
    await this.botaoIniciarParar.click();
  }

  async resetar(): Promise<void> {
    await this.botaoResetar.click();
  }

  async valor(): Promise<number> {
    return Number(await this.barraProgresso.getAttribute('aria-valuenow'));
  }

  /** Avança o relógio até a barra atingir o percentual informado. */
  async avancarAte(percentual: number): Promise<void> {
    const limiteDeTentativas = 100;
    for (let tentativa = 0; tentativa < limiteDeTentativas; tentativa++) {
      if ((await this.valor()) >= percentual) return;
      await this.page.clock.runFor(INTERVALO_POR_PORCENTO_MS);
    }
    throw new Error(`A progress bar não atingiu ${percentual}% (valor atual: ${await this.valor()}%).`);
  }
}
