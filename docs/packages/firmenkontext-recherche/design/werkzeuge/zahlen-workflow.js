export const meta = {
  name: 'wee-zahlen-pruefung',
  description: 'Sammelt alle Zahlenaussagen von WEE, sucht externe Belege, bewertet sie nach der festen Pruefschleife und laesst jede Bewertung gegenpruefen',
  whenToUse: 'Paket zahlen-pruefung, nach plan und vor dem Start des Arbeitsschritts (Erweiterung 2)',
  phases: [
    { title: 'Sammeln', detail: 'Scanner, Befunde, Instagram und Firmenkontext zu Behauptungen zusammenfuehren' },
    { title: 'Pruefen', detail: 'je 5 Behauptungen ein Pruefer mit Websuche' },
    { title: 'Gegenpruefen', detail: 'jede Quelle und jedes Zitat nachschlagen, Bewertung bestaetigen oder herabstufen' },
  ],
}

const FK = '/Users/benknaute/Claude/Projects/Keel-Harness/user-projects/wee-firmenkontext'
const ZIEL = (args && args.ziel) || FK + '/docs/packages/zahlen-pruefung/design/zahlen'
const HEUTE = args && args.heute
const MODEL = (args && args.modell) || 'sonnet'
if (!HEUTE) throw new Error('args.heute (JJJJ-MM-TT) fehlt')
const SCHLEIFE = FK + '/docs/PRUEFSCHLEIFE-ZAHLEN.md'

phase('Sammeln')
const sammlung = await agent(`Du sammelst alle Zahlenaussagen von World Eden Era (WEE). Nur lesen, nichts ausserhalb von ${ZIEL} schreiben.
1. Lege ${ZIEL} an. Fuehre aus: cd ${FK} && node checks/zahlen-scan.mjs > ${ZIEL}/scan.txt 2>&1 ; das Ergebnis (JSON-Zeilen) ist die erste Quelle.
2. Weitere Quellen: alle Felder "zitat" in ${FK}/docs/packages/firmenkontext-recherche/design/recherche/befunde-*.json, die eine Zahl mit Einheit oder Prozent enthalten (Filter: node -e mit dem regulaeren Ausdruck ZAHL aus ${FK}/checks/check-folge.mjs, z. B. import { ZAHL } from '${FK}/checks/check-folge.mjs'); die Datei ${FK}/docs/packages/firmenkontext-recherche/design/social/instagram-2026-10-11.md; ${FK}/FIRMENKONTEXT.md und ${FK}/kontext/*.md, falls vorhanden.
3. Fuehre gleiche Behauptungen zusammen (gleiche Zahl, gleicher Gegenstand), auch wenn sie verschieden formuliert sind. Verschiedene Zahlen zum selben Gegenstand (z. B. "90 % weniger Wasser" und "weniger als 20 % des Wassers") bleiben getrennte Behauptungen und bekommen in "hinweis" den Verweis aufeinander.
4. Saetze ohne Behauptung (Datum, Adresse, Folgennummer, Preis, Anzahl Follower) kommen nach ${ZIEL}/ignoriert.json als [{"satz": "...", "grund": "..."}].
5. Schreibe ${ZIEL}/kandidaten.json: [{"id": "K001", "aussage": "<Behauptung in einem Satz>", "wert": "<Zahl mit Einheit>", "wortlaute": ["<woertliche Saetze>"], "verwendet_in": ["<URL, Drive-Datei oder Qnnn>"], "hinweis": ""}].
Gib zurueck: anzahl und pakete = Liste von Listen mit je hoechstens 5 IDs.`, {
  label: 'sammeln', phase: 'Sammeln', model: MODEL,
  schema: { type: 'object', properties: { anzahl: { type: 'integer' }, pakete: { type: 'array', items: { type: 'array', items: { type: 'string' } } } }, required: ['anzahl', 'pakete'] },
})
if (!sammlung || !sammlung.pakete.length) return { fehler: 'keine Kandidaten', sammlung }
log(`${sammlung.anzahl} Behauptungen in ${sammlung.pakete.length} Paketen`)

const ERGEBNIS = { type: 'object', properties: { paket: { type: 'string' }, belegt: { type: 'integer' }, eingeschraenkt: { type: 'integer' }, umstritten: { type: 'integer' }, falsch: { type: 'integer' }, ungeklaert: { type: 'integer' }, hinweise: { type: 'array', items: { type: 'string' } } }, required: ['paket', 'belegt', 'eingeschraenkt', 'umstritten', 'falsch', 'ungeklaert', 'hinweise'] }

const ergebnisse = await pipeline(sammlung.pakete.map((ids, i) => ({ ids, nr: String(i + 1).padStart(2, '0') })),
  p => agent(`Du pruefst Zahlenaussagen von World Eden Era nach der festen Pruefschleife ${SCHLEIFE} (lies sie zuerst, Schritte 2 bis 4 und 6 gelten woertlich).
Deine Behauptungen: ${p.ids.join(', ')} aus ${ZIEL}/kandidaten.json.
Je Behauptung:
1. Suche mit der Websuche externe Belege in der Rangfolge der Pruefschleife (Primaerquelle vor Fachbehoerde vor Presse; keine Blogs, keine Werbung, keine KI-Texte). Oeffne jede Quelle und kopiere die woertliche Stelle.
2. Bewerte mit genau einer Stufe: belegt, eingeschraenkt, umstritten, falsch. Findest du keinen zulaessigen Beleg: bewertung "unbelegt", sichere_formulierung "nicht verwenden" und in begruendung, was du wo gesucht hast.
3. Schreibe sichere_formulierung, begruendung (ausser bei belegt), geprueft_am "${HEUTE}", naechste_pruefung nach Schritt 6 (12 oder 6 Monate nach ${HEUTE}).
Schreibe ${ZIEL}/geprueft-${p.nr}.json als Liste von Eintraegen: {"id": "<K-Nummer>", "aussage", "wert", "wortlaute", "verwendet_in", "bewertung", "belege": [{"titel", "herausgeber", "jahr": <Zahl>, "url", "zitat", "stelle"}], "begruendung", "sichere_formulierung", "geprueft_am", "naechste_pruefung", "hinweis"}.
Nichts raten: Eine Zahl, die du nicht belegen kannst, ist unbelegt, nicht belegt. Gib die Zaehlung je Stufe zurueck (ungeklaert = unbelegt).`, { label: `pruefen:${p.nr}`, phase: 'Pruefen', schema: ERGEBNIS, model: MODEL }),
  (r, p) => agent(`Du bist Gegenpruefer fuer ${ZIEL}/geprueft-${p.nr}.json. Ziel: jede Bewertung zu WIDERLEGEN; im Zweifel wird herabgestuft.
Je Eintrag und je Beleg: oeffne die URL. Steht die woertliche Stelle dort? Stammt sie vom genannten Herausgeber und Jahr? Stuetzt sie die Zahl in Groessenordnung und Kontext? Sind bei "belegt" wirklich zwei verschiedene Herausgeber unabhaengig voneinander (nicht der eine zitiert den anderen)?
Korrigiere direkt in der Datei: falsche Belege entfernen, Bewertung herabstufen (belegt → eingeschraenkt → unbelegt) und die Begruendung ergaenzen; sichere_formulierung an die verbleibenden Belege anpassen. Ergaenze bei jedem Eintrag "gegengeprueft": "${HEUTE}".
Gib die Zaehlung je Stufe nach deiner Pruefung zurueck und in hinweise jede Aenderung in einem Satz.`, { label: `gegenpruefen:${p.nr}`, phase: 'Gegenpruefen', schema: ERGEBNIS, model: MODEL }))

const ok = ergebnisse.filter(Boolean)
const summe = f => ok.reduce((n, r) => n + (r[f] || 0), 0)
return { behauptungen: sammlung.anzahl, pakete: sammlung.pakete.length, fertig: ok.length, belegt: summe('belegt'), eingeschraenkt: summe('eingeschraenkt'), umstritten: summe('umstritten'), falsch: summe('falsch'), ungeklaert: summe('ungeklaert') }
