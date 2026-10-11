# Arbeitsanweisung leaf-firmenkontext

Verbindlich fuer den Arbeitsschritt `leaf-firmenkontext` des Pakets `firmenkontext-recherche`.
Der Originalauftrag steht in `OWNER.md`; diese Anweisung legt nur Form und Grenzen fest.

## Eingaben

1. `design/recherche/befunde-*.json` und `design/recherche/auszuege/*.md`: Befunde der Recherche
   vom 11.10.2026 mit woertlichen Zitaten und Fundstellen (Website, LinkedIn, Instagram, Drive,
   GitHub-Orga, eigene Projekte).
2. `design/recherche/faktenbasis/*.md` (sobald vorhanden): je Kapitel gegengepruefte Aussagen mit
   Angabe, wie viele unabhaengige Quellen sie tragen, und die zusammengefuehrten Widersprueche.
3. `design/social/instagram-2026-10-11.md`: Instagram-Rohdaten (12 von 21 Beitraegen, ohne Login).
4. `design/owner-entscheidungen.md` (sobald vorhanden): Antworten des Owners auf offene Fragen,
   je mit Datum und Wortlaut. Jede Antwort wird ein Registereintrag vom Typ `owner`.
5. `design/recherche/kapitel/_quellen.json` (alle Quellen mit Fundstelle und Auszugsdatei) und
   `design/recherche/kapitel/_konsumenten.json` (was CRM und Social-Media-Board brauchen): die
   Kapitel decken diese Anforderungen ab, soweit Belege da sind.

Vorrang: Owner-Entscheidung vor Abschnitt „Gesichert" vor „Eine Quelle". Zeilen aus
„Arbeitsstand" und „Entfernt" der Faktenbasis kommen nicht in den Kontext.

## Ausgaben (nur diese Dateien, OWNS)

- `quellen/REGISTER.md`: eine Tabelle, je Quelle eine Zeile
  `| Qnnn | typ | fundstelle | JJJJ-MM-TT | quellen/auszuege/Qnnn.md |`.
  typ ist genau einer von: website, linkedin, instagram, drive, github-org, eigenes-projekt, owner.
  Das Datum ist das Abrufdatum (Recherche: 2026-10-11; Owner-Entscheidung: Datum der Nachricht).
- `quellen/auszuege/Qnnn.md`: woertlicher Auszug der Quelle (aus `design/recherche/auszuege/`
  uebernommen, Kopf mit Quelle, Fundstelle, Stand). Owner-Entscheidungen: Wortlaut der Nachricht.
- `kontext/01-identitaet.md` … `kontext/10-glossar.md` (Dateinamen exakt wie in
  `checks/check-firmenkontext.mjs`).
- `FIRMENKONTEXT.md`: Kurzfassung aller Kapitel zum direkten Einbinden in KI-Prompts.
- `OFFENE-FRAGEN.md`: alles, was nicht belegt oder widerspruechlich ist, je Frage mit Fundstellen
  und, wo die Quellen sie zeigen, Optionen.

## Regeln

1. Jede Inhaltszeile in `kontext/` und `FIRMENKONTEXT.md` traegt mindestens einen Verweis `[Qnnn]`
   auf einen Registereintrag. Ueberschriften und Tabellentrenner zaehlen nicht als Inhaltszeile.
   Pruefung: `node checks/check-firmenkontext.mjs quellen|kapitel|belege` muss QUELLEN-OK,
   KAPITEL-OK und BELEGE-OK melden.
2. Nichts raten, nichts glaetten: Steht eine Aussage nur in einer unabhaengigen Quelle, bleibt sie
   im Kontext, wenn die Quelle offiziell von WEE stammt (Website, Kanaele, Businessplan,
   Konzeptdokumente); sie wird dann mit dem Zusatz „(eine Quelle)“ markiert. Widersprueche,
   veraltete Staende und reine Arbeitsnotizen (Meeting-Notizen) kommen nicht als Tatsache in den
   Kontext, sondern nach `OFFENE-FRAGEN.md`, bis der Owner entschieden hat.
3. Abhaengige Quellen zaehlen als eine: Live-Website und ihr Repo; LinkedIn und Instagram bei
   inhaltsgleichen Beitraegen; mehrere Versionen desselben Dokuments.
4. Datenschutz: Namen und Rollen nur, wie WEE sie offiziell nennt. Keine privaten Kontaktdaten,
   Bank-, Spender-, Vertrags-, Gehalts- oder Gesundheitsdaten, keine Aussagen einzelner ueber
   andere Personen aus Meeting-Notizen.
5. Keine Aussagen ueber die Ordnerstruktur des alten Drives; die Drive-Struktur ist ein eigenes
   Paket.
6. Form fuer KI-Systeme: jedes Kapitel beginnt mit einem Absatz „Kurz“ (2 bis 4 Saetze), danach
   gegliederte Punkte. Das Kapitel Markensprache enthaelt Tonalitaet, Anrede, Satzbau,
   Wortschatz (bevorzugt / vermeiden), Schreibweisen von Eigennamen, Emojis und Hashtags,
   Call-to-Actions und je Kanal Beispiele, alles belegt. Glossar: Begriff, Schreibweise,
   Bedeutung, Quelle. Deutsch als Hauptsprache; englische Fassungen nur, wo WEE sie selbst nutzt
   (z. B. Slogan).
7. Nicht committen; `checks/` nicht aendern.
