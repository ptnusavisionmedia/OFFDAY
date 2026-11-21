import type { GarmentKind, RailGarment } from "@/components/ui/product-rail-gallery";

export type CategoryId = "kaos" | "kemeja" | "lengan-panjang" | "rajut-fleece";
export type Size = "S" | "M" | "L" | "XL";

export const CATEGORIES: { id: CategoryId; label: string }[] = [
  { id: "kaos", label: "Kaos" },
  { id: "kemeja", label: "Kemeja" },
  { id: "lengan-panjang", label: "Lengan Panjang" },
  { id: "rajut-fleece", label: "Rajut & Fleece" },
];

export interface Product {
  slug: string;
  name: string;
  category: CategoryId;
  kind: GarmentKind;
  /** Warna kain (CSS), dipakai rak sebagai warna cadangan. */
  color: string;
  colorName: string;
  price: number;
  blurb: string;
  description: string;
  material: string;
  weight: string;
  fit: string;
  details: string[];
  care: string[];
  sizes: Size[];
  soldOut?: Size[];
  isNew?: boolean;
  image: string;
  backImage: string;
  sideImage: string;
}

/**
 * Foto placeholder dari demo komponen, disimpan di public/products.
 * Ganti dengan foto produk sendiri: cut-out transparan, kanvas portrait 200 × 310,
 * depan/belakang/samping dengan kanvas dan skala yang sama.
 */
const photo = (slug: string, view: "front" | "back" | "side") => `/products/${slug}-${view}.webp?v=logo2`;
const SIZES: Size[] = ["S", "M", "L", "XL"];

export const PRODUCTS: Product[] = [
  {
    slug: "kaos-heavyweight-tulang",
    name: "Kaos Heavyweight · Tulang",
    category: "kaos",
    kind: "tee",
    color: "#EFEBE2",
    colorName: "Tulang",
    price: 249000,
    isNew: true,
    blurb: "Katun organik 240 gsm, bordir senada di dada.",
    description:
      "Kaos harian yang jatuhnya tegas. Katun organik 240 gsm dirajut rapat sehingga kerahnya tidak melar setelah puluhan kali cuci, dengan bordir tonal kecil di dada.",
    material: "100% katun organik",
    weight: "240 gsm",
    fit: "Regular, sedikit boxy",
    details: ["Kerah rib ganda", "Jahitan bahu diperkuat", "Bordir tonal"],
    care: ["Cuci terbalik, air dingin", "Jangan gunakan pemutih", "Jemur di tempat teduh"],
    sizes: SIZES,
    image: photo("kaos-heavyweight-tulang", "front"),
    backImage: photo("kaos-heavyweight-tulang", "back"),
    sideImage: photo("kaos-heavyweight-tulang", "side"),
  },
  {
    slug: "kaos-grafis-arang",
    name: "Kaos Grafis · Arang",
    category: "kaos",
    kind: "tee",
    color: "#101214",
    colorName: "Arang",
    price: 269000,
    blurb: "Hitam pekat dengan sablon depan dan belakang.",
    description:
      "Hitam pekat yang tidak cepat pudar. Sablon plastisol dikerjakan manual, depan dan belakang, di atas katun 240 gsm yang sama dengan kaos polos kami.",
    material: "100% katun combed",
    weight: "240 gsm",
    fit: "Regular",
    details: ["Sablon plastisol", "Pre-washed", "Label cetak, tanpa tag gatal"],
    care: ["Cuci terbalik, air dingin", "Jangan disetrika di atas sablon", "Jemur di tempat teduh"],
    sizes: SIZES,
    soldOut: ["S"],
    image: photo("kaos-grafis-arang", "front"),
    backImage: photo("kaos-grafis-arang", "back"),
    sideImage: photo("kaos-grafis-arang", "side"),
  },
  {
    slug: "kemeja-oxford-langit",
    name: "Kemeja Oxford · Langit",
    category: "kemeja",
    kind: "shirt",
    color: "#A3D3EB",
    colorName: "Langit",
    price: 389000,
    blurb: "Biru pucat, kerah button-down, saku dada.",
    description:
      "Oxford katun yang lembut sejak pemakaian pertama. Kerah button-down yang berdiri sendiri tanpa kaku, satu saku dada, dan bordir kecil di bawahnya.",
    material: "100% katun oxford",
    weight: "150 gsm",
    fit: "Relaxed",
    details: ["Kerah button-down", "Saku dada", "Kancing mutiara"],
    care: ["Cuci mesin, air dingin", "Setrika suhu sedang", "Jangan dikeringkan dengan mesin"],
    sizes: SIZES,
    image: photo("kemeja-oxford-langit", "front"),
    backImage: photo("kemeja-oxford-langit", "back"),
    sideImage: photo("kemeja-oxford-langit", "side"),
  },
  {
    slug: "kardigan-rajut-zaitun",
    name: "Kardigan Rajut · Zaitun",
    category: "rajut-fleece",
    kind: "knit",
    color: "#758151",
    colorName: "Zaitun",
    price: 549000,
    isNew: true,
    blurb: "Wol tebal, kancing kayu, bibir rib.",
    description:
      "Kardigan wol domba yang tebal tetapi tidak gerah di ruang ber-AC. Kancing dari kayu, leher V, dan bibir rib yang menahan bentuk.",
    material: "100% wol domba",
    weight: "Rajut tebal",
    fit: "Relaxed",
    details: ["Kancing kayu", "Leher V", "Trim rib"],
    care: ["Cuci tangan atau mode wol", "Keringkan mendatar", "Simpan terlipat, jangan digantung"],
    sizes: SIZES,
    image: photo("kardigan-rajut-zaitun", "front"),
    backImage: photo("kardigan-rajut-zaitun", "back"),
    sideImage: photo("kardigan-rajut-zaitun", "side"),
  },
  {
    slug: "hoodie-fleece-heather",
    name: "Hoodie Fleece · Heather",
    category: "rajut-fleece",
    kind: "hoodie",
    color: "#A0A5AB",
    colorName: "Abu Heather",
    price: 459000,
    blurb: "Fleece 400 gsm, kantong kanguru, cetak dada.",
    description:
      "Hoodie berat untuk malam yang dingin. Bagian dalam fleece disikat, tudung berlapis ganda sehingga tetap berdiri, dengan cetak sederhana di dada.",
    material: "80% katun, 20% poliester",
    weight: "400 gsm",
    fit: "Boxy",
    details: ["Tudung berlapis ganda", "Kantong kanguru", "Cetak dada"],
    care: ["Cuci terbalik, air dingin", "Jangan diperas", "Jemur di tempat teduh"],
    sizes: SIZES,
    image: photo("hoodie-fleece-heather", "front"),
    backImage: photo("hoodie-fleece-heather", "back"),
    sideImage: photo("hoodie-fleece-heather", "side"),
  },
  {
    slug: "sweatshirt-crewneck-lilac",
    name: "Sweatshirt Crewneck · Lilac",
    category: "rajut-fleece",
    kind: "knit",
    color: "#CCB2E0",
    colorName: "Lilac",
    price: 399000,
    blurb: "Fleece 400 gsm, cetak puff timbul di dada.",
    description:
      "Lilac yang redup, bukan permen. Fleece tebal dengan rib di leher, ujung lengan, dan pinggang, plus cetak puff yang timbul di dada.",
    material: "80% katun, 20% poliester",
    weight: "400 gsm",
    fit: "Regular",
    details: ["Trim rib", "Cetak puff", "Fleece disikat"],
    care: ["Cuci terbalik, air dingin", "Jangan disetrika di atas cetak", "Jemur di tempat teduh"],
    sizes: SIZES,
    soldOut: ["XL"],
    image: photo("sweatshirt-crewneck-lilac", "front"),
    backImage: photo("sweatshirt-crewneck-lilac", "back"),
    sideImage: photo("sweatshirt-crewneck-lilac", "side"),
  },
  {
    slug: "polo-pique-hutan",
    name: "Polo Piqué · Hutan",
    category: "kaos",
    kind: "tee",
    color: "#185B37",
    colorName: "Hutan",
    price: 329000,
    blurb: "Hijau hutan, plaket dua kancing, bordir tulang.",
    description:
      "Polo dengan tekstur piqué yang menyerap keringat. Plaket dua kancing, kerah yang tidak melipat sendiri, dan bordir kecil berwarna tulang di dada.",
    material: "100% katun piqué",
    weight: "220 gsm",
    fit: "Regular",
    details: ["Plaket dua kancing", "Bordir dada", "Belahan samping"],
    care: ["Cuci mesin, air dingin", "Setrika suhu rendah", "Jemur di tempat teduh"],
    sizes: SIZES,
    image: photo("polo-pique-hutan", "front"),
    backImage: photo("polo-pique-hutan", "back"),
    sideImage: photo("polo-pique-hutan", "side"),
  },
  {
    slug: "henley-bata",
    name: "Henley · Bata",
    category: "lengan-panjang",
    kind: "knit",
    color: "#B05139",
    colorName: "Bata",
    price: 299000,
    blurb: "Slub cotton warna bata, tiga kancing.",
    description:
      "Warna bata yang terlihat lebih bagus setelah dicuci beberapa kali. Slub cotton dengan tekstur tidak rata, plaket tiga kancing, lengan panjang.",
    material: "100% slub cotton",
    weight: "200 gsm",
    fit: "Regular",
    details: ["Plaket tiga kancing", "Slub cotton", "Manset rib"],
    care: ["Cuci terbalik, air dingin", "Jangan menggunakan pemutih", "Jemur di tempat teduh"],
    sizes: SIZES,
    image: photo("henley-bata", "front"),
    backImage: photo("henley-bata", "back"),
    sideImage: photo("henley-bata", "side"),
  },
  {
    slug: "breton-lengan-panjang",
    name: "Breton Lengan Panjang",
    category: "lengan-panjang",
    kind: "knit",
    color: "#E4DFD3",
    colorName: "Tinta & Tulang",
    price: 319000,
    isNew: true,
    blurb: "Garis tinta dan tulang, leher perahu.",
    description:
      "Garis klasik pelaut dengan leher perahu yang lebar. Katun 220 gsm, garis dirajut bukan dicetak, jadi tidak retak setelah dicuci.",
    material: "100% katun",
    weight: "220 gsm",
    fit: "Regular",
    details: ["Leher perahu", "Garis dirajut", "Lengan panjang"],
    care: ["Cuci terbalik, air dingin", "Cuci terpisah untuk 3 kali pertama", "Jemur di tempat teduh"],
    sizes: SIZES,
    image: photo("breton-lengan-panjang", "front"),
    backImage: photo("breton-lengan-panjang", "back"),
    sideImage: photo("breton-lengan-panjang", "side"),
  },
  {
    slug: "kaos-oversized-oker",
    name: "Kaos Oversized · Oker",
    category: "kaos",
    kind: "tee",
    color: "#DE9C31",
    colorName: "Oker",
    price: 279000,
    blurb: "Boxy, bahu jatuh, cetak besar di punggung.",
    description:
      "Boxy dengan bahu jatuh dan panjang yang berhenti di pinggul. Tanda kecil di dada, cetak besar di punggung.",
    material: "100% katun combed",
    weight: "240 gsm",
    fit: "Oversized",
    details: ["Bahu jatuh", "Cetak punggung", "Pre-washed"],
    care: ["Cuci terbalik, air dingin", "Jangan menggunakan pemutih", "Jemur di tempat teduh"],
    sizes: SIZES,
    image: photo("kaos-oversized-oker", "front"),
    backImage: photo("kaos-oversized-oker", "back"),
    sideImage: photo("kaos-oversized-oker", "side"),
  },
];

/** Nama model tanpa warna: "Kaos Heavyweight · Tulang" menjadi "Kaos Heavyweight". */
export const modelName = (p: Product) => p.name.split(" · ")[0] ?? p.name;

export const getProduct = (slug: string) => PRODUCTS.find((p) => p.slug === slug);

export const rupiah = (value: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);

/** Label ringkas untuk hang-tag di rak: 249000 menjadi "249K". */
export const tagPrice = (value: number) => `${Math.round(value / 1000)}K`;

export function toRailGarment(p: Product): RailGarment {
  return {
    id: p.slug,
    name: p.name,
    kind: p.kind,
    color: p.color,
    tag: tagPrice(p.price),
    description: p.blurb,
    details: [p.weight, p.fit, p.details[0] ?? ""].filter(Boolean),
    image: p.image,
    backImage: p.backImage,
    sideImage: p.sideImage,
    price: rupiah(p.price),
    href: `/produk/${p.slug}`,
  };
}

/** Latar tile yang diwarnai tipis oleh warna produk. Warna terang (tulang, krem) mendapat latar lebih gelap agar siluetnya terbaca. */
export const tileBg = (color: string) => {
  const m = /^#([0-9a-f]{6})$/i.exec(color);
  const n = m ? parseInt(m[1]!, 16) : 0x808080;
  const lum = (0.2126 * ((n >> 16) & 255) + 0.7152 * ((n >> 8) & 255) + 0.0722 * (n & 255)) / 255;
  return lum > 0.82
    ? "color-mix(in oklab, #6b6a66 14%, var(--tile))"
    : `color-mix(in oklab, ${color} 7%, var(--tile))`;
};
