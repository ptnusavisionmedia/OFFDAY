import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60svh] w-full max-w-7xl flex-col items-start justify-center px-5 sm:px-8">
      <p className="label-mono">404</p>
      <h1 className="font-display mt-3 text-6xl">Hanger ini kosong.</h1>
      <p className="mt-4 max-w-md text-muted-foreground">Halaman yang Anda cari tidak ada, atau sudah pindah rak.</p>
      <Link href="/koleksi" className="mt-8 inline-flex h-11 items-center rounded-full bg-foreground px-6 text-sm font-medium text-background">
        Kembali ke koleksi
      </Link>
    </div>
  );
}
