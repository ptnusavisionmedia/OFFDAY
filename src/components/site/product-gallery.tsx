"use client";

import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { tileBg, type Product } from "@/lib/products";

type View = "depan" | "belakang" | "samping";

export function ProductGallery({ product }: { product: Product }) {
  const views: { id: View; label: string; src: string }[] = [
    { id: "depan", label: "Depan", src: product.image },
    { id: "belakang", label: "Belakang", src: product.backImage },
    { id: "samping", label: "Samping", src: product.sideImage },
  ];
  const [view, setView] = React.useState<View>("depan");
  const current = views.find((v) => v.id === view) ?? views[0]!;

  return (
    <div className="grid gap-4 md:grid-cols-[88px_1fr]">
      <div className="order-2 flex gap-3 md:order-1 md:flex-col" role="group" aria-label="Sudut foto">
        {views.map((v) => (
          <button
            key={v.id}
            style={{ background: tileBg(product.color) }}
            type="button"
            onClick={() => setView(v.id)}
            aria-pressed={view === v.id}
            aria-label={`Tampilan ${v.label.toLowerCase()}`}
            className={`aspect-[4/5] w-20 overflow-hidden rounded-md outline-none ring-offset-2 ring-offset-background transition-shadow focus-visible:ring-2 focus-visible:ring-ring md:w-full ${
              view === v.id ? "ring-2 ring-foreground" : "opacity-70 hover:opacity-100"
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={v.src} alt="" draggable={false} className="size-full object-contain object-top p-1.5" />
          </button>
        ))}
      </div>
      <div className="order-1 md:order-2">
        <div className="relative aspect-[4/5] overflow-hidden rounded-lg" style={{ background: tileBg(product.color) }}>
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.img
              key={current.id}
              src={current.src}
              alt={`${product.name}, tampak ${current.label.toLowerCase()}`}
              draggable={false}
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 size-full object-contain object-top p-8 sm:p-14"
            />
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
