import { defineConfig, devices } from '@playwright/test';
import { cucumberReporter, defineBddProject } from 'playwright-bdd';
import { ambiente } from './src/config/ambiente';

const fixtures = 'src/fixtures/index.ts';

export default defineConfig({
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  // No CI, um teste que só passa na segunda tentativa é instável: o retry mostra
  // isso no relatório, mas a execução falha para a instabilidade não passar despercebida.
  failOnFlakyTests: !!process.env.CI,
  outputDir: 'relatorios/resultados',
  reporter: [
    ['list'],
    ['html', { outputFolder: 'relatorios/playwright', open: 'never' }],
    cucumberReporter('html', { outputFile: 'relatorios/cucumber/index.html' }),
  ],
  use: {
    baseURL: ambiente.urlBase,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      ...defineBddProject({
        name: 'api',
        features: 'testes/api/**/*.feature',
        steps: ['testes/api/**/*.steps.ts', fixtures],
      }),
    },
    {
      ...defineBddProject({
        name: 'ui',
        features: 'testes/ui/**/*.feature',
        steps: ['testes/ui/**/*.steps.ts', fixtures],
      }),
      use: { ...devices['Desktop Chrome'], viewport: { width: 1600, height: 900 } },
    },
  ],
});
