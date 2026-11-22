// Конфігурація Vitest лише для мутаційного прогону Stryker (Лабораторна 4, крок 01).
// Проєктний vitest.config.js не змінюється: там є браузерні проєкти, яким потрібен Playwright.
// STRYKER_TESTS=existing — лише наявні тести проєкту; інакше — наявні + характеризаційні.
import { defineConfig } from 'vitest/config';

const existing = ['tests/unit/helpers/buildURL.test.js'];
const all = [...existing, 'tests/unit/helpers/buildURL.characterization.test.js'];

export default defineConfig({
  test: {
    environment: 'node',
    include: process.env.STRYKER_TESTS === 'existing' ? existing : all,
    testTimeout: 10000,
  },
});
