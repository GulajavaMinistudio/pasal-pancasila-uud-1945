# PRD: Pancasila & UUD 1945 Web App

## 1. Product Overview

### 1.1 Document Title and Version

- **PRD:** Pancasila & UUD 1945 Web App
- **Version:** 1.1.0
- **Tanggal:** 30 April 2026
- **Penulis:** Product Manager (berdasarkan analisis aplikasi Android v4.0.0)
- **Changelog:** v1.1.0 — Menambahkan fitur F-07b Perbandingan Pasal Side-by-Side (sebelumnya masuk Non-Goals)
- **Status:** Draft

### 1.2 Product Summary

Aplikasi **Pancasila & UUD 1945** adalah aplikasi referensi konstitusional Indonesia yang menyajikan isi Pancasila, Butir-butir Pancasila, Pembukaan UUD 1945, serta seluruh Pasal UUD 1945 (versi pasca-amandemen, asli sebelum amandemen, dan dengan keterangan amandemen). Saat ini aplikasi tersedia di platform Android (versi 4.0.0, package `gulajava.uud`) dan telah diunduh oleh pengguna yang membutuhkan referensi hukum dasar negara Indonesia.

Migrasi ke platform web bertujuan agar konten hukum dasar negara ini dapat diakses oleh **siapa saja, kapan saja, dan dari perangkat apa pun** — termasuk pengguna desktop, laptop, iOS, dan perangkat non-Android — tanpa perlu mengunduh aplikasi. Platform web juga memungkinkan akses yang lebih luas melalui mesin pencari (SEO), berbagi tautan langsung ke pasal tertentu, dan kemudahan pembaruan konten tanpa melalui proses rilis app store.

Produk ini ditargetkan sebagai **Progressive Web App (PWA)** agar tetap dapat diakses secara offline setelah dikunjungi pertama kali, memberikan pengalaman yang mendekati aplikasi native pada perangkat mobile maupun desktop.

---

## 2. Goals

### 2.1 Business Goals

- Memperluas jangkauan pengguna dari Android-only menjadi **semua platform** (desktop, iOS, web browser)
- Meningkatkan aksesibilitas konten konstitusional Indonesia untuk masyarakat umum tanpa hambatan instalasi
- Meningkatkan visibilitas melalui SEO sehingga konten dapat ditemukan via mesin pencari
- Mengurangi ketergantungan pada ekosistem Google Play Store untuk distribusi
- Membangun fondasi produk digital yang mudah diperbarui dan dipelihara

### 2.2 User Goals

- Dapat mengakses isi Pancasila dan UUD 1945 lengkap dari browser manapun tanpa instalasi
- Mencari pasal UUD 1945 berdasarkan kata kunci dengan cepat dan mudah
- Membagikan tautan ke pasal atau sila tertentu kepada orang lain
- Membaca konten secara offline setelah pertama kali mengunjungi aplikasi
- Menemukan pasal yang diinginkan melalui navigasi berdasarkan Bab

### 2.3 Non-Goals (Out of Scope)

- Fitur login/autentikasi pengguna (bukan kebutuhan saat ini)
- Sistem komentar atau diskusi antar pengguna
- Perbandingan pasal antar amandemen secara diff view karakter-per-karakter (word-diff atau character-diff)
- Terjemahan ke bahasa asing
- Fitur pencarian pasal berdasarkan topik hukum dengan AI/semantik
- Backend API baru (data tetap menggunakan JSON yang sudah ada)
- Fitur push notification web (fase berikutnya jika dibutuhkan)
- Fitur rating aplikasi (Play Store, tidak relevan untuk web)

---

## 3. User Personas

### 3.1 Key User Types

- Pelajar dan mahasiswa hukum/PKn yang membutuhkan referensi konstitusional
- Guru dan dosen yang membutuhkan referensi mengajar
- Masyarakat umum yang ingin mengetahui hak dan kewajiban sebagai warga negara
- Jurnalis dan peneliti yang memerlukan referensi hukum dasar
- Pengguna aplikasi Android yang ingin beralih ke web

### 3.2 Basic Persona Details

- **Budi (Pelajar SMA/Mahasiswa)**: Berusia 16-24 tahun, menggunakan smartphone (Android/iOS) dan laptop. Sering mencari referensi untuk tugas PKn atau hukum tata negara. Membutuhkan akses cepat ke pasal tertentu tanpa instalasi aplikasi.
- **Ibu Sari (Guru PKn)**: Berusia 30-50 tahun, menggunakan laptop dan tablet di kelas. Membutuhkan tampilan yang jelas dan dapat ditampilkan ke proyektor. Sering berbagi referensi ke grup WhatsApp siswa.
- **Reza (Masyarakat Umum)**: Berusia 25-40 tahun, pengguna aktif media sosial. Kadang menemukan topik konstitusional di media sosial dan ingin langsung memeriksa bunyi pasalnya. Mengharapkan konten yang bisa langsung dibagikan ke WhatsApp/Instagram.
- **Pak Hendra (Pengguna Existing Android)**: Sudah menggunakan aplikasi Android v4.0.0, ingin juga mengakses dari perangkat iOS atau browser laptop tanpa mengunduh ulang.

### 3.3 Role-Based Access

- **Pengunjung (Guest)**: Dapat mengakses semua konten, melakukan pencarian, berbagi tautan, melaporkan koreksi pasal, dan memberikan saran masukan. Tidak memerlukan login.
- **Admin/Developer** *(bukan fitur produk, internal)*: Memperbarui file JSON data dan melakukan deployment

---

## 4. Functional Requirements

- **F-01: Tampilan Sila Pancasila** (Priority: **Tinggi**)
  - Menampilkan 5 Sila Pancasila dengan nomor urut dan ikon/simbol sila
  - Setiap sila dapat diklik untuk membuka detail dan fitur bagikan

- **F-02: Tampilan Butir-Butir Pancasila** (Priority: **Tinggi**)
  - Menampilkan butir-butir pengamalan Pancasila per sila
  - Dapat di-expand/collapse per sila
  - Setiap butir memiliki tombol bagikan

- **F-03: Tampilan Pembukaan UUD 1945** (Priority: **Tinggi**)
  - Menampilkan 4 alinea Pembukaan UUD 1945
  - Setiap alinea dapat dibagikan

- **F-04: Tampilan Pasal UUD 1945 (Pasca-Amandemen)** (Priority: **Tinggi**)
  - Daftar seluruh pasal UUD 1945 hasil amandemen
  - Setiap pasal dapat diklik untuk melihat isi lengkapnya
  - Setiap pasal dapat dibagikan sebagai teks atau tautan

- **F-05: Navigasi Berdasarkan Bab** (Priority: **Tinggi**)
  - Menampilkan 21 Bab UUD 1945 dengan daftar pasal di dalamnya
  - Navigasi hierarki: Bab → Pasal → Isi Pasal

- **F-06: Tampilan UUD 1945 Asli (Sebelum Amandemen)** (Priority: **Sedang**)
  - Menampilkan pasal-pasal UUD 1945 dalam versi asli sebelum amandemen
  - Filter berdasarkan Bab

- **F-07: Tampilan Detail Amandemen & Perbandingan Pasal** (Priority: **Sedang**)
  - Menampilkan daftar pasal-pasal yang diamandemen beserta badge keterangan amandemennya (Amandemen I-IV), dikelompokkan per nomor amandemen
  - Menampilkan urutan amandemen ke berapa setiap pasal mengalami perubahan
  - **F-07b**: Untuk setiap pasal yang diamandemen, tersedia halaman perbandingan **side-by-side** yang menampilkan:
    - Kolom kiri: teks pasal dari UUD 1945 **versi asli** (1945, sebelum amandemen)
    - Kolom kiri: keterangan "Pasal tidak ada pada UUD 1945 asli" jika pasal adalah pasal baru hasil amandemen (contoh: Pasal 7A, 7B, 22A, dst.)
    - Kolom kanan: teks pasal **pasca-amandemen terakhir** dengan badge berwarna per ayat menunjukkan nomor amandemen yang mengubah ayat tersebut
    - Badge warna per amandemen: Amandemen I (biru `#1565C0`), II (hijau `#2E7D32`), III (oranye `#E65100`), IV (ungu `#4A148C`)
    - Keterangan keterbatasan data: perbandingan hanya mencakup **asli vs. akhir** — bukan per-step per amandemen, karena data intermediate tidak tersedia
  - Halaman perbandingan dapat diakses via URL unik `/amandemen/:nomor` (contoh: `/amandemen/7`, `/amandemen/7A`)

- **F-08: Pencarian Pasal** (Priority: **Tinggi**)
  - Input pencarian real-time dengan debounce
  - Pencarian berdasarkan kata kunci pada isi pasal
  - Hasil pencarian menampilkan nama pasal dan cuplikan isi yang relevan
  - Klik hasil pencarian membuka detail pasal

- **F-09: Berbagi Konten** (Priority: **Sedang**)
  - Berbagi teks konten (Sila, Pasal, Pembukaan) via Web Share API atau salin ke clipboard
  - Berbagi tautan (deep link) langsung ke pasal/sila tertentu (shareable URL)

- **F-10: Deep Link / URL per Pasal** (Priority: **Tinggi**)
  - Setiap pasal/sila memiliki URL unik yang dapat di-bookmark dan dibagikan
  - Contoh: `/pasal/1`, `/sila/1`, `/pembukaan`, `/bab/1`

- **F-11: Koreksi Pasal & Saran Masukan** (Priority: **Rendah**)
  - Tautan ke formulir koreksi pasal (Google Forms)
  - Tautan ke formulir saran dan masukan (Google Forms)

- **F-12: Halaman Tentang Aplikasi** (Priority: **Rendah**)
  - Informasi tentang aplikasi, versi, dan kredit

- **F-13: Mode Offline (PWA)** (Priority: **Sedang**)
  - Service Worker untuk caching konten setelah kunjungan pertama
  - Aplikasi dapat diakses tanpa koneksi internet setelah dikunjungi

- **F-14: Tampilan Responsif** (Priority: **Tinggi**)
  - Layout yang optimal untuk mobile (320px+), tablet (768px+), dan desktop (1024px+)
  - Navigasi yang sesuai untuk masing-masing ukuran layar

---

## 5. User Experience

### 5.1 Entry Points & First-Time User Flow

- Pengguna menemukan aplikasi via mesin pencari (Google) saat mencari "pasal UUD 1945" atau "Pancasila"
- Pengguna mengakses langsung dari URL yang dibagikan oleh orang lain (deep link ke pasal tertentu)
- Pengguna mengakses dari link di media sosial
- Pengguna lama Android yang dialihkan dari Play Store listing ke web app

### 5.2 Core Experience

- **Landing / Halaman Utama**: Pengguna tiba di halaman utama yang langsung menampilkan navigasi ke 7 konten utama. Tidak ada splash screen yang lama — konten langsung terlihat.
  - Desain bersih dengan tab/sidebar navigasi yang jelas
  - Default menampilkan Pancasila sebagai konten pertama

- **Browsing Konten**: Pengguna berpindah antar konten (Pancasila, Pembukaan, Pasal) via tab atau menu navigasi
  - Navigasi smooth tanpa page reload penuh (SPA behavior)
  - Breadcrumb atau judul halaman yang jelas menunjukkan posisi pengguna

- **Detail Pasal**: Pengguna mengklik pasal dan melihat isi lengkap
  - Ayat-ayat ditampilkan dengan penomoran yang jelas
  - Tombol bagikan tersedia di setiap pasal
  - URL berubah sesuai pasal yang dibuka (deep linkable)

- **Pencarian**: Pengguna mengetik kata kunci dan mendapatkan hasil secara instan
  - Highlight kata kunci pada hasil pencarian
  - Saat hasil diklik, pengguna dinavigasi ke pasal tersebut

- **Berbagi**: Pengguna menekan tombol bagikan dan mendapatkan opsi salin tautan atau berbagi via native share (Web Share API)

### 5.3 Advanced Features & Edge Cases

- Jika JavaScript dinonaktifkan, halaman menampilkan pesan bahwa JavaScript diperlukan
- Jika pencarian tidak menemukan hasil, tampilkan pesan informatif
- Jika JSON data gagal dimuat, tampilkan pesan error yang ramah pengguna dengan opsi reload
- Deep link ke pasal yang tidak ada menampilkan halaman 404 yang informatif
- Pada layar sangat kecil (<320px), konten tetap terbaca dengan scroll horizontal dihindari

### 5.4 UI/UX Highlights

- Palet warna merah-putih yang mencerminkan identitas nasional Indonesia
- Tipografi yang nyaman dibaca untuk konten teks panjang (font size minimal 16px pada mobile)
- Dark mode support (opsional, fase berikutnya)
- Animasi transisi yang halus antar konten
- Bottom navigation (mobile) menampilkan 4 tab utama: Beranda, Pasal, Amandemen, dan Tentang — fixed di bagian bawah layar
- Sticky header dengan search bar yang selalu mudah diakses

---

## 6. Narrative

Budi, seorang mahasiswa hukum semester 3, sedang mengerjakan makalah tentang amendemen UUD 1945. Temannya mengirimkan link ke aplikasi web Pancasila & UUD 1945. Budi langsung membuka browser di laptopnya, mengklik tab "Bab Pasal UUD 1945", dan menavigasi ke Bab III tentang Kekuasaan Pemerintahan Negara. Ia menemukan Pasal 7A yang perlu ia kutip, mengklik tombol salin tautan, lalu menempelkannya langsung ke dalam catatan makalahnya. Keesokan harinya, saat presentasi di kelas, ia membuka halaman yang sama dari tablet milik kampus tanpa perlu mengunduh apa pun — konten langsung tampil karena tersimpan di cache browser. Dengan aplikasi ini, Budi mendapatkan referensi konstitusional yang terpercaya, cepat, dan mudah dibagikan dari perangkat apa pun.

---

## 7. Success Metrics

### 7.1 User-Centric Metrics

- **Adoption**: 10.000 pengguna unik (unique visitors) dalam 3 bulan pertama sejak launch
- **Retention**: 30% pengguna kembali mengunjungi dalam 7 hari setelah kunjungan pertama
- **Session Duration**: Rata-rata durasi sesi ≥ 2 menit (menunjukkan pengguna benar-benar membaca konten)
- **Search Usage**: ≥ 25% sesi menggunakan fitur pencarian pasal
- **Share Rate**: ≥ 5% sesi menggunakan fitur berbagi konten
- **PWA Install Rate**: ≥ 3% pengunjung mobile menginstal PWA ke home screen

### 7.2 Business Metrics

- **SEO Ranking**: Muncul di halaman 1 Google untuk query "pasal UUD 1945", "Pancasila sila 1-5", "pembukaan UUD 1945" dalam 6 bulan
- **Organic Traffic**: ≥ 70% traffic berasal dari organic search
- **Cross-Platform Reach**: ≥ 30% traffic dari perangkat non-Android (iOS, desktop)

### 7.3 Technical Metrics

- **Core Web Vitals**: LCP < 2.5 detik, FID < 100ms, CLS < 0.1 (Good)
- **Lighthouse Score**: Performance ≥ 90, Accessibility ≥ 90, SEO ≥ 95, PWA ≥ 80
- **Uptime**: ≥ 99.5% availability
- **Time to Interactive (TTI)**: < 3 detik pada koneksi 4G
- **Offline Functionality**: 100% konten dapat diakses offline setelah kunjungan pertama

---

## 8. Technical Considerations (Input untuk Mode Spesifikasi)

### 8.1 Integration Points

- **Data Source**: 7 file JSON yang ada di assets Android akan dimigrasikan sebagai static JSON di web app
  - `silapancasila.json`, `butir_pancasila.json`, `pembukaanuud.json`
  - `pasaluud45.json`, `babpasal.json`, `pasaluud45noamandemen.json`, `pasaluud45_ket_amandemen.json`
- **Web Share API**: Untuk fitur berbagi native di perangkat mobile
- **Clipboard API**: Fallback untuk berbagi di perangkat yang tidak mendukung Web Share API
- **Service Worker API**: Untuk implementasi PWA dan caching offline
- **Google Analytics (GA4)**: Pengganti Firebase Analytics untuk tracking web
- **Google Forms**: Tautan ke formulir koreksi dan saran masukan (sudah ada, tidak berubah)

### 8.2 Data Storage & Privacy

- Semua data konten bersifat **statis dan publik** — tidak ada data pribadi pengguna yang dikumpulkan
- Tidak ada database server yang diperlukan (static site)
- Analytics hanya mengumpulkan data anonim (page views, event clicks) sesuai GDPR/kebijakan Google
- Tidak ada fitur login, sehingga tidak ada penyimpanan data autentikasi
- Cookie hanya digunakan untuk keperluan analytics (perlu banner consent jika ada regulasi)

### 8.3 Scalability & Performance Targets

- Aplikasi bersifat **static** — dapat di-host di CDN (Vercel, Netlify, GitHub Pages, Cloudflare Pages) untuk skalabilitas otomatis
- Ukuran bundle JavaScript awal (initial load) harus < 200KB (gzipped)
- Seluruh data JSON dikemas bersama aplikasi (tidak ada API calls ke server eksternal)
- Total ukuran data JSON (7 file) diperkirakan < 500KB — cocok untuk bundling statis
- Gambar dan ikon menggunakan SVG atau format modern (WebP) untuk efisiensi

### 8.4 Potential Technical Challenges

- **Struktur URL / Routing**: SPA memerlukan penanganan routing client-side dengan fallback `index.html` di server/hosting
- **SEO untuk SPA**: Jika menggunakan framework SPA murni (React/Vue tanpa SSR), mesin pencari mungkin kesulitan mengindex konten — pertimbangkan SSG (Static Site Generation) dengan Next.js atau Astro
- **Pencarian Real-time di Client**: Algoritma filter pasal dari 37+ pasal harus efisien; pertimbangkan library lightweight seperti Fuse.js
- **Data JSON Besar**: File `pasaluud45.json` berisi semua pasal dalam satu baris — perlu di-format ulang dan divalidasi
- **Deep Link Sharing**: URL yang bisa di-bookmark dan dibagikan langsung ke pasal tertentu memerlukan routing yang tepat
- **Kompatibilitas Browser**: Web Share API tidak tersedia di semua browser desktop — butuh fallback UI

---

## 9. Milestones & Sequencing

### 9.1 Project Estimate

- **Ukuran Proyek:** Medium
- **Estimasi Total:** 6–8 minggu (1 developer full-stack atau 2 developer frontend)

### 9.2 Team Size & Composition

- **Tim Kecil (2 orang):** 1 Frontend Developer (React/Vue/Next.js), 1 UI/UX Designer
- **Tim Minimal (1 orang):** 1 Frontend Developer dengan kemampuan UI

### 9.3 Suggested Phases

- **Fase 1 — Fondasi & Setup** (1–2 minggu)
  - Setup project (framework, routing, CI/CD, hosting)
  - Migrasi dan validasi semua 7 file JSON data
  - Implementasi komponen navigasi utama (sidebar/tab)
  - Implementasi halaman: Pancasila, Butir Pancasila, Pembukaan UUD

- **Fase 2 — Konten Utama & Pencarian** (2–3 minggu)
  - Implementasi halaman: Pasal UUD, Bab Pasal, UUD Asli, Detail Amandemen
  - Implementasi fitur Pencarian Pasal (real-time filter)
  - Implementasi Deep Link / URL per pasal

- **Fase 3 — PWA, Sharing & Polish** (1–2 minggu)
  - Implementasi Service Worker (offline support, PWA)
  - Implementasi fitur Berbagi (Web Share API + Clipboard fallback)
  - Responsif design untuk semua breakpoint
  - SEO optimization (meta tags, Open Graph, sitemap)
  - Integrasi Google Analytics (GA4)
  - Testing lintas browser dan perangkat

- **Fase 4 — Launch & Monitoring** (1 minggu)
  - User Acceptance Testing (UAT)
  - Soft launch & monitoring Core Web Vitals
  - Bug fixes pasca launch

---

## 10. User Stories

### 10.1 Melihat Sila Pancasila

- **ID:** GH-001
- **Description:** Sebagai pengguna, saya ingin melihat daftar 5 Sila Pancasila beserta nomor dan teks lengkapnya, agar saya dapat membaca dan memahami dasar negara Indonesia.
- **Acceptance Criteria:**
  - Halaman Pancasila menampilkan semua 5 sila dengan nomor urut (1–5)
  - Teks setiap sila ditampilkan lengkap dan terbaca jelas
  - Ikon/simbol pancasila (bintang, rantai, pohon beringin, kepala banteng, padi kapas) ditampilkan untuk setiap sila (opsional v1)
  - Halaman dapat diakses via URL `/pancasila`

### 10.2 Melihat Butir-Butir Pancasila

- **ID:** GH-002
- **Description:** Sebagai pengguna, saya ingin melihat butir-butir pengamalan Pancasila per sila, agar saya memahami penjabaran nilai setiap sila.
- **Acceptance Criteria:**
  - Setiap sila ditampilkan dengan daftar butir-butirnya
  - Dapat expand/collapse per sila untuk efisiensi layar
  - Jumlah butir per sila ditampilkan dengan benar (Sila 1: 7 butir, dst.)
  - Halaman dapat diakses via URL `/butir-pancasila`

### 10.3 Melihat Pembukaan UUD 1945

- **ID:** GH-003
- **Description:** Sebagai pengguna, saya ingin membaca 4 alinea Pembukaan UUD 1945 secara lengkap, agar saya dapat merujuk pada teks konstitusi yang otentik.
- **Acceptance Criteria:**
  - Keempat alinea Pembukaan UUD 1945 ditampilkan secara berurutan
  - Label "Alinea 1", "Alinea 2", dst. ditampilkan
  - Halaman dapat diakses via URL `/pembukaan`

### 10.4 Melihat Daftar dan Isi Pasal UUD 1945

- **ID:** GH-004
- **Description:** Sebagai pengguna, saya ingin melihat daftar pasal UUD 1945 dan membaca isi lengkap setiap pasal, agar saya dapat merujuk ke pasal-pasal konstitusi yang berlaku.
- **Acceptance Criteria:**
  - Daftar semua pasal (Pasal 1 hingga Pasal 37) ditampilkan
  - Klik pada nama pasal menampilkan isi pasal lengkap beserta ayat-ayatnya
  - Setiap pasal memiliki URL unik (contoh: `/pasal/1`, `/pasal/6A`)
  - Tombol "kembali ke daftar" tersedia pada halaman detail pasal

### 10.5 Navigasi Pasal Berdasarkan Bab

- **ID:** GH-005
- **Description:** Sebagai pengguna, saya ingin menelusuri pasal berdasarkan Bab UUD 1945, agar saya dapat menemukan pasal berdasarkan topik/subjeknya.
- **Acceptance Criteria:**
  - 21 Bab UUD 1945 ditampilkan beserta nama dan keterangan Bab
  - Setiap Bab dapat di-expand untuk menampilkan daftar pasal di dalamnya
  - Klik pada nama pasal membuka detail pasal
  - Halaman dapat diakses via URL `/bab-pasal`

### 10.6 Melihat UUD 1945 Asli (Sebelum Amandemen)

- **ID:** GH-006
- **Description:** Sebagai peneliti atau akademisi, saya ingin membaca teks UUD 1945 dalam versi asli sebelum diamandemen, agar saya dapat membandingkan dengan versi amandemen.
- **Acceptance Criteria:**
  - Daftar pasal UUD 1945 asli ditampilkan dengan penanda "UUD 1945 Asli"
  - Filter berdasarkan Bab tersedia
  - Klik pada pasal menampilkan isi pasal versi asli
  - Halaman dapat diakses via URL `/uud-asli`

### 10.7 Melihat Detail Amandemen Pasal

- **ID:** GH-007
- **Description:** Sebagai pengguna, saya ingin mengetahui pasal mana yang diamandemen dan amandemen ke berapa, agar saya memahami sejarah perubahan konstitusi.
- **Acceptance Criteria:**
  - Daftar pasal yang mengalami amandemen ditampilkan
  - Setiap pasal menampilkan keterangan "Amandemen I/II/III/IV"
  - Isi pasal setelah diamandemen ditampilkan
  - Halaman dapat diakses via URL `/amandemen`

### 10.8 Mencari Pasal dengan Kata Kunci

- **ID:** GH-008
- **Description:** Sebagai pengguna, saya ingin mencari pasal berdasarkan kata kunci dalam isi pasal, agar saya dapat menemukan pasal yang relevan dengan topik yang saya cari.
- **Acceptance Criteria:**
  - Input pencarian tersedia dan mudah diakses
  - Hasil pencarian muncul secara real-time saat pengguna mengetik (dengan debounce ≤ 500ms)
  - Hasil menampilkan nama pasal dan cuplikan isi yang mengandung kata kunci
  - Kata kunci di-highlight pada hasil pencarian
  - Jika tidak ada hasil, tampilkan pesan "Tidak ada pasal yang mengandung kata kunci tersebut"
  - Klik pada hasil membuka detail pasal
  - Pencarian dapat diakses via URL `/cari?q=kata-kunci`

### 10.9 Berbagi Konten Pasal atau Sila

- **ID:** GH-009
- **Description:** Sebagai pengguna, saya ingin membagikan isi pasal atau sila kepada orang lain melalui pesan atau media sosial, agar saya dapat menyebarkan informasi konstitusional.
- **Acceptance Criteria:**
  - Tombol "Bagikan" tersedia pada setiap Sila, Pasal, Butir Pancasila, dan Pembukaan
  - Di perangkat mobile yang mendukung Web Share API: membuka native share sheet
  - Di perangkat yang tidak mendukung Web Share API: tombol "Salin Tautan" dan "Salin Teks" tersedia
  - Tautan yang dibagikan mengarah langsung ke konten yang dimaksud (deep link)

### 10.10 Membuka Pasal atau Sila Langsung melalui URL

- **ID:** GH-010
- **Description:** Sebagai pengguna, saya ingin dapat membuka atau membagikan URL spesifik yang langsung menuju ke pasal atau sila tertentu, agar saya tidak perlu menavigasi dari halaman utama setiap kali ingin mengakses konten yang sama.
- **Acceptance Criteria:**
  - Setiap pasal memiliki URL unik dalam format `/pasal/{nomor}` (contoh: `/pasal/1`, `/pasal/6A`)
  - Setiap sila memiliki URL unik dalam format `/sila/{nomor}` (contoh: `/sila/1`)
  - Halaman Pembukaan dapat diakses via URL `/pembukaan`
  - Halaman navigasi Bab dapat diakses via URL `/bab-pasal`
  - URL yang tidak valid (pasal/sila yang tidak ada) menampilkan halaman 404 yang informatif
  - URL dapat di-bookmark dan ketika dibuka kembali, langsung menampilkan konten yang dituju
  - Saat pengguna membuka pasal melalui URL langsung, navigasi breadcrumb/sidebar tetap menunjukkan konteks halaman

### 10.11 Mengakses Konten Secara Offline

- **ID:** GH-011
- **Description:** Sebagai pengguna yang sering berada di area dengan koneksi terbatas, saya ingin tetap dapat mengakses konten UUD 1945 dan Pancasila meski sedang offline, agar saya tidak terhalang konektivitas.
- **Acceptance Criteria:**
  - Setelah kunjungan pertama dengan koneksi internet, semua konten dapat diakses tanpa internet
  - Indikator visual ditampilkan saat pengguna sedang dalam mode offline
  - Fitur pencarian tetap berfungsi secara offline
  - Manifest PWA tersedia sehingga pengguna dapat menginstal ke home screen

### 10.12 Melaporkan Koreksi Pasal dan Memberikan Saran

- **ID:** GH-012
- **Description:** Sebagai pengguna yang peduli pada kualitas konten, saya ingin melaporkan kesalahan pada isi pasal dan memberikan saran atau masukan untuk pengembangan aplikasi, agar kualitas data dan fitur aplikasi terus meningkat.
- **Acceptance Criteria:**
  - Tautan/tombol "Laporkan Koreksi Pasal" tersedia di menu atau halaman konten
  - Klik membuka formulir Google Forms koreksi pasal (`https://goo.gl/forms/FqJaKWIFc7zfWJk02`) di tab baru
  - Tautan/tombol "Saran & Masukan" tersedia di menu
  - Klik membuka formulir Google Forms saran masukan (`https://goo.gl/forms/3NazuUvigHNkZ9R93`) di tab baru
  - Kedua tautan tersedia di semua halaman konten

### 10.13 Tampilan Responsif pada Semua Perangkat

- **ID:** GH-013
- **Description:** Sebagai pengguna yang mengakses dari berbagai perangkat, saya ingin tampilan aplikasi tetap nyaman dibaca dan digunakan baik dari mobile maupun desktop.
- **Acceptance Criteria:**
  - Layout menyesuaikan pada breakpoint: mobile (< 768px), tablet (768px–1024px), desktop (> 1024px)
  - Tidak ada scroll horizontal pada layar mobile
  - Font size minimal 16px pada konten teks
  - Tombol/link memiliki area tap minimal 44x44px (accessibility)
  - Bottom navigation (mobile) menampilkan tab aktif dengan visual feedback warna merah primary

### 10.14 Melihat Halaman Tentang Aplikasi

- **ID:** GH-014
- **Description:** Sebagai pengguna, saya ingin melihat informasi tentang aplikasi, termasuk versi dan sumber data yang digunakan, agar saya mengetahui kredibilitas dan keterbaruan konten.
- **Acceptance Criteria:**
  - Halaman "Tentang Aplikasi" dapat diakses dari menu navigasi
  - Menampilkan nama aplikasi, versi, dan deskripsi singkat
  - Menampilkan informasi sumber data (data diambil dari dokumen resmi UUD 1945)
  - Menampilkan kredit pengembang
  - Halaman dapat diakses via URL `/tentang`

---

*Dokumen ini merupakan draft PRD v1.0 dan terbuka untuk revisi berdasarkan masukan stakeholder sebelum masuk ke tahap Technical Specification.*
