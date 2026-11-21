"use client";

import * as React from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";

const IntroContext = React.createContext(true);

/** true begitu tirai mulai terangkat; animasi hero mulai pada saat itu. */
export const useIntroReady = () => React.useContext(IntroContext);

type Phase = "play" | "exit" | "done";

/**
 * Layar pembuka singkat (~1,8 dtk): logo tersapu langsung begitu halaman muncul, tirai naik,
 * hero masuk. Tampil di setiap muat ulang. Dilewati untuk prefers-reduced-motion.
 * Hanya transform dan clip-path kecil, tidak menunggu gambar.
 */
export function IntroProvider({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  const [phase, setPhase] = React.useState<Phase>("play");

  React.useEffect(() => {
    if (reduce) {
      const skip = window.setTimeout(() => setPhase("done"), 0);
      return () => window.clearTimeout(skip);
    }
    const toExit = window.setTimeout(() => setPhase("exit"), 950);
    const toDone = window.setTimeout(() => setPhase("done"), 950 + 900);
    return () => {
      window.clearTimeout(toExit);
      window.clearTimeout(toDone);
    };
  }, [reduce]);

  return (
    <IntroContext.Provider value={phase !== "play"}>
      {children}
      {phase !== "done" && (
        <motion.div
          aria-hidden="true"
          initial={false}
          animate={{ y: phase === "exit" ? "-101%" : "0%" }}
          transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
          style={{ willChange: "transform" }}
          className="intro-overlay fixed inset-0 z-[100] grid place-items-center bg-background shadow-[0_30px_60px_-20px_rgba(0,0,0,0.12)]"
        >
          <motion.div
            animate={phase === "exit" ? { opacity: 0, y: -24 } : { opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex flex-col items-center"
          >
            <div className="relative w-[min(70vw,340px)]">
              <Image src="/brand/offday-logo-ink.png" alt="" width={680} height={332} priority className="h-auto w-full opacity-[0.08]" />
              <motion.div
                className="absolute inset-0"
                initial={{ clipPath: "inset(0 100% 0 0)" }}
                animate={{ clipPath: "inset(0 -2% 0 0)" }}
                transition={{ duration: 0.85, ease: [0.65, 0, 0.35, 1] }}
              >
                <Image src="/brand/offday-logo-ink.png" alt="" width={680} height={332} priority className="h-auto w-full" />
              </motion.div>
            </div>

            <div className="mt-7 h-px w-[min(36vw,180px)] overflow-hidden bg-foreground/10">
              <motion.div
                className="h-full origin-left bg-foreground"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.95, ease: [0.45, 0, 0.2, 1] }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </IntroContext.Provider>
  );
}
