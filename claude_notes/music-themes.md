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

## Nambah audio (masih kosong — "theme only")
Di `src/data/music.ts`, isi `source` di track-nya, pilih salah satu:
```ts
source: { kind: "youtube", videoId: "xxxxxxxxxxx" }, // dari youtube.com/watch?v=xxxxxxxxxxx
source: { kind: "file", src: "/music/space.mp3" },   // file di public/music/
```
Dua-duanya sudah dites jalan (pakai file tes & video YouTube tes, lalu dihapus lagi).
- **YouTube**: aturan YouTube mewajibkan player-nya kelihatan (≥200×200), jadi pas lagu
  YouTube main, video kecil muncul di atas player. Nggak ada file di repo-mu.
- **File**: player full custom, tanpa iklan — tapi lagu-lagu ini berhak cipta (Atlus,
  Toby Fox, Re-Logic); nge-host MP3-nya di GitHub Pages publik = risiko DMCA.
Nambah lagu baru = tambah objek di array `tracks` (judul, credit, `palette`, `effect`).

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
