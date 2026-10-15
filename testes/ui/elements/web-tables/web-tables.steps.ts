import { Then, When } from '@fixtures';
import { gerarRegistroWebTable } from '@data/factories/registro-web-table.factory';

When('eu crio um novo registro', async ({ paginaWebTables, contexto }) => {
  contexto.registro = gerarRegistroWebTable();
  await paginaWebTables.criar(contexto.registro);
});

Then('o registro deve ser exibido na tabela', async ({ paginaWebTables, contexto }) => {
  await paginaWebTables.validarRegistroExibido(contexto.registro!);
});

When('eu edito o registro criado', async ({ paginaWebTables, contexto }) => {
  const original = contexto.registro!;
  const atualizado = gerarRegistroWebTable();
  await paginaWebTables.pesquisar(original.email);
  await paginaWebTables.editar(original.email, atualizado);
  await paginaWebTables.limparPesquisa();
  contexto.registros = [original];
  contexto.registro = atualizado;
});

Then('o registro deve ser exibido com os dados atualizados', async ({ paginaWebTables, contexto }) => {
  await paginaWebTables.validarRegistroExibido(contexto.registro!);
  await paginaWebTables.validarRegistroNaoExibido(contexto.registros![0].email);
});

When('eu deleto o registro criado', async ({ paginaWebTables, contexto }) => {
  await paginaWebTables.pesquisar(contexto.registro!.email);
  await paginaWebTables.deletar(contexto.registro!.email);
});

Then('o registro não deve mais ser exibido na tabela', async ({ paginaWebTables, contexto }) => {
  await paginaWebTables.validarRegistroNaoExibido(contexto.registro!.email);
});

When('eu crio {int} novos registros', async ({ paginaWebTables, contexto }, quantidade: number) => {
  contexto.registros = Array.from({ length: quantidade }, gerarRegistroWebTable);
  for (const registro of contexto.registros) {
    await paginaWebTables.criar(registro);
  }
});

Then('todos os registros criados devem ser exibidos na tabela', async ({ paginaWebTables, contexto }) => {
  for (const registro of contexto.registros!) {
    await paginaWebTables.validarRegistroExibido(registro);
  }
});

// Bug do demoqa: deletar um registro novo remove todos os registros adicionados,
// por isso só deletamos os que ainda estiverem na tabela.
When('eu deleto todos os registros criados', async ({ paginaWebTables, contexto }) => {
  for (const registro of contexto.registros!) {
    if (!(await paginaWebTables.estaExibido(registro.email))) continue;
    await paginaWebTables.pesquisar(registro.email);
    await paginaWebTables.deletar(registro.email);
  }
});

When('eu deleto o primeiro registro criado', async ({ paginaWebTables, contexto }) => {
  const [primeiro] = contexto.registros!;
  await paginaWebTables.pesquisar(primeiro.email);
  await paginaWebTables.deletar(primeiro.email);
});

Then('os demais registros criados devem continuar na tabela', async ({ paginaWebTables, contexto }) => {
  for (const registro of contexto.registros!.slice(1)) {
    await paginaWebTables.validarRegistroExibido(registro);
  }
});

Then('nenhum dos registros criados deve ser exibido na tabela', async ({ paginaWebTables, contexto }) => {
  for (const registro of contexto.registros!) {
    await paginaWebTables.validarRegistroNaoExibido(registro.email);
  }
});
