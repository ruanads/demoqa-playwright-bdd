import { Then, When } from '../../fixtures/fixtures';
import { buildWebTableRecord } from '../../utils/dataFactory';

When('eu crio um novo registro', async ({ webTablesPage, ctx }) => {
  ctx.record = buildWebTableRecord();
  await webTablesPage.create(ctx.record);
});

Then('o registro deve ser exibido na tabela', async ({ webTablesPage, ctx }) => {
  await webTablesPage.expectRecordDisplayed(ctx.record!);
});

When('eu edito o registro criado', async ({ webTablesPage, ctx }) => {
  const original = ctx.record!;
  const updated = buildWebTableRecord();
  await webTablesPage.search(original.email);
  await webTablesPage.edit(original.email, updated);
  await webTablesPage.clearSearch();
  ctx.records = [original];
  ctx.record = updated;
});

Then('o registro deve ser exibido com os dados atualizados', async ({ webTablesPage, ctx }) => {
  await webTablesPage.expectRecordDisplayed(ctx.record!);
  await webTablesPage.expectRecordNotDisplayed(ctx.records![0].email);
});

When('eu deleto o registro criado', async ({ webTablesPage, ctx }) => {
  await webTablesPage.search(ctx.record!.email);
  await webTablesPage.delete(ctx.record!.email);
});

Then('o registro não deve mais ser exibido na tabela', async ({ webTablesPage, ctx }) => {
  await webTablesPage.expectRecordNotDisplayed(ctx.record!.email);
});

When('eu crio {int} novos registros', async ({ webTablesPage, ctx }, amount: number) => {
  ctx.records = Array.from({ length: amount }, buildWebTableRecord);
  for (const record of ctx.records) {
    await webTablesPage.create(record);
  }
});

Then('todos os registros criados devem ser exibidos na tabela', async ({ webTablesPage, ctx }) => {
  for (const record of ctx.records!) {
    await webTablesPage.expectRecordDisplayed(record);
  }
});

// Bug do demoqa: deletar um registro novo remove todos os registros adicionados,
// por isso só deletamos os que ainda estiverem na tabela.
When('eu deleto todos os registros criados', async ({ webTablesPage, ctx }) => {
  for (const record of ctx.records!) {
    if (!(await webTablesPage.isDisplayed(record.email))) continue;
    await webTablesPage.search(record.email);
    await webTablesPage.delete(record.email);
  }
});

When('eu deleto o primeiro registro criado', async ({ webTablesPage, ctx }) => {
  const [first] = ctx.records!;
  await webTablesPage.search(first.email);
  await webTablesPage.delete(first.email);
});

Then('os demais registros criados devem continuar na tabela', async ({ webTablesPage, ctx }) => {
  for (const record of ctx.records!.slice(1)) {
    await webTablesPage.expectRecordDisplayed(record);
  }
});

Then('nenhum dos registros criados deve ser exibido na tabela', async ({ webTablesPage, ctx }) => {
  for (const record of ctx.records!) {
    await webTablesPage.expectRecordNotDisplayed(record.email);
  }
});
