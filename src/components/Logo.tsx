import { useId } from "react";

/**
 * Marke als Inline-SVG. Kein <img>: das Zeichen soll die Farbtokens der
 * Seite erben und beim Skalieren scharf bleiben.
 *
 * Geometrie unverändert aus der Design-Spezifikation übernommen, beide
 * Zeichnungen im Raster 140 × 140:
 *
 * Icon „Convergent Lane" — zwei Spuren, die nach oben zusammenlaufen, dazu
 * zwei Fahrbahnstriche auf halber Höhe.
 *
 * Register-Mark — die Passmarke ersetzt das O im Schriftzug. Vier Ecken,
 * nicht zwei: erst der geschlossene Rahmen liest sich als Buchstabe, mit
 * zwei Ecken bleibt es ein Akzent.
 *
 * Die Wortmarke ist echter Text in der Display-Schrift der Seite, kein
 * Pfad. Nur so stimmen Laufweite und Breitenachse mit den Überschriften
 * überein, und der Name bleibt markierbar.
 */

type LogoProps = {
  /** icon: nur das Zeichen. wordmark: nur der Schriftzug. lockup: beides. */
  variant?: "icon" | "wordmark" | "lockup";
  className?: string;
};

/** Zwei zusammenlaufende Spuren mit Fahrbahnstrichen. */
function LaneIcon({ gradientId, className }: { gradientId: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 140 140"
      aria-hidden
      focusable="false"
      className={className}
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--color-accent)" />
          <stop offset="100%" stopColor="var(--color-accent-soft)" />
        </linearGradient>
      </defs>
      <path
        d="M70,10 L20,120"
        stroke={`url(#${gradientId})`}
        strokeWidth="12"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M70,10 L120,120"
        stroke={`url(#${gradientId})`}
        strokeWidth="12"
        strokeLinecap="round"
        fill="none"
      />
      <rect x="40" y="78" width="20" height="10" rx="5" fill="var(--color-accent-soft)" />
      <rect x="80" y="78" width="20" height="10" rx="5" fill="var(--color-accent-soft)" />
    </svg>
  );
}

/**
 * Die vier Ecken der Passmarke, im Uhrzeigersinn ab oben links. Exportiert,
 * weil die Startsequenz sie einzeln bewegt und dabei exakt dieselbe
 * Zeichnung verwenden muss wie das Logo.
 */
export const REGISTER_ECKEN = [
  "M15,50 L15,15 L50,15",
  "M125,50 L125,15 L90,15",
  "M15,90 L15,125 L50,125",
  "M125,90 L125,125 L90,125",
] as const;

/** Gemeinsame Strichattribute der Eckenzeichnung. */
export const REGISTER_STRICH = {
  stroke: "var(--color-accent-soft)",
  strokeWidth: 8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  fill: "none",
};

/** Passmarke als O: vier Ecken, Punkt in der Mitte. */
function RegisterO({ gradientId, className }: { gradientId: string; className?: string }) {
  const corner = REGISTER_STRICH;

  return (
    <svg
      viewBox="0 0 140 140"
      aria-hidden
      focusable="false"
      className={className}
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--color-accent)" />
          <stop offset="100%" stopColor="var(--color-accent-soft)" />
        </linearGradient>
      </defs>
      {REGISTER_ECKEN.map((d) => (
        <path key={d} d={d} {...corner} />
      ))}
      <circle cx="70" cy="70" r="7" fill={`url(#${gradientId})`} />
    </svg>
  );
}

export function Logo({ variant = "lockup", className = "" }: LogoProps) {
  // Eigene Verlaufs-IDs je Instanz: Nav und Footer stehen gleichzeitig im
  // Dokument, doppelte IDs würden sich gegenseitig überschreiben.
  const id = useId();
  const laneGradient = `avolane-lane-${id}`;
  const registerGradient = `avolane-register-${id}`;

  if (variant === "icon") {
    return (
      <span role="img" aria-label="Avolane" className={`inline-flex ${className}`}>
        <LaneIcon gradientId={laneGradient} className="size-[1em]" />
      </span>
    );
  }

  const wordmark = (
    // `aria-hidden` auf den Teilen, Vorlesename am Rahmen: sonst zerfällt
    // der Name in „av" und „lane".
    <span aria-hidden className="u-wordmark">
      av
      <RegisterO
        gradientId={registerGradient}
        // Die Passmarke tritt an die Stelle eines Kleinbuchstabens: Breite
        // wie die Punzenbreite des o, Grundlinienversatz per em, damit sie
        // bei jeder Schriftgröße mitwandert.
        className="u-wordmark-o"
      />
      lane
    </span>
  );

  if (variant === "wordmark") {
    return (
      <span role="img" aria-label="Avolane" className={`inline-flex items-center ${className}`}>
        {wordmark}
      </span>
    );
  }

  return (
    <span
      role="img"
      aria-label="Avolane"
      className={`inline-flex items-center gap-[0.42em] ${className}`}
    >
      <LaneIcon gradientId={laneGradient} className="size-[1.05em] shrink-0" />
      {wordmark}
    </span>
  );
}
