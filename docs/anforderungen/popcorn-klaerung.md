# Popcorn – Klärung
Stand: 2026-11-20. Anforderung: „Beim Ticketkauf sollen Gäste Popcorn mitbestellen können."

Abkürzungen: `kv/` = `backend/src/main/java/de/wps/ddd/kino/kartenverkauf/`, `fe/` = `frontend/src/app/kartenverkauf/`.

## 1 Entschieden
| # | Entscheidung | Kategorie | Quelle |
|---|--------------|-----------|--------|
| E1 | Es gibt ein festes Sortiment mit festen Preisen (kein freier Preis, keine Kombi-Angebote). | Begriff | Antwort im Interview, 2026-11-20 |
| E2 | Sortiment: Popcorn klein 3,50 €, mittel 4,50 €, groß 5,50 €; Geschmack süß oder salzig, ein Preis je Größe. Preise stammen aus einem Vorschlag und wurden vom Nutzer bestätigt (nicht aus dem Code belegt). | Begriff / Verhalten | Antwort im Interview, 2026-11-20 |
| E3 | Popcorn ist optional (null erlaubt), frei wählbar je Sorte und unabhängig von der Kartenanzahl, höchstens 10 Portionen insgesamt je Bestellung. | Verhalten / Randfall | Antwort im Interview, 2026-11-20 |
| E4 | Nach der Zahlung gibt es einen eigenen Abholbeleg neben den Kinokarten, mit Auftragsnummer und den bestellten Portionen. Der Gast holt das Popcorn am Kiosk ab. | Verhalten | Antwort im Interview, 2026-11-20 |
| E5 | Popcorn gehört zum Verkaufsvorgang: Es wird beim Start mit den Plätzen festgelegt, der Gesamtpreis umfasst Karten und Popcorn, es gibt eine Zahlung. Ein abgelehnter Zahlungsvorgang lässt die Bestellung unverändert. Der Beleg entsteht erst nach Zahlungseingang. Popcorn gibt es nur zusammen mit mindestens einer Kinokarte. | Verhalten / Begriff | Antwort im Interview, 2026-11-20 |
| E6 | Das Sortiment liegt im Modul `kartenverkauf` als eigener Typ im Paket und fest im Code. Ein späterer Umzug in ein Modul `kiosk` bleibt möglich. | Ort im Code | Antwort im Interview, 2026-11-20 |
| E7 | Neuer optionaler Schritt „Popcorn wählen" zwischen Platzwahl und Zahlung, mit „Ohne Popcorn weiter". Die Zahlung zeigt Karten und Popcorn aufgeschlüsselt. Ohne Popcorn entsteht kein Abholbeleg. | Verhalten | Antwort im Interview, 2026-11-20 |
| E8 | Popcorn ist immer verfügbar: kein Bestand, keine Sperre, nur die Obergrenze aus E3. | Randfall | Antwort im Interview, 2026-11-20 |
| E9 | Das Popcorn-Feld ist in `POST /verkaufsvorgaenge` und `POST /preisanfrage` optional. Fehlt es oder ist es leer, gilt „kein Popcorn". Ungültige Mengen oder Sorten werden wie bestehende Geschäftsregel-Verletzungen behandelt (Fehlerantwort, nichts gespeichert). | Verhalten / Randfall | Antwort im Interview, 2026-11-20 |
| E10 | Tests nach Pyramide: Unit-Tests (Preisberechnung, Obergrenze, Beleg-Erzeugung), ein Integrationstest für Kauf mit und ohne Popcorn bis zum Abholbeleg (bestehende Fixture, feste Uhr), Vitest für den neuen Schritt. Architekturtests bleiben grün. | Test | Antwort im Interview, 2026-11-20 |
| E11 | Der Kiosk sperrt keine Sorten und führt keinen Bestand (bestätigt E8). Antwort auf O1. | Randfall | Antwort im Interview, 2026-11-20 |
| E12 | Die Preise aus E2 bleiben so; sie können sich später ändern. Antwort auf O3. | Verhalten | Antwort im Interview, 2026-11-20 |
| E13 | Popcorn hat keine Preise je Vorstellungskategorie, der Preis hängt nur von der Größe ab. Antwort auf O6. | Verhalten | Antwort im Interview, 2026-11-20 |
| E14 | Allergene und Steuersatz werden nicht ausgewiesen. Antwort auf O5. | Verhalten | Antwort im Interview, 2026-11-20 |
| E15 | Bei Zahlungsabbruch gilt Popcorn als nicht gekauft; bei einer Erstattung folgt Popcorn dem Prinzip der Kinokarten. Antwort auf O4 (zugeordnet: die Antwort war mit „o6" beschriftet und handelt vom Zahlungsabbruch). Der Erstattungsteil ist durch E19 derzeit gegenstandslos. | Randfall | Antwort im Interview, 2026-11-20 |
| E16 | Der Kunde zeigt den Abholbeleg an der Kasse; er gilt für den Tag der Vorstellung. Antwort auf O2 (teilweise). | Randfall | Antwort im Interview, 2026-11-20 |
| E17 | Der Abholbeleg ist nur einmal einlösbar. Antwort auf O2. | Randfall | Antwort im Interview, 2026-11-20 |
| E18 | „Kasse" und „Kiosk" sind dieselbe Stelle: Dort zeigt der Kunde den Beleg und holt das Popcorn ab. Antwort auf O2. | Begriff | Antwort im Interview, 2026-11-20 |
| E19 | Es gibt keine Stornierung (und damit keine Erstattung) bezahlter Verkaufsvorgänge, für Karten wie für Popcorn. Antwort auf O4. | Randfall | Antwort im Interview, 2026-11-20 |
| E20 | Die Begriffe „Popcorn-Bestellung", „Abholbeleg" und „Sortiment" werden mit den vorgeschlagenen Definitionen ins Glossar des Kartenverkaufs aufgenommen (siehe Abschnitt 3). Antwort auf O7. | Begriff | Antwort im Interview, 2026-11-20 |
| E21 | Der Abholbeleg wird gedruckt, trägt einen Code (QR oder Barcode), die Kasse scannt ihn, das System entwertet den Beleg. Ein zweiter Scan wird abgelehnt. Digitale Belege (Anzeige auf dem Handy) sind eine spätere Ausbaustufe. Antwort auf O8. | Verhalten / Randfall | Antwort im Interview, 2026-11-20 |
| F1 | Der heutige Gesamtpreis ergibt sich nur aus Plätzen: Vorstellungspreis 8,50 € bis 12 € plus 2 € Loge-Zuschlag. | Verhalten | `kv/application/domain/kartenverkauf/Preisberechnung.java:18-41` |
| F2 | Es gibt heute kein Popcorn, keinen Snack und kein Getränk im Code oder Glossar. | Begriff | Suche über `backend/src`, `frontend/src`, `docs`; nur Treffer im Diagramm-Namen `docs/diagrams/Szenario-1-Kartenverkauf.egn.svg:513` |

## 2 Offene Fragen an den Fachbereich
| # | Frage | Kategorie | Beleg | Mögliche Antworten | Wer kann antworten |
|---|-------|-----------|-------|--------------------|--------------------|
| O9 | Wer darf an der Kasse Belege einlösen (Rolle, Anmeldung), und welche Scanner-Hardware ist vorhanden (QR oder Barcode)? Auswirkung, falls ungeklärt: Slice 6 braucht Berechtigung und Codeformat; ohne Antwort ist beides eine Annahme. Die Frage kam nach dem Limit von 10 Fragen auf und wurde nicht gestellt. | Verhalten / Ort im Code | Entscheidung E21; Kartenverkauf hat eine eigene `SecurityConfig` (`kv/adapters/primary/web/config/SecurityConfig.java`) | Kassenpersonal mit Anmeldung; offener Kassen-Endpunkt. QR-Code; Barcode | Kinobetreiber / Kasse, IT |

Geschlossen durch Antworten: O1 (E11), O2 (E17, E18), O3 (E12), O4 (E19), O5 (E14), O6 (E13), O7 (E20), O8 (E21).

## 3 Ist/Soll mit Lücken und Chancen
**Ist-Prozess**
- Der Gast durchläuft fünf Schritte: Vorstellung wählen, Kartenanzahl wählen, Plätze wählen, Kinokarten zahlen, Kinokarten drucken (`fe/components/kartenverkauf-page/kartenverkauf.component.html:7-43`).
- `POST /api/kartenverkauf/preisanfrage` berechnet den Preis aus Vorstellung und Plätzen (`kv/adapters/primary/web/controllers/KartenverkaufController.java:83-89`, `Preisberechnung.java:18-22`).
- `POST /api/kartenverkauf/verkaufsvorgaenge` nimmt `vorstellungId` und Plätze und legt einen Verkaufsvorgang mit festem Gesamtpreis an (`KartenbestellungDto.java:5`, `kv/application/services/StarteVerkaufsvorgang.java:21-28`, `Verkaufsvorgang.java:22`).
- Ein Zahlungsvorgang deckt immer den Gesamtpreis ab; bei Ablehnung folgt ein neuer Anlauf unter derselben Auftragsnummer (`Verkaufsvorgang.java:48-57`, `docs/Glossar.md:35`).
- Nach Zahlungseingang schließt der Verkaufsvorgang ab, die Kinokarten werden erstellt (`Verkaufsvorgang.java:67-72`, `kv/application/domain/kartenverkauf/KartenBlock.java:13-27`).
- Das Diagramm `docs/diagrams/Szenario-1-Kartenverkauf.egn.svg` zeigt nur den Kartenverkauf, keine Popcorn-Schritte.

**Soll-Prozess (nach E1–E10)**
1. Der Gast wählt Vorstellung, Kartenanzahl und Plätze wie bisher.
2. Im neuen optionalen Schritt „Popcorn wählen" wählt er Größe, Geschmack und Menge (insgesamt höchstens 10) oder geht ohne Popcorn weiter.
3. Die Preisanfrage und der Verkaufsvorgang enthalten das optionale Popcorn-Feld; der Gesamtpreis umfasst Karten und Popcorn.
4. Eine Zahlung deckt den Gesamtpreis ab; ein abgelehnter Zahlungsvorgang lässt die Bestellung unverändert.
5. Nach Zahlungseingang werden Kinokarten gedruckt und, wenn Popcorn bestellt wurde, ein Abholbeleg ausgegeben. Der Kunde zeigt ihn an der Kasse, er gilt für den Tag der Vorstellung (E16) und ist nur einmal einlösbar (E17). Die Kasse scannt den Code, das System entwertet den Beleg, ein zweiter Scan oder ein Scan an einem anderen Tag wird abgelehnt (E21, E16).

**Lücken**
- Einlösung und Gültigkeit des Abholbelegs sind geklärt (E16, E17, E18); die Einlösung wird im System erfasst (E21); offen bleiben Berechtigung und Scanner-Hardware (O9).
- Bestand und Sperre sind bewusst ausgeklammert (E8, E11).
- Stornierung und Erstattung gibt es nicht und sind nicht vorgesehen (E19); Popcorn und Karten verhalten sich gleich.
- Steuer und Allergene werden nicht ausgewiesen (E14).
- Die Fachbegriffe fehlen noch im Glossar und werden ergänzt (E20, Slice 1).
- In `StarteVerkaufsvorgang` steht noch ein offenes TODO: Plätze im Saalplan blocken (`StarteVerkaufsvorgang.java:26-27`). Das betrifft Popcorn nicht, sollte aber bei der Umsetzung nicht verschlimmert werden.

**Chancen**
- `Preisberechnung` ist eine reine Domänen-Klasse, an die sich ein Popcorn-Preis leicht anschließt (`Preisberechnung.java:12-22`).
- Das bestehende Schrittmuster im Frontend (Badge plus Komponente) lässt sich für „Popcorn wählen" wiederverwenden.
- `GeschaeftsregelVerletzt` deckt die Fehlerbehandlung für ungültige Mengen und Sorten ab (`Verkaufsvorgang.java:49-52`).
- Ein Sortiment als eigener Typ im Paket (E6) macht Getränke später mit geringem Aufwand ergänzbar (`docs/Uebungen/Uebung5.md:38`).

## 4 Vertikale Slices, priorisiert nach Abhängigkeiten
| Slice | Inhalt (Ende-zu-Ende, von UI bis Persistenz) | Hängt ab von | Blockiert durch offene Frage # |
|-------|----------------------------------------------|--------------|--------------------------------|
| 1 | Domäne: Popcorn-Sortiment (Größe, Geschmack, Preis) und Popcorn-Bestellung mit Obergrenze 10; `Preisberechnung` berechnet Karten plus Popcorn; Unit-Tests; Glossar um „Popcorn-Bestellung", „Abholbeleg" und „Sortiment" ergänzen (E20). | – | – |
| 2 | `POST /preisanfrage` nimmt das optionale Popcorn-Feld an und liefert den Gesamtpreis; ohne Popcorn bleibt das Verhalten wie bisher; Controller-Test. | 1 | – |
| 3 | `POST /verkaufsvorgaenge` speichert die Popcorn-Bestellung im Verkaufsvorgang (Entity, Mapper, Persistenz); Gesamtpreis inkl. Popcorn; ungültige Eingaben werden abgelehnt; Integrationstest mit festem Zeitpunkt. | 1, 2 | – |
| 4 | Frontend: neuer optionaler Schritt „Popcorn wählen" mit „Ohne Popcorn weiter"; Preisaufschlüsselung in der Zahlung; Vitest. | 2, 3 | – |
| 5 | Abholbeleg: Erzeugung nach Zahlungseingang, Persistenz, Abruf-Endpunkt und Anzeige/Druck im Frontend; Integrationstest für Kauf mit und ohne Popcorn bis zum Beleg. | 3, 4 | – |
| 6 | Beleg an der Kasse einlösen: Code auf dem Beleg, Einlöse-Endpunkt (scannen, entwerten), Ablehnung bei zweitem Scan oder falschem Tag, kleine Kassenoberfläche; Integrationstest für Erst- und Zweitscan mit fester Uhr. | 5 | O9 |
