import { useEffect } from "react";
import { Grain, ScrollProgress } from "./components/Chrome";
import { IntroCurtain } from "./components/IntroCurtain";
import { Nav } from "./components/Nav";
import { Hero } from "./components/Hero";
import { Agents } from "./components/Agents";
import { Process } from "./components/Process";
import { ContactCta } from "./components/ContactCta";
import { Footer } from "./components/Footer";

/**
 * Springt nach dem ersten Rendern an das Ziel im URL-Fragment.
 *
 * Nötig, weil die Navigation von den Rechtsseiten aus auf /#agenten zeigt:
 * Der Browser sucht den Anker beim Laden, da hat React aber noch nichts
 * gerendert, und der Sprung verpufft. Das Warten auf `fonts.ready` verhindert
 * zusätzlich, dass der Schriftwechsel die Zielposition nachträglich verschiebt.
 */
function useHashTarget() {
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id) return;

    let cancelled = false;
    document.fonts.ready.then(() => {
      if (cancelled) return;
      document
        .getElementById(id)
        ?.scrollIntoView({ behavior: "instant", block: "start" });
    });

    return () => {
      cancelled = true;
    };
  }, []);
}

export default function App() {
  useHashTarget();

  return (
    <>
      <a href="#inhalt" className="skip-link">
        Zum Inhalt springen
      </a>

      <IntroCurtain />
      <ScrollProgress />
      <Grain />

      <Nav />

      <main id="inhalt">
        <Hero />
        <Agents />
        <Process />
        <ContactCta />
      </main>

      <Footer />
    </>
  );
}
