import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import type { HeroPhoto } from "../lib/content";

type PhotoProps = {
  /** Pfad unterhalb von /public, bereits im Zielzuschnitt abgelegt. */
  src: string;
  width: number;
  height: number;
  /** Klassen für den Rahmen: Spaltenbreite, Seitenverhältnis, Position. */
  className?: string;
  /** Hover-Zoom. Setzt ein `group` auf einem Elternelement voraus. */
  zoom?: boolean;
  priority?: boolean;
};

/**
 * Einziger Weg, ein Bild auf diese Seite zu bringen. Zuschnitt, Duotone,
 * Rahmenlinie und Hover-Verhalten sind hier zentralisiert, damit die
 * Bildstrecke über alle Sektionen als eine Serie liest.
 *
 * Die Bilder sind dekorativ, der umgebende Text trägt die Bedeutung, deshalb
 * durchgehend leeres alt-Attribut.
 */
export function Photo({
  src,
  width,
  height,
  className = "",
  zoom = false,
  priority = false,
}: PhotoProps) {
  return (
    <div className={`u-photo ring-1 ring-line ring-inset ${className}`}>
      <img
        src={src}
        alt=""
        width={width}
        height={height}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding={priority ? "sync" : "async"}
        // `motion-reduce:scale-100`, nicht `transform-none`: Tailwind v4
        // schreibt scale/translate in die eigenständigen CSS-Properties, ein
        // Zurücksetzen von `transform` würde hier gar nichts bewirken.
        className={`h-full w-full object-cover ${
          zoom
            ? "transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.045] motion-reduce:scale-100 motion-reduce:transition-none"
            : ""
        }`}
      />
    </div>
  );
}

type PhotoCycleProps = {
  photos: HeroPhoto[];
  width: number;
  height: number;
  /**
   * Muss eine Höhe setzen: die Bilder liegen absolut gestapelt, der Rahmen
   * hat sonst keine eigene.
   */
  className?: string;
  intervalMs?: number;
};

/**
 * Mehrere Motive im selben Rahmen, die langsam ineinander überblenden.
 *
 * Alle Bilder liegen in *einem* `.u-photo`-Rahmen. Das ist der Punkt: Filter
 * und Duotone-Ebene greifen damit konstruktionsbedingt auf allen identisch,
 * und es gibt genau eine Farbebene über dem Stapel statt einer pro Bild.
 *
 * Animiert wird ausschließlich `opacity`. Bei prefers-reduced-motion bleibt
 * es beim ersten Motiv, der Timer läuft dann gar nicht erst an.
 */
export function PhotoCycle({
  photos,
  width,
  height,
  className = "",
  intervalMs = 6000,
}: PhotoCycleProps) {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduce || photos.length < 2) return;
    const timer = setInterval(() => {
      // Im Hintergrundtab nicht weiterschalten, das sieht niemand.
      if (document.hidden) return;
      setIndex((current) => (current + 1) % photos.length);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [reduce, photos.length, intervalMs]);

  return (
    <div className={`u-photo ring-1 ring-line ring-inset ${className}`}>
      {photos.map((photo, i) => (
        <motion.img
          key={photo.src}
          src={photo.src}
          alt=""
          width={width}
          height={height}
          loading={i === 0 ? "eager" : "lazy"}
          fetchPriority={i === 0 ? "high" : "low"}
          className="absolute inset-0 h-full w-full object-cover"
          initial={false}
          animate={{ opacity: i === index ? 1 : 0 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        />
      ))}
    </div>
  );
}
