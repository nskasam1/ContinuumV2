interface LanguageBadgesProps {
  preferred: string;
  lep: string;
}

export function LanguageBadges({ preferred, lep }: LanguageBadgesProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <span className="rounded-full border border-border bg-surface px-3 py-1 font-mono text-xs text-ink-soft">
        {preferred}
      </span>
      <span className="rounded-full border border-amber bg-amber-bg px-3 py-1 font-mono text-xs text-amber">
        {lep}
      </span>
    </div>
  );
}
