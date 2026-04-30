---
title: Spesifikasi Data Schema Pancasila & UUD 1945
version: 1.0.0
date_created: 2026-04-28
last_updated: 2026-04-29
owner: Development Team
status: final
tags:
  - data
  - schema
  - json
  - specification
---
<!-- markdownlint-disable -->

# 1. Introduction

## 1.1 Purpose & Scope

Dokumen ini mendefinisikan schema data lengkap untuk seluruh konten aplikasi **Pancasila & UUD 1945**. Data berasal dari 7 file JSON yang merupakan assets dari aplikasi Android v4.0.0 (package `gulajava.uud`). Dokumen ini menjadi single source of truth untuk struktur data, tipe, constraint, relasi, dan validasi yang harus dipenuhi dalam implementasi aplikasi web.

**Scope:**

- Dokumentasi schema lengkap untuk ke-7 file JSON
- TypeScript interfaces untuk type safety
- Relasi dan dependency antar file data
- Rules validasi data
- Transformasi data yang diperlukan untuk web
- Edge cases dan anomali dalam data existing

**Target Audience:**

- Frontend Developer (import dan konsumsi data)
- QA Engineer (validasi integritas data)
- Data Maintainer (update dan koreksi konten)

---

## 2. Definitions

| Istilah          | Definisi                                                                         |
| ---------------- | -------------------------------------------------------------------------------- |
| **Schema**       | Struktur dan constraint dari data JSON                                           |
| **Interface**    | TypeScript type definition yang merepresentasikan shape data                     |
| **Constraint**   | Aturan yang harus dipenuhi oleh nilai suatu field                                |
| **Relation**     | Hubungan antar entitas di file JSON yang berbeda                                 |
| **Transformasi** | Proses mengubah format data untuk kebutuhan konsumsi di web                      |
| **Nomor Pasal**  | Identifier pasal yang dapat berupa angka ("1") atau alfanumerik ("6A", "7B")     |
| **Amandemen**    | Perubahan terhadap UUD 1945 yang terjadi pada periode 1999-2002 (Amandemen I-IV) |

---

## 3. Requirements, Constraints & Guidelines

### 3.1 Data Requirements

- **REQ-DAT-001**: Seluruh file JSON harus valid dan dapat di-parse oleh `JSON.parse()` tanpa error
- **REQ-DAT-002**: Encoding seluruh file harus UTF-8 untuk mendukung karakter Indonesia
- **REQ-DAT-003**: Tidak boleh ada field yang bernilai `null` atau `undefined` pada field wajib
- **REQ-DAT-004**: Setiap pasal harus memiliki `namapasal` yang unik dalam satu file
- **REQ-DAT-005**: Field `amandemen` pada file keterangan amandemen harus berisi nilai valid: "0", "1", "2", "3", "4", atau kombinasi dengan separator "/"
- **REQ-DAT-006**: Array `data` pada setiap file tidak boleh kosong
- **REQ-DAT-007**: Setiap item dalam `arrayisi` harus memiliki field `isi` dengan tipe `string` dan tidak boleh string kosong

### 3.2 Constraints

- **CON-DAT-001**: Total ukuran semua file JSON tidak boleh melebihi 1MB (agar feasible untuk bundling statis)
- **CON-DAT-002**: File JSON tidak boleh di-modify secara runtime; hanya read-only
- **CON-DAT-003**: Tidak boleh ada circular reference antar file JSON
- **CON-DAT-004**: Karakter khusus HTML (`<`, `>`, `&`) dalam teks harus tetap di-escape pada saat render ke DOM
- **CON-DAT-005**: Nomor pasal di file `pasaluud45.json` harus cocok dengan nomor pasal di `babpasal.json`

### 3.3 Guidelines

- **GUD-DAT-001**: Import file JSON menggunakan `import` statement TypeScript dengan assertion `type: "json"` (ES2022)
- **GUD-DAT-002**: Gunakan `readonly` modifier pada TypeScript interfaces untuk immutability
- **GUD-DAT-003**: Validasi data pada build time menggunakan JSON Schema validator (opsional)
- **GUD-DAT-004**: Simpan data JSON di direktori `public/data/` atau `src/data/` sesuai kebutuhan bundling

---

## 4. Interfaces & Data Contracts

### 4.1 File Overview

| #   | Nama File                       | Tipe Konten           | Jumlah Records    | Estimasi Ukuran |
| --- | ------------------------------- | --------------------- | ----------------- | --------------- |
| 1   | `silapancasila.json`            | 5 Sila Pancasila      | 5                 | ~1KB            |
| 2   | `butir_pancasila.json`          | Butir-butir per Sila  | 5 sila, 45+ butir | ~8KB            |
| 3   | `pembukaanuud.json`             | 4 Alinea Pembukaan    | 4                 | ~2KB            |
| 4   | `pasaluud45.json`               | Pasal pasca-amandemen | 37+ pasal         | ~30KB           |
| 5   | `pasaluud45noamandemen.json`    | Pasal asli            | 37+ pasal         | ~25KB           |
| 6   | `pasaluud45_ket_amandemen.json` | Keterangan amandemen  | 37+ pasal         | ~35KB           |
| 7   | `babpasal.json`                 | Struktur 21 Bab       | 21 bab            | ~3KB            |

### 4.2 Schema Detail: `silapancasila.json`

File ini berisi teks lengkap dari 5 Sila Pancasila.

#### TypeScript Interface

```typescript
/**
 * @file silapancasila.json
 * @description Daftar 5 Sila Pancasila
 */
interface SilaPancasilaData {
  /** Array berisi 5 elemen teks sila */
  readonly data: readonly string[];
}
```

#### Field Specification

| Field     | Type       | Required | Constraint       | Description                        |
| --------- | ---------- | -------- | ---------------- | ---------------------------------- |
| `data`    | `string[]` | Yes      | Length === 5     | Array berisi teks lengkap sila 1-5 |
| `data[n]` | `string`   | Yes      | Non-empty string | Teks sila ke-n (1-indexed)         |

#### Contoh Data Lengkap

```json
{
  "data": [
    "Ketuhanan Yang Maha Esa.",
    "Kemanusiaan Yang Adil Dan Beradab.",
    "Persatuan Indonesia.",
    "Kerakyatan Yang Dipimpin Oleh Hikmat Kebijaksanaan Dalam Permusyawaratan/Perwakilan.",
    "Keadilan Sosial Bagi Seluruh Rakyat Indonesia."
  ]
}
```

#### Mapping ke UI

| Index | Label UI | URL Route |
| ----- | -------- | --------- |
| 0     | Sila 1   | `/sila/1` |
| 1     | Sila 2   | `/sila/2` |
| 2     | Sila 3   | `/sila/3` |
| 3     | Sila 4   | `/sila/4` |
| 4     | Sila 5   | `/sila/5` |

---

### 4.3 Schema Detail: `butir_pancasila.json`

File ini berisi butir-butir pengamalan Pancasila yang dikelompokkan per sila.

#### TypeScript Interface

```typescript
/**
 * @file butir_pancasila.json
 * @description Butir-butir pengamalan Pancasila per sila
 */
interface ButirItem {
  /** Teks butir pengamalan */
  readonly isi: string;
}

interface ButirSila {
  /** Nama sila, format: "Sila 1" s.d. "Sila 5" */
  readonly namasila: string;
  /** Array butir-butir untuk sila ini */
  readonly arrayisi: readonly ButirItem[];
}

interface ButirPancasilaData {
  readonly data: readonly ButirSila[];
}
```

#### Field Specification

| Field                     | Type          | Required | Constraint                | Description             |
| ------------------------- | ------------- | -------- | ------------------------- | ----------------------- |
| `data`                    | `ButirSila[]` | Yes      | Length === 5              | Array 5 sila            |
| `data[n].namasila`        | `string`      | Yes      | Pattern: `/^Sila [1-5]$/` | Nama sila               |
| `data[n].arrayisi`        | `ButirItem[]` | Yes      | Length >= 1               | Daftar butir pengamalan |
| `data[n].arrayisi[m].isi` | `string`      | Yes      | Non-empty, max 500 chars  | Teks butir pengamalan   |

#### Distribusi Butir per Sila

| Sila      | Jumlah Butir  |
| --------- | ------------- |
| Sila 1    | 7 butir       |
| Sila 2    | 10 butir      |
| Sila 3    | 9 butir       |
| Sila 4    | 10 butir      |
| Sila 5    | 9 butir       |
| **Total** | **~45 butir** |

#### Contoh Data (Sila 1 - 2 butir pertama)

```json
{
  "data": [
    {
      "namasila": "Sila 1",
      "arrayisi": [
        {
          "isi": "Bangsa Indonesia menyatakan kepercayaannya dan ketakwaannya terhadap Tuhan Yang Maha Esa."
        },
        {
          "isi": "Manusia Indonesia percaya dan takwa terhadap Tuhan Yang Maha Esa, sesuai dengan agama dan kepercayaannya masing-masing menurut dasar kemanusiaan yang adil dan beradab."
        }
      ]
    }
  ]
}
```

---

### 4.4 Schema Detail: `pembukaanuud.json`

File ini berisi 4 alinea Pembukaan UUD 1945.

#### TypeScript Interface

```typescript
/**
 * @file pembukaanuud.json
 * @description 4 Alinea Pembukaan UUD 1945
 */
interface PembukaanUUDData {
  /** Array berisi 4 alinea pembukaan */
  readonly data: readonly string[];
}
```

#### Field Specification

| Field     | Type       | Required | Constraint       | Description      |
| --------- | ---------- | -------- | ---------------- | ---------------- |
| `data`    | `string[]` | Yes      | Length === 4     | Array 4 alinea   |
| `data[n]` | `string`   | Yes      | Non-empty string | Teks alinea ke-n |

#### Mapping Alinea

| Index | Label UI       | Konteks                                               |
| ----- | -------------- | ----------------------------------------------------- |
| 0     | Alinea Pertama | Hak kemerdekaan dan anti-penjajahan                   |
| 1     | Alinea Kedua   | Perjuangan kemerdekaan Indonesia                      |
| 2     | Alinea Ketiga  | Deklarasi kemerdekaan                                 |
| 3     | Alinea Keempat | Tujuan pembentukan UUD 1945 (Pancasila dalam kalimat) |

#### Contoh Data Lengkap

```json
{
  "data": [
    "Bahwa sesungguhnya Kemerdekaan itu ialah hak segala bangsa dan oleh sebab itu, maka penjajahan di atas dunia harus dihapuskan, karena tidak sesuai dengan peri-kemanusiaan dan peri-keadilan.",
    "Dan perjuangan pergerakan kemerdekaan Indonesia telah sampailah kepada saat yang berbahagia dengan selamat sentausa mengantarkan rakyat Indonesia ke depan pintu gerbang kemerdekaan Negara Indonesia, yang merdeka, bersatu, berdaulat, adil dan makmur.",
    "Atas berkat rakhmat Allah Yang Maha Kuasa dan dengan didorongkan oleh keinginan luhur, supaya berkehidupan kebangsaan yang bebas, maka rakyat Indonesia menyatakan dengan ini kemerdekaannya.",
    "Kemudian daripada itu untuk membentuk suatu Pemerintah Negara Indonesia yang melindungi segenap bangsa Indonesia dan seluruh tumpah darah Indonesia dan untuk memajukan kesejahteraan umum, mencerdaskan kehidupan bangsa, dan ikut melaksanakan ketertiban dunia yang berdasarkan kemerdekaan, perdamaian abadi dan keadilan sosial, maka disusunlah Kemerdekaan Kebangsaan Indonesia itu dalam suatu Undang-Undang Dasar Negara Indonesia, yang terbentuk dalam suatu susunan Negara Republik Indonesia yang berkedaulatan rakyat dengan berdasar kepada Ketuhanan Yang Maha Esa, Kemanusiaan yang adil dan beradab, Persatuan Indonesia dan Kerakyatan yang dipimpin oleh hikmat kebijaksanaan dalam Permusyawaratan/Perwakilan, serta dengan mewujudkan suatu Keadilan sosial bagi seluruh rakyat Indonesia."
  ]
}
```

---

### 4.5 Schema Detail: `pasaluud45.json` (Pasca-Amandemen)

File ini berisi seluruh pasal UUD 1945 dalam versi pasca-amandemen (versi berlaku saat ini).

#### TypeScript Interface

```typescript
/**
 * @file pasaluud45.json
 * @description Pasal UUD 1945 versi pasca-amandemen (berlaku)
 */
interface AyatPasal {
  /** Teks isi ayat */
  readonly isi: string;
}

interface PasalUUDItem {
  /** Nama pasal, format: "Pasal {nomor}" */
  readonly namapasal: string;
  /** Array ayat-ayat dalam pasal */
  readonly arrayisi: readonly AyatPasal[];
}

interface PasalUUDData {
  readonly data: readonly PasalUUDItem[];
}
```

#### Field Specification

| Field                     | Type             | Required | Constraint                          | Description        |
| ------------------------- | ---------------- | -------- | ----------------------------------- | ------------------ |
| `data`                    | `PasalUUDItem[]` | Yes      | Length >= 37                        | Daftar semua pasal |
| `data[n].namapasal`       | `string`         | Yes      | Pattern: `/^Pasal [1-9][0-9A-Z]*$/` | Identifier pasal   |
| `data[n].arrayisi`        | `AyatPasal[]`    | Yes      | Length >= 1                         | Ayat-ayat pasal    |
| `data[n].arrayisi[m].isi` | `string`         | Yes      | Non-empty string                    | Teks ayat          |

#### Format Nomor Pasal

Nomor pasal tidak selalu angka murni. Beberapa pasal memiliki suffix huruf:

| Contoh Nomor | Jenis                            |
| ------------ | -------------------------------- |
| `Pasal 1`    | Angka biasa                      |
| `Pasal 6A`   | Angka + suffix huruf (amandemen) |
| `Pasal 7B`   | Angka + suffix huruf             |
| `Pasal 18B`  | Angka + suffix huruf             |
| `Pasal 22A`  | Angka + suffix huruf             |

#### Contoh Data (Pasal 1)

```json
{
  "data": [
    {
      "arrayisi": [
        {
          "isi": "Negara Indonesia ialah Negara Kesatuan yang berbentuk Republik."
        },
        {
          "isi": "Kedaulatan berada di tangan rakyat dan dilaksanakan menurut Undang-Undang Dasar."
        },
        {
          "isi": "Negara Indonesia adalah negara hukum."
        }
      ],
      "namapasal": "Pasal 1"
    }
  ]
}
```

---

### 4.6 Schema Detail: `pasaluud45noamandemen.json` (Asli Sebelum Amandemen)

File ini berisi pasal UUD 1945 dalam bentuk asli sebelum amandemen, dengan tambahan field `babpasal`.

#### TypeScript Interface

```typescript
/**
 * @file pasaluud45noamandemen.json
 * @description Pasal UUD 1945 versi asli sebelum amandemen
 */
interface PasalUUDNoAmandemenItem {
  readonly namapasal: string;
  /** Nama bab tempat pasal berada */
  readonly babpasal: string;
  readonly arrayisi: readonly AyatPasal[];
}

interface PasalUUDNoAmandemenData {
  readonly data: readonly PasalUUDNoAmandemenItem[];
}
```

#### Field Specification

| Field       | Type                        | Required | Constraint                          | Description       |
| ----------- | --------------------------- | -------- | ----------------------------------- | ----------------- |
| `data`      | `PasalUUDNoAmandemenItem[]` | Yes      | Length >= 37                        | Daftar pasal asli |
| `namapasal` | `string`                    | Yes      | Pattern: `/^Pasal [1-9][0-9A-Z]*$/` | Nama pasal        |
| `babpasal`  | `string`                    | Yes      | Non-empty string                    | Nama bab lengkap  |
| `arrayisi`  | `AyatPasal[]`               | Yes      | Length >= 1                         | Ayat-ayat pasal   |

#### Contoh Data (Pasal 1 Asli)

```json
{
  "data": [
    {
      "arrayisi": [
        {
          "isi": "Negara Indonesia ialah Negara kesatuan yang berbentuk Republik."
        },
        {
          "isi": "Kedaulatan adalah di tangan rakyat, dan dilakukan sepenuhnya oleh Majelis Permusyawaratan Rakyat."
        }
      ],
      "namapasal": "Pasal 1",
      "babpasal": "Bab I Bentuk dan Kedaulatan"
    }
  ]
}
```

#### Perbedaan dengan Versi Pasca-Amandemen

| Aspek          | Asli                                      | Pasca-Amandemen                           |
| -------------- | ----------------------------------------- | ----------------------------------------- |
| `babpasal`     | Ada                                       | Tidak ada                                 |
| Pasal 1 Ayat 2 | "dilakukan sepenuhnya oleh MPR"           | "dilaksanakan menurut UUD"                |
| Pasal 3        | MPR menetapkan UUD dan garis besar haluan | MPR berwenang mengubah dan menetapkan UUD |

---

### 4.7 Schema Detail: `pasaluud45_ket_amandemen.json` (Keterangan Amandemen)

File ini berisi pasal dengan keterangan amandemen (Amandemen I-IV) dan field tambahan `amandemen`.

#### TypeScript Interface

```typescript
/**
 * @file pasaluud45_ket_amandemen.json
 * @description Pasal UUD 1945 dengan keterangan amandemen
 */
interface PasalUUDKetAmandemenItem {
  readonly namapasal: string;
  readonly babpasal: string;
  /**
   * Keterangan amandemen:
   * - "0" = Tidak diamandemen
   * - "1" = Amandemen I (1999)
   * - "2" = Amandemen II (2000)
   * - "3" = Amandemen III (2001)
   * - "4" = Amandemen IV (2002)
   * - "1/2", "3/4", dst = Kombinasi amandemen
   */
  readonly amandemen: string;
  readonly arrayisi: readonly AyatPasal[];
}

interface PasalUUDKetAmandemenData {
  readonly data: readonly PasalUUDKetAmandemenItem[];
}
```

#### Field Specification

| Field       | Type                         | Required | Constraint                          | Description                    |
| ----------- | ---------------------------- | -------- | ----------------------------------- | ------------------------------ |
| `data`      | `PasalUUDKetAmandemenItem[]` | Yes      | Length >= 37                        | Daftar pasal dengan keterangan |
| `namapasal` | `string`                     | Yes      | Pattern: `/^Pasal [1-9][0-9A-Z]*$/` | Nama pasal                     |
| `babpasal`  | `string`                     | Yes      | Non-empty string                    | Nama bab lengkap               |
| `amandemen` | `string`                     | Yes      | Pattern: `/^[0-4](/[0-4])*$/`       | Keterangan amandemen           |
| `arrayisi`  | `AyatPasal[]`                | Yes      | Length >= 1                         | Ayat-ayat pasal                |

#### Nilai Valid untuk Field `amandemen`

| Nilai   | Arti                      |
| ------- | ------------------------- |
| `"0"`   | Tidak mengalami amandemen |
| `"1"`   | Amandemen I               |
| `"2"`   | Amandemen II              |
| `"3"`   | Amandemen III             |
| `"4"`   | Amandemen IV              |
| `"1/2"` | Amandemen I dan II        |
| `"3/4"` | Amandemen III dan IV      |

#### Contoh Data

```json
{
  "data": [
    {
      "namapasal": "Pasal 1",
      "arrayisi": [
        {
          "isi": "Negara Indonesia ialah Negara Kesatuan yang berbentuk Republik."
        },
        {
          "isi": "Kedaulatan berada di tangan rakyat dan dilaksanakan menurut Undang-Undang Dasar. (Amendemen Ketiga)"
        },
        {
          "isi": "Negara Indonesia adalah negara hukum. (Amendemen Ketiga)"
        }
      ],
      "babpasal": "Bab I Bentuk dan Kedaulatan",
      "amandemen": "3"
    },
    {
      "namapasal": "Pasal 3",
      "arrayisi": [
        {
          "isi": "Majelis Permusyawaratan Rakyat berwenang mengubah dan menetapkan Undang-Undang Dasar. (Amendemen Ketiga)"
        },
        {
          "isi": "Majelis Permusyawaratan Rakyat melantik Presiden dan/atau Wakil Presiden. (Amendemen Ketiga dan Keempat)"
        },
        {
          "isi": "Majelis Permusyawaratan Rakyat hanya dapat memberhentikan Presiden dan/atau Wakil Presiden dalam masa jabatannya menurut Undang-Undang Dasar. (Amendemen Ketiga dan Keempat)"
        }
      ],
      "babpasal": "Bab II Majelis Permusyawaratan Rakyat",
      "amandemen": "3/4"
    }
  ]
}
```

---

### 4.8 Schema Detail: `babpasal.json`

File ini berisi struktur hierarki 21 Bab UUD 1945 beserta daftar pasal di dalamnya.

#### TypeScript Interface

```typescript
/**
 * @file babpasal.json
 * @description Struktur 21 Bab UUD 1945 dengan mapping pasal
 */
interface BabPasalItem {
  /** Nama bab singkat, contoh: "Bab I", "BAB II", "Bab III" */
  readonly nama_bab: string;
  /** Daftar pasal dalam bab ini */
  readonly isi_bab: readonly string[];
}

interface BabPasalData {
  /** Nama bab lengkap, contoh: "Bab I Bentuk dan Kedaulatan" */
  readonly bab_pasal: readonly string[];
  /** Keterangan singkat bab */
  readonly keterangan_bab_pasal: readonly string[];
  /** Detail pasal per bab */
  readonly isi_bab_pasal: readonly BabPasalItem[];
}
```

#### Field Specification

| Field                       | Type             | Required | Constraint       | Description                                            |
| --------------------------- | ---------------- | -------- | ---------------- | ------------------------------------------------------ |
| `bab_pasal`                 | `string[]`       | Yes      | Length === 21    | Nama bab lengkap                                       |
| `keterangan_bab_pasal`      | `string[]`       | Yes      | Length === 21    | Keterangan singkat bab                                 |
| `isi_bab_pasal`             | `BabPasalItem[]` | Yes      | Length === 21    | Detail struktur bab                                    |
| `isi_bab_pasal[n].nama_bab` | `string`         | Yes      | Non-empty string | Nama bab (format tidak konsisten: "Bab I" vs "BAB II") |
| `isi_bab_pasal[n].isi_bab`  | `string[]`       | Yes      | Array string     | Daftar pasal (format: "Pasal 1", "Pasal 2", dst.)      |

#### Catatan Penting: Inkonsistensi Format `nama_bab`

Format `nama_bab` tidak konsisten antar entry:

| Index | `nama_bab` | Normalized |
| ----- | ---------- | ---------- |
| 0     | `Bab I`    | `Bab I`    |
| 1     | `BAB II`   | `Bab II`   |
| 2     | `Bab III`  | `Bab III`  |
| 3     | `Bab IV`   | `Bab IV`   |

**Rekomendasi Transformasi:** Normalisasi semua `nama_bab` ke format `Bab {Roman}` dengan kapitalisasi title case saat runtime.

#### Daftar Lengkap 21 Bab

| No  | Nama Bab                                                          | Pasal               | Keterangan                                                 |
| --- | ----------------------------------------------------------------- | ------------------- | ---------------------------------------------------------- |
| 1   | Bab I Bentuk dan Kedaulatan                                       | Pasal 1             | Bentuk dan Kedaulatan                                      |
| 2   | Bab II Majelis Permusyawaratan Rakyat                             | Pasal 2-3           | Majelis Permusyawaratan Rakyat                             |
| 3   | Bab III Kekuasaan Pemerintahan Negara                             | Pasal 4-16          | Kekuasaan Pemerintahan Negara                              |
| 4   | Bab IV Dewan Pertimbangan Agung (Dihapus)                         | Pasal sudah dihapus | Dewan Pertimbangan Agung (Dihapus)                         |
| 5   | Bab V Kementerian Negara                                          | Pasal 17            | Kementerian Negara                                         |
| 6   | Bab VI Pemerintahan Daerah                                        | Pasal 18, 18A, 18B  | Pemerintahan Daerah                                        |
| 7   | Bab VII Dewan Perwakilan Rakyat                                   | Pasal 19-22A        | Dewan Perwakilan Rakyat                                    |
| 8   | Bab VIIA Dewan Perwakilan Daerah                                  | Pasal 22B-22E       | Dewan Perwakilan Daerah                                    |
| 9   | Bab VIIB Pemilihan Umum                                           | Pasal 22F-22O       | Pemilihan Umum                                             |
| 10  | Bab VIII Hal Keuangan                                             | Pasal 23-23E        | Hal Keuangan                                               |
| 11  | Bab VIIIA Badan Pemeriksa Keuangan                                | Pasal 23E-23G       | Badan Pemeriksa Keuangan                                   |
| 12  | Bab IX Kekuasaan Kehakiman                                        | Pasal 24-27         | Kekuasaan Kehakiman                                        |
| 13  | Bab IXA Wilayah Negara                                            | Pasal 25-25A        | Wilayah Negara                                             |
| 14  | Bab X Warga Negara dan Penduduk                                   | Pasal 26-28         | Warga Negara dan Penduduk                                  |
| 15  | Bab XA Hak Asasi Manusia                                          | Pasal 28A-28J       | Hak Asasi Manusia                                          |
| 16  | Bab XI Agama                                                      | Pasal 29            | Agama                                                      |
| 17  | Bab XII Pertahanan dan Keamanan Negara                            | Pasal 30            | Pertahanan dan Keamanan Negara                             |
| 18  | Bab XIII Pendidikan dan Kebudayaan                                | Pasal 31-32         | Pendidikan dan Kebudayaan                                  |
| 19  | Bab XIV Perekonomian Nasional dan Kesejahteraan Sosial            | Pasal 33-34         | Perekonomian Nasional dan Kesejahteraan Sosial             |
| 20  | Bab XV Bendera, Bahasa, dan Lambang Negara, serta Lagu Kebangsaan | Pasal 35-36         | Bendera, Bahasa, dan Lambang Negara, serta Lagu Kebangsaan |
| 21  | Bab XVI Perubahan Undang Undang Dasar                             | Pasal 37            | Perubahan Undang Undang Dasar                              |

---

## 5. Relasi Antar File Data

### 5.1 Relasi Diagram

```
┌─────────────────────┐
│  babpasal.json      │
│  (Struktur 21 Bab)  │
└──────────┬──────────┘
           │
           │ references
           │
     ┌─────┴─────┐
     │           │
     ▼           ▼
┌──────────┐ ┌──────────────────────────┐
│pasaluud45│ │pasaluud45noamandemen.json│
│.json      │ │(Asli Sebelum Amandemen)  │
│(Pasca-    │ └──────────────┬───────────┘
│ Amandemen)│                │
└─────┬─────┘                │
      │                      │
      │                      ▼
      │         ┌──────────────────────────┐
      │         │pasaluud45_ket_amandemen  │
      │         │.json                     │
      │         │(Keterangan Amandemen)    │
      │         └──────────────────────────┘
      │
      │ (searchable)
      ▼
┌─────────────────┐     ┌──────────────────┐
│ silapancasila   │     │ butir_pancasila  │
│ .json           │     │ .json            │
│ (5 Sila)        │     │ (Butir per Sila) │
└─────────────────┘     └──────────────────┘

┌─────────────────┐
│ pembukaanuud    │
│ .json           │
│ (4 Alinea)      │
└─────────────────┘
```

### 5.2 Foreign Key Mapping

| File Sumber                     | Field                         | File Target          | Field Target        | Relasi                                     |
| ------------------------------- | ----------------------------- | -------------------- | ------------------- | ------------------------------------------ |
| `babpasal.json`                 | `isi_bab_pasal[n].isi_bab[m]` | `pasaluud45.json`    | `data[n].namapasal` | 1:1 (dereferensi nama)                     |
| `pasaluud45noamandemen.json`    | `data[n].namapasal`           | `pasaluud45.json`    | `data[m].namapasal` | 1:1 (pasal yang sama, versi berbeda)       |
| `pasaluud45_ket_amandemen.json` | `data[n].namapasal`           | `pasaluud45.json`    | `data[m].namapasal` | 1:1 (pasal yang sama + metadata amandemen) |
| `butir_pancasila.json`          | `data[n].namasila`            | `silapancasila.json` | `data[index]`       | 1:1 (Sila ke-n)                            |

---

## 6. Acceptance Criteria

### 6.1 Integritas Data

- **AC-DAT-001**: Given file JSON dimuat, When di-parse, Then tidak ada `SyntaxError` dan struktur sesuai schema
- **AC-DAT-002**: Given `pasaluud45.json` dimuat, When dihitung jumlah pasal, Then total >= 37 pasal
- **AC-DAT-003**: Given `babpasal.json` di-inspeksi, When dihitung jumlah bab, Then total === 21 bab
- **AC-DAT-004**: Given `silapancasila.json` di-inspeksi, When dihitung jumlah sila, Then total === 5 sila
- **AC-DAT-005**: Given `pembukaanuud.json` di-inspeksi, When dihitung jumlah alinea, Then total === 4 alinea

### 6.2 Konsistensi Cross-File

- **AC-DAT-006**: Given semua `namapasal` di `pasaluud45.json` diekstrak, When dibandingkan dengan daftar pasal di `babpasal.json`, Then setiap pasal di `babpasal` memiliki pasangan di `pasaluud45`
- **AC-DAT-007**: Given `pasaluud45_ket_amandemen.json` di-inspeksi, When dicek field `amandemen`, Then setiap nilai match dengan pattern `/^[0-4](/[0-4])*$/`
- **AC-DAT-008**: Given `butir_pancasila.json` di-inspeksi, When dicek field `namasila`, Then nilai berurutan dari "Sila 1" sampai "Sila 5"

### 6.3 Validasi Konten

- **AC-DAT-009**: Given setiap item `arrayisi` di semua file, When dicek, Then field `isi` tidak boleh string kosong `""`
- **AC-DAT-010**: Given `pasaluud45noamandemen.json` di-inspeksi, When dicek field `babpasal`, Then tidak ada nilai `null` atau `undefined`
- **AC-DAT-011**: Given file `pasaluud45.json` di-inspeksi, When dicek, Then tidak ada field tambahan selain `namapasal` dan `arrayisi`

---

## 7. Transformasi Data untuk Web

### 7.1 Transformasi yang Diperlukan

| Transformasi            | Sumber                                              | Target                                   | Alasan                                       |
| ----------------------- | --------------------------------------------------- | ---------------------------------------- | -------------------------------------------- |
| Normalisasi `nama_bab`  | `babpasal.json`                                     | Title case: "Bab I", "Bab II"            | Inkonsistensi case di source                 |
| Ekstrak nomor pasal     | `"Pasal 6A"`                                        | `"6A"`                                   | Untuk routing parameter `:nomor`             |
| Build search index      | `pasaluud45.json`                                   | Array flat `{namapasal, isi, ayatIndex}` | Untuk pencarian Fuse.js                      |
| Merge pasal + amandemen | `pasaluud45.json` + `pasaluud45_ket_amandemen.json` | Object enriched                          | Tampilan detail pasal dengan badge amandemen |
| Build bab-pasal map     | `babpasal.json`                                     | Map<string, string[]>                    | Lookup O(1) saat filter berdasarkan bab      |

### 7.2 Contoh Transformasi: Build Search Index

```typescript
// Transformasi untuk Fuse.js search index
import pasalData from '../data/pasaluud45.json';

interface SearchIndexItem {
  readonly id: string;           // "Pasal 1"
  readonly nomor: string;        // "1"
  readonly ayatIndex: number;    // 0-based
  readonly isi: string;          // teks ayat
}

function buildSearchIndex(data: typeof pasalData.data): SearchIndexItem[] {
  const index: SearchIndexItem[] = [];

  for (const pasal of data) {
    const nomor = pasal.namapasal.replace('Pasal ', '');
    for (let i = 0; i < pasal.arrayisi.length; i++) {
      index.push({
        id: pasal.namapasal,
        nomor,
        ayatIndex: i,
        isi: pasal.arrayisi[i].isi,
      });
    }
  }

  return index;
}
```

### 7.3 Contoh Transformasi: Merge dengan Amandemen

```typescript
import pasalData from '../data/pasaluud45.json';
import amandemenData from '../data/pasaluud45_ket_amandemen.json';

interface EnrichedPasal {
  readonly namapasal: string;
  readonly nomor: string;
  readonly arrayisi: readonly { readonly isi: string }[];
  readonly amandemen: string | null;
  readonly babpasal: string | null;
}

function enrichPasalData(): EnrichedPasal[] {
  const amandemenMap = new Map(
    amandemenData.data.map(item => [item.namapasal, item])
  );

  return pasalData.data.map(pasal => {
    const amandemenItem = amandemenMap.get(pasal.namapasal);
    return {
      ...pasal,
      nomor: pasal.namapasal.replace('Pasal ', ''),
      amandemen: amandemenItem?.amandemen ?? null,
      babpasal: amandemenItem?.babpasal ?? null,
    };
  });
}
```

---

## 8. Dependencies & External Integrations

- **DAT-EXT-001**: Tidak ada dependensi ke external API — seluruh data bersifat self-contained
- **DAT-EXT-002**: File JSON dapat di-import secara native di TypeScript 4.5+ dengan `"resolveJsonModule": true`
- **DAT-EXT-003**: Build tool (Vite) akan meng-inline file JSON ke bundle atau menyalin ke output `dist/` sesuai konfigurasi

---

## 9. Examples & Edge Cases

### 9.1 Edge Cases dalam Data

| Skenario                              | Lokasi                                | Handling                                                             |
| ------------------------------------- | ------------------------------------- | -------------------------------------------------------------------- |
| Pasal dengan 1 ayat saja              | `Pasal 37`                            | Render tanpa nomor ayat (atau dengan nomor 1)                        |
| Pasal tanpa amandemen                 | `amandemen: "0"`                      | Tidak tampilkan badge amandemen                                      |
| Bab IV (Dihapus)                      | `isi_bab: ["Pasal sudah dihapus..."]` | Tampilkan pesan khusus, tidak navigable ke detail pasal              |
| Nomor pasal alfanumerik               | `"Pasal 6A"`, `"Pasal 22A"`           | Parsing regex: `/^Pasal\s+(\d+[A-Z]?)$/`                             |
| `nama_bab` tidak konsisten case       | `"Bab I"` vs `"BAB II"`               | Normalisasi ke title case saat render                                |
| File JSON dalam satu baris (minified) | Semua file                            | Di-format ulang (prettify) saat commit ke repo web untuk readability |
| Teks mengandung tanda baca khusus     | `"Permusyawaratan/Perwakilan"`        | Pertahankan original, escape HTML saat render                        |

### 9.2 Contoh Validasi Schema (Zod)

```typescript
import { z } from 'zod';

const AyatSchema = z.object({
  isi: z.string().min(1),
});

const PasalUUDSchema = z.object({
  namapasal: z.string().regex(/^Pasal [1-9][0-9A-Z]*$/),
  arrayisi: z.array(AyatSchema).min(1),
});

const PasalUUDDataSchema = z.object({
  data: z.array(PasalUUDSchema).min(1),
});

// Usage
const parsed = PasalUUDDataSchema.parse(jsonData);
```

---

## 10. Validation Criteria

Dokumen schema dianggap valid apabila:

- [ ] **VAL-DAT-001**: Semua 7 file JSON telah terdokumentasi dengan interface TypeScript lengkap
- [ ] **VAL-DAT-002**: Setiap field memiliki deskripsi, tipe, constraint, dan contoh nilai
- [ ] **VAL-DAT-003**: Relasi antar file telah terdefinisi dengan foreign key mapping
- [ ] **VAL-DAT-004**: Edge cases dan anomali dalam data telah teridentifikasi dengan handling strategy
- [ ] **VAL-DAT-005**: Transformasi data untuk kebutuhan web telah didokumentasikan
- [ ] **VAL-DAT-006**: Acceptance criteria untuk integritas data telah mencakup cross-file consistency

---

## 11. Related Specifications / Further Reading

- [Spesifikasi Arsitektur: Pancasila & UUD 1945 Web App](./spec-architecture-pasaluud1945-webapp.md)
- [Spesifikasi Design System & UI/UX](./spec-design-uiux-pasaluud1945.md)
- [Spesifikasi Process Workflow](./spec-process-workflow-pasaluud1945.md)
- [Spesifikasi SEO & Metadata](./spec-seo-pasaluud1945.md)
- [PRD: Pancasila & UUD 1945 Web App](../prd_pasaluud1945_webapp.md)
- [TypeScript Handbook: Interfaces](https://www.typescriptlang.org/docs/handbook/2/objects.html)
- [Zod Documentation](https://zod.dev/)
- [JSON Schema Specification](https://json-schema.org/)

---

*Dokumen ini merupakan spesifikasi data schema v1.0.0 dan menjadi referensi utama untuk konsumsi dan transformasi data dalam implementasi aplikasi web.*
