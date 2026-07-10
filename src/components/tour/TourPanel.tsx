import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import type { TourStep } from "../../data/tourSteps";
import type { TourRect } from "./types";

interface TourPanelProps {
  step: TourStep;
  stepNumber: number;
  totalSteps: number;
  waitingForAction: boolean;
  isLastStep: boolean;
  targetRect: TourRect | null;
  onNext: () => void;
  onSkip: () => void;
}

const PANEL_WIDTH = 340;
const ESTIMATED_HEIGHT = 230;
const GAP = 16;
const EDGE_MARGIN = 16;

interface Position {
  top: number;
  left: number;
  width: number;
}

function computePosition(targetRect: TourRect | null): Position {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const width = Math.min(PANEL_WIDTH, vw - EDGE_MARGIN * 2);

  if (!targetRect) {
    return {
      top: Math.max(EDGE_MARGIN, vh / 2 - ESTIMATED_HEIGHT / 2),
      left: Math.max(EDGE_MARGIN, vw / 2 - width / 2),
      width,
    };
  }

  const spaceBelow = vh - (targetRect.top + targetRect.height);
  const spaceAbove = targetRect.top;
  const top =
    spaceBelow >= ESTIMATED_HEIGHT + GAP || spaceBelow >= spaceAbove
      ? targetRect.top + targetRect.height + GAP
      : targetRect.top - GAP - ESTIMATED_HEIGHT;
  const left = targetRect.left + targetRect.width / 2 - width / 2;

  return {
    top: Math.max(EDGE_MARGIN, Math.min(top, vh - ESTIMATED_HEIGHT - EDGE_MARGIN)),
    left: Math.max(EDGE_MARGIN, Math.min(left, vw - width - EDGE_MARGIN)),
    width,
  };
}

export function TourPanel({
  step,
  stepNumber,
  totalSteps,
  waitingForAction,
  isLastStep,
  targetRect,
  onNext,
  onSkip,
}: TourPanelProps) {
  const reduceMotion = usePrefersReducedMotion();
  const [pos, setPos] = useState<Position>(() => computePosition(targetRect));

  useEffect(() => {
    setPos(computePosition(targetRect));
  }, [targetRect]);

  return (
    <motion.div
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.98 }}
      transition={{ duration: reduceMotion ? 0.15 : 0.25 }}
      className="fixed z-50 rounded-lg border border-border bg-surface p-4 shadow-[0_8px_24px_rgba(11,30,51,0.16)]"
      style={{ top: pos.top, left: pos.left, width: pos.width }}
    >
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="font-mono text-xs uppercase tracking-wide text-accent">
          Step {stepNumber} of {totalSteps}
        </span>
        <button
          type="button"
          onClick={onSkip}
          className="text-xs font-medium text-ink-soft hover:text-ink hover:underline"
        >
          Skip tour
        </button>
      </div>
      <h3 className="text-sm font-semibold text-ink">{step.title}</h3>
      <p className="mt-1 text-sm leading-relaxed text-ink-soft">{step.body}</p>
      <div className="mt-3">
        {waitingForAction ? (
          <span className="text-xs font-medium text-accent">Click the highlighted spot to continue →</span>
        ) : (
          <button
            type="button"
            onClick={onNext}
            className="w-full rounded-md bg-accent px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 sm:w-auto"
          >
            {isLastStep ? "Finish" : "Next"}
          </button>
        )}
      </div>
    </motion.div>
  );
}
