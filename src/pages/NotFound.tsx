import { Grain, ScrollProgress } from "../components/Chrome";
import { Nav } from "../components/Nav";
import { Footer } from "../components/Footer";
import { CtaButton } from "../components/CtaButton";
import { MaskLine, Reveal } from "../components/Reveal";
import { Statement } from "../components/Statement";

/**
 * Fehlerseite im Seitenbild. Bewusst ohne Intro-Vorhang: wer hier landet,
 * hat sich vertan und soll ohne Wartezeit zurückfinden.
 *
 * Die Ziffernfolge liegt als Kontur über dem Grund, dasselbe Mittel wie bei
 * den Schrittnummern im Prozess. `aria-hidden`, weil die Überschrift die
 * Aussage bereits trägt.
 */
export function NotFound() {
  return (
    <>
      <a href="#inhalt" className="skip-link">
        Zum Inhalt springen
      </a>

      <ScrollProgress />
      <Grain />
      <Nav />

      <main id="inhalt">
        <section className="mx-auto flex min-h-[100dvh] max-w-[1400px] flex-col justify-center px-4 pt-32 pb-24 sm:px-8 sm:pt-40">
          <span
            aria-hidden
            className="u-display u-outline block text-[clamp(5.5rem,20vw,17rem)] leading-none"
          >
            404
          </span>

          <h1 className="u-display mt-10 text-[clamp(2rem,6vw,5.25rem)]">
            <MaskLine delay={0.06}>Diese Seite</MaskLine>
            <MaskLine delay={0.14}>
              gibt es nicht<span className="text-accent">.</span>
            </MaskLine>
          </h1>

          <Statement delay={0.22} className="mt-8">
            Der Link ist alt oder die Adresse hat einen Dreher.
          </Statement>

          <Reveal delay={0.3} className="mt-11 flex flex-wrap gap-3">
            <CtaButton href="/">Zur Startseite</CtaButton>
            <CtaButton href="/#agenten" variant="ghost">
              Agenten ansehen
            </CtaButton>
          </Reveal>
        </section>
      </main>

      <Footer />
    </>
  );
}
