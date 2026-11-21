"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import ClothingRailHero from "@/components/ui/product-rail-gallery";
import { SplitHeading } from "@/components/motion/primitives";
import { useIntroReady } from "@/components/motion/intro";
import { ButtonLink } from "@/components/site/button-link";
import { PRODUCTS, modelName, rupiah, toRailGarment } from "@/lib/products";

const START = Math.max(
  0,
  PRODUCTS.findIndex((p) => p.slug === "kardigan-rajut-zaitun"),
);

const roundBtn =
  "grid size-11 place-items-center rounded-full border border-foreground/15 bg-background outline-none transition-colors hover:border-foreground hover:bg-foreground hover:text-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-30";

export function Hero() {
  const reduce = useReducedMotion();
  const ready = useIntroReady();
  const items = React.useMemo(() => PRODUCTS.map(toRailGarment), []);
  const [index, setIndex] = React.useState<number | null>(START);
  const product = PRODUCTS[index ?? START]!;

  const fade = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 24 },
    animate: ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 },
    transition: { duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] as const },
  });

  return (
    <section className="mx-auto w-full max-w-[90rem] px-5 pb-10 pt-4 sm:px-10 sm:pb-14 sm:pt-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
        <SplitHeading
          className="font-display tracking-display max-w-[14ch] text-[clamp(2.4rem,10.5vw,3.2rem)] leading-[0.98] text-balance sm:max-w-[16ch] sm:text-[clamp(3rem,6.4vw,4.6rem)]"
          lines={[[{ t: "Pakaian" }, { t: "untuk" }, { t: "hari" }, { t: "yang" }, { t: "tidak" }, { t: "ada" }, { t: "jadwalnya." }]]}
        />
        <motion.div {...fade(0.2)} className="hidden shrink-0 items-center gap-8 sm:flex lg:pb-2">
          <p className="max-w-[16rem] text-[15px] leading-relaxed text-muted-foreground">
            Kaos, kemeja, dan rajut berbahan berat dengan potongan longgar.
          </p>
          <ButtonLink href="/koleksi">Jelajahi koleksi</ButtonLink>
        </motion.div>
      </div>

      <motion.div
        {...fade(0.05)}
        className="relative -mx-5 mt-8 overflow-hidden bg-tile sm:mx-0 sm:mt-10 sm:rounded-[1.75rem]"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_75%_at_50%_42%,rgba(255,255,255,0.95),rgba(255,255,255,0)_70%)]"
        />
        <ClothingRailHero
          items={items}
          hanger="none"
          mode="carousel"
          carouselHeight={430}
          defaultActive={START}
          keepActive
          onActiveChange={setIndex}
          stageLabel="Rak koleksi OFFDAY. Geser untuk melihat pakaian lain."
          labels={{ front: "Depan", back: "Belakang", close: "Tutup", show: "Tampilkan", view: "Lihat produk" }}
          className="relative bg-transparent [&_[data-garment]:not([data-front])]:brightness-[0.94] [&_[data-garment]]:transition-[filter] [&_[data-garment]]:duration-500 [&_[data-garment][data-front]]:drop-shadow-[0_28px_28px_rgba(0,0,0,0.16)]"
          renderFooter={({ prev, next, index: i, count, open }) => (
            <div className="flex items-center justify-between gap-4 px-5 pb-6 pt-2 sm:px-8 sm:pb-8">
              <div className="min-w-0" aria-live="polite">
                <p className="truncate text-base font-medium">{modelName(product)}</p>
                <p className="mt-0.5 text-sm tabular-nums text-muted-foreground">
                  {product.colorName} · {rupiah(product.price)}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <button type="button" onClick={open} className="mr-1 hidden h-11 items-center rounded-full border border-foreground/15 bg-background px-5 text-sm outline-none transition-colors hover:border-foreground focus-visible:ring-2 focus-visible:ring-ring sm:inline-flex">
                  Putar 360°
                </button>
                <button type="button" onClick={prev} disabled={(i ?? START) <= 0} aria-label="Pakaian sebelumnya" className={roundBtn}>
                  <ArrowLeft className="size-[18px]" aria-hidden="true" />
                </button>
                <button type="button" onClick={next} disabled={(i ?? START) >= count - 1} aria-label="Pakaian berikutnya" className={roundBtn}>
                  <ArrowRight className="size-[18px]" aria-hidden="true" />
                </button>
                <Link
                  href={`/produk/${product.slug}`}
                  className="ml-1 hidden h-11 items-center rounded-full bg-foreground px-5 text-sm font-medium text-background outline-none transition-colors hover:bg-foreground/85 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:inline-flex"
                >
                  Lihat produk
                </Link>
              </div>
            </div>
          )}
        />
      </motion.div>

      <div className="mt-5 flex items-center justify-between sm:hidden">
        <Link href={`/produk/${product.slug}`} className="inline-flex h-11 items-center gap-2 text-[15px] font-medium underline decoration-foreground/30 underline-offset-[6px]">
          Lihat produk
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
        <Link href="/koleksi" className="inline-flex h-11 items-center gap-2 text-[15px] text-muted-foreground">
          Jelajahi koleksi
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
