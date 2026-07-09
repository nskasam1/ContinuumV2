interface StepIndicatorProps {
  labels: string[];
  currentIndex: number;
  completedCount: number;
}

export function StepIndicator({ labels, currentIndex, completedCount }: StepIndicatorProps) {
  return (
    <ol className="mb-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
      {labels.map((label, i) => {
        const done = i < completedCount;
        const active = i === currentIndex;
        return (
          <li key={label} className="flex flex-1 items-center gap-2">
            <span
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-mono text-xs font-medium ${
                done
                  ? "bg-accent text-white"
                  : active
                    ? "border-2 border-accent text-accent"
                    : "border border-border text-ink-soft"
              }`}
            >
              {done ? "✓" : i + 1}
            </span>
            <span
              className={`text-sm font-medium ${
                active ? "text-ink" : done ? "text-ink-soft" : "text-ink-soft/60"
              }`}
            >
              {label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
