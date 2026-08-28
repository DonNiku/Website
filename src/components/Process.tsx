import { STEPS } from "../lib/content";
import { MaskLine, Reveal } from "./Reveal";
import { Statement } from "./Statement";

/** Diagonaler Abstieg: jeder Schritt sitzt tiefer als der vorherige. */
const OFFSET = ["lg:mt-0", "lg:mt-28", "lg:mt-56"];

export function Process() {
  return (
    <section
      id="prozess"
      className="border-t border-line py-20 sm:py-32"
      aria-labelledby="prozess-titel"
    >
      <div className="mx-auto max-w-[1400px] px-4 sm:px-8">
        <Statement>Keine Pilotprojekte ohne Ende.</Statement>

        <h2
          id="prozess-titel"
          className="u-display mt-5 max-w-[52rem] text-[clamp(2.2rem,6vw,5.25rem)]"
        >
          <MaskLine delay={0.06}>In drei Schritten</MaskLine>
          <MaskLine delay={0.14}>
            live<span className="text-accent">.</span>
          </MaskLine>
        </h2>

        <div className="mt-16 grid grid-cols-1 gap-x-10 gap-y-14 sm:mt-24 lg:grid-cols-12">
          {STEPS.map((step, i) => (
            <Reveal
              key={step.index}
              delay={i * 0.1}
              className={`border-t border-line pt-7 lg:col-span-4 ${OFFSET[i]}`}
            >
              <span
                aria-hidden
                className="u-display u-outline block text-[clamp(4rem,8.5vw,8rem)] leading-none"
              >
                {step.index}
              </span>

              <h3 className="u-display-sm mt-7 text-[clamp(1.6rem,3vw,2.5rem)]">
                {step.title}
              </h3>

              <p className="mt-4 max-w-[38ch] leading-relaxed text-fg-dim">
                {step.description}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
