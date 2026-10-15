import { PaginaBase } from '@paginas/base.pagina';

export class PaginaInicial extends PaginaBase {
  async abrir(): Promise<void> {
    await this.page.goto('/');
  }

  /** Clica em um dos cards da página inicial (Elements, Forms, Widgets...). */
  async selecionarCard(nome: string): Promise<void> {
    await this.page
      .getByRole('link')
      .filter({ has: this.page.getByRole('heading', { name: nome, exact: true }) })
      .click();
  }
}
