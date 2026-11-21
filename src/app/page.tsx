import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Hero } from "@/components/site/hero";
import { ProductCard } from "@/components/site/product-card";
import { ImageReveal, Reveal, RevealText, type RevealVariant } from "@/components/motion/primitives";
import { getProduct, modelName, tileBg, type Product } from "@/lib/products";

/** Empat siluet berbeda: rajut, hoodie, kemeja, kaos. */
const PICKS = ["kardigan-rajut-zaitun", "hoodie-fleece-heather", "kemeja-oxford-langit", "kaos-heavyweight-tulang"]
  .map(getProduct)
  .filter((p): p is Product => Boolean(p));

const NOTES = [
  {
    slug: "kaos-heavyweight-tulang",
    fabric: "Katun organik",
    body: "Dirajut rapat pada 240 gsm. Kerah rib ganda dan bahu yang diperkuat menjaga bentuknya setelah puluhan kali cuci.",
  },
  {
    slug: "kemeja-oxford-langit",
    fabric: "Oxford katun",
    body: "Anyaman oxford 150 gsm, lebih ringan dari kaos kami. Lembut sejak pemakaian pertama, dengan kerah button-down yang berdiri tanpa kaku.",
  },
];

const PICK_MOTION: RevealVariant[] = ["scale", "blur", "up", "scale"];

const HELP = [
  ["Pengiriman", "Dikirim 1–2 hari kerja. Gratis ongkir untuk pesanan di atas Rp500.000."],
  ["Penukaran", "Salah ukuran? Tukar dalam 14 hari selama label belum dilepas dan belum dicuci."],
  ["Perawatan", "Setiap produk memuat petunjuk cuci sendiri. Umumnya: balik, air dingin, jemur teduh."],
];

const underline = "underline decoration-foreground/25 decoration-1 underline-offset-[7px] transition-colors hover:decoration-foreground";

export default function HomePage() {
  return (
    <>
      <Hero />

      <section aria-labelledby="pilihan" className="mx-auto w-full max-w-[90rem] border-t border-border px-5 py-20 sm:px-10 sm:py-28">
        <div className="flex items-end justify-between gap-6">
          <h2 id="pilihan" className="font-display tracking-display text-[clamp(2.4rem,5vw,4rem)] leading-none">
            <RevealText>Pilihan OFFDAY</RevealText>
          </h2>
          <Link href="/koleksi" className={`inline-flex h-11 items-center gap-2 text-sm ${underline}`}>
            Semua koleksi
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
          {PICKS.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.12} variant={PICK_MOTION[i] ?? "up"}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      </section>

      <section id="bahan" aria-labelledby="catatan-bahan" className="scroll-mt-20 border-t border-border">
        <div className="mx-auto w-full max-w-[90rem] px-5 py-20 sm:px-10 sm:py-28">
          <div className="max-w-2xl">
            <h2 id="catatan-bahan" className="font-display tracking-display text-[clamp(2.4rem,5vw,4rem)] leading-none">
              <RevealText>Catatan bahan</RevealText>
            </h2>
            <Reveal variant="fade" delay={0.2}>
              <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-muted-foreground">
                Dua kain, dua karakter. Satu berat dan tegas, satu ringan dan jatuh.
              </p>
            </Reveal>
          </div>

          <div className="mt-12 grid gap-px overflow-hidden rounded-2xl bg-border md:grid-cols-2">
            {NOTES.map((n, i) => {
              const p = getProduct(n.slug);
              if (!p) return null;
              return (
                <Link
                  key={n.slug}
                  href={`/produk/${p.slug}`}
                  className="group grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-5 bg-background p-4 outline-none transition-colors hover:bg-[color-mix(in_oklab,var(--tile)_55%,var(--background))] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring sm:gap-8 sm:p-6"
                >
                  <ImageReveal className="aspect-[4/5] overflow-hidden rounded-lg" delay={i * 0.15} from={i % 2 ? "top" : "bottom"}>
                   <div className="size-full" style={{ background: tileBg(p.color) }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.image}
                      alt={`${p.name}, tampak depan`}
                      loading="lazy"
                      draggable={false}
                      className="size-full object-contain object-top p-3 transition-transform duration-700 ease-out group-hover:scale-[1.04] motion-reduce:transition-none sm:p-5"
                    />
                   </div>
                  </ImageReveal>
                  <div className="flex flex-col py-1">
                    <p className="font-mono text-xs text-muted-foreground">{p.weight}</p>
                    <h3 className="font-display tracking-display mt-2 text-[clamp(1.8rem,3vw,2.6rem)] leading-none">{n.fabric}</h3>
                    <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">{n.body}</p>
                    <span className={`mt-auto inline-flex min-h-11 items-center gap-2 pt-5 text-sm font-medium ${underline} group-hover:decoration-foreground`}>
                      Lihat {modelName(p)}
                      <ArrowRight className="size-4" aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section id="bantuan" aria-labelledby="bantuan-judul" className="scroll-mt-20 border-t border-border">
        <div className="mx-auto w-full max-w-[90rem] px-5 py-16 sm:px-10 sm:py-20">
          <h2 id="bantuan-judul" className="sr-only">
            Bantuan
          </h2>
          <dl className="grid gap-x-10 gap-y-8 sm:grid-cols-3">
            {HELP.map(([title, body], i) => (
              <Reveal key={title} delay={i * 0.1} variant="fade">
                <div className="border-t border-foreground pt-4">
                  <dt className="text-[15px] font-medium">{title}</dt>
                  <dd className="mt-2 max-w-xs text-[15px] leading-relaxed text-muted-foreground">{body}</dd>
                </div>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>
    </>
  );
}
