/**
 * Entscheidet einmal pro Sitzung, ob die Startsequenz läuft.
 *
 * Die Auswertung passiert beim Laden des Moduls, nicht in den Komponenten:
 * Vorhang und Hero müssen dieselbe Antwort bekommen. Würde jede Komponente
 * selbst im sessionStorage nachsehen und dabei die Markierung setzen, sähe
 * die zweite bereits das gesetzte Flag — der Hero würde dann sofort
 * loslaufen, während der Vorhang noch steht.
 */
const SPEICHER_SCHLUESSEL = "avolane:startsequenz";

function ermittleStartsequenz(): boolean {
  if (typeof window === "undefined") return false;

  try {
    if (sessionStorage.getItem(SPEICHER_SCHLUESSEL)) return false;
    sessionStorage.setItem(SPEICHER_SCHLUESSEL, "1");
    return true;
  } catch {
    // Privater Modus oder blockierter Speicher: die Sequenz einmal zu oft
    // zu zeigen ist harmloser, als die Seite hinter einem Vorhang zu lassen.
    return true;
  }
}

/** Wahr nur beim ersten Aufruf der Startseite in dieser Sitzung. */
export const STARTSEQUENZ_LAEUFT = ermittleStartsequenz();

/** Bruttodauer der Sequenz in Sekunden. Danach ist die Seite frei. */
export const STARTSEQUENZ_DAUER = 1.6;
