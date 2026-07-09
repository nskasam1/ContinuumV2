import type { Flag } from "../../data/briefContent";

interface FlagItemProps {
  flag: Flag;
}

export function FlagItem({ flag }: FlagItemProps) {
  const critical = flag.severity === "critical";
  return (
    <div
      className={`rounded-md border-l-4 p-3 text-sm ${
        critical ? "border-red bg-red-bg text-ink" : "border-amber bg-amber-bg text-ink"
      }`}
    >
      <span className={`mr-2 font-mono text-xs font-semibold uppercase ${critical ? "text-red" : "text-amber"}`}>
        {critical ? "Critical" : "Review"}
      </span>
      {flag.text}
    </div>
  );
}
