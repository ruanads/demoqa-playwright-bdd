import { Locator } from '@playwright/test';
import { DadosAluno } from '@data/factories/aluno.factory';
import { PaginaBase } from '@paginas/base.pagina';

export class PaginaPracticeForm extends PaginaBase {
  private readonly campoNome = this.page.locator('#firstName');
  private readonly campoSobrenome = this.page.locator('#lastName');
  private readonly campoEmail = this.page.locator('#userEmail');
  private readonly campoCelular = this.page.locator('#userNumber');
  private readonly campoDataNascimento = this.page.locator('#dateOfBirthInput');
  private readonly campoMaterias = this.page.locator('#subjectsInput');
  private readonly campoUpload = this.page.locator('#uploadPicture');
  private readonly campoEndereco = this.page.locator('#currentAddress');
  private readonly campoEstado = this.page.locator('#react-select-3-input');
  private readonly campoCidade = this.page.locator('#react-select-4-input');
  private readonly botaoSubmit = this.page.locator('#submit');

  readonly popupResultado: Locator = this.page.locator('.modal-content');
  readonly tituloPopupResultado: Locator = this.page.locator('#example-modal-sizes-title-lg');
  private readonly botaoFecharPopup = this.page.locator('#closeLargeModal');

  async preencher(aluno: DadosAluno): Promise<void> {
    await this.campoNome.fill(aluno.nome);
    await this.campoSobrenome.fill(aluno.sobrenome);
    await this.campoEmail.fill(aluno.email);
    await this.page.locator('#genterWrapper').getByText(aluno.genero, { exact: true }).click();
    await this.campoCelular.fill(aluno.celular);
    await this.preencherDataNascimento(aluno.dataNascimento);
    for (const materia of aluno.materias) {
      await this.campoMaterias.fill(materia);
      await this.page.locator('.subjects-auto-complete__option').getByText(materia, { exact: true }).click();
    }
    for (const hobby of aluno.hobbies) {
      await this.page.locator('#hobbiesWrapper').getByText(hobby, { exact: true }).click();
    }
    await this.campoUpload.setInputFiles(aluno.caminhoArquivo);
    await this.campoEndereco.fill(aluno.endereco);
    await this.selecionarOpcaoReact(this.campoEstado, aluno.estado);
    await this.selecionarOpcaoReact(this.campoCidade, aluno.cidade);
  }

  async submeter(): Promise<void> {
    await this.botaoSubmit.click();
  }

  async fecharPopupPeloBotao(): Promise<void> {
    await this.botaoFecharPopup.click();
  }

  /** O botão "Close" do demoqa não fecha o popup (bug conhecido), então usamos o ESC. */
  async fecharPopupComEsc(): Promise<void> {
    await this.page.keyboard.press('Escape');
  }

  /** Retorna a tabela "Label -> Values" exibida no popup após o submit. */
  async obterValoresEnviados(): Promise<Record<string, string>> {
    const linhas = await this.popupResultado.locator('tbody tr').all();
    const valores: Record<string, string> = {};
    for (const linha of linhas) {
      const [rotulo, valor] = await linha.locator('td').allInnerTexts();
      valores[rotulo.trim()] = valor.trim();
    }
    return valores;
  }

  /** Seleciona a data pelo calendário (mês, ano e dia), como um usuário faria. */
  private async preencherDataNascimento(data: Date): Promise<void> {
    await this.campoDataNascimento.click();
    const calendario = this.page.locator('.react-datepicker');
    await calendario.locator('.react-datepicker__month-select').selectOption(String(data.getMonth()));
    await calendario.locator('.react-datepicker__year-select').selectOption(String(data.getFullYear()));
    const dia = String(data.getDate()).padStart(3, '0');
    await calendario
      .locator(`.react-datepicker__day--${dia}:not(.react-datepicker__day--outside-month)`)
      .click();
  }

  private async selecionarOpcaoReact(campo: Locator, valor: string): Promise<void> {
    await campo.fill(valor);
    await campo.press('Enter');
  }
}
