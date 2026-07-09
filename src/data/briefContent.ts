export interface Medication {
  name: string;
  source: string;
}

export interface Flag {
  severity: "critical" | "moderate";
  text: string;
}

export const medications: Medication[] = [
  { name: "Lisinopril 10mg daily", source: "EPIC · PCP" },
  { name: "Sumatriptan 50mg as-needed", source: "RX · Walgreens" },
];

export const flags: Flag[] = [
  {
    severity: "critical",
    text: "Interaction risk — sumatriptan + borderline QT prolongation (Cardiology, May 2) — no cross-check occurred at time of prescribing",
  },
  {
    severity: "moderate",
    text: "Lab follow-up gap — elevated potassium (Jun 18) — no follow-up on file, and lisinopril can raise potassium further",
  },
];

export const gaps: string[] = [
  "ER-recommended cardiology follow-up (Apr 29) never scheduled",
  "Last EKG on file is 6 weeks old",
];

export const signoffLine =
  "I've reviewed this brief against the chart. It informs, but doesn't replace, my clinical judgment.";
