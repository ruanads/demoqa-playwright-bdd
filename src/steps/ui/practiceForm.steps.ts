import { expect } from '@playwright/test';
import { Then, When } from '../../fixtures/fixtures';
import { buildStudent } from '../../utils/dataFactory';
import path from 'node:path';

When('eu preencho todo o formulário com valores aleatórios', async ({ practiceFormPage, ctx }) => {
  ctx.student = buildStudent();
  await practiceFormPage.fill(ctx.student);
});

When('eu submeto o formulário', async ({ practiceFormPage }) => {
  await practiceFormPage.submit();
});

Then('um popup deve ser aberto com os dados enviados', async ({ practiceFormPage, ctx }) => {
  const student = ctx.student!;
  await expect(practiceFormPage.resultModal).toBeVisible();
  await expect(practiceFormPage.resultModalTitle).toHaveText('Thanks for submitting the form');

  const day = String(student.dateOfBirth.getDate()).padStart(2, '0');
  const month = student.dateOfBirth.toLocaleString('en-US', { month: 'long' });

  expect(await practiceFormPage.getSubmittedValues()).toEqual({
    'Student Name': `${student.firstName} ${student.lastName}`,
    'Student Email': student.email,
    Gender: student.gender,
    Mobile: student.mobile,
    'Date of Birth': `${day} ${month},${student.dateOfBirth.getFullYear()}`,
    Subjects: student.subjects.join(', '),
    Hobbies: student.hobbies.join(', '),
    Picture: path.basename(student.uploadFilePath),
    Address: student.currentAddress,
    'State and City': `${student.state} ${student.city}`,
  });
});

When('eu fecho o popup', async ({ practiceFormPage }) => {
  await practiceFormPage.closeResultModalWithEsc();
});

When('eu fecho o popup pelo botão Close', async ({ practiceFormPage }) => {
  await practiceFormPage.closeResultModalWithButton();
});

Then('o popup não deve mais ser exibido', async ({ practiceFormPage }) => {
  await expect(practiceFormPage.resultModal).toBeHidden();
});
