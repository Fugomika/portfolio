# Projects: grid 3×3 + halaman + modal "research paper"

## Apa yang berubah
- **Satu kartu = satu proyek.** Dulu "Techno Infinity" dan "Mockups" itu kartu payung
  yang isinya banyak app. Sekarang dipecah jadi proyek masing-masing (Talentern, Cash
  Connected, TIGOR, dst) → total 18 proyek. Data, tanggal, deskripsi, dan screenshot
  diambil dari `dev-files/json/projects.json` (sumber portfolio lama), jadi bukan karangan.
  Framing "kerja di Techno Infinity untuk klien X" dijaga lewat field `affiliation`.
- **Grid 3×3 + pagination** (`src/components/projects.tsx`): 9 kartu per halaman,
  diurutkan terbaru dulu berdasarkan `start`. Ganti halaman → kalau kamu udah scroll
  lewat atas section, dia scroll balik ke judul "Projects".
- **Modal ala paper** (`src/components/project-paper.tsx`): judul tengah, nama + afiliasi
  bertanda ¹, "Abstract—", "Index Terms—" (= stack), Fig. 1 lebar penuh, lalu body
  **dua kolom** (CSS `columns-2`) berisi section bernomor + figur, dan "References"
  (= links). Font serif **Source Serif 4** (lewat `next/font`, variabel `--font-paper`,
  dipakai sebagai `font-serif` di Tailwind).

## Cara nambah proyek
Tambah satu objek di array `all` di `src/data/projects.ts` — posisinya bebas, urutannya
otomatis dari `start` (`"YYYY-MM"`). Field wajib: `slug, title, tagline, start, kind,
affiliation, role, abstract, stack, links`. Opsional: `end` (`"YYYY-MM"` / `"present"`),
`sections` (paragraf bernomor), `figures` (figur pertama = cover kartu).
Screenshot taruh di `public/img/projects/<folder>/<nama>.webp`, panggil pakai helper
`img("<folder>", "<nama>")`. Proyek tanpa figur dapat cover "dither" + inisial.

## Keputusan kecil yang perlu kamu tahu
- **Gambar dikonversi ke WebP** (16 MB → 2,1 MB) pakai ImageMagick, max lebar 1400px.
  Screenshot `audit-ism-pelni/raw` sengaja **nggak** diambil — itu folder mentah, belum
  dikurasi, rawan data klien. Jadi Pelni QHSSE belum punya gambar.
- Link MakanApa dibenerin: repo-nya `makan-apa`, bukan `MakanApa` (dulu 404).
- Stack Bloom dibenerin: repo-nya JavaScript + Supabase, bukan TypeScript.
- Kenapa dua kolom pakai CSS `columns` dan bukan grid: teksnya *mengalir* dari kolom kiri
  ke kanan kayak paper beneran, dan figur nggak kepotong karena `break-inside-avoid`.

## Keyboard
- Di modal: ← → pindah proyek, Esc tutup. Klik figur → lightbox (Esc cuma nutup lightbox,
  bukan paper-nya — handler paper diam selama lightbox kebuka).
- Pas modal ditutup, fokus balik ke kartu proyek yang terakhir dibuka (bukan kartu awal),
  jadi pengguna keyboard nggak "nyasar".
