/* ------------------------------------------------------------------ *
 * n8n-Webhooks
 *
 * Die beiden URLs sind die einzige Stelle, an der die Adresse des
 * n8n-Servers steht. Für den Wechsel auf eine HTTPS-Domain genügt es,
 * VITE_N8N_AVAILABILITY_URL und VITE_N8N_BOOKING_URL zu setzen
 * (.env.local lokal, Environment Variables im Vercel-Projekt).
 * ------------------------------------------------------------------ */

/**
 * GET, ohne Parameter.
 * Antwort: { "slots": [{ "date": "YYYY-MM-DD", "time": "HH:MM" }, ...] }
 * Geliefert werden ausschließlich noch freie Slots.
 */
export const N8N_AVAILABILITY_URL =
  import.meta.env.VITE_N8N_AVAILABILITY_URL ??
  "https://automation.avolane.de/webhook/termin-verfuegbarkeit";

/**
 * POST, Body (JSON):
 * { date: "YYYY-MM-DD", time: "HH:MM", name, email, company, message }
 * Antwort bei Erfolg: { "success": true }
 */
export const N8N_BOOKING_URL =
  import.meta.env.VITE_N8N_BOOKING_URL ??
  "https://automation.avolane.de/webhook/termin-buchung";

/**
 * POST, Body (JSON): { token: "<cancel_token aus der Bestätigungs-Mail>" }
 * Antwort: { "success": true } oder { "success": false, "error": "not_found" }
 */
export const N8N_CANCEL_URL =
  import.meta.env.VITE_N8N_CANCEL_URL ??
  "https://automation.avolane.de/webhook/termin-storno";

/* ------------------------------------------------------------------ */

/** Terminfenster: 09:00 bis 17:00, der letzte Slot beginnt um 16:30. */
const DAY_START_MINUTES = 9 * 60;
const DAY_END_MINUTES = 17 * 60;
const SLOT_MINUTES = 30;

/** Freie Zeiten je Tag, Schlüssel ist YYYY-MM-DD. */
export type DayAvailability = Record<string, string[]>;

type SlotResponse = {
  slots?: Array<{ date?: unknown; time?: unknown }>;
};

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const TIME_PATTERN = /^\d{2}:\d{2}$/;

/** Lokaler Datumsschlüssel. Bewusst nicht über toISOString, das rechnet in UTC um. */
export function dateKey(date: Date): string {
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

/** Gegenstück zu dateKey: erzeugt ein lokales Datum, keine UTC-Mitternacht. */
export function parseDateKey(key: string): Date {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year, month - 1, day);
}

/** Das Raster der Geschäftszeiten, unabhängig von der Belegung. */
function businessHours(): string[] {
  const times: string[] = [];
  for (
    let minutes = DAY_START_MINUTES;
    minutes + SLOT_MINUTES <= DAY_END_MINUTES;
    minutes += SLOT_MINUTES
  ) {
    const hour = `${Math.floor(minutes / 60)}`.padStart(2, "0");
    const minute = `${minutes % 60}`.padStart(2, "0");
    times.push(`${hour}:${minute}`);
  }
  return times;
}

/**
 * Alle Zeiten, die für einen Tag angezeigt werden: das feste Raster plus
 * alles, was der Webhook zusätzlich meldet. Belegte Zeiten bleiben so als
 * ausgegraute Schaltfläche sichtbar, statt kommentarlos zu verschwinden.
 */
export function daySlotTimes(free: string[] = []): string[] {
  return [...new Set([...businessHours(), ...free])].sort();
}

/**
 * Holt die freien Slots und gruppiert sie nach Tag. Tage ohne freie Zeit
 * liefert der Webhook gar nicht erst mit, sie tauchen also auch hier nicht auf.
 */
export async function fetchAvailability(
  signal?: AbortSignal,
): Promise<DayAvailability> {
  const response = await fetch(N8N_AVAILABILITY_URL, {
    signal,
    headers: { Accept: "application/json" },
  });
  if (!response.ok) {
    throw new Error(`Verfügbarkeiten nicht abrufbar (${response.status})`);
  }

  // n8n antwortet je nach Respond-Node auch mal als Array mit einem Element.
  const payload: unknown = await response.json();
  const body = (Array.isArray(payload) ? payload[0] : payload) as
    | SlotResponse
    | undefined;

  const byDay: DayAvailability = {};
  for (const slot of body?.slots ?? []) {
    const date = slot?.date;
    const time = slot?.time;
    if (typeof date !== "string" || !DATE_PATTERN.test(date)) continue;
    if (typeof time !== "string" || !TIME_PATTERN.test(time)) continue;
    (byDay[date] ??= []).push(time);
  }

  for (const [date, times] of Object.entries(byDay)) {
    byDay[date] = [...new Set(times)].sort();
  }
  return byDay;
}

export type BookingPayload = {
  name: string;
  email: string;
  company: string;
  message: string;
  /** YYYY-MM-DD */
  date: string;
  /** HH:MM */
  time: string;
};

/** Der Slot war schon vergeben: der Datensatz lief in den Unique-Index. */
export class SlotTakenError extends Error {
  constructor() {
    super("Slot bereits vergeben");
    this.name = "SlotTakenError";
  }
}

/**
 * Der Webhook hat geantwortet, aber nicht mit success: true. Der häufigste
 * Grund ist der belegte Slot; sicher unterscheiden lässt sich das erst über
 * die neu geladene Verfügbarkeit (siehe Termin.tsx).
 */
export class BookingRejectedError extends Error {
  constructor() {
    super("Buchung nicht bestätigt");
    this.name = "BookingRejectedError";
  }
}

/** Der Unique-Constraint schlägt in der Fehlermeldung als "duplicate key" durch. */
const DUPLICATE_PATTERN = /duplicate key/i;

export async function submitBooking(payload: BookingPayload): Promise<void> {
  const response = await fetch(N8N_BOOKING_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  });

  const raw = (await response.text()).trim();

  if (DUPLICATE_PATTERN.test(raw)) throw new SlotTakenError();

  if (!response.ok) {
    throw new Error(`Buchung fehlgeschlagen (${response.status})`);
  }

  // Der Workflow antwortet bei jedem Fehlschlag mit leerem Körper und 200,
  // die Bestätigung ist deshalb das einzige verlässliche Erfolgssignal.
  let confirmed = false;
  try {
    const parsed: unknown = raw ? JSON.parse(raw) : null;
    const body = Array.isArray(parsed) ? parsed[0] : parsed;
    confirmed =
      typeof body === "object" &&
      body !== null &&
      (body as { success?: unknown }).success === true;
  } catch {
    confirmed = false;
  }

  if (!confirmed) throw new BookingRejectedError();
}

/**
 * "cancelled": die Buchung wurde gelöscht, die Mails sind unterwegs.
 * "not_found": der Token trifft keine Buchung — bereits storniert oder
 * nie vergeben. Der Workflow unterscheidet das bewusst nicht weiter.
 */
export type CancellationResult = "cancelled" | "not_found";

export async function submitCancellation(
  token: string,
): Promise<CancellationResult> {
  const response = await fetch(N8N_CANCEL_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ token }),
  });

  if (!response.ok) {
    throw new Error(`Storno fehlgeschlagen (${response.status})`);
  }

  // Wie bei der Buchung: n8n antwortet je nach Respond-Node auch mal als
  // Array mit einem Element, und nur eine klare Antwort zählt als Ergebnis.
  let parsed: unknown = null;
  try {
    parsed = await response.json();
  } catch {
    parsed = null;
  }
  const body = (Array.isArray(parsed) ? parsed[0] : parsed) as
    | { success?: unknown; error?: unknown }
    | null;

  if (body?.success === true) return "cancelled";
  if (body?.error === "not_found") return "not_found";
  throw new Error("Storno nicht bestätigt");
}

/* ---- Formatierung -------------------------------------------------- */

const weekdayShort = new Intl.DateTimeFormat("de-DE", { weekday: "short" });
const dayNumber = new Intl.DateTimeFormat("de-DE", { day: "2-digit" });
const monthShort = new Intl.DateTimeFormat("de-DE", { month: "short" });
const longDate = new Intl.DateTimeFormat("de-DE", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

export const formatWeekday = (d: Date) => weekdayShort.format(d).replace(".", "");
export const formatDayNumber = (d: Date) => dayNumber.format(d);
export const formatMonth = (d: Date) => monthShort.format(d).replace(".", "");
export const formatLongDate = (d: Date) => longDate.format(d);

/* ---- Validierung --------------------------------------------------- */

export const MESSAGE_MAX = 500;

export type FormValues = {
  name: string;
  email: string;
  company: string;
  message: string;
};

export type FormErrors = Partial<Record<keyof FormValues, string>>;

export function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};

  if (!values.name.trim()) {
    errors.name = "Bitte geben Sie Ihren Namen an.";
  }

  const email = values.email.trim();
  if (!email) {
    errors.email = "Bitte geben Sie Ihre E-Mail-Adresse an.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    errors.email = "Diese E-Mail-Adresse sieht nicht vollständig aus.";
  }

  if (values.message.length > MESSAGE_MAX) {
    errors.message = `Bitte kürzen Sie auf ${MESSAGE_MAX} Zeichen.`;
  }

  return errors;
}
