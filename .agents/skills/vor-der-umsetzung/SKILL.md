---
name: vor-der-umsetzung
description: Verwende diesen Skill, bevor eine neue fachliche Anforderung umgesetzt wird (neues Feature, Verhaltensänderung, Erweiterung bestehender Funktionalität), besonders wenn der Auftrag kurz oder mehrdeutig formuliert ist oder Fachbegriffe verwendet, die nicht eindeutig definiert sind. Er klärt Annahmen, bevor Code entsteht, statt sie hinterher aufzudecken.
---

# Vor der Umsetzung

Zweck: Entscheidungen, die sonst stillschweigend im Code landen, vorher sichtbar machen und klären. Schreibe in den Schritten 1–5 keinen Produktivcode.

## Grundregeln

- Offenes wird gefragt, nicht geraten. Kannst du eine Antwort nicht aus Glossar, Dokumentation, Code oder Tests belegen, ist sie offen.
- Belege jede Antwort mit einer Fundstelle (`Datei:Zeile`), die du vorher gelesen hast. Nichts aus dem Gedächtnis.
- Widersprüche zwischen Quellen (z. B. Glossar und Code) sind offene Fragen, keine Entscheidungen.
- Befehle zum Bauen und Testen stehen in der `AGENTS.md`. Nutze nur diese.
- Lies `references/projekt.md`, wenn du in diesem Projekt arbeitest und Begriffe, Schichten oder Testdaten einordnen musst.

## Ablauf

Gehe die Schritte in dieser Reihenfolge durch. Notiere je Schritt kurz: Befund, Beleg, offene Fragen.

1. **Begriff.** Welche Fachwörter enthält die Anforderung? Suche jedes im Glossar, in der Dokumentation und im Code. Halte fest, was es dort bedeutet und welche Nachbarbegriffe es abgrenzt. Gibt es mehrere mögliche Bedeutungen oder keinen Treffer, ist das eine offene Frage. Benenne neuen Code mit dem Wort der Fachsprache.
2. **Randfall.** Zähle die Grenzen auf: leere Ergebnisse, fehlende Werte, ungültige Eingaben, Grenzwerte, Zeit- und Reihenfolgeeffekte, Altdaten. Entscheide nichts davon allein. Was die Fachlichkeit betrifft, geht als Frage an die zuständige Rolle.
3. **Ort im Code.** Bestimme, in welchem Modul und in welcher Schicht die Logik hingehört. Orientiere dich an Modulgrenzen, Architekturtests und ähnlichen bestehenden Stellen. Prüfe, ob die Änderung eine Modulgrenze kreuzt, und wie die Module bisher verbunden sind. Ist die Wahl nicht eindeutig, nenne die Alternativen mit Vor- und Nachteilen und frage.
4. **Verhalten.** Beschreibe das sichtbare Verhalten in Beispielen: Ausgangslage, Aktion, erwartetes Ergebnis. Dazu gehören Standardwerte, Zustand über Aktionen hinweg, Reichweite (was genau betroffen ist), Texte für leere Zustände und Auswirkungen auf bestehende Aufrufer und die öffentliche Schnittstelle. Jeder Standardwert ist eine Entscheidung und wird bestätigt.
5. **Test.** Lege fest, welche Tests das Verhalten aus Schritt 4 und die Randfälle aus Schritt 2 belegen, und auf welcher Ebene (Unit, Integration, Oberfläche). Prüfe, woher die Testdaten kommen und wovon die Erwartung abhängt (feste Uhr, Fixtures). Ein Test, der nur Weiterreichen prüft, belegt die Logik nicht.

## Klärung

Fasse alle offenen Punkte in einer Liste zusammen, je Frage mit Kategorie, Beleg, den möglichen Antworten und der Rolle, die sie beantworten kann. Stelle sie gebündelt, bevor du weitermachst. Arbeite mit bestätigten Antworten weiter. Lässt sich nicht klären, dokumentiere die Annahme sichtbar (Abschlussbericht, Test oder Kommentar) und markiere sie als ungeklärt.

## Umsetzung

1. Schreibe zuerst einen Test, der das bestätigte Verhalten ausdrückt, und führe ihn aus. Er muss aus dem erwarteten Grund fehlschlagen. Schlägt er nicht fehl oder aus anderem Grund, korrigiere den Test.
2. Setze dann minimal um, bis der Test grün ist. Wiederhole mit dem nächsten Verhalten oder Randfall.
3. Führe am Ende alle Build- und Testbefehle aus der `AGENTS.md` aus und berichte das Ergebnis, auch Fehlschläge.
4. Nenne im Abschluss die getroffenen Entscheidungen und die noch ungeklärten Annahmen.
