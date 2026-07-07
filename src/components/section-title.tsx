export function SectionTitle({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {
  return (
    <div className="mb-10">
      <p className="mb-2 font-mono text-sm text-ink-soft">{`// ${eyebrow}`}</p>
      <h2 className="inline-block font-display text-3xl sm:text-4xl">
        <span className="mr-3 inline-block h-6 w-6 translate-y-0.5 bg-lime align-baseline" aria-hidden />
        {title}
      </h2>
    </div>
  );
}
