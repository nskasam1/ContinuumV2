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
