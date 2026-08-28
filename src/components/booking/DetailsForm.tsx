import { useId, useRef, useState } from "react";
import { ArrowUpRight } from "@phosphor-icons/react";
import {
  MESSAGE_MAX,
  formatLongDate,
  validate,
  type FormErrors,
  type FormValues,
} from "../../lib/booking";

type DetailsFormProps = {
  values: FormValues;
  onChange: (values: FormValues) => void;
  selectedDay: Date;
  selectedTime: string;
  submitting: boolean;
  submitError: string | null;
  onBack: () => void;
  onSubmit: () => void;
};

type FieldProps = {
  id: string;
  label: string;
  optional?: boolean;
  error?: string;
  children: (props: {
    id: string;
    "aria-invalid": boolean;
    "aria-describedby": string | undefined;
  }) => React.ReactNode;
  hint?: string;
};

function Field({ id, label, optional, error, hint, children }: FieldProps) {
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  const describedBy =
    [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(" ") ||
    undefined;

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="u-meta">
        {label}
        {optional && <span className="text-fg-dim"> (optional)</span>}
      </label>

      {children({
        id,
        "aria-invalid": Boolean(error),
        "aria-describedby": describedBy,
      })}

      {hint && (
        <p id={hintId} className="u-meta text-right">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

export function DetailsForm({
  values,
  onChange,
  selectedDay,
  selectedTime,
  submitting,
  submitError,
  onBack,
  onSubmit,
}: DetailsFormProps) {
  const prefix = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  /** Erst nach dem ersten Absendeversuch live mitvalidieren. */
  const [validateLive, setValidateLive] = useState(false);

  const ids = {
    name: `${prefix}-name`,
    email: `${prefix}-email`,
    company: `${prefix}-company`,
    message: `${prefix}-message`,
  };

  function update(patch: Partial<FormValues>) {
    const next = { ...values, ...patch };
    onChange(next);
    if (validateLive) setErrors(validate(next));
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (submitting) return; // Doppelklick-Schutz zusätzlich zum disabled-Attribut

    const found = validate(values);
    setErrors(found);
    setValidateLive(true);

    const firstInvalid = (
      ["name", "email", "company", "message"] as const
    ).find((key) => found[key]);
    if (firstInvalid) {
      formRef.current
        ?.querySelector<HTMLElement>(`#${CSS.escape(ids[firstInvalid])}`)
        ?.focus();
      return;
    }

    onSubmit();
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate>
      <h2 className="u-display-sm text-[clamp(1.4rem,2.6vw,2rem)]">
        Ihre Daten
      </h2>
      <p className="u-meta mt-3">
        {formatLongDate(selectedDay)} · {selectedTime} Uhr
      </p>

      <div className="mt-10 grid gap-8 sm:grid-cols-2">
        <Field id={ids.name} label="Name" error={errors.name}>
          {(props) => (
            <input
              {...props}
              type="text"
              name="name"
              autoComplete="name"
              className="u-field"
              value={values.name}
              onChange={(e) => update({ name: e.target.value })}
            />
          )}
        </Field>

        <Field id={ids.email} label="E-Mail" error={errors.email}>
          {(props) => (
            <input
              {...props}
              type="email"
              name="email"
              autoComplete="email"
              inputMode="email"
              className="u-field"
              value={values.email}
              onChange={(e) => update({ email: e.target.value })}
            />
          )}
        </Field>

        <div className="sm:col-span-2">
          <Field id={ids.company} label="Firma" optional>
            {(props) => (
              <input
                {...props}
                type="text"
                name="company"
                autoComplete="organization"
                className="u-field"
                value={values.company}
                onChange={(e) => update({ company: e.target.value })}
              />
            )}
          </Field>
        </div>

        <div className="sm:col-span-2">
          <Field
            id={ids.message}
            label="Worum geht es?"
            optional
            error={errors.message}
            hint={`${values.message.length} / ${MESSAGE_MAX}`}
          >
            {(props) => (
              <textarea
                {...props}
                name="message"
                rows={4}
                maxLength={MESSAGE_MAX}
                className="u-field"
                value={values.message}
                onChange={(e) => update({ message: e.target.value })}
              />
            )}
          </Field>
        </div>
      </div>

      {submitError && (
        <div
          role="alert"
          className="mt-10 border border-line p-6 text-fg-dim"
        >
          <p className="text-danger">{submitError}</p>
          <p className="mt-3">
            Sie erreichen uns jederzeit direkt unter{" "}
            <a
              href="mailto:hallo@avolane.de"
              className="text-fg underline underline-offset-4"
            >
              hallo@avolane.de
            </a>
            . Nennen Sie einfach Wunschtag und Uhrzeit.
          </p>
        </div>
      )}

      <div className="mt-10 flex flex-wrap items-center gap-4 border-t border-line pt-8">
        <button
          type="submit"
          disabled={submitting}
          aria-busy={submitting}
          className="inline-flex items-center gap-3 bg-accent px-6 py-4 font-mono text-xs tracking-[0.14em] whitespace-nowrap text-white uppercase transition-colors duration-200 hover:bg-[#6d2fdb] disabled:cursor-wait disabled:bg-line disabled:text-fg-dim"
        >
          {submitting ? "Wird gesendet" : "Termin anfragen"}
          {submitting ? (
            <span
              aria-hidden
              className="size-3.5 animate-spin rounded-full border border-current border-t-transparent motion-reduce:animate-none"
            />
          ) : (
            <ArrowUpRight weight="bold" aria-hidden className="size-3.5" />
          )}
        </button>

        <button
          type="button"
          onClick={onBack}
          disabled={submitting}
          className="px-2 py-4 font-mono text-xs tracking-[0.14em] text-fg-dim uppercase transition-colors duration-200 hover:text-fg disabled:opacity-50"
        >
          Zurück
        </button>
      </div>
    </form>
  );
}
