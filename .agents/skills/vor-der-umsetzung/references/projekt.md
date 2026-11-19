# Projektwissen KinoSoft für „vor-der-umsetzung"

Herkunft: `docs/annahmen-tabelle.md` (Übung 1, Filter für Kinderfilme). Die Nummern (#) verweisen auf deren Zeilen. Zeilenangaben dort können veraltet sein: vor Verwendung nachlesen.
Pfade: `kino/` = `backend/src/main/java/de/wps/ddd/kino/`, `test/` = `backend/src/test/java/de/wps/ddd/kino/`, `fa/` = `frontend/src/app/filmauswahl/`.

## 1. Begriff
- Prüfe jedes Fachwort in `docs/Glossar.md` und gegen den Code. Bekannter Widerspruch: `Vorstellungskategorie` (Standard/PrimeTime/Kinderfilm) ist laut Glossar eine **Preisstufe**, nicht automatisch ein Hinweis auf Eignung für Kinder (#2). Frage nach, ob die Preisstufe oder etwas anderes (FSK, Genre, Zielgruppe) gemeint ist (#1, #3, #4).
- Alltagswort ≠ Codebegriff: siehe Abschnitt „Begriffe" in `AGENTS.md` (z. B. Kinoprogramm → `Programm`, Umlaute als ae/oe/ue).
- Namen von Parametern, Beschriftungen und Leertexten sind Fachsprache und werden bestätigt (#8, #9). Ein Boolean-Parameter schließt weitere Filter dieser Art aus.

## 2. Randfall
- Fehlende Kategorie (`null`) bei Altdaten oder Import ohne Feld: Verhalten klären (#24).
- Uhrzeit (z. B. Abendvorstellung) und Tag vs. Woche als Filterreichweite (#18, #23).
- Frontend: Umschalten vor Datumswahl, schnelles Umschalten mit überholten Antworten (`switchMap`), ungültige Parameterwerte (#25, #26, #27).

## 3. Ort im Code
- Module: `filmauswahl` (Lesesicht, wird beim Wochenplan-Import aus `wochenplanung` befüllt) und `wochenplanung` sind getrennt. Die Kopplung läuft über Daten beim Import, nicht über Typen: Die Kategorie liegt in `filmauswahl` als `String` (#6, #7, #11). Umbenennungen des Quell-Enums brechen das ohne Fehlermeldung. Entscheidung dazu bewusst treffen und absichern.
- Filtern kann im Repository (JPQL), im Service oder im Frontend passieren (#10). Ein `join fetch` mit `where` kürzt Collections und ist nach JPA nicht vorgesehen (#12).
- Die Schemaanlage erfolgt bei jedem Start neu (`ddl-auto=create`), `docs/Datenbank.md` bei neuen Spalten mitpflegen (#14).
- Modulgrenzen und Schichten prüfen `ModularityTest` und `ArchitectureTest` (siehe `AGENTS.md`).

## 4. Verhalten
- Gilt die Eigenschaft für die **Vorstellung** oder den **Film**? Davon hängt ab, welche Vorstellungen ein gefilterter Film zeigt (#5).
- Standardwert des Filters ist in Backend, Komponente und Frontend-Service jeweils einzeln gesetzt (#16, #17). Alle Stellen abstimmen.
- Filterzustand in URL oder Storage, sofortiges Neuladen vs. „Anwenden", Bedienelement, Leertext nur bei aktivem Filter (#19–#22).
- Die Entity wird direkt als JSON serialisiert: neue Felder erscheinen automatisch in der öffentlichen Antwort (#15). Alte Methodensignaturen als Überladung zu erhalten ist eine Entscheidung (#13).

## 5. Test
- Integrationstests laufen auf `WochenplanFixture` mit fester Uhr (2025-03-19). Erwartungen hängen am Fahrplan des Fixtures (#28). Erwartete Werte aus der Fachlichkeit ableiten, nicht aus den Fixtures abschreiben.
- Controller-Tests prüfen nur das Weiterreichen von Parametern, nicht die Filterlogik (#29). Filterlogik braucht Service-/Integrationstests.
- Typische Lücken: leerer Tag, Kategorie `null`, Filter wieder ausschalten, Abendvorstellung, Ende-zu-Ende. Frontend-Test: pauschale Antwort `[]` verdeckt, welcher Request ausgelöst wurde (#30, #31).
- Befehle: siehe Abschnitt „Bauen, Starten, Testen" in `AGENTS.md`.
