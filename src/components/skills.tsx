import { skillGroups } from "@/data/skills";
import { SectionTitle } from "@/components/section-title";

export function Skills() {
  return (
    <section id="skills" className="mx-auto max-w-5xl scroll-mt-20 px-4 py-16 sm:px-6">
      <SectionTitle eyebrow="inventory" title="Skills" />
      <div className="grid gap-6 sm:grid-cols-2">
        {skillGroups.map((group) => (
          <div key={group.label} className="pixel-border pixel-shadow bg-card p-5">
            <h3 className="mb-3 font-display text-xl">{group.label}</h3>
            <ul className="flex flex-wrap gap-2">
              {group.items.map((item) => (
                <li
                  key={item}
                  className="border border-line bg-paper px-2.5 py-1 font-mono text-sm"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
