import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { CtaButton } from "./CtaButton";
import { PhotoCycle } from "./Photo";
import { Ticker } from "./Ticker";
import { BOOKING_URL, CTA_LABEL, HERO_PHOTOS } from "../lib/content";

/** Versatz, damit der Titel hinter dem aufziehenden Vorhang hervorkommt. */
const INTRO = 0.78;

/**
 * Einzelnes Hero-Wort als eigene Hover-Fläche. `inline-block` ist Pflicht:
 * auf einem reinen Inline-Element greift keine Transformation, das Wort
 * würde beim Hovern nicht anspringen.
 */
function Word({ children }: { children: ReactNode }) {
  return <span className="u-word">{children}</span>;
}

export function Hero() {
  const reduce = useReducedMotion();

  const line = {
    initial: reduce ? false : { y: "108%" },
    animate: { y: "0%" },
  };

  return (
    <section id="top" className="relative flex min-h-[100dvh] flex-col">
      <div className="flex flex-1 flex-col justify-center pt-24 pb-10 sm:pt-28">
        <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-8">
          <motion.p
            className="u-statement"
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: INTRO }}
          >
            Wir machen keine Tools.
          </motion.p>

          {/* Größe an der längsten Zeile ("Weniger Aufwand.") ausgemessen:
              der vw-Term hält sie ab ~500px zweizeilig, der Mindestwert
              tauscht das auf Telefonen gegen Größe ein. */}
          <h1 className="u-display mt-6 text-[clamp(2.5rem,7.05vw,6.5rem)] tracking-[-0.035em] sm:mt-8">
            <span className="u-mask">
              <motion.span
                className="block"
                {...line}
                transition={{
                  type: "spring",
                  stiffness: 62,
                  damping: 17,
                  delay: INTRO + 0.06,
                }}
              >
                <Word>Weniger</Word> <Word>Aufwand.</Word>
              </motion.span>
            </span>
            <span className="u-mask">
              <motion.span
                className="block"
                {...line}
                transition={{
                  type: "spring",
                  stiffness: 62,
                  damping: 17,
                  delay: INTRO + 0.16,
                }}
              >
                {/* Der Punkt bleibt im Wort, damit der Vorlesename
                    "WACHSTUM." lautet und nicht "WACHSTUM ." (ein
                    inline-block daneben erzeugt eine Wortgrenze). Vom
                    Konturwechsel ist er per `u-word-static` ausgenommen und
                    bleibt als Markenzeichen gefüllt stehen. */}
                <Word>Mehr</Word>{" "}
                <Word>
                  Wachstum<span className="u-word-static text-accent">.</span>
                </Word>
              </motion.span>
            </span>
          </h1>

          <motion.div
            className="mt-8 flex flex-col gap-8 sm:mt-10 lg:flex-row lg:items-end lg:justify-between"
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              type: "spring",
              stiffness: 80,
              damping: 20,
              delay: INTRO + 0.34,
            }}
          >
            <div className="flex flex-wrap items-center gap-3">
              <CtaButton href={BOOKING_URL}>
                {CTA_LABEL}
              </CtaButton>
              <CtaButton href="#agenten" variant="ghost">
                Agenten ansehen
              </CtaButton>
            </div>

            <p className="u-statement text-fg lg:text-right">
              Wir übernehmen Arbeit.
            </p>
          </motion.div>
        </div>

        <motion.div
          className="mt-10 px-4 sm:mt-14 sm:px-8"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: INTRO + 0.42 }}
        >
          <PhotoCycle
            photos={HERO_PHOTOS}
            width={2000}
            height={900}
            className="mx-auto h-[clamp(160px,26vh,300px)] w-full max-w-[1400px]"
          />
        </motion.div>
      </div>

      <Ticker />
    </section>
  );
}
