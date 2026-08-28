import { CtaButton } from "./CtaButton";
import { Photo } from "./Photo";
import { MaskLine, Reveal } from "./Reveal";
import { Statement } from "./Statement";
import { BOOKING_URL, CTA_LABEL, CTA_PHOTO } from "../lib/content";

export function ContactCta() {
  return (
    <section
      id="kontakt"
      className="relative isolate overflow-hidden border-t border-line"
      aria-labelledby="kontakt-titel"
    >
      <Photo
        src={CTA_PHOTO}
        width={2000}
        height={1200}
        className="absolute inset-0 -z-10 h-full w-full ring-0"
      />
      {/* Abdunkelung für den Textkontrast über dem Foto. Flächig, kein
          Verlauf, damit die Fläche zur Bildbehandlung passt. */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-ink/70" />

      <div className="mx-auto max-w-[1400px] px-4 py-28 text-center sm:px-8 sm:py-44">
        <Statement className="text-fg-dim">
          Reden wir über Ihre Abläufe.
        </Statement>

        <h2
          id="kontakt-titel"
          className="u-display mx-auto mt-6 max-w-[68rem] text-[clamp(2.1rem,6.4vw,6rem)]"
        >
          <MaskLine delay={0.06}>Bereit für den</MaskLine>
          <MaskLine delay={0.14}>
            nächsten Schritt<span className="text-accent">?</span>
          </MaskLine>
        </h2>

        <Reveal
          as="p"
          delay={0.22}
          className="mx-auto mt-8 max-w-[46ch] leading-relaxed text-fg-dim"
        >
          Unverbindliches Erstgespräch. Wir sagen Ihnen, was sich lohnt und was
          nicht.
        </Reveal>

        <Reveal delay={0.3} className="mt-11 flex justify-center">
          <CtaButton href={BOOKING_URL} className="px-8 py-5 text-sm">
            {CTA_LABEL}
          </CtaButton>
        </Reveal>
      </div>
    </section>
  );
}
