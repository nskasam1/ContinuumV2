export interface SourceRecord {
  id: string;
  system: string;
  facility: string;
  date: string;
  note: string;
  accentVar: string;
  caption: string;
}

export const sourceRecordsIntro =
  "Below are five real entries for the same patient — each one lives in a different, disconnected system. In real care, no one sees all five at once.";

export const sourceRecords: SourceRecord[] = [
  {
    id: "epic",
    system: "EPIC",
    facility: "PCP Office",
    date: "Jun 14, 2026",
    note: "Visit note: pt reports fatigue, occasional dizziness. Started lisinopril 10mg for BP mgmt. F/u in 3 months.",
    accentVar: "--src-epic",
    caption: "Primary care doctor's electronic record",
  },
  {
    id: "rx",
    system: "RX",
    facility: "Walgreens",
    date: "Jun 20, 2026",
    note: "Fill history: sumatriptan 50mg, qty 9, prescribed by Dr. Osei (Neurology) — migraine, as-needed.",
    accentVar: "--src-rx",
    caption: "Pharmacy prescription history",
  },
  {
    id: "cerner",
    system: "Cerner",
    facility: "Cardiology",
    date: "May 02, 2026",
    note: "Consult note: borderline QT prolongation on EKG, monitor with any new prescriptions. No action taken.",
    accentVar: "--src-cerner",
    caption: "Cardiologist's own hospital system",
  },
  {
    id: "quest",
    system: "Quest Diagnostics",
    facility: "",
    date: "Jun 18, 2026",
    note: "Lab panel: potassium 5.3 mmol/L (high). Ordering provider: PCP office. No follow-up scheduled.",
    accentVar: "--src-quest",
    caption: "Independent lab testing company",
  },
  {
    id: "er",
    system: "ER",
    facility: "City General",
    date: "Apr 29, 2026",
    note: "D/c summary: presented with palpitations, ruled out MI. Advised outpatient cardiology f/u — no record of scheduling found elsewhere.",
    accentVar: "--src-er",
    caption: "A different hospital's emergency department",
  },
];
