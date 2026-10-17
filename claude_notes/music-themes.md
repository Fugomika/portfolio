# Musik + tema warna per lagu (fugo.fm)

## Cara kerjanya
- Tombol not balok di **kiri bawah** → buka player "fugo.fm" (ada di semua halaman,
  termasuk blog, karena dipasang di `layout.tsx`).
- Tekan ▶ → **seluruh web ganti palet** sesuai lagu + efek latar:
  - **Space (Terraria)** — biru-ungu gelap, bintang kelap-kelip + bintang jatuh. Default.
  - **Iwatodai Dorm (Persona 3)** — biru & putih, partikel cahaya naik pelan.
  - **Megalovania jazz / slowed** — hitam & putih, garis "glitch" tipis lewat sesekali.
- Pause → balik ke tema normal kamu (light/dark). Ganti lagu sambil main → warnanya
  **memudar** ke palet baru (bukan loncat).
- Lagu terakhir yang dipilih disimpan di `localStorage` (`fugo_track`). Status play
  sengaja **nggak** disimpan: browser ngeblok autoplay bersuara, jadi musik baru bisa
  mulai setelah pengunjung klik ▶.

## Sumber audio: file kamu sendiri (+ 2 dari YouTube)

| Lagu | Sumber | Cover |
|---|---|---|
| Space Day (default) | `Space Day.mp3` | `Terraria.jpeg` |
| Iwatodai Dorm -Reload- | `Iwatodai Dorm.mp3` | `Persona.jpeg` |
| Song That Plays When Somebody Verses Sans | `Song That Plays When Somebody Verses Sans.mp3` | `Undertale.png` |
| Megalovania (jazz) | YouTube `1JbKOeeGRAM` | `Undertale.png` |
| Megalovania (slowed) | YouTube `R6l8LIk8Vas` | `Undertale.png` |

Judul & credit diambil dari metadata MP3-nya: Iwatodai yang kamu kasih itu versi
**Reload**, dan lagu Sans itu "Pacifist Sans Fight" dari OST 10th Anniversary — **bukan**
Megalovania. Dua Megalovania (jazz/slowed) belum ada file-nya, jadi masih streaming dari
YouTube (label "yt" di daftar lagu). Mau dibuang? Hapus aja dua objek itu di `music.ts`.

### Kenapa file-nya bisa tetap di root repo (nggak dipindah ke `public/`)
Next cuma nyajiin file apa adanya dari `public/`. Tapi bundler (Turbopack) bisa "ngangkut"
file dari mana aja kalau di-*import*:
- Gambar: `import cover from "../../Terraria.jpeg"` → `cover.src` (fitur bawaan).
- Audio: `new URL("../../Space Day.mp3", import.meta.url).href` → pola standar bundler
  buat file apa pun.
Pas build, dua-duanya disalin ke `out/_next/static/media/` dengan nama ber-hash
(`Space Day.0hqi1z57hroeh.mp3`). Bonus: kalau isi file-nya kamu ganti, hash-nya ganti →
browser pengunjung otomatis ambil yang baru, nggak nyangkut di cache.
**Kalau nama file-nya diubah, update juga path-nya di `src/data/music.ts`.**

### Video YouTube (cuma buat 2 Megalovania)
YouTube mewajibkan player kelihatan (≥200×200), jadi pas lagu "yt" main, videonya jadi
"layar" di dalam kartu player (panel ditutup → tinggal layarnya). Lagu dari file nggak
nampilin layar — cukup cover-nya.

### Kontrol OS
Pakai Media Session API: tombol media di keyboard (play/pause/next/prev) jalan, dan
judul + cover muncul di widget "now playing" OS / lock screen HP.

### Soal hak cipta
Lagu-lagu ini berhak cipta (Re-Logic, ATLUS, Toby Fox). Repo + GitHub Pages-mu publik,
jadi file-nya ikut tersebar. Biasanya aman-aman aja buat portfolio kecil, tapi kalau ada
DMCA, gampang balik: hapus file-nya dan ganti `source` ke `youtube`.

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
