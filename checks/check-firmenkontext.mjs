#!/usr/bin/env node
// Prueft den Firmenkontext gegen sein Quellenregister.
// Aufruf: node checks/check-firmenkontext.mjs quellen|kapitel|belege
// Gibt bei Erfolg genau eine Zeile QUELLEN-OK, KAPITEL-OK oder BELEGE-OK aus, sonst die Fehler.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const REGISTER = path.join(root, 'quellen', 'REGISTER.md');
const TYPES = ['website', 'linkedin', 'instagram', 'drive', 'github-org', 'eigenes-projekt'];
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
    if (!TYPES.includes(type)) errors.push(`${id}: unbekannter Typ "${type}"`);
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

// Inhaltszeilen: alles ausser Leerzeilen, Ueberschriften, Tabellentrennern und Kommentaren.
function contentLines(text) {
  return text.split(/\r?\n/).map((l, i) => ({ n: i + 1, l: l.trim() })).filter(({ l }) =>
    l && !l.startsWith('#') && !/^\|?[\s:|-]+\|?$/.test(l) && !l.startsWith('<!--'));
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

const mode = process.argv[2];
const run = { quellen: checkQuellen, kapitel: checkKapitel, belege: checkBelege }[mode];
if (!run) {
  console.error('Aufruf: node checks/check-firmenkontext.mjs quellen|kapitel|belege');
  process.exit(2);
}
const { errors, ok } = run();
if (errors.length) {
  for (const e of errors) console.log(e);
  process.exit(1);
}
console.log(ok);
