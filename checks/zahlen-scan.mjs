#!/usr/bin/env node
// Findet Zahlenaussagen von WEE, die noch nicht im Zahlenregister stehen (Eingang der Pruefschleife).
// Aufruf:
//   node checks/zahlen-scan.mjs                 Website (sitemap.xml) und LinkedIn-Unternehmensseite
//   node checks/zahlen-scan.mjs --url <URL> ... nur diese Seiten
//   node checks/zahlen-scan.mjs --datei <Pfad>  einen Text (z. B. Beitragsentwurf) pruefen
// Ausgabe: je neuer Fundstelle eine JSON-Zeile {"quelle","satz","zahl"}, dann NEUE-ZAHLEN <n> (Exitcode 1)
// oder KEINE-NEUEN-ZAHLEN (Exitcode 0). Bekannt ist ein Satz, der in zahlen/zahlen.json unter "wortlaute"
// steht oder in zahlen/scan-ignoriert.json (mit Grund) als Nicht-Behauptung vermerkt ist.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ZAHL } from './check-folge.mjs';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const WEBSITE = 'https://www.world-eden-era.org';
const LINKEDIN = 'https://www.linkedin.com/company/world-eden-era/';
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128 Safari/537.36';

const norm = (s) => String(s).normalize('NFC').replace(/\s+/g, ' ').trim().toLowerCase();
const json = (rel, fallback) => { const p = path.join(root, ...rel.split('/')); return fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf8')) : fallback; };

function bekannteSaetze() {
  const set = new Set();
  const reg = json('zahlen/zahlen.json', { zahlen: [] });
  for (const z of reg.zahlen || []) for (const w of z.wortlaute || []) set.add(norm(w));
  for (const e of json('zahlen/scan-ignoriert.json', [])) set.add(norm(e.satz || e));
  return set;
}

function htmlZuText(html) {
  return html.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<(br|\/p|\/div|\/li|\/h\d)[^>]*>/gi, '\n').replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;|&#x27;/g, "'")
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)));
}

function saetze(text) {
  // Satzende nur bei !/? oder bei Punkt nach Kleinbuchstabe vor Grossbuchstabe, damit "2.000" und "z. B." ganz bleiben.
  return text.split(/\n+|(?<=[!?])\s+|(?<=[a-zäöüß)]\.)\s+(?=[A-ZÄÖÜ])/).map((s) => s.trim()).filter((s) => s.length > 8);
}

async function holen(url) {
  const res = await fetch(url, { headers: { 'User-Agent': UA, 'Accept-Language': 'de-DE' } });
  if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
  return res.text();
}

async function seiten() {
  const urls = new Set([WEBSITE + '/']);
  try {
    const xml = await holen(WEBSITE + '/sitemap.xml');
    for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) urls.add(m[1].trim());
  } catch (e) { console.error(`Hinweis: ${e.message}; nur Startseite`); }
  urls.add(LINKEDIN);
  return [...urls];
}

const args = process.argv.slice(2);
const quellen = [];
if (args[0] === '--datei') {
  const p = path.resolve(args[1] || '');
  if (!fs.existsSync(p)) { console.error(`Datei fehlt: ${p}`); process.exit(2); }
  quellen.push({ name: p, text: fs.readFileSync(p, 'utf8') });
} else {
  const urls = args[0] === '--url' ? args.slice(1) : await seiten();
  for (const u of urls) {
    try { quellen.push({ name: u, text: htmlZuText(await holen(u)) }); } catch (e) { console.error(`Hinweis: ${e.message}`); }
  }
}

const bekannt = bekannteSaetze();
const gesehen = new Set();
let neu = 0;
for (const q of quellen) {
  for (const s of saetze(q.text)) {
    const m = s.match(ZAHL);
    if (!m) continue;
    const key = norm(s);
    if (bekannt.has(key) || gesehen.has(key)) continue;
    gesehen.add(key);
    neu += 1;
    console.log(JSON.stringify({ quelle: q.name, satz: s, zahl: m[0] }));
  }
}
if (neu) { console.log(`NEUE-ZAHLEN ${neu}`); process.exit(1); }
console.log('KEINE-NEUEN-ZAHLEN');
