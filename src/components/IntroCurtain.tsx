import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { REGISTER_ECKEN, REGISTER_STRICH } from "./Logo";
import { STARTSEQUENZ_LAEUFT } from "../lib/intro";

/**
 * Startsequenz „Der Schriftzug zieht sich ins O".
 *
 * 0–350 ms     Vorhang steht, die Buchstaben treten einzeln auf: von
 *               außen nach innen, jeder aus opacity 0 und leichtem
 *               Tiefversatz. Das O kommt zuletzt und rastet als
 *               Ankerpunkt ein.
 * 350–500 ms    Die Wortmarke steht satt.
 * 500–1000 ms   Alle Buchstaben außer dem O fahren auf die O-Position und
 *               blenden aus, die äußersten zuerst. Gleichzeitig rückt der
 *               Schriftzug so weit, dass das O in der Bildmitte landet.
 * 1000–1300 ms  Das O steht allein: die vier Passmarken-Ecken schnappen aus
 *               einem Mikro-Versatz ein, der violette Punkt setzt sich.
 * 1300–1600 ms  Der Vorhang teilt sich am O und fährt zur Seite.
 *
 * Bewegt werden ausschließlich transform und opacity. Die Buchstaben sind
 * einzelne inline-block-Spans, ihre Zielwege werden am gerenderten Text
 * gemessen — nichts an Breite oder Position wird animiert.
 */

const WORT = "avolane";
/** Position des O im Wort. Es bleibt stehen, alles andere fährt darauf zu. */
const O_INDEX = 2;

const PHASE = { schriftzug: 500, marke: 1000, oeffnung: 1300, ende: 1600 } as const;

/**
 * Abstand eines Buchstabens zum O. Bestimmt beide Staffelungen: beim
 * Auftritt läuft sie von außen nach innen, bei der Konvergenz starten
 * dieselben äußeren Buchstaben zuerst.
 */
const rang = (i: number) => Math.abs(i - O_INDEX);
const MAX_RANG = Math.max(O_INDEX, WORT.length - 1 - O_INDEX);
/** Versatz zwischen zwei benachbarten Buchstaben, in Sekunden. */
const STAFFEL = 0.035;
const verzoegerung = (i: number) => (MAX_RANG - rang(i)) * STAFFEL;

/** Tiefversatz, aus dem die Buchstaben auftreten. */
const AUFTRITT_Y = 20;

/** Startversatz der Ecken in Einheiten des 140er-Rasters, diagonal nach außen. */
const ECKEN_VERSATZ = [
  { x: -7, y: -7 },
  { x: 7, y: -7 },
  { x: -7, y: 7 },
  { x: 7, y: 7 },
];

type Wege = {
  /** Strecke je Buchstabe bis zur O-Mitte, in Pixeln. */
  buchstaben: number[];
  /** Strecke, um die der ganze Schriftzug rückt, damit das O mittig steht. */
  schriftzug: number;
};

export function IntroCurtain() {
  const reduce = useReducedMotion();
  const aktiv = STARTSEQUENZ_LAEUFT && !reduce;

  const [phase, setPhase] = useState(0);
  const [wege, setWege] = useState<Wege | null>(null);
  const [fertig, setFertig] = useState(false);

  const spurRef = useRef<HTMLSpanElement>(null);
  const buchstabenRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const oRef = useRef<HTMLSpanElement>(null);

  /**
   * Messung vor dem ersten Bild. Sie liefert die Strecken für Phase 2; bis
   * dahin ist ohnehin nichts in Bewegung. `document.fonts.ready` misst
   * nach, falls die Schrift erst nach dem ersten Bild steht — sonst wären
   * die Wege an den Maßen der Ersatzschrift ausgerichtet.
   */
  useLayoutEffect(() => {
    if (!aktiv) return;

    const messen = () => {
      const spur = spurRef.current;
      const o = oRef.current;
      if (!spur || !o) return;

      const oMitte = o.offsetLeft + o.offsetWidth / 2;
      setWege({
        buchstaben: buchstabenRefs.current.map((el) =>
          el ? oMitte - (el.offsetLeft + el.offsetWidth / 2) : 0,
        ),
        schriftzug: spur.offsetWidth / 2 - oMitte,
      });
    };

    messen();
    let abgebrochen = false;
    document.fonts?.ready.then(() => {
      if (!abgebrochen) messen();
    });
    return () => {
      abgebrochen = true;
    };
  }, [aktiv]);

  useEffect(() => {
    if (!aktiv) return;
    const uhren = [
      setTimeout(() => setPhase(1), PHASE.schriftzug),
      setTimeout(() => setPhase(2), PHASE.marke),
      setTimeout(() => setPhase(3), PHASE.oeffnung),
      setTimeout(() => setFertig(true), PHASE.ende),
    ];
    return () => uhren.forEach(clearTimeout);
  }, [aktiv]);

  if (!aktiv || fertig) return null;

  const zusammengezogen = phase >= 1;
  const markeGesetzt = phase >= 2;
  const offen = phase >= 3;

  return (
    <div
      aria-hidden
      data-startsequenz={phase}
      // `overflow-hidden` ist Pflicht: die Vorhanghälften fahren um ihre
      // volle Breite hinaus und würden das Dokument sonst seitlich dehnen.
      className="pointer-events-none fixed inset-0 z-[95] overflow-hidden"
    >
      <motion.div
        className="absolute inset-y-0 left-0 w-1/2 bg-ink"
        initial={{ x: 0 }}
        animate={{ x: offen ? "-101%" : 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
      />
      <motion.div
        className="absolute inset-y-0 right-0 w-1/2 bg-ink"
        initial={{ x: 0 }}
        animate={{ x: offen ? "101%" : 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
      />

      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        <motion.span
          ref={spurRef}
          className="u-wordmark relative text-[clamp(2.25rem,9vw,5.5rem)] text-fg"
          // Der Container blendet nicht mehr selbst auf — das machen die
          // Buchstaben einzeln. Hier bleibt nur der Ruck nach rechts, mit
          // dem das O auf die Teilungslinie der Vorhanghälften wandert.
          initial={{ x: 0 }}
          animate={{ x: zusammengezogen ? (wege?.schriftzug ?? 0) : 0 }}
          transition={{ type: "spring", stiffness: 130, damping: 21 }}
        >
          {WORT.split("").map((zeichen, i) => {
            if (i === O_INDEX) {
              return (
                <motion.span
                  key={i}
                  ref={oRef}
                  className="u-wordmark-o relative inline-block"
                  initial={{ y: AUFTRITT_Y, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  // `u-wordmark-o` trägt die Grundlinienkorrektur der
                  // Passmarke als transform. Motion würde sie beim Animieren
                  // von `y` überschreiben, deshalb wird sie hier vor die
                  // erzeugte Transformation gesetzt.
                  transformTemplate={(_, erzeugt) => `translateY(0.064em) ${erzeugt}`}
                  // Steifer als die Buchstaben: das O kommt zuletzt und soll
                  // als Ankerpunkt einrasten, nicht einschweben.
                  transition={{
                    type: "spring",
                    stiffness: 320,
                    damping: 24,
                    delay: verzoegerung(i),
                  }}
                >
                  <RegisterMarke gesetzt={markeGesetzt} offen={offen} />
                </motion.span>
              );
            }

            const ziel = wege?.buchstaben[i] ?? 0;

            return (
              <span
                key={i}
                ref={(el) => {
                  buchstabenRefs.current[i] = el;
                }}
                className="inline-block"
              >
                <motion.span
                  className="inline-block"
                  initial={{ x: 0, y: AUFTRITT_Y, opacity: 0 }}
                  animate={
                    zusammengezogen
                      ? { x: ziel, y: 0, opacity: 0, scale: 0.72 }
                      : { x: 0, y: 0, opacity: 1, scale: 1 }
                  }
                  transition={
                    zusammengezogen
                      ? {
                          type: "spring",
                          stiffness: 150,
                          damping: 22,
                          delay: verzoegerung(i),
                        }
                      : {
                          type: "spring",
                          stiffness: 240,
                          damping: 21,
                          delay: verzoegerung(i),
                        }
                  }
                >
                  {zeichen}
                </motion.span>
              </span>
            );
          })}
        </motion.span>
      </div>
    </div>
  );
}

/**
 * Die Passmarke der Startsequenz. Bis Phase 3 stehen die Ecken leicht nach
 * außen versetzt und der Punkt ist klein — die Marke wirkt offen. Mit Phase
 * 3 schnappen die Ecken auf ihre Position und der Punkt setzt sich.
 */
function RegisterMarke({ gesetzt, offen }: { gesetzt: boolean; offen: boolean }) {
  return (
    <motion.svg
      viewBox="0 0 140 140"
      className="h-full w-full overflow-visible"
      animate={{ scale: offen ? 1.35 : 1, opacity: offen ? 0 : 1 }}
      transition={{ type: "spring", stiffness: 110, damping: 18 }}
    >
      <defs>
        <linearGradient id="startsequenz-punkt" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--color-accent)" />
          <stop offset="100%" stopColor="var(--color-accent-soft)" />
        </linearGradient>
      </defs>

      {REGISTER_ECKEN.map((d, i) => (
        <motion.path
          key={d}
          d={d}
          {...REGISTER_STRICH}
          initial={{ x: ECKEN_VERSATZ[i].x, y: ECKEN_VERSATZ[i].y, opacity: 0.55 }}
          animate={
            gesetzt
              ? { x: 0, y: 0, opacity: 1 }
              : { x: ECKEN_VERSATZ[i].x, y: ECKEN_VERSATZ[i].y, opacity: 0.55 }
          }
          // Steife Feder mit wenig Dämpfung: das Einrasten soll hörbar
          // aussehen, nicht weich einschweben.
          transition={{ type: "spring", stiffness: 700, damping: 26, delay: i * 0.03 }}
        />
      ))}

      <motion.circle
        cx="70"
        cy="70"
        r="7"
        fill="url(#startsequenz-punkt)"
        initial={{ scale: 0.35, opacity: 0.4 }}
        animate={gesetzt ? { scale: 1, opacity: 1 } : { scale: 0.35, opacity: 0.4 }}
        style={{ transformOrigin: "70px 70px" }}
        transition={{ type: "spring", stiffness: 520, damping: 20, delay: 0.1 }}
      />
    </motion.svg>
  );
}
