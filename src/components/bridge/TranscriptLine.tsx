import type { TranscriptEntry } from "../../data/transcript";

interface TranscriptLineProps {
  entry: TranscriptEntry;
}

const speakerLabels: Record<TranscriptEntry["speaker"], string> = {
  CLINICIAN: "CLINICIAN",
  LIVE_ES: "LIVE (ES)",
  PATIENT: "PATIENT",
  LIVE_EN: "LIVE (EN)",
};

export function TranscriptLine({ entry }: TranscriptLineProps) {
  const isLive = entry.speaker === "LIVE_ES" || entry.speaker === "LIVE_EN";
  return (
    <div className={`font-mono text-sm ${isLive ? "pl-4 text-accent" : "text-ink"}`}>
      <span className="mr-2 text-xs font-semibold uppercase text-ink-soft">{speakerLabels[entry.speaker]}</span>
      <span>{entry.text}</span>
    </div>
  );
}
