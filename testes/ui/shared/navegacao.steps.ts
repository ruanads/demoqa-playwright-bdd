import { Given } from '@fixtures';

Given('que eu acesso o site do DemoQA', async ({ paginaInicial }) => {
  await paginaInicial.abrir();
});

Given('eu escolho a opção {string} na página inicial', async ({ paginaInicial }, card: string) => {
  await paginaInicial.selecionarCard(card);
});

Given('eu clico no submenu {string}', async ({ menuLateral }, item: string) => {
  await menuLateral.clicarItem(item);
});
