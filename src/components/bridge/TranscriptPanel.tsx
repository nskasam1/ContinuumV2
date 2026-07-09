import { transcriptEntries } from "../../data/transcript";
import { TranscriptLine } from "./TranscriptLine";

export function TranscriptPanel() {
  return (
    <div className="space-y-2 rounded-lg border border-border bg-surface p-4">
      {transcriptEntries.map((entry, i) => (
        <TranscriptLine key={i} entry={entry} />
      ))}
    </div>
  );
}
