import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

/**
 * Unterseiten liegen als eigene Verzeichnisse mit index.html vor. Statische
 * Hoster liefern die unter /datenschutz aus, der Dev-Server erwartet dagegen
 * /datenschutz/ und antwortet sonst mit 404. Diese Weiterleitung gleicht das
 * an, damit lokal dasselbe Verhalten getestet wird wie produktiv.
 */
const SUBPAGE_ROUTES = ["/datenschutz", "/impressum", "/termin", "/storno"];

function subpageRouteRewrite(): Plugin {
  return {
    name: "avolane:subpage-route-rewrite",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        const [path, query] = (req.url ?? "").split("?");
        if (SUBPAGE_ROUTES.includes(path)) {
          req.url = `${path}/${query ? `?${query}` : ""}`;
        }
        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), subpageRouteRewrite()],
  // Ohne das liefert der Dev-Server für jeden unbekannten Pfad die
  // Startseite aus, /datenschutz zeigte dann das Hero statt der Rechtsseite.
  appType: "mpa",
  build: {
    rollupOptions: {
      // Rechtsseiten als eigene Einstiegspunkte statt über einen Router:
      // echte URLs, statisch ausgeliefert, keine zusätzliche Abhängigkeit.
      // Pfade sind relativ zum Projekt-Root.
      input: {
        main: "index.html",
        datenschutz: "datenschutz/index.html",
        impressum: "impressum/index.html",
        termin: "termin/index.html",
        storno: "storno/index.html",
      },
    },
  },
});
