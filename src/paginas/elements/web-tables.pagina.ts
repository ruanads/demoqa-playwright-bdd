import { Locator, Page } from '@playwright/test';
import { RegistroWebTable } from '@data/factories/registro-web-table.factory';

export class PaginaWebTables {
  private readonly botaoAdicionar: Locator;
  private readonly campoPesquisa: Locator;
  private readonly modal: Locator;
  private readonly linhas: Locator;

  constructor(private readonly page: Page) {
    this.botaoAdicionar = page.locator('#addNewRecordButton');
    this.campoPesquisa = page.locator('#searchBox');
    this.modal = page.locator('.modal-content');
    this.linhas = page.locator('table tbody tr');
  }

  async criar(registro: RegistroWebTable): Promise<void> {
    await this.botaoAdicionar.click();
    await this.preencherFormulario(registro);
  }

  async editar(emailAtual: string, atualizado: RegistroWebTable): Promise<void> {
    await this.pesquisar(emailAtual);
    await this.linhaPorEmail(emailAtual).locator('[title="Edit"]').click();
    await this.preencherFormulario(atualizado);
    await this.limparPesquisa();
  }

  async deletar(email: string): Promise<void> {
    await this.pesquisar(email);
    await this.linhaPorEmail(email).locator('[title="Delete"]').click();
    // Só limpa a pesquisa depois que a linha sumir, para a próxima leitura não pegar estado intermediário.
    await this.linhaPorEmail(email).waitFor({ state: 'detached' });
    await this.limparPesquisa();
  }

  /**
   * Filtra a tabela pelo e-mail e retorna as células da linha encontrada.
   * A pesquisa evita problemas com a paginação quando existem muitos registros.
   */
  async pesquisarCelulas(email: string): Promise<Locator> {
    await this.pesquisar(email);
    return this.linhaPorEmail(email).locator('td');
  }

  async estaExibido(email: string): Promise<boolean> {
    await this.pesquisar(email);
    const exibido = (await this.linhaPorEmail(email).count()) > 0;
    await this.limparPesquisa();
    return exibido;
  }

  async limparPesquisa(): Promise<void> {
    await this.campoPesquisa.clear();
  }

  /**
   * Digita o termo e aguarda a tabela terminar de filtrar: enquanto houver alguma
   * linha sem o termo, o filtro ainda não foi aplicado. Sem essa espera, uma leitura
   * logo após a pesquisa (como o `count()` de `estaExibido`) poderia ver a tabela antiga.
   */
  private async pesquisar(termo: string): Promise<void> {
    await this.campoPesquisa.fill(termo);
    await this.linhas.filter({ hasNotText: termo }).first().waitFor({ state: 'detached' });
  }

  private linhaPorEmail(email: string): Locator {
    return this.linhas.filter({ has: this.page.getByRole('cell', { name: email, exact: true }) });
  }

  private async preencherFormulario(registro: RegistroWebTable): Promise<void> {
    await this.modal.waitFor();
    await this.modal.locator('#firstName').fill(registro.nome);
    await this.modal.locator('#lastName').fill(registro.sobrenome);
    await this.modal.locator('#userEmail').fill(registro.email);
    await this.modal.locator('#age').fill(registro.idade);
    await this.modal.locator('#salary').fill(registro.salario);
    await this.modal.locator('#department').fill(registro.departamento);
    await this.modal.locator('#submit').click();
    await this.modal.waitFor({ state: 'hidden' });
  }
}
