interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
}

export function SectionHeading({ eyebrow, title }: SectionHeadingProps) {
  return (
    <div className="mb-4">
      {eyebrow && (
        <p className="mb-1 font-mono text-xs font-semibold uppercase tracking-wider text-accent">
          {eyebrow}
        </p>
      )}
      <h2 className="text-xl font-semibold text-ink sm:text-2xl">{title}</h2>
    </div>
  );
}
