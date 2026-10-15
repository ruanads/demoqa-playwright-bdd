import { Locator } from '@playwright/test';
import { StudentData } from '../utils/dataFactory';
import { BasePage } from './BasePage';

export class PracticeFormPage extends BasePage {
  private readonly firstName = this.page.locator('#firstName');
  private readonly lastName = this.page.locator('#lastName');
  private readonly email = this.page.locator('#userEmail');
  private readonly mobile = this.page.locator('#userNumber');
  private readonly dateOfBirth = this.page.locator('#dateOfBirthInput');
  private readonly subjects = this.page.locator('#subjectsInput');
  private readonly upload = this.page.locator('#uploadPicture');
  private readonly currentAddress = this.page.locator('#currentAddress');
  private readonly state = this.page.locator('#react-select-3-input');
  private readonly city = this.page.locator('#react-select-4-input');
  private readonly submitButton = this.page.locator('#submit');

  readonly resultModal: Locator = this.page.locator('.modal-content');
  readonly resultModalTitle: Locator = this.page.locator('#example-modal-sizes-title-lg');
  private readonly closeModalButton = this.page.locator('#closeLargeModal');

  async fill(student: StudentData): Promise<void> {
    await this.firstName.fill(student.firstName);
    await this.lastName.fill(student.lastName);
    await this.email.fill(student.email);
    await this.page.locator('#genterWrapper').getByText(student.gender, { exact: true }).click();
    await this.mobile.fill(student.mobile);
    await this.fillDateOfBirth(student.dateOfBirth);
    for (const subject of student.subjects) {
      await this.subjects.fill(subject);
      await this.page.locator('.subjects-auto-complete__option').getByText(subject, { exact: true }).click();
    }
    for (const hobby of student.hobbies) {
      await this.page.locator('#hobbiesWrapper').getByText(hobby, { exact: true }).click();
    }
    await this.upload.setInputFiles(student.uploadFilePath);
    await this.currentAddress.fill(student.currentAddress);
    await this.selectReactOption(this.state, student.state);
    await this.selectReactOption(this.city, student.city);
  }

  async submit(): Promise<void> {
    await this.submitButton.click();
  }

  async closeResultModalWithButton(): Promise<void> {
    await this.closeModalButton.click();
  }

  /** O botão "Close" do demoqa não fecha o modal (bug conhecido), então usamos o ESC. */
  async closeResultModalWithEsc(): Promise<void> {
    await this.page.keyboard.press('Escape');
  }

  /** Retorna a tabela "Label -> Values" exibida no popup após o submit. */
  async getSubmittedValues(): Promise<Record<string, string>> {
    const rows = await this.resultModal.locator('tbody tr').all();
    const values: Record<string, string> = {};
    for (const row of rows) {
      const [label, value] = await row.locator('td').allInnerTexts();
      values[label.trim()] = value.trim();
    }
    return values;
  }

  /** Seleciona a data pelo calendário (mês, ano e dia), como um usuário faria. */
  private async fillDateOfBirth(date: Date): Promise<void> {
    await this.dateOfBirth.click();
    const datepicker = this.page.locator('.react-datepicker');
    await datepicker.locator('.react-datepicker__month-select').selectOption(String(date.getMonth()));
    await datepicker.locator('.react-datepicker__year-select').selectOption(String(date.getFullYear()));
    const day = String(date.getDate()).padStart(3, '0');
    await datepicker
      .locator(`.react-datepicker__day--${day}:not(.react-datepicker__day--outside-month)`)
      .click();
  }

  private async selectReactOption(input: Locator, value: string): Promise<void> {
    await input.fill(value);
    await input.press('Enter');
  }
}
