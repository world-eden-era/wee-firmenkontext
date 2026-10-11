export const meta = {
  name: 'wee-firmenkontext-recherche',
  description: 'Recherche Firmenkontext World Eden Era: Website, Social Media, GitHub-Orga, eigene Projekte und Drive-Textkopie, nur lesend, je Agent Befunde mit woertlichen Zitaten und Selbstpruefung',
  whenToUse: 'Phase 1 des Haiku-Auftrags im Paket firmenkontext-recherche',
  phases: [
    { title: 'Recherche', detail: '11 Web-/GitHub-/Projektquellen und 26 Drive-Lesepakete' },
    { title: 'Reparatur', detail: 'Agenten, deren Selbstpruefung rot blieb, bekommen die Fehlerliste' },
    { title: 'Luecken', detail: 'Lueckenpruefer ueber alle Befunde' },
  ],
}

const H = '/Users/benknaute/Claude/Projects/Keel-Harness/user-projects/wee-firmenkontext'
const PKG = H + '/docs/packages/firmenkontext-recherche'
const OUT = PKG + '/design/recherche'
const CHECK = 'node ' + PKG + '/design/werkzeuge/check-befunde.mjs'
const CORPUS = H + '/.recherche-cache/drive/text'
const DATE = '2026-10-11'
const MODEL = (args && args.modell) || 'haiku'
const ONLY = (args && Array.isArray(args.nur)) ? args.nur : null
const KAPITEL = ['identitaet', 'vision', 'mission', 'werte', 'projekte-angebot', 'zielgruppen', 'markensprache', 'visuelle-identitaet', 'kanaele-formate', 'glossar', 'sonstiges']

const SCHEMA = {
  type: 'object',
  properties: {
    agent: { type: 'string' },
    pruefung: { type: 'string' },
    quellen: { type: 'integer' },
    befunde: { type: 'integer' },
    widersprueche: { type: 'integer' },
    hinweise: { type: 'array', items: { type: 'string' } },
  },
  required: ['agent', 'pruefung', 'quellen', 'befunde', 'widersprueche', 'hinweise'],
}

const BEISPIEL = JSON.stringify({
  quellen: [{ slug: 'website-home', typ: 'website', fundstelle: 'https://www.world-eden-era.org/', titel: 'Startseite', stand_der_quelle: '2026-10-09', auszugsdatei: 'auszuege/website-home.md', abhaengig_von: 'Inhalt stammt aus Repo BenWEE-cell/world-eden-era content/home.json', relevanz: 'hoch' }],
  befunde: [{ kapitel: 'vision', aussage: 'WEE nennt als Leitsatz We Need. We Can. We Will.', art: 'explizit', zitat: 'We Need. We Can. We Will.', fundstelle: 'https://www.world-eden-era.org/ Abschnitt Hero', quelle_slug: 'website-home' }],
  widersprueche: [{ thema: 'Schreibweise Projektname', beschreibung: 'Project Oasis und Projekt Oasis kommen beide vor', fundstellen: 'website-home Abschnitt 2; linkedin-post-1' }],
  luecken: ['Keine Quelle nennt das Gruendungsdatum.'],
  uebersprungen: ['Meeting-Notiz: persoenliche Bewertungen einzelner Personen ausgelassen'],
  konsumenten_anforderungen: ['CRM braucht Zielgruppen als feste Liste fuer das Feld Segment'],
}, null, 1)

const REGELN = `
AUFTRAG: Du sammelst belegte Fakten fuer den Firmenkontext von World Eden Era (WEE). Der Firmenkontext wird spaeter die einzige Orientierung fuer KI-Systeme (Social-Media-Board, CRM). Fehler hier werden ueberall wiederholt. Genauigkeit geht vor Menge.

KAPITEL (Feld kapitel, genau einer dieser Werte): ${KAPITEL.join(', ')}.
- identitaet: Name, Schreibweise, Rechtsform, Sitz, Gruendung, Gemeinnuetzigkeit, Team und Rollen (nur offiziell genannt)
- vision: Zukunftsbild, Leitsatz, langfristiges Ziel
- mission: was WEE konkret tut und wie
- werte: Grundsaetze, Haltungen, wofuer WEE steht
- projekte-angebot: Project Oasis, Pilotprojekt, Bildung, Simulator, Spiel, Angebote, Spendenwege
- zielgruppen: an wen sich WEE richtet (Spender, Partner, Gemeinden, Bildung, Foerderer ...)
- markensprache: Tonfall, Anrede (du/Sie), Satzbau, Lieblingswoerter, Emojis, Hashtags, Call-to-Actions, Stilregeln
- visuelle-identitaet: Farben mit exakten Werten, Schriften, Logo, Bildsprache, Gestaltungsregeln
- kanaele-formate: Website, LinkedIn, Instagram, weitere Kanaele, Formate, Reihen, Rhythmus
- glossar: Fachbegriffe und Eigennamen mit Schreibweise und Bedeutung
- sonstiges: Finanzierung, Partner, Foerderung, Organisation, alles andere

ARBEITSSCHRITTE (genau in dieser Reihenfolge):
1. Lies deine Quellen VOLLSTAENDIG. Lange Dateien liest du abschnittsweise mit dem Read-Werkzeug (offset/limit), bis zum Ende.
2. Schreibe je Quelle mit relevanz hoch oder mittel eine Auszugsdatei ${OUT}/auszuege/<slug>.md. Inhalt: Kopfzeilen "Quelle:", "Fundstelle:", "Abrufdatum: ${DATE}", "Stand der Quelle:", danach die relevanten Abschnitte WOERTLICH kopiert (nicht umformuliert, nicht innerhalb eines Satzes gekuerzt), jeweils mit einer Zeile "Fundstelle: ..." davor. Der slug besteht nur aus kleinen Buchstaben, Ziffern und Bindestrichen.
3. Schreibe ${OUT}/befunde-<agent>.json mit genau diesen Feldern (Beispiel, Werte erfunden):
${BEISPIEL}
   - quellen: JEDE gelesene Quelle, auch irrelevante (dann relevanz gering oder keine und auszugsdatei "-").
   - typ ist genau einer von: website, linkedin, instagram, drive, github-org, eigenes-projekt.
   - auszugsdatei steht relativ zu ${OUT}, also "auszuege/<slug>.md".
   - befunde: eine Aussage je Befund. zitat ist eine WOERTLICHE Kopie aus deiner Auszugsdatei (mindestens 8 Zeichen; Auslassungen nur mit "…"). Die Aussage behauptet nichts, was das Zitat nicht hergibt.
   - art: "explizit", wenn WEE es selbst sagt; "beobachtet", wenn es ein sichtbares Muster ist (Tonfall, Emojis, Farbwerte aus CSS); dann zeigt das Zitat ein Beispiel.
4. Fuehre aus: ${CHECK} ${OUT}/befunde-<agent>.json
   Meldet es Fehler, korrigiere Auszug oder Befund (Zitat exakt aus dem Auszug kopieren, fehlende Auszugsdatei anlegen) und fuehre es erneut aus, bis die Ausgabe mit BEFUNDE-OK beginnt. Hoechstens 5 Durchlaeufe.
5. Gib zurueck: agent, pruefung (letzte Ausgabezeile des Pruefbefehls, woertlich), Anzahl quellen, befunde, widersprueche, hinweise (Probleme, ein Satz je Punkt).

VERBOTE:
- Nichts raten, nichts aus eigenem Wissen ergaenzen. Was nicht woertlich in einer Quelle steht, gehoert in luecken.
- Nur lesen: nichts aendern, nicht committen, nicht pushen, nichts ausser den genannten Werkzeugen installieren, Google Drive NICHT aufrufen. Du schreibst ausschliesslich die zwei genannten Dateiarten unter ${OUT}.
- Datenschutz: Namen und Rollen nur so, wie WEE sie offiziell nennt. Keine privaten Kontaktdaten, Bank-, Spender-, Vertrags-, Gehalts- oder Gesundheitsdaten, keine Aussagen einzelner ueber andere Personen. Was du deshalb auslaesst, nennst du in uebersprungen (nur die Art).
- Alte Ablage tabu: Repo world-eden-era/wee-drive-management, AGENTS.md-Ablageregeln, Drive-Inventuren und jede Beschreibung von Ordnern oder Pfaden der alten Drive-Ablage.
- Widersprueche meldest du, du loest sie nicht auf. Meeting-Notizen sind Arbeitsstaende: die Aussage beginnt mit "Laut Meeting-Notiz vom <Datum>: ".
- Abhaengige Quellen benennst du in abhaengig_von (Live-Website stammt aus Repo BenWEE-cell/world-eden-era; LinkedIn- und Instagram-Beitraege sind inhaltsgleich; Versionen desselben Dokuments).
`

const WEB = [
  { key: 'website-live', text: `Quelle: Live-Website https://www.world-eden-era.org (typ website). Hole sitemap.xml und alle Seiten aus Navigation und Footer, deutsch und englisch, mit curl -sL (Bash). Wandle HTML in Text um (z. B. python3 mit html.parser) und lies jede Seite: Start, Organisation, Grundsaetze, Project Oasis, Pilotprojekt, Bildung mit Unterseiten, FAQ, Impressum (Rechtsform, Sitz, Vertretung, Register), Spenden/Mitmachen, Datenschutz nur fuer Identitaet. slug je Seite: website-<seite> bzw. website-en-<seite>. abhaengig_von: "Inhalt aus Repo BenWEE-cell/world-eden-era content/".` },
  { key: 'website-code', text: `Quelle: lokales Website-Repo /Users/benknaute/Claude/Projects/Keel-Harness/user-projects/wee-website-v2 (GitHub BenWEE-cell/world-eden-era, typ eigenes-projekt). Stand: origin/main 2ed0948 vom 09.10.2026 (geprueft am 11.10.2026). Lies vollstaendig: design-system/, app/globals.css, tailwind- und next-Konfiguration (Farben, Schriften), public/ nur Dateinamen von Logos, README.md, CLAUDE.md, CONTRIBUTING.md, internal-docs/ (Doku, Stil- und Inhaltsregeln). content/*.json nur fuer Begriffe und Schreibweisen (Seitentexte liest der Agent website-live). Schwerpunkt: visuelle-identitaet (exakte Farbwerte, Schriftnamen, Logo-Regeln), markensprache (Stilregeln), glossar. Kein Build, kein git ausser log und show.` },
  { key: 'website-v2-alt', text: `Quelle: oeffentliches Repo https://github.com/benni-cmd/WEE-Website-V2 (typ eigenes-projekt), Zugriff mit gh api. Es ist der VORGAENGER der Live-Website (Stand 19.08.2026; das Live-Repo beginnt am 19.08.2026 mit einem Import davon). abhaengig_von: "Vorgaenger von BenWEE-cell/world-eden-era, Stand 19.08.2026". Lies nur .claude/plans/*.md (Design- und Inhaltsrunden), CLAUDE.md/README und content/-Dateien, die vom heutigen Stand unter /Users/benknaute/Claude/Projects/Keel-Harness/user-projects/wee-website-v2/content abweichen. Jede Aussage beginnt mit "Stand 19.08.2026 (Vorgaenger): ". Abweichungen zum heutigen Stand in widersprueche.` },
  { key: 'social', text: `Quellen: (1) LinkedIn https://www.linkedin.com/company/world-eden-era/ (typ linkedin): curl -sL -A "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128 Safari/537.36" -H "Accept-Language: de-DE", dann Text extrahieren: Info, Slogan, Branche, Groesse, Sitz, genannte Beschaeftigte, voller Wortlaut jedes Beitrags mit Alter. Je Beitrag ein slug linkedin-post-<nr>. (2) Instagram @worldedenera (typ instagram): NUR die Datei ${PKG}/design/social/instagram-2026-10-11.md lesen (Instagram nicht selbst abrufen; ohne Login nur 12 von 21 Beitraegen erfasst). Schwerpunkt: markensprache, kanaele-formate, werte, vision, mission.` },
  { key: 'business-plan', text: `Quelle: Repo world-eden-era/wee-business-plan (typ github-org, privat), Zugriff mit gh api (Baum: gh api "repos/world-eden-era/wee-business-plan/git/trees/HEAD?recursive=1"; Datei: gh api repos/world-eden-era/wee-business-plan/contents/<pfad> --jq .content | base64 -d). Binaerdateien in ein neues leeres Verzeichnis unter ${H}/.recherche-cache/bp/ laden; docx mit textutil -convert txt lesen; PDF mit python3 und dem Modul pypdf aus ${H}/.recherche-cache/venv (falls nicht vorhanden: python3 -m venv ${H}/.recherche-cache/venv, dann ${H}/.recherche-cache/venv/bin/pip install pypdf). Schwerpunkt: identitaet, vision, mission, werte, projekte-angebot, zielgruppen, sonstiges. Keine Kontonummern, keine Betraege einzelner Personen.` },
  { key: 'rootwork-crm', text: `Quellen: Repos world-eden-era/rootwork und world-eden-era/wee-rootwork-harness-setup (typ github-org, privat, gh api) und der CRM-Showcase https://showcase-rootwork.vercel.app/#/dashboard (typ eigenes-projekt; nur Beispielkontext, das finale CRM laeuft woanders; Single-Page-App: per curl die index.html und die dort verlinkten JS-Dateien laden und nach Texten suchen). Klaere: was ist rootwork, welche Entitaeten, Felder, Prozesse, welchen Firmenkontext braucht das CRM (konsumenten_anforderungen ausfuehrlich). Erfasse ausserdem jeden Firmenkontext-Befund dort.` },
  { key: 'oasis-game', text: `Quellen: Repos world-eden-era/oasis-simulation-app und world-eden-era/wee-geodome-game (typ github-org, privat, gh api) und https://showcase-oasis-simulator.vercel.app/ui-prototype/ (typ eigenes-projekt, curl). READMEs, Doku, Oberflaechentexte, i18n-Dateien. Schwerpunkt: projekte-angebot (Project Oasis, Geodome, Aquaponik, Pilotprojekt), glossar, zielgruppen.` },
  { key: 'website-leon', text: `Quellen: Repos world-eden-era/wee-website-labor-leon (enthaelt die Sicherung der alten Hostinger-Seite) und world-eden-era/wee-website-relaunce-leon (Relaunch-Stand 13.07.2026), typ github-org, privat, gh api. Texte der alten Seite und des Relaunch-Prototyps. Jede Aussage beginnt mit "Alte Seite: " bzw. "Relaunch 13.07.2026: ". Abweichungen zur heutigen Live-Seite in widersprueche.` },
  { key: 'social-media-board', text: `Quellen: lokale Ordner "/Users/benknaute/Claude/Projects/Social Media Dashboard" (README.md, docs/*.md, app/, assets/ nur Dateinamen) und "/Users/benknaute/Claude/Projects/Social-Media-Workflow" (CLAUDE.md, README.txt, UMBAU-PLAN_Live-Betrieb.md, system-spezifikation.html, social-media-workflow-dashboard.html als Text), typ eigenes-projekt. Schwerpunkt: markensprache, kanaele-formate, zielgruppen, Content-Strategie; konsumenten_anforderungen ausfuehrlich.` },
  { key: 'social-media-dashboard-repo', text: `Quelle: oeffentliches Repo https://github.com/benni-cmd/social-media-dashboard (typ eigenes-projekt, vom Owner am ${DATE} genannt), gh api (Baum: gh api "repos/benni-cmd/social-media-dashboard/git/trees/main?recursive=1"). README, Doku, Strategie-, Prompt- und Konfigurationsdateien, Oberflaechentexte, Commit-Datum fuer den Stand. Verhaeltnis zu den lokalen Ordnern "Social Media Dashboard" und "Social-Media-Workflow" in abhaengig_von. Schwerpunkt: markensprache, kanaele-formate, zielgruppen; konsumenten_anforderungen ausfuehrlich (welchen Firmenkontext das Board braucht, in welchem Format).` },
  { key: 'weitere-eigene', text: `Quellen, je auf WEE-Bezug pruefen: (a) gh: BenWEE-cell/portfolio-digital-services, BenWEE-cell/sveltia-cms-auth (ohne Bezug nur in uebersprungen). (b) lokale Ordner /Users/benknaute/Claude/Projects/WEEC und "/Users/benknaute/Claude/Projects/World Eden Era Website" (vermutlich leer). (c) OWNER.md-Dateien unter /Users/benknaute/Claude/Projects/Keel-Harness/user-projects/wee-website-v2/docs/packages/*/OWNER.md: Owner-Aussagen ueber WEE (typ eigenes-projekt). (d) gh api orgs/world-eden-era: Beschreibung, Website. Das Repo wee-drive-management ist tabu.` },
]

const LESEPAKETE = [{"paket": "drive-01", "dateien": ["D003-T1", "D034", "D073", "D145", "D146", "D150", "D152", "D154", "D157"]}, {"paket": "drive-02", "dateien": ["D003-T2", "D043", "D156"]}, {"paket": "drive-03", "dateien": ["D003-T3", "D065", "D093"]}, {"paket": "drive-04", "dateien": ["D003-T4", "D022", "D064", "D099"]}, {"paket": "drive-05", "dateien": ["D003-T5", "D039", "D159"]}, {"paket": "drive-06", "dateien": ["D003-T6", "D019", "D047"]}, {"paket": "drive-07", "dateien": ["D033", "D040-T1", "D051"]}, {"paket": "drive-08", "dateien": ["D094", "D124"]}, {"paket": "drive-09", "dateien": ["D027", "D044", "D054"]}, {"paket": "drive-10", "dateien": ["D048", "D056", "D143"]}, {"paket": "drive-11", "dateien": ["D046", "D132", "D142", "D170"]}, {"paket": "drive-12", "dateien": ["D024", "D030", "D140"]}, {"paket": "drive-13", "dateien": ["D045", "D091", "D165"]}, {"paket": "drive-14", "dateien": ["D021", "D023", "D181"]}, {"paket": "drive-15", "dateien": ["D020", "D077", "D171"]}, {"paket": "drive-16", "dateien": ["D003-T7", "D069", "D088", "D096"]}, {"paket": "drive-17", "dateien": ["D028", "D058", "D109"]}, {"paket": "drive-18", "dateien": ["D085", "D097", "D125", "D168"]}, {"paket": "drive-19", "dateien": ["D025", "D062", "D070", "D141"]}, {"paket": "drive-20", "dateien": ["D004", "D060", "D126", "D166"]}, {"paket": "drive-21", "dateien": ["D010", "D018", "D026", "D049", "D067"]}, {"paket": "drive-22", "dateien": ["D005", "D013", "D042", "D061", "D081", "D092", "D095", "D105"]}, {"paket": "drive-23", "dateien": ["D009", "D032", "D036", "D037", "D040-T2", "D059", "D072", "D075", "D101", "D106", "D111", "D189"]}, {"paket": "drive-24", "dateien": ["D038", "D052", "D055", "D057", "D074", "D079", "D080", "D098", "D103", "D131", "D136", "D174", "D176", "D182", "D183", "D184", "D186", "D187", "D188"]}, {"paket": "drive-25", "dateien": ["D002", "D007", "D008", "D011", "D012", "D016", "D029", "D041", "D053", "D076", "D084", "D089", "D100", "D107", "D108", "D128", "D139", "D148", "D149", "D173", "D175", "D177", "D185"]}, {"paket": "drive-26", "dateien": ["D006", "D014", "D015", "D017", "D031", "D035", "D050", "D063", "D071", "D078", "D082", "D083", "D086", "D087", "D090", "D102", "D104", "D112", "D114", "D115", "D116", "D117", "D118", "D119", "D120", "D121", "D122", "D123", "D127", "D130", "D133", "D134", "D135", "D137", "D138", "D144", "D158", "D161", "D162", "D169", "D172", "D178", "D179", "D180"]}]

const DRIVE = LESEPAKETE.map(p => ({
  key: p.paket,
  text: `Quellen (typ drive): Textkopien von Dokumenten der geteilten Google-Drive-Ablage "World Eden Era" unter ${CORPUS}/<Nr>.txt. Jede Datei beginnt mit Drive-Dateiname, Drive-ID und Aenderungsdatum; Teile grosser Dateien heissen <Nr>-T<n>. Deine Dateien: ${p.dateien.map(f => f + '.txt').join(', ')}. slug je Datei: drive-<Nr in Kleinbuchstaben> (z. B. drive-d040 oder drive-d003-t2). fundstelle: "Drive: <Dateiname> (ID <Drive-ID>), <Abschnitt/Folie/Blatt>". Bei HTML oder Code (Design-System, Konzeptdokumente, CRM-Quelltext) liest du Texte und fuer visuelle-identitaet Farbwerte, Schriften und Logo-Angaben.`,
}))

const TASKS = [...WEB, ...DRIVE].filter(t => !ONLY || ONLY.includes(t.key))
if (ONLY) log(`Nur diese Agenten: ${TASKS.map(t => t.key).join(', ')}`)

const run = (t, extra) => agent(`${REGELN}\n\nDEIN AGENTENNAME (fuer Dateinamen): ${t.key}\n\nDEINE QUELLEN:\n${t.text}${extra || ''}`,
  { label: `recherche:${t.key}`, phase: extra ? 'Reparatur' : 'Recherche', schema: SCHEMA, model: MODEL })

phase('Recherche')
const results = await pipeline(TASKS,
  t => run(t),
  (r, t) => {
    if (r && String(r.pruefung).startsWith('BEFUNDE-OK')) return { key: t.key, ...r }
    const fehler = r ? r.pruefung : 'kein Ergebnis'
    return run(t, `\n\nREPARATUR: Ein frueherer Lauf hat diese Quellen bearbeitet; die Pruefung endete mit: "${fehler}". Lies ${OUT}/befunde-${t.key}.json, falls vorhanden, behebe alle Fehler nach Schritt 4 und ergaenze fehlende Quellen.`)
      .then(r2 => r2 ? { key: t.key, ...r2 } : null)
  })

const ok = results.filter(r => r && String(r.pruefung).startsWith('BEFUNDE-OK'))
const rot = TASKS.map(t => t.key).filter(k => !ok.some(r => r.key === k))
if (rot.length) log(`Nach Reparatur weiter rot oder ohne Ergebnis: ${rot.join(', ')}`)

phase('Luecken')
const luecken = ONLY ? null : await agent(`Du bist Lueckenpruefer fuer den Firmenkontext von World Eden Era. Alle Befunde liegen in ${OUT}/befunde-*.json, die Auszuege in ${OUT}/auszuege/.
Arbeitsschritte:
1. Fuehre aus: ${CHECK} --alle und notiere die Ausgabe.
2. Lies alle befunde-*.json. Erstelle je Kapitel (${KAPITEL.join(', ')}): was belegt ist (Stichworte), was fuer einen vollstaendigen Firmenkontext fehlt, und welche Aussagen nur EINE unabhaengige Quelle haben (abhaengige Quellen zaehlen als eine).
3. Fuehre alle widersprueche zusammen (Dubletten entfernen), je mit Fundstellen.
4. Fasse alle konsumenten_anforderungen von CRM und Social-Media-Board zusammen.
5. Liste Fragen, die nur der Owner beantworten kann, je konkret und mit Optionen aus den Quellen.
Schreibe alles als Markdown nach ${OUT}/luecken.md und gib den Text zurueck. Nichts raten.`, { label: 'luecken', phase: 'Luecken', model: MODEL })

return { gruen: ok.map(r => r.key), rot, befunde: ok.reduce((n, r) => n + (r.befunde || 0), 0), luecken_geschrieben: !!luecken }
