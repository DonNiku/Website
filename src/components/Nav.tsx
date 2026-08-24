import { useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "motion/react";
import { BOOKING_URL, CTA_LABEL } from "../lib/content";

/**
 * Absolute Ziele, damit dieselbe Navigation auch auf den Rechtsseiten
 * funktioniert. Auf der Startseite bleibt es ein Sprung im selben Dokument.
 */
const LINKS = [
  { href: "/#agenten", label: "Agenten" },
  { href: "/#prozess", label: "Prozess" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();

  // Boolean flip only: React bails out on an unchanged value, so this does
  // not re-render per scroll frame.
  useMotionValueEvent(scrollY, "change", (value) => {
    setScrolled(value > 24);
  });

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 h-16 border-b transition-colors duration-300 sm:h-[72px] ${
        scrolled
          ? "border-line bg-ink/80 backdrop-blur-md"
          : "border-transparent bg-transparent"
      }`}
    >
      <nav
        aria-label="Hauptnavigation"
        className="mx-auto flex h-full max-w-[1400px] items-center justify-between gap-6 px-5 sm:px-8"
      >
        <a
          href="/#top"
          className="u-display-sm text-lg leading-none sm:text-xl"
          aria-label="Avolane, zum Seitenanfang"
        >
          Avolane
        </a>

        <div className="flex items-center gap-6 sm:gap-8">
          <ul className="hidden items-center gap-6 sm:flex sm:gap-8">
            {LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="u-meta transition-colors duration-200 hover:text-fg"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <motion.a
            href={BOOKING_URL}
            whileTap={reduce ? undefined : { scale: 0.97 }}
            className="bg-accent px-4 py-2.5 font-mono text-[11px] tracking-[0.14em] whitespace-nowrap text-white uppercase transition-colors duration-200 hover:bg-[#6d2fdb] sm:px-5"
          >
            {CTA_LABEL}
          </motion.a>
        </div>
      </nav>
    </header>
  );
}
