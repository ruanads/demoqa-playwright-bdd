import { expect } from '@playwright/test';
import { Then, When } from '@fixtures';
import { PaginaBrowserWindows } from '@paginas/alerts-frame-windows/browser-windows.pagina';

When('eu clico no botão New Window', async ({ paginaBrowserWindows, contexto }) => {
  contexto.novaJanela = await paginaBrowserWindows.abrirNovaJanela();
});

Then('uma nova janela deve ser aberta com a mensagem {string}', async ({ context, contexto }, mensagem: string) => {
  expect(context.pages()).toHaveLength(2);
  await expect(PaginaBrowserWindows.tituloPaginaExemplo(contexto.novaJanela!)).toHaveText(mensagem);
});

When('eu fecho a nova janela', async ({ contexto }) => {
  await contexto.novaJanela!.close();
});

Then('apenas a janela original deve permanecer aberta', async ({ context, page }) => {
  expect(context.pages()).toEqual([page]);
});
