/**
 * @file test/unit/seo.test.js
 * @description Unit tests untuk src/utils/seo.js
 *
 * Cakupan (TASK-019 — Phase 3.3):
 *   - updateMetaTags() mengatur document.title
 *   - updateMetaTags() upsert <meta name="description">
 *   - updateMetaTags() upsert <link rel="canonical">
 *   - updateMetaTags() set semua OG tags (title, description, url, type, image)
 *   - updateMetaTags() set Twitter Card tags
 *   - Panggilan berulang memperbarui (bukan menduplikasi) tags yang ada
 *   - ogType default 'website', ogImage default og-banner.png
 */

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { updateMetaTags } from '../../src/utils/seo.js';

const CANONICAL_BASE_URL = 'https://pasaluud1945.web.app';

describe('utils/seo — updateMetaTags()', () => {
  beforeEach(() => {
    // Reset <head> state sebelum setiap test
    document.title = '';
    document.head.innerHTML = '';
  });

  afterEach(() => {
    document.head.innerHTML = '';
  });

  it('mengatur document.title sesuai parameter title', () => {
    updateMetaTags({
      title: '5 Sila Pancasila — Dasar Negara Indonesia',
      description: 'Deskripsi singkat.',
      path: '/pancasila',
    });

    expect(document.title).toBe('5 Sila Pancasila — Dasar Negara Indonesia');
  });

  it('upsert <meta name="description"> dengan konten yang benar', () => {
    const description = 'Teks lengkap 5 Sila Pancasila.';
    updateMetaTags({
      title: 'Pancasila',
      description,
      path: '/pancasila',
    });

    const meta = document.querySelector('meta[name="description"]');
    expect(meta).not.toBeNull();
    expect(meta.getAttribute('content')).toBe(description);
  });

  it('upsert <link rel="canonical"> dengan URL absolut yang benar', () => {
    updateMetaTags({
      title: 'Pancasila',
      description: 'Deskripsi.',
      path: '/pancasila',
    });

    const canonical = document.querySelector('link[rel="canonical"]');
    expect(canonical).not.toBeNull();
    expect(canonical.getAttribute('href')).toBe(`${CANONICAL_BASE_URL}/pancasila`);
  });

  it('canonical URL menyertakan path dinamis dengan benar', () => {
    updateMetaTags({
      title: 'Pasal 1 UUD 1945',
      description: 'Isi pasal 1.',
      path: '/pasal/1',
    });

    const canonical = document.querySelector('link[rel="canonical"]');
    expect(canonical.getAttribute('href')).toBe(`${CANONICAL_BASE_URL}/pasal/1`);
  });

  it('set og:title sama dengan document.title', () => {
    const title = 'Pembukaan UUD 1945 — Empat Alinea';
    updateMetaTags({ title, description: 'Desc.', path: '/pembukaan' });

    const ogTitle = document.querySelector('meta[property="og:title"]');
    expect(ogTitle).not.toBeNull();
    expect(ogTitle.getAttribute('content')).toBe(title);
  });

  it('set og:description sama dengan description', () => {
    const description = 'Teks lengkap Pembukaan UUD 1945.';
    updateMetaTags({ title: 'Pembukaan', description, path: '/pembukaan' });

    const ogDesc = document.querySelector('meta[property="og:description"]');
    expect(ogDesc.getAttribute('content')).toBe(description);
  });

  it('set og:url ke canonical URL absolut', () => {
    updateMetaTags({ title: 'Beranda', description: 'Desc.', path: '/' });

    const ogUrl = document.querySelector('meta[property="og:url"]');
    expect(ogUrl.getAttribute('content')).toBe(`${CANONICAL_BASE_URL}/`);
  });

  it('set og:type ke "website" secara default', () => {
    updateMetaTags({ title: 'Pancasila', description: 'Desc.', path: '/pancasila' });

    const ogType = document.querySelector('meta[property="og:type"]');
    expect(ogType.getAttribute('content')).toBe('website');
  });

  it('set og:type ke "article" jika diberikan ogType: article', () => {
    updateMetaTags({
      title: 'Pasal 1',
      description: 'Isi pasal.',
      path: '/pasal/1',
      ogType: 'article',
    });

    const ogType = document.querySelector('meta[property="og:type"]');
    expect(ogType.getAttribute('content')).toBe('article');
  });

  it('set og:image ke default og-banner.png jika ogImage tidak diberikan', () => {
    updateMetaTags({ title: 'Pancasila', description: 'Desc.', path: '/pancasila' });

    const ogImage = document.querySelector('meta[property="og:image"]');
    expect(ogImage.getAttribute('content')).toBe(`${CANONICAL_BASE_URL}/images/og-banner.png`);
  });

  it('set og:image ke URL kustom jika ogImage diberikan', () => {
    const customImage = 'https://pasaluud1945.web.app/images/custom.png';
    updateMetaTags({
      title: 'Pancasila',
      description: 'Desc.',
      path: '/pancasila',
      ogImage: customImage,
    });

    const ogImage = document.querySelector('meta[property="og:image"]');
    expect(ogImage.getAttribute('content')).toBe(customImage);
  });

  it('set twitter:title sama dengan document.title', () => {
    const title = 'Cari Pasal UUD 1945';
    updateMetaTags({ title, description: 'Desc.', path: '/cari' });

    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    expect(twitterTitle).not.toBeNull();
    expect(twitterTitle.getAttribute('content')).toBe(title);
  });

  it('set twitter:description sama dengan description', () => {
    const description = 'Cari pasal berdasarkan kata kunci.';
    updateMetaTags({ title: 'Cari', description, path: '/cari' });

    const twitterDesc = document.querySelector('meta[name="twitter:description"]');
    expect(twitterDesc.getAttribute('content')).toBe(description);
  });

  it('set twitter:image ke default og-banner.png', () => {
    updateMetaTags({ title: 'Cari', description: 'Desc.', path: '/cari' });

    const twitterImage = document.querySelector('meta[name="twitter:image"]');
    expect(twitterImage.getAttribute('content')).toBe(`${CANONICAL_BASE_URL}/images/og-banner.png`);
  });

  it('panggilan kedua memperbarui (bukan menduplikasi) meta tags yang ada', () => {
    updateMetaTags({
      title: 'Halaman Pertama',
      description: 'Deskripsi pertama.',
      path: '/pertama',
    });

    updateMetaTags({
      title: 'Halaman Kedua',
      description: 'Deskripsi kedua.',
      path: '/kedua',
    });

    // Tidak ada duplikasi
    const descTags = document.querySelectorAll('meta[name="description"]');
    const canonicalTags = document.querySelectorAll('link[rel="canonical"]');
    const ogTitleTags = document.querySelectorAll('meta[property="og:title"]');

    expect(descTags.length).toBe(1);
    expect(canonicalTags.length).toBe(1);
    expect(ogTitleTags.length).toBe(1);

    // Nilai diperbarui
    expect(document.title).toBe('Halaman Kedua');
    expect(descTags[0].getAttribute('content')).toBe('Deskripsi kedua.');
    expect(canonicalTags[0].getAttribute('href')).toBe(`${CANONICAL_BASE_URL}/kedua`);
  });

  it('menggunakan <meta> yang sudah ada di DOM tanpa membuat duplikat', () => {
    // Simulasi meta tag yang sudah ada (dari index.html)
    const existingMeta = document.createElement('meta');
    existingMeta.setAttribute('name', 'description');
    existingMeta.setAttribute('content', 'Konten lama');
    document.head.appendChild(existingMeta);

    updateMetaTags({
      title: 'Judul Baru',
      description: 'Konten baru.',
      path: '/baru',
    });

    const descTags = document.querySelectorAll('meta[name="description"]');
    expect(descTags.length).toBe(1);
    expect(descTags[0].getAttribute('content')).toBe('Konten baru.');
  });
});
