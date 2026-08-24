import { MaskLine, Reveal } from "../Reveal";
import { Statement } from "../Statement";
import { formatLongDate, type FormValues } from "../../lib/booking";

export function Confirmation({
  selectedDay,
  selectedTime,
  values,
}: {
  selectedDay: Date;
  selectedTime: string;
  values: FormValues;
}) {
  return (
    <div>
      <h2 className="u-display max-w-[14ch] text-[clamp(2rem,5.4vw,4.5rem)]">
        <MaskLine>Termin angefragt.</MaskLine>
      </h2>

      <Statement delay={0.1} className="mt-6 text-fg">
        Wir bestätigen per E-Mail.
      </Statement>

      <Reveal delay={0.16} className="mt-12 border-t border-line pt-8">
        <dl className="grid gap-x-10 gap-y-6 sm:grid-cols-2 lg:max-w-[46rem]">
          <div>
            <dt className="u-meta">Tag</dt>
            <dd className="mt-2 text-lg">{formatLongDate(selectedDay)}</dd>
          </div>
          <div>
            <dt className="u-meta">Uhrzeit</dt>
            <dd className="mt-2 text-lg">{selectedTime} Uhr</dd>
          </div>
          <div>
            <dt className="u-meta">Name</dt>
            <dd className="mt-2 text-lg">{values.name}</dd>
          </div>
          <div>
            <dt className="u-meta">E-Mail</dt>
            <dd className="mt-2 text-lg break-words">{values.email}</dd>
          </div>
          {values.company && (
            <div>
              <dt className="u-meta">Firma</dt>
              <dd className="mt-2 text-lg">{values.company}</dd>
            </div>
          )}
        </dl>
      </Reveal>

      <Reveal delay={0.22} className="mt-12">
        <p className="max-w-[52ch] leading-relaxed text-fg-dim">
          Sie bekommen in Kürze eine Bestätigung an{" "}
          <span className="text-fg">{values.email}</span>. Falls nichts
          ankommt, schreiben Sie uns einfach an{" "}
          <a
            href="mailto:hallo@avolane.de"
            className="text-fg underline underline-offset-4"
          >
            hallo@avolane.de
          </a>
          .
        </p>

        <a
          href="/"
          className="mt-8 inline-flex items-center gap-3 border border-line px-6 py-4 font-mono text-xs tracking-[0.14em] uppercase transition-colors duration-200 hover:border-fg-dim"
        >
          Zurück zur Startseite
        </a>
      </Reveal>
    </div>
  );
}
