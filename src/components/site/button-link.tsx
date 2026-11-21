import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function ButtonLink({
  href,
  children,
  variant = "solid",
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "solid" | "outline";
  className?: string;
}) {
  const tone =
    variant === "solid"
      ? "bg-foreground text-background hover:bg-foreground/85"
      : "border border-foreground/20 text-foreground hover:border-foreground";
  return (
    <Link
      href={href}
      className={`group inline-flex h-12 items-center gap-2 rounded-full px-6 text-[15px] font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${tone} ${className}`}
    >
      {children}
      <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
    </Link>
  );
}
