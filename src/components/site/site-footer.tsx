import Link from "next/link";
import { Wordmark } from "@/components/site/site-header";
import { WA_NUMBER } from "@/lib/site";
import { CATEGORIES } from "@/lib/products";

export function SiteFooter() {
  return (
    <footer className="bg-forest text-background">
      <div className="mx-auto grid w-full max-w-[90rem] gap-12 px-5 py-14 sm:px-10 sm:py-16 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="max-w-sm">
          <Wordmark tone="bone" className="!w-[150px] sm:!w-[180px]" />
          <p className="mt-5 text-[15px] leading-relaxed text-background/70">
            Pesanan dan pertanyaan stok kami layani lewat WhatsApp.
          </p>
          <a
            href={`https://wa.me/${WA_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex h-11 items-center text-[15px] underline decoration-background/30 decoration-1 underline-offset-[6px] hover:text-background/60"
          >
            Hubungi lewat WhatsApp
          </a>
        </div>

        <nav aria-label="Belanja">
          <h2 className="text-sm font-medium text-background/55">Belanja</h2>
          <ul className="mt-4 space-y-1 text-[15px]">
            <li>
              <Link href="/koleksi" className="inline-flex min-h-9 items-center hover:text-background/60">
                Semua koleksi
              </Link>
            </li>
            {CATEGORIES.map((c) => (
              <li key={c.id}>
                <Link href={`/koleksi?kategori=${c.id}`} className="inline-flex min-h-9 items-center hover:text-background/60">
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Bantuan">
          <h2 className="text-sm font-medium text-background/55">Bantuan</h2>
          <ul className="mt-4 space-y-1 text-[15px]">
            <li>
              <Link href="/#bahan" className="inline-flex min-h-9 items-center hover:text-background/60">
                Catatan bahan
              </Link>
            </li>
            <li>
              <Link href="/#bantuan" className="inline-flex min-h-9 items-center hover:text-background/60">
                Pengiriman, penukaran, perawatan
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <div className="border-t border-background/10">
        <p className="mx-auto w-full max-w-[90rem] px-5 py-5 text-xs text-background/50 sm:px-10">© 2026 OFFDAY. Semua hak dilindungi.</p>
      </div>
    </footer>
  );
}
