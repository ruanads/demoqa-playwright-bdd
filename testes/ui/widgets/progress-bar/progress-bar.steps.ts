import { expect } from '@playwright/test';
import { Before, Then, When } from '@fixtures';

// O relógio falso precisa ser instalado antes de a página carregar.
Before({ tags: '@progressbar' }, async ({ page }) => {
  await page.clock.install();
});

When('eu inicio a progress bar e paro antes dos {int}%', async ({ paginaProgressBar, contextoProgressBar }, limite: number) => {
  await paginaProgressBar.congelarTempo();
  await paginaProgressBar.iniciar();
  await paginaProgressBar.avancarAte(limite - 1);
  await paginaProgressBar.parar();
  contextoProgressBar.definir('valorProgresso', await paginaProgressBar.valor());
});

Then('o valor da progress bar deve ser menor ou igual a {int}%', async ({ paginaProgressBar, contextoProgressBar }, limite: number) => {
  const valor = contextoProgressBar.obter('valorProgresso');
  expect(valor).toBeGreaterThan(0);
  expect(valor).toBeLessThanOrEqual(limite);
  await expect(paginaProgressBar.barraProgresso).toHaveText(`${valor}%`);
});

When('eu inicio a progress bar novamente até chegar aos 100%', async ({ paginaProgressBar }) => {
  await paginaProgressBar.iniciar();
  await paginaProgressBar.avancarAte(100);
});

Then('a progress bar deve estar em 100%', async ({ paginaProgressBar }) => {
  await expect(paginaProgressBar.barraProgresso).toHaveAttribute('aria-valuenow', '100');
  await expect(paginaProgressBar.barraProgresso).toHaveText('100%');
});

When('eu reseto a progress bar', async ({ paginaProgressBar }) => {
  await paginaProgressBar.resetar();
});

Then('a progress bar deve voltar para 0%', async ({ paginaProgressBar }) => {
  await expect(paginaProgressBar.barraProgresso).toHaveAttribute('aria-valuenow', '0');
  await expect(paginaProgressBar.barraProgresso).toHaveText('0%');
});
