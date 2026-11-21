import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Reveal } from "@/components/motion/primitives";
import { ProductCard } from "@/components/site/product-card";
import { CATEGORIES, PRODUCTS, type CategoryId } from "@/lib/products";

export const metadata: Metadata = {
  title: "Koleksi",
  description: "Semua kaos, kemeja, rajut, dan fleece OFFDAY.",
};

function Content({ active }: { active?: CategoryId }) {
  const list = active ? PRODUCTS.filter((p) => p.category === active) : PRODUCTS;

  const chip = (selected: boolean) =>
    `inline-flex h-11 items-center rounded-full border px-4 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring ${
      selected ? "border-foreground bg-foreground text-background" : "border-border hover:border-foreground/50"
    }`;

  return (
    <>
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-border pb-6">
        <h1 className="font-display tracking-display text-[clamp(3rem,8vw,6rem)] leading-[0.9]">Koleksi</h1>
        <p className="text-[15px] text-muted-foreground">{list.length} potong</p>
      </div>

      <nav aria-label="Filter kategori" className="mt-6 flex flex-wrap gap-2">
        <Link href="/koleksi" aria-current={!active ? "page" : undefined} className={chip(!active)}>
          Semua
        </Link>
        {CATEGORIES.map((c) => (
          <Link key={c.id} href={`/koleksi?kategori=${c.id}`} aria-current={active === c.id ? "page" : undefined} className={chip(active === c.id)}>
            {c.label}
          </Link>
        ))}
      </nav>

      <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-4">
        {list.map((p, i) => (
          <Reveal key={p.slug} delay={(i % 4) * 0.08} variant={["scale", "up", "blur", "up"][i % 4] as "scale" | "up" | "blur"}>
            <ProductCard product={p} priority={i < 4} />
          </Reveal>
        ))}
      </div>
    </>
  );
}

async function Filtered({ searchParams }: { searchParams: Promise<{ kategori?: string }> }) {
  const { kategori } = await searchParams;
  const active = CATEGORIES.find((c) => c.id === kategori)?.id;
  return <Content active={active} />;
}

export default function KoleksiPage({ searchParams }: { searchParams: Promise<{ kategori?: string }> }) {
  return (
    <div className="mx-auto w-full max-w-[90rem] px-5 pb-24 pt-10 sm:px-10 sm:pt-14">
      <Suspense fallback={<Content />}>
        <Filtered searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
