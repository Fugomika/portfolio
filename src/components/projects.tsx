"use client";

import { useRef, useState } from "react";
import { projects, formatPeriod, type Project } from "@/data/projects";
import { SectionTitle } from "@/components/section-title";
import { useUi } from "@/components/ui-provider";
import { ProjectPaper } from "@/components/project-paper";

const PAGE_SIZE = 9;

const KIND_LABEL: Record<Project["kind"], string> = {
  work: "work",
  personal: "personal",
  college: "college",
};

function Cover({ project }: { project: Project }) {
  const cover = project.figures?.[0];
  if (cover) {
    return (
      <img
        src={cover.src}
        alt=""
        loading="lazy"
        className="aspect-video w-full border-b-2 border-line object-cover object-top transition-transform duration-300 group-hover:scale-[1.03]"
      />
    );
  }
  // No screenshot: a dithered panel with the project's initials.
  const initials = project.title
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  return (
    <div className="dither flex aspect-video w-full items-center justify-center border-b-2 border-line">
      <span className="pixel-border bg-card px-3 py-1 font-display text-3xl">{initials}</span>
    </div>
  );
}

export function Projects() {
  const [page, setPage] = useState(0);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const { blip } = useUi();

  const pageCount = Math.ceil(projects.length / PAGE_SIZE);
  const visible = projects.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const goToPage = (next: number) => {
    if (next < 0 || next >= pageCount || next === page) return;
    setPage(next);
    blip("toggle");
    const top = sectionRef.current?.getBoundingClientRect().top ?? 0;
    if (top < 0) sectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const close = () => {
    const slug = openIndex !== null ? projects[openIndex].slug : null;
    setOpenIndex(null);
    blip("blip");
    // Return focus to the card of whichever project was last open.
    requestAnimationFrame(() => {
      sectionRef.current
        ?.querySelector<HTMLButtonElement>(`[data-slug="${slug}"]`)
        ?.focus();
    });
  };

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="mx-auto max-w-5xl scroll-mt-20 px-4 py-16 sm:px-6"
    >
      <SectionTitle eyebrow="select project" title="Projects" />

      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((p, i) => (
          <li key={p.slug}>
            <button
              type="button"
              data-slug={p.slug}
              onClick={() => {
                setOpenIndex(page * PAGE_SIZE + i);
                blip("toggle");
              }}
              aria-haspopup="dialog"
              className="group pixel-border pixel-shadow pixel-press flex h-full w-full flex-col overflow-hidden bg-card text-left"
            >
              <div className="relative overflow-hidden">
                <Cover project={p} />
                <span className="absolute left-2 top-2 border-2 border-line bg-paper px-1.5 font-mono text-[11px] uppercase">
                  {KIND_LABEL[p.kind]}
                </span>
              </div>
              <div className="flex grow flex-col gap-2 p-4">
                <p className="font-mono text-xs text-ink-soft">{formatPeriod(p)}</p>
                <h3 className="font-display text-xl leading-tight group-hover:text-lime-deep">
                  {p.title}
                </h3>
                <p className="grow text-sm text-ink-soft">{p.tagline}</p>
                <ul className="flex flex-wrap gap-1.5 pt-1" aria-label="Tech stack">
                  {p.stack.slice(0, 3).map((tech) => (
                    <li key={tech} className="border border-line px-1.5 py-0.5 font-mono text-[11px]">
                      {tech}
                    </li>
                  ))}
                  {p.stack.length > 3 && (
                    <li className="px-1 py-0.5 font-mono text-[11px] text-ink-soft">
                      +{p.stack.length - 3}
                    </li>
                  )}
                </ul>
              </div>
            </button>
          </li>
        ))}
      </ul>

      {pageCount > 1 && (
        <nav
          aria-label="Project pages"
          className="mt-10 flex flex-wrap items-center justify-center gap-2 font-mono text-sm"
        >
          <button
            type="button"
            onClick={() => goToPage(page - 1)}
            disabled={page === 0}
            aria-label="Previous page"
            className="pixel-border pixel-shadow-sm pixel-press h-9 w-9 bg-card disabled:opacity-40 disabled:shadow-none"
          >
            ‹
          </button>
          {Array.from({ length: pageCount }, (_, n) => (
            <button
              key={n}
              type="button"
              onClick={() => goToPage(n)}
              aria-current={n === page ? "page" : undefined}
              aria-label={`Page ${n + 1}`}
              className={`pixel-border pixel-shadow-sm pixel-press h-9 min-w-9 px-2 ${
                n === page ? "bg-lime text-[#26221a]" : "bg-card"
              }`}
            >
              {n + 1}
            </button>
          ))}
          <button
            type="button"
            onClick={() => goToPage(page + 1)}
            disabled={page === pageCount - 1}
            aria-label="Next page"
            className="pixel-border pixel-shadow-sm pixel-press h-9 w-9 bg-card disabled:opacity-40 disabled:shadow-none"
          >
            ›
          </button>
          <span className="ml-2 text-ink-soft">
            {projects.length} projects · newest first
          </span>
        </nav>
      )}

      <ProjectPaper
        index={openIndex}
        onClose={close}
        onNavigate={(i) => {
          setOpenIndex(i);
          setPage(Math.floor(i / PAGE_SIZE));
          blip("blip");
        }}
      />
    </section>
  );
}
