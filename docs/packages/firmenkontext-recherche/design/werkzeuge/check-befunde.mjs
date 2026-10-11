#!/usr/bin/env node
// Prueft Rohbefunde der Recherche, bevor sie weiterverarbeitet werden.
// Aufruf: node check-befunde.mjs <befunde-datei.json> | --alle
// Kern: jedes Zitat muss woertlich (Leerraum egal) in der Auszugsdatei seiner Quelle stehen.
// Erfolg: genau eine Zeile "BEFUNDE-OK ..." und Exitcode 0; sonst je Fehler eine Zeile, Exitcode 1.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const RECHERCHE = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'recherche');
const KAPITEL = ['identitaet', 'vision', 'mission', 'werte', 'projekte-angebot', 'zielgruppen',
  'markensprache', 'visuelle-identitaet', 'kanaele-formate', 'glossar', 'themenfelder', 'anknuepfungspunkte', 'sonstiges'];
const TYPEN = ['website', 'linkedin', 'instagram', 'drive', 'github-org', 'eigenes-projekt'];
const RELEVANZ = ['hoch', 'mittel', 'gering', 'keine'];
const BEZUG = ['kern', 'unterstuetzend', 'randstaendig', 'kein'];

function norm(s) {
  return String(s).normalize('NFC').replace(/[“”„«»]/g, '"')
    .replace(/[‘’‚]/g, "'").replace(/\s+/g, ' ').trim().toLowerCase();
}

function checkFile(file) {
  const errors = [];
  const rel = path.basename(file);
  let data;
  try { data = JSON.parse(fs.readFileSync(file, 'utf8')); } catch (e) { return { errors: [`${rel}: kein gueltiges JSON (${e.message})`], count: {} }; }
  for (const key of ['quellen', 'befunde', 'widersprueche', 'luecken', 'uebersprungen']) {
    if (!Array.isArray(data[key])) errors.push(`${rel}: Feld ${key} fehlt oder ist keine Liste`);
  }
  if (errors.length) return { errors, count: {} };
  const quellen = new Map();
  const bezug = new Map();
  for (const [i, q] of data.quellen.entries()) {
    const at = `${rel} quellen[${i}]`;
    // wee_bezug und relevanz_begruendung sind optional (Laeufe vor dem 11.10.2026, 17:50 kennen sie nicht); wenn vorhanden, werden sie geprueft.
    for (const f of ['slug', 'typ', 'fundstelle', 'titel', 'auszugsdatei', 'relevanz']) {
      if (!q[f] || typeof q[f] !== 'string') errors.push(`${at}: Feld ${f} fehlt`);
    }
    if (q.typ && !TYPEN.includes(q.typ)) errors.push(`${at}: unbekannter typ "${q.typ}"`);
    if (q.relevanz && !RELEVANZ.includes(q.relevanz)) errors.push(`${at}: unbekannte relevanz "${q.relevanz}"`);
    if (q.wee_bezug !== undefined && !q.relevanz_begruendung) errors.push(`${at}: wee_bezug ohne relevanz_begruendung`);
    if (q.wee_bezug && !BEZUG.includes(q.wee_bezug)) errors.push(`${at}: unbekannter wee_bezug "${q.wee_bezug}" (erlaubt: ${BEZUG.join(', ')})`);
    if (quellen.has(q.slug)) errors.push(`${at}: slug "${q.slug}" doppelt`);
    bezug.set(q.slug, q.wee_bezug);
    let text = null;
    if (q.auszugsdatei && q.auszugsdatei !== '-') {
      const p = path.join(RECHERCHE, ...q.auszugsdatei.replace(/^.*design\/recherche\//, '').split('/'));
      if (fs.existsSync(p)) text = norm(fs.readFileSync(p, 'utf8'));
      else errors.push(`${at}: Auszugsdatei "${q.auszugsdatei}" fehlt (erwartet unter ${RECHERCHE})`);
    } else if (q.relevanz === 'hoch' || q.relevanz === 'mittel') {
      errors.push(`${at}: relevanz ${q.relevanz} braucht eine Auszugsdatei`);
    }
    quellen.set(q.slug, text);
  }
  const count = {};
  for (const [i, b] of data.befunde.entries()) {
    const at = `${rel} befunde[${i}]`;
    for (const f of ['kapitel', 'aussage', 'art', 'zitat', 'fundstelle', 'quelle_slug']) {
      if (!b[f] || typeof b[f] !== 'string') errors.push(`${at}: Feld ${f} fehlt`);
    }
    if (b.kapitel && !KAPITEL.includes(b.kapitel)) errors.push(`${at}: unbekanntes kapitel "${b.kapitel}"`);
    if (b.art && !['explizit', 'beobachtet'].includes(b.art)) errors.push(`${at}: art muss explizit oder beobachtet sein`);
    if (!quellen.has(b.quelle_slug)) { errors.push(`${at}: quelle_slug "${b.quelle_slug}" steht nicht in quellen`); continue; }
    if (bezug.get(b.quelle_slug) === 'kein') errors.push(`${at}: Quelle "${b.quelle_slug}" hat wee_bezug kein und darf keine Befunde tragen`);
    if (bezug.get(b.quelle_slug) === 'randstaendig' && !String(b.aussage).startsWith('Randquelle: ')) errors.push(`${at}: Befund aus randstaendiger Quelle muss mit "Randquelle: " beginnen`);
    if (b.kapitel === 'anknuepfungspunkte' && b.art === 'beobachtet' && !String(b.aussage).replace(/^Randquelle: /, '').startsWith('Moegliche Richtung: ')) errors.push(`${at}: beobachteter Anknuepfungspunkt muss mit "Moegliche Richtung: " beginnen`);
    const text = quellen.get(b.quelle_slug);
    if (text === null) { errors.push(`${at}: Quelle "${b.quelle_slug}" hat keine Auszugsdatei, Zitat nicht pruefbar`); continue; }
    // Auslassungen (… oder ...) teilen ein Zitat; jeder Teil ab 8 Zeichen muss im Auszug stehen.
    const teile = String(b.zitat).split(/…|\.\.\./).map(norm).filter((t) => t.length >= 8);
    if (teile.length === 0) errors.push(`${at}: Zitat zu kurz (mindestens 8 Zeichen)`);
    for (const t of teile) {
      if (!text.includes(t)) { errors.push(`${at}: Zitat steht nicht woertlich im Auszug von ${b.quelle_slug}: "${t.slice(0, 80)}"`); break; }
    }
    count[b.kapitel] = (count[b.kapitel] || 0) + 1;
  }
  return { errors, count, befunde: data.befunde.length, quellen: data.quellen.length };
}

const arg = process.argv[2];
if (!arg) { console.error('Aufruf: node check-befunde.mjs <befunde-datei.json> | --alle'); process.exit(2); }
const files = arg === '--alle'
  ? (fs.existsSync(RECHERCHE) ? fs.readdirSync(RECHERCHE) : []).filter((f) => /^befunde-.*\.json$/.test(f)).map((f) => path.join(RECHERCHE, f))
  : [path.resolve(arg)];
if (files.length === 0) { console.log(`keine befunde-*.json unter ${RECHERCHE}`); process.exit(1); }
let errors = [], befunde = 0, quellen = 0;
const total = {};
for (const f of files) {
  const r = checkFile(f);
  errors = errors.concat(r.errors);
  befunde += r.befunde || 0; quellen += r.quellen || 0;
  for (const [k, n] of Object.entries(r.count)) total[k] = (total[k] || 0) + n;
}
if (errors.length) { for (const e of errors) console.log(e); process.exit(1); }
console.log(`BEFUNDE-OK dateien=${files.length} quellen=${quellen} befunde=${befunde} ${KAPITEL.map((k) => `${k}=${total[k] || 0}`).join(' ')}`);
