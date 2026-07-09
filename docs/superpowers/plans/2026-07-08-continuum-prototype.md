# Continuum Prototype Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Continuum interactive prototype — a Vite/React/TypeScript/Tailwind single-page app demonstrating two integrated healthcare capabilities (Clinical Synthesis Brief, Communication Bridge) with Framer Motion animations, per the approved design spec.

**Architecture:** One `useReducer` state machine in `App.tsx` drives a strictly linear flow (idle → synthesizing → synthesized → signedOff, then bridge ready → generating → generated). Presentational components are grouped by capability (`synthesis/`, `bridge/`, `shared/`) and receive plain props — no component other than `App` touches the reducer directly. All copy lives in `src/data/*.ts`, separate from components.

**Tech Stack:** Vite, React 18, TypeScript, Tailwind CSS, Framer Motion, `@fontsource/inter`, `@fontsource/jetbrains-mono`.

## Global Constraints

- Project root is `/Users/nikhilkasam/Desktop/projects/PersonalProjects/ContinuumV2` (already `git init`'d with `origin` = `https://github.com/nskasam1/ContinuumV2.git`, branch `main`, one commit so far containing the design spec).
- No backend, no real API calls — synthesis/generation delays are simulated with `setTimeout` (700ms for synthesis, 600ms for summary generation).
- **Testing approach for this project:** the approved spec explicitly scopes this as a manually-verified prototype with no automated test suite (see spec's "Out of Scope" section). Each task below substitutes `npx tsc --noEmit` and `npm run build` as the verification gate instead of unit tests, since there is no test framework in this project and none is being added. The final task adds an end-to-end manual verification pass through the actual running app.
- Content (source records, brief text, transcript, summary copy, thesis line, sign-off line) must match the spec verbatim — copied into `src/data/*.ts` in Task 3.
- Colors, fonts, and file/component structure must match the design spec exactly (see `docs/superpowers/specs/2026-07-08-continuum-prototype-design.md`).
- Respect `prefers-reduced-motion` in all Framer Motion usage (handled centrally in Task 9).
- Must run via `npm install && npm run dev` and deploy via `vercel --prod` with zero extra config — do not add a `vercel.json` unless a build issue specifically requires it.

---

### Task 1: Project scaffold — Vite, TypeScript, Tailwind, fonts, design tokens

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `tsconfig.node.json`
- Create: `vite.config.ts`
- Create: `tailwind.config.ts`
- Create: `postcss.config.js`
- Create: `index.html`
- Create: `src/main.tsx`
- Create: `src/App.tsx` (temporary placeholder, replaced in Task 8)
- Create: `src/styles/index.css`
- Create: `.gitignore`

**Interfaces:**
- Produces: Tailwind color tokens (`bg`, `surface`, `ink`, `ink-soft`, `border`, `accent`, `accent-dim`, `amber`, `amber-bg`, `red`, `red-bg`, `src-epic`, `src-rx`, `src-cerner`, `src-quest`, `src-er`) and font families (`font-sans` = Inter, `font-mono` = JetBrains Mono) usable by every later component task.

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "continuum",
  "private": true,
  "version": "0.0.1",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@fontsource/inter": "^5.1.0",
    "@fontsource/jetbrains-mono": "^5.1.1",
    "framer-motion": "^11.11.17",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@types/react": "^18.3.12",
    "@types/react-dom": "^18.3.1",
    "@vitejs/plugin-react": "^4.3.3",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.49",
    "tailwindcss": "^3.4.15",
    "typescript": "^5.6.3",
    "vite": "^5.4.11"
  }
}
```

- [ ] **Step 2: Create `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

- [ ] **Step 3: Create `tsconfig.node.json`**

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
```

- [ ] **Step 4: Create `vite.config.ts`**

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
});
```

- [ ] **Step 5: Create `tailwind.config.ts`**

```ts
import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        surface: "var(--surface)",
        ink: "var(--ink)",
        "ink-soft": "var(--ink-soft)",
        border: "var(--border)",
        accent: "var(--accent)",
        "accent-dim": "var(--accent-dim)",
        amber: "var(--amber)",
        "amber-bg": "var(--amber-bg)",
        red: "var(--red)",
        "red-bg": "var(--red-bg)",
        "src-epic": "var(--src-epic)",
        "src-rx": "var(--src-rx)",
        "src-cerner": "var(--src-cerner)",
        "src-quest": "var(--src-quest)",
        "src-er": "var(--src-er)",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "SFMono-Regular", "monospace"],
      },
    },
  },
  plugins: [],
} satisfies Config;
```

- [ ] **Step 6: Create `postcss.config.js`**

```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

- [ ] **Step 7: Create `index.html`**

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Continuum</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 8: Create `src/styles/index.css`**

```css
@import "@fontsource/inter/400.css";
@import "@fontsource/inter/500.css";
@import "@fontsource/inter/600.css";
@import "@fontsource/inter/700.css";
@import "@fontsource/jetbrains-mono/400.css";
@import "@fontsource/jetbrains-mono/500.css";

@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --bg: #f4f6f8;
  --surface: #ffffff;
  --ink: #0b1e33;
  --ink-soft: #3d4e60;
  --border: #d8dee4;

  --accent: #0ea5a8;
  --accent-dim: #e2f5f5;

  --amber: #b8860b;
  --amber-bg: #fbf2de;
  --red: #b3261e;
  --red-bg: #fbeae9;

  --src-epic: #4a6fa5;
  --src-rx: #6b8e6b;
  --src-cerner: #8a6fa0;
  --src-quest: #a5794a;
  --src-er: #a54a4a;
}

body {
  background-color: var(--bg);
  color: var(--ink);
}
```

- [ ] **Step 9: Create `src/main.tsx`**

```tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

- [ ] **Step 10: Create temporary placeholder `src/App.tsx`**

```tsx
export default function App() {
  return (
    <div className="p-8 font-sans text-ink">
      <h1 className="text-2xl font-semibold">Continuum</h1>
      <p className="mt-2 font-mono text-sm text-ink-soft">Scaffold OK — components pending.</p>
    </div>
  );
}
```

- [ ] **Step 11: Create `.gitignore`**

```
node_modules
dist
.DS_Store
*.local
```

- [ ] **Step 12: Install dependencies**

Run: `npm install`
Expected: installs without errors, creates `package-lock.json` and `node_modules/`.

- [ ] **Step 13: Verify build**

Run: `npm run build`
Expected: TypeScript compiles and Vite build succeeds, producing a `dist/` directory with no errors.

- [ ] **Step 14: Commit**

```bash
git add package.json package-lock.json tsconfig.json tsconfig.node.json vite.config.ts tailwind.config.ts postcss.config.js index.html src/main.tsx src/App.tsx src/styles/index.css .gitignore
git commit -m "Scaffold Vite + React + TS + Tailwind project with design tokens"
```

---

### Task 2: State machine — types and reducer

**Files:**
- Create: `src/state/types.ts`
- Create: `src/state/flowReducer.ts`

**Interfaces:**
- Consumes: nothing (pure module).
- Produces: `Stage` (`"idle" | "synthesizing" | "synthesized" | "signedOff"`), `BridgeStage` (`"ready" | "generating" | "generated"`), `FlowState { stage, signoffChecked, bridgeStage, highStakes, hasGeneratedOnce }`, `FlowAction` union, `initialFlowState`, `flowReducer(state, action): FlowState`. All later tasks (`BriefPanel`, `SummaryResult`, `App.tsx`) consume these exact names and shapes.

- [ ] **Step 1: Create `src/state/types.ts`**

```ts
export type Stage = "idle" | "synthesizing" | "synthesized" | "signedOff";

export type BridgeStage = "ready" | "generating" | "generated";

export interface FlowState {
  stage: Stage;
  signoffChecked: boolean;
  bridgeStage: BridgeStage;
  highStakes: boolean;
  hasGeneratedOnce: boolean;
}

export type FlowAction =
  | { type: "SYNTHESIZE_START" }
  | { type: "SYNTHESIZE_COMPLETE" }
  | { type: "TOGGLE_SIGNOFF" }
  | { type: "CONFIRM_SIGNOFF" }
  | { type: "TOGGLE_HIGH_STAKES" }
  | { type: "GENERATE_SUMMARY_START" }
  | { type: "GENERATE_SUMMARY_COMPLETE" }
  | { type: "RESET" };
```

- [ ] **Step 2: Create `src/state/flowReducer.ts`**

```ts
import type { FlowState, FlowAction } from "./types";

export const initialFlowState: FlowState = {
  stage: "idle",
  signoffChecked: false,
  bridgeStage: "ready",
  highStakes: false,
  hasGeneratedOnce: false,
};

export function flowReducer(state: FlowState, action: FlowAction): FlowState {
  switch (action.type) {
    case "SYNTHESIZE_START":
      return { ...state, stage: "synthesizing" };
    case "SYNTHESIZE_COMPLETE":
      return { ...state, stage: "synthesized" };
    case "TOGGLE_SIGNOFF":
      return { ...state, signoffChecked: !state.signoffChecked };
    case "CONFIRM_SIGNOFF":
      return state.signoffChecked ? { ...state, stage: "signedOff" } : state;
    case "TOGGLE_HIGH_STAKES":
      return { ...state, highStakes: !state.highStakes };
    case "GENERATE_SUMMARY_START":
      return { ...state, bridgeStage: "generating" };
    case "GENERATE_SUMMARY_COMPLETE":
      return { ...state, bridgeStage: "generated", hasGeneratedOnce: true };
    case "RESET":
      return initialFlowState;
    default:
      return state;
  }
}
```

- [ ] **Step 3: Verify with a throwaway runtime check**

Run:
```bash
npx tsx -e "
import { flowReducer, initialFlowState } from './src/state/flowReducer';
let s = initialFlowState;
s = flowReducer(s, { type: 'SYNTHESIZE_START' });
console.assert(s.stage === 'synthesizing', 'expected synthesizing');
s = flowReducer(s, { type: 'SYNTHESIZE_COMPLETE' });
console.assert(s.stage === 'synthesized', 'expected synthesized');
s = flowReducer(s, { type: 'TOGGLE_SIGNOFF' });
s = flowReducer(s, { type: 'CONFIRM_SIGNOFF' });
console.assert(s.stage === 'signedOff', 'expected signedOff');
s = flowReducer(s, { type: 'GENERATE_SUMMARY_START' });
s = flowReducer(s, { type: 'GENERATE_SUMMARY_COMPLETE' });
console.assert(s.bridgeStage === 'generated' && s.hasGeneratedOnce === true, 'expected generated + hasGeneratedOnce');
s = flowReducer(s, { type: 'RESET' });
console.assert(s.stage === 'idle' && s.hasGeneratedOnce === false, 'expected reset to initial');
console.log('flowReducer checks passed');
"
```
If `npx tsx` is unavailable, run `npm install -D tsx` first (dev-only, not needed elsewhere — do not add to `package.json` dependencies permanently; uninstall after this check with `npm uninstall tsx` once it passes).
Expected output: `flowReducer checks passed` with no assertion failures.

- [ ] **Step 4: Verify TypeScript compiles**

Run: `npm run typecheck`
Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add src/state/types.ts src/state/flowReducer.ts
git commit -m "Add flow state machine (types + reducer)"
```

---

### Task 3: Data layer — source records, brief content, transcript/bridge copy

**Files:**
- Create: `src/data/sourceRecords.ts`
- Create: `src/data/briefContent.ts`
- Create: `src/data/transcript.ts`

**Interfaces:**
- Consumes: nothing (pure data modules).
- Produces:
  - `sourceRecords.ts`: `interface SourceRecord { id: string; system: string; facility: string; date: string; note: string; accentVar: string }`, `sourceRecords: SourceRecord[]` (5 entries).
  - `briefContent.ts`: `interface Medication { name: string; source: string }`, `medications: Medication[]`; `interface Flag { severity: "critical" | "moderate"; text: string }`, `flags: Flag[]`; `gaps: string[]`; `signoffLine: string`.
  - `transcript.ts`: `interface TranscriptEntry { speaker: "CLINICIAN" | "LIVE_ES" | "PATIENT" | "LIVE_EN"; text: string }`, `transcriptEntries: TranscriptEntry[]`; `languageBadges: { preferred: string; lep: string }`; `highStakesPrompt: string`; `aiSummary: { label: string; en: string; es: string }`; `humanRoutedSummary: { label: string; text: string }`; `thesisStatement: string`; `stepLabels: string[]`.
  - These exact names/shapes are consumed by `BriefPanel`, `MedicationList`, `FlagItem`, `GapsList`, `SignoffBar` (Task 6), `LanguageBadges`, `TranscriptPanel`, `TranscriptLine`, `HighStakesToggle`, `SummaryResult` (Task 7), and `App.tsx` (Task 8).

- [ ] **Step 1: Create `src/data/sourceRecords.ts`**

```ts
export interface SourceRecord {
  id: string;
  system: string;
  facility: string;
  date: string;
  note: string;
  accentVar: string;
}

export const sourceRecords: SourceRecord[] = [
  {
    id: "epic",
    system: "EPIC",
    facility: "PCP Office",
    date: "Jun 14, 2026",
    note: "Visit note: pt reports fatigue, occasional dizziness. Started lisinopril 10mg for BP mgmt. F/u in 3 months.",
    accentVar: "--src-epic",
  },
  {
    id: "rx",
    system: "RX",
    facility: "Walgreens",
    date: "Jun 20, 2026",
    note: "Fill history: sumatriptan 50mg, qty 9, prescribed by Dr. Osei (Neurology) — migraine, as-needed.",
    accentVar: "--src-rx",
  },
  {
    id: "cerner",
    system: "Cerner",
    facility: "Cardiology",
    date: "May 02, 2026",
    note: "Consult note: borderline QT prolongation on EKG, monitor with any new prescriptions. No action taken.",
    accentVar: "--src-cerner",
  },
  {
    id: "quest",
    system: "Quest Diagnostics",
    facility: "",
    date: "Jun 18, 2026",
    note: "Lab panel: potassium 5.3 mmol/L (high). Ordering provider: PCP office. No follow-up scheduled.",
    accentVar: "--src-quest",
  },
  {
    id: "er",
    system: "ER",
    facility: "City General",
    date: "Apr 29, 2026",
    note: "D/c summary: presented with palpitations, ruled out MI. Advised outpatient cardiology f/u — no record of scheduling found elsewhere.",
    accentVar: "--src-er",
  },
];
```

- [ ] **Step 2: Create `src/data/briefContent.ts`**

```ts
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
```

- [ ] **Step 3: Create `src/data/transcript.ts`**

```ts
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
```

- [ ] **Step 4: Verify TypeScript compiles**

Run: `npm run typecheck`
Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add src/data/sourceRecords.ts src/data/briefContent.ts src/data/transcript.ts
git commit -m "Add data layer for source records, brief content, and transcript copy"
```

---

### Task 4: Shared components — SectionHeading, ResetButton, ThesisStatement, StepIndicator

**Files:**
- Create: `src/components/shared/SectionHeading.tsx`
- Create: `src/components/shared/ResetButton.tsx`
- Create: `src/components/shared/ThesisStatement.tsx`
- Create: `src/components/StepIndicator.tsx`

**Interfaces:**
- Consumes: nothing beyond React/Tailwind.
- Produces:
  - `SectionHeading({ eyebrow?: string; title: string })`
  - `ResetButton({ onClick: () => void })`
  - `ThesisStatement({ text: string })`
  - `StepIndicator({ labels: string[]; currentIndex: number; completedCount: number })`
  These exact prop shapes are consumed by `App.tsx` in Task 8.

- [ ] **Step 1: Create `src/components/shared/SectionHeading.tsx`**

```tsx
interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
}

export function SectionHeading({ eyebrow, title }: SectionHeadingProps) {
  return (
    <div className="mb-4">
      {eyebrow && (
        <p className="mb-1 font-mono text-xs font-semibold uppercase tracking-wider text-accent">
          {eyebrow}
        </p>
      )}
      <h2 className="text-xl font-semibold text-ink sm:text-2xl">{title}</h2>
    </div>
  );
}
```

- [ ] **Step 2: Create `src/components/shared/ResetButton.tsx`**

```tsx
interface ResetButtonProps {
  onClick: () => void;
}

export function ResetButton({ onClick }: ResetButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="shrink-0 rounded-md border border-border px-4 py-2 text-sm font-medium text-ink-soft transition-colors hover:border-ink-soft hover:text-ink"
    >
      Reset
    </button>
  );
}
```

- [ ] **Step 3: Create `src/components/shared/ThesisStatement.tsx`**

```tsx
interface ThesisStatementProps {
  text: string;
}

export function ThesisStatement({ text }: ThesisStatementProps) {
  return <p className="mx-auto max-w-2xl text-center text-sm leading-relaxed text-ink-soft">{text}</p>;
}
```

- [ ] **Step 4: Create `src/components/StepIndicator.tsx`**

```tsx
interface StepIndicatorProps {
  labels: string[];
  currentIndex: number;
  completedCount: number;
}

export function StepIndicator({ labels, currentIndex, completedCount }: StepIndicatorProps) {
  return (
    <ol className="mb-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
      {labels.map((label, i) => {
        const done = i < completedCount;
        const active = i === currentIndex;
        return (
          <li key={label} className="flex flex-1 items-center gap-2">
            <span
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-mono text-xs font-medium ${
                done
                  ? "bg-accent text-white"
                  : active
                    ? "border-2 border-accent text-accent"
                    : "border border-border text-ink-soft"
              }`}
            >
              {done ? "✓" : i + 1}
            </span>
            <span
              className={`text-sm font-medium ${
                active ? "text-ink" : done ? "text-ink-soft" : "text-ink-soft/60"
              }`}
            >
              {label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
```

- [ ] **Step 5: Verify TypeScript compiles**

Run: `npm run typecheck`
Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add src/components/shared/SectionHeading.tsx src/components/shared/ResetButton.tsx src/components/shared/ThesisStatement.tsx src/components/StepIndicator.tsx
git commit -m "Add shared components and StepIndicator"
```

---

### Task 5: Synthesis components — RecordCard, SourceRecordGrid, SynthesisButton

**Files:**
- Create: `src/components/synthesis/RecordCard.tsx`
- Create: `src/components/synthesis/SourceRecordGrid.tsx`
- Create: `src/components/synthesis/SynthesisButton.tsx`

**Interfaces:**
- Consumes: `SourceRecord` type and `sourceRecords` data from Task 3 (`src/data/sourceRecords.ts`).
- Produces:
  - `RecordCard({ record: SourceRecord; index: number })` — Framer Motion staggered entrance + Moment-1 exit animation.
  - `SourceRecordGrid({ visible: boolean })` — renders all 5 `RecordCard`s inside `AnimatePresence`; when `visible` flips to `false`, cards play their exit animation.
  - `SynthesisButton({ onClick: () => void; disabled: boolean; loading: boolean })`.
  Consumed by `App.tsx` in Task 8.

- [ ] **Step 1: Create `src/components/synthesis/RecordCard.tsx`**

```tsx
import { motion } from "framer-motion";
import type { SourceRecord } from "../../data/sourceRecords";

interface RecordCardProps {
  record: SourceRecord;
  index: number;
}

const rotations = [-1.2, 0.8, -0.5, 1.4, -0.9];

export function RecordCard({ record, index }: RecordCardProps) {
  const rotation = rotations[index % rotations.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, rotate: 0 }}
      animate={{ opacity: 1, y: 0, rotate: rotation }}
      exit={{
        opacity: 0,
        scale: 0.8,
        y: -28,
        transition: { duration: 0.4, delay: index * 0.06, ease: "easeIn" },
      }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="rounded-lg border-l-4 bg-surface p-4 shadow-sm"
      style={{ borderLeftColor: `var(${record.accentVar})` }}
    >
      <div className="mb-2 flex flex-wrap items-baseline justify-between gap-x-2 font-mono text-xs uppercase tracking-wide text-ink-soft">
        <span>
          {record.system}
          {record.facility ? ` · ${record.facility}` : ""}
        </span>
        <span>{record.date}</span>
      </div>
      <p className="font-mono text-sm leading-relaxed text-ink">{record.note}</p>
    </motion.div>
  );
}
```

- [ ] **Step 2: Create `src/components/synthesis/SourceRecordGrid.tsx`**

```tsx
import { AnimatePresence } from "framer-motion";
import { sourceRecords } from "../../data/sourceRecords";
import { RecordCard } from "./RecordCard";

interface SourceRecordGridProps {
  visible: boolean;
}

export function SourceRecordGrid({ visible }: SourceRecordGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <AnimatePresence>
        {visible && sourceRecords.map((record, i) => <RecordCard key={record.id} record={record} index={i} />)}
      </AnimatePresence>
    </div>
  );
}
```

- [ ] **Step 3: Create `src/components/synthesis/SynthesisButton.tsx`**

```tsx
interface SynthesisButtonProps {
  onClick: () => void;
  disabled: boolean;
  loading: boolean;
}

export function SynthesisButton({ onClick, disabled, loading }: SynthesisButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center gap-2 rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {loading ? "Synthesizing…" : "Synthesize"}
    </button>
  );
}
```

- [ ] **Step 4: Verify TypeScript compiles**

Run: `npm run typecheck`
Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/synthesis/RecordCard.tsx src/components/synthesis/SourceRecordGrid.tsx src/components/synthesis/SynthesisButton.tsx
git commit -m "Add synthesis source-card components with Moment 1 exit animation"
```

---

### Task 6: Synthesis components — BriefPanel and its sub-pieces

**Files:**
- Create: `src/components/synthesis/MedicationList.tsx`
- Create: `src/components/synthesis/FlagItem.tsx`
- Create: `src/components/synthesis/GapsList.tsx`
- Create: `src/components/synthesis/SignoffBar.tsx`
- Create: `src/components/synthesis/BriefPanel.tsx`

**Interfaces:**
- Consumes: `Medication`, `Flag` types and `medications`, `flags`, `gaps`, `signoffLine` from Task 3 (`src/data/briefContent.ts`); `Stage` type from Task 2 (`src/state/types.ts`).
- Produces:
  - `MedicationList({ medications: Medication[] })`
  - `FlagItem({ flag: Flag })`
  - `GapsList({ gaps: string[] })`
  - `SignoffBar({ line: string; checked: boolean; onToggle: () => void; onConfirm: () => void })`
  - `BriefPanel({ stage: Stage; signoffChecked: boolean; onToggleSignoff: () => void; onConfirmSignoff: () => void })` — renders empty state (`idle`), shimmer loading state (`synthesizing`), or the full brief with staggered section entrance + `SignoffBar` (`synthesized` / `signedOff`).
  Consumed by `App.tsx` in Task 8.

- [ ] **Step 1: Create `src/components/synthesis/MedicationList.tsx`**

```tsx
import type { Medication } from "../../data/briefContent";

interface MedicationListProps {
  medications: Medication[];
}

export function MedicationList({ medications }: MedicationListProps) {
  return (
    <div>
      <h3 className="mb-2 text-sm font-semibold text-ink">Active medications (cross-source)</h3>
      <ul className="space-y-1">
        {medications.map((med) => (
          <li key={med.name} className="flex flex-wrap items-baseline gap-x-2 text-sm text-ink">
            <span className="font-medium">{med.name}</span>
            <span className="font-mono text-xs text-ink-soft">{med.source}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

- [ ] **Step 2: Create `src/components/synthesis/FlagItem.tsx`**

```tsx
import type { Flag } from "../../data/briefContent";

interface FlagItemProps {
  flag: Flag;
}

export function FlagItem({ flag }: FlagItemProps) {
  const critical = flag.severity === "critical";
  return (
    <div
      className={`rounded-md border-l-4 p-3 text-sm ${
        critical ? "border-red bg-red-bg text-ink" : "border-amber bg-amber-bg text-ink"
      }`}
    >
      <span className={`mr-2 font-mono text-xs font-semibold uppercase ${critical ? "text-red" : "text-amber"}`}>
        {critical ? "Critical" : "Review"}
      </span>
      {flag.text}
    </div>
  );
}
```

- [ ] **Step 3: Create `src/components/synthesis/GapsList.tsx`**

```tsx
interface GapsListProps {
  gaps: string[];
}

export function GapsList({ gaps }: GapsListProps) {
  return (
    <div>
      <h3 className="mb-2 text-sm font-semibold text-ink">Open gaps in care</h3>
      <ul className="list-disc space-y-1 pl-5 text-sm text-ink">
        {gaps.map((gap) => (
          <li key={gap}>{gap}</li>
        ))}
      </ul>
    </div>
  );
}
```

- [ ] **Step 4: Create `src/components/synthesis/SignoffBar.tsx`**

```tsx
interface SignoffBarProps {
  line: string;
  checked: boolean;
  onToggle: () => void;
  onConfirm: () => void;
}

export function SignoffBar({ line, checked, onToggle, onConfirm }: SignoffBarProps) {
  return (
    <div className="rounded-md border border-border bg-bg p-4">
      <label className="flex cursor-pointer items-start gap-3 text-sm text-ink">
        <input
          type="checkbox"
          checked={checked}
          onChange={onToggle}
          className="mt-0.5 h-4 w-4 shrink-0 accent-accent"
        />
        <span>{line}</span>
      </label>
      <button
        type="button"
        onClick={onConfirm}
        disabled={!checked}
        className="mt-3 inline-flex items-center rounded-md bg-accent px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Confirm &amp; continue
      </button>
    </div>
  );
}
```

- [ ] **Step 5: Create `src/components/synthesis/BriefPanel.tsx`**

```tsx
import { motion, AnimatePresence } from "framer-motion";
import { medications, flags, gaps, signoffLine } from "../../data/briefContent";
import type { Stage } from "../../state/types";
import { MedicationList } from "./MedicationList";
import { FlagItem } from "./FlagItem";
import { GapsList } from "./GapsList";
import { SignoffBar } from "./SignoffBar";

interface BriefPanelProps {
  stage: Stage;
  signoffChecked: boolean;
  onToggleSignoff: () => void;
  onConfirmSignoff: () => void;
}

export function BriefPanel({ stage, signoffChecked, onToggleSignoff, onConfirmSignoff }: BriefPanelProps) {
  if (stage === "idle") {
    return (
      <div className="flex min-h-[240px] items-center justify-center rounded-lg border border-dashed border-border p-8 text-center text-sm text-ink-soft">
        Click "Synthesize" to collapse these five records into one brief.
      </div>
    );
  }

  if (stage === "synthesizing") {
    return (
      <div className="rounded-lg border border-border bg-surface p-6">
        <div className="h-4 w-1/3 animate-pulse rounded bg-accent-dim" />
        <div className="mt-4 space-y-2">
          <div className="h-3 w-full animate-pulse rounded bg-accent-dim" />
          <div className="h-3 w-5/6 animate-pulse rounded bg-accent-dim" />
          <div className="h-3 w-2/3 animate-pulse rounded bg-accent-dim" />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-surface p-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <MedicationList medications={medications} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.15 }}
        className="mt-6"
      >
        <h3 className="mb-2 text-sm font-semibold text-ink">Flagged for review</h3>
        <div className="space-y-2">
          {flags.map((flag) => (
            <FlagItem key={flag.text} flag={flag} />
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className="mt-6"
      >
        <GapsList gaps={gaps} />
      </motion.div>

      <AnimatePresence>
        {stage === "synthesized" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3, delay: 0.5 }}
            className="mt-6"
          >
            <SignoffBar
              line={signoffLine}
              checked={signoffChecked}
              onToggle={onToggleSignoff}
              onConfirm={onConfirmSignoff}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
```

- [ ] **Step 6: Verify TypeScript compiles**

Run: `npm run typecheck`
Expected: no errors.

- [ ] **Step 7: Commit**

```bash
git add src/components/synthesis/MedicationList.tsx src/components/synthesis/FlagItem.tsx src/components/synthesis/GapsList.tsx src/components/synthesis/SignoffBar.tsx src/components/synthesis/BriefPanel.tsx
git commit -m "Add BriefPanel with staggered section entrance and sign-off bar"
```

---

### Task 7: Bridge components — transcript, toggle, and Moment 2 summary swap

**Files:**
- Create: `src/components/bridge/LanguageBadges.tsx`
- Create: `src/components/bridge/TranscriptLine.tsx`
- Create: `src/components/bridge/TranscriptPanel.tsx`
- Create: `src/components/bridge/HighStakesToggle.tsx`
- Create: `src/components/bridge/SummaryResult.tsx`

**Interfaces:**
- Consumes: `TranscriptEntry` type and `transcriptEntries`, `aiSummary`, `humanRoutedSummary` from Task 3 (`src/data/transcript.ts`); `BridgeStage` type from Task 2.
- Produces:
  - `LanguageBadges({ preferred: string; lep: string })`
  - `TranscriptLine({ entry: TranscriptEntry })`
  - `TranscriptPanel()` — no props, renders all `transcriptEntries`.
  - `HighStakesToggle({ checked: boolean; onChange: () => void; label: string })`
  - `SummaryResult({ bridgeStage: BridgeStage; highStakes: boolean })` — Moment 2: `AnimatePresence mode="wait"` swap between AI-generated (teal) and human-routed (red) states, each with a top-to-bottom left-border color sweep.
  Consumed by `App.tsx` in Task 8.

- [ ] **Step 1: Create `src/components/bridge/LanguageBadges.tsx`**

```tsx
interface LanguageBadgesProps {
  preferred: string;
  lep: string;
}

export function LanguageBadges({ preferred, lep }: LanguageBadgesProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <span className="rounded-full border border-border bg-surface px-3 py-1 font-mono text-xs text-ink-soft">
        {preferred}
      </span>
      <span className="rounded-full border border-amber bg-amber-bg px-3 py-1 font-mono text-xs text-amber">
        {lep}
      </span>
    </div>
  );
}
```

- [ ] **Step 2: Create `src/components/bridge/TranscriptLine.tsx`**

```tsx
import type { TranscriptEntry } from "../../data/transcript";

interface TranscriptLineProps {
  entry: TranscriptEntry;
}

const speakerLabels: Record<TranscriptEntry["speaker"], string> = {
  CLINICIAN: "CLINICIAN",
  LIVE_ES: "LIVE (ES)",
  PATIENT: "PATIENT",
  LIVE_EN: "LIVE (EN)",
};

export function TranscriptLine({ entry }: TranscriptLineProps) {
  const isLive = entry.speaker === "LIVE_ES" || entry.speaker === "LIVE_EN";
  return (
    <div className={`font-mono text-sm ${isLive ? "pl-4 text-accent" : "text-ink"}`}>
      <span className="mr-2 text-xs font-semibold uppercase text-ink-soft">{speakerLabels[entry.speaker]}</span>
      <span>{entry.text}</span>
    </div>
  );
}
```

- [ ] **Step 3: Create `src/components/bridge/TranscriptPanel.tsx`**

```tsx
import { transcriptEntries } from "../../data/transcript";
import { TranscriptLine } from "./TranscriptLine";

export function TranscriptPanel() {
  return (
    <div className="space-y-2 rounded-lg border border-border bg-surface p-4">
      {transcriptEntries.map((entry, i) => (
        <TranscriptLine key={i} entry={entry} />
      ))}
    </div>
  );
}
```

- [ ] **Step 4: Create `src/components/bridge/HighStakesToggle.tsx`**

```tsx
interface HighStakesToggleProps {
  checked: boolean;
  onChange: () => void;
  label: string;
}

export function HighStakesToggle({ checked, onChange, label }: HighStakesToggleProps) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-4 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-sm font-medium text-ink">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        className={`relative h-8 w-16 shrink-0 rounded-full border transition-colors duration-[250ms] ${
          checked ? "border-red bg-red" : "border-border bg-bg"
        }`}
      >
        <span
          className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow transition-transform duration-[250ms] ${
            checked ? "translate-x-9" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}
```

- [ ] **Step 5: Create `src/components/bridge/SummaryResult.tsx`**

```tsx
import { motion, AnimatePresence } from "framer-motion";
import type { BridgeStage } from "../../state/types";
import { aiSummary, humanRoutedSummary } from "../../data/transcript";

interface SummaryResultProps {
  bridgeStage: BridgeStage;
  highStakes: boolean;
}

export function SummaryResult({ bridgeStage, highStakes }: SummaryResultProps) {
  if (bridgeStage === "ready") return null;

  if (bridgeStage === "generating") {
    return (
      <div className="rounded-lg border border-border bg-surface p-6">
        <div className="h-3 w-1/2 animate-pulse rounded bg-accent-dim" />
        <div className="mt-3 h-3 w-full animate-pulse rounded bg-accent-dim" />
        <div className="mt-2 h-3 w-4/5 animate-pulse rounded bg-accent-dim" />
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {highStakes ? (
        <motion.div
          key="human"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.2 } }}
          transition={{ duration: 0.3, delay: 0.15 }}
          className="relative overflow-hidden rounded-lg bg-red-bg p-5 pl-6"
        >
          <motion.span
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.35, delay: 0.15, ease: "easeOut" }}
            style={{ originY: 0 }}
            className="absolute left-0 top-0 h-full w-1 bg-red"
          />
          <span className="mb-2 inline-block font-mono text-xs font-semibold uppercase tracking-wide text-red">
            {humanRoutedSummary.label}
          </span>
          <p className="text-sm leading-relaxed text-ink">{humanRoutedSummary.text}</p>
        </motion.div>
      ) : (
        <motion.div
          key="ai"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.2 } }}
          transition={{ duration: 0.3, delay: 0.15 }}
          className="relative overflow-hidden rounded-lg bg-accent-dim p-5 pl-6"
        >
          <motion.span
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.35, delay: 0.15, ease: "easeOut" }}
            style={{ originY: 0 }}
            className="absolute left-0 top-0 h-full w-1 bg-accent"
          />
          <span className="mb-2 inline-block font-mono text-xs font-semibold uppercase tracking-wide text-accent">
            {aiSummary.label}
          </span>
          <p className="text-sm leading-relaxed text-ink">{aiSummary.en}</p>
          <p className="mt-3 text-sm leading-relaxed text-ink-soft">{aiSummary.es}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

- [ ] **Step 6: Verify TypeScript compiles**

Run: `npm run typecheck`
Expected: no errors.

- [ ] **Step 7: Commit**

```bash
git add src/components/bridge/LanguageBadges.tsx src/components/bridge/TranscriptLine.tsx src/components/bridge/TranscriptPanel.tsx src/components/bridge/HighStakesToggle.tsx src/components/bridge/SummaryResult.tsx
git commit -m "Add bridge components with Moment 2 toggle-driven summary swap"
```

---

### Task 8: Wire the full flow into App.tsx

**Files:**
- Modify: `src/App.tsx` (replace Task 1's placeholder)

**Interfaces:**
- Consumes: everything produced in Tasks 2–7 — `flowReducer`, `initialFlowState` (Task 2); `stepLabels`, `languageBadges`, `highStakesPrompt`, `thesisStatement` (Task 3); `StepIndicator`, `SectionHeading`, `ResetButton`, `ThesisStatement` (Task 4); `SourceRecordGrid`, `SynthesisButton`, `BriefPanel` (Tasks 5–6); `LanguageBadges`, `TranscriptPanel`, `HighStakesToggle`, `SummaryResult` (Task 7).
- Produces: the complete rendered app — no further tasks consume `App.tsx`.

- [ ] **Step 1: Replace `src/App.tsx`**

```tsx
import { useEffect, useReducer, useRef } from "react";
import { flowReducer, initialFlowState } from "./state/flowReducer";
import { StepIndicator } from "./components/StepIndicator";
import { SourceRecordGrid } from "./components/synthesis/SourceRecordGrid";
import { SynthesisButton } from "./components/synthesis/SynthesisButton";
import { BriefPanel } from "./components/synthesis/BriefPanel";
import { LanguageBadges } from "./components/bridge/LanguageBadges";
import { TranscriptPanel } from "./components/bridge/TranscriptPanel";
import { HighStakesToggle } from "./components/bridge/HighStakesToggle";
import { SummaryResult } from "./components/bridge/SummaryResult";
import { SectionHeading } from "./components/shared/SectionHeading";
import { ResetButton } from "./components/shared/ResetButton";
import { ThesisStatement } from "./components/shared/ThesisStatement";
import { languageBadges, highStakesPrompt, thesisStatement, stepLabels } from "./data/transcript";

const SYNTHESIS_DELAY_MS = 700;
const GENERATION_DELAY_MS = 600;

function getStepStatus(stage: string, hasGeneratedOnce: boolean) {
  const completedCount = stage === "signedOff" ? (hasGeneratedOnce ? 2 : 1) : 0;
  const currentIndex = hasGeneratedOnce ? 2 : stage === "signedOff" ? 1 : 0;
  return { completedCount, currentIndex };
}

export default function App() {
  const [state, dispatch] = useReducer(flowReducer, initialFlowState);
  const bridgeRef = useRef<HTMLDivElement>(null);
  const prevStage = useRef(state.stage);

  useEffect(() => {
    if (prevStage.current !== "signedOff" && state.stage === "signedOff") {
      bridgeRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    prevStage.current = state.stage;
  }, [state.stage]);

  function handleSynthesize() {
    dispatch({ type: "SYNTHESIZE_START" });
    setTimeout(() => dispatch({ type: "SYNTHESIZE_COMPLETE" }), SYNTHESIS_DELAY_MS);
  }

  function handleGenerate() {
    dispatch({ type: "GENERATE_SUMMARY_START" });
    setTimeout(() => dispatch({ type: "GENERATE_SUMMARY_COMPLETE" }), GENERATION_DELAY_MS);
  }

  const { completedCount, currentIndex } = getStepStatus(state.stage, state.hasGeneratedOnce);
  const preSynthesis = state.stage === "idle" || state.stage === "synthesizing";

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-8 flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-accent">Continuum</p>
          <h1 className="mt-1 text-2xl font-semibold text-ink sm:text-3xl">
            Clinical Synthesis &amp; Communication Bridge
          </h1>
        </div>
        <ResetButton onClick={() => dispatch({ type: "RESET" })} />
      </header>

      <StepIndicator labels={stepLabels} currentIndex={currentIndex} completedCount={completedCount} />

      <section className="mb-16">
        <SectionHeading eyebrow="Capability 1" title="Clinical Synthesis Brief" />
        <div className={preSynthesis ? "grid grid-cols-1 gap-8 lg:grid-cols-2" : "grid grid-cols-1"}>
          {preSynthesis && (
            <div>
              <SourceRecordGrid visible={state.stage === "idle"} />
              <div className="mt-4">
                <SynthesisButton
                  onClick={handleSynthesize}
                  disabled={state.stage !== "idle"}
                  loading={state.stage === "synthesizing"}
                />
              </div>
            </div>
          )}
          <BriefPanel
            stage={state.stage}
            signoffChecked={state.signoffChecked}
            onToggleSignoff={() => dispatch({ type: "TOGGLE_SIGNOFF" })}
            onConfirmSignoff={() => dispatch({ type: "CONFIRM_SIGNOFF" })}
          />
        </div>
      </section>

      {state.stage === "signedOff" && (
        <section ref={bridgeRef} className="mb-16 scroll-mt-8">
          <SectionHeading eyebrow="Capability 2" title="Communication Bridge" />
          <div className="mb-4">
            <LanguageBadges preferred={languageBadges.preferred} lep={languageBadges.lep} />
          </div>
          <div className="mb-6">
            <TranscriptPanel />
          </div>
          <div className="mb-6">
            <HighStakesToggle
              checked={state.highStakes}
              onChange={() => dispatch({ type: "TOGGLE_HIGH_STAKES" })}
              label={highStakesPrompt}
            />
          </div>
          <div className="mb-6">
            <button
              type="button"
              onClick={handleGenerate}
              disabled={state.bridgeStage === "generating"}
              className="inline-flex items-center gap-2 rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {state.bridgeStage === "generating"
                ? "Generating…"
                : state.hasGeneratedOnce
                  ? "Regenerate summary"
                  : "Generate after-visit summary"}
            </button>
          </div>
          <SummaryResult bridgeStage={state.bridgeStage} highStakes={state.highStakes} />
        </section>
      )}

      <footer className="border-t border-border pt-8">
        <ThesisStatement text={thesisStatement} />
      </footer>
    </div>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: no TypeScript or build errors, `dist/` produced.

- [ ] **Step 3: Manual smoke test**

Run: `npm run dev` (leave running), open the printed local URL (typically `http://localhost:5173`) in a browser and walk through:
1. Page loads with 3-step indicator (step 1 active) and 5 fragmented cards on the left, empty state on the right.
2. Click "Synthesize" — cards animate out, brief loading shows briefly, brief content animates in section by section.
3. Check the sign-off checkbox — "Confirm & continue" button enables.
4. Click it — page scrolls to reveal the Communication Bridge section; step indicator shows step 1 done, step 2 active.
5. Click "Generate after-visit summary" with the toggle off — AI-generated summary (teal) appears; step 2 done, step 3 active.
6. Flip the high-stakes toggle on, click "Regenerate summary" — human-interpreter routing message (red) appears, replacing the AI summary.
7. Flip the toggle off again and regenerate — AI summary reappears. Confirm switching back and forth feels smooth.
8. Click "Reset" — page returns to the initial state from step 1.

Expected: every step above behaves exactly as described, with no console errors.
Stop the dev server (Ctrl+C) once verified.

- [ ] **Step 4: Commit**

```bash
git add src/App.tsx
git commit -m "Wire full synthesis + bridge flow into App"
```

---

### Task 9: Responsive polish, reduced-motion support, and deployment readiness

**Files:**
- Modify: `src/App.tsx` (minor responsive class adjustments if issues found)
- Modify: `src/components/synthesis/RecordCard.tsx` (reduced-motion variant)
- Modify: `src/components/synthesis/BriefPanel.tsx` (reduced-motion variant)
- Modify: `src/components/bridge/SummaryResult.tsx` (reduced-motion variant)
- Create: `src/hooks/usePrefersReducedMotion.ts`

**Interfaces:**
- Consumes: `App.tsx` and the animated components from Tasks 5–8.
- Produces: `usePrefersReducedMotion(): boolean` — a hook returning whether the OS-level reduced-motion preference is active, consumed by the three animated components to swap their `motion` props to simple opacity-only transitions with no translate/scale/stagger.

- [ ] **Step 1: Create `src/hooks/usePrefersReducedMotion.ts`**

```ts
import { useEffect, useState } from "react";

export function usePrefersReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReduced(query.matches);

    function handleChange(event: MediaQueryListEvent) {
      setPrefersReduced(event.matches);
    }

    query.addEventListener("change", handleChange);
    return () => query.removeEventListener("change", handleChange);
  }, []);

  return prefersReduced;
}
```

- [ ] **Step 2: Update `src/components/synthesis/RecordCard.tsx` to respect reduced motion**

Replace the full file contents with:

```tsx
import { motion } from "framer-motion";
import type { SourceRecord } from "../../data/sourceRecords";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";

interface RecordCardProps {
  record: SourceRecord;
  index: number;
}

const rotations = [-1.2, 0.8, -0.5, 1.4, -0.9];

export function RecordCard({ record, index }: RecordCardProps) {
  const reduceMotion = usePrefersReducedMotion();
  const rotation = reduceMotion ? 0 : rotations[index % rotations.length];

  const initial = reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12, rotate: 0 };
  const animate = reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, rotate: rotation };
  const exit = reduceMotion
    ? { opacity: 0, transition: { duration: 0.2 } }
    : {
        opacity: 0,
        scale: 0.8,
        y: -28,
        transition: { duration: 0.4, delay: index * 0.06, ease: "easeIn" as const },
      };
  const transition = reduceMotion ? { duration: 0.2 } : { duration: 0.3, delay: index * 0.05 };

  return (
    <motion.div
      initial={initial}
      animate={animate}
      exit={exit}
      transition={transition}
      className="rounded-lg border-l-4 bg-surface p-4 shadow-sm"
      style={{ borderLeftColor: `var(${record.accentVar})` }}
    >
      <div className="mb-2 flex flex-wrap items-baseline justify-between gap-x-2 font-mono text-xs uppercase tracking-wide text-ink-soft">
        <span>
          {record.system}
          {record.facility ? ` · ${record.facility}` : ""}
        </span>
        <span>{record.date}</span>
      </div>
      <p className="font-mono text-sm leading-relaxed text-ink">{record.note}</p>
    </motion.div>
  );
}
```

- [ ] **Step 3: Update `src/components/synthesis/BriefPanel.tsx` to respect reduced motion**

In the `synthesized`/`signedOff` return block, replace the four `motion.div` wrappers' `initial`/`animate`/`transition` props to derive from `usePrefersReducedMotion()`. Replace the full file contents with:

```tsx
import { motion, AnimatePresence } from "framer-motion";
import { medications, flags, gaps, signoffLine } from "../../data/briefContent";
import type { Stage } from "../../state/types";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import { MedicationList } from "./MedicationList";
import { FlagItem } from "./FlagItem";
import { GapsList } from "./GapsList";
import { SignoffBar } from "./SignoffBar";

interface BriefPanelProps {
  stage: Stage;
  signoffChecked: boolean;
  onToggleSignoff: () => void;
  onConfirmSignoff: () => void;
}

export function BriefPanel({ stage, signoffChecked, onToggleSignoff, onConfirmSignoff }: BriefPanelProps) {
  const reduceMotion = usePrefersReducedMotion();

  if (stage === "idle") {
    return (
      <div className="flex min-h-[240px] items-center justify-center rounded-lg border border-dashed border-border p-8 text-center text-sm text-ink-soft">
        Click "Synthesize" to collapse these five records into one brief.
      </div>
    );
  }

  if (stage === "synthesizing") {
    return (
      <div className="rounded-lg border border-border bg-surface p-6">
        <div className="h-4 w-1/3 animate-pulse rounded bg-accent-dim" />
        <div className="mt-4 space-y-2">
          <div className="h-3 w-full animate-pulse rounded bg-accent-dim" />
          <div className="h-3 w-5/6 animate-pulse rounded bg-accent-dim" />
          <div className="h-3 w-2/3 animate-pulse rounded bg-accent-dim" />
        </div>
      </div>
    );
  }

  const sectionInitial = reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 };
  const sectionAnimate = reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 };
  const baseDuration = reduceMotion ? 0.15 : 0.3;
  const delayFor = (delay: number) => (reduceMotion ? 0 : delay);

  return (
    <div className="rounded-lg border border-border bg-surface p-6">
      <motion.div
        initial={sectionInitial}
        animate={sectionAnimate}
        transition={{ duration: baseDuration }}
      >
        <MedicationList medications={medications} />
      </motion.div>

      <motion.div
        initial={sectionInitial}
        animate={sectionAnimate}
        transition={{ duration: baseDuration, delay: delayFor(0.15) }}
        className="mt-6"
      >
        <h3 className="mb-2 text-sm font-semibold text-ink">Flagged for review</h3>
        <div className="space-y-2">
          {flags.map((flag) => (
            <FlagItem key={flag.text} flag={flag} />
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={sectionInitial}
        animate={sectionAnimate}
        transition={{ duration: baseDuration, delay: delayFor(0.3) }}
        className="mt-6"
      >
        <GapsList gaps={gaps} />
      </motion.div>

      <AnimatePresence>
        {stage === "synthesized" && (
          <motion.div
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: baseDuration, delay: delayFor(0.5) }}
            className="mt-6"
          >
            <SignoffBar
              line={signoffLine}
              checked={signoffChecked}
              onToggle={onToggleSignoff}
              onConfirm={onConfirmSignoff}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
```

- [ ] **Step 4: Update `src/components/bridge/SummaryResult.tsx` to respect reduced motion**

Replace the full file contents with:

```tsx
import { motion, AnimatePresence } from "framer-motion";
import type { BridgeStage } from "../../state/types";
import { aiSummary, humanRoutedSummary } from "../../data/transcript";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";

interface SummaryResultProps {
  bridgeStage: BridgeStage;
  highStakes: boolean;
}

export function SummaryResult({ bridgeStage, highStakes }: SummaryResultProps) {
  const reduceMotion = usePrefersReducedMotion();

  if (bridgeStage === "ready") return null;

  if (bridgeStage === "generating") {
    return (
      <div className="rounded-lg border border-border bg-surface p-6">
        <div className="h-3 w-1/2 animate-pulse rounded bg-accent-dim" />
        <div className="mt-3 h-3 w-full animate-pulse rounded bg-accent-dim" />
        <div className="mt-2 h-3 w-4/5 animate-pulse rounded bg-accent-dim" />
      </div>
    );
  }

  const cardInitial = reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.97 };
  const cardAnimate = reduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1 };
  const cardExit = { opacity: 0, transition: { duration: 0.2 } };
  const cardTransition = reduceMotion ? { duration: 0.2 } : { duration: 0.3, delay: 0.15 };
  const sweepTransition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.35, delay: 0.15, ease: "easeOut" as const };

  return (
    <AnimatePresence mode="wait">
      {highStakes ? (
        <motion.div
          key="human"
          initial={cardInitial}
          animate={cardAnimate}
          exit={cardExit}
          transition={cardTransition}
          className="relative overflow-hidden rounded-lg bg-red-bg p-5 pl-6"
        >
          <motion.span
            initial={{ scaleY: reduceMotion ? 1 : 0 }}
            animate={{ scaleY: 1 }}
            transition={sweepTransition}
            style={{ originY: 0 }}
            className="absolute left-0 top-0 h-full w-1 bg-red"
          />
          <span className="mb-2 inline-block font-mono text-xs font-semibold uppercase tracking-wide text-red">
            {humanRoutedSummary.label}
          </span>
          <p className="text-sm leading-relaxed text-ink">{humanRoutedSummary.text}</p>
        </motion.div>
      ) : (
        <motion.div
          key="ai"
          initial={cardInitial}
          animate={cardAnimate}
          exit={cardExit}
          transition={cardTransition}
          className="relative overflow-hidden rounded-lg bg-accent-dim p-5 pl-6"
        >
          <motion.span
            initial={{ scaleY: reduceMotion ? 1 : 0 }}
            animate={{ scaleY: 1 }}
            transition={sweepTransition}
            style={{ originY: 0 }}
            className="absolute left-0 top-0 h-full w-1 bg-accent"
          />
          <span className="mb-2 inline-block font-mono text-xs font-semibold uppercase tracking-wide text-accent">
            {aiSummary.label}
          </span>
          <p className="text-sm leading-relaxed text-ink">{aiSummary.en}</p>
          <p className="mt-3 text-sm leading-relaxed text-ink-soft">{aiSummary.es}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

- [ ] **Step 5: Verify build**

Run: `npm run build`
Expected: no errors.

- [ ] **Step 6: Manual responsive + reduced-motion check**

Run: `npm run dev`, open in a browser:
1. Resize the viewport down to ~375px width (or use browser device toolbar for an iPhone SE-class screen). Confirm: the step indicator stacks vertically or wraps cleanly, the 5 source cards stack to a single column, the transcript lines don't cause horizontal scrolling, and the high-stakes toggle and buttons remain comfortably tappable.
2. In the browser dev tools, enable "Emulate CSS prefers-reduced-motion: reduce" (Chrome DevTools → Rendering tab). Reload and walk through the flow again: confirm cards/sections/summary swap now use simple fades with no slide/scale/stagger, and nothing looks broken or instant-snapped in a jarring way.

Expected: both checks pass with no layout breakage or console errors.
Stop the dev server once verified.

- [ ] **Step 7: Verify production preview**

Run: `npm run build && npm run preview`, open the printed preview URL, and confirm the app loads and the synthesize → sign-off → bridge → toggle flow works identically to the dev server.
Stop the preview server once verified.

- [ ] **Step 8: Commit**

```bash
git add src/hooks/usePrefersReducedMotion.ts src/components/synthesis/RecordCard.tsx src/components/synthesis/BriefPanel.tsx src/components/bridge/SummaryResult.tsx
git commit -m "Add prefers-reduced-motion support and verify responsive/production build"
```

---

## Self-Review Notes

- **Spec coverage:** Interaction flow steps 1–8 → Tasks 8 (wiring) + 5–7 (components). Content verbatim → Task 3. Design tokens/typography → Task 1. Two signature moments → Task 5 (`RecordCard` exit), Task 7 (`SummaryResult` swap). Source-card fragmentation cues (rotation, per-source accent, mono labels) → Task 5. Weighty high-stakes toggle → Task 7 (`HighStakesToggle`, 250ms transition, larger track). Responsive behavior → Task 9. `prefers-reduced-motion` → Task 9. Reset control → Task 4 (`ResetButton`) + Task 8 (wiring). Thesis line → Task 3 (data) + Task 4/8 (`ThesisStatement`, footer placement). Sign-off line wording → Task 3, used verbatim in Task 6. Deployment readiness (`npm install && npm run dev`, `vercel --prod` zero-config) → Task 1 (scaffold) + Task 9 Step 7 (production preview check); no `vercel.json` added since a plain Vite SPA needs none.
- **Placeholder scan:** no TBD/TODO markers; every step has complete, runnable code.
- **Type consistency:** `Stage`/`BridgeStage`/`FlowState`/`FlowAction` (Task 2) match usage in `BriefPanel`, `SummaryResult`, and `App.tsx` exactly. `SourceRecord`, `Medication`, `Flag`, `TranscriptEntry` (Task 3) match every consumer's import and prop types. `StepIndicator`, `SectionHeading`, `ResetButton`, `ThesisStatement` (Task 4) prop shapes match their single call site in `App.tsx` (Task 8).
- **Scope:** single cohesive prototype, not decomposed further — matches the approved spec's single-page, no-backend scope.
