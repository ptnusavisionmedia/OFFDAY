"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { CartButton } from "@/components/site/cart-button";

const NAV = [
  { href: "/koleksi", label: "Koleksi" },
  { href: "/#bahan", label: "Bahan" },
  { href: "/#bantuan", label: "Bantuan" },
];

/** Logo resmi OFFDAY (PNG transparan). "ink" untuk latar terang, "bone" untuk latar gelap. */
export function Wordmark({ tone = "ink", className = "" }: { tone?: "ink" | "bone"; className?: string }) {
  return (
    <Image
      src={`/brand/offday-logo-${tone}.png`}
      alt=""
      width={680}
      height={332}
      priority
      className={`h-auto w-[84px] select-none sm:w-[112px] ${className}`}
    />
  );
}

export function SiteHeader() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 12);
    setHidden(y > 240 && y > prev);
  });

  return (
    <motion.header
      animate={{ y: hidden ? "-100%" : 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={`sticky top-0 z-40 border-b transition-[background-color,border-color,backdrop-filter] duration-300 ${
        scrolled ? "border-border/80 bg-background/80 backdrop-blur-xl" : "border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-[72px] w-full max-w-[90rem] items-center justify-between px-5 sm:px-10">
        <Link href="/" aria-label="OFFDAY, beranda" className="-ml-2 block rounded-sm px-2 outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <Wordmark />
        </Link>
        <nav aria-label="Utama" className="flex items-center gap-1 sm:gap-3">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group relative hidden rounded-full px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring first:inline-flex sm:inline-flex"
            >
              {item.label}
              <span className="absolute inset-x-3 bottom-1 h-px origin-left scale-x-0 bg-foreground transition-transform duration-300 ease-out group-hover:scale-x-100" />
            </Link>
          ))}
          <CartButton />
        </nav>
      </div>
    </motion.header>
  );
}
