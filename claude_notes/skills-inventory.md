# Skills jadi "inventory" RPG

## Konsepnya
Eyebrow section-nya dari dulu `// inventory`, jadi sekarang beneran inventory:
tab per kategori (← → bisa dipakai di tab), tiap skill = item di slot, slot kosong
garis putus-putus biar kerasa kayak tas, dan panel **inspect** di kanan.

## Angka ×N dan rarity itu DIHITUNG, bukan dikarang
`×N` di pojok item = berapa proyek di `src/data/projects.ts` yang stack-nya pakai
skill itu (+ jumlah `alsoIn`). Rarity ngikut angka itu:
legendary 7+, epic 3–6, rare 1–2, common 0. Jadi nggak ada "Laravel 90%" yang
asal-asalan — kalau kamu nambah proyek, angka & rarity ikut naik sendiri.

Pencocokan pakai prefix lowercase: default nama skill-nya ("laravel" cocok sama
"Laravel 11"). Kalau beda nama, isi `match` — misalnya PHP dihitung dari
`["laravel", "codeigniter", "wordpress"]` karena semua itu PHP.
`alsoIn` buat tempat yang bukan proyek di list (repo config, situs ini sendiri).

## "Found in" bisa diklik
Klik nama proyek di panel inspect → paper proyek itu kebuka. Caranya: `openProject(slug)`
dari `projects.tsx` nge-dispatch `CustomEvent("open-project")`, section Projects yang
dengerin. Dua section tetap lepas (nggak perlu context baru). Pas paper ditutup, fokus
balik ke tombol yang diklik di Skills (pakai `preventScroll`), jadi halaman nggak loncat.

## Efek
Bevel retro (inset shadow terang kiri-atas, gelap kanan-bawah), item legendary ada kilau
yang nyapu pakai `steps(12)`, item terpilih mantul, skill "Learning" punya bar XP yang
ngecas. Semua mati otomatis kalau `prefers-reduced-motion`.

## Ukuran tetap + pilihan "nempel" (update)
- Panel inventory tingginya **fix** (`md:h-[400px]`); panel inspect yang `overflow-y-auto`,
  jadi deskripsi panjang di-scroll di dalam, kartunya nggak ganti ukuran.
- **Hover = preview, klik = pin.** Hover item → panel nunjukin item itu (outline hijau
  putus-putus, tulisan "previewing · click to pin"). Kursor keluar dari grid → panel balik
  ke item yang terakhir **diklik** (outline hijau solid, "★ pinned").
- Pin disimpan di `localStorage` (`fugo_skill`), sama kayak tema/scanlines/SFX. Pas reload,
  item & tab-nya kebuka lagi. Dibaca sekali di `useEffect` setelah mount (bukan di
  `useState` awal) supaya HTML server = HTML client → nggak ada hydration mismatch.
- Yang disimpan itu *nama* skill, bukan index, jadi pindah tab pun pin-nya tetap.
- Link "found in" cuma bisa diklik buat item yang di-pin (karena begitu kursor pindah ke
  panel, preview balik ke pin) — makanya ada hint "click to pin".
