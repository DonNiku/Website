import { LegalLayout } from "../components/LegalLayout";
import { COMPANY } from "../lib/content";

/**
 * Datenschutzerklärung.
 *
 * Der Text beschreibt ausschließlich das, was diese Website tatsächlich tut:
 * Auslieferung über Vercel, Bilder und Schriften vom eigenen Server, E-Mail
 * über Zoho, Terminbuchung auf eigener Infrastruktur. Sobald ein Formular,
 * ein Analysewerkzeug, ein eingebetteter Kalender oder ein Chat dazukommt,
 * muss er ergänzt werden, sonst stimmt er nicht mehr.
 *
 * Anbieterdaten kommen aus COMPANY, damit sie nicht vom Impressum abweichen.
 */
export function Datenschutz() {
  const mail = `mailto:${COMPANY.email}`;

  return (
    <LegalLayout title="Datenschutz&shy;erklärung" updated="18. August 2026">
      <h2>1. Verantwortlicher</h2>
      <p>
        Verantwortlich für die Datenverarbeitung auf dieser Website im Sinne
        der Datenschutz-Grundverordnung (DSGVO) ist:
      </p>
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
      <p>
        E-Mail: <a href={mail}>{COMPANY.email}</a>
      </p>

      <h2>2. Grundsätzliches</h2>
      <p>
        Diese Website ist bewusst datensparsam gebaut. Sie enthält kein
        Kontaktformular, keine Analyse- oder Tracking-Werkzeuge, keine
        Werbenetzwerke und keine Social-Media-Plugins. Sie setzt keine Cookies
        und speichert nichts im lokalen Speicher Ihres Browsers. Deshalb gibt
        es hier auch keinen Cookie-Banner.
      </p>
      <p>
        Personenbezogene Daten verarbeiten wir nur in dem Umfang, der für den
        technischen Betrieb der Seite notwendig ist oder der sich daraus
        ergibt, dass Sie uns von sich aus kontaktieren oder einen Termin
        buchen.
      </p>

      <h2>3. Aufruf der Website und Server-Logfiles</h2>
      <p>
        Diese Website wird gehostet von der Vercel Inc., USA. Beim Aufruf der
        Seite überträgt Ihr Browser technisch notwendige Daten an den Server,
        die dort in Logdateien verarbeitet werden:
      </p>
      <ul>
        <li>IP-Adresse des anfragenden Geräts</li>
        <li>Datum und Uhrzeit des Zugriffs</li>
        <li>Name und URL der abgerufenen Datei</li>
        <li>verwendeter Browser und Betriebssystem</li>
        <li>übertragene Datenmenge und Meldung über den Abrufstatus</li>
        <li>gegebenenfalls die zuvor besuchte Seite (Referrer)</li>
      </ul>
      <p>
        Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO. Unser berechtigtes
        Interesse liegt darin, die Website stabil und sicher auszuliefern und
        Angriffe erkennen zu können. Mit dem Anbieter besteht ein Vertrag über
        die Auftragsverarbeitung nach Art. 28 DSGVO.
      </p>
      <p>
        Da der Anbieter seinen Sitz in den USA hat, kann eine Übermittlung in
        ein Drittland stattfinden. Die Vercel Inc. ist nach dem EU-US Data
        Privacy Framework zertifiziert, sodass für die Übermittlung ein
        Angemessenheitsbeschluss der Europäischen Kommission nach Art. 45 DSGVO
        vorliegt.
      </p>

      <h2>4. Bilder und Schriften</h2>
      <p>
        Sämtliche Fotos und Schriftarten dieser Website liegen auf unserem
        eigenen Server und werden mit der Seite ausgeliefert. Es findet{" "}
        <strong>kein</strong> Abruf bei einem externen Bildnetz, bei Google
        Fonts oder einem anderen Drittanbieter statt. An solche Dienste wird
        folglich auch keine IP-Adresse übertragen.
      </p>

      <h2>5. Kontaktaufnahme per E-Mail</h2>
      <p>
        Wenn Sie uns schreiben, verarbeiten wir Ihre Angaben ausschließlich zur
        Bearbeitung Ihrer Anfrage und für den Fall von Anschlussfragen.
        Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO, soweit Ihre Anfrage der
        Anbahnung oder Durchführung eines Vertrags dient, im Übrigen Art. 6
        Abs. 1 lit. f DSGVO aufgrund unseres berechtigten Interesses an der
        Beantwortung.
      </p>
      <p>
        Unser E-Mail-Postfach wird von der Zoho Corporation betrieben. Die für
        uns eingesetzten Rechenzentren liegen in der Europäischen Union. Es
        besteht ein Vertrag über die Auftragsverarbeitung nach Art. 28 DSGVO.
      </p>
      <p>
        Wir löschen Anfragen, sobald sie erledigt sind und keine gesetzlichen
        Aufbewahrungspflichten entgegenstehen.
      </p>

      <h2>6. Terminbuchung</h2>
      <p>
        Für die Buchung eines Erstgesprächs betreiben wir eine eigene
        Anwendung. Sie läuft auf einem Server der Hetzner Online GmbH in
        Deutschland. Es ist kein Buchungswerkzeug eines Drittanbieters in diese
        Website eingebettet, und beim bloßen Aufruf unserer Seiten werden keine
        Daten an eine Buchungsplattform übertragen.
      </p>
      <p>
        Wenn Sie einen Termin buchen, verarbeiten wir die von Ihnen im Formular
        angegebenen Daten: Name und E-Mail-Adresse sind Pflichtangaben, Firma
        und Nachricht können Sie freiwillig ergänzen. Dazu kommen der gewählte
        Tag und die gewählte Uhrzeit. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b
        DSGVO, da die Verarbeitung der Durchführung des Gesprächs und der
        Anbahnung eines Vertrags dient.
      </p>
      <p>An der Abwicklung sind folgende Dienstleister beteiligt:</p>
      <ul>
        <li>
          <strong>Hetzner Online GmbH</strong>, Deutschland: Betrieb des
          Servers, auf dem die Buchungsanwendung läuft.
        </li>
        <li>
          <strong>Supabase</strong>: Datenbank, in der die Buchungsdaten
          gespeichert werden.
        </li>
        <li>
          <strong>Google Ireland Limited</strong>: Abgleich des Termins mit
          unserem Kalender über Google Calendar, damit keine Doppelbelegung
          entsteht.
        </li>
        <li>
          <strong>Zoho Corporation</strong>: Versand der Bestätigungsmail an
          die von Ihnen angegebene Adresse.
        </li>
      </ul>
      <p>
        Mit diesen Dienstleistern bestehen Verträge über die
        Auftragsverarbeitung nach Art. 28 DSGVO. Buchungsdaten löschen wir,
        sobald der Termin abgewickelt ist und keine gesetzlichen
        Aufbewahrungspflichten entgegenstehen.
      </p>

      <h2>7. Empfänger und Weitergabe</h2>
      <p>
        Eine Weitergabe Ihrer Daten an Dritte findet nur statt, soweit dies zur
        Erbringung unserer Leistung erforderlich ist, Sie eingewilligt haben
        oder wir gesetzlich dazu verpflichtet sind. Dienstleister, die für uns
        Daten verarbeiten, binden wir über Verträge zur Auftragsverarbeitung
        nach Art. 28 DSGVO ein. Wir verkaufen keine Daten.
      </p>

      <h2>8. Ihre Rechte</h2>
      <p>Ihnen stehen gegenüber uns folgende Rechte zu:</p>
      <ul>
        <li>
          Auskunft über die zu Ihrer Person gespeicherten Daten (Art. 15 DSGVO)
        </li>
        <li>Berichtigung unrichtiger Daten (Art. 16 DSGVO)</li>
        <li>Löschung (Art. 17 DSGVO)</li>
        <li>Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
        <li>Datenübertragbarkeit (Art. 20 DSGVO)</li>
        <li>
          Widerspruch gegen Verarbeitungen, die auf einem berechtigten
          Interesse beruhen (Art. 21 DSGVO)
        </li>
      </ul>
      <p>
        Für die Ausübung genügt eine formlose Nachricht an{" "}
        <a href={mail}>{COMPANY.email}</a>.
      </p>

      <h2>9. Beschwerderecht bei der Aufsichtsbehörde</h2>
      <p>
        Unabhängig davon können Sie sich bei einer Datenschutz-Aufsichtsbehörde
        beschweren. Für uns zuständig ist der Landesbeauftragte für den
        Datenschutz und die Informationsfreiheit Rheinland-Pfalz.
      </p>

      <h2>10. Änderungen dieser Erklärung</h2>
      <p>
        Wir passen diese Erklärung an, sobald sich die Verarbeitung auf dieser
        Website ändert, etwa durch ein neues Formular oder ein zusätzliches
        eingebundenes Werkzeug. Es gilt jeweils die hier veröffentlichte
        Fassung.
      </p>
    </LegalLayout>
  );
}
