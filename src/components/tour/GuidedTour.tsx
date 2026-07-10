import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { tourSteps, type TourGate } from "../../data/tourSteps";
import type { FlowState } from "../../state/types";
import { TourSpotlight } from "./TourSpotlight";
import { TourPanel } from "./TourPanel";

interface GuidedTourProps {
  active: boolean;
  flowState: FlowState;
  onExit: () => void;
}

function isGateSatisfied(gate: TourGate, state: FlowState): boolean {
  switch (gate) {
    case "none":
      return true;
    case "synthesized":
      return state.stage === "synthesized" || state.stage === "signedOff";
    case "signedOff":
      return state.stage === "signedOff";
    case "generatedOnce":
      return state.generationCount >= 1;
    case "regenerated":
      return state.generationCount >= 2;
    default:
      return true;
  }
}

export function GuidedTour({ active, flowState, onExit }: GuidedTourProps) {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    if (active) setStepIndex(0);
  }, [active]);

  const step = tourSteps[stepIndex];
  const isLastStep = stepIndex === tourSteps.length - 1;
  const waitingForAction = active && step.gate !== "none" && !isGateSatisfied(step.gate, flowState);

  useEffect(() => {
    if (!active || step.gate === "none" || isLastStep) return;
    if (isGateSatisfied(step.gate, flowState)) {
      setStepIndex((i) => Math.min(i + 1, tourSteps.length - 1));
    }
  }, [active, flowState, stepIndex, step.gate, isLastStep]);

  useEffect(() => {
    if (!active || !step.target) return;
    const el = document.querySelector(`[data-tour="${step.target}"]`);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [active, stepIndex, step.target]);

  if (!active) return null;

  function handleNext() {
    if (isLastStep) {
      onExit();
      return;
    }
    setStepIndex((i) => Math.min(i + 1, tourSteps.length - 1));
  }

  return (
    <>
      <TourSpotlight targetSelector={step.target} />
      <AnimatePresence mode="wait">
        <TourPanel
          key={stepIndex}
          step={step}
          stepNumber={stepIndex + 1}
          totalSteps={tourSteps.length}
          waitingForAction={waitingForAction}
          isLastStep={isLastStep}
          onNext={handleNext}
          onSkip={onExit}
        />
      </AnimatePresence>
    </>
  );
}
