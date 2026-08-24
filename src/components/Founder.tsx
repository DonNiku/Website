import { motion, useReducedMotion } from "motion/react";
import { Photo } from "./Photo";
import { MaskLine, Reveal } from "./Reveal";
import { FOUNDERS } from "../lib/content";

/**
 * Eintritt einer Reihe. Portrait und Textblock kommen leicht versetzt,
 * damit sich die Sektion aufbaut statt als Block zu erscheinen.
 *
 * `margin: "-100px"` zieht den Auslöser hinter die Sichtkante zurück: die
 * Bewegung ist beim Scrollen schon vorbei, bevor die Zeile mittig steht.
 */
const VIEWPORT = { once: true, margin: "-100px" } as const;
const SPRING = { type: "spring", stiffness: 88, damping: 20 } as const;

/**
 * Eine Reihe je Person, abwechselnd gespiegelt. Beide Kacheln stehen
 * explizit in `row-start-1`: das Portrait steht im Markup zuerst, in der
 * gespiegelten Variante liegt es aber rechts, und die automatische
 * Platzierung würde den Text sonst in die nächste Zeile schieben.
 */
const ROWS = [
  {
    photo: "lg:col-span-5 lg:col-start-1 lg:row-start-1",
    text: "lg:col-span-6 lg:col-start-7 lg:row-start-1",
  },
  {
    photo: "lg:col-span-5 lg:col-start-8 lg:row-start-1",
    text: "lg:col-span-6 lg:col-start-1 lg:row-start-1",
  },
];

export function Founder() {
  const reduce = useReducedMotion();
  const enter = {
    initial: reduce ? false : { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: VIEWPORT,
  };

  return (
    <section
      id="gruender"
      className="border-t border-line py-20 sm:py-32"
      aria-labelledby="gruender-titel"
    >
      <div className="mx-auto max-w-[1400px] px-4 sm:px-8">
        {/* Die Zeilen sind gesetzt, nicht dem Umbruch überlassen: jede
            Zeile ist eine eigene Maske und fährt einzeln auf. Die Größe
            richtet sich nach „SIE SPRECHEN MIT UNS." – das ist die
            breiteste Zeile und bestimmt, was hier passt. Bewusst ohne
            Breitenbegrenzung: die Zeile darf innerhalb ihrer Maske nirgends
            umbrechen, sonst fahren zwei Zeilen als ein Block auf. */}
        <h2
          id="gruender-titel"
          className="u-display text-[clamp(2.1rem,6vw,5.25rem)]"
        >
          <MaskLine delay={0.06}>Sie sprechen nicht</MaskLine>
          <MaskLine delay={0.14}>mit einer Agentur.</MaskLine>
          <MaskLine delay={0.22}>
            Sie sprechen mit uns<span className="text-accent">.</span>
          </MaskLine>
        </h2>

        <div className="mt-16 grid gap-y-20 sm:mt-24 sm:gap-y-28">
          {FOUNDERS.map((founder, i) => {
            const row = ROWS[i % ROWS.length];
            return (
              <div
                key={founder.name}
                // `items-end`: Portrait und Textblock schließen unten auf
                // derselben Linie ab, das trägt die Zweispaltigkeit.
                className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-end lg:gap-12"
              >
                <motion.div
                  {...enter}
                  transition={SPRING}
                  className={row.photo}
                >
                  <Photo
                    src={founder.photo}
                    width={founder.size.w}
                    height={founder.size.h}
                    className="aspect-[4/5] w-full"
                  />
                </motion.div>

                <motion.div
                  {...enter}
                  transition={{ ...SPRING, delay: 0.1 }}
                  className={row.text}
                >
                  <h3 className="u-display text-[clamp(2rem,4.6vw,4.2rem)]">
                    {founder.name.split(" ").map((part, p) => (
                      <MaskLine key={part} delay={0.06 + p * 0.08}>
                        {part}
                      </MaskLine>
                    ))}
                  </h3>

                  <Reveal as="p" delay={0.22} className="u-meta mt-6 text-accent">
                    {founder.role}
                  </Reveal>

                  <Reveal
                    as="p"
                    delay={0.28}
                    y={40}
                    className="mt-7 max-w-[48ch] leading-relaxed text-fg-dim"
                  >
                    {founder.claim}
                  </Reveal>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
