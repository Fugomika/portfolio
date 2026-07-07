import { SectionTitle } from "@/components/section-title";
import { experience, education } from "@/data/experience";

export function Experience() {
  return (
    <section id="experience" className="mx-auto max-w-5xl scroll-mt-20 px-4 py-16 sm:px-6">
      <SectionTitle eyebrow="quest log" title="Experience" />
      <ol className="space-y-6">
        {experience.map((exp) => (
          <li key={`${exp.company}-${exp.period}`} className="pixel-border pixel-shadow bg-card p-5 sm:p-6">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h3 className="font-display text-xl">
                {exp.title} <span className="text-lime-deep">@</span> {exp.company}
              </h3>
              <p className="font-mono text-xs text-ink-soft">
                {exp.period} · {exp.location}
              </p>
            </div>
            <ul className="mt-3 space-y-1.5">
              {exp.bullets.map((b) => (
                <li key={b} className="flex gap-2 leading-relaxed">
                  <span aria-hidden className="mt-2.5 block h-1.5 w-1.5 shrink-0 bg-lime-deep" />
                  {b}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>

      <h3 className="mt-10 mb-4 font-mono text-sm text-ink-soft">{"// education"}</h3>
      <div className="grid gap-6 sm:grid-cols-2">
        {education.map((edu) => (
          <div key={edu.school} className="pixel-border pixel-shadow bg-card p-5">
            <h4 className="font-display text-lg">{edu.school}</h4>
            <p className="font-mono text-xs text-lime-deep">{edu.degree}</p>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">{edu.detail}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
