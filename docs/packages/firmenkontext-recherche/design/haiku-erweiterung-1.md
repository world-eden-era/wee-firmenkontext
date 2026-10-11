# Erweiterung 1 zum Haiku-Auftrag

Gilt zusaetzlich zu `haiku-auftrag.md`; bei Widerspruch hat diese Datei Vorrang. Geschrieben am
11.10.2026 gegen 18:05 von der Planungssitzung, waehrend Phase 1 schon lief. Wortlaut des Owners:
`design/owner-auftrag-themen.txt`.

## Was der Owner zusaetzlich will

1. **Strenge Relevanz:** Fuer jede Quelle ausdruecklich festhalten, ob sie wirklich fuer World Eden
   Era und den Firmenkontext zaehlt. Leons Website-Labor, die alte Seite, das Vorgaenger-Repo und
   Nebenprojekte duerfen keine Aussage allein tragen.
2. **Thematischer Kontext:** neues Kapitel `kontext/11-themenfelder.md` (Themen, in denen WEE arbeitet,
   und wie WEE sie behandelt).
3. **Offene Tueren:** neues Kapitel `kontext/12-anknuepfungspunkte.md` (Richtungen, die der Kontext
   offen laesst: Content-Themen, Formate, Kooperationen, Projekte, Zielgruppen, Foerderung, Regionen;
   je belegt, mit Status bestaetigt oder offen).

## Was die Planungssitzung schon geaendert hat (nicht zuruecknehmen)

Geaendert zwischen 17:45 und 18:05, gesichert im Commit „Erweiterung 1: Relevanz, Themenfelder, Anknuepfungspunkte":
- `design/werkzeuge/check-befunde.mjs`: kennt die Kapitel `themenfelder` und `anknuepfungspunkte` und prueft
  `wee_bezug` und `relevanz_begruendung`, wenn sie vorhanden sind. Alte Befunddateien bleiben gruen.
- `design/werkzeuge/recherche-workflow.js`: verlangt bei Neulaeufen (z. B. `nur`) `wee_bezug` und die neuen Kapitel.
- `design/werkzeuge/befunde-nach-kapitel.mjs`, `synthese-workflow.js`: 13 Kapitel; Randquellen kommen
  nach Arbeitsstand, Quellen ohne WEE-Bezug nach Entfernt.
- Neu: `design/werkzeuge/nachlauf-pakete.mjs` und `nachlauf-workflow.js` (Schritt E1).
- `checks/check-firmenkontext.mjs`: neue Modi `themen`, `tueren`, `relevanz`; Tabellenkoepfe zaehlen nicht mehr
  als Aussage. Die alten Modi bleiben gleich.
- `design/arbeitsanweisung.md`: Arbeitsschritt schreibt zusaetzlich `quellen/RELEVANZ.md`, nicht Kapitel 11 und 12.
- In `wee-drive-struktur`: `checks/check-struktur.mjs` erlaubt Begruendungen mit Kapitel 11 und 12.

## E1: Nachlauf, direkt nach Phase 1 und vor Phase 2

Phase 1 laeuft mit dem alten Skript weiter, nichts abbrechen. Danach:

1. `node /Users/benknaute/Claude/Projects/Keel-Harness/user-projects/wee-firmenkontext/docs/packages/firmenkontext-recherche/design/werkzeuge/nachlauf-pakete.mjs`
   gibt eine JSON-Liste der Nachlauf-Pakete aus.
2. Workflow-Werkzeug mit
   `scriptPath: /Users/benknaute/Claude/Projects/Keel-Harness/user-projects/wee-firmenkontext/docs/packages/firmenkontext-recherche/design/werkzeuge/nachlauf-workflow.js`
   und `args: {"modell": "<MODELL-RECHERCHE>", "pakete": <JSON aus Schritt 1>}`. Die Agenten lesen nur
   vorhandene Befunde und Auszuege (keine neuen Abrufe). Sie stufen jede Quelle ein und belegen Themenfelder
   und Anknuepfungspunkte.
3. `node .../design/werkzeuge/check-befunde.mjs --alle` muss mit `BEFUNDE-OK` beginnen.
4. Melde dem Owner:
   - die Zahl der Quellen je Stufe (kern, unterstuetzend, randstaendig, kein)
   - die Liste aller Quellen mit „randstaendig" oder „kein", je mit Name und Begruendung in einer Zeile

Dann weiter mit Phase 2. Die Faktenbasis hat jetzt 13 Dateien.

## E2: Zusaetzliche Fragen in Phase 4

1. Einstufung: „Moechtest du eine dieser Einstufungen aendern?" (Liste aus E1, Schritt 4).
2. Anknuepfungspunkte: Zeige die Zeilen aus `faktenbasis/anknuepfungspunkte.md`. Frage je Richtung, ob der
   Owner sie **bestaetigt** (WEE will das verfolgen) oder sie **offen** bleibt. Hoechstens 4 je Aufruf.
Antworten wie gewohnt woertlich nach `design/owner-entscheidungen.md`.

## E3: Neues Paket `firmenkontext-themen`, nach Phase 6 und vor Phase 7

Erst, wenn `firmenkontext-recherche` geschlossen ist.

1. Paket anlegen (eigene Sitzungskennung):
   ```bash
   node /Users/benknaute/Claude/Projects/Keel-Harness/.claude/skills/package-standard/package-standard.mjs create --root /Users/benknaute/Claude/Projects/Keel-Harness/user-projects/wee-firmenkontext --package firmenkontext-themen --session <eigene Sitzungskennung> \
    --problem "Der Firmenkontext beschreibt noch nicht den thematischen Kontext von World Eden Era und nicht, in welche Richtungen dieser Kontext Tueren offen laesst; die Relevanz jeder Quelle fuer WEE ist nicht ausdruecklich festgehalten." \
    --intent "KI-Systeme kennen die Themenfelder von WEE, wie WEE sie behandelt, und die belegten moeglichen Richtungen, und stuetzen sich nur auf Quellen mit echtem WEE-Bezug." \
    --goal "kontext/11-themenfelder.md und kontext/12-anknuepfungspunkte.md sind belegt und vom Owner freigegeben, FIRMENKONTEXT.md fasst beide zusammen, quellen/RELEVANZ.md stuft jede Quelle nach WEE-Bezug ein, und keine Aussage stuetzt sich allein auf Randquellen oder Quellen ohne WEE-Bezug." \
    --scope-in "Kapitel 11 und 12, Abschnitte Themenfelder und Anknuepfungspunkte in FIRMENKONTEXT.md, quellen/RELEVANZ.md, noetige Registereintraege, Korrekturen an Kapitel 1 bis 10, wo die Relevanzpruefung es verlangt" \
    --scope-out "Drive-Struktur; neue Recherche ausserhalb der vorhandenen Befunde; Aenderungen im Drive; checks/" \
    --context "Eingaben: design/recherche/faktenbasis/themenfelder.md und anknuepfungspunkte.md, design/recherche/kapitel/_quellen.json (wee_bezug), design/owner-entscheidungen.md. Form wie design/arbeitsanweisung.md. Kapitel 12 als Tabelle | Richtung | Art | Grundlage | Status | mit Status bestaetigt oder offen (Owner-Entscheidung aus Phase 4)." \
    --step "Kapitel 11 und 12 aus der Faktenbasis schreiben" --step "quellen/RELEVANZ.md schreiben und Kapitel 1 bis 10 gegen die Relevanz pruefen" --step "Owner-Freigabe einholen" \
    --requirement "kontext/11-themenfelder.md beschreibt die fachlichen Themenfelder von WEE und wie WEE sie behandelt, jede Aussage mit Registerverweis, und FIRMENKONTEXT.md hat den Abschnitt Themenfelder." \
    --requirement "kontext/12-anknuepfungspunkte.md listet die Richtungen, die der Kontext offen laesst, je mit Art, Grundlage mit Registerverweis und Status bestaetigt oder offen, und FIRMENKONTEXT.md hat den Abschnitt Anknuepfungspunkte." \
    --requirement "quellen/RELEVANZ.md stuft jede Registerquelle nach WEE-Bezug ein (kern, unterstuetzend, randstaendig, kein) mit Begruendung, und keine Aussage im Firmenkontext stuetzt sich allein auf Randquellen oder auf Quellen ohne WEE-Bezug." \
    --requirement "Der Owner hat beide Kapitel und die Einstufung der Quellen freigegeben." \
    --leaf "leaf-themen=kontext/**,FIRMENKONTEXT.md,quellen/**,OFFENE-FRAGEN.md" \
    --owner-request-file /Users/benknaute/Claude/Projects/Keel-Harness/user-projects/wee-firmenkontext/docs/packages/firmenkontext-recherche/design/owner-auftrag-themen.txt \
    --harness-root /Users/benknaute/Claude/Projects/Keel-Harness --json
   ```
2. Pruefpunkte nachtragen, solange die Planung offen ist (so wie in Phase 7, Schritt 4):
   - `gates/leaf-themen.md`, jeweils mit `CWD: .`:
     - L1: `CHECK: node checks/check-firmenkontext.mjs themen`, `EXPECT: THEMEN-OK`
     - L2: `CHECK: node checks/check-firmenkontext.mjs tueren`, `EXPECT: TUEREN-OK`
     - L3: `CHECK: node checks/check-firmenkontext.mjs relevanz`, `EXPECT: RELEVANZ-OK`
     - Darunter die `MODEL:`-Zeile nach MODELL-SYNTHESE.
   - `GATES.md`: Die Freigabe-Anforderung bekommt
     `Manuell: Owner gibt Kapitel 11, Kapitel 12 und quellen/RELEVANZ.md im Chat frei; Beleg evidence/owner-freigabe.md`.
     Steht C4 in `PACKAGE.md` noch auf dem Leaf, stellst du es auf `GATES.md:G1` um.
3. `doctor` muss `OK` melden. Den Startwunsch des Owners holst du mit einer Frage ein, dann
   schreibst du die `Owner-Start`-Zeile, fuehrst `plan` aus und committest.
4. Ausfuehren und abschliessen wie in Phase 5 und 6: Leaf-Sitzung `themen-1`, Welle `wave-1`,
   ID `firmenkontext-themen`. Der Arbeitsagent liest Auftrag und Kontext aus OWNER.md und PACKAGE.md.

## E4: Phase 7 und 8

Begruendungen in `struktur/ordner.json` duerfen jetzt auch auf `kontext/11-themenfelder.md` und
`kontext/12-anknuepfungspunkte.md` zeigen. Der Arbeitsagent nutzt bestaetigte Anknuepfungspunkte als
Grund fuer Ordner. Offene Anknuepfungspunkte bekommen keinen eigenen Ordner.
