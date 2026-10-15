import { Given, When } from '../../fixtures/fixtures';

Given('que eu acesso o site do DemoQA', async ({ homePage }) => {
  await homePage.open();
});

When('eu escolho a opção {string} na página inicial', async ({ homePage }, card: string) => {
  await homePage.selectCard(card);
});

When('eu clico no submenu {string}', async ({ sideMenu }, item: string) => {
  await sideMenu.clickItem(item);
});
