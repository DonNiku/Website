/**
 * Anbieterdaten. Liegen zentral, damit Impressum und Datenschutzerklärung
 * nicht auseinanderlaufen können.
 */
export const COMPANY = {
  brand: "Avolane",
  owner: "Patrick Grüßhaber",
  street: "Am Stollhenn 12",
  zip: "55120",
  city: "Mainz",
  country: "Deutschland",
  email: "hallo@avolane.de",
  /** Umsatzsteuer-Identifikationsnummer gemäß § 27a UStG. */
  vatId: "DE342681761",
} as const;

/** Eigene Buchungsseite. Kein externer Dienst mehr im Spiel. */
export const BOOKING_URL = "/termin";

export const CTA_LABEL = "Erstgespräch buchen";

export type HeroPhoto = {
  src: string;
  motif: string;
  credit: string;
};

/**
 * Motive für das wechselnde Hero-Band, alle drei in Mainz aufgenommen.
 * Reihenfolge nach Priorität: Dom, Rheinbrücke, Innenstadt.
 *
 * Die Auswahl ist auf ähnliche Helligkeit abgestimmt (gemessen nach der
 * Duotone-Behandlung: 59 / 34 / 45 von 255). Ein Nachtmotiv der Brücke lag
 * bei 10 und ist deshalb raus: beim Überblenden wäre das Band zwischendurch
 * praktisch schwarz geworden.
 *
 * Die Dateien liegen unter /public/images und werden vom eigenen Server
 * ausgeliefert. Das ist bewusst so: über ein externes Bildnetz ginge bei
 * jedem Seitenaufruf die IP-Adresse der Besucher an einen Dritten.
 */
export const HERO_PHOTOS: HeroPhoto[] = [
  {
    src: "/images/hero-mainzer-dom.jpg",
    motif: "Mainzer Dom",
    credit: "Markus Winkler",
  },
  {
    src: "/images/hero-theodor-heuss-bruecke.jpg",
    motif: "Theodor-Heuss-Brücke",
    credit: "Babette Landmesser",
  },
  {
    src: "/images/hero-christuskirche.jpg",
    motif: "Christuskirche",
    credit: "Alexander Abero",
  },
];

export const CTA_PHOTO = "/images/cta-fassade.jpg";

export type Agent = {
  index: string;
  name: string;
  /** Kurze Statement-Zeile, kein Fließtext. */
  claim: string;
  /** Angebundene Systeme, erscheint als technische Detailzeile. */
  stack: string;
  photo: string;
};

export const AGENTS: Agent[] = [
  {
    index: "01",
    name: "WhatsApp Agent",
    claim:
      "Antwortet in Sekunden, rund um die Uhr. Klärt die Anfrage vor und übergibt an Ihr Team, sobald es persönlich wird.",
    stack: "WhatsApp Business API",
    photo: "/images/agent-whatsapp.jpg",
  },
  {
    index: "02",
    name: "Outreach Agent",
    claim:
      "Findet die richtigen Ansprechpartner, schreibt in Ihrer Tonalität und bleibt dran, bis eine Antwort da ist.",
    stack: "LinkedIn, E-Mail, CRM",
    photo: "/images/agent-outreach.jpg",
  },
  {
    index: "03",
    name: "E-Mail Agent",
    claim:
      "Räumt das Postfach auf, beantwortet Wiederkehrendes und legt jeden Vorgang sauber im System ab.",
    stack: "IMAP, Microsoft 365",
    photo: "/images/agent-email.jpg",
  },
  {
    index: "04",
    name: "Termin-Agent",
    claim:
      "Stimmt Termine direkt mit Ihren Kunden ab, prüft den Kalender und bestätigt. Ohne Hin und Her.",
    stack: "Google Kalender, Outlook",
    photo: "/images/agent-termin.jpg",
  },
];

export type Step = {
  index: string;
  title: string;
  description: string;
};

export const STEPS: Step[] = [
  {
    index: "01",
    title: "Analyse",
    description:
      "Wir sehen uns Ihre Abläufe an und finden die Aufgaben, die jeden Tag Zeit kosten, ohne Ihr Geschäft weiterzubringen.",
  },
  {
    index: "02",
    title: "Konfiguration",
    description:
      "Der Agent lernt Ihre Prozesse, Ihre Sprache und Ihre Systeme. Getestet an echten Fällen, nicht an Demodaten.",
  },
  {
    index: "03",
    title: "Deployment",
    description:
      "Live-Schaltung, Einweisung Ihres Teams, laufende Betreuung. Ein Ansprechpartner, keine Ticketnummer.",
  },
];
