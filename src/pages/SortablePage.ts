import { expect } from '@playwright/test';
import { BasePage } from './BasePage';

const WORD_TO_NUMBER: Record<string, number> = { One: 1, Two: 2, Three: 3, Four: 4, Five: 5, Six: 6 };

export class SortablePage extends BasePage {
  private readonly items = this.page.locator('#demo-tabpane-list .list-group-item');

  async itemTexts(): Promise<string[]> {
    return this.items.allInnerTexts();
  }

  /** Ordena pelo valor numérico (One=1, Two=2...) e não alfabeticamente. */
  static ascending(texts: string[]): string[] {
    return [...texts].sort((a, b) => WORD_TO_NUMBER[a] - WORD_TO_NUMBER[b]);
  }

  /**
   * Reorganiza a lista na ordem desejada usando apenas drag and drop:
   * para cada posição, arrasta o item esperado até ela (selection sort).
   */
  async reorderTo(order: string[]): Promise<void> {
    for (let index = 0; index < order.length; index++) {
      const current = await this.itemTexts();
      if (current[index] === order[index]) continue;

      const source = this.items.filter({ hasText: new RegExp(`^${order[index]}$`) });
      await source.dragTo(this.items.nth(index), { targetPosition: { x: 20, y: 5 } });
      await expect(this.items.nth(index)).toHaveText(order[index]);
    }
  }
}
