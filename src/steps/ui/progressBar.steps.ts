import { expect } from '@playwright/test';
import { Then, When } from '../../fixtures/fixtures';

When('eu inicio a progress bar e paro antes dos {int}%', async ({ progressBarPage, ctx }, limit: number) => {
  ctx.progressValue = await progressBarPage.startAndStopBefore(limit);
});

Then('o valor da progress bar deve ser menor ou igual a {int}%', async ({ progressBarPage, ctx }, limit: number) => {
  expect(ctx.progressValue).toBeGreaterThan(0);
  expect(ctx.progressValue).toBeLessThanOrEqual(limit);
  // Garante que a barra realmente parou e não continuou avançando.
  expect(await progressBarPage.value()).toBe(ctx.progressValue);
  await expect(progressBarPage.progressBar).toHaveText(`${ctx.progressValue}%`);
});

When('eu inicio a progress bar novamente até chegar aos 100%', async ({ progressBarPage }) => {
  await progressBarPage.start();
  await progressBarPage.waitUntilComplete();
  await expect(progressBarPage.progressBar).toHaveText('100%');
});

When('eu reseto a progress bar', async ({ progressBarPage }) => {
  await progressBarPage.reset();
});

Then('a progress bar deve voltar para 0%', async ({ progressBarPage }) => {
  await expect(progressBarPage.progressBar).toHaveAttribute('aria-valuenow', '0');
  await expect(progressBarPage.progressBar).toHaveText('0%');
});
