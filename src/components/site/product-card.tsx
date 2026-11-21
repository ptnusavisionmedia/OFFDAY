import Link from "next/link";
import { modelName, rupiah, tileBg, type Product } from "@/lib/products";

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const soldOut = product.soldOut?.length === product.sizes.length;
  return (
    <Link
      href={`/produk/${product.slug}`}
      className="group block rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background"
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-lg" style={{ background: tileBg(product.color) }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.image}
          alt=""
          loading={priority ? "eager" : "lazy"}
          draggable={false}
          className="absolute inset-0 size-full object-contain object-top p-2.5 transition-[opacity,transform] duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.03] group-hover:opacity-0 motion-reduce:transition-none sm:p-6"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.backImage}
          alt=""
          loading="lazy"
          draggable={false}
          className="absolute inset-0 size-full scale-[0.98] object-contain object-top p-2.5 opacity-0 transition-[opacity,transform] duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-100 group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none sm:p-6"
        />
        {(product.isNew || soldOut) && (
          <span className="absolute left-2.5 top-2.5 rounded-full bg-foreground px-2.5 py-1 text-[11px] font-medium leading-none text-background">
            {soldOut ? "Habis" : "Baru"}
          </span>
        )}
      </div>

      <div className="mt-3.5 space-y-0.5">
        <h3 className="text-[15px] font-medium leading-snug">{modelName(product)}</h3>
        <p className="text-sm text-muted-foreground">{product.colorName}</p>
        <p className="pt-1 text-[15px] tabular-nums">{rupiah(product.price)}</p>
      </div>
    </Link>
  );
}
