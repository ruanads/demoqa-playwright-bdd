import { defineConfig, devices } from '@playwright/test';
import { cucumberReporter, defineBddProject } from 'playwright-bdd';

const sharedSteps = 'src/fixtures/**/*.ts';

export default defineConfig({
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    cucumberReporter('html', { outputFile: 'cucumber-report/index.html' }),
  ],
  use: {
    baseURL: 'https://demoqa.com',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      ...defineBddProject({
        name: 'api',
        features: 'features/api/**/*.feature',
        steps: ['src/steps/api/**/*.ts', sharedSteps],
      }),
    },
    {
      ...defineBddProject({
        name: 'ui',
        features: 'features/ui/**/*.feature',
        steps: ['src/steps/ui/**/*.ts', sharedSteps],
      }),
      use: { ...devices['Desktop Chrome'], viewport: { width: 1600, height: 900 } },
    },
  ],
});
