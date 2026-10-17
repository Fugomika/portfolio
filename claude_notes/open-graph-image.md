# Open Graph image (preview link di WhatsApp dll)

Pas link `fugomika.dev` di-share ke WhatsApp/Telegram/LinkedIn/X, yang muncul itu kartu
1200×630: nama kamu (font piksel), role, pitch, tombol `fugomika.dev`, dan piringan hitam
dengan avatar kamu sebagai labelnya — warna & gaya sama kayak situsnya.

## Di mana & gimana dibuatnya
- `src/app/og.png/route.tsx` — bikin gambarnya pakai `ImageResponse` dari `next/og`
  (JSX → PNG). Jalan **sekali pas build** (`dynamic = "force-static"`, wajib untuk
  `output: "export"`), hasilnya `out/og.png` (~150 KB).
- Isinya ambil dari `src/data/site.ts`, jadi kalau nama/role/pitch diganti, gambarnya ikut
  berubah pas build berikutnya.
- Font: `ImageResponse` cuma terima ttf/otf/woff (bukan woff2 yang dipakai `next/font`),
  jadi ada salinan `.woff` di `src/assets/og/` (Pixelify Sans, IBM Plex Mono, Nunito Sans —
  semua lisensi OFL). Avatar kecil (220px) juga di situ biar gambarnya ringan.

## Kenapa route `og.png`, bukan konvensi `opengraph-image.tsx`
Sempat dicoba pakai konvensi bawaan Next. Masalahnya: static export nulis file itu
**tanpa ekstensi** (`out/opengraph-image`). GitHub Pages nentuin tipe file dari
ekstensi → disajikan sebagai `application/octet-stream`, dan WhatsApp/Facebook bisa
nolak gambar yang bukan `image/*`. Dengan route bernama `og.png`, file-nya `out/og.png`
→ tipe `image/png`. Meta tag-nya diarahkan manual di `layout.tsx`.

## Meta tag
- `metadataBase: new URL(site.url)` di `layout.tsx` → `og:image` jadi URL absolut
  (`https://fugomika.dev/og.png`). WhatsApp nggak mau URL relatif.
- `twitter: { card: "summary_large_image" }` → kartu besar di X.
- Tiap **artikel blog** punya `og:title`/`og:description` sendiri (judul + excerpt), pakai
  gambar yang sama. Di Next, `openGraph` milik halaman *menggantikan* punya layout (nggak
  digabung), makanya gambarnya ditulis ulang di `blog/[slug]/page.tsx`.

## Catatan WhatsApp
WhatsApp nge-*cache* preview per link. Kalau dulu link-nya pernah di-share sebelum ada
gambar ini, preview lama bisa nempel. Coba share dengan tambahan `?v=2` di ujung URL buat
maksa ambil ulang. Bisa juga cek di https://developers.facebook.com/tools/debug/ (WhatsApp
pakai scraper yang sama dengan Facebook).
