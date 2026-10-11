# Pruefschleife fuer Zahlen

Festgelegt am 11.10.2026 auf Auftrag des Owners. Jede Zahl, die World Eden Era (WEE) oeffentlich oder in
KI-Systemen verwendet, laeuft durch diese Schleife, bevor sie verwendet wird, und danach in festen Abstaenden
erneut. Einzige Wahrheit ist `zahlen/zahlen.json`.

## Ausloeser

1. Monatlich am 1. um 6 Uhr laeuft die GitHub-Pruefung `.github/workflows/zahlen-pruefung.yml`.
2. Jede Aenderung an `zahlen/`, `kontext/`, `sprache/` oder `FIRMENKONTEXT.md` startet dieselbe Pruefung.
3. Jeder neue Text mit Zahlen (Beitragsentwurf, Foerderantrag, Website-Text) wird vor der Veroeffentlichung
   geprueft: `node checks/zahlen-scan.mjs --datei <Entwurf>`. Meldet er `NEUE-ZAHLEN`, ist der Entwurf
   nicht freigegeben, bis die Schleife fuer diese Zahlen durchlaufen ist.
4. Erreicht eine Zahl ihr Datum `naechste_pruefung`, ist sie wieder faellig.

Findet die GitHub-Pruefung faellige oder neue Zahlen, legt sie ein Issue mit der Liste an. Instagram kann sie
ohne Login nicht lesen; Instagram-Zahlen kommen ueber Ausloeser 3 oder eine Sitzung mit Login hinzu.

## Schritte (immer gleich, immer vollstaendig)

1. **Erfassen.** Jede gemeldete Fundstelle bekommt genau ein Ziel:
   - neue Zahl → neuer Eintrag in `zahlen/zahlen.json` mit `bewertung: "ungeprueft"`, Satz in `wortlaute`,
     Fundstelle in `verwendet_in`;
   - dieselbe Behauptung wie ein vorhandener Eintrag → Satz in dessen `wortlaute`, Fundstelle in `verwendet_in`;
   - keine Behauptung (Datum, Adresse, Folgennummer, Preis eines Tickets) → `zahlen/scan-ignoriert.json`
     mit `{"satz": "...", "grund": "..."}`.
2. **Pruefen.** Fuer jede ungepruefte oder faellige Zahl externe Belege suchen. Rangfolge:
   a) Primaerquelle: begutachtete Studie, amtliche Statistik (z. B. FAO, UN, EU, Umweltbundesamt, Destatis);
   b) Fachbehoerde oder Fachverband; c) serioese Presse nur ergaenzend. Nicht zulaessig: Blogs, Werbung,
   KI-erzeugte Texte, Quellen ohne oeffentlich pruefbare Adresse. Je Beleg: Titel, Herausgeber, Jahr, URL und
   die woertliche Stelle (mit Seite oder Abschnitt) in `belege`.
3. **Bewerten** nach genau diesen Stufen:
   - `belegt`: mindestens zwei Belege verschiedener Herausgeber stuetzen die Zahl in Groessenordnung und Kontext;
   - `eingeschraenkt`: stimmt nur unter Bedingungen (bestimmtes System, „bis zu", Region, Zeitraum);
   - `umstritten`: Belege widersprechen sich;
   - `falsch`: Belege widersprechen der Zahl klar;
   - `unbelegt`: trotz Suche nach Schritt 2 kein zulaessiger Beleg; die Suche steht in der `begruendung`.
   Ausser bei `belegt` steht eine `begruendung`.
4. **Sichere Formulierung.** `sichere_formulierung` sagt, wie WEE die Zahl oeffentlich verwenden darf, mit
   Bedingung und Quelle (z. B. „laut FAO weniger als 20 % des Wassers bodengebundenen Anbaus"). Bei `falsch`
   und `unbelegt`: die Korrektur oder „nicht verwenden".
5. **Owner.** Bei `umstritten`, `falsch` und `unbelegt` entscheidet der Owner; Datum und Wortlaut stehen in
   `freigabe_owner`. Steht eine falsche Zahl in einem oeffentlichen Kanal, kommt sie auf die Korrekturliste in
   `zahlen/KORREKTUREN.md`; die Kanaele selbst aendert die Schleife nicht.
6. **Termine.** `geprueft_am` = heute. `naechste_pruefung` = heute plus 12 Monate bei stabilen Zahlen
   (Naturgesetze, historische Fakten, abgeschlossene Studien), plus 6 Monate bei veraenderlichen Zahlen
   (Statistiken, Marktzahlen, Foerderbedingungen, Reichweiten).
7. **Abschluss.** Gruen sein muessen: `node checks/check-folge.mjs zahlen-register`, `zahlen-abdeckung`,
   `zahlen-faellig` (meldet `ZAHLEN-AKTUELL`) und `node checks/zahlen-scan.mjs` (meldet `KEINE-NEUEN-ZAHLEN`).
   Dann Commit und das Issue schliessen.

## Regeln fuer KI-Systeme und Team

- Verwendet werden nur Zahlen aus `zahlen/zahlen.json` mit `belegt`, `eingeschraenkt` oder `umstritten`, und
  zwar in der `sichere_formulierung`. `ungeprueft`, `unbelegt` und `falsch` werden nie verwendet.
- Jede Zahl im Firmenkontext traegt den Verweis `[Znnn]` auf ihren Eintrag (geprueft mit `zahlen-abdeckung`).
- Neue Zahlen entstehen nie im Text, sondern immer zuerst im Register.
