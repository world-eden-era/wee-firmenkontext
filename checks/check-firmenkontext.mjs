#!/usr/bin/env node
// Prueft den Firmenkontext gegen sein Quellenregister.
// Aufruf: node checks/check-firmenkontext.mjs quellen|kapitel|belege|themen|tueren|relevanz
// Gibt bei Erfolg genau eine Zeile <MODUS>-OK aus (THEMEN-OK, TUEREN-OK, RELEVANZ-OK ...), sonst die Fehler.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const REGISTER = path.join(root, 'quellen', 'REGISTER.md');
// Pflichttypen: jede Quellenart des Owner-Auftrags kommt mindestens einmal vor.
const TYPES = ['website', 'linkedin', 'instagram', 'drive', 'github-org', 'eigenes-projekt'];
// owner: Entscheidung oder Aussage des Owners im Chat (Datum und Wortlaut im Auszug); optional.
const ALL_TYPES = [...TYPES, 'owner'];
const CHAPTERS = [
  '01-identitaet.md', '02-vision.md', '03-mission.md', '04-werte.md', '05-projekte-angebot.md',
  '06-zielgruppen.md', '07-markensprache.md', '08-visuelle-identitaet.md', '09-kanaele-formate.md',
  '10-glossar.md',
];
const SOURCE_REF = /\[(Q\d{3})\]/g;

function read(file) {
  return fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : null;
}

// Registerzeile: | Q001 | typ | fundstelle | YYYY-MM-DD | quellen/auszuege/Q001.md |
function parseRegister() {
  const text = read(REGISTER);
  if (text === null) return { entries: [], errors: ['quellen/REGISTER.md fehlt'] };
  const entries = [];
  const errors = [];
  for (const line of text.split(/\r?\n/)) {
    const cells = line.split('|').map((c) => c.trim());
    if (!/^Q\d{3}$/.test(cells[1] || '')) continue;
    const [, id, type, location, date, extract] = cells;
    if (entries.some((e) => e.id === id)) errors.push(`${id}: doppelt im Register`);
    if (!ALL_TYPES.includes(type)) errors.push(`${id}: unbekannter Typ "${type}"`);
    if (!location) errors.push(`${id}: Fundstelle fehlt`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date || '')) errors.push(`${id}: Abrufdatum fehlt oder nicht YYYY-MM-DD`);
    const extractPath = path.join(root, ...(extract || '').split('/'));
    if (!extract || !fs.existsSync(extractPath) || !read(extractPath).trim()) {
      errors.push(`${id}: Auszugsdatei "${extract}" fehlt oder ist leer`);
    }
    entries.push({ id, type });
  }
  if (entries.length === 0) errors.push('quellen/REGISTER.md enthaelt keine Eintraege');
  return { entries, errors };
}

// Inhaltszeilen: alles ausser Leerzeilen, Ueberschriften, Tabellentrennern, Tabellenkoepfen und Kommentaren.
const SEPARATOR = /^\|?[\s:|-]+\|?$/;
function contentLines(text) {
  const raw = text.split(/\r?\n/).map((l) => l.trim());
  return raw.map((l, i) => ({ n: i + 1, l })).filter(({ l, n }) =>
    l && !l.startsWith('#') && !SEPARATOR.test(l) && !l.startsWith('<!--') &&
    !(l.startsWith('|') && SEPARATOR.test(raw[n] || '') && (raw[n] || '').includes('-')));
}

function checkQuellen() {
  const { entries, errors } = parseRegister();
  for (const t of TYPES) {
    if (!entries.some((e) => e.type === t)) errors.push(`kein Registereintrag vom Typ ${t}`);
  }
  return { errors, ok: 'QUELLEN-OK' };
}

function checkKapitel() {
  const errors = [];
  const files = [...CHAPTERS.map((c) => path.join('kontext', c)), 'FIRMENKONTEXT.md', 'OFFENE-FRAGEN.md'];
  for (const rel of files) {
    const text = read(path.join(root, rel));
    if (text === null) errors.push(`${rel} fehlt`);
    else if (rel !== 'OFFENE-FRAGEN.md' && contentLines(text).length === 0) errors.push(`${rel} hat keinen Inhalt`);
  }
  return { errors, ok: 'KAPITEL-OK' };
}

function checkBelege() {
  const { entries, errors } = parseRegister();
  const known = new Set(entries.map((e) => e.id));
  const files = [...CHAPTERS.map((c) => path.join('kontext', c)), 'FIRMENKONTEXT.md'];
  for (const rel of files) {
    const text = read(path.join(root, rel));
    if (text === null) { errors.push(`${rel} fehlt`); continue; }
    for (const { n, l } of contentLines(text)) {
      const refs = [...l.matchAll(SOURCE_REF)].map((m) => m[1]);
      if (refs.length === 0) errors.push(`${rel}:${n}: Aussage ohne Quellenverweis [Qnnn]`);
      for (const id of refs) if (!known.has(id)) errors.push(`${rel}:${n}: ${id} steht nicht im Register`);
    }
  }
  return { errors, ok: 'BELEGE-OK' };
}

// Folgepaket firmenkontext-themen: Kapitel 11 und 12, Relevanz je Quelle.
const BEZUG = ['kern', 'unterstuetzend', 'randstaendig', 'kein'];
const ROW_STATUS = /^(bestaetigt|bestätigt|offen)$/i;

function checkZusatzkapitel(rel, heading, ok, needStatus) {
  const { entries, errors } = parseRegister();
  const known = new Set(entries.map((e) => e.id));
  const text = read(path.join(root, ...rel.split('/')));
  if (text === null) return { errors: [...errors, `${rel} fehlt`], ok };
  const lines = contentLines(text);
  if (lines.length === 0) errors.push(`${rel} hat keinen Inhalt`);
  let rows = 0;
  for (const { n, l } of lines) {
    const refs = [...l.matchAll(SOURCE_REF)].map((m) => m[1]);
    if (refs.length === 0) errors.push(`${rel}:${n}: Aussage ohne Quellenverweis [Qnnn]`);
    for (const id of refs) if (!known.has(id)) errors.push(`${rel}:${n}: ${id} steht nicht im Register`);
    if (needStatus && l.startsWith('|')) {
      const cells = l.split('|').map((c) => c.trim()).filter(Boolean);
      rows += 1;
      if (!ROW_STATUS.test(cells[cells.length - 1] || '')) errors.push(`${rel}:${n}: letzte Spalte muss Status bestaetigt oder offen sein`);
    }
  }
  if (needStatus && rows === 0) errors.push(`${rel}: Tabelle | Richtung | Art | Grundlage | Status | fehlt`);
  const kurz = read(path.join(root, 'FIRMENKONTEXT.md')) || '';
  if (!kurz.split(/\r?\n/).some((l) => heading.test(l))) errors.push(`FIRMENKONTEXT.md: Abschnitt ${heading.source} fehlt`);
  return { errors, ok };
}

function checkThemen() {
  return checkZusatzkapitel('kontext/11-themenfelder.md', /^## Themenfelder/, 'THEMEN-OK', false);
}

function checkTueren() {
  return checkZusatzkapitel('kontext/12-anknuepfungspunkte.md', /^## Ankn(ü|ue)pfungspunkte/, 'TUEREN-OK', true);
}

// quellen/RELEVANZ.md: | Qnnn | wee_bezug | Begruendung | fuer jeden Registereintrag.
function checkRelevanz() {
  const { entries, errors } = parseRegister();
  const text = read(path.join(root, 'quellen', 'RELEVANZ.md'));
  if (text === null) return { errors: [...errors, 'quellen/RELEVANZ.md fehlt'], ok: 'RELEVANZ-OK' };
  const bezug = new Map();
  for (const line of text.split(/\r?\n/)) {
    const c = line.split('|').map((x) => x.trim());
    if (!/^Q\d{3}$/.test(c[1] || '')) continue;
    if (!BEZUG.includes(c[2])) errors.push(`RELEVANZ.md ${c[1]}: wee_bezug "${c[2]}" ist keiner von ${BEZUG.join(', ')}`);
    if (!c[3]) errors.push(`RELEVANZ.md ${c[1]}: Begruendung fehlt`);
    bezug.set(c[1], c[2]);
  }
  for (const e of entries) if (!bezug.has(e.id)) errors.push(`RELEVANZ.md: ${e.id} fehlt`);
  const dir = path.join(root, 'kontext');
  const files = (fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f.endsWith('.md')).map((f) => path.join('kontext', f)) : []).concat('FIRMENKONTEXT.md');
  for (const rel of files) {
    const t = read(path.join(root, rel));
    if (t === null) continue;
    for (const { n, l } of contentLines(t)) {
      const refs = [...l.matchAll(SOURCE_REF)].map((m) => m[1]);
      if (refs.some((id) => bezug.get(id) === 'kein')) errors.push(`${rel}:${n}: verweist auf eine Quelle ohne WEE-Bezug`);
      const tragend = refs.filter((id) => ['kern', 'unterstuetzend', 'owner'].includes(bezug.get(id)) || entries.find((e) => e.id === id && e.type === 'owner'));
      if (refs.length && tragend.length === 0 && !/^([-*|]\s*)*Randquelle/.test(l)) errors.push(`${rel}:${n}: stuetzt sich nur auf Randquellen und ist nicht als "Randquelle" markiert`);
    }
  }
  return { errors, ok: 'RELEVANZ-OK' };
}

const mode = process.argv[2];
const run = { quellen: checkQuellen, kapitel: checkKapitel, belege: checkBelege, themen: checkThemen, tueren: checkTueren, relevanz: checkRelevanz }[mode];
if (!run) {
  console.error('Aufruf: node checks/check-firmenkontext.mjs quellen|kapitel|belege|themen|tueren|relevanz');
  process.exit(2);
}
const { errors, ok } = run();
if (errors.length) {
  for (const e of errors) console.log(e);
  process.exit(1);
}
console.log(ok);
