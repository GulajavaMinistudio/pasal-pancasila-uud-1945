/**
 * @file test/unit/sanitize.test.js
 * @description Unit tests untuk src/utils/sanitize.js
 */

import { describe, expect, it } from 'vitest';
import { escapeHtml, escapeAttr } from '../../src/utils/sanitize.js';

describe('utils/sanitize — escapeHtml()', () => {
  it('harus meng-escape karakter-karakter HTML khusus dengan benar', () => {
    const input = '<div>"Hello" & \'World\'</div>';
    const expected = '&lt;div&gt;&quot;Hello&quot; &amp; &#39;World&#39;&lt;/div&gt;';
    expect(escapeHtml(input)).toBe(expected);
  });

  it('harus mengembalikan string kosong jika input falsy dan bukan string', () => {
    expect(escapeHtml(null)).toBe('');
    expect(escapeHtml(undefined)).toBe('');
    expect(escapeHtml('')).toBe('');
  });

  it('harus mengonversi input non-string yang bernilai truthy menjadi string dan meng-escapenya', () => {
    expect(escapeHtml(123)).toBe('123');
    expect(escapeHtml(true)).toBe('true');
  });
});

describe('utils/sanitize — escapeAttr()', () => {
  it('harus memiliki perilaku yang sama dengan escapeHtml', () => {
    const input = 'some-value"&\'';
    expect(escapeAttr(input)).toBe(escapeHtml(input));
  });
});
