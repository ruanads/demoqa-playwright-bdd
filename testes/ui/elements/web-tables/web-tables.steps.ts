import { expect } from '@playwright/test';
import { Then, When } from '@fixtures';
import { gerarRegistroWebTable, RegistroWebTable } from '@data/factories/registro-web-table.factory';
import { PaginaWebTables } from '@paginas/elements/web-tables.pagina';

async function validarRegistroExibido(pagina: PaginaWebTables, registro: RegistroWebTable): Promise<void> {
  const celulas = await pagina.pesquisarCelulas(registro.email);
  await expect(celulas).toHaveText([
    registro.nome,
    registro.sobrenome,
    registro.idade,
    registro.email,
    registro.salario,
    registro.departamento,
    '', // coluna de ações
  ]);
  await pagina.limparPesquisa();
}

async function validarRegistroNaoExibido(pagina: PaginaWebTables, email: string): Promise<void> {
  const celulas = await pagina.pesquisarCelulas(email);
  await expect(celulas).toHaveCount(0);
  await pagina.limparPesquisa();
}

When('eu crio um novo registro', async ({ paginaWebTables, contexto }) => {
  const registro = gerarRegistroWebTable();
  await paginaWebTables.criar(registro);
  contexto.definir('registro', registro);
});

Then('o registro deve ser exibido na tabela', async ({ paginaWebTables, contexto }) => {
  await validarRegistroExibido(paginaWebTables, contexto.obter('registro'));
});

When('eu edito o registro criado', async ({ paginaWebTables, contexto }) => {
  const original = contexto.obter('registro');
  const atualizado = gerarRegistroWebTable();
  await paginaWebTables.editar(original.email, atualizado);
  contexto.definir('registroOriginal', original);
  contexto.definir('registro', atualizado);
});

Then('o registro deve ser exibido com os dados atualizados', async ({ paginaWebTables, contexto }) => {
  await validarRegistroExibido(paginaWebTables, contexto.obter('registro'));
  await validarRegistroNaoExibido(paginaWebTables, contexto.obter('registroOriginal').email);
});

When('eu deleto o registro criado', async ({ paginaWebTables, contexto }) => {
  await paginaWebTables.deletar(contexto.obter('registro').email);
});

Then('o registro não deve mais ser exibido na tabela', async ({ paginaWebTables, contexto }) => {
  await validarRegistroNaoExibido(paginaWebTables, contexto.obter('registro').email);
});

When('eu crio {int} novos registros', async ({ paginaWebTables, contexto }, quantidade: number) => {
  const registros = Array.from({ length: quantidade }, gerarRegistroWebTable);
  for (const registro of registros) {
    await paginaWebTables.criar(registro);
  }
  contexto.definir('registros', registros);
});

Then('todos os registros criados devem ser exibidos na tabela', async ({ paginaWebTables, contexto }) => {
  for (const registro of contexto.obter('registros')) {
    await validarRegistroExibido(paginaWebTables, registro);
  }
});

// Bug do demoqa: deletar um registro novo remove todos os registros adicionados,
// por isso só deletamos os que ainda estiverem na tabela.
When('eu deleto todos os registros criados', async ({ paginaWebTables, contexto }) => {
  for (const registro of contexto.obter('registros')) {
    if (await paginaWebTables.estaExibido(registro.email)) {
      await paginaWebTables.deletar(registro.email);
    }
  }
});

When('eu deleto o primeiro registro criado', async ({ paginaWebTables, contexto }) => {
  const [primeiro] = contexto.obter('registros');
  await paginaWebTables.deletar(primeiro.email);
});

Then('os demais registros criados devem continuar na tabela', async ({ paginaWebTables, contexto }) => {
  for (const registro of contexto.obter('registros').slice(1)) {
    await validarRegistroExibido(paginaWebTables, registro);
  }
});

Then('nenhum dos registros criados deve ser exibido na tabela', async ({ paginaWebTables, contexto }) => {
  for (const registro of contexto.obter('registros')) {
    await validarRegistroNaoExibido(paginaWebTables, registro.email);
  }
});
