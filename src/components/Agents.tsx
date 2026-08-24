import { motion, useReducedMotion } from "motion/react";
import { AGENTS, BOOKING_URL, CTA_LABEL } from "../lib/content";
import { CtaButton } from "./CtaButton";
import { Photo } from "./Photo";
import { DrawnRule, MaskLine, Reveal } from "./Reveal";
import { Statement } from "./Statement";

/**
 * Pro Block eine andere Aufteilung. Block 03 bricht die Reihe bewusst mit
 * einem vollbreiten Bild, damit die Sektion nicht in ein mechanisches
 * Links-Rechts-Zickzack kippt.
 */
const LAYOUTS = [
  {
    photo: "aspect-[16/10] lg:col-span-7 lg:col-start-1 lg:row-start-1",
    text: "lg:col-span-4 lg:col-start-9 lg:row-start-1 lg:self-end",
    size: { w: 1400, h: 875 },
  },
  {
    photo: "aspect-[4/3] lg:col-span-6 lg:col-start-7 lg:row-start-1",
    text: "lg:col-span-4 lg:col-start-1 lg:row-start-1 lg:self-end",
    size: { w: 1200, h: 900 },
  },
  {
    photo: "aspect-[16/9] lg:aspect-[21/9] lg:col-span-12 lg:row-start-1",
    text: "lg:col-span-5 lg:col-start-8 lg:row-start-2 lg:mt-2",
    size: { w: 2000, h: 857 },
  },
  {
    photo: "aspect-[4/3] lg:aspect-[4/5] lg:col-span-5 lg:col-start-1 lg:row-start-1",
    text: "lg:col-span-5 lg:col-start-7 lg:row-start-1 lg:self-end",
    size: { w: 1000, h: 1250 },
  },
];

export function Agents() {
  const reduce = useReducedMotion();

  return (
    <section
      id="agenten"
      className="border-t border-line py-20 sm:py-32"
      aria-labelledby="agenten-titel"
    >
      <div className="mx-auto max-w-[1400px] px-4 sm:px-8">
        <Statement>Jeder Prozess ist ein leeres Blatt.</Statement>

        <h2
          id="agenten-titel"
          className="u-display mt-5 max-w-[16ch] text-[clamp(2.2rem,6vw,5.25rem)]"
        >
          <MaskLine delay={0.06}>Vier Agenten.</MaskLine>
          <MaskLine delay={0.14}>Ein System.</MaskLine>
        </h2>

        <Statement delay={0.22} className="mt-6 text-fg">
          Wir füllen es mit Ergebnissen.
        </Statement>
      </div>

      <div className="mt-16 sm:mt-24">
        {AGENTS.map((agent, i) => {
          const layout = LAYOUTS[i];
          return (
            <motion.article
              key={agent.name}
              className="group border-t border-line py-12 sm:py-16"
              initial={reduce ? false : { opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ type: "spring", stiffness: 88, damping: 20 }}
            >
              <div className="mx-auto max-w-[1400px] px-4 sm:px-8">
                <div className="flex items-baseline justify-between gap-6">
                  <span className="u-meta text-accent">{agent.index}</span>
                  <span className="u-meta text-right">{agent.stack}</span>
                </div>

                {/* motion-reduce muss `translate` zurücksetzen, nicht
                    `transform` (Tailwind v4 nutzt die eigene Property). */}
                <h3 className="u-display mt-5 text-[clamp(2rem,5.8vw,5rem)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-2 motion-reduce:translate-none motion-reduce:transition-none">
                  {agent.name}
                </h3>

                <div className="mt-9 grid grid-cols-1 gap-8 sm:mt-12 lg:grid-cols-12 lg:gap-10">
                  <Photo
                    src={agent.photo}
                    width={layout.size.w}
                    height={layout.size.h}
                    zoom
                    className={layout.photo}
                  />
                  <p
                    className={`text-lg leading-relaxed text-fg-dim lg:text-xl ${layout.text}`}
                  >
                    {agent.claim}
                  </p>
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>

      {/* Abschluss-Block: schließt die Liste ab und fängt die Prozesse auf,
          die in den vier Agenten nicht vorkommen. */}
      <DrawnRule />

      <div className="mx-auto max-w-[1400px] px-4 pt-16 sm:px-8 sm:pt-24">
        <div className="grid gap-9 lg:grid-cols-12 lg:items-end lg:gap-10">
          <div className="lg:col-span-6">
            <Statement className="text-fg">
              Ihr Prozess ist nicht dabei?
            </Statement>

            <Reveal
              as="p"
              delay={0.1}
              className="mt-5 max-w-[46ch] leading-relaxed text-fg-dim"
            >
              Die meisten unserer Automatisierungen entstehen individuell.
              Erzählen Sie uns, was Sie loswerden wollen.
            </Reveal>
          </div>

          <Reveal
            delay={0.18}
            className="lg:col-span-4 lg:col-start-9 lg:justify-self-end"
          >
            <CtaButton href={BOOKING_URL}>
              {CTA_LABEL}
            </CtaButton>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
