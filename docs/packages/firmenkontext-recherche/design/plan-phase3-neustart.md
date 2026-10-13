# Plan: Phase 3 nach dem Limit-Reset fortsetzen

Stand 13.10.2026, 16:50. Session-Limit-Reset: 03:00 Europe/Berlin.

## Ausgangslage

1. Lauf `wf_cec5ce93-6b8` (Synthese, Phase 3). Fertig sind 5 Schreiber: identitaet, vision, mission, werte, zielgruppen. Sie liegen im Journal und im Cache.
2. Offen sind 8 Schreiber (projekte-angebot, markensprache, visuelle-identitaet, kanaele-formate, glossar, themenfelder, anknuepfungspunkte, sonstiges), alle 13 Gegenprüfer und die Fragen-Stufe.
3. Das Skript `design/werkzeuge/synthese-workflow.js` ist angepasst: Schreiber der fünf fertigen Kapitel laufen auf sonnet, die übrigen Schreiber auf haiku, Gegenprüfer auf sonnet, Fragen auf haiku.

## Startbefehl

Workflow-Werkzeug mit:

- scriptPath: /Users/benknaute/Claude/Projects/Keel-Harness/user-projects/wee-firmenkontext/docs/packages/firmenkontext-recherche/design/werkzeuge/synthese-workflow.js
- args: {"modell": "sonnet", "modell_schreiber": "haiku"}
- resumeFromRunId: wf_cec5ce93-6b8

Vorher prüfen: Es läuft kein anderer Synthese-Lauf. Der Retry `wsj2to686` ist abgeschlossen.

## Modelle je Agent

1. Schreiber identitaet, vision, mission, werte, zielgruppen: sonnet (Cache, Optionen unverändert)
2. Schreiber projekte-angebot, markensprache, visuelle-identitaet, kanaele-formate, glossar, themenfelder, anknuepfungspunkte, sonstiges: haiku
3. Gegenprüfer alle 13 Kapitel: sonnet
4. Fragen-Stufe: haiku

## Abnahme nach dem Lauf

1. `ls design/recherche/faktenbasis | wc -l` ergibt 14 (13 Kapitel plus OFFENE-FRAGEN-ENTWURF.md).
2. Im Journal `wf_cec5ce93-6b8/journal.jsonl` gibt es keine Einträge vom Typ `failed` aus dem Lauf nach dem Reset.
3. Jede Faktenbasis-Datei hat die Abschnitte Gesichert, Eine Quelle, Arbeitsstand, Offen, Entfernt.

## Danach

Phase 4: Owner-Fragen über AskUserQuestion, höchstens vier je Aufruf, Antworten wörtlich nach design/owner-entscheidungen.md. Dazu die E2-Fragen zu Einstufung und Anknüpfungspunkten.
