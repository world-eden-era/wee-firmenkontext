# Gates: firmenkontext-recherche

- [ ] G1: Der Owner hat jedes Kapitel und die Kurzfassung freigegeben.
  Manuell: Owner gibt jedes der zehn Kapitel in kontext/ und FIRMENKONTEXT.md im Chat frei; sein Wortlaut steht im Beleg evidence/owner-freigabe.md
  EVIDENCE: pending

- [ ] G2: Die geteilte Drive-Ablage bleibt unveraendert; der Drive-Zugang ist technisch auf Lesen begrenzt.
  CHECK: rclone config show wee-drive | grep -qx 'scope = drive.readonly' && rclone config show wee-drive | grep -qx 'team_drive = 0AEfqsTjbSPXxUk9PVA' && echo NUR-LESEN
  CWD: .
  EXPECT: NUR-LESEN
  EVIDENCE: pending
