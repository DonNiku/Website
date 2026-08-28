import type { ReactNode } from "react";
import { Grain, ScrollProgress } from "./Chrome";
import { Nav } from "./Nav";
import { Footer } from "./Footer";
import { MaskLine } from "./Reveal";

/**
 * Rahmen für die Rechtsseiten. Bewusst ohne Intro-Vorhang: wer das
 * Impressum oder die Datenschutzerklärung aufruft, sucht eine Information
 * und will nicht auf eine Animation warten.
 */
export function LegalLayout({
  title,
  updated,
  children,
}: {
  title: string;
  /** Datum der letzten Änderung, erscheint als Stand-Angabe. */
  updated: string;
  children: ReactNode;
}) {
  return (
    <>
      <a href="#inhalt" className="skip-link">
        Zum Inhalt springen
      </a>

      <ScrollProgress />
      <Grain />
      <Nav />

      <main id="inhalt">
        <section className="mx-auto max-w-[1400px] px-4 pt-32 pb-16 sm:px-8 sm:pt-40 sm:pb-24">
          <h1 className="u-display max-w-[16ch] text-[clamp(2rem,5.4vw,4.5rem)]">
            <MaskLine>{title}</MaskLine>
          </h1>
          <p className="u-meta mt-7">Stand: {updated}</p>
        </section>

        <div className="border-t border-line">
          <div className="mx-auto max-w-[1400px] px-4 py-16 sm:px-8 sm:py-24">
            <div className="u-prose lg:max-w-[72ch]">{children}</div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
