---
name: klaeren
description: Verwende diesen Skill, wenn eine neue fachliche Anforderung per Interview geklärt werden soll, bevor Code entsteht (z. B. "/klaeren Beim Ticketkauf sollen Gäste Popcorn mitbestellen können"). Er stellt dem Nutzer nacheinander Fragen, erhebt den Ist-Prozess selbst aus Code und Diagrammen und schreibt das Ergebnis nach docs/anforderungen/<thema>-klaerung.md.
---

# Klären

Zweck: Alles, was sonst als Annahme im Code landen würde, im Gespräch klären. Der Skill schreibt keinen Code, nur die Klärungsdatei.

## Regeln

- Schreibe keinen Code und ändere keine bestehenden Dateien. Einzige Ausgabe ist `docs/anforderungen/<thema>-klaerung.md` (`<thema>` kleingeschrieben, ohne Umlaute, z. B. `popcorn`).
- Stelle **eine Frage nach der anderen**, höchstens **10 Fragen** insgesamt. Warte nach jeder Frage auf die Antwort, bevor du die nächste stellst.
- Bevor du fragst, erhebe den **Ist-Prozess selbst**: aus dem Code (Module, Domäne, Ports, Controller, Frontend-Routen), aus `docs/Glossar.md` und aus den vorhandenen Diagrammen in `docs/diagrams/`. Frage nie nach etwas, das du dort belegen kannst. Belege jede Aussage mit `Datei:Zeile`, die du gelesen hast.
- Frage nach allem, was sonst angenommen werden müsste. Die Kategorien kommen aus `docs/annahmen-tabelle.md`:
  - **Begriff**: Was heißt das Fachwort genau? Widersprüche zwischen Glossar und Code.
  - **Verhalten**: Standardwerte, Zustand über Aktionen hinweg, Reichweite, Texte für leere Zustände, Auswirkung auf bestehende Aufrufer und die API.
  - **Randfall**: leere oder fehlende Werte, ungültige Eingaben, Grenzwerte, Zeit- und Reihenfolgeeffekte, Altdaten, Abbruch und Stornierung.
  - **Ort im Code**: Modul, Schicht, Modulgrenzen, Datenhaltung. Nur fragen, wenn die Wahl nicht eindeutig ist; nenne Alternativen mit Vor- und Nachteilen.
  - **Test**: Testebene, Testdaten, Fixtures, feste Uhr.
- Priorisiere: Fachliches mit großer Wirkung zuerst. Reichen 10 Fragen nicht, kommt der Rest als offene Frage in die Datei.
- Formuliere jede Frage einzeln mit Kategorie, Beleg (falls vorhanden), 2–3 Antwortmöglichkeiten und deiner Empfehlung. Der Nutzer darf frei antworten.
- **„Wissen wir nicht" wird zur offenen Frage, nicht zur Entscheidung.** Nimm keinen Standardwert an, auch nicht stillschweigend.
- Eine Antwort wird erst zur Entscheidung, wenn der Nutzer sie gegeben hat. Halte sie mit Quelle fest („Antwort im Interview, <Datum>").

## Ablauf

1. Thema aus dem Aufruf ableiten. Ist keins erkennbar, stelle als erste Frage: Welche Anforderung soll geklärt werden?
2. Ist-Prozess erheben (siehe oben), ohne den Nutzer zu fragen. Fasse ihn dem Nutzer in 3–5 Sätzen zusammen, bevor die erste Frage kommt.
3. Interview: eine Frage, Antwort abwarten, nächste Frage. Nach der letzten Frage oder wenn der Nutzer abbricht, weiter mit 4.
4. Schreibe `docs/anforderungen/<thema>-klaerung.md` mit genau diesen vier Abschnitten:

   ```markdown
   # <Thema> – Klärung
   Stand: <Datum>. Anforderung: „<Originalauftrag>"

   ## 1 Entschieden
   | # | Entscheidung | Kategorie | Quelle |
   (nur Antworten des Nutzers oder belegte Fakten aus Glossar/Code; Quelle = Interview oder Datei:Zeile)

   ## 2 Offene Fragen an den Fachbereich
   | # | Frage | Kategorie | Beleg | Mögliche Antworten | Wer kann antworten |
   („Wissen wir nicht"-Antworten und nicht gestellte Fragen; je mit Auswirkung, falls ungeklärt)

   ## 3 Ist/Soll mit Lücken und Chancen
   Ist-Prozess (aus Code und Diagrammen, mit Belegen), Soll-Prozess (nach den Entscheidungen),
   darunter Lücken (was fehlt oder ungeklärt ist) und Chancen (was sich wiederverwenden oder vereinfachen lässt).

   ## 4 Vertikale Slices, priorisiert nach Abhängigkeiten
   | Slice | Inhalt (Ende-zu-Ende, von UI bis Persistenz) | Hängt ab von | Blockiert durch offene Frage # |
   (jede Slice klein genug für einen Commit, in umsetzbarer Reihenfolge; Slices, die an offenen Fragen hängen, so markieren)
   ```

5. Beende mit einer kurzen Zusammenfassung: Anzahl Entscheidungen, Anzahl offener Fragen, Slice 1. Nenne die Datei. Setze nichts um.
