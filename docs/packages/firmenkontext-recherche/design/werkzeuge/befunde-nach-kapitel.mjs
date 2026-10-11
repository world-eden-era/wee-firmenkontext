#!/usr/bin/env node
// Sortiert alle Rohbefunde nach Kapitel, damit je Kapitel ein Agent nur seine Befunde liest.
// Aufruf: node befunde-nach-kapitel.mjs
// Liest design/recherche/befunde-*.json, schreibt design/recherche/kapitel/<kapitel>.json,
// _quellen.json (alle Quellen), _widersprueche.json und _konsumenten.json.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const RECHERCHE = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'recherche');
const ZIEL = path.join(RECHERCHE, 'kapitel');
const KAPITEL = ['identitaet', 'vision', 'mission', 'werte', 'projekte-angebot', 'zielgruppen',
  'markensprache', 'visuelle-identitaet', 'kanaele-formate', 'glossar', 'sonstiges'];

const files = fs.existsSync(RECHERCHE) ? fs.readdirSync(RECHERCHE).filter((f) => /^befunde-.*\.json$/.test(f)).sort() : [];
if (files.length === 0) { console.log(`keine befunde-*.json unter ${RECHERCHE}`); process.exit(1); }
fs.mkdirSync(ZIEL, { recursive: true });
const quellen = {};
const proKapitel = Object.fromEntries(KAPITEL.map((k) => [k, []]));
const widersprueche = [];
const konsumenten = [];
const daten = files.map((f) => ({ agent: f.replace(/^befunde-|\.json$/g, ''), data: JSON.parse(fs.readFileSync(path.join(RECHERCHE, f), 'utf8')) }));
for (const { agent, data } of daten) for (const q of data.quellen || []) quellen[q.slug] = { ...q, agent };
for (const { agent, data } of daten) {
  for (const b of data.befunde || []) {
    const q = quellen[b.quelle_slug] || {};
    (proKapitel[b.kapitel] || proKapitel.sonstiges).push({
      ...b, agent, typ: q.typ, abhaengig_von: q.abhaengig_von || '', stand_der_quelle: q.stand_der_quelle || '',
      auszugsdatei: q.auszugsdatei,
    });
  }
  for (const w of data.widersprueche || []) widersprueche.push({ ...w, agent });
  for (const k of data.konsumenten_anforderungen || []) konsumenten.push({ anforderung: k, agent });
}
for (const k of KAPITEL) fs.writeFileSync(path.join(ZIEL, `${k}.json`), JSON.stringify(proKapitel[k], null, 1));
fs.writeFileSync(path.join(ZIEL, '_quellen.json'), JSON.stringify(quellen, null, 1));
fs.writeFileSync(path.join(ZIEL, '_widersprueche.json'), JSON.stringify(widersprueche, null, 1));
fs.writeFileSync(path.join(ZIEL, '_konsumenten.json'), JSON.stringify(konsumenten, null, 1));
console.log(`KAPITEL-SORTIERT dateien=${files.length} quellen=${Object.keys(quellen).length} widersprueche=${widersprueche.length} ` +
  KAPITEL.map((k) => `${k}=${proKapitel[k].length}`).join(' '));
