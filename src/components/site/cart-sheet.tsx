"use client";

import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { cartTotals, useCart, WA_NUMBER, whatsappMessage } from "@/lib/cart";
import { getProduct, rupiah, tileBg } from "@/lib/products";

export function CartSheet() {
  const lines = useCart((s) => s.lines);
  const open = useCart((s) => s.open);
  const setOpen = useCart((s) => s.setOpen);
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const { count, subtotal } = cartTotals(lines);
  const href = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(whatsappMessage(lines))}`;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="right" className="gap-0 bg-background p-0 data-[side=right]:w-full data-[side=right]:sm:max-w-md">
        <SheetHeader className="border-b border-border p-6 pb-5">
          <SheetTitle className="font-display tracking-display text-4xl">Keranjang</SheetTitle>
          <SheetDescription>{count === 0 ? "Belum ada pilihan." : `${count} barang siap dipesan.`}</SheetDescription>
        </SheetHeader>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-start justify-center gap-4 p-6">
            <p className="font-display text-2xl leading-snug">Rak masih menunggu.</p>
            <Link
              href="/koleksi"
              onClick={() => setOpen(false)}
              className="text-sm underline decoration-foreground/30 decoration-1 underline-offset-4 hover:decoration-foreground"
            >
              Lihat koleksi
            </Link>
          </div>
        ) : (
          <ul data-lenis-prevent className="flex-1 divide-y divide-border overflow-y-auto px-6">
            {lines.map((line) => {
              const p = getProduct(line.slug);
              if (!p) return null;
              return (
                <li key={`${line.slug}-${line.size}`} className="flex gap-4 py-5">
                  <div className="h-28 w-20 shrink-0 overflow-hidden rounded-md" style={{ background: tileBg(p.color) }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.image} alt="" className="size-full object-contain object-top" />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <Link href={`/produk/${p.slug}`} onClick={() => setOpen(false)} className="text-sm font-medium leading-snug hover:underline">
                        {p.name}
                      </Link>
                      <button
                        type="button"
                        aria-label={`Hapus ${p.name} ukuran ${line.size}`}
                        onClick={() => remove(line.slug, line.size)}
                        className="-mr-2 -mt-1.5 grid size-9 shrink-0 place-items-center rounded-full text-muted-foreground outline-none hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <Trash2 className="size-4" aria-hidden="true" />
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground">Ukuran {line.size}</p>
                    <div className="mt-auto flex items-center justify-between pt-3">
                      <div className="inline-flex items-center rounded-full border border-border">
                        <button
                          type="button"
                          aria-label={`Kurangi ${p.name}`}
                          onClick={() => setQty(line.slug, line.size, line.qty - 1)}
                          className="grid size-8 place-items-center rounded-full outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          <Minus className="size-3.5" aria-hidden="true" />
                        </button>
                        <span className="w-6 text-center font-mono text-xs tabular-nums" aria-live="polite">
                          {line.qty}
                        </span>
                        <button
                          type="button"
                          aria-label={`Tambah ${p.name}`}
                          onClick={() => setQty(line.slug, line.size, line.qty + 1)}
                          className="grid size-8 place-items-center rounded-full outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          <Plus className="size-3.5" aria-hidden="true" />
                        </button>
                      </div>
                      <p className="shrink-0 text-sm tabular-nums">{rupiah(p.price * line.qty)}</p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        {lines.length > 0 && (
          <SheetFooter className="gap-3 border-t border-border p-6">
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-muted-foreground">Subtotal</span>
              <span className="font-display text-3xl tabular-nums">{rupiah(subtotal)}</span>
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">Ongkir dihitung saat konfirmasi. Gratis untuk pesanan di atas Rp500.000.</p>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center rounded-full bg-foreground text-sm font-medium text-background outline-none transition-transform hover:-translate-y-px focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Pesan lewat WhatsApp
            </a>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
