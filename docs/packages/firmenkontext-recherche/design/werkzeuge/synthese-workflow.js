export const meta = {
  name: 'wee-firmenkontext-faktenbasis',
  description: 'Fuehrt die Befunde je Kapitel zur Faktenbasis zusammen, prueft jede Aussage gegen ihr Zitat und sammelt die offenen Fragen fuer den Owner',
  whenToUse: 'Phase 3 des Haiku-Auftrags im Paket firmenkontext-recherche, nach befunde-nach-kapitel.mjs',
  phases: [
    { title: 'Faktenbasis', detail: 'je Kapitel ein Schreiber' },
    { title: 'Gegenpruefung', detail: 'je Kapitel ein Pruefer, der jede Aussage zu widerlegen versucht' },
    { title: 'Fragen', detail: 'offene Fragen aller Kapitel zusammenfuehren' },
  ],
}

const R = '/Users/benknaute/Claude/Projects/Keel-Harness/user-projects/wee-firmenkontext/docs/packages/firmenkontext-recherche/design/recherche'
const MODEL = (args && args.modell) || 'haiku'
const KAPITEL = ['identitaet', 'vision', 'mission', 'werte', 'projekte-angebot', 'zielgruppen', 'markensprache', 'visuelle-identitaet', 'kanaele-formate', 'glossar', 'sonstiges']
const SCHEMA = {
  type: 'object',
  properties: {
    kapitel: { type: 'string' }, gesichert: { type: 'integer' }, eine_quelle: { type: 'integer' },
    arbeitsstand: { type: 'integer' }, offen: { type: 'integer' }, entfernt: { type: 'integer' },
    hinweise: { type: 'array', items: { type: 'string' } },
  },
  required: ['kapitel', 'gesichert', 'eine_quelle', 'arbeitsstand', 'offen', 'entfernt', 'hinweise'],
}

const FORMAT = `
Dateiformat ${R}/faktenbasis/<kapitel>.md (genau diese Abschnitte, Tabellen mit genau diesen Spalten):

# Faktenbasis: <kapitel>

## Gesichert
Aussagen mit mindestens zwei UNABHAENGIGEN Quellen.
| Nr | Aussage | Quellen | Unabhaengig | Zitat |

## Eine Quelle
Aussagen aus genau einer unabhaengigen, offiziellen WEE-Quelle (Website, Kanaele, Businessplan, Konzeptdokument, Design-System).
| Nr | Aussage | Quellen | Unabhaengig | Zitat |

## Arbeitsstand
Aussagen nur aus Meeting-Notizen, Vorgaenger-Repo, alter Seite, Entwuerfen oder Code-Kommentaren. Kommen NICHT als Tatsache in den Firmenkontext.
| Nr | Aussage | Quellen | Unabhaengig | Zitat |

## Offen
Widersprueche und Luecken, die nur der Owner entscheiden kann.
| Nr | Thema | Varianten mit Quellen | Frage an den Owner | Optionen |

## Entfernt
Vom Pruefer gestrichene Aussagen mit Grund.
| Nr | Aussage | Grund |

Spalten: Nr = <Kapitelkuerzel>-<laufende Zahl> (z. B. VIS-3); Quellen = slugs, mit Komma getrennt; Unabhaengig = Anzahl unabhaengiger Quellen (Zahl); Zitat = kurzes woertliches Zitat aus dem Befund (hoechstens 160 Zeichen, Auslassung mit "…").
Unabhaengigkeit: Quellen sind ABHAENGIG und zaehlen zusammen als EINE, wenn eine aus der anderen stammt: Live-Website und Repo BenWEE-cell/world-eden-era bzw. benni-cmd/WEE-Website-V2; inhaltsgleiche LinkedIn- und Instagram-Beitraege; Versionen oder Teile (-t1, -t2) desselben Dokuments; Feld abhaengig_von beachten.
`

phase('Faktenbasis')
const results = await pipeline(KAPITEL,
  k => agent(`Du schreibst die Faktenbasis fuer das Kapitel "${k}" des Firmenkontexts von World Eden Era.
Eingaben: ${R}/kapitel/${k}.json (alle Befunde dieses Kapitels mit Zitat, Quelle, typ, abhaengig_von, stand_der_quelle), ${R}/kapitel/_quellen.json (alle Quellen), ${R}/kapitel/_widersprueche.json (nur die zu "${k}" passenden). Pruefe ausserdem die anderen Kapitel-Dateien in ${R}/kapitel/ kurz per grep nach Befunden, die eigentlich zu "${k}" gehoeren, und nimm sie auf.
Arbeitsschritte:
1. Lies ${R}/kapitel/${k}.json vollstaendig (abschnittsweise, falls lang).
2. Fasse gleichbedeutende Befunde zu EINER Aussage zusammen und sammle alle ihre Quellen.
3. Zaehle die unabhaengigen Quellen je Aussage nach der Regel unten und ordne sie dem Abschnitt Gesichert, Eine Quelle oder Arbeitsstand zu.
4. Widersprueche (verschiedene Zahlen, Namen, Schreibweisen, Daten, Aussagen) und wichtige Luecken kommen nach Offen, je mit einer konkreten Frage an den Owner und den Optionen, die die Quellen zeigen.
5. Schreibe die Datei ${R}/faktenbasis/${k}.md (Ordner anlegen, falls noetig).
Regeln: Nur was in den Befunden steht, nichts aus eigenem Wissen, keine Glaettung. Personenbezogen nur offizielle Namen und Rollen. Keine Aussagen ueber Ordner der alten Drive-Ablage.
${FORMAT}
Gib die Zaehlung je Abschnitt zurueck (entfernt = 0).`, { label: `faktenbasis:${k}`, phase: 'Faktenbasis', schema: SCHEMA, model: MODEL }),
  (r, k) => agent(`Du bist Gegenpruefer fuer ${R}/faktenbasis/${k}.md. Deine Aufgabe ist, jede Aussage zu WIDERLEGEN; im Zweifel gilt sie als nicht belegt.
Fuer jede Zeile in Gesichert, Eine Quelle und Arbeitsstand:
1. Suche die genannten Quellen-slugs in ${R}/kapitel/${k}.json bzw. ${R}/kapitel/_quellen.json und lies das Zitat und, wenn noetig, die Auszugsdatei unter ${R}/<auszugsdatei>.
2. Traegt das Zitat die Aussage vollstaendig? Ist die Zahl der unabhaengigen Quellen richtig gezaehlt (Regel unten)? Ist die Aussage ein Arbeitsstand, der faelschlich als Tatsache steht?
3. Korrigiere direkt in der Datei: falsche Zaehlung berichtigen und Zeile in den richtigen Abschnitt verschieben; nicht getragene Aussagen nach Entfernt mit Grund; uebertriebene Aussagen auf das Zitat zurueckschneiden.
4. Pruefe Offen: jede Frage konkret, mit Optionen und Quellen.
${FORMAT}
Gib die Zaehlung nach deiner Pruefung zurueck (entfernt = Zahl der gestrichenen Zeilen) und in hinweise jede Aenderung in einem Satz.`, { label: `gegenpruefung:${k}`, phase: 'Gegenpruefung', schema: SCHEMA, model: MODEL }))

const ok = results.filter(Boolean)
const fehlt = KAPITEL.filter(k => !ok.some(r => r.kapitel === k))
if (fehlt.length) log(`Ohne Ergebnis: ${fehlt.join(', ')}`)

phase('Fragen')
const fragen = await agent(`Fuehre die Abschnitte "## Offen" aller Dateien ${R}/faktenbasis/*.md zu EINER Liste zusammen. Doppelte Fragen zusammenlegen. Lies ausserdem ${R}/luecken.md (Abschnitt Owner-Fragen), falls vorhanden.
Schreibe ${R}/faktenbasis/OFFENE-FRAGEN-ENTWURF.md:
# Offene Fragen an den Owner
Je Frage ein Block:
## F<n>: <Thema in wenigen Woertern>
- Frage: <ein Satz, mit Fragezeichen>
- Optionen: <a) …, b) …, c) …> (nur Optionen, die die Quellen zeigen; zusaetzlich immer "anders: Owner nennt Wortlaut")
- Quellen: <slugs und Fundstellen>
- Betrifft: <Kapitel und Nr der Zeilen>
Sortiere nach Wirkung: zuerst Identitaet, Vision, Mission, Werte, dann Markensprache, dann der Rest. Gib die Anzahl Fragen zurueck.`, { label: 'fragen', phase: 'Fragen', model: MODEL })

return { kapitel: ok, fehlt, fragen }
