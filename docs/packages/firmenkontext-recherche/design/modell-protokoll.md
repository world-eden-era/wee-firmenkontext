# Modell-Protokoll: wer hat mit welchem Modell gearbeitet

Stand 13.10.2026. Haiku ist das Modell für die erste Ergebnislieferung. Sonnet prüft später nach, wo der Owner es verlangt. Diese Datei hält fest, welche Ergebnisse von Haiku stammen und was Sonnet nachprüfen soll.

## Modellwahl je Stufe

| Stufe | Workflow | Modell | Grund |
|---|---|---|---|
| Phase 1: Recherche (37 Agenten) | recherche-workflow.js, Lauf wf_6fe62b9f-536 | Haiku | Startprompt MODELL-RECHERCHE: haiku. Aufgabe: nur lesen, Zitate belegen. |
| E1: Nachlauf (10 Pakete) | nachlauf-workflow.js, Lauf wf_a1de999e-834 | Haiku | Wie Recherche, Einstufung streng nach Regeln. |
| Phase 3, Schreiber, 5 Kapitel | synthese-workflow.js, Lauf wf_cec5ce93-6b8 (Erstlauf) | Sonnet | Erstlauf vor der Umstellung. Ergebnisse liegen im Cache. |
| Phase 3, Schreiber, 8 Kapitel | synthese-workflow.js, Resume wf_cec5ce93-6b8 (13.10., 17:03) | Haiku | Umstellung wegen Token-Sparen. Anweisung konkret genug. |
| Phase 3, Gegenprüfer, 13 Kapitel | synthese-workflow.js | Sonnet | Qualitätstor, schreibt direkt in die Faktenbasis-Dateien. |
| Phase 3, Fragen-Stufe | synthese-workflow.js | Haiku | Mechanisches Zusammenlegen. |

## Ergebnisse von Haiku, die Sonnet nachprüfen soll

Nach dem Lauf stammen diese Dateien in `design/recherche/faktenbasis/` von Haiku:

1. projekte-angebot.md
2. markensprache.md
3. visuelle-identitaet.md
4. kanaele-formate.md
5. glossar.md
6. themenfelder.md
7. anknuepfungspunkte.md
8. sonstiges.md

Die Gegenprüfung durch Sonnet läuft für alle 13 Kapitel. Eine zusätzliche Nachprüfung durch Sonnet ist ein eigener Schritt, den der Owner freigibt.

## Nachprüfung durch Sonnet, später

1. Auswahl: die acht Haiku-Dateien oben.
2. Prüfung: je Zeile Zitat gegen Auszug, Zählung unabhängiger Quellen, Einordnung Gesichert, Eine Quelle, Arbeitsstand.
3. Ergebnis: Korrekturen direkt in der Datei, Änderungen mit Datum und Modell in dieser Datei protokollieren.
4. Vergleich: Anzahl der Korrekturen je Kapitel, Haiku gegen die fünf Sonnet-Kapitel als Maßstab.

## Status nach dem Lauf (13.10.2026)

1. Lauf wf_cec5ce93-6b8, Resume, Task w7i6z0uyw: 27 von 27 Agenten fertig, 0 Fehler im letzten Durchgang.
2. Abnahme: 14 Dateien in `faktenbasis/` (13 Kapitel plus OFFENE-FRAGEN-ENTWURF.md), jede Kapitel-Datei mit den fünf Abschnitten.
3. Journal: der Retry hat die 14 Limit-Fehler des Erstlaufs erneut eingetragen, deshalb steht dort insgesamt 28 `failed`. Keine neuen Fehler nach dem Resume.

## Wirkung der Gegenprüfung (Sonnet) auf die Haiku-Kapitel

Zählung je Abschnitt, Schreiber (Haiku) gegen Gegenprüfer (Sonnet). G = Gesichert, E = Eine Quelle, A = Arbeitsstand, O = Offen, X = Entfernt.

| Kapitel | Schreiber G/E/A/O | Gegenprüfung G/E/A/O/X |
|---|---|---|
| markensprache | 12/16/31/14 | 8/17/34/14/0 |
| kanaele-formate | 12/29/50/20 | 12/26/53/20/0 |
| glossar | 13/16/43/16 | 12/19/43/16/0 |
| projekte-angebot | 27/20/23/22 | 26/21/23/23/0 |
| visuelle-identitaet | 7/28/31/12 | 3/34/31/12/0 |
| themenfelder | 23/26/20/18 | 20/29/22/18/0 |
| anknuepfungspunkte | 15/32/48/18 | 17/30/51/18/0 |
| sonstiges | 11/37/88/31 | 7/49/80/31/1 |

Lesart: Die Gegenprüfung hat bei allen acht Haiku-Kapiteln Zeilen zwischen den Abschnitten verschoben. Am stärksten bei visuelle-identitaet (Gesichert −4, Eine Quelle +6) und sonstiges (Eine Quelle +12, Arbeitsstand −8). Das ist der Maßstab für die Sonnet-Nachprüfung in Abschnitt „Nachprüfung durch Sonnet, später“. Die Begründungen je Zeile stehen in den Gegenprüfungs-Rückgaben des Journals (`hinweise`).

Ausnahme: Die Schreiber-Einträge für vision und zielgruppen stehen im Journal doppelt. Die Ursache ist nicht geklärt. Die Datei spiegelt das Ergebnis der Gegenprüfung. Beide Kapitel sind Sonnet-Kapitel.
