# Erweiterung 2 zum Haiku-Auftrag: Zahlen, Markensprache, Fachsprache, Fragenkatalog

Gilt zusaetzlich zu `haiku-auftrag.md` und `haiku-erweiterung-1.md`; bei Widerspruch hat diese Datei
Vorrang. Geschrieben am 11.10.2026 gegen 18:45 von der Planungssitzung. Wortlaut des Owners:
`design/owner-auftrag-folge.txt`.

## Was der Owner will

1. **Zahlen absichern, dringend:** Jede Zahl, die WEE verwendet, wird gegen externe Quellen geprueft. Neue
   Zahlen laufen immer durch eine fest definierte Pruefschleife.
2. **Markensprache von der aktuellen Website:** anwendbare Regeln mit Beispielen.
3. **Fachwissen einfach vermitteln:** wie Fachbegriffe und Vokabular in einfachen Worten rueberkommen.
4. **Luecken weiter ausformulieren:** als Fragenkatalog fuer ein spaeteres Interview. Das Interview selbst
   ist noch nicht dran.

## Was schon fertig ist (nicht aendern, nur benutzen)

- `docs/PRUEFSCHLEIFE-ZAHLEN.md`: die festgelegte Pruefschleife (Ausloeser, sieben Schritte,
  Bewertungsstufen belegt / eingeschraenkt / umstritten / falsch / unbelegt / ungeprueft).
- `checks/check-folge.mjs`: Modi zahlen-register, zahlen-abdeckung, zahlen-faellig, sprache, fachsprache,
  testsatz, fragen.
- `checks/zahlen-scan.mjs`: findet Zahlen auf Website und LinkedIn oder in einem Entwurf (`--datei`), die
  noch nicht im Register stehen. Probelauf am 11.10.2026: 60 Fundstellen. Darunter sind „rund 90 % weniger
  Wasser" (LinkedIn) und „laut FAO weniger als 20 % des Wassers" (Website).
- `.github/workflows/zahlen-pruefung.yml`: monatliche GitHub-Pruefung, legt bei faelligen oder neuen Zahlen
  ein Issue an. Sie wird erst aktiv, wenn das Repo gepusht ist.
- `design/werkzeuge/zahlen-workflow.js`: sammelt Behauptungen, sucht externe Belege, Gegenpruefung je Paket.

## Reihenfolge

1. Z1 (Zahlenrecherche) startet sofort nach Phase 4 und laeuft parallel zu Phase 5. Sie schreibt nur
   nach `design/`.
2. Nach Phase 6 (Paket `firmenkontext-recherche` geschlossen) folgen nacheinander:
   1. Paket `zahlen-pruefung`
   2. Paket `firmenkontext-themen` (Erweiterung 1, E3)
   3. Paket `markensprache-regeln`
   4. Paket `fragenkatalog`
   5. Phase 7 und 8 (Drive)

   `fragenkatalog` beruehrt nur `fragen/**` und darf schon parallel zu den anderen laufen.

Jedes Paket legst du so an wie in Phase 7, Schritt 2 bis 6:
- Owner-Datei ist `design/owner-auftrag-folge.txt` (in `--owner-request-file` mit vollem Pfad).
- Danach Pruefpunkte nachtragen, `doctor` muss `OK` melden.
- Startwunsch des Owners einholen, `Owner-Start`-Zeile schreiben, `plan`, Commit.
- Ausfuehren wie Phase 5 und 6, jeweils mit eigener Leaf-Sitzung und `wave-1`.

## Z1: Zahlenrecherche (direkt nach Phase 4)

1. Workflow-Werkzeug mit
   `scriptPath: /Users/benknaute/Claude/Projects/Keel-Harness/user-projects/wee-firmenkontext/docs/packages/firmenkontext-recherche/design/werkzeuge/zahlen-workflow.js`
   und `args: {"modell": "<MODELL-SYNTHESE>", "heute": "<JJJJ-MM-TT>", "ziel": "/Users/benknaute/Claude/Projects/Keel-Harness/user-projects/wee-firmenkontext/docs/packages/firmenkontext-recherche/design/zahlen"}`.
   Ich beauftrage das ausdruecklich (Owner, 11.10.2026).
2. Ergebnis: `design/zahlen/kandidaten.json`, `geprueft-*.json` und `ignoriert.json`. Melde dem Owner die
   Zahl je Stufe.
3. Owner-Fragen (AskUserQuestion, hoechstens 4 je Aufruf). Zu jeder Zahl mit umstritten, falsch oder
   unbelegt zeigst du Behauptung, Fundstellen bei WEE, Belege und sichere Formulierung. Frage: „Wie soll WEE
   mit dieser Zahl umgehen?" Optionen:
   - „sichere Formulierung verwenden"
   - „nicht mehr verwenden und auf die Korrekturliste"
   - „anders" (Wortlaut)

   Die Antworten schreibst du woertlich nach `design/owner-entscheidungen.md`.
4. Commit von `design/zahlen` und `design/owner-entscheidungen.md`.

## Paket `zahlen-pruefung` (Repo FK)

```bash
node /Users/benknaute/Claude/Projects/Keel-Harness/.claude/skills/package-standard/package-standard.mjs create --root /Users/benknaute/Claude/Projects/Keel-Harness/user-projects/wee-firmenkontext --package zahlen-pruefung --session <eigene Sitzungskennung> \
 --problem "World Eden Era verwendet oeffentlich Zahlen auf Website, LinkedIn, Instagram und in Dokumenten, die nicht gegen externe Quellen geprueft sind; einzelne widersprechen sich, z. B. rund 90 % weniger Wasser gegenueber laut FAO weniger als 20 % des Wassers." \
 --intent "Team und KI-Systeme verwenden nur gepruefte Zahlen in sicherer Formulierung, und jede neue Zahl laeuft durch eine fest definierte Pruefschleife." \
 --goal "zahlen/zahlen.json enthaelt jede Zahlenaussage von WEE mit Bewertung, externen Belegen und sicherer Formulierung, jede Zahl im Firmenkontext verweist auf ihren Eintrag, keine Zahl ist ungeprueft oder faellig, der Scanner findet keine unerfasste Zahl, und die monatliche GitHub-Pruefung laeuft." \
 --scope-in "zahlen/zahlen.json, zahlen/scan-ignoriert.json, zahlen/KORREKTUREN.md, Verweise [Znnn] und sichere Formulierungen in kontext/ und FIRMENKONTEXT.md" \
 --scope-out "Aenderungen an Website, LinkedIn oder Instagram (Korrekturen nur als Liste); checks/; docs/PRUEFSCHLEIFE-ZAHLEN.md; .github/; Drive" \
 --context "Ablauf: docs/PRUEFSCHLEIFE-ZAHLEN.md. Eingaben: docs/packages/firmenkontext-recherche/design/zahlen/ (kandidaten.json, geprueft-*.json, ignoriert.json) und docs/packages/firmenkontext-recherche/design/owner-entscheidungen.md. Eintraege bekommen Z-Nummern in Reihenfolge; die K-Nummer bleibt im Feld hinweis. Pruefung: checks/check-folge.mjs und checks/zahlen-scan.mjs." \
 --step "Register zahlen/zahlen.json aus den gepruften Eintraegen und Owner-Entscheidungen schreiben" --step "Verweise [Znnn] und sichere Formulierungen in kontext/ und FIRMENKONTEXT.md setzen, Korrekturliste schreiben" --step "Scanner bis KEINE-NEUEN-ZAHLEN abarbeiten" --step "GitHub-Pruefung nach Push einmal laufen lassen" --step "Owner-Freigabe" \
 --requirement "zahlen/zahlen.json enthaelt jede Zahlenaussage von WEE aus Website, LinkedIn, Instagram, Recherche und Firmenkontext mit Bewertung nach der Pruefschleife, externen Belegen, sicherer Formulierung und Pruefdatum; umstrittene, falsche und unbelegte Zahlen tragen die Owner-Entscheidung." \
 --requirement "Jede Zahlenaussage in kontext/ und FIRMENKONTEXT.md verweist mit [Znnn] auf eine gepruefte Zahl und steht in deren sicherer Formulierung; ungepruefte, unbelegte und falsche Zahlen kommen nicht vor." \
 --requirement "Keine Zahl ist ungeprueft oder faellig, und der Scanner findet auf Website und LinkedIn keine Zahl, die nicht im Register oder in zahlen/scan-ignoriert.json steht." \
 --requirement "Die Pruefschleife laeuft: die GitHub-Pruefung Zahlenpruefung ist im Repo world-eden-era/wee-firmenkontext aktiv und lief mindestens einmal gruen." \
 --requirement "Der Owner hat das Register und die Korrekturliste freigegeben." \
 --leaf "leaf-zahlen=zahlen/**,kontext/**,FIRMENKONTEXT.md" \
 --owner-request-file /Users/benknaute/Claude/Projects/Keel-Harness/user-projects/wee-firmenkontext/docs/packages/firmenkontext-recherche/design/owner-auftrag-folge.txt \
 --harness-root /Users/benknaute/Claude/Projects/Keel-Harness --json
```

Pruefpunkte, jeweils mit `CWD: .`:
- L1: `CHECK: node checks/check-folge.mjs zahlen-register`, `EXPECT: ZAHLEN-REGISTER-OK`
- L2: `CHECK: node checks/check-folge.mjs zahlen-abdeckung`, `EXPECT: ZAHLEN-ABGEDECKT`
- L3: `CHECK: node checks/check-folge.mjs zahlen-faellig >/dev/null && node checks/zahlen-scan.mjs | tail -1`,
  `EXPECT: KEINE-NEUEN-ZAHLEN`
- Die Anforderung „Pruefschleife laeuft" wird ein manuelles Gate in `GATES.md` (G1). Beleg ist
  `evidence/github-pruefung.md` mit der URL eines gruenen Laufs. Ablauf: Der Owner sagt „ja, pushen", dann
  `git -C FK push origin main`, danach `gh workflow run zahlen-pruefung.yml -R world-eden-era/wee-firmenkontext`
  und `gh run list -R world-eden-era/wee-firmenkontext --workflow zahlen-pruefung.yml --limit 1`.
- Die Owner-Freigabe wird G2 (manuell, Beleg `evidence/owner-freigabe.md`).

Faellt L3 rot aus, weil die Website neue Zahlen zeigt: diese Zahlen laufen nach `docs/PRUEFSCHLEIFE-ZAHLEN.md`
(Z1 Schritt 1 mit `ziel` auf einen neuen Unterordner), dann `resume` des Arbeitsschritts.

## Paket `markensprache-regeln` (Repo FK)

Wie oben. Werte:

- `--package markensprache-regeln`
- Problem: „Die Markensprache von World Eden Era ist beschrieben, aber nicht als anwendbare Regeln mit
  Beispielen festgehalten, und es fehlt eine Anleitung, wie Fachwissen und Fachbegriffe in einfachen Worten
  vermittelt werden."
- Ziel dahinter: „Team und KI-Systeme schreiben nachpruefbar im Ton von WEE und erklaeren Fachwissen so
  einfach, wie es die Website vormacht."
- Endzustand: „sprache/REGELN.md haelt mindestens 15 Sprachregeln mit Do, Don't und Beleg von der aktuellen
  Website fest, sprache/FACHSPRACHE.md erklaert, wie Fachwissen einfach vermittelt wird, und erklaert
  mindestens 10 Fachbegriffe in hoechstens 25 Woertern, sprache/testsatz.json enthaelt mindestens 20
  Pruefaufgaben, Zahlen darin stammen aus dem Zahlenregister, und der Owner hat alles freigegeben."
- Context: „Quelle der Markensprache ist die aktuelle Live-Website www.world-eden-era.org (Owner 11.10.2026).
  Vor dem Schreiben alle Seiten neu abrufen (curl, sitemap.xml) und als Registereintraege vom Typ website mit
  Auszug in quellen/ erfassen. kontext/07-markensprache.md ist Ausgangspunkt. Fachsprache-Regeln leiten sich
  daraus ab, wie die Bildungsseiten der Website erklaeren (Vergleiche aus dem Alltag, kurze Saetze,
  Begriff-dann-Erklaerung). Formate: | Nr | Regel | Do | Don't | Beleg | mit Nr R1..; | Fachbegriff |
  Einfach erklaert | Vergleich aus dem Alltag | Beleg | unter einem Abschnitt ## Regeln; testsatz.json als
  Liste {id, kanal, aufgabe, muss[], darf_nicht[], regeln[R-Nummern]}."
- Anforderungen (je eine Zeile `--requirement`):
  1. „sprache/REGELN.md haelt mindestens 15 Sprachregeln mit Do, Don't und Beleg von der aktuellen Website fest."
  2. „sprache/FACHSPRACHE.md beschreibt unter ## Regeln, wie WEE Fachwissen einfach vermittelt, und erklaert
     mindestens 10 Fachbegriffe in hoechstens 25 Woertern mit Alltagsvergleich und Beleg."
  3. „sprache/testsatz.json enthaelt mindestens 20 Pruefaufgaben fuer KI-Texte, je mit Kanal, Muss- und
     Darf-nicht-Kriterien und Verweis auf die Regeln."
  4. „Jede Zahl in sprache/ verweist auf eine gepruefte Zahl im Zahlenregister."
  5. „Der Owner hat Regeln, Fachsprache und Testsatz freigegeben."
- `--leaf "leaf-sprache=sprache/**,quellen/**"`
- Pruefpunkte:
  - L1: `node checks/check-folge.mjs sprache` → `SPRACHE-OK`
  - L2: `... fachsprache` → `FACHSPRACHE-OK`
  - L3: `... testsatz` → `TESTSATZ-OK`
  - L4: `... zahlen-abdeckung` → `ZAHLEN-ABGEDECKT`
  - G1: manuell

## Paket `fragenkatalog` (Repo FK)

- `--package fragenkatalog`
- Problem: „Viele Punkte des Firmenkontexts sind unbelegt oder widerspruechlich und nur mit Wissen aus dem
  Team zu klaeren."
- Ziel dahinter: „Ein spaeteres Interview oder eine Befragung schliesst die Luecken gezielt und ohne Vorarbeit."
- Endzustand: „fragen/FRAGENKATALOG.md formuliert jede offene Luecke aus Recherche, Faktenbasis und
  OFFENE-FRAGEN.md als konkrete Frage mit Begruendung, Bedarf, vermutlichem Wissenstraeger, Antwortform und
  Herkunft, sortiert nach Wirkung, und der Owner hat ihn freigegeben."
- Context: „Eingaben: docs/packages/firmenkontext-recherche/design/recherche/luecken.md,
  design/recherche/faktenbasis/*.md (Abschnitte Offen und Arbeitsstand), OFFENE-FRAGEN.md,
  design/owner-entscheidungen.md (schon Beantwortetes weglassen). Format je Frage: ## FR<n>: <Thema>, darunter
  - Frage:, - Warum wichtig:, - Wer braucht es:, - Wer weiss es vermutlich: (nur Rolle, kein Name ohne
  offizielle Nennung), - Antwortform:, - Herkunft:. Das Interview selbst ist nicht Teil des Pakets."
- Anforderungen:
  1. „fragen/FRAGENKATALOG.md formuliert jede offene Luecke als Frage mit allen Pflichtfeldern, sortiert nach Wirkung."
  2. „Der Owner hat den Fragenkatalog freigegeben."
- `--leaf "leaf-fragen=fragen/**"`
- Pruefpunkte: L1 `node checks/check-folge.mjs fragen` → `FRAGEN-OK`; G1 manuell.

## Was „Auslieferung" meinte (zur Einordnung, kein Auftrag)

Gemeint war: Social-Media-Board, CRM und andere Systeme laden den Firmenkontext automatisch in der jeweils
aktuellen Version aus GitHub, statt Kopien zu pflegen. Das ist nicht beauftragt. Nicht bauen; nur als offenen
Punkt in `ROADMAP.md` fuehren.
