# Blog + galeri screenshot proyek (modal)

Dua fitur baru yang nutup celah dari portfolio lama (`dev-porto`).

## 1. Blog

### Alur data
Artikel = file Markdown biasa di `content/blog/*.md`, tiap file punya frontmatter:

```markdown
---
title: "Judul Artikel"
excerpt: "Ringkasan singkat buat kartu di halaman list."
---

Isi artikel dalam Markdown biasa…
```

- `src/lib/blog.ts` — baca folder, parse frontmatter (manual, karena cuma title+excerpt jadi nggak perlu dependency YAML), render body Markdown → HTML pakai **`marked`**. Reading time dihitung dari jumlah kata.
- `src/app/blog/page.tsx` — halaman `/blog` (server component): ambil semua post, kirim ke `BlogList`.
- `src/components/blog-list.tsx` — client component: search box yang mem-filter judul + excerpt secara real-time.
- `src/app/blog/[slug]/page.tsx` — halaman baca `/blog/<slug>`. `generateStaticParams()` bikin semua route di-*prerender* jadi HTML statis saat build (penting karena situs pakai `output: export`).
- `.prose-pixel` di `globals.css` — styling isi artikel (heading pixel, list, blockquote, code, tabel) yang ikut tema light/dark lewat CSS variables.

### Kenapa file lokal, bukan fetch dari Google Drive
Blog lama nge-*fetch* `.md` dari Google Drive tiap kali dibuka (via Google Apps Script). Itu rapuh: kalau script/Drive berubah, blog mati, dan tiap pengunjung nunggu request eksternal. Sekarang artikel **dibundel jadi bagian dari build** — 21 artikel asli sudah dimigrasikan sekali dari Drive ke `content/blog/`. Nambah artikel baru = bikin file `.md` baru di folder itu, commit, selesai.

### Kenapa `params` di-`await`
Di versi Next.js ini `params` sebuah **Promise** (breaking change dari versi lama). Makanya di `[slug]/page.tsx` ada `const { slug } = await params`. Kalau nggak di-await, `slug` bakal `undefined`.

## 2. Galeri screenshot proyek + modal lightbox

- Type `Project` di `src/data/projects.ts` dapat field opsional `gallery?: { src, title, link? }[]`.
- Screenshot diunduh dari repo `dev-files` (curated, 1 per sub-proyek), di-*downscale* ke maks 1400px (`sips`), disimpan di `public/img/projects/` biar situs self-contained.
- Di `projects.tsx`, kalau sebuah proyek punya `gallery`, di dalam case-study yang ke-expand muncul grid thumbnail. Klik thumbnail → buka **`Lightbox`** (`src/components/lightbox.tsx`).
- Lightbox: modal fullscreen, backdrop blur, counter (`3 / 10`), tombol prev/next, caption, dan tombol **"Visit live ↗"** kalau gambar itu punya `link`. Navigasi keyboard (← →), tutup pakai **Esc** atau klik backdrop, dan `body` scroll dikunci selama modal kebuka.

Proyek yang punya galeri sekarang: **Client work @ Techno Infinity** (10 screenshot) dan **Mockups & one-pagers** (2). Geotraking/Bloom/MakanApa sengaja tanpa galeri (client work tanpa repo publik / belum ada screenshot) — mereka tetap buka case-study teks seperti biasa.

## Navigasi
Header dapat item **Blog** (`/blog`). Link section (Projects/Experience/dst) diubah dari `#anchor` jadi `/#anchor` supaya tetap jalan saat diklik dari halaman `/blog`. Logo sekarang selalu balik ke `/`.
