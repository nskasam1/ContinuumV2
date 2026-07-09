interface GapsListProps {
  gaps: string[];
}

export function GapsList({ gaps }: GapsListProps) {
  return (
    <div>
      <h3 className="mb-2 text-sm font-semibold text-ink">Open gaps in care</h3>
      <ul className="list-disc space-y-1 pl-5 text-sm text-ink">
        {gaps.map((gap) => (
          <li key={gap}>{gap}</li>
        ))}
      </ul>
    </div>
  );
}
