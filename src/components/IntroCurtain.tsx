import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

const PANELS = 5;

/**
 * Vorhang beim Seitenstart: der Wortmarken-Screen zerfällt in Spalten, die
 * gestaffelt nach oben ziehen. Reine transform/opacity-Bewegung.
 *
 * `pointer-events-none`, damit ein früher Klick nie ins Leere geht, und
 * `aria-hidden`, weil der Vorhang keine Information trägt. Bei
 * prefers-reduced-motion wird gar nichts gerendert.
 */
export function IntroCurtain() {
  const reduce = useReducedMotion();
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (reduce) return;
    const timer = setTimeout(() => setDone(true), 1900);
    return () => clearTimeout(timer);
  }, [reduce]);

  if (reduce || done) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[95] flex overflow-hidden"
    >
      {Array.from({ length: PANELS }, (_, i) => (
        <motion.div
          key={i}
          className="h-full flex-1 bg-ink"
          initial={{ y: 0 }}
          animate={{ y: "-101%" }}
          transition={{
            type: "spring",
            stiffness: 48,
            damping: 15,
            delay: 0.62 + i * 0.06,
          }}
        />
      ))}

      <motion.span
        className="u-display absolute inset-0 flex items-center justify-center text-[clamp(2rem,6vw,5rem)]"
        initial={{ opacity: 1, y: 0 }}
        animate={{ opacity: 0, y: -18 }}
        transition={{ duration: 0.32, delay: 0.5 }}
      >
        Avolane
      </motion.span>
    </div>
  );
}
