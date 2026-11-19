---
name: annahmen-audit
description: Verwende diesen Skill nach einer abgeschlossenen Umsetzung durch einen Agenten (Feature, Änderung, Bugfix), wenn nicht klar ist, welche Entscheidungen der Agent stillschweigend selbst getroffen hat – z. B. vor dem Review, vor dem Commit oder wenn die Fachlichkeit unklar war. Auch bei Aufforderungen wie "Welche Annahmen hast du getroffen?", "Annahmen-Audit" oder "Was hast du dir ausgedacht?".
---

# Annahmen-Audit

Ändere nichts am Code. Dieser Skill ist rein lesend und dokumentiert nur.

## Aufgabe

Liste jede Annahme auf, die du bei der zuletzt durchgeführten Umsetzung getroffen hast. Berücksichtige ausdrücklich auch implizite Annahmen, zum Beispiel zu:

- Begriffen (Fachsprache, Benennung)
- Standardwerten
- Testdaten
- dem Ort der Logik (Schicht, Modul, Klasse)

## Ausgabe

Erstelle eine Tabelle mit genau diesen Spalten:

| # | Annahme | Kategorie | Fundstelle (Datei:Zeile) | Sicherheit | Wer hätte es wissen müssen? |
|---|---------|-----------|--------------------------|------------|------------------------------|

- **Kategorie**: genau eine von `Begriff` | `Randfall` | `Ort im Code` | `Verhalten` | `Test`
- **Fundstelle**: konkrete Stelle im Code als `Datei:Zeile`; die Zeilen vorher im Code prüfen, nicht aus dem Gedächtnis angeben
- **Sicherheit**: `hoch` | `mittel` | `niedrig` – wie sicher bist du, dass die Annahme stimmt?
- **Wer hätte es wissen müssen?**: die Rolle bzw. Person, die die Antwort kennt (z. B. Fachexpert:in, Product Owner, Architekt:in, Entwickler:in)

Speichere die Tabelle als `annahmen-tabelle.md` im Ordner `/docs` (relativ zum Projektstamm, also `docs/annahmen-tabelle.md`). Lege den Ordner an, falls er fehlt. Eine bestehende Datei nicht stillschweigend überschreiben, sondern vorher darauf hinweisen.
