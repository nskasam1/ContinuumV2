import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import type { TourStep } from "../../data/tourSteps";

interface TourPanelProps {
  step: TourStep;
  stepNumber: number;
  totalSteps: number;
  waitingForAction: boolean;
  isLastStep: boolean;
  onNext: () => void;
  onSkip: () => void;
}

export function TourPanel({
  step,
  stepNumber,
  totalSteps,
  waitingForAction,
  isLastStep,
  onNext,
  onSkip,
}: TourPanelProps) {
  const reduceMotion = usePrefersReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
      animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: reduceMotion ? 0.15 : 0.3 }}
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-surface px-4 py-4 shadow-[0_-4px_16px_rgba(11,30,51,0.08)] sm:px-6"
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <span className="font-mono text-xs uppercase tracking-wide text-accent">
            Step {stepNumber} of {totalSteps}
          </span>
          <h3 className="mt-1 text-sm font-semibold text-ink">{step.title}</h3>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-ink-soft">{step.body}</p>
        </div>
        <div className="flex shrink-0 items-center gap-4">
          {waitingForAction ? (
            <span className="text-xs font-medium text-accent">Click the highlighted element to continue →</span>
          ) : (
            <button
              type="button"
              onClick={onNext}
              className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              {isLastStep ? "Finish" : "Next"}
            </button>
          )}
          <button
            type="button"
            onClick={onSkip}
            className="text-xs font-medium text-ink-soft underline-offset-2 hover:text-ink hover:underline"
          >
            Skip tour
          </button>
        </div>
      </div>
    </motion.div>
  );
}
