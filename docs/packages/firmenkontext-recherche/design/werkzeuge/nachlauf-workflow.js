export const meta = {
  name: 'wee-firmenkontext-nachlauf',
  description: 'Nachlauf zur Recherche: WEE-Bezug jeder Quelle streng einstufen und aus den vorhandenen Auszuegen Themenfelder und Anknuepfungspunkte belegen',
  whenToUse: 'Erweiterung 1 des Haiku-Auftrags, nach Phase 1 und vor Phase 2',
  phases: [
    { title: 'Nachlauf', detail: 'je Paket ein Agent ueber vorhandene Befunde und Auszuege' },
    { title: 'Reparatur', detail: 'rote Selbstpruefung mit Fehlerliste erneut' },
  ],
}

const R = '/Users/benknaute/Claude/Projects/Keel-Harness/user-projects/wee-firmenkontext/docs/packages/firmenkontext-recherche/design/recherche'
const CHECK = 'node /Users/benknaute/Claude/Projects/Keel-Harness/user-projects/wee-firmenkontext/docs/packages/firmenkontext-recherche/design/werkzeuge/check-befunde.mjs'
const MODEL = (args && args.modell) || 'haiku'
const PAKETE = (args && Array.isArray(args.pakete)) ? args.pakete : []
if (!PAKETE.length) throw new Error('args.pakete fehlt: Ausgabe von nachlauf-pakete.mjs mitgeben')

const SCHEMA = {
  type: 'object',
  properties: {
    agent: { type: 'string' }, pruefung: { type: 'string' }, quellen: { type: 'integer' },
    kern: { type: 'integer' }, unterstuetzend: { type: 'integer' }, randstaendig: { type: 'integer' }, kein: { type: 'integer' },
    themenfelder: { type: 'integer' }, anknuepfungspunkte: { type: 'integer' }, hinweise: { type: 'array', items: { type: 'string' } },
  },
  required: ['agent', 'pruefung', 'quellen', 'kern', 'unterstuetzend', 'randstaendig', 'kein', 'themenfelder', 'anknuepfungspunkte', 'hinweise'],
}

const AUFGABE = (p) => `Du machst einen Nachlauf zur Recherche fuer den Firmenkontext von World Eden Era (WEE). Du liest NUR vorhandene Dateien, du rufst keine Websites, kein GitHub und kein Drive auf.

DEINE DATEIEN: ${p.dateien.map(f => R + '/' + f).join(', ')} und die darin genannten Auszugsdateien (Feld auszugsdatei, relativ zu ${R}).

AUFGABE A, WEE-BEZUG: Stufe JEDE Quelle (jeden Eintrag in quellen deiner Dateien) streng ein, Feld wee_bezug:
- kern: von WEE als Organisation oder ueber WEE, offizielle Aussage (Website, Kanaele, Businessplan, Satzung, Konzeptdokumente, Design-System).
- unterstuetzend: WEE-Projektmaterial, das Inhalte zeigt (Simulator, Spiel, CRM-Konzept, Social-Media-Strategie).
- randstaendig: Experimente, Spielwiesen, Prototypen, verworfene Entwuerfe, Nebenprojekte einzelner Personen (z. B. Website-Labor, alte Seite, Vorgaenger-Repo, Meeting-Notizen ohne Beschluss).
- kein: kein Bezug zu WEE (private Portfolios, Werkzeug-Repos, fremde Themen).
Dass etwas im Drive, in der GitHub-Orga oder in einem Projektordner liegt, macht es noch nicht zur WEE-Position. relevanz_begruendung: ein Satz, warum.

AUFGABE B, THEMENFELDER (kapitel "themenfelder"): Lies alle Auszuege deiner Dateien vollstaendig. Erfasse die fachlichen Themen, in denen WEE arbeitet und kommuniziert, und WIE WEE sie behandelt (Haltung, Tiefe, wiederkehrende Argumente, zitierte Studien, Beispiele). Eine Aussage je Befund, mit woertlichem Zitat aus dem Auszug.

AUFGABE C, ANKNUEPFUNGSPUNKTE (kapitel "anknuepfungspunkte"): Richtungen, die der Kontext offen laesst: Content-Themen, Formate, Kooperationen und Partner, Projekte und Ausbaustufen, Zielgruppen, Foerderwege, Regionen. Nennt die Quelle es selbst als Plan, Idee, Wunsch, naechsten Schritt oder Partner: art "explizit". Zeigt es sich nur aus wiederkehrenden Themen: art "beobachtet" und die Aussage beginnt mit "Moegliche Richtung: ". Jede Aussage nennt die Art der Richtung und worauf sie aufbaut. Nie frei erfinden, nichts aus eigenem Wissen.

REGELN: Befunde nur aus Quellen mit wee_bezug kern, unterstuetzend oder randstaendig; aus randstaendigen Quellen beginnt die Aussage mit "Randquelle: " (vor "Moegliche Richtung: "). Quellen mit wee_bezug kein bekommen keine Befunde. Datenschutz: keine privaten Kontakt-, Bank-, Spender-, Vertrags-, Gehalts- oder Gesundheitsdaten, keine Aussagen einzelner ueber andere Personen. Keine Aussagen ueber Ordner der alten Drive-Ablage.

AUSGABE: Schreibe ${R}/befunde-${p.paket}.json mit den Feldern quellen, befunde, widersprueche, luecken, uebersprungen:
- quellen: JEDE Quelle deiner Dateien als Kopie (slug, typ, fundstelle, titel, auszugsdatei, relevanz, stand_der_quelle, abhaengig_von unveraendert uebernehmen) plus wee_bezug und relevanz_begruendung.
- befunde: NUR neue Befunde mit kapitel themenfelder oder anknuepfungspunkte (Felder kapitel, aussage, art, zitat, fundstelle, quelle_slug). zitat ist eine woertliche Kopie aus der Auszugsdatei der Quelle (mindestens 8 Zeichen, Auslassung nur mit "…").
- widersprueche, luecken, uebersprungen: Listen (duerfen leer sein).
Fuehre dann aus: ${CHECK} ${R}/befunde-${p.paket}.json und behebe Fehler, bis die Ausgabe mit BEFUNDE-OK beginnt (hoechstens 5 Durchlaeufe).
Gib zurueck: agent (= ${p.paket}), pruefung (letzte Ausgabezeile woertlich), Zahl der Quellen je wee_bezug, Zahl der Befunde je Kapitel, hinweise.`

const run = (p, extra) => agent(AUFGABE(p) + (extra || ''), { label: `nachlauf:${p.paket}`, phase: extra ? 'Reparatur' : 'Nachlauf', schema: SCHEMA, model: MODEL })

phase('Nachlauf')
const results = await pipeline(PAKETE,
  p => run(p),
  (r, p) => (r && String(r.pruefung).startsWith('BEFUNDE-OK')) ? r
    : run(p, `\n\nREPARATUR: Ein frueherer Lauf endete mit "${r ? r.pruefung : 'kein Ergebnis'}". Lies ${R}/befunde-${p.paket}.json, falls vorhanden, und behebe alle Fehler.`))

const ok = results.filter(r => r && String(r.pruefung).startsWith('BEFUNDE-OK'))
const rot = PAKETE.map(p => p.paket).filter(k => !ok.some(r => r.agent === k))
if (rot.length) log(`Weiter rot: ${rot.join(', ')}`)
const summe = f => ok.reduce((n, r) => n + (r[f] || 0), 0)
return { gruen: ok.map(r => r.agent), rot, kern: summe('kern'), unterstuetzend: summe('unterstuetzend'), randstaendig: summe('randstaendig'), kein: summe('kein'), themenfelder: summe('themenfelder'), anknuepfungspunkte: summe('anknuepfungspunkte') }
