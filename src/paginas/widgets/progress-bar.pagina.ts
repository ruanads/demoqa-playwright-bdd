import { expect } from '@playwright/test';
import { PaginaBase } from '@paginas/base.pagina';

/** Margem (em %) para parar a barra antes do limite, já que ela avança ~10% por segundo. */
const MARGEM_SEGURANCA = 10;

export class PaginaProgressBar extends PaginaBase {
  readonly barraProgresso = this.page.getByRole('progressbar');
  private readonly botaoIniciarParar = this.page.locator('#startStopButton');
  private readonly botaoResetar = this.page.locator('#resetButton');

  async iniciar(): Promise<void> {
    await expect(this.botaoIniciarParar).toHaveText('Start');
    await this.botaoIniciarParar.click();
  }

  async parar(): Promise<void> {
    await expect(this.botaoIniciarParar).toHaveText('Stop');
    await this.botaoIniciarParar.click();
  }

  async valor(): Promise<number> {
    return Number(await this.barraProgresso.getAttribute('aria-valuenow'));
  }

  /** Inicia a barra e a interrompe antes de atingir o limite informado. */
  async iniciarEPararAntesDe(limite: number): Promise<number> {
    await this.iniciar();
    await this.page.waitForFunction(
      (alvo) => Number(document.querySelector('[role=progressbar]')?.getAttribute('aria-valuenow')) >= alvo,
      limite - MARGEM_SEGURANCA,
      { polling: 'raf' },
    );
    await this.parar();
    return this.valor();
  }

  async aguardarConclusao(): Promise<void> {
    await expect(this.barraProgresso).toHaveAttribute('aria-valuenow', '100', { timeout: 20_000 });
  }

  async resetar(): Promise<void> {
    await this.botaoResetar.click();
  }
}
