import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
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

/**
 * Alles, was der Dev-Server als Dokument ausliefern darf. Die Unterseiten
 * stehen in allen drei Schreibweisen drin, weil je nach Einstiegspunkt
 * `/termin`, `/termin/` oder `/termin/index.html` ankommt.
 */
const HTML_ROUTES = new Set([
  "/",
  "/index.html",
  "/404.html",
  ...SUBPAGE_ROUTES.flatMap((route) => [route, `${route}/`, `${route}/index.html`]),
]);

/**
 * Liefert im Dev-Server die 404-Seite für alles, was auf keine Route und
 * keine Datei passt.
 *
 * Die Prüfung läuft bewusst gegen eine Positivliste statt als Auffangnetz
 * hinter Vite: die Middlewares aus dem Rückgabe-Hook werden zwar nach den
 * internen registriert, aber *vor* denen, die HTML ausliefern. Ein reines
 * „was bis hierher kommt, ist ein Fehler" würde deshalb jede echte Seite
 * verschlucken.
 *
 * Gefiltert wird zusätzlich auf Dokumentanfragen, damit ein fehlendes Bild
 * oder Skript ein ehrliches 404 ohne HTML-Rumpf bekommt.
 *
 * Produktiv übernimmt das Vercel: eine `404.html` im Ausgabeverzeichnis
 * wird dort automatisch für unbekannte Pfade ausgeliefert, deshalb steht
 * sie unten als eigener Einstiegspunkt im Build.
 */
function notFoundFallback(): Plugin {
  return {
    name: "avolane:not-found-fallback",
    apply: "serve",
    configureServer(server) {
      return () => {
        server.middlewares.use(async (req, res, next) => {
          if (req.method !== "GET" && req.method !== "HEAD") return next();
          if (!req.headers.accept?.includes("text/html")) return next();

          const pathname = (req.url ?? "/").split("?")[0];
          if (HTML_ROUTES.has(pathname)) return next();
          // Vite-interne Pfade und Quelldateien nicht anfassen.
          if (/^\/(@|src\/|node_modules\/)/.test(pathname)) return next();
          // Vorhandene Dateien gewinnen gegen die Fehlerseite.
          if (
            existsSync(resolve("public", `.${pathname}`)) ||
            existsSync(resolve(`.${pathname}`))
          ) {
            return next();
          }

          try {
            const html = await server.transformIndexHtml(
              req.url ?? "/",
              readFileSync(resolve("404.html"), "utf-8"),
            );
            res.statusCode = 404;
            res.setHeader("Content-Type", "text/html; charset=utf-8");
            res.end(html);
          } catch (error) {
            next(error);
          }
        });
      };
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), subpageRouteRewrite(), notFoundFallback()],
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
        // Landet als dist/404.html im Ausgabe-Wurzelverzeichnis. Vercel
        // liefert genau diese Datei für unbekannte Pfade aus.
        notFound: "404.html",
      },
    },
  },
});
