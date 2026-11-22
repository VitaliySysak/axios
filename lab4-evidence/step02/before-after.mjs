// Той самий вхід — до (основний checkout форка, код нульової точки) і після (change-tree).
// Запуск: node before-after.mjs <шлях-до-кореня-axios>
import { pathToFileURL } from 'node:url';
import { join } from 'node:path';
const root = process.argv[2];
const { default: axios } = await import(pathToFileURL(join(root, 'index.js')).href);
const nest = (n) => { let o = 'value'; for (let i = 0; i < n; i++) o = { a: o }; return o; };
const cases = {
  'URL-обʼєкт (#10866)': { url: new URL('http://localhost/foo'), params: { foo: 'bar' } },
  'глибина 150 (paramsMerge.test.js)': { url: '/resource', params: nest(150) },
  'приклад README': { url: '/foo#hash', params: { query: 'axios', page: 1 } },
};
for (const [name, config] of Object.entries(cases)) {
  try {
    console.log(`${name}: повертає ${JSON.stringify(axios.getUri(config))}`);
  } catch (e) {
    console.log(`${name}: кидає ${e.constructor.name} isAxiosError=${axios.isAxiosError(e)} code=${e.code} message=${JSON.stringify(e.message)} cause=${e.cause?.constructor?.name}`);
  }
}
