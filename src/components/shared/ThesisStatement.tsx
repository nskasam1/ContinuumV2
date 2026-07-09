interface ThesisStatementProps {
  text: string;
}

export function ThesisStatement({ text }: ThesisStatementProps) {
  return <p className="mx-auto max-w-2xl text-center text-sm leading-relaxed text-ink-soft">{text}</p>;
}
