import { expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { Then, When } from '@fixtures';
import { PaginaSortable } from '@paginas/interactions/sortable.pagina';

// A lista já é exibida em ordem crescente, então primeiro ela é embaralhada
// via drag and drop para que a ordenação tenha efeito real.
When('eu embaralho os elementos da lista usando drag and drop', async ({ paginaSortable }) => {
  const atual = await paginaSortable.textosDosItens();
  const crescente = PaginaSortable.ordemCrescente(atual);
  let embaralhada: string[];
  do {
    embaralhada = faker.helpers.shuffle(atual);
  } while (embaralhada.join() === crescente.join());

  await paginaSortable.reordenarPara(embaralhada);
  expect(await paginaSortable.textosDosItens()).not.toEqual(crescente);
});

When('eu coloco os elementos em ordem crescente usando drag and drop', async ({ paginaSortable }) => {
  await paginaSortable.reordenarPara(PaginaSortable.ordemCrescente(await paginaSortable.textosDosItens()));
});

Then('os elementos devem estar em ordem crescente', async ({ paginaSortable }) => {
  expect(await paginaSortable.textosDosItens()).toEqual(['One', 'Two', 'Three', 'Four', 'Five', 'Six']);
});
