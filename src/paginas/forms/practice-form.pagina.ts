import { Locator, Page } from '@playwright/test';
import { DadosAluno } from '@data/factories/aluno.factory';

export class PaginaPracticeForm {
  readonly popupResultado: Locator;
  readonly tituloPopupResultado: Locator;
  /** Coluna "Label" da tabela exibida no popup após o submit. */
  readonly rotulosResultado: Locator;
  /** Coluna "Values" da tabela exibida no popup após o submit. */
  readonly valoresResultado: Locator;
  private readonly campoNome: Locator;
  private readonly campoSobrenome: Locator;
  private readonly campoEmail: Locator;
  private readonly opcoesGenero: Locator;
  private readonly campoCelular: Locator;
  private readonly campoDataNascimento: Locator;
  private readonly calendario: Locator;
  private readonly campoMaterias: Locator;
  private readonly sugestoesMaterias: Locator;
  private readonly opcoesHobbies: Locator;
  private readonly campoUpload: Locator;
  private readonly campoEndereco: Locator;
  private readonly campoEstado: Locator;
  private readonly campoCidade: Locator;
  private readonly botaoSubmit: Locator;
  private readonly botaoFecharPopup: Locator;

  constructor(private readonly page: Page) {
    this.campoNome = page.locator('#firstName');
    this.campoSobrenome = page.locator('#lastName');
    this.campoEmail = page.locator('#userEmail');
    this.opcoesGenero = page.locator('#genterWrapper');
    this.campoCelular = page.locator('#userNumber');
    this.campoDataNascimento = page.locator('#dateOfBirthInput');
    this.calendario = page.locator('.react-datepicker');
    this.campoMaterias = page.locator('#subjectsInput');
    this.sugestoesMaterias = page.locator('.subjects-auto-complete__option');
    this.opcoesHobbies = page.locator('#hobbiesWrapper');
    this.campoUpload = page.locator('#uploadPicture');
    this.campoEndereco = page.locator('#currentAddress');
    // Localizados pelo container: os ids internos do react-select (react-select-3-input...)
    // dependem da ordem de criação dos componentes e mudam se outro select for adicionado.
    this.campoEstado = page.locator('#state input');
    this.campoCidade = page.locator('#city input');
    this.botaoSubmit = page.locator('#submit');
    this.popupResultado = page.locator('.modal-content');
    this.tituloPopupResultado = page.locator('#example-modal-sizes-title-lg');
    this.rotulosResultado = this.popupResultado.locator('tbody tr td:nth-child(1)');
    this.valoresResultado = this.popupResultado.locator('tbody tr td:nth-child(2)');
    this.botaoFecharPopup = page.locator('#closeLargeModal');
  }

  async preencher(aluno: DadosAluno): Promise<void> {
    await this.campoNome.fill(aluno.nome);
    await this.campoSobrenome.fill(aluno.sobrenome);
    await this.campoEmail.fill(aluno.email);
    await this.opcoesGenero.getByText(aluno.genero, { exact: true }).click();
    await this.campoCelular.fill(aluno.celular);
    await this.preencherDataNascimento(aluno.dataNascimento);
    for (const materia of aluno.materias) {
      await this.campoMaterias.fill(materia);
      await this.sugestoesMaterias.getByText(materia, { exact: true }).click();
    }
    for (const hobby of aluno.hobbies) {
      await this.opcoesHobbies.getByText(hobby, { exact: true }).click();
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

  /** Seleciona a data pelo calendário (mês, ano e dia), como um usuário faria. */
  private async preencherDataNascimento(data: Date): Promise<void> {
    await this.campoDataNascimento.click();
    await this.calendario.locator('.react-datepicker__month-select').selectOption(String(data.getMonth()));
    await this.calendario.locator('.react-datepicker__year-select').selectOption(String(data.getFullYear()));
    const dia = String(data.getDate()).padStart(3, '0');
    await this.calendario
      .locator(`.react-datepicker__day--${dia}:not(.react-datepicker__day--outside-month)`)
      .click();
  }

  private async selecionarOpcaoReact(campo: Locator, valor: string): Promise<void> {
    await campo.fill(valor);
    await campo.press('Enter');
  }
}
