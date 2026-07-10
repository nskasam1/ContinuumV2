import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";

interface WelcomeOverlayProps {
  onStartTour: () => void;
  onDismiss: () => void;
}

export function WelcomeOverlay({ onStartTour, onDismiss }: WelcomeOverlayProps) {
  const reduceMotion = usePrefersReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduceMotion ? 0.15 : 0.3 }}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-[rgba(11,30,51,0.6)] p-4"
    >
      <motion.div
        initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: reduceMotion ? 0.15 : 0.3, delay: reduceMotion ? 0 : 0.05 }}
        className="w-full max-w-md rounded-lg border border-border bg-surface p-6 text-center shadow-[0_16px_40px_rgba(11,30,51,0.25)]"
      >
        <p className="font-mono text-xs uppercase tracking-widest text-accent">Continuum</p>
        <h2 className="mt-2 text-xl font-semibold text-ink">See it in action</h2>
        <p className="mt-3 text-sm leading-relaxed text-ink-soft">
          Take a quick guided walkthrough of both capabilities — we'll point out what matters and explain it in
          plain English as you go. Or skip ahead and click around on your own.
        </p>
        <div className="mt-6 flex flex-col gap-3">
          <button
            type="button"
            onClick={onStartTour}
            className="rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Take the tour
          </button>
          <button
            type="button"
            onClick={onDismiss}
            className="text-sm font-medium text-ink-soft hover:text-ink hover:underline"
          >
            Explore on my own
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
