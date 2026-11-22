// Stryker 10.0.0 для кроку 01 Лабораторної 4. @stryker-mutator/core поставлено `npm i --no-save`,
// тож package.json і lock-файл axios не змінено. Запуск — з кореня форка:
//   npx stryker run lab4-evidence/step01/stryker.config.mjs
// STRYKER_TESTS=existing — мутантів убивають лише наявні тести buildURL.test.js;
// без змінної — наявні + характеризаційні.
//
// Чому testRunner 'command', а не '@stryker-mutator/vitest-runner' 10.0.0:
// з Vitest 5.1.0 (версія з lock-файла axios) vitest-runner не активує мутантів —
// усі 43 «виживають», хоча вручну активований мутант L35 ламає наявний тест
// (див. stryker-vitest-runner-all-survived.txt). Поставити Vitest 5.0.5 через --no-save
// npm не дає (ERESOLVE, install-vitest-5.0.5.txt), а чужий lock-файл ми не міняємо.
// Command-запускач передає мутанта змінною __STRYKER_ACTIVE_MUTANT__, яку читає
// інструментований код, і вимагає coverageAnalysis 'off'.
const tag = process.env.STRYKER_TESTS === 'existing' ? 'existing' : 'all';

export default {
  testRunner: 'command',
  commandRunner: {
    command: 'npx vitest run --config lab4-evidence/step01/vitest.stryker.config.mjs',
  },
  coverageAnalysis: 'off',
  // область: один модуль, а не весь проєкт
  mutate: ['lib/helpers/buildURL.js'],
  // попередній результат перевикористовується
  incremental: true,
  incrementalFile: `lab4-evidence/step01/mutation-${tag}/stryker-incremental.json`,
  concurrency: 4,
  reporters: ['clear-text', 'progress', 'html', 'json'],
  htmlReporter: { fileName: `lab4-evidence/step01/mutation-${tag}/mutation.html` },
  jsonReporter: { fileName: `lab4-evidence/step01/mutation-${tag}/mutation.json` },
  // TypeScript 7.0.2 у node_modules не має ts.parseConfigFileTextToJson, на якому падає
  // препроцесор tsconfig у core 10.0.0 (див. stryker-fail-ts7.txt). Проєкт на JS — вимикаємо
  // перепис tsconfig, вказавши файл, якого немає.
  tsconfigFile: 'lab4-evidence/step01/no-tsconfig.json',
  tempDirName: '.stryker-tmp',
  cleanTempDir: true,
};
