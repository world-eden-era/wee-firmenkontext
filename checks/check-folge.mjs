#!/usr/bin/env node
// Prueft die Folgepakete des Firmenkontexts: Zahlenregister, Markensprache-Regeln, Fachsprache, Testsatz, Fragenkatalog.
// Aufruf: node checks/check-folge.mjs <modus> [--heute JJJJ-MM-TT]
//   zahlen-register   zahlen/zahlen.json ist vollstaendig und jede Bewertung hat die verlangten Belege
//   zahlen-abdeckung  jede Zahlenaussage in kontext/, FIRMENKONTEXT.md und sprache/ verweist auf eine gepruefte Zahl [Znnn]
//   zahlen-faellig    keine Zahl ist ungeprueft oder ueber ihrem Pruefdatum (Pruefschleife, docs/PRUEFSCHLEIFE-ZAHLEN.md)
//   sprache           sprache/REGELN.md: mindestens 15 Regeln, je mit Do, Don't und Website-Beleg
//   fachsprache       sprache/FACHSPRACHE.md: mindestens 10 Begriffe, einfach erklaert in hoechstens 25 Woertern, belegt
//   testsatz          sprache/testsatz.json: mindestens 20 Aufgaben, die nur auf vorhandene Regeln verweisen
//   fragen            fragen/FRAGENKATALOG.md: jede Frage mit allen Pflichtfeldern
// Erfolg: genau eine Zeile <MODUS>-OK (bzw. ZAHLEN-AKTUELL), sonst je Fehler eine Zeile und Exitcode 1.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (rel) => { const p = path.join(root, ...rel.split('/')); return fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : null; };
const argHeute = process.argv.indexOf('--heute');
const HEUTE = argHeute > 0 ? process.argv[argHeute + 1] : new Date().toISOString().slice(0, 10);
const DATUM = /^\d{4}-\d{2}-\d{2}$/;
// unbelegt: trotz Suche kein zulaessiger Beleg; wird nicht verwendet, der Owner entscheidet.
const BEWERTUNG = ['belegt', 'eingeschraenkt', 'umstritten', 'falsch', 'unbelegt', 'ungeprueft'];
// Zahl mit Einheit oder Prozent; Quellen- und Zahlenverweise ([Q001], [Z001]), Farbwerte und reine Daten zaehlen nicht.
export const ZAHL = /(?<![\w#.\-/])(\d{1,3}(?:\.\d{3})+(?:,\d+)?|\d+(?:[.,]\d+)?)\s?(%|prozent\b|mio\.?|millionen\b|milliarden\b|mrd\.?|tausend\b|kg\b|tonnen\b|liter\b|m²|qm\b|hektar\b|ha\b|km²?|grad\b|°c|jahren?\b|jahre\b|monaten?\b|mal\b|-?fach\b|euro\b|€|menschen\b|personen\b|arten\b)/i;

function registerEintraege() {
  const t = read('quellen/REGISTER.md');
  const m = new Map();
  if (t) for (const line of t.split(/\r?\n/)) {
    const c = line.split('|').map((x) => x.trim());
    if (/^Q\d{3}$/.test(c[1] || '')) m.set(c[1], c[2]);
  }
  return m;
}

function inhaltszeilen(text) {
  const raw = text.split(/\r?\n/).map((l) => l.trim());
  const SEP = /^\|?[\s:|-]+\|?$/;
  return raw.map((l, i) => ({ n: i + 1, l })).filter(({ l, n }) => l && !l.startsWith('#') && !SEP.test(l) &&
    !l.startsWith('<!--') && !(l.startsWith('|') && SEP.test(raw[n] || '') && (raw[n] || '').includes('-')));
}

function tabellenzeilen(text) {
  return inhaltszeilen(text).filter(({ l }) => l.startsWith('|')).map(({ n, l }) => ({ n, c: l.split('|').slice(1, -1).map((x) => x.trim()) }));
}

function ladeZahlen(errors) {
  const t = read('zahlen/zahlen.json');
  if (t === null) { errors.push('zahlen/zahlen.json fehlt'); return []; }
  try {
    const d = JSON.parse(t);
    if (d.version !== 1 || !Array.isArray(d.zahlen)) { errors.push('zahlen/zahlen.json: version 1 und Liste zahlen erwartet'); return []; }
    return d.zahlen;
  } catch (e) { errors.push(`zahlen/zahlen.json: kein gueltiges JSON (${e.message})`); return []; }
}

function tageZwischen(a, b) { return Math.round((Date.parse(b) - Date.parse(a)) / 86400000); }

function zahlenRegister() {
  const errors = [];
  const zahlen = ladeZahlen(errors);
  const ids = new Set();
  for (const [i, z] of zahlen.entries()) {
    const at = `zahlen[${i}]${z && z.id ? ' ' + z.id : ''}`;
    if (!/^Z\d{3}$/.test(z.id || '')) errors.push(`${at}: id muss Znnn sein`);
    if (ids.has(z.id)) errors.push(`${at}: id doppelt`);
    ids.add(z.id);
    for (const f of ['aussage', 'wert']) if (!z[f] || typeof z[f] !== 'string') errors.push(`${at}: ${f} fehlt`);
    if (!Array.isArray(z.verwendet_in) || z.verwendet_in.length === 0) errors.push(`${at}: verwendet_in braucht mindestens eine Fundstelle bei WEE (Qnnn oder URL)`);
    if (!BEWERTUNG.includes(z.bewertung)) { errors.push(`${at}: bewertung muss eine von ${BEWERTUNG.join(', ')} sein`); continue; }
    if (z.bewertung === 'ungeprueft') continue;
    const belege = Array.isArray(z.belege) ? z.belege : [];
    for (const [j, b] of belege.entries()) {
      for (const f of ['titel', 'herausgeber', 'url', 'zitat']) if (!b || !b[f]) errors.push(`${at} belege[${j}]: ${f} fehlt`);
      if (!b || !Number.isInteger(b.jahr)) errors.push(`${at} belege[${j}]: jahr (Zahl) fehlt`);
      if (b && b.url && !/^https?:\/\//.test(b.url)) errors.push(`${at} belege[${j}]: url muss mit http beginnen`);
    }
    const herausgeber = new Set(belege.map((b) => String(b && b.herausgeber || '').toLowerCase().trim()).filter(Boolean));
    if (z.bewertung === 'belegt' && herausgeber.size < 2) errors.push(`${at}: belegt braucht mindestens zwei Belege verschiedener Herausgeber`);
    if (!['belegt', 'unbelegt'].includes(z.bewertung) && belege.length < 1) errors.push(`${at}: ${z.bewertung} braucht mindestens einen Beleg`);
    if (z.bewertung !== 'belegt' && !z.begruendung) errors.push(`${at}: ${z.bewertung} braucht eine begruendung`);
    if (['umstritten', 'falsch', 'unbelegt'].includes(z.bewertung) && !z.freigabe_owner) errors.push(`${at}: ${z.bewertung} braucht freigabe_owner (Datum und Wortlaut der Owner-Entscheidung)`);
    if (!z.sichere_formulierung) errors.push(`${at}: sichere_formulierung fehlt (bei falsch: Korrektur oder "nicht verwenden")`);
    if (!DATUM.test(z.geprueft_am || '')) errors.push(`${at}: geprueft_am fehlt oder nicht JJJJ-MM-TT`);
    if (!DATUM.test(z.naechste_pruefung || '')) errors.push(`${at}: naechste_pruefung fehlt oder nicht JJJJ-MM-TT`);
    else if (DATUM.test(z.geprueft_am || '') && tageZwischen(z.geprueft_am, z.naechste_pruefung) > 366) errors.push(`${at}: naechste_pruefung liegt mehr als 12 Monate nach geprueft_am`);
  }
  if (zahlen.length === 0 && !errors.length) errors.push('zahlen/zahlen.json enthaelt keine Zahlen');
  return { errors, ok: 'ZAHLEN-REGISTER-OK' };
}

function zahlenAbdeckung() {
  const errors = [];
  const zahlen = new Map(ladeZahlen(errors).map((z) => [z.id, z]));
  const dateien = [];
  for (const dir of ['kontext', 'sprache']) {
    const p = path.join(root, dir);
    if (fs.existsSync(p)) for (const f of fs.readdirSync(p)) if (f.endsWith('.md')) dateien.push(`${dir}/${f}`);
  }
  dateien.push('FIRMENKONTEXT.md');
  for (const rel of dateien) {
    const t = read(rel);
    if (t === null) continue;
    for (const { n, l } of inhaltszeilen(t)) {
      if (!ZAHL.test(l.replace(/\[[QZ]\d{3}\]/g, ''))) continue;
      const refs = [...l.matchAll(/\[(Z\d{3})\]/g)].map((m) => m[1]);
      if (refs.length === 0) { errors.push(`${rel}:${n}: Zahlenaussage ohne Verweis [Znnn] auf das Zahlenregister`); continue; }
      for (const id of refs) {
        const z = zahlen.get(id);
        if (!z) errors.push(`${rel}:${n}: ${id} steht nicht in zahlen/zahlen.json`);
        else if (['falsch', 'unbelegt', 'ungeprueft'].includes(z.bewertung)) errors.push(`${rel}:${n}: ${id} ist ${z.bewertung} und darf nicht verwendet werden`);
      }
    }
  }
  return { errors, ok: 'ZAHLEN-ABGEDECKT' };
}

function zahlenFaellig() {
  const errors = [];
  for (const z of ladeZahlen(errors)) {
    if (z.bewertung === 'ungeprueft') errors.push(`${z.id}: ungeprueft ("${z.wert}" in "${String(z.aussage).slice(0, 70)}")`);
    else if (DATUM.test(z.naechste_pruefung || '') && z.naechste_pruefung <= HEUTE) errors.push(`${z.id}: Pruefung faellig seit ${z.naechste_pruefung}`);
  }
  return { errors, ok: 'ZAHLEN-AKTUELL' };
}

function sprache() {
  const errors = [];
  const t = read('sprache/REGELN.md');
  if (t === null) return { errors: ['sprache/REGELN.md fehlt'], ok: 'SPRACHE-OK', nummern: new Set() };
  const reg = registerEintraege();
  const rows = tabellenzeilen(t);
  const nummern = new Set();
  for (const { n, c } of rows) {
    if (c.length < 5) { errors.push(`sprache/REGELN.md:${n}: erwartet | Nr | Regel | Do | Don't | Beleg |`); continue; }
    const [nr, regel, doo, dont, beleg] = c;
    if (!/^R\d+$/.test(nr)) errors.push(`sprache/REGELN.md:${n}: Nr muss R<Zahl> sein`);
    nummern.add(nr);
    if (!regel || !doo || !dont) errors.push(`sprache/REGELN.md:${n}: Regel, Do und Don't duerfen nicht leer sein`);
    const refs = [...beleg.matchAll(/\[(Q\d{3})\]/g)].map((m) => m[1]);
    if (!refs.some((id) => ['website', 'owner'].includes(reg.get(id)))) errors.push(`sprache/REGELN.md:${n}: Beleg braucht mindestens einen Registereintrag vom Typ website oder owner`);
  }
  if (rows.length < 15) errors.push(`sprache/REGELN.md: ${rows.length} Regeln, mindestens 15 verlangt`);
  return { errors, ok: 'SPRACHE-OK', nummern };
}

function fachsprache() {
  const errors = [];
  const t = read('sprache/FACHSPRACHE.md');
  if (t === null) return { errors: ['sprache/FACHSPRACHE.md fehlt'], ok: 'FACHSPRACHE-OK' };
  const reg = registerEintraege();
  const rows = tabellenzeilen(t);
  for (const { n, c } of rows) {
    if (c.length < 4) { errors.push(`sprache/FACHSPRACHE.md:${n}: erwartet | Fachbegriff | Einfach erklaert | Vergleich aus dem Alltag | Beleg |`); continue; }
    const [begriff, einfach, , beleg] = c;
    if (!begriff || !einfach) errors.push(`sprache/FACHSPRACHE.md:${n}: Fachbegriff und Erklaerung duerfen nicht leer sein`);
    const woerter = einfach.split(/\s+/).filter(Boolean).length;
    if (woerter > 25) errors.push(`sprache/FACHSPRACHE.md:${n}: Erklaerung hat ${woerter} Woerter, hoechstens 25`);
    const refs = [...beleg.matchAll(/\[(Q\d{3})\]/g)].map((m) => m[1]);
    if (refs.length === 0 || refs.some((id) => !reg.has(id))) errors.push(`sprache/FACHSPRACHE.md:${n}: Beleg braucht gueltige Verweise [Qnnn]`);
  }
  if (rows.length < 10) errors.push(`sprache/FACHSPRACHE.md: ${rows.length} Begriffe, mindestens 10 verlangt`);
  if (!/^## Regeln/m.test(t)) errors.push('sprache/FACHSPRACHE.md: Abschnitt "## Regeln" (wie Fachwissen einfach vermittelt wird) fehlt');
  return { errors, ok: 'FACHSPRACHE-OK' };
}

function testsatz() {
  const errors = [];
  const { nummern } = sprache();
  const t = read('sprache/testsatz.json');
  if (t === null) return { errors: ['sprache/testsatz.json fehlt'], ok: 'TESTSATZ-OK' };
  let d;
  try { d = JSON.parse(t); } catch (e) { return { errors: [`sprache/testsatz.json: kein gueltiges JSON (${e.message})`], ok: 'TESTSATZ-OK' }; }
  const liste = Array.isArray(d) ? d : [];
  if (liste.length < 20) errors.push(`sprache/testsatz.json: ${liste.length} Aufgaben, mindestens 20 verlangt`);
  for (const [i, a] of liste.entries()) {
    const at = `testsatz[${i}]`;
    for (const f of ['id', 'kanal', 'aufgabe']) if (!a[f]) errors.push(`${at}: ${f} fehlt`);
    for (const f of ['muss', 'darf_nicht', 'regeln']) if (!Array.isArray(a[f]) || a[f].length === 0) errors.push(`${at}: ${f} braucht mindestens einen Eintrag`);
    for (const r of a.regeln || []) if (!nummern.has(r)) errors.push(`${at}: Regel ${r} steht nicht in sprache/REGELN.md`);
  }
  return { errors, ok: 'TESTSATZ-OK' };
}

const FRAGEFELDER = ['Frage', 'Warum wichtig', 'Wer braucht es', 'Wer weiss es vermutlich', 'Antwortform', 'Herkunft'];
function fragen() {
  const errors = [];
  const t = read('fragen/FRAGENKATALOG.md');
  if (t === null) return { errors: ['fragen/FRAGENKATALOG.md fehlt'], ok: 'FRAGEN-OK' };
  const bloecke = t.split(/^## /m).slice(1);
  if (bloecke.length === 0) errors.push('fragen/FRAGENKATALOG.md: keine Fragen (Bloecke "## FR<n>: <Thema>")');
  for (const b of bloecke) {
    const kopf = b.split(/\r?\n/)[0];
    if (!/^FR\d+: \S/.test(kopf)) { errors.push(`FRAGENKATALOG.md: Kopf "${kopf.slice(0, 40)}" muss "FR<n>: <Thema>" sein`); continue; }
    for (const f of FRAGEFELDER) if (!new RegExp(`^- ${f}: \\S`, 'm').test(b)) errors.push(`FRAGENKATALOG.md ${kopf.split(':')[0]}: Feld "${f}" fehlt oder ist leer`);
  }
  return { errors, ok: 'FRAGEN-OK' };
}

const MODI = { 'zahlen-register': zahlenRegister, 'zahlen-abdeckung': zahlenAbdeckung, 'zahlen-faellig': zahlenFaellig, sprache, fachsprache, testsatz, fragen };
if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const run = MODI[process.argv[2]];
  if (!run) { console.error(`Aufruf: node checks/check-folge.mjs ${Object.keys(MODI).join('|')} [--heute JJJJ-MM-TT]`); process.exit(2); }
  const { errors, ok } = run();
  if (errors.length) { for (const e of errors) console.log(e); process.exit(1); }
  console.log(ok);
}
