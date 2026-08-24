import { motion, useScroll, useSpring, useReducedMotion } from "motion/react";

/**
 * Reading-position indicator. Motivated: on a single-page site with four
 * long sections this is the only wayfinding the user gets.
 */
export function ScrollProgress() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 28,
    restDelta: 0.001,
  });

  if (reduce) return null;

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="pointer-events-none fixed inset-x-0 top-0 z-60 h-px origin-left bg-accent"
    />
  );
}

/** Fixed, never repainted on scroll. */
export function Grain() {
  return (
    <div
      aria-hidden
      className="u-grain pointer-events-none fixed inset-0 z-50 opacity-[0.035] mix-blend-screen"
    />
  );
}
