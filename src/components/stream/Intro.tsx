import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { prefersReducedMotion } from "./state";

const DURATION = 2500;

export default function Intro({ onDone }: { onDone: () => void }) {
  const [showSkip, setShowSkip] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion()) { onDone(); return; }
    const t1 = setTimeout(() => setShowSkip(true), 500);
    const t2 = setTimeout(onDone, DURATION);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onDone]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-page" role="dialog" aria-label="Intro">
      {/* spinning knot silhouette */}
      <motion.div
        aria-hidden
        className="absolute h-72 w-72 rounded-full opacity-30"
        style={{ background: "var(--intro-glow)" }}
        animate={{ rotate: 360, scale: [1, 1.15, 1] }}
        transition={{ duration: DURATION / 1000, ease: "easeInOut" }}
      />
      <div className="relative overflow-hidden">
        <motion.h1
          className="font-wide px-6 text-center text-5xl text-heading sm:text-7xl"
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
        >
          DHARANI E P
        </motion.h1>
        {/* cobalt light sweep */}
        <motion.div
          aria-hidden
          className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-primary/60 to-transparent"
          initial={{ x: "-150%" }}
          animate={{ x: "450%" }}
          transition={{ duration: 1.4, delay: 0.4, ease: "easeInOut" }}
        />
      </div>
      {showSkip && (
        <button
          onClick={onDone}
          className="absolute bottom-8 right-8 rounded-md border border-border px-4 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:border-primary hover:text-heading"
        >
          Skip intro
        </button>
      )}
    </div>
  );
}
