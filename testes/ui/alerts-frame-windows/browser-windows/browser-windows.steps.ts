import { expect } from '@playwright/test';
import { Then, When } from '@fixtures';

When('eu clico no botão New Window', async ({ paginaBrowserWindows, contexto }) => {
  contexto.definir('novaJanela', await paginaBrowserWindows.abrirNovaJanela());
});

Then('uma nova janela deve ser aberta com a mensagem {string}', async ({ context, contexto }, mensagem: string) => {
  expect(context.pages()).toHaveLength(2);
  await expect(contexto.obter('novaJanela').titulo).toHaveText(mensagem);
});

When('eu fecho a nova janela', async ({ contexto }) => {
  await contexto.obter('novaJanela').fechar();
});

Then('apenas a janela original deve permanecer aberta', async ({ context, page }) => {
  expect(context.pages()).toEqual([page]);
});
