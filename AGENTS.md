# AGENTS.md – KinoSoft
Belege in Klammern; `kino/` = `backend/src/main/java/de/wps/ddd/kino/`.

## Zweck
KinoSoft ist die Fallstudie der DDD-Schulung von WPS und bildet Szenarien eines kleinen Programmkinos ab (README.md).
Besucher sehen das Kinoprogramm der laufenden Woche, wählen eine Vorstellung und kaufen Kinokarten für einen Block zusammenhängender Plätze im Saalplan; die Zahlung ist simuliert (README.md „Features“, `kino/zahlung/application/Zahlungsabwicklung.java`).
Die Wochenplanung ist Source of Truth des Wochenplans, aus dem Filmauswahl und Kartenverkauf zur Laufzeit befüllt werden (CHANGELOG.md 0.2.0).

## Bausteine
`backend/`: Spring-Boot-Modulith, Java 25, H2; ein Modul je Bounded Context, README.md nennt nur die ersten zwei (`backend/pom.xml`, `kino/*/package-info.java`):
- `kino/filmauswahl/`: Schichten `data/`, `service/`, `web/`; REST `/api/programm` (README.md „Architektur“, `ProgrammController.java`)
- `kino/kartenverkauf/`: hexagonal, `application/{domain,ports,services}`, `adapters/{primary,secondary}`; REST `/api/kartenverkauf` (README.md, `KartenverkaufController.java`)
- `kino/wochenplanung/` (Abfrage `Wochenplanauskunft`) und `kino/zahlung/` (REST `/api/zahlung`), angebunden über Events/Kommandos wie `WochenplanErstelltDto`, `StarteZahlungDto` (`Wochenplanauskunft.java`, `Zahlungsabwicklung.java`)
- `kino/common/`: offenes Modul mit `architecture/`, `error/`, `fixtures/`, `web/` (`kino/common/package-info.java`)
- `frontend/`: Angular 21, `src/app/{filmauswahl,kartenverkauf,zahlung,common}`, Dev-Proxy `/api` → `localhost:8080` (`frontend/package.json`, `frontend/src/proxy.conf.json`)
- Modul- und DDD/Hexagonal-Regeln: `ModularityTest`, `ArchitectureTest` (`backend/src/test/java/de/wps/ddd/kino/architecture/`)

## Bauen, Starten, Testen
Am 2026-11-19 ausgeführt, alles grün, lokal mit JDK 25 (Oracle 25.0.5.1 statt der in `mise.toml` gepinnten Temurin 25.0.3) / Node 24:
- `cd backend && ./mvnw clean verify`: Build, Unit-Tests (Surefire) und `*IntegrationTest` (Failsafe) (`backend/pom.xml`)
- `cd frontend && npm ci && npm run build && npm run test:ci`: Build und Vitest-Tests (`frontend/package.json`)
Starten laut README.md, nicht selbst ausgeführt: `cd backend && ./mvnw spring-boot:run` (:8080, H2-Datei `backend/data/`, bei jedem Start neu befüllt, `application.properties`), `cd frontend && npm start` (:4200).

## Begriffe: Gespräch → Code
- Kinoprogramm → `Programm`: `ProgrammService`, `/api/programm`, Frontend-Route `programm` (README.md, `frontend/src/app/app.routes.ts`)
- Wochenplanerstellung (Subdomäne) → Modul `wochenplanung` (README.md, `kino/wochenplanung/`)
- Block zusammenhängender Plätze → `ZusammenhaengendePlaetze`; `KartenBlock` ist dagegen die Factory für Kinokarten (README.md, `KartenBlock.java`)
- Zahlungsvorgang (Kartenverkauf) heißt im Modul `zahlung` `Zahlung`; `ZahlungsvorgangId` → `Zahlungsreferenz`, `Geldbetrag` → `Betrag` in Cent (`ZahlungEventPublisher.java`, `kino/zahlung/domain/`)
- Zahlungsstatus *Ausstehend* (Kartenverkauf, docs/Glossar.md) heißt im Modul `zahlung` *Offen* (beide `Zahlungsstatus.java`)
- Umlaute in Bezeichnern als ae/oe/ue: `Saele`, `Verkaufsvorgaenge`, `ZusammenhaengendePlaetze` (Dateinamen unter `kino/kartenverkauf/`)

## Arbeitsweise
- Features und Änderungen am Code werden im dafür angelegten Git-Worktree auf eigenem Branch entwickelt (Schulung: der Worktree, den die jeweilige Übung in `docs/Uebungen/UebungN.md` anlegt, z. B. Ü2 `../kino-uebung2`/`uebung2`, Ü4 `../kino-popcorn`/`popcorn`), nie direkt im Haupt-Repo auf `main`. Ist kein Worktree vorhanden oder unklar, welcher gilt, wird vor der ersten Änderung nachgefragt. Auch Subagenten arbeiten dort.
