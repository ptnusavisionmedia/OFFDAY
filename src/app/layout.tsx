import { IntroProvider } from "@/components/motion/intro";
import type { Metadata, Viewport } from "next";
import { Geist_Mono, Instrument_Sans, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { CartSheet } from "@/components/site/cart-sheet";
import { Toaster } from "@/components/ui/sonner";

const instrumentSans = Instrument_Sans({ variable: "--font-instrument-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const instrument = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: { default: "OFFDAY — Pakaian untuk hari libur", template: "%s · OFFDAY" },
  description:
    "OFFDAY membuat kaos, kemeja, dan rajut berbahan berat dengan potongan longgar. Dirancang untuk hari yang tidak ada jadwalnya.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  openGraph: { title: "OFFDAY", description: "Pakaian untuk hari libur.", locale: "id_ID", type: "website" },
};

export const viewport: Viewport = { themeColor: "#FAFAF9" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" suppressHydrationWarning className={`${instrumentSans.variable} ${geistMono.variable} ${instrument.variable}`}>
      <body className="flex min-h-svh flex-col">
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.setAttribute("data-intro","skip")}catch(e){}`,
          }}
        />
        <a
          href="#konten"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-foreground focus:px-3 focus:py-2 focus:text-sm focus:text-background"
        >
          Lewati ke konten
        </a>
        <IntroProvider>
          <SiteHeader />
        <main id="konten" className="flex-1">
          {children}
        </main>
        <SiteFooter />
        <CartSheet />
        </IntroProvider>
        <Toaster position="bottom-center" />
      </body>
    </html>
  );
}
