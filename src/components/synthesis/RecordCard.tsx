import { motion } from "framer-motion";
import type { SourceRecord } from "../../data/sourceRecords";

interface RecordCardProps {
  record: SourceRecord;
  index: number;
}

const rotations = [-1.2, 0.8, -0.5, 1.4, -0.9];

export function RecordCard({ record, index }: RecordCardProps) {
  const rotation = rotations[index % rotations.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, rotate: 0 }}
      animate={{ opacity: 1, y: 0, rotate: rotation }}
      exit={{
        opacity: 0,
        scale: 0.8,
        y: -28,
        transition: { duration: 0.4, delay: index * 0.06, ease: "easeIn" },
      }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
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
