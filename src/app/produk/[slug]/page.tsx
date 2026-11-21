import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Reveal } from "@/components/motion/primitives";
import { ProductBuy } from "@/components/site/product-buy";
import { ProductCard } from "@/components/site/product-card";
import { ProductGallery } from "@/components/site/product-gallery";
import { CATEGORIES, PRODUCTS, getProduct, modelName, rupiah } from "@/lib/products";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};
  return { title: product.name, description: product.description, openGraph: { images: [product.image] } };
}

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense fallback={<div className="mx-auto min-h-[70svh] w-full max-w-[90rem] px-5 sm:px-10" aria-busy="true" />}>
      <ProductContent params={params} />
    </Suspense>
  );
}

async function ProductContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const category = CATEGORIES.find((c) => c.id === product.category);
  const related = PRODUCTS.filter((p) => p.slug !== product.slug)
    .sort((a, b) => Number(b.category === product.category) - Number(a.category === product.category))
    .slice(0, 4);

  const specs: [string, string][] = [
    ["Bahan", product.material],
    ["Berat kain", product.weight],
    ["Potongan", product.fit],
    ["Warna", product.colorName],
  ];

  return (
    <div className="mx-auto w-full max-w-[90rem] px-5 pb-24 pt-8 sm:px-10">
      <nav aria-label="Jejak halaman" className="text-sm text-muted-foreground">
        <Link href="/koleksi" className="hover:text-foreground">
          Koleksi
        </Link>
        <span aria-hidden="true" className="mx-2">
          /
        </span>
        <Link href={`/koleksi?kategori=${product.category}`} className="hover:text-foreground">
          {category?.label}
        </Link>
      </nav>

      <div className="mt-6 grid gap-x-16 gap-y-8 lg:grid-cols-[1.25fr_1fr]">
        <div className="lg:col-start-2 lg:row-start-1 lg:self-end">
          <h1 className="font-display tracking-display text-[clamp(2.5rem,5vw,4.2rem)] leading-[0.96] text-balance">
            {modelName(product)}
            {product.isNew && <span className="ml-3 inline-block translate-y-[-0.9em] rounded-full bg-foreground px-2.5 py-1 align-middle font-sans text-[11px] font-medium leading-none tracking-normal text-background">Baru</span>}
          </h1>
          <p className="mt-2 text-[17px] text-muted-foreground">{product.colorName}</p>
          <p className="mt-3 text-2xl tabular-nums">{rupiah(product.price)}</p>
        </div>

        <div className="lg:sticky lg:top-24 lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:self-start">
          <Reveal variant="blur">
            <ProductGallery product={product} />
          </Reveal>
        </div>

        <div className="lg:col-start-2 lg:row-start-2">
          <Reveal variant="left" delay={0.15}>
            <ProductBuy product={product} />
          </Reveal>

          <p className="mt-10 max-w-prose text-[15px] leading-relaxed text-muted-foreground">{product.description}</p>

          <dl className="mt-8 divide-y divide-border border-y border-border text-sm">
            {specs.map(([k, v]) => (
              <div key={k} className="grid grid-cols-[8rem_1fr] gap-4 py-3">
                <dt className="text-muted-foreground">{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-8 grid gap-8 sm:grid-cols-2">
            <div>
              <h2 className="text-sm font-medium">Detail</h2>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                {product.details.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-sm font-medium">Perawatan</h2>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                {product.care.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <section className="mt-24" aria-labelledby="related">
        <h2 id="related" className="font-display tracking-display text-[clamp(2.4rem,5vw,4rem)] leading-none">
          Dari rak yang sama
        </h2>
        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
          {related.map((p, i) => (
            <Reveal key={p.slug} variant={i % 2 ? "up" : "scale"} delay={i * 0.08}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
