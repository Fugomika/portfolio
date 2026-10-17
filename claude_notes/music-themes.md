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

## Sumber audio: YouTube
Semua lagu sekarang pakai embed YouTube (`src/data/music.ts`):

| Lagu | Video | Channel |
|---|---|---|
| Space | `vdKdgAbluyo` | Re-Logic - Topic (resmi) |
| Iwatodai Dorm | `zByoptQ2sS0` | ATLUS Sound Team - Topic (resmi) |
| Megalovania (jazz) | `1JbKOeeGRAM` | insaneintherainmusic (arranger-nya, di-endorse Toby Fox) |
| Megalovania (slowed) | `R6l8LIk8Vas` | Mr.Blackhole (fan edit — versi slowed resmi nggak ada) |

Dipilih yang resmi kalau ada, karena upload fan lebih gampang ke-takedown.
Tiap ID dicek dua kali: (1) endpoint oEmbed YouTube (cuma jawab kalau video ada & boleh
di-embed), (2) beneran diputar di browser sampai status "now playing" — karena video
"Topic" kadang lolos oEmbed tapi tetap diblok label musiknya.

**Kalau suatu saat ada lagu yang nggak mau main** (statusnya "couldn't play this track"),
kemungkinan videonya dihapus/diblok — tinggal ganti `videoId`-nya.

### Videonya ditaruh di mana
YouTube mewajibkan player-nya kelihatan (min 200×200) selama main. Jadi videonya jadi
**"layar" di dalam kartu player**: panel kebuka → layar di atas, kontrol di bawah;
panel ditutup → kartunya mengecil jadi layar aja (musik tetap jalan). Pause → layarnya
hilang. Elemen `div` tempat iframe nempel nggak pernah dipindah/di-unmount — iframe yang
dipindah di DOM itu reload, dan lagunya bakal mulai dari awal.

### Mau ganti ke file sendiri?
`source: { kind: "file", src: "/music/nama.mp3" }` + taruh file di `public/music/`.
(Ingat soal hak cipta kalau repo-nya publik.)

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
