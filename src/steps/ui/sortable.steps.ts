import { expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { Then, When } from '../../fixtures/fixtures';
import { SortablePage } from '../../pages/SortablePage';

// A lista já é exibida em ordem crescente, então primeiro ela é embaralhada
// via drag and drop para que a ordenação tenha efeito real.
When('eu embaralho os elementos da lista usando drag and drop', async ({ sortablePage }) => {
  const current = await sortablePage.itemTexts();
  const ascending = SortablePage.ascending(current);
  let shuffled: string[];
  do {
    shuffled = faker.helpers.shuffle(current);
  } while (shuffled.join() === ascending.join());

  await sortablePage.reorderTo(shuffled);
  expect(await sortablePage.itemTexts()).not.toEqual(ascending);
});

When('eu coloco os elementos em ordem crescente usando drag and drop', async ({ sortablePage }) => {
  await sortablePage.reorderTo(SortablePage.ascending(await sortablePage.itemTexts()));
});

Then('os elementos devem estar em ordem crescente', async ({ sortablePage }) => {
  expect(await sortablePage.itemTexts()).toEqual(['One', 'Two', 'Three', 'Four', 'Five', 'Six']);
});
