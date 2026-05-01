/**
 * @file test/unit/loader.test.js
 * @description Unit tests untuk src/data/loader.js
 *
 * Cakupan (TASK-050):
 *   - loadSilaPancasila: fetch, cache, error handling
 *   - loadButirPancasila: fetch, cache, error handling
 *   - loadPembukaanUUD: fetch, cache, error handling
 *   - loadPasalUUD: fetch, cache, error handling
 *   - loadBabPasal: fetch, cache, error handling (returnnya full object)
 *   - loadPasalUUDNoAmandemen: fetch, cache, error handling
 *   - loadPasalUUDKetAmandemen: fetch, cache, error handling
 *
 * Strategi isolasi cache:
 *   Loader menggunakan module-level _cache. Untuk memastikan setiap test
 *   dimulai dengan cache kosong, vi.resetModules() + dynamic import dipakai
 *   di beforeEach agar modul di-evaluasi ulang.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// ---------------------------------------------------------------------------
// Fixtures (data ringkas untuk mocking)
// ---------------------------------------------------------------------------
import silaFixture from '../../src/data/fixture/silapancasila.json';
import butirFixture from '../../src/data/fixture/butir_pancasila.json';
import pembukaanFixture from '../../src/data/fixture/pembukaanuud.json';
import pasalFixture from '../../src/data/fixture/pasaluud45.json';
import pasalNoAmandemenFixture from '../../src/data/fixture/pasaluud45noamandemen.json';
import pasalKetAmandemenFixture from '../../src/data/fixture/pasaluud45_ket_amandemen.json';
import babPasalFixture from '../../src/data/fixture/babpasal.json';

// ---------------------------------------------------------------------------
// Helper: bangun Response mock yang berhasil
// ---------------------------------------------------------------------------
function makeOkResponse(data) {
  return {
    ok: true,
    json: async () => data,
  };
}

function makeErrorResponse(status = 500) {
  return {
    ok: false,
    status,
    json: async () => ({}),
  };
}

// ---------------------------------------------------------------------------
// Suite utama — setiap test mendapat fresh module via vi.resetModules()
// ---------------------------------------------------------------------------

describe('Data Loader', () => {
  let loadSilaPancasila;
  let loadButirPancasila;
  let loadPembukaanUUD;
  let loadPasalUUD;
  let loadPasalUUDNoAmandemen;
  let loadPasalUUDKetAmandemen;
  let loadBabPasal;

  beforeEach(async () => {
    // Reset module registry agar _cache dikosongkan (module re-evaluated)
    vi.resetModules();
    // Stub fetch global sebelum import agar mock siap saat fungsi dipanggil
    vi.stubGlobal('fetch', vi.fn());

    // Dynamic import → module baru dengan _cache kosong
    const loader = await import('../../src/data/loader.js');
    loadSilaPancasila = loader.loadSilaPancasila;
    loadButirPancasila = loader.loadButirPancasila;
    loadPembukaanUUD = loader.loadPembukaanUUD;
    loadPasalUUD = loader.loadPasalUUD;
    loadPasalUUDNoAmandemen = loader.loadPasalUUDNoAmandemen;
    loadPasalUUDKetAmandemen = loader.loadPasalUUDKetAmandemen;
    loadBabPasal = loader.loadBabPasal;
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  // ── loadSilaPancasila ────────────────────────────────────────────────────

  describe('loadSilaPancasila()', () => {
    it('mengembalikan array teks 5 sila dari data JSON', async () => {
      fetch.mockResolvedValueOnce(makeOkResponse(silaFixture));

      const result = await loadSilaPancasila();

      expect(result).toEqual(silaFixture.data);
      expect(result).toHaveLength(5);
    });

    it('memanggil fetch dengan URL yang tepat', async () => {
      fetch.mockResolvedValueOnce(makeOkResponse(silaFixture));

      await loadSilaPancasila();

      expect(fetch).toHaveBeenCalledWith(expect.stringContaining('data/silapancasila.json'));
    });

    it('menyimpan hasil di cache — fetch hanya dipanggil sekali', async () => {
      fetch.mockResolvedValue(makeOkResponse(silaFixture));

      await loadSilaPancasila();
      await loadSilaPancasila(); // panggilan kedua
      await loadSilaPancasila(); // panggilan ketiga

      expect(fetch).toHaveBeenCalledOnce();
    });

    it('data yang dikembalikan dari cache sama persis dengan pemanggilan pertama', async () => {
      fetch.mockResolvedValue(makeOkResponse(silaFixture));

      const firstResult = await loadSilaPancasila();
      const secondResult = await loadSilaPancasila();

      // Referensi yang sama (cache mengembalikan objek yang sama)
      expect(firstResult).toBe(secondResult);
    });

    it('melempar Error dengan pesan yang jelas ketika HTTP status tidak ok', async () => {
      fetch.mockResolvedValueOnce(makeErrorResponse(404));

      await expect(loadSilaPancasila()).rejects.toThrow(/Gagal memuat data sila Pancasila/);
    });

    it('error message menyertakan HTTP status code', async () => {
      fetch.mockResolvedValueOnce(makeErrorResponse(503));

      await expect(loadSilaPancasila()).rejects.toThrow('503');
    });

    it('mengembalikan instance Error (bukan string)', async () => {
      fetch.mockResolvedValueOnce(makeErrorResponse(500));

      await expect(loadSilaPancasila()).rejects.toBeInstanceOf(Error);
    });
  });

  // ── loadButirPancasila ───────────────────────────────────────────────────

  describe('loadButirPancasila()', () => {
    it('mengembalikan array butir pancasila dari data JSON', async () => {
      fetch.mockResolvedValueOnce(makeOkResponse(butirFixture));

      const result = await loadButirPancasila();

      expect(result).toEqual(butirFixture.data);
    });

    it('data memiliki properti namasila dan arrayisi', async () => {
      fetch.mockResolvedValueOnce(makeOkResponse(butirFixture));

      const result = await loadButirPancasila();
      const firstSila = result[0];

      expect(firstSila).toHaveProperty('namasila');
      expect(firstSila).toHaveProperty('arrayisi');
      expect(Array.isArray(firstSila.arrayisi)).toBe(true);
    });

    it('memanggil fetch dengan URL yang tepat', async () => {
      fetch.mockResolvedValueOnce(makeOkResponse(butirFixture));

      await loadButirPancasila();

      expect(fetch).toHaveBeenCalledWith(expect.stringContaining('data/butir_pancasila.json'));
    });

    it('menyimpan hasil di cache — fetch hanya dipanggil sekali', async () => {
      fetch.mockResolvedValue(makeOkResponse(butirFixture));

      await loadButirPancasila();
      await loadButirPancasila();

      expect(fetch).toHaveBeenCalledOnce();
    });

    it('melempar Error ketika HTTP request gagal', async () => {
      fetch.mockResolvedValueOnce(makeErrorResponse(500));

      await expect(loadButirPancasila()).rejects.toThrow(/Gagal memuat data butir Pancasila/);
    });
  });

  // ── loadPembukaanUUD ─────────────────────────────────────────────────────

  describe('loadPembukaanUUD()', () => {
    it('mengembalikan array 4 teks alinea', async () => {
      fetch.mockResolvedValueOnce(makeOkResponse(pembukaanFixture));

      const result = await loadPembukaanUUD();

      expect(result).toEqual(pembukaanFixture.data);
      expect(result).toHaveLength(4);
    });

    it('setiap alinea adalah string teks yang tidak kosong', async () => {
      fetch.mockResolvedValueOnce(makeOkResponse(pembukaanFixture));

      const result = await loadPembukaanUUD();

      result.forEach((alinea) => {
        expect(typeof alinea).toBe('string');
        expect(alinea.length).toBeGreaterThan(0);
      });
    });

    it('memanggil fetch dengan URL yang tepat', async () => {
      fetch.mockResolvedValueOnce(makeOkResponse(pembukaanFixture));

      await loadPembukaanUUD();

      expect(fetch).toHaveBeenCalledWith(expect.stringContaining('data/pembukaanuud.json'));
    });

    it('menyimpan hasil di cache', async () => {
      fetch.mockResolvedValue(makeOkResponse(pembukaanFixture));

      await loadPembukaanUUD();
      await loadPembukaanUUD();

      expect(fetch).toHaveBeenCalledOnce();
    });

    it('melempar Error ketika HTTP request gagal', async () => {
      fetch.mockResolvedValueOnce(makeErrorResponse(503));

      await expect(loadPembukaanUUD()).rejects.toThrow(/Gagal memuat data Pembukaan UUD 1945/);
    });
  });

  // ── loadPasalUUD ──────────────────────────────────────────────────────────

  describe('loadPasalUUD()', () => {
    it('mengembalikan array pasal UUD dari data JSON', async () => {
      fetch.mockResolvedValueOnce(makeOkResponse(pasalFixture));

      const result = await loadPasalUUD();

      expect(result).toEqual(pasalFixture.data);
      expect(Array.isArray(result)).toBe(true);
    });

    it('memanggil fetch dengan URL yang tepat', async () => {
      fetch.mockResolvedValueOnce(makeOkResponse(pasalFixture));

      await loadPasalUUD();

      expect(fetch).toHaveBeenCalledWith(expect.stringContaining('data/pasaluud45.json'));
    });

    it('menyimpan hasil di cache', async () => {
      fetch.mockResolvedValue(makeOkResponse(pasalFixture));

      await loadPasalUUD();
      await loadPasalUUD();

      expect(fetch).toHaveBeenCalledOnce();
    });

    it('melempar Error ketika HTTP request gagal', async () => {
      fetch.mockResolvedValueOnce(makeErrorResponse(404));

      await expect(loadPasalUUD()).rejects.toThrow(/Gagal memuat data Pasal UUD 1945/);
    });
  });

  // ── loadBabPasal ──────────────────────────────────────────────────────────

  describe('loadBabPasal()', () => {
    it('mengembalikan full BabPasalData object (bukan properti .data)', async () => {
      fetch.mockResolvedValueOnce(makeOkResponse(babPasalFixture));

      const result = await loadBabPasal();

      // loadBabPasal() mengembalikan seluruh objek JSON, bukan .data
      expect(result).toEqual(babPasalFixture);
    });

    it('memanggil fetch dengan URL yang tepat', async () => {
      fetch.mockResolvedValueOnce(makeOkResponse(babPasalFixture));

      await loadBabPasal();

      expect(fetch).toHaveBeenCalledWith(expect.stringContaining('data/babpasal.json'));
    });

    it('menyimpan hasil di cache', async () => {
      fetch.mockResolvedValue(makeOkResponse(babPasalFixture));

      await loadBabPasal();
      await loadBabPasal();

      expect(fetch).toHaveBeenCalledOnce();
    });

    it('melempar Error ketika HTTP request gagal', async () => {
      fetch.mockResolvedValueOnce(makeErrorResponse(500));

      await expect(loadBabPasal()).rejects.toThrow(/Gagal memuat data Bab Pasal UUD 1945/);
    });
  });

  // ── loadPasalUUDNoAmandemen ──────────────────────────────────────────────

  describe('loadPasalUUDNoAmandemen()', () => {
    it('mengembalikan array pasal versi asli sebelum amandemen', async () => {
      fetch.mockResolvedValueOnce(makeOkResponse(pasalNoAmandemenFixture));

      const result = await loadPasalUUDNoAmandemen();

      expect(result).toEqual(pasalNoAmandemenFixture.data);
      expect(Array.isArray(result)).toBe(true);
    });

    it('memanggil fetch dengan URL yang tepat', async () => {
      fetch.mockResolvedValueOnce(makeOkResponse(pasalNoAmandemenFixture));

      await loadPasalUUDNoAmandemen();

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('data/pasaluud45noamandemen.json')
      );
    });

    it('menyimpan hasil di cache — fetch hanya dipanggil sekali', async () => {
      fetch.mockResolvedValue(makeOkResponse(pasalNoAmandemenFixture));

      await loadPasalUUDNoAmandemen();
      await loadPasalUUDNoAmandemen();

      expect(fetch).toHaveBeenCalledOnce();
    });

    it('melempar Error ketika HTTP request gagal', async () => {
      fetch.mockResolvedValueOnce(makeErrorResponse(404));

      await expect(loadPasalUUDNoAmandemen()).rejects.toThrow(
        /Gagal memuat data Pasal UUD 1945 \(asli\)/
      );
    });
  });

  // ── loadPasalUUDKetAmandemen ──────────────────────────────────────────────

  describe('loadPasalUUDKetAmandemen()', () => {
    it('mengembalikan array pasal dengan keterangan amandemen', async () => {
      fetch.mockResolvedValueOnce(makeOkResponse(pasalKetAmandemenFixture));

      const result = await loadPasalUUDKetAmandemen();

      expect(result).toEqual(pasalKetAmandemenFixture.data);
      expect(Array.isArray(result)).toBe(true);
    });

    it('memanggil fetch dengan URL yang tepat', async () => {
      fetch.mockResolvedValueOnce(makeOkResponse(pasalKetAmandemenFixture));

      await loadPasalUUDKetAmandemen();

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('data/pasaluud45_ket_amandemen.json')
      );
    });

    it('menyimpan hasil di cache — fetch hanya dipanggil sekali', async () => {
      fetch.mockResolvedValue(makeOkResponse(pasalKetAmandemenFixture));

      await loadPasalUUDKetAmandemen();
      await loadPasalUUDKetAmandemen();

      expect(fetch).toHaveBeenCalledOnce();
    });

    it('melempar Error ketika HTTP request gagal', async () => {
      fetch.mockResolvedValueOnce(makeErrorResponse(500));

      await expect(loadPasalUUDKetAmandemen()).rejects.toThrow(
        /Gagal memuat data Pasal UUD 1945 \(keterangan amandemen\)/
      );
    });
  });

  // ── Cache isolasi antar fungsi ────────────────────────────────────────────

  describe('Cache isolasi antar loader functions', () => {
    it('loadSilaPancasila dan loadButirPancasila memiliki cache terpisah', async () => {
      fetch
        .mockResolvedValueOnce(makeOkResponse(silaFixture))
        .mockResolvedValueOnce(makeOkResponse(butirFixture));

      await loadSilaPancasila();
      await loadButirPancasila();

      // Masing-masing memanggil fetch satu kali
      expect(fetch).toHaveBeenCalledTimes(2);
    });

    it('loadPembukaanUUD tidak menggunakan cache loadSilaPancasila', async () => {
      fetch
        .mockResolvedValueOnce(makeOkResponse(silaFixture))
        .mockResolvedValueOnce(makeOkResponse(pembukaanFixture));

      const silaResult = await loadSilaPancasila();
      const pembukaanResult = await loadPembukaanUUD();

      expect(silaResult).not.toEqual(pembukaanResult);
      expect(fetch).toHaveBeenCalledTimes(2);
    });
  });
});
