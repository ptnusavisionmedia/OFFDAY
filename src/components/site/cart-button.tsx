"use client";

import * as React from "react";
import { ShoppingBag } from "lucide-react";
import { cartTotals, useCart } from "@/lib/cart";

export function CartButton() {
  const lines = useCart((s) => s.lines);
  const setOpen = useCart((s) => s.setOpen);
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    void Promise.resolve(useCart.persist.rehydrate()).then(() => setReady(true));
  }, []);

  const { count } = cartTotals(lines);
  const shown = ready ? count : 0;

  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      aria-label={`Buka keranjang, ${shown} barang`}
      className="relative ml-1 inline-flex h-10 items-center gap-2 rounded-full bg-foreground px-4 text-sm font-medium text-background outline-none transition-transform hover:-translate-y-px focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <ShoppingBag className="size-4" aria-hidden="true" />
      <span className="hidden sm:inline">Keranjang</span>
      <span className="font-mono text-xs tabular-nums" aria-hidden="true">
        {shown}
      </span>
    </button>
  );
}
