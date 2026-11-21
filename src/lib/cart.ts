"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getProduct, rupiah, type Size } from "@/lib/products";

export interface CartLine {
  slug: string;
  size: Size;
  qty: number;
}

interface CartState {
  lines: CartLine[];
  open: boolean;
  setOpen: (open: boolean) => void;
  add: (slug: string, size: Size) => void;
  setQty: (slug: string, size: Size, qty: number) => void;
  remove: (slug: string, size: Size) => void;
  clear: () => void;
}

const same = (a: CartLine, slug: string, size: Size) => a.slug === slug && a.size === size;

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      open: false,
      setOpen: (open) => set({ open }),
      add: (slug, size) =>
        set((s) => {
          const hit = s.lines.find((l) => same(l, slug, size));
          const lines = hit
            ? s.lines.map((l) => (same(l, slug, size) ? { ...l, qty: Math.min(9, l.qty + 1) } : l))
            : [...s.lines, { slug, size, qty: 1 }];
          return { lines, open: true };
        }),
      setQty: (slug, size, qty) =>
        set((s) => ({
          lines:
            qty <= 0
              ? s.lines.filter((l) => !same(l, slug, size))
              : s.lines.map((l) => (same(l, slug, size) ? { ...l, qty: Math.min(9, qty) } : l)),
        })),
      remove: (slug, size) => set((s) => ({ lines: s.lines.filter((l) => !same(l, slug, size)) })),
      clear: () => set({ lines: [] }),
    }),
    { name: "offday-cart", partialize: (s) => ({ lines: s.lines }), skipHydration: true },
  ),
);

export function cartTotals(lines: CartLine[]) {
  let count = 0;
  let subtotal = 0;
  for (const l of lines) {
    const p = getProduct(l.slug);
    if (!p) continue;
    count += l.qty;
    subtotal += p.price * l.qty;
  }
  return { count, subtotal };
}

/** Pesan siap kirim ke WhatsApp toko. */
export function whatsappMessage(lines: CartLine[]) {
  const rows = lines.flatMap((l) => {
    const p = getProduct(l.slug);
    return p ? [`• ${p.name} — ${l.size} × ${l.qty} (${rupiah(p.price * l.qty)})`] : [];
  });
  const { subtotal } = cartTotals(lines);
  return [
    "Halo OFFDAY, saya ingin memesan:",
    ...rows,
    "",
    `Subtotal: ${rupiah(subtotal)}`,
    "Mohon info ongkir dan cara pembayaran. Terima kasih!",
  ].join("\n");
}

import { WA_NUMBER } from "@/lib/site";
export { WA_NUMBER };
