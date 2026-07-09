interface HighStakesToggleProps {
  checked: boolean;
  onChange: () => void;
  label: string;
}

export function HighStakesToggle({ checked, onChange, label }: HighStakesToggleProps) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-4 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-sm font-medium text-ink">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        className={`relative h-8 w-16 shrink-0 rounded-full border transition-colors duration-[250ms] ${
          checked ? "border-red bg-red" : "border-border bg-bg"
        }`}
      >
        <span
          className={`absolute left-1 top-1 h-6 w-6 rounded-full bg-white shadow transition-transform duration-[250ms] ${
            checked ? "translate-x-8" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}
