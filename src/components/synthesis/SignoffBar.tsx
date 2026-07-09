interface SignoffBarProps {
  line: string;
  checked: boolean;
  onToggle: () => void;
  onConfirm: () => void;
}

export function SignoffBar({ line, checked, onToggle, onConfirm }: SignoffBarProps) {
  return (
    <div className="rounded-md border border-border bg-bg p-4">
      <label className="flex cursor-pointer items-start gap-3 text-sm text-ink">
        <input
          type="checkbox"
          checked={checked}
          onChange={onToggle}
          className="mt-0.5 h-4 w-4 shrink-0 accent-accent"
        />
        <span>{line}</span>
      </label>
      <button
        type="button"
        onClick={onConfirm}
        disabled={!checked}
        className="mt-3 inline-flex items-center rounded-md bg-accent px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Confirm &amp; continue
      </button>
    </div>
  );
}
