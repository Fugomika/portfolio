# Musik + tema warna per lagu (fugo.fm)

## Cara kerjanya (versi piringan hitam)
- Player-nya sekarang **piringan hitam di hero** (gantiin robot) — lihat bagian "vinyl
  record" di `how-this-portfolio-works.md`. Tekan **▶ START** di tengah label → lagu main,
  seluruh web ganti palet + efek latar. Tekan lagi → pause, tema balik normal.
- **Nggak ada daftar lagu.** Urutannya tetap, muter terus:
  **Space Day → Iwatodai Dorm -Reload- → Song That Plays When Somebody Verses Sans → Space Day**.
  ‹ / › di samping piringan buat lompat; lagu selesai → otomatis lanjut ke berikutnya.
- **Pill "now playing"** (`now-playing-pill.tsx`): pas lagu main dan piringannya udah
  ke-scroll lewat, muncul pill kecil di kiri bawah (piringan mini muter + judul + ❚❚).
  Klik judul → scroll balik ke piringan. Pakai `IntersectionObserver` buat tahu piringannya
  kelihatan atau nggak. Panel "fugo.fm" yang lama sudah dihapus.
- Achievement baru: **Crate digger** — muncul setelah ketiga lagu pernah diputar.
- Pause terus play lagi → lanjut dari posisi terakhir, bukan dari awal.

| Lagu | File | Cover | Palet | Efek |
|---|---|---|---|---|
| Space Day | `Space Day.mp3` | `Terraria.jpeg` | biru-ungu gelap | bintang, bintang jatuh, **pulau melayang**, **wyvern** |
| Iwatodai Dorm -Reload- | `Iwatodai Dorm.mp3` | `Persona.jpeg` | biru & putih | partikel cahaya naik (5–9px) |
| Song That Plays When Somebody Verses Sans | `Song That Plays When Somebody Verses Sans.mp3` | `Undertale.png` | hitam & putih | **tulang-tulang** lewat + garis glitch |

Judul & credit diambil dari metadata MP3: Iwatodai itu versi **Reload**, lagu Sans itu
"Pacifist Sans Fight" dari OST 10th Anniversary (bukan Megalovania). YouTube sudah nggak
dipakai sama sekali — mesin YouTube-nya dihapus biar kodenya ramping.

### Kenapa file-nya bisa tetap di root repo (nggak dipindah ke `public/`)
Next cuma nyajiin file apa adanya dari `public/`. Tapi bundler (Turbopack) bisa "ngangkut"
file dari mana aja kalau di-*import*:
- Gambar: `import cover from "../../Terraria.jpeg"` → `cover.src` (fitur bawaan).
- Audio: `new URL("../../Space Day.mp3", import.meta.url).href` → pola standar bundler.
Pas build, dua-duanya disalin ke `out/_next/static/media/` dengan nama ber-hash. Kalau isi
file diganti, hash-nya ganti → browser pengunjung otomatis ambil yang baru.
**Kalau nama file-nya diubah, update juga path-nya di `src/data/music.ts`.**

Bug kecil yang sempat ketemu: buat ngecek "lagunya ganti nggak?", kode dulu ngebandingin
`audio.src` sama URL lagu. Tapi browser nge-*normalisasi* `audio.src` (spasi jadi `%20`),
jadi selalu dianggap beda → pause/play bikin lagu mulai dari 0. Sekarang yang dibandingin
itu URL yang terakhir *kita* pasang (disimpan di `useRef`).

### Transisi yang halus
Tiga hal yang dulu "loncat" sekarang memudar bareng:
- **Warna**: 1,6 detik `ease-in-out` (variabel `@property`). `<body>` punya transisi warna
  0,2 detik sendiri buat toggle dark mode — selama fade musik itu dimatikan
  (`:root[data-music-fade] body`), karena dia terus "ngejar" variabel yang lagi bergerak
  dan bikin fade-nya patah-patah.
- **Suara**: `fadeVolume()` di `music-provider.tsx`. Pause → volume turun 0,5 dtk, baru
  di-pause (posisi tetap). Ganti lagu → lagu lama turun 0,45 dtk, lagu baru naik 0,9 dtk.
  Tiap fade baru membatalkan fade sebelumnya, jadi klik cepat berkali-kali aman. Pakai
  `setTimeout`, bukan `requestAnimationFrame`, supaya tetap selesai walau tab-nya di
  background (rAF berhenti di tab yang nggak kelihatan → lagunya nggak jadi ke-pause).
- **Efek latar**: layer efek di-*key* per jenis efek di dalam `AnimatePresence`, jadi
  bintang memudar keluar sambil partikel/tulang memudar masuk (1,4 dtk).

### Pulau melayang & wyvern (Space Day)
- **Pulau**: SVG piksel (rumput, tanah, batu yang makin runcing ke bawah, pohon, rumah
  bata kecil) yang naik-turun pelan. Sengaja ditaruh di **margin kiri/kanan** di luar
  kolom konten 1024px biar nggak nutupin teks — konsekuensinya cuma muncul di layar lebar
  (≥1280px, `xl:`).
- **Wyvern**: 12 potongan (kepala, badan, badan berkaki, ekor) yang semuanya jalan di
  **satu jalur bergelombang yang sama** pakai CSS `offset-path`, tiap potongan telat 0,12
  detik dari yang di depannya — jadi badannya ngikutin kepala kayak ular beneran.
  `offset-rotate: auto` bikin tiap potongan miring sesuai arah jalurnya. Jalurnya ~3.600px
  dan terbang 70% dari 28 dtk (~185px/dtk), jadi 0,12 dtk ≈ 22px antar potongan (potongannya
  32px, jadi sedikit numpuk). Warnanya tetap (putih-ungu kayak di Terraria), bukan ikut palet.
  Tiap potongan punya garis gelap di sisi belakang, biar keliatan beruas, bukan pipa putih.

### Tulang Sans
`<Bone>` = SVG piksel (dua kenop di tiap ujung + batang). 12 tulang dengan tinggi acak
(PRNG ber-seed), sebagian nongol dari bawah, sebagian gantung dari atas, jalan ke kiri
atau ke kanan kayak di kotak battle Undertale. Tiap ±9 detik ada satu baris tulang pendek
yang lari cepat di lantai. Opacity 0,5 biar teks putih di atasnya tetap kebaca.

### Kontrol OS
Media Session API: tombol media di keyboard (play/pause/next/prev) jalan, dan judul + cover
muncul di widget "now playing" OS / lock screen HP.

### Soal hak cipta
Lagu-lagu ini berhak cipta (Re-Logic, ATLUS, Toby Fox) dan ikut tersebar lewat repo +
GitHub Pages publik. Biasanya aman buat portfolio kecil; kalau ada DMCA, hapus file-nya.

## Bagian teknis yang menarik
- **Fade satu web**: warna-warna (`--paper`, `--ink`, `--lime`, …) didaftarkan pakai
  `@property` di `globals.css`. Variabel CSS biasa nggak bisa di-animasi; yang terdaftar
  sebagai `<color>` bisa. Transisinya cuma aktif ~1 detik (`data-music-fade`) biar toggle
  dark mode biasa tetap cepat.
- Palet ditimpa lewat inline style di `<html>` (menang lawan `.dark`). Atribut
  `data-music-scheme` bilang paletnya gelap/terang, dan varian Tailwind `dark:` sekarang
  ngikutin itu — makanya bintang di robot muncul di Space & Megalovania walau kamu di
  light mode.
- Teks di atas tombol aksen dulu hardcode `#26221a`; sekarang token `--on-lime`, biar
  palet biru-putih bisa pakai teks putih.
- Efek latar (`music-fx.tsx`) pakai PRNG ber-seed, bukan `Math.random()`, jadi posisinya
  stabil. Di belakang konten (`-z-10`), nggak bisa diklik, dan **mati total** kalau
  `prefers-reduced-motion` (paletnya tetap ganti).
