import js from '@eslint/js';
import playwright from 'eslint-plugin-playwright';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['node_modules/', '.features-gen/', 'relatorios/'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname },
    },
    rules: {
      // Pega o erro mais comum em Playwright: chamada assíncrona sem await.
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
    },
  },
  {
    files: ['testes/**/*.ts', 'src/**/*.ts'],
    ...playwright.configs['flat/recommended'],
    rules: {
      ...playwright.configs['flat/recommended'].rules,
      // Os testes são gerados pelo playwright-bdd a partir das features; os steps
      // contêm as asserções, mas não são funções `test()` diretamente.
      'playwright/no-standalone-expect': 'off',
      'playwright/expect-expect': 'off',
    },
  },
);
