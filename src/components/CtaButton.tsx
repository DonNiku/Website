import { useRef } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";
import { ArrowUpRight } from "@phosphor-icons/react";

type CtaButtonProps = {
  href: string;
  children: string;
  variant?: "solid" | "ghost";
  external?: boolean;
  className?: string;
};

/**
 * Magnetic hover: the button leans toward the cursor. Motivated as
 * feedback, so the primary action feels physical. Pointer-type guarded,
 * driven by motion values (never React state), and flat under
 * prefers-reduced-motion.
 */
export function CtaButton({
  href,
  children,
  variant = "solid",
  external = false,
  className = "",
}: CtaButtonProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const reduce = useReducedMotion();

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const spring = { stiffness: 220, damping: 18, mass: 0.4 };
  const x = useSpring(rawX, spring);
  const y = useSpring(rawY, spring);

  function handleMove(event: React.PointerEvent<HTMLAnchorElement>) {
    if (reduce || event.pointerType !== "mouse" || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    rawX.set((event.clientX - (rect.left + rect.width / 2)) * 0.22);
    rawY.set((event.clientY - (rect.top + rect.height / 2)) * 0.28);
  }

  function reset() {
    rawX.set(0);
    rawY.set(0);
  }

  const surface =
    variant === "solid"
      ? "bg-accent text-white hover:bg-[#6d2fdb]"
      : "border border-line text-fg hover:border-fg-dim";

  return (
    <motion.a
      ref={ref}
      href={href}
      style={reduce ? undefined : { x, y }}
      onPointerMove={handleMove}
      onPointerLeave={reset}
      whileTap={reduce ? undefined : { scale: 0.97 }}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`group inline-flex items-center gap-3 px-6 py-4 font-mono text-xs tracking-[0.14em] whitespace-nowrap uppercase transition-colors duration-200 ${surface} ${className}`}
    >
      {children}
      <ArrowUpRight
        weight="bold"
        aria-hidden
        className="size-3.5 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none"
      />
    </motion.a>
  );
}
