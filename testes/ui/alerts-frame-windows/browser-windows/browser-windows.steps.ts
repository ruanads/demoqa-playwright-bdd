import { expect } from '@playwright/test';
import { Then, When } from '@fixtures';

When('eu clico no botão New Window', async ({ paginaBrowserWindows, contextoBrowserWindows }) => {
  contextoBrowserWindows.definir('novaJanela', await paginaBrowserWindows.abrirNovaJanela());
});

Then('uma nova janela deve ser aberta com a mensagem {string}', async ({ context, contextoBrowserWindows }, mensagem: string) => {
  expect(context.pages()).toHaveLength(2);
  await expect(contextoBrowserWindows.obter('novaJanela').titulo).toHaveText(mensagem);
});

When('eu fecho a nova janela', async ({ contextoBrowserWindows }) => {
  await contextoBrowserWindows.obter('novaJanela').fechar();
});

Then('apenas a janela original deve permanecer aberta', async ({ context, page }) => {
  expect(context.pages()).toEqual([page]);
});
