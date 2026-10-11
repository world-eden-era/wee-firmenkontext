# Work package: firmenkontext-recherche

**Problem:** Die KI-Systeme von World Eden Era (Social-Media-Board, internes CRM und weitere) haben keinen einheitlichen, aktuellen Firmenkontext mit Markensprache, inhaltlicher Ausrichtung, Vision, Mission und Werten.
**Intent:** Jedes KI-System von World Eden Era liest denselben belegten Firmenkontext aus einer Quelle in GitHub und arbeitet damit im Sinne der Marke.
**Goal:** Das Repo world-eden-era/wee-firmenkontext enthaelt den nach aktuellem Stand neu recherchierten Firmenkontext in zehn Kapiteln plus Kurzfassung FIRMENKONTEXT.md; jede Aussage verweist auf einen Eintrag im Quellenregister, Unbelegtes und Widersprueche stehen in OFFENE-FRAGEN.md statt im Kontext, der Owner hat jedes Kapitel freigegeben, und die geteilte Drive-Ablage wurde nur lesend genutzt.
**Scope:** Drin: Recherche aus www.world-eden-era.org, LinkedIn linkedin.com/company/world-eden-era, Instagram instagram.com/worldedenera, Inhalten der geteilten Drive-Ablage World Eden Era (nur lesen), Repos der GitHub-Orga world-eden-era und eigenen Projekten; Quellenregister mit Auszuegen; zehn Kapitel; Kurzfassung fuer KI-Prompts; offene Fragen Nicht drin: Drive-Struktur (eigenes Paket im Repo wee-drive-struktur); Auswertung des Repos wee-drive-management und der alten Ordnerstruktur; jede Aenderung im Drive; neue Drive-Ablage; Datenmigration (macht der Admin-Account info@world-eden-era.org); Aenderungen an CRM oder Social-Media-Board; Pruefskripte unter checks/
**Context:** CRM-Showcase https://showcase-rootwork.vercel.app/#/dashboard ist nur Beispielkontext, das finale System laeuft woanders. Drive-Lesezugang ueber rclone-Remote wee-drive mit Scope drive.readonly, Konto benknaute@world-eden-era.org, geteilte Ablage 0AEfqsTjbSPXxUk9PVA. Social-Media-Rohtexte legt der Orchestrator vorab unter docs/packages/firmenkontext-recherche/design/social/ ab. Pruefskript checks/check-firmenkontext.mjs steht fest und ist nicht Teil des Arbeitsschritts. Verbindliche Arbeitsanweisung fuer den Arbeitsschritt (Registerformat, Dateinamen, Quellenliste, Datenschutzgrenzen): docs/packages/firmenkontext-recherche/design/arbeitsanweisung.md.

## Plan

1. [ ] Drive-Lesezugang einrichten und Social-Media-Rohtexte sammeln (Orchestrator)
2. [ ] Quellen erfassen: Website, LinkedIn, Instagram, Drive-Inhalte, GitHub-Orga, eigene Projekte, je mit Auszug und Abrufdatum im Register
3. [ ] Zehn Kapitel, Kurzfassung und offene Fragen mit Quellenverweisen schreiben
4. [ ] Offene Fragen vom Owner entscheiden lassen und einarbeiten
5. [ ] Owner-Freigabe je Kapitel und Kurzfassung einholen

## Status

2026-10-11 - Angelegt mit package-standard.mjs create; nicht gestartet.
Owner-Start: 2026-10-11 "Los gehts"

## Abnahme

- C1 -> gates/leaf-firmenkontext.md:L1: Der Firmenkontext ist nach aktuellem Stand neu recherchiert aus der Website www.world-eden-era.org, dem LinkedIn- und dem Instagram-Kanal von World Eden Era, den Inhalten der geteilten Drive-Ablage, den Repos der GitHub-Orga world-eden-era und den eigenen Projekten; jede Quelle steht mit Fundstelle, Abrufdatum und Auszug im Register quellen/REGISTER.md.
- C2 -> gates/leaf-firmenkontext.md:L2: Der Firmenkontext beschreibt strukturiert in kontext/ die Kapitel Identitaet, Vision, Mission, Werte, Projekte und Angebot, Zielgruppen, Markensprache, Visuelle Identitaet, Kanaele und Formate sowie Glossar, und FIRMENKONTEXT.md fasst ihn als Orientierungspunkt fuer KI-Systeme wie Social-Media-Board und CRM zusammen.
- C3 -> gates/leaf-firmenkontext.md:L3: Nichts ist geraten oder angenommen: jede Aussage in kontext/ und FIRMENKONTEXT.md verweist auf mindestens einen Registereintrag, Unbelegtes und Widersprueche stehen in OFFENE-FRAGEN.md zur Entscheidung des Owners.
- C4 -> GATES.md:G2: Die geteilte Drive-Ablage bleibt unveraendert; der Drive-Zugang ist technisch auf Lesen begrenzt.
- C5 -> GATES.md:G1: Der Owner hat jedes Kapitel und die Kurzfassung freigegeben.

## Abschluss

Coverage: 5/5 Owner-Anforderungen gemappt; 0/5 erfüllt.
Fulfillment: nicht erfuellt - Paket angelegt, nicht gestartet.
Geprueft gegen: package-cli doctor.
Offen: Plan-Schritte 1 bis 5.

## Anhang

### Depth Tree

- ROOT GATES.md <- none: Das Repo world-eden-era/wee-firmenkontext enthaelt den nach aktuellem Stand neu recherchierten Firmenkontext in zehn Kapiteln plus Kurzfassung FIRMENKONTEXT.md; jede Aussage verweist auf einen Eintrag im Quellenregister, Unbelegtes und Widersprueche stehen in OFFENE-FRAGEN.md statt im Kontext, der Owner hat jedes Kapitel freigegeben, und die geteilte Drive-Ablage wurde nur lesend genutzt.
- LEAF gates/leaf-firmenkontext.md <- GATES.md: Der Firmenkontext ist nach aktuellem Stand neu recherchiert aus der Website www.world-eden-era.org, dem LinkedIn- und dem Instagram-Kanal von World Eden Era, den Inhalten der geteilten Drive-Ablage, den Repos der GitHub-Orga world-eden-era und den eigenen Projekten; jede Quelle steht mit Fundstelle, Abrufdatum und Auszug im Register quellen/REGISTER.md.
