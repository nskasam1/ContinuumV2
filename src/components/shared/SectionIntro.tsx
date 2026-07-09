interface SectionIntroProps {
  text: string;
}

export function SectionIntro({ text }: SectionIntroProps) {
  return <p className="mb-4 max-w-2xl text-sm leading-relaxed text-ink-soft">{text}</p>;
}
