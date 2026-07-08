# Deploy ke GitHub Pages + custom domain fugomika.dev

## Apa yang diubah
- **Hapus** workflow Azure (`azure-static-web-apps-*.yml`) — pindah host.
- **Tambah** `public/CNAME` berisi `fugomika.dev`.
- **Tambah** `.github/workflows/deploy.yml` — build + deploy ke GitHub Pages.
- `next.config.ts` tetap `output: "export"` (dari setup Azure, masih dipakai).

## Kenapa begini

### `output: "export"`
GitHub Pages cuma nyajiin file statis (HTML/CSS/JS), nggak jalanin Node server.
`next build` dengan `output: "export"` menghasilkan folder `out/` isinya HTML statis
murni. Portfolio ini nggak punya API routes / SSR / `next/image`, jadi nggak ada
fitur yang hilang. (Dikonfirmasi dari `node_modules/next/dist/docs/.../static-exports.md`.)

### `public/CNAME` — bukan cuma setting di UI
GitHub Pages tahu domain custom dari file bernama `CNAME` di root situs yang di-publish.
Kalau kita cuma set lewat Settings → Pages, file itu disimpan GitHub tapi bisa
ke-reset tiap deploy via Actions. Naruh `CNAME` di `public/` bikin Next.js otomatis
copy ke `out/CNAME` tiap build — jadi domain-nya "nempel" di artifact dan permanen.

### `deploy.yml` pakai official Pages Actions (bukan deploy-from-branch)
Workflow ini build di CI lalu upload hasil `out/` sebagai artifact dan deploy
lewat `actions/deploy-pages`. Keunggulan dibanding cara lama (push folder build ke
branch `gh-pages`): repo tetap bersih, nggak ada branch build, dan Jekyll TIDAK
dijalankan ke artifact.

`touch out/.nojekyll` itu jaring pengaman: Jekyll (default GitHub Pages mode lama)
mengabaikan folder yang diawali underscore, sedangkan Next.js naruh aset di `_next/`.
Dengan mode Actions sebenarnya Jekyll nggak jalan, tapi file ini murah & aman kalau
suatu saat mode-nya berubah.

`concurrency: pages` bikin deploy yang lebih baru membatalkan/antre yang lama biar
nggak balapan.

## Yang HARUS dilakukan manual (nggak bisa dari kode)
1. **Punya domain** `fugomika.dev` dulu (register, ~$12-15/thn).
2. **Settings → Pages** di repo: Source = **GitHub Actions**.
3. **DNS di registrar** — apex `fugomika.dev` pakai 4 A record + 4 AAAA record ke IP
   GitHub Pages (lihat README/jawaban chat), dan `www` → CNAME ke `fugomika.github.io`.
4. **Settings → Pages → Custom domain** isi `fugomika.dev`, tunggu DNS check hijau,
   lalu centang **Enforce HTTPS** (wajib karena `.dev` maksa HTTPS).

## Catatan `.dev`
TLD `.dev` ada di HSTS preload list — browser selalu maksa HTTPS. GitHub Pages
otomatis nerbitin sertifikat Let's Encrypt, jadi ini beres sendiri setelah
"Enforce HTTPS" dicentang. Nggak ada config tambahan.
