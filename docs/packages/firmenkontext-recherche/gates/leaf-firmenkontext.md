# Leaf: leaf-firmenkontext

OWNS: quellen/**, kontext/**, FIRMENKONTEXT.md, OFFENE-FRAGEN.md

MODEL: claude claude-opus-5-5 high

Scope: Der Firmenkontext ist nach aktuellem Stand neu recherchiert aus der Website www.world-eden-era.org, dem LinkedIn- und dem Instagram-Kanal von World Eden Era, den Inhalten der geteilten Drive-Ablage, den Repos der GitHub-Orga world-eden-era und den eigenen Projekten; jede Quelle steht mit Fundstelle, Abrufdatum und Auszug im Register quellen/REGISTER.md. Der Firmenkontext beschreibt strukturiert in kontext/ die Kapitel Identitaet, Vision, Mission, Werte, Projekte und Angebot, Zielgruppen, Markensprache, Visuelle Identitaet, Kanaele und Formate sowie Glossar, und FIRMENKONTEXT.md fasst ihn als Orientierungspunkt fuer KI-Systeme wie Social-Media-Board und CRM zusammen. Nichts ist geraten oder angenommen: jede Aussage in kontext/ und FIRMENKONTEXT.md verweist auf mindestens einen Registereintrag, Unbelegtes und Widersprueche stehen in OFFENE-FRAGEN.md zur Entscheidung des Owners.

- [ ] L1: Der Firmenkontext ist nach aktuellem Stand neu recherchiert aus der Website www.world-eden-era.org, dem LinkedIn- und dem Instagram-Kanal von World Eden Era, den Inhalten der geteilten Drive-Ablage, den Repos der GitHub-Orga world-eden-era und den eigenen Projekten; jede Quelle steht mit Fundstelle, Abrufdatum und Auszug im Register quellen/REGISTER.md.
  CHECK: node checks/check-firmenkontext.mjs quellen
  CWD: .
  EXPECT: QUELLEN-OK
  EVIDENCE: pending

- [ ] L2: Der Firmenkontext beschreibt strukturiert in kontext/ die Kapitel Identitaet, Vision, Mission, Werte, Projekte und Angebot, Zielgruppen, Markensprache, Visuelle Identitaet, Kanaele und Formate sowie Glossar, und FIRMENKONTEXT.md fasst ihn als Orientierungspunkt fuer KI-Systeme wie Social-Media-Board und CRM zusammen.
  CHECK: node checks/check-firmenkontext.mjs kapitel
  CWD: .
  EXPECT: KAPITEL-OK
  EVIDENCE: pending

- [ ] L3: Nichts ist geraten oder angenommen: jede Aussage in kontext/ und FIRMENKONTEXT.md verweist auf mindestens einen Registereintrag, Unbelegtes und Widersprueche stehen in OFFENE-FRAGEN.md zur Entscheidung des Owners.
  CHECK: node checks/check-firmenkontext.mjs belege
  CWD: .
  EXPECT: BELEGE-OK
  EVIDENCE: pending

