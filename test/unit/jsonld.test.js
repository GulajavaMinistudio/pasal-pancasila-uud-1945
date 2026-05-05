/**
 * @file test/unit/jsonld.test.js
 * @description Unit tests untuk src/utils/jsonld.js
 *
 * Cakupan (TASK-026–029 — Phase 3.4):
 *   - injectJsonLd() membuat <script> baru jika belum ada
 *   - injectJsonLd() memperbarui textContent (upsert, tidak duplikasi)
 *   - injectJsonLd() menerima array schema
 *   - removeJsonLd() menghapus elemen yang ada
 *   - removeJsonLd() no-op jika elemen belum ada
 *   - createWebPageSchema() menghasilkan schema @type WebPage yang benar
 *   - createWebPageSchema() memprepend BASE_URL ke url
 *   - createArticleSchema() menghasilkan schema @type Article yang benar
 *   - createArticleSchema() dateModified default '2026-04-28'
 *   - createArticleSchema() isPartOf, publisher, mainEntityOfPage
 *   - createBreadcrumbSchema() menghasilkan BreadcrumbList dengan position 1-indexed
 *   - createBreadcrumbSchema() memprepend BASE_URL ke setiap item URL
 */

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  createArticleSchema,
  createBreadcrumbSchema,
  createWebPageSchema,
  injectJsonLd,
  removeJsonLd,
} from '../../src/utils/jsonld.js';

const BASE_URL = 'https://pasaluud1945.web.app';
const SCRIPT_ID = '__jsonld-page';

describe('utils/jsonld — injectJsonLd()', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
  });

  afterEach(() => {
    document.head.innerHTML = '';
  });

  it('membuat <script type="application/ld+json"> baru jika belum ada', () => {
    const schema = { '@type': 'WebPage', name: 'Test' };
    injectJsonLd(schema);

    const el = document.getElementById(SCRIPT_ID);
    expect(el).not.toBeNull();
    expect(el.getAttribute('type')).toBe('application/ld+json');
  });

  it('menyimpan JSON.stringify(schema) sebagai textContent', () => {
    const schema = { '@context': 'https://schema.org', '@type': 'WebPage', name: 'Pancasila' };
    injectJsonLd(schema);

    const el = document.getElementById(SCRIPT_ID);
    expect(el.textContent).toBe(JSON.stringify(schema));
  });

  it('memperbarui textContent saat dipanggil ulang (upsert — tidak ada duplikasi)', () => {
    injectJsonLd({ '@type': 'WebPage', name: 'Pertama' });
    injectJsonLd({ '@type': 'WebPage', name: 'Kedua' });

    const allScripts = document.querySelectorAll(`script[type="application/ld+json"]#${SCRIPT_ID}`);
    expect(allScripts).toHaveLength(1);

    const el = document.getElementById(SCRIPT_ID);
    expect(JSON.parse(el.textContent).name).toBe('Kedua');
  });

  it('menerima array schema dan menyimpannya sebagai JSON array', () => {
    const schemas = [{ '@type': 'Article', headline: 'Pasal 1' }, { '@type': 'BreadcrumbList' }];
    injectJsonLd(schemas);

    const el = document.getElementById(SCRIPT_ID);
    const parsed = JSON.parse(el.textContent);
    expect(Array.isArray(parsed)).toBe(true);
    expect(parsed).toHaveLength(2);
    expect(parsed[0]['@type']).toBe('Article');
    expect(parsed[1]['@type']).toBe('BreadcrumbList');
  });
});

describe('utils/jsonld — removeJsonLd()', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
  });

  afterEach(() => {
    document.head.innerHTML = '';
  });

  it('menghapus elemen <script> yang sudah ada', () => {
    injectJsonLd({ '@type': 'WebPage' });
    expect(document.getElementById(SCRIPT_ID)).not.toBeNull();

    removeJsonLd();
    expect(document.getElementById(SCRIPT_ID)).toBeNull();
  });

  it('tidak melempar error jika elemen belum ada (no-op)', () => {
    expect(() => removeJsonLd()).not.toThrow();
  });
});

describe('utils/jsonld — createWebPageSchema()', () => {
  it('menghasilkan schema @context dan @type yang benar', () => {
    const schema = createWebPageSchema({
      name: '5 Sila Pancasila',
      description: 'Teks lengkap 5 Sila Pancasila.',
      url: '/pancasila',
    });

    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@type']).toBe('WebPage');
  });

  it('memprepend BASE_URL ke url', () => {
    const schema = createWebPageSchema({
      name: 'Pancasila',
      description: 'Deskripsi.',
      url: '/pancasila',
    });

    expect(schema.url).toBe(`${BASE_URL}/pancasila`);
  });

  it('menyertakan name, description, dan inLanguage yang benar', () => {
    const schema = createWebPageSchema({
      name: 'Pembukaan UUD 1945',
      description: 'Teks lengkap Pembukaan.',
      url: '/pembukaan',
    });

    expect(schema.name).toBe('Pembukaan UUD 1945');
    expect(schema.description).toBe('Teks lengkap Pembukaan.');
    expect(schema.inLanguage).toBe('id');
  });

  it('menangani url root "/" dengan benar', () => {
    const schema = createWebPageSchema({
      name: 'Beranda',
      description: 'Halaman utama.',
      url: '/',
    });

    expect(schema.url).toBe(`${BASE_URL}/`);
  });
});

describe('utils/jsonld — createArticleSchema()', () => {
  it('menghasilkan schema @context dan @type Article yang benar', () => {
    const schema = createArticleSchema({
      headline: 'Pasal 1 Undang-Undang Dasar 1945',
      description: 'Isi lengkap Pasal 1 UUD 1945.',
      url: '/pasal/1',
    });

    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@type']).toBe('Article');
  });

  it('menyertakan headline, description, dan inLanguage yang benar', () => {
    const schema = createArticleSchema({
      headline: 'Pasal 7A Undang-Undang Dasar 1945',
      description: 'Isi Pasal 7A.',
      url: '/pasal/7A',
    });

    expect(schema.headline).toBe('Pasal 7A Undang-Undang Dasar 1945');
    expect(schema.description).toBe('Isi Pasal 7A.');
    expect(schema.inLanguage).toBe('id');
  });

  it('memprepend BASE_URL ke url dan mainEntityOfPage["@id"]', () => {
    const schema = createArticleSchema({
      headline: 'Pasal 5',
      description: 'Deskripsi.',
      url: '/pasal/5',
    });

    expect(schema.url).toBe(`${BASE_URL}/pasal/5`);
    expect(schema.mainEntityOfPage['@id']).toBe(`${BASE_URL}/pasal/5`);
  });

  it('menggunakan dateModified default "2026-04-28" jika tidak disediakan', () => {
    const schema = createArticleSchema({
      headline: 'Pasal 1',
      description: 'Deskripsi.',
      url: '/pasal/1',
    });

    expect(schema.dateModified).toBe('2026-04-28');
  });

  it('menggunakan dateModified yang diberikan jika tersedia', () => {
    const schema = createArticleSchema({
      headline: 'Pasal 1',
      description: 'Deskripsi.',
      url: '/pasal/1',
      dateModified: '2025-12-01',
    });

    expect(schema.dateModified).toBe('2025-12-01');
  });

  it('menyertakan isPartOf (Book) dengan URL yang benar', () => {
    const schema = createArticleSchema({
      headline: 'Pasal 1',
      description: 'Deskripsi.',
      url: '/pasal/1',
    });

    expect(schema.isPartOf['@type']).toBe('Book');
    expect(schema.isPartOf.url).toBe(`${BASE_URL}/pasal`);
    expect(schema.isPartOf.name).toContain('Undang-Undang Dasar');
  });

  it('menyertakan publisher (Organization) yang benar', () => {
    const schema = createArticleSchema({
      headline: 'Pasal 1',
      description: 'Deskripsi.',
      url: '/pasal/1',
    });

    expect(schema.publisher['@type']).toBe('Organization');
    expect(schema.publisher.url).toBe(BASE_URL);
  });
});

describe('utils/jsonld — createBreadcrumbSchema()', () => {
  it('menghasilkan schema @context dan @type BreadcrumbList', () => {
    const schema = createBreadcrumbSchema([{ name: 'Beranda', path: '/' }]);

    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@type']).toBe('BreadcrumbList');
  });

  it('memberi nomor position mulai dari 1 (1-indexed)', () => {
    const schema = createBreadcrumbSchema([
      { name: 'Beranda', path: '/' },
      { name: 'Pasal', path: '/pasal' },
      { name: 'Pasal 1', path: '/pasal/1' },
    ]);

    const items = schema.itemListElement;
    expect(items[0].position).toBe(1);
    expect(items[1].position).toBe(2);
    expect(items[2].position).toBe(3);
  });

  it('memprepend BASE_URL ke setiap item URL', () => {
    const schema = createBreadcrumbSchema([
      { name: 'Beranda', path: '/' },
      { name: 'Pasal', path: '/pasal' },
    ]);

    expect(schema.itemListElement[0].item).toBe(`${BASE_URL}/`);
    expect(schema.itemListElement[1].item).toBe(`${BASE_URL}/pasal`);
  });

  it('menyertakan name yang benar untuk setiap item', () => {
    const schema = createBreadcrumbSchema([
      { name: 'Beranda', path: '/' },
      { name: 'Pasal UUD 1945', path: '/pasal' },
      { name: 'Pasal 7A', path: '/pasal/7A' },
    ]);

    expect(schema.itemListElement[0].name).toBe('Beranda');
    expect(schema.itemListElement[1].name).toBe('Pasal UUD 1945');
    expect(schema.itemListElement[2].name).toBe('Pasal 7A');
  });

  it('mengatur @type ListItem untuk setiap item', () => {
    const schema = createBreadcrumbSchema([
      { name: 'Beranda', path: '/' },
      { name: 'Pancasila', path: '/pancasila' },
    ]);

    schema.itemListElement.forEach((item) => {
      expect(item['@type']).toBe('ListItem');
    });
  });

  it('menangani array dengan satu item (hanya Beranda)', () => {
    const schema = createBreadcrumbSchema([{ name: 'Beranda', path: '/' }]);

    expect(schema.itemListElement).toHaveLength(1);
    expect(schema.itemListElement[0].position).toBe(1);
  });
});
