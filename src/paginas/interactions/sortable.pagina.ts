import { expect } from '@playwright/test';
import { PaginaBase } from '@paginas/base.pagina';

const PALAVRA_PARA_NUMERO: Record<string, number> = { One: 1, Two: 2, Three: 3, Four: 4, Five: 5, Six: 6 };

export class PaginaSortable extends PaginaBase {
  private readonly itens = this.page.locator('#demo-tabpane-list .list-group-item');

  async textosDosItens(): Promise<string[]> {
    return this.itens.allInnerTexts();
  }

  /** Ordena pelo valor numérico (One=1, Two=2...) e não alfabeticamente. */
  static ordemCrescente(textos: string[]): string[] {
    return [...textos].sort((a, b) => PALAVRA_PARA_NUMERO[a] - PALAVRA_PARA_NUMERO[b]);
  }

  /**
   * Reorganiza a lista na ordem desejada usando apenas drag and drop:
   * para cada posição, arrasta o item esperado até ela (selection sort).
   */
  async reordenarPara(ordem: string[]): Promise<void> {
    for (let posicao = 0; posicao < ordem.length; posicao++) {
      const atual = await this.textosDosItens();
      if (atual[posicao] === ordem[posicao]) continue;

      const origem = this.itens.filter({ hasText: new RegExp(`^${ordem[posicao]}$`) });
      await origem.dragTo(this.itens.nth(posicao), { targetPosition: { x: 20, y: 5 } });
      await expect(this.itens.nth(posicao)).toHaveText(ordem[posicao]);
    }
  }
}
