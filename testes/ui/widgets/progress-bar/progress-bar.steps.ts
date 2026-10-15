import { expect } from '@playwright/test';
import { Then, When } from '@fixtures';

When('eu inicio a progress bar e paro antes dos {int}%', async ({ paginaProgressBar, contexto }, limite: number) => {
  contexto.valorProgresso = await paginaProgressBar.iniciarEPararAntesDe(limite);
});

Then('o valor da progress bar deve ser menor ou igual a {int}%', async ({ paginaProgressBar, contexto }, limite: number) => {
  expect(contexto.valorProgresso).toBeGreaterThan(0);
  expect(contexto.valorProgresso).toBeLessThanOrEqual(limite);
  // Garante que a barra realmente parou e não continuou avançando.
  expect(await paginaProgressBar.valor()).toBe(contexto.valorProgresso);
  await expect(paginaProgressBar.barraProgresso).toHaveText(`${contexto.valorProgresso}%`);
});

When('eu inicio a progress bar novamente até chegar aos 100%', async ({ paginaProgressBar }) => {
  await paginaProgressBar.iniciar();
  await paginaProgressBar.aguardarConclusao();
  await expect(paginaProgressBar.barraProgresso).toHaveText('100%');
});

When('eu reseto a progress bar', async ({ paginaProgressBar }) => {
  await paginaProgressBar.resetar();
});

Then('a progress bar deve voltar para 0%', async ({ paginaProgressBar }) => {
  await expect(paginaProgressBar.barraProgresso).toHaveAttribute('aria-valuenow', '0');
  await expect(paginaProgressBar.barraProgresso).toHaveText('0%');
});
