import { LegalLayout } from "../components/LegalLayout";
import { COMPANY } from "../lib/content";

/**
 * Impressum nach § 5 DDG.
 *
 * Anbieterdaten kommen aus COMPANY, damit sie nicht von der
 * Datenschutzerklärung abweichen.
 */
export function Impressum() {
  const mail = `mailto:${COMPANY.email}`;

  return (
    <LegalLayout title="Impressum" updated="18. August 2026">
      <h2>Angaben gemäß § 5 DDG</h2>
      <p>
        {COMPANY.owner}
        <br />
        {COMPANY.brand}
        <br />
        {COMPANY.street}
        <br />
        {COMPANY.zip} {COMPANY.city}
        <br />
        {COMPANY.country}
      </p>

      <h2>Kontakt</h2>
      <p>
        E-Mail: <a href={mail}>{COMPANY.email}</a>
      </p>

      <h2>Umsatzsteuer-Identifikationsnummer</h2>
      <p>
        Umsatzsteuer-Identifikationsnummer gemäß § 27a Umsatzsteuergesetz:
        <br />
        {COMPANY.vatId}
      </p>

      <h2>Verantwortlich für den Inhalt</h2>
      <p>
        Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV:
        <br />
        {COMPANY.owner}, Anschrift wie oben.
      </p>

      {/* Kein Verweis auf die ODR-Plattform der EU-Kommission: die wurde im
          Juli 2025 abgeschaltet, der Hinweis wäre ein toter Link. */}
      <h2>Streitbeilegung</h2>
      <p>
        Wir sind nicht bereit und nicht verpflichtet, an
        Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle
        teilzunehmen.
      </p>

      <h2>Datenschutz</h2>
      <p>
        Wie wir mit personenbezogenen Daten umgehen, steht in der{" "}
        <a href="/datenschutz">Datenschutzerklärung</a>.
      </p>

      <h2>Bildnachweise</h2>
      <p>
        Die Fotos dieser Website stammen von Unsplash und werden von unserem
        eigenen Server ausgeliefert. Aufnahmen von Markus Winkler, Babette
        Landmesser und Alexander Abero (Mainzer Motive) sowie weiteren
        Fotografinnen und Fotografen der Plattform.
      </p>
    </LegalLayout>
  );
}
