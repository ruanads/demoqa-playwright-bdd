import { Locator, Page } from '@playwright/test';

/** Página "/sample" aberta pelos botões de nova janela/aba do Browser Windows. */
export class PaginaSample {
  readonly titulo: Locator;

  constructor(private readonly page: Page) {
    this.titulo = page.locator('#sampleHeading');
  }

  async fechar(): Promise<void> {
    await this.page.close();
  }
}
