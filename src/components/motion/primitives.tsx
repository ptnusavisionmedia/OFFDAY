"use client";

import * as React from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useIntroReady } from "@/components/motion/intro";

const EASE = [0.22, 1, 0.36, 1] as const;

const SMOOTH = [0.16, 1, 0.3, 1] as const;

export type RevealVariant = "up" | "fade" | "scale" | "left" | "right" | "blur";

const VARIANTS: Record<RevealVariant, { from: Record<string, string | number>; to: Record<string, string | number> }> = {
  up: { from: { opacity: 0, y: 36 }, to: { opacity: 1, y: 0 } },
  fade: { from: { opacity: 0 }, to: { opacity: 1 } },
  scale: { from: { opacity: 0, scale: 0.93, y: 20 }, to: { opacity: 1, scale: 1, y: 0 } },
  left: { from: { opacity: 0, x: -48 }, to: { opacity: 1, x: 0 } },
  right: { from: { opacity: 0, x: 48 }, to: { opacity: 1, x: 0 } },
  blur: { from: { opacity: 0, scale: 1.05, y: 12 }, to: { opacity: 1, scale: 1, y: 0 } },
};

/** Muncul saat masuk viewport. Pilih variant agar tiap bagian punya gerak berbeda. */
export function Reveal({
  children,
  delay = 0,
  variant = "up",
  className,
  as = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  variant?: RevealVariant;
  /** @deprecated pakai variant */
  y?: number;
  className?: string;
  as?: "div" | "li" | "section";
}) {
  const reduce = useReducedMotion();
  const Tag = motion[as];
  const v = VARIANTS[variant];
  return (
    <Tag
      className={className}
      initial={reduce ? false : v.from}
      style={{ willChange: "transform, opacity" }}
      whileInView={v.to}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: variant === "fade" ? 0.8 : 0.9, delay, ease: SMOOTH }}
    >
      {children}
    </Tag>
  );
}

/** Foto terbuka dengan tirai (clip-path) sambil perlahan mengecil dari zoom. */
export function ImageReveal({
  children,
  delay = 0,
  from = "bottom",
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  from?: "bottom" | "left" | "top";
  className?: string;
}) {
  const reduce = useReducedMotion();
  const hidden = from === "bottom" ? "inset(100% 0 0 0)" : from === "top" ? "inset(0 0 100% 0)" : "inset(0 100% 0 0)";
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { clipPath: hidden }}
      whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 1.3, delay, ease: [0.76, 0, 0.24, 1] }}
    >
      <motion.div
        className="size-full"
        initial={reduce ? false : { scale: 1.12 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, margin: "0px 0px -10% 0px" }}
        transition={{ duration: 1.8, delay, ease: SMOOTH }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

/** Judul pendek yang naik dari balik garis saat masuk viewport. */
export function RevealText({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <span className={`-mb-[0.18em] block overflow-hidden pb-[0.18em] ${className ?? ""}`}>
      <motion.span
        className="block"
        initial={reduce ? false : { y: "110%" }}
        whileInView={{ y: 0 }}
        viewport={{ once: true, margin: "0px 0px -10% 0px" }}
        transition={{ duration: 1.1, delay, ease: SMOOTH }}
      >
        {children}
      </motion.span>
    </span>
  );
}

export type Word = { t: string; em?: boolean };

/** Judul besar: setiap kata naik dari balik garis (masking). */
export function SplitHeading({ lines, className, delay = 0 }: { lines: Word[][]; className?: string; delay?: number }) {
  const reduce = useReducedMotion();
  const ready = useIntroReady();
  let n = 0;
  return (
    <h1 className={className}>
      {lines.map((line, li) => (
        <span key={li} className="block">
          {line.map((w, wi) => {
            const i = n++;
            return (
              <React.Fragment key={wi}>
                <span className="-mx-[0.08em] -mb-[0.16em] inline-block overflow-hidden px-[0.08em] pb-[0.16em] align-bottom">
                  <motion.span
                    className={`inline-block will-change-transform ${w.em ? "italic text-clay" : ""}`}
                    initial={reduce ? false : { y: "110%", rotate: 3 }}
                    animate={ready ? { y: 0, rotate: 0 } : { y: "110%", rotate: 3 }}
                    transition={{ duration: 0.9, delay: delay + i * 0.05, ease: SMOOTH }}
                  >
                    {w.t}
                  </motion.span>
                </span>
                {wi < line.length - 1 ? " " : null}
              </React.Fragment>
            );
          })}
        </span>
      ))}
    </h1>
  );
}

function ScrollWord({ children, range, progress }: { children: React.ReactNode; range: [number, number]; progress: MotionValue<number> }) {
  const opacity = useTransform(progress, range, [0.16, 1]);
  return (
    <motion.span style={{ opacity }} className="inline-block">
      {children}
    </motion.span>
  );
}

/** Paragraf yang menyala kata demi kata mengikuti scroll. */
export function ScrollWords({ text, className }: { text: string; className?: string }) {
  const ref = React.useRef<HTMLParagraphElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.82", "end 0.45"] });
  const words = text.split(" ");
  if (reduce) return <p className={className}>{text}</p>;
  return (
    <p ref={ref} className={className} aria-label={text}>
      {words.map((w, i) => (
        <React.Fragment key={i}>
          <span aria-hidden="true">
            <ScrollWord progress={scrollYProgress} range={[i / words.length, Math.min(1, (i + 2.5) / words.length)]}>
              {w}
            </ScrollWord>
          </span>
          {i < words.length - 1 ? " " : null}
        </React.Fragment>
      ))}
    </p>
  );
}

/** Bergeser pelan berlawanan arah scroll (parallax tipis). */
export function Parallax({ children, offset = 40, className }: { children: React.ReactNode; offset?: number; className?: string }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset]);
  return (
    <motion.div ref={ref} style={reduce ? undefined : { y }} className={className}>
      {children}
    </motion.div>
  );
}
