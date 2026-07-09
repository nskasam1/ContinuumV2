import type { Medication } from "../../data/briefContent";

interface MedicationListProps {
  medications: Medication[];
}

export function MedicationList({ medications }: MedicationListProps) {
  return (
    <div>
      <h3 className="mb-2 text-sm font-semibold text-ink">Active medications (cross-source)</h3>
      <ul className="space-y-1">
        {medications.map((med) => (
          <li key={med.name} className="flex flex-wrap items-baseline gap-x-2 text-sm text-ink">
            <span className="font-medium">{med.name}</span>
            <span className="text-xs italic text-ink-soft">{med.purpose}</span>
            <span className="font-mono text-xs text-ink-soft">{med.source}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
