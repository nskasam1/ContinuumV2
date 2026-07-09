interface SynthesisButtonProps {
  onClick: () => void;
  disabled: boolean;
  loading: boolean;
}

export function SynthesisButton({ onClick, disabled, loading }: SynthesisButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center gap-2 rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {loading ? "Synthesizing…" : "Synthesize"}
    </button>
  );
}
