import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUpRight } from "@phosphor-icons/react";
import { Grain, ScrollProgress } from "../components/Chrome";
import { Nav } from "../components/Nav";
import { Footer } from "../components/Footer";
import { MaskLine, Reveal } from "../components/Reveal";
import { Statement } from "../components/Statement";
import { submitCancellation } from "../lib/booking";

/**
 * Die Seite kennt vier Zustände, und der Titel erzählt sie mit:
 * missing  — der Link kam ohne Token an, es gibt nichts zu tun.
 * confirm  — Token vorhanden, der Besucher entscheidet.
 * done     — der Workflow hat storniert und die Mails verschickt.
 * gone     — der Token trifft keine Buchung mehr: bereits storniert
 *            oder nie vergeben. Beides bekommt dieselbe Antwort.
 */
type Phase = "missing" | "confirm" | "done" | "gone";

const GENERIC_ERROR_MESSAGE =
  "Die Anfrage konnte nicht übermittelt werden. Bitte versuchen Sie es noch einmal.";

const COPY: Record<Phase, { statement: string; title: [string, string?] }> = {
  missing: {
    statement: "Dieser Link ist unvollständig.",
    title: ["Kein", "Storno-Link"],
  },
  confirm: {
    statement: "Das lässt sich nicht rückgängig machen.",
    title: ["Termin", "stornieren"],
  },
  done: {
    statement: "Sie erhalten eine Bestätigung per E-Mail.",
    title: ["Termin", "storniert"],
  },
  gone: {
    statement: "Hier gibt es nichts mehr zu tun.",
    title: ["Nichts zu", "stornieren"],
  },
};

export function Storno() {
  const reduce = useReducedMotion();

  /** Der Token steht einmal in der URL und ändert sich danach nicht mehr. */
  const token = useMemo(
    () => new URLSearchParams(window.location.search).get("token")?.trim() ?? "",
    [],
  );

  const [phase, setPhase] = useState<Phase>(token ? "confirm" : "missing");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  /** Zweiter Riegel gegen Doppelklicks, unabhängig vom Render-Zyklus. */
  const inFlight = useRef(false);

  async function handleCancel() {
    if (inFlight.current) return;
    inFlight.current = true;
    setSubmitting(true);
    setSubmitError(null);

    try {
      const result = await submitCancellation(token);
      setPhase(result === "cancelled" ? "done" : "gone");
    } catch {
      setSubmitError(GENERIC_ERROR_MESSAGE);
    } finally {
      inFlight.current = false;
      setSubmitting(false);
    }
  }

  const copy = COPY[phase];
  const transition = reduce
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 90, damping: 20 };

  return (
    <>
      <a href="#inhalt" className="skip-link">
        Zum Inhalt springen
      </a>

      <ScrollProgress />
      <Grain />
      <Nav />

      <main id="inhalt">
        <section className="mx-auto max-w-[1400px] px-4 pt-32 pb-14 sm:px-8 sm:pt-40 sm:pb-20">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={phase}
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduce ? undefined : { opacity: 0 }}
              transition={transition}
            >
              <Statement>{copy.statement}</Statement>

              <h1 className="u-display mt-5 max-w-[14ch] text-[clamp(2.2rem,6vw,5.25rem)]">
                <MaskLine>{copy.title[0]}</MaskLine>
                {copy.title[1] && (
                  <MaskLine delay={0.08}>
                    {copy.title[1]}
                    <span className="u-word-static text-accent">.</span>
                  </MaskLine>
                )}
              </h1>
            </motion.div>
          </AnimatePresence>
        </section>

        <div className="border-t border-line">
          <div className="mx-auto max-w-[1400px] px-4 py-14 sm:px-8 sm:py-20">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={phase}
                initial={reduce ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: -12 }}
                transition={transition}
              >
                {phase === "missing" && (
                  <Reveal>
                    <p className="max-w-[52ch] leading-relaxed text-fg-dim">
                      Dieser Aufruf enthält keinen Storno-Code. Bitte öffnen
                      Sie den Link aus Ihrer Bestätigungs-E-Mail — oder
                      schreiben Sie uns direkt an{" "}
                      <a
                        href="mailto:hallo@avolane.de"
                        className="text-fg underline underline-offset-4"
                      >
                        hallo@avolane.de
                      </a>
                      .
                    </p>

                    <a
                      href="/"
                      className="mt-10 inline-flex items-center gap-3 border border-line px-6 py-4 font-mono text-xs tracking-[0.14em] uppercase transition-colors duration-200 hover:border-fg-dim"
                    >
                      Zurück zur Startseite
                    </a>
                  </Reveal>
                )}

                {phase === "confirm" && (
                  <div>
                    <p className="max-w-[52ch] text-lg leading-relaxed">
                      Möchten Sie Ihren Termin wirklich stornieren?
                    </p>
                    <p className="mt-3 max-w-[52ch] leading-relaxed text-fg-dim">
                      Ihr Slot wird sofort wieder freigegeben. Wenn es nur um
                      eine Verschiebung geht, antworten Sie einfach auf Ihre
                      Bestätigungs-E-Mail.
                    </p>

                    {submitError && (
                      <div
                        role="alert"
                        className="mt-10 max-w-[46rem] border border-line p-6 text-fg-dim"
                      >
                        <p className="text-danger">{submitError}</p>
                        <p className="mt-3">
                          Sie erreichen uns jederzeit direkt unter{" "}
                          <a
                            href="mailto:hallo@avolane.de"
                            className="text-fg underline underline-offset-4"
                          >
                            hallo@avolane.de
                          </a>
                          .
                        </p>
                      </div>
                    )}

                    <div className="mt-10 flex flex-wrap items-center gap-4 border-t border-line pt-8">
                      <button
                        type="button"
                        onClick={handleCancel}
                        disabled={submitting}
                        aria-busy={submitting}
                        className="inline-flex items-center gap-3 bg-accent px-6 py-4 font-mono text-xs tracking-[0.14em] whitespace-nowrap text-white uppercase transition-colors duration-200 hover:bg-[#6d2fdb] disabled:cursor-wait disabled:bg-line disabled:text-fg-dim"
                      >
                        {submitting ? "Wird storniert" : "Termin stornieren"}
                        {submitting ? (
                          <span
                            aria-hidden
                            className="size-3.5 animate-spin rounded-full border border-current border-t-transparent motion-reduce:animate-none"
                          />
                        ) : (
                          <ArrowUpRight
                            weight="bold"
                            aria-hidden
                            className="size-3.5"
                          />
                        )}
                      </button>

                      <a
                        href="/"
                        className="px-2 py-4 font-mono text-xs tracking-[0.14em] text-fg-dim uppercase transition-colors duration-200 hover:text-fg"
                      >
                        Termin behalten
                      </a>
                    </div>
                  </div>
                )}

                {phase === "done" && (
                  <Reveal>
                    <p className="max-w-[52ch] leading-relaxed text-fg-dim">
                      Ihr Termin wurde storniert, der Slot ist wieder frei.
                      Die Bestätigung ist bereits unterwegs in Ihr Postfach.
                    </p>

                    <div className="mt-10 flex flex-wrap items-center gap-4">
                      <a
                        href="/termin"
                        className="inline-flex items-center gap-3 border border-line px-6 py-4 font-mono text-xs tracking-[0.14em] uppercase transition-colors duration-200 hover:border-fg-dim"
                      >
                        Neuen Termin buchen
                      </a>
                      <a
                        href="/"
                        className="px-2 py-4 font-mono text-xs tracking-[0.14em] text-fg-dim uppercase transition-colors duration-200 hover:text-fg"
                      >
                        Zurück zur Startseite
                      </a>
                    </div>
                  </Reveal>
                )}

                {phase === "gone" && (
                  <Reveal>
                    <p className="max-w-[52ch] leading-relaxed text-fg-dim">
                      Dieser Termin wurde bereits storniert oder existiert
                      nicht.
                    </p>

                    <div className="mt-10 flex flex-wrap items-center gap-4">
                      <a
                        href="/termin"
                        className="inline-flex items-center gap-3 border border-line px-6 py-4 font-mono text-xs tracking-[0.14em] uppercase transition-colors duration-200 hover:border-fg-dim"
                      >
                        Neuen Termin buchen
                      </a>
                      <a
                        href="/"
                        className="px-2 py-4 font-mono text-xs tracking-[0.14em] text-fg-dim uppercase transition-colors duration-200 hover:text-fg"
                      >
                        Zurück zur Startseite
                      </a>
                    </div>
                  </Reveal>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
