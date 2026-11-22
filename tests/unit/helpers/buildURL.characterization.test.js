/**
 * ХАРАКТЕРИЗАЦІЯ, НЕ ВИМОГА.
 * Ці тести фіксують поведінку lib/helpers/buildURL.js на нульовій точці форка
 * 9f0f4ddfe72b4c06afafe1a658e6ee53d35b5760 (Лабораторна 4, крок 01).
 * Якщо тест тут падає — спершу припускаємо, що зламали МИ.
 * Значення в expect отримані з фактичного прогону (lab4-evidence/step01/blind-run-*.txt),
 * а не виведені з коду. Входи взято з наявних тестів і README проєкту.
 */
import { describe, it, expect } from 'vitest';
import buildURL from '../../../lib/helpers/buildURL.js';
import axios from '../../../index.js';

describe('buildURL — поточна поведінка (характеризація)', () => {
  // ПОВЕДІНКА: порожній обʼєкт params не додає «?» і НЕ відрізає #фрагмент.
  // ЧОМУ: серіалізація дає '' і гілка відрізання не виконується — lib/helpers/buildURL.js#L59.
  // Вхід — з наявного тесту 'should correct discard url hash mark'.
  it('порожній обʼєкт params лишає URL разом із #фрагментом', () => {
    expect(buildURL('/foo?foo=bar#hash', {})).toEqual('/foo?foo=bar#hash');
  });

  // ПОВЕДІНКА: значення null/undefined пропускаються; якщо інших немає — URL не змінюється, #фрагмент лишається.
  // ЧОМУ: та сама гілка L59; пропуск null — коміт b0ebf9fc. Вхід — з тесту 'should support params'.
  it('params, де всі значення null/undefined, лишає URL разом із #фрагментом', () => {
    expect(buildURL('/foo?foo=bar#hash', { isUndefined: undefined, isNull: null })).toEqual(
      '/foo?foo=bar#hash'
    );
  });

  // ПОВЕДІНКА: без params url повертається як є, без жодної перевірки типу — навіть число,
  // і undefined лишається undefined (а не '').
  // ЧОМУ: рання віддача на L32–L34 стоїть до `url = url || ''`.
  // Друге твердження додано після мутаційного прогону: без нього вижили мутанти L32 (blind-run-3.txt).
  it('params = null повертає url як є, навіть якщо url не рядок', () => {
    expect(buildURL(42, null)).toBe(42);
    expect(buildURL(undefined, null)).toBeUndefined();
  });

  // ПОВЕДІНКА: власний серіалізатор, що повернув '', не додає «?» і не відрізає #фрагмент.
  // ЧОМУ: перевірка `if (serializedParams)` на L59 однакова для власного й типового серіалізатора.
  it('серіалізатор, що повернув порожній рядок, лишає URL разом із #фрагментом', () => {
    expect(buildURL('/foo#hash', { foo: 'bar' }, () => '')).toEqual('/foo#hash');
  });

  // ПОВЕДІНКА: функція в третьому аргументі стає серіалізатором; другим аргументом він отримує
  // обгортку { serialize: <ця сама функція> }, а не саму функцію.
  // ЧОМУ: L37–L41 загортає функцію в обʼєкт, L52 передає цей обʼєкт.
  it('функція в options стає серіалізатором і отримує { serialize } другим аргументом', () => {
    let seen;
    const serializer = (params, options) => {
      seen = options;
      return 'x=1';
    };
    expect(buildURL('/foo', { foo: 'bar' }, serializer)).toEqual('/foo?x=1');
    expect(seen).toEqual({ serialize: serializer });
  });

  // ПОВЕДІНКА: URL-обʼєкт замість рядка з непорожніми params падає голим TypeError, а не AxiosError.
  // ЦЕ СХОЖЕ НА БАГ і зафіксовано навмисне. Вхід — з історії проєкту: підтримку URL-обʼєкта
  // додали в 847d89b4 (#10866) і відкотили в 34adfd90 (#10874).
  it('URL-обʼєкт замість рядка з непорожніми params кидає TypeError (зафіксований баг)', () => {
    const call = () => buildURL(new URL('http://localhost/foo'), { foo: 'bar' });
    expect(call).toThrow(TypeError);
    expect(call).toThrow('url.indexOf is not a function');
  });

  // ПОВЕДІНКА: публічний axios.getUri поводиться так само — порожні params лишають #фрагмент.
  // ЧОМУ: getUri кличе buildURL напряму, lib/core/Axios.js#L322.
  it('axios.getUri з порожніми params лишає #фрагмент', () => {
    expect(axios.getUri({ url: '/foo#hash', params: {} })).toEqual('/foo#hash');
  });

  // ПОВЕДІНКА: axios.getUri з непорожніми params відрізає #фрагмент і додає «?».
  // Вхід — приклад params із README (`{ query: 'axios', page: 1 }`).
  it('axios.getUri з непорожніми params відрізає #фрагмент', () => {
    expect(axios.getUri({ url: '/foo#hash', params: { query: 'axios', page: 1 } })).toEqual(
      '/foo?query=axios&page=1'
    );
  });
});
