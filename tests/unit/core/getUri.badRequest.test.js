/**
 * Нова поведінка кроку 02 Лабораторної 4 (форк, не upstream).
 * На коміті, де цей файл зʼявляється, тести ЧЕРВОНІ навмисне: зміни ще немає.
 *
 * axios.getUri() має відхиляти url, на якому падає buildURL, так само, як це вже
 * робить Node-адаптер (lib/adapters/http.js, try/catch навколо buildURL):
 * AxiosError з кодом ERR_BAD_REQUEST, а не голий TypeError.
 * Вхід — URL-обʼєкт замість рядка (історія проєкту: #10866, відкочено в #10874).
 */
import { describe, it, expect } from 'vitest';
import axios, { AxiosError } from '../../../index.js';

const config = { url: new URL('http://localhost/foo'), params: { foo: 'bar' } };

const thrownBy = (fn) => {
  try {
    fn();
  } catch (error) {
    return error;
  }
  return undefined;
};

describe('axios.getUri — url, на якому падає buildURL', () => {
  it('кидає AxiosError, а не голий TypeError', () => {
    const error = thrownBy(() => axios.getUri(config));
    expect(axios.isAxiosError(error)).toBe(true);
    expect(error).toBeInstanceOf(AxiosError);
  });

  it('має код ERR_BAD_REQUEST, як Node-адаптер для того самого збою', () => {
    const error = thrownBy(() => axios.getUri(config));
    expect(error?.code).toBe(AxiosError.ERR_BAD_REQUEST);
  });

  it('зберігає вихідний TypeError у cause', () => {
    const error = thrownBy(() => axios.getUri(config));
    expect(error?.cause).toBeInstanceOf(TypeError);
    expect(error?.cause?.message).toBe('url.indexOf is not a function');
  });
});
