export interface TranscriptEntry {
  speaker: "CLINICIAN" | "LIVE_ES" | "PATIENT" | "LIVE_EN";
  text: string;
}

export const transcriptEntries: TranscriptEntry[] = [
  {
    speaker: "CLINICIAN",
    text: "I want to adjust your blood pressure medication and order a follow-up EKG.",
  },
  {
    speaker: "LIVE_ES",
    text: "Quiero ajustar su medicamento para la presión y pedir un electrocardiograma de seguimiento.",
  },
  {
    speaker: "PATIENT",
    text: "¿Esto tiene que ver con los mareos que he tenido?",
  },
  {
    speaker: "LIVE_EN",
    text: "Is this related to the dizziness I've been having?",
  },
];

export const languageBadges = {
  preferred: "Preferred language: Spanish",
  lep: "Limited English proficiency: flagged",
};

export const highStakesPrompt =
  "Is this a high-stakes conversation? (informed consent, new diagnosis disclosure, end-of-life)";

export const aiSummary = {
  label: "AI-generated · flagged for clinician confirmation",
  en: "Started a new blood pressure medicine today. Take it once a day. We're also scheduling a heart-rhythm test (EKG) because of a lab result. If you feel very dizzy or your heart races, call the office.",
  es: "Hoy comenzamos un nuevo medicamento para la presión arterial. Tómelo una vez al día. También vamos a programar una prueba del ritmo cardíaco (electrocardiograma) debido a un resultado de laboratorio. Si siente mucho mareo o el corazón le late muy rápido, llame al consultorio.",
};

export const humanRoutedSummary = {
  label: "Routed to certified human interpreter",
  text: "This conversation is flagged high-stakes. Continuum does not generate or deliver an AI translation here — it supplies a transcript to support a certified medical interpreter, who communicates the summary directly with the patient.",
};

export const thesisStatement =
  "Every fact and every sentence here already existed — in a system, or in a language, someone already spoke. Continuum's only job is closing the access gap between where something already exists and where a decision needs it. The sign-off checkbox and the high-stakes toggle are both deliberate — the system is built to stop short of a decision on purpose.";

export const stepLabels = ["Synthesize records", "Bridge the language gap", "Store & carry forward"];
