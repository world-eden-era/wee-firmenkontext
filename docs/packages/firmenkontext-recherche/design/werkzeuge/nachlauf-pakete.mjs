#!/usr/bin/env node
// Teilt die vorhandenen Befunddateien in Lesepakete fuer den Nachlauf (Relevanz, Themenfelder, Anknuepfungspunkte).
// Aufruf: node nachlauf-pakete.mjs  -> gibt JSON aus: [{"paket":"nachlauf-01","dateien":["befunde-x.json",...]}, ...]
// Ein Paket umfasst hoechstens 110000 Zeichen Auszuege, damit ein Haiku-Agent alles vollstaendig lesen kann.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const RECHERCHE = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'recherche');
const CAP = 110000;
const files = fs.readdirSync(RECHERCHE).filter((f) => /^befunde-.*\.json$/.test(f) && !/^befunde-nachlauf-/.test(f)).sort();
const groessen = files.map((f) => {
  const data = JSON.parse(fs.readFileSync(path.join(RECHERCHE, f), 'utf8'));
  let z = 0;
  for (const q of data.quellen || []) {
    if (!q.auszugsdatei || q.auszugsdatei === '-') continue;
    const p = path.join(RECHERCHE, ...q.auszugsdatei.replace(/^.*design\/recherche\//, '').split('/'));
    if (fs.existsSync(p)) z += fs.statSync(p).size;
  }
  return { f, z };
}).sort((a, b) => b.z - a.z);
const pakete = [];
for (const g of groessen) {
  const ziel = pakete.find((p) => p.z + g.z <= CAP);
  if (ziel) { ziel.dateien.push(g.f); ziel.z += g.z; } else pakete.push({ dateien: [g.f], z: g.z });
}
console.log(JSON.stringify(pakete.map((p, i) => ({ paket: `nachlauf-${String(i + 1).padStart(2, '0')}`, dateien: p.dateien.sort() }))));
