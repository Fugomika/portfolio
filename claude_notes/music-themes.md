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
| Space Day | `Space Day.mp3` | `Terraria.jpeg` | biru-ungu gelap | bintang + bintang jatuh |
| Iwatodai Dorm -Reload- | `Iwatodai Dorm.mp3` | `Persona.jpeg` | biru & putih | partikel cahaya naik |
| Song That Plays When Somebody Verses Sans | `Song That Plays When Somebody Verses Sans.mp3` | `Undertale.png` | hitam & putih | garis glitch |

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
