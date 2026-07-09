import { AnimatePresence } from "framer-motion";
import { sourceRecords } from "../../data/sourceRecords";
import { RecordCard } from "./RecordCard";

interface SourceRecordGridProps {
  visible: boolean;
}

export function SourceRecordGrid({ visible }: SourceRecordGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <AnimatePresence>
        {visible && sourceRecords.map((record, i) => <RecordCard key={record.id} record={record} index={i} />)}
      </AnimatePresence>
    </div>
  );
}
