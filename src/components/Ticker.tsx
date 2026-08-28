import { motion, useReducedMotion } from "motion/react";
import { AGENTS } from "../lib/content";

/**
 * The one marquee on this page. It is not decoration: each item is a link
 * into the corresponding entry of the agent list below.
 */
export function Ticker() {
  const reduce = useReducedMotion();
  const items = AGENTS.map((agent) => agent.name);

  const row = (copy: number) => (
    <ul className="flex shrink-0 items-center" aria-hidden={copy > 0}>
      {items.map((name) => (
        <li key={`${copy}-${name}`} className="flex items-center">
          <a
            href="#agenten"
            tabIndex={copy > 0 ? -1 : undefined}
            className="u-display-sm px-6 py-4 text-[clamp(1.1rem,2.4vw,1.9rem)] text-fg-dim transition-colors duration-200 hover:text-fg sm:px-9"
          >
            {name}
          </a>
          <span aria-hidden className="text-accent">
            /
          </span>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="border-y border-line">
      <div className="overflow-hidden">
        {reduce ? (
          <div className="flex">{row(0)}</div>
        ) : (
          <motion.div
            className="flex w-max"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 32, ease: "linear", repeat: Infinity }}
          >
            {row(0)}
            {row(1)}
          </motion.div>
        )}
      </div>
    </div>
  );
}
