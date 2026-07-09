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
import { SectionIntro } from "./components/shared/SectionIntro";
import { ResetButton } from "./components/shared/ResetButton";
import { ThesisStatement } from "./components/shared/ThesisStatement";
import { ClosingCard } from "./components/shared/ClosingCard";
import { languageBadges, highStakesPrompt, thesisStatement, stepLabels, transcriptIntro } from "./data/transcript";
import { sourceRecordsIntro } from "./data/sourceRecords";

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
          <p className="mt-2 font-mono text-xs text-ink-soft">
            Simulation — Nikhil Kasam Case Study Prompt 2
          </p>
        </div>
        <ResetButton onClick={() => dispatch({ type: "RESET" })} />
      </header>

      <StepIndicator labels={stepLabels} currentIndex={currentIndex} completedCount={completedCount} />

      <section className="mb-16">
        <SectionHeading eyebrow="Capability 1" title="Clinical Synthesis Brief" />
        {preSynthesis && <SectionIntro text={sourceRecordsIntro} />}
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
          <SectionIntro text={transcriptIntro} />
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

      {state.hasGeneratedOnce && <ClosingCard />}

      <footer className="border-t border-border pt-8">
        <ThesisStatement text={thesisStatement} />
      </footer>
    </div>
  );
}
