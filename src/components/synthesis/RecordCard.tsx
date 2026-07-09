import { motion } from "framer-motion";
import type { SourceRecord } from "../../data/sourceRecords";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";

interface RecordCardProps {
  record: SourceRecord;
  index: number;
}

const rotations = [-1.2, 0.8, -0.5, 1.4, -0.9];

export function RecordCard({ record, index }: RecordCardProps) {
  const reduceMotion = usePrefersReducedMotion();
  const rotation = reduceMotion ? 0 : rotations[index % rotations.length];

  const initial = reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12, rotate: 0 };
  const animate = reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, rotate: rotation };
  const exit = reduceMotion
    ? { opacity: 0, transition: { duration: 0.2 } }
    : {
        opacity: 0,
        scale: 0.8,
        y: -28,
        transition: { duration: 0.4, delay: index * 0.06, ease: "easeIn" as const },
      };
  const transition = reduceMotion ? { duration: 0.2 } : { duration: 0.3, delay: index * 0.05 };

  return (
    <motion.div
      initial={initial}
      animate={animate}
      exit={exit}
      transition={transition}
      className="rounded-lg border-l-4 bg-surface p-4 shadow-sm"
      style={{ borderLeftColor: `var(${record.accentVar})` }}
    >
      <div className="mb-2 flex flex-wrap items-baseline justify-between gap-x-2 font-mono text-xs uppercase tracking-wide text-ink-soft">
        <span>
          {record.system}
          {record.facility ? ` · ${record.facility}` : ""}
        </span>
        <span>{record.date}</span>
      </div>
      <p className="font-mono text-sm leading-relaxed text-ink">{record.note}</p>
    </motion.div>
  );
}
