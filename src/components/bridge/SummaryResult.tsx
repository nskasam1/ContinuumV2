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
