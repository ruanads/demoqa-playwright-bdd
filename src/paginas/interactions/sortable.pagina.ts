import { Locator, Page } from '@playwright/test';

const PALAVRA_PARA_NUMERO: Record<string, number> = { One: 1, Two: 2, Three: 3, Four: 4, Five: 5, Six: 6 };

export class PaginaSortable {
  readonly itens: Locator;

  constructor(page: Page) {
    this.itens = page.locator('#demo-tabpane-list .list-group-item');
  }

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

      await this.item(ordem[posicao]).dragTo(this.itens.nth(posicao), { targetPosition: { x: 20, y: 5 } });
      // Aguarda o React reposicionar o item antes de seguir para a próxima posição.
      await this.itens.nth(posicao).filter({ hasText: ordem[posicao] }).waitFor();
    }
  }

  private item(texto: string): Locator {
    return this.itens.getByText(texto, { exact: true });
  }
}
