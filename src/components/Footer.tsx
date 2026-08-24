import { COMPANY } from "../lib/content";

export function Footer() {
  return (
    <footer className="border-t border-line py-10 sm:py-12">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-6 px-4 sm:px-8 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="u-display-sm text-lg">{COMPANY.brand}</span>
          <p className="u-meta mt-3">
            {COMPANY.street} · {COMPANY.zip} {COMPANY.city}
          </p>
        </div>

        <div className="flex flex-col gap-3 md:items-end">
          <a
            href={`mailto:${COMPANY.email}`}
            className="u-meta transition-colors duration-200 hover:text-fg"
          >
            {COMPANY.email}
          </a>
          <nav aria-label="Rechtliches" className="flex gap-6">
            <a
              href="/impressum"
              className="u-meta transition-colors duration-200 hover:text-fg"
            >
              Impressum
            </a>
            <a
              href="/datenschutz"
              className="u-meta transition-colors duration-200 hover:text-fg"
            >
              Datenschutz
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
