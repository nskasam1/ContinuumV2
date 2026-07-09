interface ResetButtonProps {
  onClick: () => void;
}

export function ResetButton({ onClick }: ResetButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="shrink-0 rounded-md border border-border px-4 py-2 text-sm font-medium text-ink-soft transition-colors hover:border-ink-soft hover:text-ink"
    >
      Reset
    </button>
  );
}
