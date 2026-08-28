import type { ReactNode } from "react";
import { MaskLine } from "./Reveal";

/**
 * Kurze Versalien-Aussage über oder unter einem Titel. Bewusst ein Satz mit
 * Punkt, kein Kategorie-Label: das Ding soll etwas behaupten, nicht die
 * Sektion beschriften.
 */
export function Statement({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <p className={`u-statement ${className}`}>
      <MaskLine delay={delay}>{children}</MaskLine>
    </p>
  );
}
