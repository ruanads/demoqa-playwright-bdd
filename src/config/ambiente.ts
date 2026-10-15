/** Configuração do ambiente sob teste. Pode ser sobrescrita pela variável de ambiente BASE_URL. */
export const ambiente = {
  urlBase: process.env.BASE_URL ?? 'https://demoqa.com',
};
