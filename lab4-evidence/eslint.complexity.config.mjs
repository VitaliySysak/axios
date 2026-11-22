// Окрема конфігурація лише для вимірювання складності (Лабораторна 4, крок 00).
// Не підключається до package.json проєкту; запуск:
//   npx eslint@10.13.0 --no-config-lookup -c lab4-evidence/eslint.complexity.config.mjs lib
export default [
  {
    files: ['lib/**/*.js'],
    languageOptions: { ecmaVersion: 'latest', sourceType: 'module' },
    rules: {
      complexity: ['warn', 20],
      'max-lines-per-function': ['warn', 50],
    },
  },
];
