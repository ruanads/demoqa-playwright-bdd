import { expect } from '@playwright/test';
import path from 'node:path';
import { Then, When } from '@fixtures';
import { gerarAluno } from '@data/factories/aluno.factory';

When('eu preencho todo o formulário com valores aleatórios', async ({ paginaPracticeForm, contexto }) => {
  const aluno = gerarAluno();
  await paginaPracticeForm.preencher(aluno);
  contexto.definir('aluno', aluno);
});

When('eu submeto o formulário', async ({ paginaPracticeForm }) => {
  await paginaPracticeForm.submeter();
});

Then('um popup deve ser aberto com os dados enviados', async ({ paginaPracticeForm, contexto }) => {
  const aluno = contexto.obter('aluno');
  await expect(paginaPracticeForm.popupResultado).toBeVisible();
  await expect(paginaPracticeForm.tituloPopupResultado).toHaveText('Thanks for submitting the form');

  const dia = String(aluno.dataNascimento.getDate()).padStart(2, '0');
  const mes = aluno.dataNascimento.toLocaleString('en-US', { month: 'long' });

  expect(await paginaPracticeForm.obterValoresEnviados()).toEqual({
    'Student Name': `${aluno.nome} ${aluno.sobrenome}`,
    'Student Email': aluno.email,
    Gender: aluno.genero,
    Mobile: aluno.celular,
    'Date of Birth': `${dia} ${mes},${aluno.dataNascimento.getFullYear()}`,
    Subjects: aluno.materias.join(', '),
    Hobbies: aluno.hobbies.join(', '),
    Picture: path.basename(aluno.caminhoArquivo),
    Address: aluno.endereco,
    'State and City': `${aluno.estado} ${aluno.cidade}`,
  });
});

When('eu fecho o popup', async ({ paginaPracticeForm }) => {
  await paginaPracticeForm.fecharPopupComEsc();
});

When('eu fecho o popup pelo botão Close', async ({ paginaPracticeForm }) => {
  await paginaPracticeForm.fecharPopupPeloBotao();
});

Then('o popup não deve mais ser exibido', async ({ paginaPracticeForm }) => {
  await expect(paginaPracticeForm.popupResultado).toBeHidden();
});
