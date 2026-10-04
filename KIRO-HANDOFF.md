# Birthday ID, Level 1 (Handoff untuk Kiro)

> Cara pakai: taruh file ini + `birthday-id-level1.html` (prototype) + gambar poster referensi di folder project. Minta Kiro membuat **spec** (requirements → design → tasks) dari dokumen ini. Salin bagian "Aturan Desain" dan "Yang Dicoret" ke steering file supaya selalu diingat.

## 1. Apa ini
Website kado ulang tahun ke-18 untuk pacar (ulang tahun **7 Oktober**). Di dunia nyata ada **ID card fisik "Birthday ID"** bertingkat:
- Level 1 = umur 18 (dibuat sekarang), Level 2 = umur 20, Level 3 = seterusnya.
- Di belakang kartu ada **QR code** yang membuka website ini.
- **QR dicetak permanen**, jadi URL harus stabil selamanya. Satu website dipakai semua level (tambah halaman/rute baru, jangan ganti URL dasar).

Bahasa UI dan isi: **Bahasa Indonesia santai** (gaya "gua/lo" untuk penulis, teks ke dia ditulis personal).

## 2. Alur (final)
1. **Layar mulai**: tombol "Tap untuk mulai" (tap ini juga dibutuhkan agar audio boleh diputar di browser HP).
2. **Intro angka**: 0 → 18 dengan easing ease-out (cepat di awal "zut zut zut", melambat dramatis mendekati 18), angka "pop" saat sampai 18.
3. **Confetti** meledak (beberapa gelombang) + teks **"Happy 18th Birthday, [Nama]!"** + tombol "Buka Buku".
4. **Buku** (fitur utama): isinya **murni ucapan penulis, satu halaman satu pesan**.
   - Tampilan buku tertutup (sampul) di tengah → tap untuk buka → jadi **spread dua halaman** kiri-kanan dengan lipatan tengah.
   - **Lembaran yang dibalik mendarat di kiri dan menumpuk** (bukan hilang). Tiap lembar punya sisi depan dan belakang.
   - Navigasi: tap sisi kanan/kiri, swipe, tombol ◀ ▶, keyboard panah.
   - Halaman terakhir menutup buku + confetti.
5. Musik latar lembut (tombol play/pause) dimulai dari tap di langkah 1. File lagu: *(menyusul dari user)*.

## 3. Yang DICORET (jangan ditambahkan)
Countdown, amplop surat, quiz, easter egg, voucher/kupon, timeline slider, voice note, halaman "Level 2 terkunci". Buku harus murni teks ucapan. Kalau mau menambah fitur interaktif, **tanya user dulu**.

## 4. Aturan Desain (WAJIB)
Referensi: poster kafe Korea "Tofu Lab" (pastel, imut, stiker). Harus **terasa handmade, bukan template AI**.
- Background pink polkadot, gradasi pink → mint di bawah.
- Judul font bubble tebal (Jua): isi krem, **outline pink tebal**, bayangan biru bertumpuk.
- Panel krem `#fff8d6`, border tosca `#7fd3d6` tebal 5px, sudut bulat besar, ring putih + bayangan keras (bukan blur).
- Warna: pink `#ff9ccb`/`#ff7eb6`, krem `#fff8d6`, tosca `#7fd3d6`, biru muda `#8fc6f0`, ungu teks `#8a4a7a`, mint `#bff0c8`.
- Font: **Jua** (judul, tombol), **Gaegu** (isi pesan, tulisan tangan).
- Stiker melayang pelan (bintang, awan, hati, kilau, maskot tahu) dengan outline, dimiringkan, bukan emoji.
- Detail retro: title bar ala jendela komputer ("BIRTHDAY.EXE"), kertas bergaris, label miring.
- Tombol gemuk, border putih, bayangan solid yang "kepencet" saat ditekan.
- **Jangan**: emoji sebagai dekorasi utama, gradasi ungu-biru generik, kartu glassmorphism, font sistem, layout simetris yang kaku.
- Aset ideal: maskot gambar tangan dari user (kalau ada, gantikan SVG tahu di prototype).

## 5. Rekomendasi Stack (kualitas terbaik, tetap ringan)
| Kebutuhan | Pilihan |
|---|---|
| Framework | **Vite + React + TypeScript** (statis, cepat; Next.js tidak perlu karena tanpa SSR/backend) |
| Styling | **Tailwind CSS** + CSS variables untuk design token |
| Animasi UI & transisi layar | **Motion (framer-motion)** |
| Animasi angka 0→18 | Motion `animate()` atau **GSAP** (kontrol easing presisi) |
| Confetti | **canvas-confetti** |
| Buku flip realistis | **react-pageflip / StPageFlip** (kurva halaman + bayangan dinamis). Alternatif: lanjutkan CSS 3D dari prototype |
| Audio | **Howler.js** (iOS-safe, preload, fade) |
| PWA (rasa app, fullscreen, add to home screen) | **vite-plugin-pwa** + manifest + ikon |
| Konten | Satu file `src/content/level1.ts` (atau JSON) berisi nama, pesan, tanda tangan, supaya gampang diedit |
| Routing | **React Router**: `/` → redirect ke level terbaru, `/level/1`, nanti `/level/2`, `/level/3` |
| Hosting | **Cloudflare Pages / Vercel / Netlify**. Untuk QR permanen, pertimbangkan **domain sendiri** (URL pendek, tidak hilang) |
| Font | **Self-host** Jua & Gaegu (agar jalan offline di PWA dan tidak ada flash) |
| Kualitas | ESLint + Prettier, test manual di **iPhone Safari & Chrome Android** |

Struktur yang disarankan:
```
src/
  content/level1.ts      // nama + pesan (edit di sini)
  components/  Intro/ Counter/ Confetti/ Book/ Stickers/ AudioToggle/
  levels/Level1.tsx      // Level2/3 ditambah nanti
  styles/tokens.css
  assets/ (stiker svg, maskot, font, audio, foto)
```

## 6. Persyaratan Teknis
- Mobile-first (target HP layar ~360–430px); tetap bagus di landscape & desktop.
- Pakai `100dvh` + safe-area inset (notch iPhone). Tanpa scroll horizontal.
- Audio hanya mulai setelah tap pengguna; sediakan tombol mute.
- Hormati `prefers-reduced-motion` (kurangi confetti/flip).
- Performa: gambar WebP, lazy load, target Lighthouse mobile ≥ 90.
- QR: buat QR dari URL final (min. ~2×2 cm di kartu, koreksi error level M/Q), **tes scan sebelum cetak**.
- Jangan simpan data pribadi di server; semua statis.

## 7. Urutan Tugas
1. Scaffold Vite+React+TS+Tailwind, pasang token warna & font.
2. Porting intro (mulai → counter → confetti → "Happy 18th") dari prototype.
3. Porting buku (spread, flip menumpuk, navigasi) lalu uji `react-pageflip`; pilih yang paling natural.
4. Stiker SVG + maskot + detail retro sesuai aturan desain.
5. Audio (Howler) + tombol mute.
6. PWA manifest/ikon + uji install di HP.
7. Isi konten asli, deploy, uji di perangkat nyata, generate & uji QR.
8. Siapkan struktur rute `/level/2` untuk nanti (tanpa isi).

## 8. Yang Masih Dibutuhkan dari User
Nama pacar, teks ucapan tiap halaman, tanda tangan penulis, file lagu, (opsional) maskot/stiker gambar tangan, domain.

## 9. File Referensi
- `birthday-id-level1.html`: prototype yang sudah disetujui user (animasi intro, confetti, flip buku menumpuk, gaya visual). Anggap sebagai **acuan perilaku dan tampilan**.
- Poster referensi gaya (gambar pink "Tofu Lab").
