import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import { SectionHeading } from "./SectionHeading";

export function ClosingCard() {
  const reduceMotion = usePrefersReducedMotion();

  return (
    <motion.section
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
      animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      transition={{ duration: reduceMotion ? 0.15 : 0.3 }}
      className="mb-16"
    >
      <SectionHeading eyebrow="Capability 1 + 2" title="Carried Forward" />
      <div className="rounded-lg border border-border bg-accent-dim p-5">
        <span className="font-mono text-xs font-semibold uppercase tracking-wide text-accent">
          Stored · available at next visit
        </span>
        <p className="mt-2 text-sm leading-relaxed text-ink">
          This synthesized brief and after-visit summary are now attached to the patient's record — available at
          the next visit, without re-collecting from five systems again.
        </p>
      </div>
    </motion.section>
  );
}
