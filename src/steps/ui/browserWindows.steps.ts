import { expect } from '@playwright/test';
import { Then, When } from '../../fixtures/fixtures';
import { BrowserWindowsPage } from '../../pages/BrowserWindowsPage';

When('eu clico no botão New Window', async ({ browserWindowsPage, ctx }) => {
  ctx.newWindow = await browserWindowsPage.openNewWindow();
});

Then('uma nova janela deve ser aberta com a mensagem {string}', async ({ context, ctx }, message: string) => {
  expect(context.pages()).toHaveLength(2);
  await expect(BrowserWindowsPage.sampleHeading(ctx.newWindow!)).toHaveText(message);
});

When('eu fecho a nova janela', async ({ ctx }) => {
  await ctx.newWindow!.close();
});

Then('apenas a janela original deve permanecer aberta', async ({ context, page }) => {
  expect(context.pages()).toEqual([page]);
});
