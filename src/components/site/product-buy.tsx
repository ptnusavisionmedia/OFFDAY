"use client";

import * as React from "react";
import { toast } from "sonner";
import { useCart } from "@/lib/cart";
import type { Product, Size } from "@/lib/products";

export function ProductBuy({ product }: { product: Product }) {
  const add = useCart((s) => s.add);
  const [size, setSize] = React.useState<Size | null>(null);
  const [warn, setWarn] = React.useState(false);

  const submit = () => {
    if (!size) {
      setWarn(true);
      return;
    }
    add(product.slug, size);
    toast.success(`${product.name} (${size}) masuk keranjang`);
  };

  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <p id="size-label" className="text-sm font-medium">
          Ukuran{size ? `: ${size}` : ""}
        </p>
        <p className="text-sm text-muted-foreground">Potongan: {product.fit}</p>
      </div>
      <div role="radiogroup" aria-labelledby="size-label" className="mt-3 grid grid-cols-4 gap-2">
        {product.sizes.map((s) => {
          const out = product.soldOut?.includes(s);
          const selected = size === s;
          return (
            <button
              key={s}
              type="button"
              role="radio"
              aria-checked={selected}
              disabled={out}
              onClick={() => {
                setSize(s);
                setWarn(false);
              }}
              className={`relative flex h-14 flex-col items-center justify-center rounded-md border text-[15px] outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed ${
                out
                  ? "border-dashed border-border text-muted-foreground/70"
                  : selected
                    ? "border-foreground bg-foreground text-background"
                    : "border-border hover:border-foreground/60"
              }`}
            >
              <span className={out ? "line-through" : undefined}>{s}</span>
              {out && (
                <span className="text-[11px] leading-none" aria-hidden="true">
                  habis
                </span>
              )}
              <span className="sr-only">{out ? " (habis)" : ""}</span>
            </button>
          );
        })}
      </div>
      <p role="alert" className="mt-3 min-h-5 text-sm text-destructive">
        {warn && !size ? "Pilih ukuran dulu." : ""}
      </p>
      <button
        type="button"
        onClick={submit}
        className="mt-2 inline-flex h-14 w-full items-center justify-center rounded-full bg-foreground text-[15px] font-medium text-background outline-none transition-transform hover:-translate-y-px focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        Tambah ke keranjang
      </button>
    </div>
  );
}
