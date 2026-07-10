# Continuum — Interactive Prototype Design

**Date:** 2026-07-08
**Status:** Approved for implementation

## Purpose

An interactive prototype for a hedge fund internship case study (Walleye Capital). Continuum demonstrates that most high-stakes decisions are limited by fragmented *access* to information that already exists, not by missing information — shown through a healthcare scenario with two integrated capabilities:

1. **Clinical Synthesis Brief** — collapses five fragmented, cross-system medical records into one clinician-facing pre-visit brief, without making the clinical decision.
2. **Communication Bridge** — real-time translation during a visit, with a hard-coded rule that routes any high-stakes conversation to a certified human interpreter instead of AI translation.

Both capabilities share one thesis: the AI's only job is closing the access gap, never making the call. Two human checkpoints — a sign-off checkbox and a high-stakes toggle — are the visual proof of that boundary.

This is a client-only demo: no backend, no real API calls, everything simulated with deliberate short delays.

## Repo / Environment

- Build directly in the outer working directory (`/Users/nikhilkasam/Desktop/projects/PersonalProjects/ContinuumV2`), which becomes the Vite project root.
- `git init` in this folder with `origin` set to `https://github.com/nskasam1/ContinuumV2.git` (the user's existing empty GitHub repo). The previously-cloned nested `ContinuumV2/ContinuumV2/` folder (which only contains a stray `impeccable` dependency, no real project) is left untouched — the user will clean it up separately.
- Must run with `npm install && npm run dev` and deploy with zero config via `vercel --prod` from the project root.

## Tech Stack

- Vite + React + TypeScript
- Tailwind CSS
- Framer Motion (`framer-motion`) for transitions, with the two signature moments below getting the most polish
- No backend; all "synthesis"/"translation" is simulated client-side via `setTimeout`-based delays

## State Management

A single explicit state machine, held in one `useReducer` in `App.tsx`, passed down via props through a shallow component tree (no Context needed — max 2-3 levels deep).

```ts
type Stage =
  | "idle"           // 5 source cards shown, step 1 active
  | "synthesizing"    // cards animating out + brief loading
  | "synthesized"      // brief shown, signoff bar visible (unchecked)
  | "signedOff"        // step 1 done, step 2 active, bridge section revealed

type BridgeStage =
  | "ready"           // transcript + toggle + generate button shown
  | "generating"        // brief simulated delay
  | "generated"          // summary result shown (AI or human-routed, per toggle)

interface FlowState {
  stage: Stage;
  signoffChecked: boolean;
  bridgeStage: BridgeStage;
  highStakes: boolean;      // toggle value, can change before/after generation
  hasGeneratedOnce: boolean; // step 3 activates after first generation
}
```

Actions: `SYNTHESIZE_START`, `SYNTHESIZE_COMPLETE`, `TOGGLE_SIGNOFF`, `CONFIRM_SIGNOFF`, `TOGGLE_HIGH_STAKES`, `GENERATE_SUMMARY_START`, `GENERATE_SUMMARY_COMPLETE`, `RESET`.

This makes impossible states unreachable (e.g., step 2 active while step 1 incomplete) and makes `RESET` a single dispatch that returns everything to initial state.

## Component & File Structure

```
src/
  App.tsx                    // reducer + top-level layout + StepIndicator wiring
  state/
    flowReducer.ts           // state machine (Stage, BridgeStage, actions, reducer)
    types.ts
  data/
    sourceRecords.ts         // 5 fragment records (verbatim content from spec)
    briefContent.ts          // synthesized brief content (meds, flags, gaps, signoff line)
    transcript.ts            // transcript lines, badges, AI/human summary copy (EN/ES), thesis line
  components/
    StepIndicator.tsx
    synthesis/
      RecordCard.tsx
      SourceRecordGrid.tsx
      SynthesisButton.tsx
      BriefPanel.tsx
      MedicationList.tsx
      FlagItem.tsx
      GapsList.tsx
      SignoffBar.tsx
    bridge/
      LanguageBadges.tsx
      TranscriptLine.tsx
      TranscriptPanel.tsx
      HighStakesToggle.tsx
      SummaryResult.tsx
    shared/
      SectionHeading.tsx
      ResetButton.tsx
      ThesisStatement.tsx
  styles/
    index.css                // Tailwind directives + font-face/import + CSS custom properties
  main.tsx
index.html
tailwind.config.ts
vite.config.ts
tsconfig.json
package.json
vercel.json                  // not required for a plain Vite SPA build, omit unless build issues arise
```

Each component takes plain props (data + callbacks), no component reaches into global state directly except `App.tsx`. Content data (records, brief, transcript, summary copy) lives in `src/data/*.ts`, separate from components, so copy/colors can be tweaked without touching component logic.

## Visual Design System

**Palette** (CSS custom properties in `styles/index.css`, consumed via Tailwind theme extension):

```
Base:
  --bg          #F4F6F8   page background (cool light neutral, not cream/white)
  --surface     #FFFFFF   card surfaces
  --ink         #0B1E33   deep ink navy — headers, primary text
  --ink-soft    #3D4E60   secondary text
  --border      #D8DEE4   hairline borders

Accent (synthesis / success / primary actions):
  --accent      #0EA5A8   teal/cyan
  --accent-dim  #E2F5F5   accent tint (hover/backgrounds)

Semantic:
  --amber       #B8860B   flagged-but-not-critical
  --amber-bg    #FBF2DE
  --red         #B3261E   critical / high-stakes ONLY
  --red-bg      #FBEAE9

Source-system accents (subtle per-card differentiation, desaturated):
  EPIC   #4A6FA5
  RX     #6B8E6B
  Cerner #8A6FA0
  Quest  #A5794A
  ER     #A54A4A
```

**Typography:**
- Humanist sans: **Inter** — synthesized/human-readable output (brief, summary, UI chrome, headings)
- Monospace: **JetBrains Mono** — raw source data (source card timestamps/system labels/body text, transcript lines)
- Both loaded via `@fontsource` packages (self-hosted, no external CDN calls at runtime — keeps it Vercel-safe and offline-friendly) or system fallback stack if fonts unavailable.

**Source card fragmentation cues:** each `RecordCard` gets a small independent rotation (±0.5–1.5deg, randomized per card but stable via a seeded index, not on every render), a left accent border in its source-system color, and its system name set in mono uppercase with letter-spacing — reinforcing "five incompatible systems" before any animation runs.

**High-stakes toggle:** larger than a typical switch, deliberate travel distance and slightly slower transition (~250ms), red glow/ring state when ON, requires a full click (not hover-triggered) — visually "weighty."

## Animation Choreography

**Moment 1 — Synthesis collapse** (triggered by `SynthesisButton`):
1. Five `RecordCard`s exit: staggered ~60ms apart, each translates toward center + fades + scales down (~0.4s, easeIn).
2. Brief loading state ~700ms: a slim shimmer/pulse bar inside `BriefPanel`'s placeholder (not a spinner — stays terminal-like).
3. Brief content enters section-by-section: Medications → Flags → Gaps, each fades + slides up (0.3s), staggered ~150ms apart.
4. `SignoffBar` slides up from the bottom once gaps finish rendering.

**Moment 2 — Toggle-driven summary swap** (triggered by regenerating `SummaryResult` after `HighStakesToggle` changes):
1. Current result exits: fade + slight scale-down (0.2s).
2. ~150ms gap (avoids a jarring cut, no spinner needed since it's a re-render).
3. New result enters: fade + scale-up + a left-border color sweep that draws top-to-bottom to "stamp" the new state's identity (teal for AI-generated, red for human-routed). This is the most polished moment in the app.
4. `AnimatePresence mode="wait"` ensures states never visually overlap.

Both moments — and all other transitions — fall back to simple opacity-only crossfades (no translate/scale/stagger) when `prefers-reduced-motion: reduce` is set.

## Interaction Flow (unchanged from spec, confirmed)

1. Load: `StepIndicator` (3 steps, step 1 active), 5 source cards left, empty `BriefPanel` right.
2. Click "Synthesize" → Moment 1 animation → `SignoffBar` appears (checkbox + disabled "Confirm & continue").
3. Check box → button enables. Click it → step 1 done, step 2 active, Communication Bridge section revealed, scrolled into view.
4. Bridge section shows language badges + transcript snippet, `HighStakesToggle` (off by default), "Generate after-visit summary" button.
5. Click generate → `SummaryResult` shows AI summary (toggle off) or human-routing message (toggle on) → step 2 done, step 3 active.
6. Toggling after generation + re-clicking generate re-triggers Moment 2, swapping between AI and human-routed states — this must feel easy and satisfying to do repeatedly.
7. `ResetButton` returns the entire `FlowState` to initial.

Closing thesis line (`ThesisStatement`) displayed on the page per spec copy.

## Content

All copy (source records, brief, transcript, summary text, thesis line, sign-off line) is reused verbatim from the spec, stored in `src/data/*.ts`.

## Responsive Behavior

- Two-column synthesis layout (5 cards / brief panel) stacks to a single column on mobile (Tailwind `lg:grid-cols-2`, single column below `lg`).
- `StepIndicator` collapses to a compact horizontal layout with smaller labels on narrow viewports.
- `HighStakesToggle` and buttons retain generous tap targets (min 44px) on mobile.
- Transcript lines stack full-width; no horizontal scrolling introduced anywhere.

## Testing / Verification

No automated test suite requested for this prototype (visual/interactive demo). Verification is manual: run `npm run dev`, walk the full interaction flow (synthesize → sign off → bridge → toggle both directions → reset), check responsive behavior at mobile width, and check `prefers-reduced-motion` fallback.

## Addendum (2026-07-09): Step 3 closing card

Originally step 3 ("Store & carry forward") only lit up in `StepIndicator` with no accompanying content, leaving the demo feeling like a dead end once a summary was generated. Adding a small closing card to give it a visual payoff:

- New component `src/components/shared/ClosingCard.tsx`, no props — static content.
- Rendered as its own top-level section in `App.tsx`, conditioned on `state.hasGeneratedOnce` (same flag that already activates step 3 — no new state needed), placed below the Communication Bridge section and above `ThesisStatement`.
- Entrance: fade + slide-up (~0.3s), consistent with other section reveals; respects `prefers-reduced-motion` via the existing `usePrefersReducedMotion` hook (opacity-only fallback).
- Visual treatment: `SectionHeading` (eyebrow "Capability 1 + 2", title "Carried Forward") above a single `rounded-lg border border-border bg-accent-dim p-5` card — reuses the existing accent-dim family (same as the AI-generated summary card) since this is a calm/settled confirmation state, not a new decision point. No button, no action.
- Copy (verbatim):
  - Label (mono, uppercase, `text-accent`): "Stored · available at next visit"
  - Body: "This synthesized brief and after-visit summary are now attached to the patient's record — available at the next visit, without re-collecting from five systems again."

## Addendum (2026-07-09): Plain-language guidance for non-medical viewers

The target audience (hedge fund case-study reviewers) isn't clinical, so medical jargon and system names (EPIC, Cerner, Quest, "QT prolongation," "sumatriptan") don't land without translation. Adding always-visible plain-language captions rather than hover tooltips or a guided-tour overlay, so nothing requires discovery on a one-time viewing, and it stays in the restrained visual style rather than a SaaS-onboarding tour.

- **Section intro line** above the 5 source cards (Capability 1): explains these are 5 real, disconnected records for the same patient.
- **Per-card plain-English caption** in `RecordCard`: a new sans-serif line under the existing mono system/date row, naming what kind of source it is in plain English (e.g. "Primary care doctor's electronic record"). The raw mono note text is untouched — this reinforces the existing raw-mono-vs-synthesized-sans type contrast rather than fighting it. New field `caption` added to `SourceRecord` in `src/data/sourceRecords.ts`.
- **Medication purpose** in `MedicationList`: a small muted line naming what each drug is for (e.g. "blood pressure medication"). New field `purpose` added to `Medication` in `src/data/briefContent.ts`.
- **Flag copy edits**: inline parenthetical glosses added directly into the existing flag/gap text in `src/data/briefContent.ts` (content-only change, no new UI) — e.g. "sumatriptan (migraine medication)," "borderline QT prolongation (an early warning sign for dangerous heart-rhythm changes...)," "EKG (heart-rhythm test)."
- **Section intro line** above the transcript in Capability 2: explains this is a live visit with real-time translation on both sides.

New shared component `src/components/shared/SectionIntro.tsx` (props: `text: string`) renders the two section-intro lines — small sans-serif paragraph, `text-ink-soft`, placed between `SectionHeading` and the section content.

## Addendum (2026-07-10): Guided tour

The always-visible captions (previous addendum) help but don't actively walk a non-medical viewer through *why* each moment matters. Adding an opt-in, step-by-step coach-mark tour on top of them.

**Trigger:** "Take the tour" button next to `ResetButton` in the header. Clicking it dispatches `RESET` first, then starts the tour at step 1 — guarantees a deterministic walkthrough regardless of prior exploration.

**Mechanism:**
- A bottom-docked fixed panel (`TourPanel`) spans the viewport width: step counter ("Step N of 13"), title, body copy, and either a "Next" button or — for action-gated steps — a hint like "Click the highlighted element to continue" with no button; the tour auto-advances when the real state change happens. Always includes a "Skip tour" control. No "Back" button — app state only moves forward, so back-stepping through action-gated steps would desync from reality.
- A teal spotlight ring (`TourSpotlight`) highlights the current step's target element, computed via `getBoundingClientRect()` on a `document.querySelector('[data-tour="<key>"]')` lookup, recalculated on step change, scroll, and resize. The target is scrolled into view (`scrollIntoView({behavior, block: "center"})`) on each step change.
- The real page underneath stays fully interactive at all times — the tour never blocks clicks, it only highlights and narrates.
- Respects `prefers-reduced-motion` via the existing hook (opacity-only transitions, no ring pulse).
- If the user clicks the real `ResetButton` while the tour is active, the tour exits (avoids a stale spotlight target pointing at now-reset UI).

**State:** New `GuidedTour` component owns `stepIndex` locally; receives `active`, `flowState`, `onExit` as props from `App.tsx`. `flowReducer`/`FlowState` gains one new field, `generationCount: number` (incremented on every `GENERATE_SUMMARY_COMPLETE`), so the tour can distinguish "generated once" from "regenerated" without fragile heuristics.

**Targets:** existing components/wrappers get a `data-tour="<key>"` attribute (plain HTML attribute, no prop threading needed): `source-cards`, `synthesize-button`, `brief-panel`, `signoff-bar`, `bridge-intro`, `high-stakes-toggle`, `generate-button`, `summary-result`, `closing-card`.

**Steps** (title — target — gate condition on `FlowState`):
1. "Welcome to Continuum" — no target — no gate.
2. "Five disconnected records" — `source-cards` — no gate.
3. "Collapse them into one brief" — `synthesize-button` — gate: `stage !== "idle" && stage !== "synthesizing"`.
4. "The synthesized brief" — `brief-panel` — no gate.
5. "The first human checkpoint" — `signoff-bar` — gate: `stage === "signedOff"`.
6. "A language gap, live" — `bridge-intro` — no gate.
7. "The second human checkpoint" — `high-stakes-toggle` — no gate.
8. "Generate the after-visit summary" — `generate-button` — gate: `generationCount >= 1`.
9. "Always labeled, always confirmable" — `summary-result` — no gate.
10. "Now flip it" — `high-stakes-toggle` — gate: `generationCount >= 2`.
11. "The hard stop" — `summary-result` — no gate.
12. "Carried forward" — `closing-card` — no gate.
13. "That's the simulation" — no target — "Finish" button closes the tour.

Full body copy for each step lives directly in `src/data/tourSteps.ts` (new file), not duplicated here.

## Addendum (2026-07-10): Tour redesign — entry point, panel placement, tone

Three follow-up fixes to the guided tour:

- **Entry point:** a full-screen `WelcomeOverlay` now appears on first load (before any other content is interactive) with a one-line pitch and two choices: "Take the tour" or "Explore on my own." This replaces relying on the header button as the only discovery path — the header button stays as a secondary entry point for anyone who dismissed the welcome screen and changes their mind later.
- **Panel placement:** `TourPanel` no longer docks to the bottom of the viewport. It now floats near the spotlighted element (`GuidedTour` measures the target rect once and passes it to both `TourSpotlight` and `TourPanel`; the panel positions itself below the target if there's room, above otherwise, horizontally centered and clamped to viewport edges). This keeps the explanation next to what it's explaining instead of requiring a glance to the bottom of the screen. Step 1 (the old "Welcome to Continuum" step, now redundant with the welcome overlay) was removed, so the tour is 12 steps instead of 13.
- **Copy tone:** all step titles/body copy rewritten to be more conversational (contractions, direct address, shorter sentences) — see `src/data/tourSteps.ts` for current text.

**Bug found and fixed during this pass:** `bg-ink/60` (welcome overlay backdrop) and `text-ink-soft/60` (step indicator inactive labels) were silently not applying their opacity — Tailwind's color-opacity modifier (`/NN`) requires the underlying color to be defined in an RGB-tuple format compatible with `rgb(var(--x) / <alpha>)`, but this project's CSS custom properties are plain hex strings, so the modifier had no effect. Fixed by using explicit `rgba(...)` arbitrary values (`bg-[rgba(11,30,51,0.6)]`, `text-[rgba(61,78,96,0.6)]`) instead of the opacity-modifier syntax. Any future use of `<color>/<NN>` on one of this project's custom Tailwind color tokens will have the same silent failure — use an arbitrary `rgba()` value instead.

## Out of Scope

- No backend, persistence, or real translation/synthesis logic.
- No routing/multi-page — single page app.
- No authentication.
- No automated tests (manual verification only, per prototype nature).
