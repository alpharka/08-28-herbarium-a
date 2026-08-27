# Arah Visual Undangan Digital

## Tiga Pendekatan Awal

### Pendekatan 1 — Herbarium Senja
**Very Brief Intro:** Editorial botanical yang hangat, seperti halaman herbarium tua yang dipadukan dengan cahaya sore dan fotografi analog. Nuansanya intim, dewasa, dan personal tanpa terasa rustic berlebihan.

**Probability:** 0.07

### Pendekatan 2 — Arsitektur Pagi
**Very Brief Intro:** Minimalisme arsitektural dengan bidang kertas gading, garis denah tipis, dan tipografi serif yang tenang. Emosinya bersih, refined, dan kontemporer.

**Probability:** 0.03

### Pendekatan 3 — Pesisir Garam
**Very Brief Intro:** Coastal modern yang mengambil rasa dari angin laut, linen, dan cahaya putih kebiruan. Terasa lapang dan ringan, tetapi tetap dibangun dengan struktur editorial.

**Probability:** 0.09

## Pendekatan Terpilih: Herbarium Senja

### Design Movement
**Contemporary editorial botanical** dengan pengaruh tactile paper, fotografi analog 35mm, dan botanical study. Layout terasa seperti membuka lembaran jurnal perjalanan yang dirancang khusus untuk satu pasangan.

### Core Principles
1. **Tactile over glossy:** tekstur kertas, grain halus, dan garis cetak menjadi lapisan rasa; tidak memakai glassmorphism atau kilau berlebihan.
2. **Editorial asymmetry:** konten disusun dengan kolom offset, nomor bab, garis margin, dan ruang kosong yang aktif; bukan tumpukan kartu seragam.
3. **Warm restraint:** warna dan dekorasi cukup berkarakter untuk dikenali, tetapi memberi ruang utama pada cerita pasangan dan foto.
4. **Gentle movement:** swipe, reveal, dan transisi masuk mengikuti sensasi membalik halaman—tenang, responsif, dan tidak teatrikal.

### Color Philosophy
Palet berangkat dari warna halaman buku tua dan daun yang terkena cahaya sore. **Ivory Paper** menjadi kanvas yang terasa intim; **Moss Ink** memberi ketenangan dan bobot editorial; **Terracotta Thread** berfungsi sebagai aksen manusiawi seperti benang pada binding; **Plum Shadow** dipakai sangat terbatas untuk kedalaman malam dan kontras. Warna dipilih agar undangan terasa hangat di layar mobile, bukan sekadar dekoratif.

- Ivory Paper: `#F4EFE6`
- Bone: `#E6DDCF`
- Moss Ink: `#2E3A32`
- Terracotta Thread: `#B9684E`
- Plum Shadow: `#4A3441`
- Olive Mist: `#A3AD91`

### Layout Paradigm
Satu alur vertikal yang dibagi menjadi **bab-bab editorial**, dengan pengalaman mobile yang bisa diswipe kanan–kiri antar section utama. Setiap section memiliki penanda bab kecil, garis vertikal yang berpindah, dan komposisi yang berganti antara full-bleed image, split text, dan detail event yang memanjang. Sticky bottom navigation menjadi "binding" yang selalu hadir, bukan sekadar toolbar.

### Signature Elements
1. **Garis herbarium:** garis tipis dengan titik-titik kecil yang menghubungkan nomor bab, tanggal, dan label section.
2. **Cap inisial:** emblem dua huruf yang menyerupai cap tinta botani, dipakai di cover, header, footer, dan favicon.
3. **Terracotta thread:** aksen garis atau underline pendek berwarna terracotta sebagai penanda aksi penting.

### Interaction Philosophy
Interaksi terasa seperti membuka jurnal: tombol utama memberi respons tekan singkat, swipe menggeser satu bab dengan snap yang jelas, dan navigasi section tetap terlihat tanpa mengambil alih konten. Setiap aksi memiliki label kontekstual yang jelas; tidak ada elemen dekoratif yang mengorbankan aksesibilitas.

### Animation
- Cover keluar dengan `translateY(-100%)` dan fade selama 720ms menggunakan cubic-bezier yang lembut.
- Header muncul 120ms setelah cover mulai bergerak; sticky nav muncul 220ms setelahnya dengan gerak naik ringan.
- Section reveal memakai opacity + translateY 18px selama 420ms; gambar memakai scale 0.985 ke 1.
- Swipe antar bab menggunakan transform horizontal dengan snap dan easing fisik; tidak mengubah tinggi layout.
- Galeri hanya memakai zoom sangat halus saat hover/focus.
- Lightbox fade cepat 180–220ms, fokus berpindah ke dialog.
- Semua motion non-esensial dinonaktifkan di `prefers-reduced-motion: reduce`.

### Typography System
- **Display:** `Cormorant Garamond`, 500–600, italic hanya untuk aksen nama atau kalimat pendek; ukurannya besar dan bernapas.
- **Body/UI:** `DM Sans`, 400–600, untuk copy, label, tombol, dan navigasi.
- **Hierarchy:** label 10–11px uppercase dengan letter spacing, body 14–16px dengan line-height 1.75, heading section 42–64px desktop / 34–44px mobile, angka countdown memakai serif display agar terasa seperti ukiran tanggal.

### Brand Essence
**Posisi:** undangan digital editorial untuk pasangan yang ingin mengajak tamu masuk ke cerita mereka secara perlahan, personal, dan berkesan.

**Kepribadian:** intimate, composed, artisanal.

### Brand Voice
Headline, CTA, dan microcopy terdengar hangat, spesifik, dan tidak menjual. Gunakan kalimat pendek yang seolah ditulis langsung untuk tamu.

- Contoh headline: “Satu musim yang ingin kami rayakan bersama.”
- Contoh CTA: “Masuk ke cerita kami”

Hindari filler seperti “Welcome to our website” atau “Get started today”.

### Wordmark & Logo
Gunakan emblem grafis tanpa teks berupa dua daun kecil yang saling membentuk huruf **A** dan **R** di dalam lingkaran cap tinta yang sedikit tidak sempurna. Untuk implementasi pertama, gunakan SVG/CSS mark geometris yang mudah diskalakan, bukan nama pasangan dalam font default. Emblem tampil cukup besar di cover (48px) dan jelas di header/sticky nav (26px).

### Signature Brand Color
**Terracotta Thread — `#B9684E`**. Warna ini menjadi aksen yang mudah dikenali: hangat, manusiawi, dan memberi rasa "benang" yang mengikat seluruh halaman tanpa menguasai palet.

## Catatan Implementasi

Semua data pasangan disimpan di satu objek konfigurasi di halaman utama agar placeholder mudah diganti. Konten contoh tidak akan dipresentasikan sebagai testimoni atau ulasan nyata. RSVP dimulai kosong dan hanya menampilkan pesan yang dikirim pengguna di browser melalui state/localStorage. Navigasi mobile menggunakan sticky bottom navigation dan gesture swipe horizontal; desktop tetap mendapatkan header anchor navigation yang ringan.
