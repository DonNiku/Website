import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
  /** Distance travelled on entry, in px. */
  y?: number;
  as?: "div" | "li" | "section" | "p" | "span";
};

/**
 * Scroll-triggered entry. transform + opacity only, spring-based, and a
 * no-op when the visitor asked for reduced motion.
 */
export function Reveal({
  children,
  delay = 0,
  className,
  y = 28,
  as = "div",
}: RevealProps) {
  const reduce = useReducedMotion();
  const Component = motion[as];

  return (
    <Component
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ type: "spring", stiffness: 90, damping: 20, delay }}
    >
      {children}
    </Component>
  );
}

/**
 * Haarlinie, die sich beim Eintritt von links aufzieht.
 *
 * Der Auslöser sitzt auf dem äußeren Element, nicht auf der skalierten
 * Linie: bei `scaleX: 0` hat die Linie eine Breite von null und damit keine
 * Schnittfläche, ein Observer darauf würde nie feuern.
 */
export function DrawnRule({ className = "" }: { className?: string }) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      aria-hidden
      className={`h-px w-full ${className}`}
      initial={reduce ? false : "hidden"}
      whileInView="visible"
      viewport={{ once: true, amount: "some" }}
    >
      <motion.div
        className="h-px w-full origin-left bg-line"
        variants={{ hidden: { scaleX: 0 }, visible: { scaleX: 1 } }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      />
    </motion.div>
  );
}

/**
 * Display-type reveal: the line slides up from behind a clipping mask.
 * Used only on headlines, where the sequence carries hierarchy.
 *
 * The viewport trigger sits on the *mask*, not on the moving line. The line
 * starts translated fully outside an `overflow: hidden` parent, so its own
 * intersection rect is empty and an observer on it would never fire.
 */
export function MaskLine({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.span
      className="u-mask"
      initial={reduce ? false : "hidden"}
      whileInView="visible"
      viewport={{ once: true, amount: 0.35 }}
    >
      <motion.span
        className={`block ${className ?? ""}`}
        variants={{ hidden: { y: "110%" }, visible: { y: "0%" } }}
        transition={{ type: "spring", stiffness: 70, damping: 18, delay }}
      >
        {children}
      </motion.span>
    </motion.span>
  );
}
