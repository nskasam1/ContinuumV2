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

## Out of Scope

- No backend, persistence, or real translation/synthesis logic.
- No routing/multi-page — single page app.
- No authentication.
- No automated tests (manual verification only, per prototype nature).
