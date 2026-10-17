"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { projects, formatPeriod, type Figure } from "@/data/projects";
import { site } from "@/data/site";
import { Lightbox } from "@/components/lightbox";

// arXiv-flavoured identifier, e.g. "fugo:2406.talentern"
function paperId(start: string, slug: string) {
  const [y, m] = start.split("-");
  return `fugo:${y.slice(2)}${m}.${slug}`;
}

function FigureBlock({
  figure,
  number,
  onOpen,
  wide,
}: {
  figure: Figure;
  number: number;
  onOpen: () => void;
  wide?: boolean;
}) {
  return (
    <figure className={`break-inside-avoid ${wide ? "my-6" : "mb-5"}`}>
      <button
        type="button"
        onClick={onOpen}
        aria-label={`Enlarge figure ${number}: ${figure.caption}`}
        className="block w-full cursor-zoom-in border-2 border-line bg-paper"
      >
        <img
          src={figure.src}
          alt={figure.caption}
          loading="lazy"
          className={`w-full object-cover object-top ${wide ? "max-h-[420px]" : "aspect-video"}`}
        />
      </button>
      <figcaption className="mt-1.5 text-center text-[13px] leading-snug">
        <span className="font-semibold">Fig. {number}.</span> {figure.caption}
      </figcaption>
    </figure>
  );
}

export function ProjectPaper({
  index,
  onClose,
  onNavigate,
}: {
  index: number | null;
  onClose: () => void;
  onNavigate: (next: number) => void;
}) {
  const reducedMotion = useReducedMotion();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [figureIndex, setFigureIndex] = useState<number | null>(null);
  const open = index !== null;
  const project = open ? projects[index] : null;

  const go = useCallback(
    (delta: number) => {
      if (index === null) return;
      onNavigate((index + delta + projects.length) % projects.length);
    },
    [index, onNavigate],
  );

  // New project: back to the top of the paper.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
    scrollRef.current?.focus();
  }, [index]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (figureIndex !== null) return; // the lightbox owns the keyboard
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, figureIndex, go, onClose]);

  const figures = project?.figures ?? [];
  const [lead, ...rest] = figures;
  const sections = project?.sections ?? [];

  return (
    <>
    <AnimatePresence>
      {project && (
        <motion.div
          key="paper-backdrop"
          className="fixed inset-0 z-[90] bg-[#0b0a12]/80 backdrop-blur-sm"
          initial={reducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reducedMotion ? undefined : { opacity: 0 }}
          onClick={onClose}
        >
          <div
            ref={scrollRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby="paper-title"
            className="h-full overflow-y-auto overscroll-contain px-3 py-6 outline-none sm:px-6 sm:py-10"
          >
            <motion.article
              initial={reducedMotion ? false : { y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={reducedMotion ? undefined : { y: 24, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="paper pixel-border mx-auto w-full max-w-4xl bg-card shadow-[8px_8px_0_0_var(--shadow)]"
            >
              {/* Toolbar */}
              <div className="sticky -top-6 z-10 flex items-center justify-between gap-3 border-b-2 sm:-top-10 border-line bg-card/95 px-3 py-2 font-mono text-xs backdrop-blur-sm sm:px-5">
                <span className="truncate text-ink-soft">
                  {paperId(project.start, project.slug)} [{project.kind}]
                </span>
                <div className="flex shrink-0 items-center gap-2">
                  <span className="hidden text-ink-soft sm:inline">
                    {(index ?? 0) + 1} / {projects.length}
                  </span>
                  <button
                    type="button"
                    onClick={() => go(-1)}
                    aria-label="Previous project"
                    className="pixel-border pixel-press h-8 w-8 bg-paper"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    onClick={() => go(1)}
                    aria-label="Next project"
                    className="pixel-border pixel-press h-8 w-8 bg-paper"
                  >
                    ›
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close"
                    className="pixel-border pixel-press h-8 w-8 bg-lime text-on-lime"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="px-5 pb-10 pt-8 font-serif sm:px-12 sm:pt-12">
                {/* Title block */}
                <header className="text-center">
                  <h2 id="paper-title" className="text-3xl font-bold leading-tight sm:text-4xl">
                    {project.title}
                  </h2>
                  <p className="mt-2 text-lg italic text-ink-soft">{project.tagline}</p>
                  <p className="mt-5 text-base">
                    {site.name}
                    <sup>1</sup>
                  </p>
                  <p className="mt-1 text-sm text-ink-soft">
                    <sup>1</sup>
                    {project.affiliation}
                  </p>
                  <p className="mt-1 font-mono text-xs text-ink-soft">
                    {project.role} · {formatPeriod(project)}
                  </p>
                </header>

                {/* Abstract */}
                <section className="mx-auto mt-8 max-w-2xl text-[15px] leading-relaxed">
                  <p className="text-justify hyphens-auto">
                    <span className="font-bold italic">Abstract—</span>
                    {project.abstract}
                  </p>
                  <p className="mt-3 text-justify text-sm">
                    <span className="font-bold italic">Index Terms—</span>
                    {project.stack.join(", ")}.
                  </p>
                </section>

                {lead && (
                  <FigureBlock figure={lead} number={1} wide onOpen={() => setFigureIndex(0)} />
                )}

                {/* Two-column body */}
                {(sections.length > 0 || rest.length > 0) && (
                  <div className="mt-8 gap-8 text-[15px] leading-relaxed md:columns-2 md:[column-rule:1px_dashed_var(--line)]">
                    {sections.map((s, i) => (
                      <section key={s.heading} className="mb-5">
                        <h3 className="mb-1.5 break-after-avoid text-sm font-bold uppercase tracking-wider">
                          {i + 1}. {s.heading}
                        </h3>
                        <p className="text-justify hyphens-auto">
                          {s.body}
                        </p>
                      </section>
                    ))}
                    {rest.map((f, i) => (
                      <FigureBlock
                        key={f.src}
                        figure={f}
                        number={i + 2}
                        onOpen={() => setFigureIndex(i + 1)}
                      />
                    ))}
                  </div>
                )}

                {/* References */}
                {project.links.length > 0 && (
                  <section className="mt-8 border-t-2 border-dashed border-line pt-5">
                    <h3 className="mb-2 text-sm font-bold uppercase tracking-wider">References</h3>
                    <ol className="space-y-1 text-sm">
                      {project.links.map((l, i) => (
                        <li key={l.href} className="flex gap-2">
                          <span className="font-mono text-ink-soft">[{i + 1}]</span>
                          <span>
                            {l.label},{" "}
                            <a
                              href={l.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="break-all font-mono text-[13px] text-lime-deep underline underline-offset-2"
                            >
                              {l.href.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                            </a>
                          </span>
                        </li>
                      ))}
                    </ol>
                  </section>
                )}

                <p className="mt-10 text-center font-mono text-xs text-ink-soft">
                  — {(index ?? 0) + 1} —
                </p>
              </div>
            </motion.article>
          </div>
        </motion.div>
      )}
    </AnimatePresence>

      <Lightbox
        images={figures.map((f) => ({ src: f.src, title: f.caption, link: f.link }))}
        index={figureIndex}
        onClose={() => setFigureIndex(null)}
        onNavigate={setFigureIndex}
      />
    </>
  );
}
