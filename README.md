# OFFDAY

Toko pakaian online bergaya editorial, dibangun di sekitar komponen `ClothingRailHero` (rak pakaian interaktif).

## Tech stack

- Next.js 16 (App Router, Cache Components) + React 19 + TypeScript
- Tailwind CSS v4 + shadcn/ui (style `base-nova`, komponen di `src/components/ui`)
- Zustand (keranjang, tersimpan di localStorage), Sonner (toast), lucide-react
- Font: Instrument Serif (judul), Geist & Geist Mono (isi, label)

## Menjalankan

```powershell
npm install
npm run dev      # http://localhost:3000
npm run build
```

## Struktur

```
src/app/                  beranda, /koleksi, /produk/[slug]
src/components/ui/        shadcn + product-rail-gallery.tsx (komponen rak, tidak diubah)
src/components/site/      header, footer, kartu produk, galeri, keranjang
src/lib/products.ts       data produk (satu sumber untuk rak, grid, dan halaman produk)
src/lib/cart.ts           state keranjang + pesan WhatsApp
public/products/          foto placeholder (depan, belakang, samping)
```

## Yang perlu Anda ganti sebelum rilis

1. **Foto produk** di `public/products/` masih foto demo komponen. Pakai cut-out transparan dengan kanvas portrait 200 × 310; depan, belakang, dan samping harus berkanvas dan berskala sama.
2. **Nomor WhatsApp**: salin `.env.example` menjadi `.env.local` lalu isi `NEXT_PUBLIC_WA_NUMBER` (format `62812...`). Checkout saat ini mengirim isi keranjang ke WhatsApp.
3. **Teks, harga, stok, dan klaim** (ongkir, penukaran 14 hari, spesifikasi bahan) adalah contoh. Sesuaikan di `src/lib/products.ts` dan `src/app/page.tsx`.
4. **Newsletter** belum terhubung ke penyedia email (`src/components/site/newsletter-form.tsx`).
5. Untuk pembayaran online sungguhan, sambungkan penyedia pembayaran (misalnya Midtrans atau Xendit) dan ganti tombol WhatsApp di `cart-sheet.tsx`.
