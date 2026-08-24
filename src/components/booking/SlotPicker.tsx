import { ArrowUpRight, ArrowClockwise, Warning } from "@phosphor-icons/react";
import {
  daySlotTimes,
  formatDayNumber,
  formatLongDate,
  formatMonth,
  formatWeekday,
  parseDateKey,
  type DayAvailability,
} from "../../lib/booking";

type SlotPickerProps = {
  /** Tage mit freien Slots, aufsteigend sortiert, als YYYY-MM-DD. */
  dayKeys: string[];
  availability: DayAvailability | null;
  loading: boolean;
  error: string | null;
  notice: string | null;
  onRetry: () => void;
  selectedKey: string | null;
  onSelectDay: (day: Date) => void;
  selectedTime: string | null;
  onSelectTime: (time: string) => void;
  onContinue: () => void;
};

/** Platzhalter, solange die Verfügbarkeit lädt: zwei Wochen Werktage. */
const DAY_SKELETONS = Array.from({ length: 10 }, (_, i) => i);

export function SlotPicker({
  dayKeys,
  availability,
  loading,
  error,
  notice,
  onRetry,
  selectedKey,
  onSelectDay,
  selectedTime,
  onSelectTime,
  onContinue,
}: SlotPickerProps) {
  const selectedDay = selectedKey ? parseDateKey(selectedKey) : null;
  const free = selectedKey ? (availability?.[selectedKey] ?? []) : [];
  const times = daySlotTimes(free);

  return (
    <div>
      {notice && (
        <div
          role="alert"
          className="mb-10 flex items-start gap-3 border border-line p-6"
        >
          <Warning
            weight="bold"
            aria-hidden
            className="mt-0.5 size-4 shrink-0 text-accent"
          />
          <p className="text-fg-dim">{notice}</p>
        </div>
      )}

      <h2 className="u-display-sm text-[clamp(1.4rem,2.6vw,2rem)]">
        Tag wählen
      </h2>

      {/* Waagerecht scrollbar: zwei Wochen passen sonst auf keinem
          Telefon nebeneinander. */}
      <div className="-mx-4 mt-6 overflow-x-auto px-4 pb-2 sm:-mx-8 sm:px-8">
        <ul className="flex w-max gap-3">
          {loading
            ? DAY_SKELETONS.map((i) => (
                <li key={i}>
                  <div className="u-skeleton h-[92px] w-[76px]" />
                </li>
              ))
            : dayKeys.map((dayKey) => {
                const day = parseDateKey(dayKey);
                const selected = dayKey === selectedKey;
                return (
                  <li key={dayKey}>
                    <button
                      type="button"
                      aria-pressed={selected}
                      onClick={() => onSelectDay(day)}
                      className="u-slot flex w-[76px] flex-col items-center gap-1 px-3 py-4"
                    >
                      <span className="font-mono text-[10px] tracking-[0.16em] uppercase">
                        {formatWeekday(day)}
                      </span>
                      <span className="u-display-sm text-xl">
                        {formatDayNumber(day)}
                      </span>
                      <span className="font-mono text-[10px] tracking-[0.16em] uppercase">
                        {formatMonth(day)}
                      </span>
                    </button>
                  </li>
                );
              })}
        </ul>
      </div>

      <h3 className="u-display-sm mt-12 text-[clamp(1.4rem,2.6vw,2rem)]">
        Uhrzeit wählen
      </h3>
      {selectedDay && <p className="u-meta mt-3">{formatLongDate(selectedDay)}</p>}

      {error ? (
        <div className="mt-6 border border-line p-6">
          <p className="text-danger">{error}</p>
          <button
            type="button"
            onClick={onRetry}
            className="mt-4 inline-flex items-center gap-2 border border-line px-5 py-3 font-mono text-xs tracking-[0.14em] uppercase transition-colors duration-200 hover:border-fg-dim"
          >
            <ArrowClockwise weight="bold" aria-hidden className="size-3.5" />
            Erneut laden
          </button>
        </div>
      ) : (
        <div className="mt-6 max-h-[46vh] overflow-y-auto sm:max-h-none sm:overflow-visible">
          <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-6">
            {loading
              ? times.map((time) => (
                  <li key={time}>
                    <div className="u-skeleton h-[46px] w-full" />
                  </li>
                ))
              : times.map((time) => {
                  const available = free.includes(time);
                  return (
                    <li key={time}>
                      <button
                        type="button"
                        disabled={!available}
                        aria-pressed={selectedTime === time}
                        aria-label={
                          available
                            ? `${time} Uhr auswählen`
                            : `${time} Uhr, nicht verfügbar`
                        }
                        onClick={() => onSelectTime(time)}
                        className="u-slot w-full px-3 py-3 font-mono text-sm tracking-[0.08em]"
                      >
                        {time}
                      </button>
                    </li>
                  );
                })}
          </ul>
        </div>
      )}

      {!loading && !error && dayKeys.length === 0 && (
        <p className="mt-6 text-fg-dim">
          Aktuell ist kein Termin frei. Schreiben Sie uns gern an{" "}
          <a
            href="mailto:hallo@avolane.de"
            className="text-fg underline underline-offset-4"
          >
            hallo@avolane.de
          </a>
          , wir finden einen Termin.
        </p>
      )}

      <div className="mt-10 flex flex-wrap items-center gap-5 border-t border-line pt-8">
        <button
          type="button"
          disabled={!selectedTime}
          onClick={onContinue}
          className="inline-flex items-center gap-3 bg-accent px-6 py-4 font-mono text-xs tracking-[0.14em] whitespace-nowrap text-white uppercase transition-colors duration-200 hover:bg-[#6d2fdb] disabled:cursor-not-allowed disabled:bg-line disabled:text-fg-dim"
        >
          Weiter zu Ihren Daten
          <ArrowUpRight weight="bold" aria-hidden className="size-3.5" />
        </button>

        {selectedDay && selectedTime && (
          <p className="u-meta">
            {formatLongDate(selectedDay)} · {selectedTime} Uhr
          </p>
        )}
      </div>
    </div>
  );
}
