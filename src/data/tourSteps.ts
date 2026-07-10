export type TourGate = "none" | "synthesized" | "signedOff" | "generatedOnce" | "regenerated";

export interface TourStep {
  title: string;
  body: string;
  target?: string;
  gate: TourGate;
}

export const tourSteps: TourStep[] = [
  {
    title: "Welcome to Continuum",
    body: "This is a simulated walkthrough of two capabilities: synthesizing a patient's scattered medical history, and bridging a language gap during the visit. Click Next to begin.",
    gate: "none",
  },
  {
    title: "Five disconnected records",
    body: "These are five real entries for the same patient, pulled from five separate systems — a doctor's office, a pharmacy, a specialist, a lab, and an ER. In real life, none of these systems talk to each other.",
    target: "source-cards",
    gate: "none",
  },
  {
    title: "Collapse them into one brief",
    body: 'Click "Synthesize" to see Continuum pull these five fragments into a single clinician-ready brief.',
    target: "synthesize-button",
    gate: "synthesized",
  },
  {
    title: "The synthesized brief",
    body: "Continuum cross-references medications, flags risks a human might miss, and surfaces care gaps — all pulled automatically from the five records you just saw.",
    target: "brief-panel",
    gate: "none",
  },
  {
    title: "The first human checkpoint",
    body: "Continuum never makes the clinical call. Check the box and confirm to move forward — a clinician has to sign off before this brief goes anywhere.",
    target: "signoff-bar",
    gate: "signedOff",
  },
  {
    title: "A language gap, live",
    body: "This patient has limited English proficiency, flagged automatically. Below is a live visit — the clinician and patient are speaking in real time, and each side sees a live translation of the other.",
    target: "bridge-intro",
    gate: "none",
  },
  {
    title: "The second human checkpoint",
    body: "This toggle is the rule that matters most: if a conversation is high-stakes — informed consent, a new diagnosis, end-of-life — Continuum refuses to translate it directly.",
    target: "high-stakes-toggle",
    gate: "none",
  },
  {
    title: "Generate the after-visit summary",
    body: "Click to generate a plain-language summary of the visit for the patient to take home.",
    target: "generate-button",
    gate: "generatedOnce",
  },
  {
    title: "Always labeled, always confirmable",
    body: "The summary is clearly labeled AI-generated and flagged for clinician confirmation — never presented as final without review.",
    target: "summary-result",
    gate: "none",
  },
  {
    title: "Now flip it",
    body: 'Turn the toggle on and click "Regenerate summary" to see what happens when a conversation is flagged high-stakes.',
    target: "high-stakes-toggle",
    gate: "regenerated",
  },
  {
    title: "The hard stop",
    body: "Continuum doesn't generate or deliver a translation here at all — it hands off to a certified human interpreter and gets out of the way.",
    target: "summary-result",
    gate: "none",
  },
  {
    title: "Carried forward",
    body: "Once generated, this synthesized context is available for the patient's next visit — no re-collecting from five systems again.",
    target: "closing-card",
    gate: "none",
  },
  {
    title: "That's the simulation",
    body: "Two capabilities, two deliberate human checkpoints. Toggle back and forth as much as you'd like, or hit Reset to start over.",
    gate: "none",
  },
];
