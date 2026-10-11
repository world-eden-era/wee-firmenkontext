# Auftrag: Firmenkontext und Drive-Struktur für World Eden Era

Du bist der Orchestrator. Du führst diesen Auftrag Phase für Phase aus, genau in der
Reihenfolge, und hältst dich wörtlich an die Befehle. Du denkst nicht neu nach, wo dieser
Auftrag schon entschieden hat. Wo etwas fehlt oder nicht passt: anhalten und den Owner fragen.

**Erweiterung 1 gilt zusaetzlich:** `design/haiku-erweiterung-1.md` (Relevanz, Themenfelder,
Anknuepfungspunkte; Nachlauf nach Phase 1, neues Paket nach Phase 6). Lies sie vor Phase 2.

Geschrieben am 11.10.2026 von der Planungssitzung (Opus). Alle Pfade, Commits und Befehle
waren an diesem Tag geprüft.

## Kurzfassung

- **Problem:** Die KI-Systeme von World Eden Era (WEE), also Social-Media-Board und internes CRM,
  haben keinen einheitlichen, belegten Firmenkontext. Die Drive-Ablage ist weder aus ihm
  abgeleitet noch in GitHub dokumentiert.
- **Ziel dahinter:** Jedes KI-System liest Markensprache, Vision, Mission, Werte und Ausrichtung
  aus einer einzigen Quelle in GitHub. Der Admin-Account `info@world-eden-era.org` baut die
  Drive-Ablage aus einer Spezifikation in GitHub nach.
- **Prüfbarer Endzustand:**
  1. `world-eden-era/wee-firmenkontext` enthält zehn belegte Kapitel plus Kurzfassung, vom Owner
     freigegeben, Paket `firmenkontext-recherche` geschlossen.
  2. `world-eden-era/wee-drive-struktur` enthält eine aus dem Firmenkontext abgeleitete
     Ordnerstruktur, einen Abgleich mit der alten Ablage und eine Nachbau-Anleitung für `info@`.
     Beide Pakete sind geschlossen.
  3. Die geteilte Drive-Ablage ist unverändert. Es gibt keine neue Ablage.

## Feste Werte

| Name | Wert |
|---|---|
| H (Harness) | `/Users/benknaute/Claude/Projects/Keel-Harness` |
| FK (Repo Firmenkontext) | `/Users/benknaute/Claude/Projects/Keel-Harness/user-projects/wee-firmenkontext`, Remote `world-eden-era/wee-firmenkontext` |
| DS (Repo Drive-Struktur) | `/Users/benknaute/Claude/Projects/Keel-Harness/user-projects/wee-drive-struktur`, Remote `world-eden-era/wee-drive-struktur` |
| PKG | `FK/docs/packages/firmenkontext-recherche` |
| Recherche-Ordner | `PKG/design/recherche` |
| Drive-Textkopie | `FK/.recherche-cache/drive/text` (182 Dateien, git-ignoriert), Liste `FK/.recherche-cache/drive/lesepakete.json` (26 Lesepakete) |
| Drive-Zugang | rclone-Remote `wee-drive`, Scope `drive.readonly`, geteilte Ablage `0AEfqsTjbSPXxUk9PVA`, Konto `benknaute@world-eden-era.org` |
| Owner | Ben Knaute (alleiniger Owner, gibt alle OKs) |
| Executor | `node H/harness-core/execution/package-executor.mjs <befehl> --harness-root H --root <REPO> --package <ID> --scope <ID> ...` |

Setze H, FK, DS und PKG in jedem Befehl als ausgeschriebenen Pfad ein. Shell-Variablen bleiben
zwischen Bash-Aufrufen nicht erhalten.

## Harte Regeln

1. **Nichts raten, nichts annehmen.** Jede Aussage im Firmenkontext stützt sich auf ein
   wörtliches Zitat aus einer Quelle. Was nicht belegt ist, wird eine Frage an den Owner.
2. **Drive nur lesen.** Inhalte kommen aus der Drive-Textkopie, bei Bedarf über `wee-drive`
   (nur lesend). Nie in Drive schreiben, keine neue Ablage anlegen, keine Daten verschieben.
   Die Datenmigration macht der Admin-Account.
3. **Alte Ablagestruktur tabu bis Phase 8.** Vorher nie öffnen oder auswerten: das Repo
   `world-eden-era/wee-drive-management`, Ordnerlisten des alten Drives, `AGENTS.md`-Ablageregeln,
   die Drive-Inventur. Die neue Struktur entsteht unabhängig davon.
4. **Datenschutz.** Namen und Rollen nur so, wie WEE sie offiziell nennt. Keine privaten
   Kontaktdaten, Bank-, Spender-, Vertrags-, Gehalts- oder Gesundheitsdaten. In GitHub landet
   nur, was für den Firmenkontext nötig ist.
5. **GitHub.** Pushen nur nach ausdrücklichem „ja, pushen" des Owners. Nie etwas auf GitHub
   löschen oder überschreiben, nie `--force`.
6. **Harness.** Die Ergebnisdateien eines Pakets schreibt nur dessen Arbeitsagent über den
   Executor. Du als Orchestrator schreibst nur `design/` und `evidence/` des Pakets sowie
   Commits. Pakete entstehen nur mit `package-standard.mjs create`.
7. **Kontext sparen.** Du liest große Quellen nie selbst. Lesen und Schreiben übernehmen
   Unteragenten über die fertigen Workflow-Skripte. Du liest nur deren Rückgaben und die
   Ausgaben der Prüfskripte.
8. **Sicherheitswächter.** Blockiert ein Aufruf mit `[Fact-Forcing Gate]`, nenne die verlangten
   Fakten in 3 bis 4 kurzen Zeilen (wer ruft die Datei auf, gibt es eine ähnliche, Datenformat,
   wörtlicher Auftrag des Owners). Danach wiederholst du denselben Aufruf unverändert. Den
   Wächter schaltest du nie ab.
9. **Nutzungsgrenze.** Melden Agenten „session limit" oder „hit your limit", ist das kein Fehler
   im Auftrag. Halte an, nenne dem Owner die Uhrzeit des Zurücksetzens und setze danach mit
   `resumeFromRunId` fort. Fertige Agenten kommen dann aus dem Zwischenspeicher.
10. **Berichtsform.** Deutsch, kurz, Ergebnis zuerst. Jede Abschlussmeldung endet mit den Zeilen
    `Geprueft gegen:` und `Offen:`, beide als Liste untereinander. Bei jedem offenen Punkt
    steht, wer dran ist: ICH, DEINE ENTSCHEIDUNG oder DEINE HANDLUNG.

## Stand am 11.10.2026

- `FK`, Branch `main`, lokale Commits noch nicht gepusht:
  - `2c9476b` Repo angelegt
  - `c2bf925` Prüfskript `checks/check-firmenkontext.mjs`
  - `e6dea56` Paket angelegt
  - `288896b` Typ `owner` erlaubt
  - `0a798f8` Werkzeuge, dieser Auftrag, Roadmap
  - ein letzter Commit „haiku-auftrag: Commit-Stand nachgetragen“
- `DS`, Branch `main`, lokale Commits: `4d1d706`, `754be44`, `c616a59` (Prüfskript
  `checks/check-struktur.mjs`, Roadmap).
- Paket `firmenkontext-recherche` (in FK):
  - Status: geplant, nicht gestartet. Die Zeile `Owner-Start: 2026-10-11 "Los gehts"` steht.
  - Ein Arbeitsschritt `leaf-firmenkontext`. OWNS: `quellen/**`, `kontext/**`, `FIRMENKONTEXT.md`,
    `OFFENE-FRAGEN.md`.
  - Gates: L1 `node checks/check-firmenkontext.mjs quellen` → `QUELLEN-OK`; L2 `... kapitel` →
    `KAPITEL-OK`; L3 `... belege` → `BELEGE-OK`; G1 manuell (Owner-Freigabe aller Kapitel,
    Beleg `evidence/owner-freigabe.md`); G2 prüft, dass `wee-drive` nur lesend ist → `NUR-LESEN`.
  - Orchestrator ist noch die Planungssitzung `0feca1eb-8160-45a4-9c45-efd31f554a47`. Du
    übernimmst in Phase 5.
- Fertige Werkzeuge in `PKG/design/werkzeuge/`:
  - `recherche-workflow.js`: Phase 1, 37 Rechercheagenten mit Selbstprüfung, Reparatur und
    Lückenprüfer
  - `check-befunde.mjs`: lehnt jedes Zitat ab, das nicht wörtlich im Auszug steht
  - `befunde-nach-kapitel.mjs`: sortiert alle Befunde je Kapitel
  - `synthese-workflow.js`: Phase 3, je Kapitel Schreiber plus Gegenprüfer, dazu die
    offenen Fragen
- `PKG/design/arbeitsanweisung.md`: verbindliche Form für den Arbeitsagenten
  (Registerformat, Kapitelform, Regeln).
- `PKG/design/social/instagram-2026-10-11.md`: Instagram-Rohdaten (12 von 21 Beiträgen,
  ohne Login).
- Website-Repo geprüft: `BenWEE-cell/world-eden-era` ist die Live-Website. Der lokale Klon
  `H/user-projects/wee-website-v2` steht auf deren `main` vom 09.10.2026 (`2ed0948`).
  `benni-cmd/WEE-Website-V2` ist der Vorgänger mit Stand 19.08.2026.
- Die ersten Rechercheläufe sind an der Nutzungsgrenze gescheitert. Es gibt noch keine Befunde,
  der Ordner `PKG/design/recherche/` existiert nicht.

## Modellwahl

Der Startprompt des Owners nennt `MODELL-RECHERCHE` und `MODELL-SYNTHESE`. Ohne Angabe gilt
`haiku` für die Recherche und `sonnet` für Synthese und Schreiben. Das Modell gibst du den
Workflows als `args.modell` mit. Dem Arbeitsagenten gibst du es als `--model` mit: `haiku` →
`claude-haiku-5-5`, `sonnet` → `claude-sonnet-5-5`.

---

## Phase 0: Stand prüfen (keine Änderungen)

Führe aus und vergleiche mit „Stand am 11.10.2026". Bei einer Abweichung: anhalten und den
Owner fragen.

```bash
git -C /Users/benknaute/Claude/Projects/Keel-Harness/user-projects/wee-firmenkontext log --oneline | head -8
git -C /Users/benknaute/Claude/Projects/Keel-Harness/user-projects/wee-firmenkontext status --short
git -C /Users/benknaute/Claude/Projects/Keel-Harness/user-projects/wee-drive-struktur log --oneline | head -5
node /Users/benknaute/Claude/Projects/Keel-Harness/vendor/unlazy/scripts/package-cli.mjs doctor --root /Users/benknaute/Claude/Projects/Keel-Harness/user-projects/wee-firmenkontext --package firmenkontext-recherche
rclone config show wee-drive | grep -E '^(scope|team_drive) ='
ls /Users/benknaute/Claude/Projects/Keel-Harness/user-projects/wee-firmenkontext/.recherche-cache/drive/text | wc -l
gh auth status 2>&1 | grep -E 'Logged in|scopes'
```

Erwartet:
- `doctor` meldet `OK`.
- rclone zeigt `scope = drive.readonly` und `team_drive = 0AEfqsTjbSPXxUk9PVA`.
- Die Textkopie hat 182 Dateien.
- gh ist als `BenWEE-cell` angemeldet.

Fehlt die rclone-Einstellung: Der Owner führt einmal aus
`rclone config create wee-drive drive scope=drive.readonly team_drive=0AEfqsTjbSPXxUk9PVA`,
meldet sich im Browser mit `benknaute@world-eden-era.org` an und klickt „Zulassen".

## Phase 1: Recherche (Workflow, nur lesend)

1. Starte das Workflow-Werkzeug mit
   `scriptPath: /Users/benknaute/Claude/Projects/Keel-Harness/user-projects/wee-firmenkontext/docs/packages/firmenkontext-recherche/design/werkzeuge/recherche-workflow.js`
   und `args: {"modell": "<MODELL-RECHERCHE>"}`.
2. Warte auf die Fertigmeldung. Prüfe nicht zwischendurch.
3. Gibt es Agenten unter `rot`: Starte denselben Workflow neu mit
   `args: {"modell": "<MODELL-RECHERCHE>", "nur": [<die roten Namen>]}`. Höchstens zwei Runden.
   Bleibt danach etwas rot, nenne es dem Owner mit der letzten Prüfzeile.
4. Endprüfung:
   `node /Users/benknaute/Claude/Projects/Keel-Harness/user-projects/wee-firmenkontext/docs/packages/firmenkontext-recherche/design/werkzeuge/check-befunde.mjs --alle`
   Muss mit `BEFUNDE-OK` beginnen. Die Zahlen je Kapitel notierst du für den Bericht.
5. Fehlt `PKG/design/recherche/luecken.md` (zum Beispiel weil Schritt 3 mit `nur` lief):
   Starte den Workflow ein letztes Mal ohne `nur`. Fertige Agenten kommen aus dem
   Zwischenspeicher, wenn du `resumeFromRunId` des letzten vollen Laufs mitgibst.

Abnahme: `BEFUNDE-OK` und `luecken.md` vorhanden. Melde dem Owner in drei Zeilen:
Quellenzahl, Befunde je Kapitel, rote Agenten.

## Phase 2: Befunde je Kapitel sortieren

```bash
node /Users/benknaute/Claude/Projects/Keel-Harness/user-projects/wee-firmenkontext/docs/packages/firmenkontext-recherche/design/werkzeuge/befunde-nach-kapitel.mjs
```

Erwartet ist eine Zeile `KAPITEL-SORTIERT ...`. Hat ein Kapitel 0 Befunde, notiere es als
Lücke für Phase 4.

## Phase 3: Faktenbasis und Gegenprüfung (Workflow)

1. Workflow-Werkzeug mit
   `scriptPath: /Users/benknaute/Claude/Projects/Keel-Harness/user-projects/wee-firmenkontext/docs/packages/firmenkontext-recherche/design/werkzeuge/synthese-workflow.js`
   und `args: {"modell": "<MODELL-SYNTHESE>"}`.
2. Abnahme: elf Dateien `PKG/design/recherche/faktenbasis/<kapitel>.md` und
   `faktenbasis/OFFENE-FRAGEN-ENTWURF.md`. Fehlt ein Kapitel, starte den Workflow mit
   `resumeFromRunId` neu.

## Phase 4: Owner-Entscheidungen einholen

1. Lies `faktenbasis/OFFENE-FRAGEN-ENTWURF.md`.
2. Stelle die Fragen mit dem Werkzeug AskUserQuestion: höchstens 4 Fragen je Aufruf, wichtigste
   zuerst, Optionen aus dem Entwurf. Jede Frage nennt kurz die Quellen.
3. Diese drei Fragen stellst du immer mit:
   - Die 9 älteren Instagram-Beiträge: erfassen (dann loggt sich der Owner im Browser bei
     Instagram ein) oder weglassen?
   - Gehören Namen und Rollen von Teammitgliedern in den Firmenkontext? Optionen: alle offiziell
     genannten / nur Gründer / keine.
   - Sollen die lokalen Commits beider Repos jetzt auf GitHub gepusht werden?
4. Schreibe jede Antwort wörtlich nach `PKG/design/owner-entscheidungen.md`, je Frage ein Block:
   ```
   ## F<n>: <Thema>
   - Frage: <Wortlaut der Frage>
   - Antwort des Owners (YYYY-MM-DD): "<wörtliche Antwort>"
   ```
5. Sagt der Owner „ja, pushen": `git -C <REPO> push -u origin main` für FK und DS. Nie mit
   `--force`.
6. Sichere `design/` mit einem Commit in FK:
   `git -C FK add docs/packages/firmenkontext-recherche/design && git -C FK commit -m "firmenkontext-recherche: Recherche, Faktenbasis und Owner-Entscheidungen"`.
   Die Commit-Nachricht endet mit der Zeile `Co-Authored-By: Claude Haiku 5.5 <noreply@anthropic.com>`.

## Phase 5: Arbeitsagent schreibt Register, Kapitel und Kurzfassung

Leaf-Sitzung `firmenkontext-1`, Welle `wave-1`. REPO = FK, ID = `firmenkontext-recherche`.

1. Start (aktiviert das Paket und bereitet den Arbeitsschritt vor):
   ```bash
   node /Users/benknaute/Claude/Projects/Keel-Harness/harness-core/execution/package-executor.mjs start --harness-root /Users/benknaute/Claude/Projects/Keel-Harness --root /Users/benknaute/Claude/Projects/Keel-Harness/user-projects/wee-firmenkontext --package firmenkontext-recherche --scope firmenkontext-recherche --session firmenkontext-1 --leaf leaf-firmenkontext --provider claude --model <claude-sonnet-5-5|claude-haiku-5-5> --effort high --json
   ```
2. Übernahme der Orchestrierung (gleicher Präfix bis `--scope firmenkontext-recherche`):
   `orchestrator-takeover --reason "Owner hat die Ausfuehrung am 11.10.2026 an eine neue Sitzung uebergeben" --json`.
   Bei `ORCHESTRATOR_ACTIVE` war die Planungssitzung vor weniger als 30 Minuten aktiv: warte
   und versuche es erneut.
3. Starten: `dispatch --wave wave-1 --session firmenkontext-1 --cost-budget-usd 20 --json`.
4. Warten: Führe im Hintergrund (run_in_background) aus
   ```bash
   until node /Users/benknaute/Claude/Projects/Keel-Harness/harness-core/execution/package-executor.mjs liveness --harness-root /Users/benknaute/Claude/Projects/Keel-Harness --root /Users/benknaute/Claude/Projects/Keel-Harness/user-projects/wee-firmenkontext --package firmenkontext-recherche --scope firmenkontext-recherche --session firmenkontext-1 --json | grep -qE 'provider-returned|hung|budget-reached|repeated-block|returned-unchanged|provider-failed'; do sleep 60; done
   ```
   Die Meldung, dass der Befehl endet, holt dich zurück.
5. Rücklauf: `return --session firmenkontext-1 --json`. Er prüft L1 bis L3 an einem eigenen
   Commit-Stand.
   - Grün: weiter mit Schritt 6.
   - Rot: lies die Fehlerzeilen. Dann
     `resume --session firmenkontext-1 --message "<Fehlerzeilen woertlich, Auftrag: beheben>" --json`,
     danach weiter bei Schritt 4. Höchstens drei Runden, danach den Owner fragen.
   - `hung` oder `budget-reached`: `resume --session firmenkontext-1 --json`.
6. Prüfe selbst die Wirkung, nicht nur die Prüfskripte. Öffne `FK/FIRMENKONTEXT.md` und
   `FK/kontext/07-markensprache.md` und prüfe zwei zufällige Verweise `[Qnnn]` gegen
   `FK/quellen/auszuege/Qnnn.md`. Steht dort nicht, was behauptet wird, geht es zurück an
   Schritt 5 mit `resume`.

## Phase 6: Owner-Freigabe, Integration, Abschluss

1. Zeige dem Owner:
   - die vollständige `FIRMENKONTEXT.md` wörtlich
   - eine Liste der zehn Kapitel mit Dateipfad und dem jeweiligen Abschnitt „Kurz"
   - die übrigen `OFFENE-FRAGEN.md`

   Frage je Kapitel: freigeben oder ändern (was genau)?
2. Änderungswünsche: Schreibe sie wörtlich nach `design/owner-entscheidungen.md`. Dann
   `resume --session firmenkontext-1 --message "<Wunsch woertlich>" --json` und Phase 5 ab
   Schritt 4.
3. Sind alle Kapitel freigegeben: Schreibe `PKG/evidence/owner-freigabe.md` mit Datum, der
   Liste der Kapitel und den wörtlichen Freigaben des Owners. Danach (eigene Sitzungskennung mit
   `echo $CLAUDE_CODE_SESSION_ID`):
   `review-manual --gate GATES.md:G1 --evidence evidence/owner-freigabe.md --session <eigene Sitzungskennung> --json`.
4. Integration: `integrate --approve-checks --json`. Prüft L1 bis L3, G1 und G2. Muss grün sein.
5. Abschluss: Der Owner sagt im Chat OK, du fragst nicht nach einer Satzform. Dann
   `close --owner-ok "<Owner-Nachricht woertlich>" --json`. Bei mehrzeiliger Nachricht schreibe
   sie in eine Datei und nimm `--owner-ok-file <Datei>`.
6. Pushen nur nach „ja, pushen": `git -C FK push origin main`.

## Phase 7: Paket `drive-struktur-entwurf` (Repo DS, ohne die alte Ablage)

1. Frage den Owner (AskUserQuestion): „Soll `wee-drive-struktur` nur eine Nachbau-Anleitung für
   `info@` enthalten, oder zusätzlich ein Skript, das die Ordner automatisch per rclone anlegt?"
   Optionen: „nur Anleitung" / „Anleitung plus Skript".
2. Lege die Owner-Datei an. Sie enthält den Originalauftrag und die Antwort aus Schritt 1:
   ```bash
   sed -n '/^## Original request/,/<!-- owner-end -->/p' /Users/benknaute/Claude/Projects/Keel-Harness/user-projects/wee-firmenkontext/docs/packages/firmenkontext-recherche/OWNER.md | sed '1d;$d' > /tmp/owner-ds.txt
   ```
   Danach hängst du die Antwort aus Schritt 1 wörtlich mit Datum an `/tmp/owner-ds.txt` an.
3. Paket anlegen (eigene Sitzungskennung als PLANER):
   ```bash
   node /Users/benknaute/Claude/Projects/Keel-Harness/.claude/skills/package-standard/package-standard.mjs create --root /Users/benknaute/Claude/Projects/Keel-Harness/user-projects/wee-drive-struktur --package drive-struktur-entwurf --session <eigene Sitzungskennung> \
    --problem "Die Drive-Ablage von World Eden Era ist nicht aus dem aktuellen Firmenkontext abgeleitet und nicht in GitHub dokumentiert." \
    --intent "Der Admin-Account info@world-eden-era.org baut die Ablage aus einer dokumentierten Spezifikation in GitHub nach, ohne Hin und Her im Drive." \
    --goal "struktur/ordner.json beschreibt eine allein aus dem freigegebenen Firmenkontext abgeleitete Ordnerstruktur mit Zweck und Kapitelbegruendung je Ordner, README.md und NACHBAU.md erklaeren Nutzung und Nachbau durch info@, der Owner hat den Entwurf freigegeben, und der Drive blieb unveraendert." \
    --scope-in "Ordnerstruktur aus world-eden-era/wee-firmenkontext ableiten; struktur/ordner.json; README.md; NACHBAU.md" \
    --scope-out "Alte Ablage, Repo wee-drive-management und Drive-Inventur (erst im Paket drive-struktur-abgleich); jede Aenderung im Drive; neue Ablage; Datenmigration (macht info@); checks/" \
    --context "Format und Pruefung: checks/check-struktur.mjs (Modus struktur). Begruendungen verweisen auf kontext/NN-<name>.md im Repo wee-firmenkontext. Owner-Entscheidung zu Anleitung oder Skript steht in OWNER.md." \
    --step "Ordnerstruktur aus den zehn Kapiteln des Firmenkontexts ableiten" --step "struktur/ordner.json, README.md und NACHBAU.md schreiben" --step "Owner-Freigabe einholen" \
    --requirement "Die Ordnerstruktur ist ausschliesslich aus dem freigegebenen Firmenkontext abgeleitet, ohne die alte Ablage anzusehen, und jeder Ordner steht mit Zweck und Kapitelbegruendung in struktur/ordner.json; README.md und NACHBAU.md erklaeren Nutzung und Nachbau durch info@world-eden-era.org." \
    --requirement "Der Owner hat Struktur und Nachbau-Anleitung freigegeben." \
    --requirement "Der Drive bleibt unveraendert; der Drive-Zugang ist technisch auf Lesen begrenzt." \
    --leaf "leaf-struktur=struktur/**,README.md,NACHBAU.md" \
    --owner-request-file /tmp/owner-ds.txt --harness-root /Users/benknaute/Claude/Projects/Keel-Harness --json
   ```
   Bei „Anleitung plus Skript" ergänzt du `,tools/**` im `--leaf` und eine weitere Anforderung:
   „tools/nachbau.mjs legt alle Ordner aus struktur/ordner.json per rclone mkdir an, zeigt mit
   --dry-run nur die Befehle und bestaetigt mit --selbsttest, dass jeder Pfad genau einmal
   vorkommt."
4. Prüfpunkte nachtragen (solange die Planung offen ist):
   - In `gates/leaf-struktur.md` ersetzt du die Manuell-Zeile von L1 durch
     `CHECK: node checks/check-struktur.mjs struktur`, `CWD: .`, `EXPECT: STRUKTUR-OK`.
     Darunter `MODEL: claude claude-sonnet-5-5 high` (oder Haiku nach Modellwahl).
   - Beim Skript bekommt dessen Prüfpunkt `CHECK: node tools/nachbau.mjs --selbsttest`,
     `EXPECT: NACHBAU-OK`.
   - In `GATES.md` bekommt die Freigabe-Anforderung die Zeile
     `Manuell: Owner gibt Struktur und NACHBAU.md im Chat frei; Beleg evidence/owner-freigabe.md`.
   - Die Drive-Anforderung bekommt den Prüfpunkt aus `firmenkontext-recherche/GATES.md` G2,
     wörtlich übernommen (CHECK mit rclone, `EXPECT: NUR-LESEN`). Steht C3 in `PACKAGE.md`
     noch auf dem Leaf, stellst du es auf `GATES.md:G2` um.
5. `node H/vendor/unlazy/scripts/package-cli.mjs doctor --root DS --package drive-struktur-entwurf`
   muss `OK` melden.
6. Den Startwunsch des Owners holst du mit einer Frage im Chat ein. Schreibe dann
   `Owner-Start: YYYY-MM-DD "<Wortlaut>"` in den Abschnitt `## Status` der `PACKAGE.md`, danach
   `node H/harness-core/execution/package-bootstrap.mjs plan --harness-root H --session <eigene Sitzungskennung> --json`.
   Zum Schluss committest du das Paket.
7. Ausführen wie Phase 5 und 6: Leaf-Sitzung `drive-entwurf-1`, Welle `wave-1`, REPO = DS,
   ID = `drive-struktur-entwurf`. Den Auftrag liest der Arbeitsagent aus OWNER.md und PACKAGE.md.
   Ergänze in deiner ersten `resume`-Nachricht oder vor dem `dispatch` nichts.
   Regeln für die Struktur:
   - Jeder Ordner dient einer Tätigkeit, einem Projekt oder einem Kanal aus dem Firmenkontext.
   - Höchstens drei Ebenen.
   - Namen auf Deutsch, Nummernpräfix `NN_` für die oberste Ebene, wenn der Owner das in Phase 4
     nicht anders entschieden hat.
   - Die Owner-Freigabe läuft wie in Phase 6 (`review-manual` für die Freigabe-Anforderung,
     dann `integrate --approve-checks`, dann `close`).

## Phase 8: Paket `drive-struktur-abgleich` (jetzt darf die alte Ablage gelesen werden)

1. Erst nach dem Abschluss von `drive-struktur-entwurf`. Alte Ordner bis Tiefe 2 nur lesend
   erfassen, als Vorschlagsmaterial in `design/` des neuen Pakets (Schritt 3 legt es an):
   ```bash
   rclone lsf -R --dirs-only --max-depth 2 wee-drive: | sed 's#/$##' | sort
   ```
   Lies dazu `gh api repos/world-eden-era/wee-drive-management/contents/drive-konventionen.yaml --jq .content | base64 -d`
   für den Zweck der alten Ordner.
2. Lasse einen Unteragenten (Agent-Werkzeug, Modell nach MODELL-SYNTHESE) einen
   Abgleich-Vorschlag schreiben: `design/abgleich-vorschlag.md` mit je altem Ordner einer Zeile
   `| Alt | Neu | Art | Begruendung |`. Art ist eine von gleich, umbenannt, zusammengelegt,
   aufgeteilt, entfaellt oder neu. Neu sind nur Pfade aus `DS/struktur/ordner.json`.
3. Paket anlegen wie in Phase 7, Schritt 3. Abweichungen:
   - `--package drive-struktur-abgleich`
   - Problem: „Die neue Struktur ist noch nicht mit der bestehenden geteilten Ablage abgeglichen."
   - Ziel dahinter: „info@ weiss fuer jeden alten Ordner, wohin seine Inhalte bei der Migration gehoeren."
   - Endzustand: „abgleich/alt-ordner.txt listet die alten Ordner bis Tiefe 2, ABGLEICH.md ordnet jeden einem neuen Ordner zu oder begruendet den Entfall mit Owner-Entscheidung, struktur/ordner.json ist bei Bedarf angepasst, der Drive blieb unveraendert."
   - Anforderungen:
     1. „Die alten Ordner der geteilten Ablage bis Tiefe 2 stehen nur lesend erfasst in abgleich/alt-ordner.txt."
     2. „ABGLEICH.md ordnet jeden alten Ordner einem neuen Ordner zu oder begruendet den Entfall, je mit Owner-Entscheidung."
     3. „Der Owner hat den Abgleich freigegeben."
     4. „Der Drive bleibt unveraendert; der Drive-Zugang ist technisch auf Lesen begrenzt."
   - `--leaf "leaf-abgleich=abgleich/**,ABGLEICH.md,struktur/**,NACHBAU.md"`
   - Prüfpunkte:
     - L1: `CHECK: test -s abgleich/alt-ordner.txt && echo ALT-ERFASST`, `EXPECT: ALT-ERFASST`
     - L2: `CHECK: node checks/check-struktur.mjs abgleich`, `EXPECT: ABGLEICH-OK`
     - Freigabe manuell
     - Drive-Prüfpunkt wie in Phase 7
4. Vor dem Dispatch: Stelle dem Owner jede Zeile des Vorschlags mit Art ungleich „gleich" zur
   Entscheidung, gebündelt zu höchstens 4 Fragen je Aufruf. Die Antworten schreibst du wörtlich
   nach `design/owner-entscheidungen.md` dieses Pakets. Der Arbeitsagent übernimmt sie in die
   Spalte Entscheidung (Form: `Owner YYYY-MM-DD: <Kurzfassung>`).
5. Ausführen und abschließen wie in Phase 6: Leaf-Sitzung `drive-abgleich-1`.

## Schlussbericht an den Owner

Ergebnis zuerst, dann:

    Geprueft gegen:
    1. <Prüfbefehle mit Ausgabe, z. B. BELEGE-OK, STRUKTUR-OK, ABGLEICH-OK, NUR-LESEN>
    2. <Close-Commits der drei Pakete>
    Offen:
    1. <Punkt> – ICH / DEINE ENTSCHEIDUNG / DEINE HANDLUNG

Danach prüfst du, ob `FK/ROADMAP.md` und `DS/ROADMAP.md` den echten Stand zeigen, und
aktualisierst sie, bevor die Sitzung endet.
