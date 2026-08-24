import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Grain, ScrollProgress } from "../components/Chrome";
import { Nav } from "../components/Nav";
import { Footer } from "../components/Footer";
import { MaskLine } from "../components/Reveal";
import { Statement } from "../components/Statement";
import { StepIndicator } from "../components/booking/StepIndicator";
import { SlotPicker } from "../components/booking/SlotPicker";
import { DetailsForm } from "../components/booking/DetailsForm";
import { Confirmation } from "../components/booking/Confirmation";
import {
  BookingRejectedError,
  SlotTakenError,
  dateKey,
  fetchAvailability,
  parseDateKey,
  submitBooking,
  type DayAvailability,
  type FormValues,
} from "../lib/booking";

type Step = 0 | 1 | 2;

const SLOT_TAKEN_MESSAGE =
  "Dieser Termin wurde gerade vergeben. Bitte wählen Sie einen anderen Slot.";

const GENERIC_ERROR_MESSAGE =
  "Die Anfrage konnte nicht übermittelt werden. Bitte versuchen Sie es noch einmal.";

export function Termin() {
  const reduce = useReducedMotion();

  const [step, setStep] = useState<Step>(0);
  const [availability, setAvailability] = useState<DayAvailability | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  /** Wunsch des Nutzers. Was davon noch buchbar ist, ergibt sich unten. */
  const [pickedDay, setPickedDay] = useState<string | null>(null);
  const [pickedTime, setPickedTime] = useState<string | null>(null);

  const [values, setValues] = useState<FormValues>({
    name: "",
    email: "",
    company: "",
    message: "",
  });
  /** Der bestätigte Termin. Steht fest, sobald der Webhook zugesagt hat, und
   *  hängt danach nicht mehr an der Verfügbarkeit. */
  const [booked, setBooked] = useState<{ day: Date; time: string } | null>(
    null,
  );
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  /** Zweiter Riegel gegen Doppelabsenden, unabhängig vom Render-Zyklus. */
  const inFlight = useRef(false);

  /** Der Webhook liefert nur freie Slots, die Tagesleiste folgt also den Daten. */
  const dayKeys = useMemo(() => {
    if (!availability) return [];
    return Object.keys(availability)
      .filter((key) => availability[key].length > 0)
      .sort();
  }, [availability]);

  // Auswahl abgeleitet statt gespiegelt: fällt ein Tag oder eine Uhrzeit beim
  // Neuladen weg, greift automatisch der erste freie Tag und keine Uhrzeit.
  const selectedKey =
    pickedDay && dayKeys.includes(pickedDay) ? pickedDay : (dayKeys[0] ?? null);
  const selectedDay = selectedKey ? parseDateKey(selectedKey) : null;
  const freeTimes = selectedKey ? (availability?.[selectedKey] ?? []) : [];
  const selectedTime =
    pickedTime && freeTimes.includes(pickedTime) ? pickedTime : null;

  const loadAvailability = useCallback(
    async (signal?: AbortSignal): Promise<DayAvailability | null> => {
      setLoading(true);
      setLoadError(null);
      try {
        const result = await fetchAvailability(signal);
        setAvailability(result);
        return result;
      } catch (error: unknown) {
        if (signal?.aborted) return null;
        setLoadError(
          error instanceof Error
            ? error.message
            : "Verfügbarkeiten konnten nicht geladen werden.",
        );
        return null;
      } finally {
        if (!signal?.aborted) setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    const controller = new AbortController();
    void loadAvailability(controller.signal);
    return () => controller.abort();
  }, [loadAvailability, reloadToken]);

  const handleSelectDay = useCallback((day: Date) => {
    setPickedDay(dateKey(day));
    // Die Uhrzeit gilt nur für den Tag, an dem sie gewählt wurde.
    setPickedTime(null);
    setNotice(null);
  }, []);

  async function handleSubmit() {
    if (inFlight.current || !selectedTime || !selectedKey) return;
    inFlight.current = true;
    setSubmitting(true);
    setSubmitError(null);

    try {
      await submitBooking({
        name: values.name.trim(),
        email: values.email.trim(),
        company: values.company.trim(),
        message: values.message.trim(),
        date: selectedKey,
        time: selectedTime,
      });
      setBooked({ day: parseDateKey(selectedKey), time: selectedTime });
      setStep(2);
      window.scrollTo({ top: 0, behavior: reduce ? "instant" : "smooth" });
    } catch (error: unknown) {
      // Der Workflow meldet jeden Fehlschlag gleich (leerer Körper, Status 200).
      // Ob der Slot in der Zwischenzeit weg ist, verrät nur die frische
      // Verfügbarkeit — die wir nach einem Fehlschlag ohnehin brauchen.
      const fresh = await loadAvailability();
      const stillFree = fresh?.[selectedKey]?.includes(selectedTime) ?? false;
      const taken =
        error instanceof SlotTakenError ||
        (error instanceof BookingRejectedError && !stillFree);

      if (taken) {
        setNotice(SLOT_TAKEN_MESSAGE);
        setPickedTime(null);
        setStep(0);
        window.scrollTo({ top: 0, behavior: reduce ? "instant" : "smooth" });
      } else {
        setSubmitError(GENERIC_ERROR_MESSAGE);
      }
    } finally {
      inFlight.current = false;
      setSubmitting(false);
    }
  }

  const transition = reduce
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 90, damping: 20 };

  return (
    <>
      <a href="#inhalt" className="skip-link">
        Zum Inhalt springen
      </a>

      <ScrollProgress />
      <Grain />
      <Nav />

      <main id="inhalt">
        <section className="mx-auto max-w-[1400px] px-4 pt-32 pb-14 sm:px-8 sm:pt-40 sm:pb-20">
          <Statement>Dreißig Minuten, unverbindlich.</Statement>

          <h1 className="u-display mt-5 max-w-[14ch] text-[clamp(2.2rem,6vw,5.25rem)]">
            <MaskLine>Erstgespräch</MaskLine>
            <MaskLine delay={0.08}>
              buchen<span className="u-word-static text-accent">.</span>
            </MaskLine>
          </h1>
        </section>

        <div className="border-t border-line">
          <div className="mx-auto max-w-[1400px] px-4 py-10 sm:px-8 sm:py-12">
            <StepIndicator current={step} />
          </div>
        </div>

        <div className="border-t border-line">
          <div className="mx-auto max-w-[1400px] px-4 py-14 sm:px-8 sm:py-20">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={step}
                initial={reduce ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: -12 }}
                transition={transition}
              >
                {step === 0 && (
                  <SlotPicker
                    dayKeys={dayKeys}
                    availability={availability}
                    loading={loading}
                    error={loadError}
                    notice={notice}
                    onRetry={() => setReloadToken((n) => n + 1)}
                    selectedKey={selectedKey}
                    onSelectDay={handleSelectDay}
                    selectedTime={selectedTime}
                    onSelectTime={setPickedTime}
                    onContinue={() => setStep(1)}
                  />
                )}

                {step === 1 && selectedDay && selectedTime && (
                  <DetailsForm
                    values={values}
                    onChange={setValues}
                    selectedDay={selectedDay}
                    selectedTime={selectedTime}
                    submitting={submitting}
                    submitError={submitError}
                    onBack={() => setStep(0)}
                    onSubmit={handleSubmit}
                  />
                )}

                {step === 2 && booked && (
                  <Confirmation
                    selectedDay={booked.day}
                    selectedTime={booked.time}
                    values={values}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
