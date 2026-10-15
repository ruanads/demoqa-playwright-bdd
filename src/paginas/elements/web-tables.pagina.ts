import { expect, Locator } from '@playwright/test';
import { RegistroWebTable } from '@data/factories/registro-web-table.factory';
import { PaginaBase } from '@paginas/base.pagina';

export class PaginaWebTables extends PaginaBase {
  private readonly botaoAdicionar = this.page.locator('#addNewRecordButton');
  private readonly campoPesquisa = this.page.locator('#searchBox');
  private readonly modal = this.page.locator('.modal-content');
  private readonly linhas = this.page.locator('table tbody tr');

  async criar(registro: RegistroWebTable): Promise<void> {
    await this.botaoAdicionar.click();
    await this.preencherFormulario(registro);
  }

  async editar(emailAtual: string, atualizado: RegistroWebTable): Promise<void> {
    await this.linhaPorEmail(emailAtual).locator('[title="Edit"]').click();
    await this.preencherFormulario(atualizado);
  }

  async deletar(email: string): Promise<void> {
    await this.linhaPorEmail(email).locator('[title="Delete"]').click();
    await this.limparPesquisa();
  }

  /**
   * Filtra a tabela pelo e-mail antes de buscar a linha, evitando
   * problemas com a paginação quando existem muitos registros.
   */
  linhaPorEmail(email: string): Locator {
    return this.linhas.filter({ has: this.page.getByRole('cell', { name: email, exact: true }) });
  }

  async estaExibido(email: string): Promise<boolean> {
    await this.pesquisar(email);
    const exibido = (await this.linhaPorEmail(email).count()) > 0;
    await this.limparPesquisa();
    return exibido;
  }

  async pesquisar(termo: string): Promise<void> {
    await this.campoPesquisa.fill(termo);
  }

  async limparPesquisa(): Promise<void> {
    await this.campoPesquisa.clear();
  }

  async validarRegistroExibido(registro: RegistroWebTable): Promise<void> {
    await this.pesquisar(registro.email);
    const celulas = this.linhaPorEmail(registro.email).locator('td');
    await expect(celulas.first()).toBeVisible();
    await expect(celulas).toHaveText([
      registro.nome,
      registro.sobrenome,
      registro.idade,
      registro.email,
      registro.salario,
      registro.departamento,
      '',
    ]);
    await this.limparPesquisa();
  }

  async validarRegistroNaoExibido(email: string): Promise<void> {
    await this.pesquisar(email);
    await expect(this.linhaPorEmail(email)).toHaveCount(0);
    await this.limparPesquisa();
  }

  private async preencherFormulario(registro: RegistroWebTable): Promise<void> {
    await expect(this.modal).toBeVisible();
    await this.modal.locator('#firstName').fill(registro.nome);
    await this.modal.locator('#lastName').fill(registro.sobrenome);
    await this.modal.locator('#userEmail').fill(registro.email);
    await this.modal.locator('#age').fill(registro.idade);
    await this.modal.locator('#salary').fill(registro.salario);
    await this.modal.locator('#department').fill(registro.departamento);
    await this.modal.locator('#submit').click();
    await expect(this.modal).toBeHidden();
  }
}
