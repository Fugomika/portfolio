"use client";

import { useState } from "react";
import { skillGroups, type Skill } from "@/data/skills";
import { projects, formatPeriod, type Project } from "@/data/projects";
import { SectionTitle } from "@/components/section-title";
import { useUi } from "@/components/ui-provider";
import { openProject } from "@/components/projects";

type Rarity = "common" | "rare" | "epic" | "legendary";

const MIN_SLOTS = 10; // pad each tab with empty slots so it reads as a bag

// Where a skill was used, derived from the project stacks — nothing hand-rated.
function usedIn(skill: Skill): Project[] {
  const prefixes = skill.match ?? [skill.name.toLowerCase()];
  return projects.filter((p) =>
    p.stack.some((tech) => prefixes.some((m) => tech.toLowerCase().startsWith(m))),
  );
}

function rarityOf(count: number): Rarity {
  if (count >= 7) return "legendary";
  if (count >= 3) return "epic";
  if (count >= 1) return "rare";
  return "common";
}

const groups = skillGroups.map((g) => ({
  ...g,
  items: g.items.map((skill) => {
    const found = usedIn(skill);
    const count = found.length + (skill.alsoIn?.length ?? 0);
    return { skill, found, count, rarity: rarityOf(count) };
  }),
}));

function Tile({
  short,
  rarity,
  learning,
  big,
}: {
  short: string;
  rarity: Rarity;
  learning?: boolean;
  big?: boolean;
}) {
  return (
    <span
      data-rarity={learning ? "learning" : rarity}
      className={`item-tile relative flex aspect-square w-full items-center justify-center font-display ${
        big ? "text-4xl" : "text-xl sm:text-2xl"
      }`}
    >
      {short}
    </span>
  );
}

export function Skills() {
  const [tab, setTab] = useState(0);
  // Selection is by name so it survives tab switches; only a click changes it.
  const [selected, setSelected] = useState(groups[0].items[0].skill.name);
  const { blip } = useUi();

  const group = groups[tab];
  const current =
    groups.flatMap((g) => g.items).find((it) => it.skill.name === selected) ?? group.items[0];
  const empty = Math.max(0, MIN_SLOTS - group.items.length);
  const total = groups.reduce((n, g) => n + g.items.length, 0);

  const switchTab = (next: number) => {
    const n = (next + groups.length) % groups.length;
    setTab(n);
    blip("toggle");
    document.getElementById(`skill-tab-${n}`)?.focus();
  };

  return (
    <section id="skills" className="mx-auto max-w-5xl scroll-mt-20 px-4 py-16 sm:px-6">
      <SectionTitle eyebrow="inventory" title="Skills" />

      <div className="pixel-border pixel-shadow bg-card">
        {/* Bag tabs */}
        <div className="flex flex-wrap items-end justify-between gap-2 border-b-2 border-line px-3 pt-3 sm:px-4">
          <div role="tablist" aria-label="Skill categories" className="flex flex-wrap gap-1">
            {groups.map((g, i) => (
              <button
                key={g.label}
                id={`skill-tab-${i}`}
                type="button"
                role="tab"
                aria-selected={i === tab}
                aria-controls="skill-panel"
                tabIndex={i === tab ? 0 : -1}
                onClick={() => i !== tab && switchTab(i)}
                onKeyDown={(e) => {
                  if (e.key === "ArrowRight") switchTab(tab + 1);
                  else if (e.key === "ArrowLeft") switchTab(tab - 1);
                }}
                className={`-mb-0.5 border-2 border-line px-3 py-1.5 font-mono text-xs sm:text-sm ${
                  i === tab ? "border-b-card bg-card" : "bg-paper text-ink-soft hover:text-ink"
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>
          <p className="pb-2 font-mono text-xs text-ink-soft">
            bag {total}/{groups.length * MIN_SLOTS}
          </p>
        </div>

        <div
          id="skill-panel"
          role="tabpanel"
          aria-labelledby={`skill-tab-${tab}`}
          className="grid md:h-[400px] md:grid-cols-[1fr_300px]"
        >
          {/* Slots */}
          <ul className="grid max-h-[340px] grid-cols-4 content-start gap-2 overflow-y-auto p-4 sm:grid-cols-5 sm:gap-3 md:max-h-none">
            {group.items.map(({ skill, count, rarity }) => (
              <li key={skill.name}>
                <button
                  type="button"
                  onClick={() => {
                    setSelected(skill.name);
                    blip("blip");
                  }}
                  aria-pressed={skill.name === current.skill.name}
                  aria-label={`${skill.name}, ${skill.learning ? "in progress" : rarity}`}
                  title={skill.name}
                  className={`item-slot relative block w-full ${
                    skill.name === current.skill.name ? "is-selected" : ""
                  }`}
                >
                  <Tile short={skill.short} rarity={rarity} learning={skill.learning} />
                  {count > 0 && (
                    <span className="absolute bottom-0.5 right-1 font-mono text-[11px] font-medium leading-none [text-shadow:1px_1px_0_var(--card)]">
                      ×{count}
                    </span>
                  )}
                </button>
              </li>
            ))}
            {Array.from({ length: empty }, (_, i) => (
              <li key={`empty-${i}`} aria-hidden className="aspect-square border-2 border-dashed border-line/30" />
            ))}
          </ul>

          {/* Inspect panel */}
          <aside
            aria-live="polite"
            className="h-[320px] overflow-y-auto border-t-2 border-line p-4 sm:p-5 md:h-auto md:border-l-2 md:border-t-0"
          >
            <div className="flex items-center gap-4">
              <div className="w-20 shrink-0">
                <Tile
                  short={current.skill.short}
                  rarity={current.rarity}
                  learning={current.skill.learning}
                  big
                />
              </div>
              <div className="min-w-0">
                <h3 className="font-display text-2xl leading-tight">{current.skill.name}</h3>
                <p
                  data-rarity={current.skill.learning ? "learning" : current.rarity}
                  className="rarity-text font-mono text-xs uppercase tracking-wider"
                >
                  {current.skill.learning ? "quest in progress" : current.rarity}
                  {current.count > 0 && ` · stack ×${current.count}`}
                </p>
              </div>
            </div>

            {current.skill.learning ? (
              <div className="mt-5">
                <p className="mb-2 font-mono text-xs text-ink-soft">XP</p>
                <div className="pixel-border h-4 bg-paper p-0.5">
                  <div className="xp-charge h-full bg-lime" />
                </div>
                <p className="mt-2 text-sm text-ink-soft">Currently levelling this up.</p>
              </div>
            ) : current.count === 0 ? (
              <p className="mt-5 text-sm text-ink-soft">
                In the bag, but not in any project listed here yet.
              </p>
            ) : (
              <div className="mt-5">
                <p className="mb-2 font-mono text-xs text-ink-soft">found in</p>
                <ul className="space-y-1 text-sm">
                  {current.found.map((p) => (
                    <li key={p.slug}>
                      <button
                        type="button"
                        onClick={() => {
                          openProject(p.slug);
                          blip("toggle");
                        }}
                        className="link-sweep w-full text-left"
                      >
                        {p.title}
                        <span className="ml-2 font-mono text-[11px] text-ink-soft">
                          {formatPeriod(p)}
                        </span>
                      </button>
                    </li>
                  ))}
                  {current.skill.alsoIn?.map((place) => (
                    <li key={place} className="text-ink-soft">
                      {place}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>

        {/* Rarity legend */}
        <div className="flex flex-wrap gap-x-4 gap-y-1 border-t-2 border-dashed border-line px-4 py-2 font-mono text-[11px] text-ink-soft">
          <span>rarity = how many projects use it:</span>
          {(["legendary", "epic", "rare", "common"] as const).map((r) => (
            <span key={r} data-rarity={r} className="rarity-text">
              {r} {r === "legendary" ? "7+" : r === "epic" ? "3–6" : r === "rare" ? "1–2" : "0"}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
