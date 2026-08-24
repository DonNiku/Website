const STEPS = ["Termin", "Daten", "Bestätigung"] as const;

/**
 * Fortschritt in der Nummernsprache der Seite. Kein Balken, nur die
 * Ziffernfolge: das passt zu den 01-04 der Agentenliste.
 */
export function StepIndicator({ current }: { current: 0 | 1 | 2 }) {
  return (
    <ol className="flex flex-wrap items-center gap-x-6 gap-y-2">
      {STEPS.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={label} className="u-meta flex items-center gap-2">
            <span
              className={
                active ? "text-accent" : done ? "text-fg" : "text-fg-dim"
              }
            >
              {`${i + 1}`.padStart(2, "0")}
            </span>
            <span className={active ? "text-fg" : "text-fg-dim"}>{label}</span>
            {active && <span className="sr-only">(aktueller Schritt)</span>}
          </li>
        );
      })}
    </ol>
  );
}
