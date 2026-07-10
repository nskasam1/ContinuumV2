export type TourGate = "none" | "synthesized" | "signedOff" | "generatedOnce" | "regenerated";

export interface TourStep {
  title: string;
  body: string;
  target?: string;
  gate: TourGate;
}

export const tourSteps: TourStep[] = [
  {
    title: "Five different systems, one patient",
    body: "These five cards are real records for the same patient — but they live in five separate systems that were never built to talk to each other. A doctor's office, a pharmacy, a specialist, a lab, and an ER, each keeping its own notes.",
    target: "source-cards",
    gate: "none",
  },
  {
    title: "Let's bring them together",
    body: 'Hit "Synthesize" and watch Continuum pull all five into one brief a clinician can actually use.',
    target: "synthesize-button",
    gate: "synthesized",
  },
  {
    title: "Here's what it found",
    body: "Continuum lines up medications from different systems, catches a risk a person might've missed, and points out care that fell through the cracks — all pulled automatically from what you just saw.",
    target: "brief-panel",
    gate: "none",
  },
  {
    title: "But it doesn't get the final say",
    body: "Continuum never makes the call on its own. Check the box and confirm — a real clinician has to sign off before anything moves forward.",
    target: "signoff-bar",
    gate: "signedOff",
  },
  {
    title: "Now, a different problem",
    body: "This patient doesn't speak much English. Below is a live visit — the clinician and patient are talking in real time, and each one sees a live translation of what the other just said.",
    target: "bridge-intro",
    gate: "none",
  },
  {
    title: "This toggle is the whole point",
    body: "If the conversation turns high-stakes — a new diagnosis, informed consent, end-of-life — Continuum won't touch the translation. It steps aside completely.",
    target: "high-stakes-toggle",
    gate: "none",
  },
  {
    title: "Try generating a summary",
    body: "Click below to put together a plain-language recap of the visit for the patient to take home.",
    target: "generate-button",
    gate: "generatedOnce",
  },
  {
    title: "Notice the label",
    body: "It's marked AI-generated and flagged for the clinician to confirm — never sent out as if it's final.",
    target: "summary-result",
    gate: "none",
  },
  {
    title: "Now flip the switch",
    body: 'Turn the toggle on and hit "Regenerate summary" — see what changes when the stakes go up.',
    target: "high-stakes-toggle",
    gate: "regenerated",
  },
  {
    title: "And there it is",
    body: "No AI translation this time. Continuum hands it straight to a certified human interpreter and gets out of the way.",
    target: "summary-result",
    gate: "none",
  },
  {
    title: "Nothing gets lost",
    body: "Once it's generated, this synthesized record sticks around — ready for the next visit, so nobody has to dig through five systems again.",
    target: "closing-card",
    gate: "none",
  },
  {
    title: "That's the whole thing",
    body: "Two capabilities, two moments where a human — not the AI — makes the call. Flip the toggle back and forth as much as you want, or hit Reset to run it again.",
    gate: "none",
  },
];
