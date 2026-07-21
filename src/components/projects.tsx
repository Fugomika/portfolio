"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { projects } from "@/data/projects";
import { SectionTitle } from "@/components/section-title";
import { useUi } from "@/components/ui-provider";
import { Lightbox, type GalleryImage } from "@/components/lightbox";

export function Projects() {
  const [open, setOpen] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<{
    images: GalleryImage[];
    index: number;
  } | null>(null);
  const { blip } = useUi();
  const reducedMotion = useReducedMotion();

  return (
    <section id="projects" className="mx-auto max-w-5xl scroll-mt-20 px-4 py-16 sm:px-6">
      <SectionTitle eyebrow="select project" title="Projects" />

      <ul className="flex flex-col gap-6">
        {projects.map((p) => {
          const isOpen = open === p.slug;
          return (
            <li key={p.slug}>
              <article className="pixel-border pixel-shadow bg-card">
                <button
                  type="button"
                  onClick={() => {
                    setOpen(isOpen ? null : p.slug);
                    blip(isOpen ? "blip" : "toggle");
                  }}
                  aria-expanded={isOpen}
                  aria-controls={`case-${p.slug}`}
                  className="group flex w-full flex-wrap items-baseline gap-x-4 gap-y-2 p-5 text-left sm:p-6"
                >
                  <h3 className="font-display text-2xl group-hover:text-lime-deep">
                    {p.title}
                  </h3>
                  <p className="grow text-ink-soft">{p.tagline}</p>
                  <span
                    aria-hidden
                    className={`font-mono text-sm transition-transform ${
                      isOpen ? "rotate-90" : ""
                    }`}
                  >
                    ▶
                  </span>
                  <ul className="flex w-full flex-wrap gap-2 pt-1" aria-label="Tech stack">
                    {p.stack.map((tech) => (
                      <li
                        key={tech}
                        className="border border-line px-2 py-0.5 font-mono text-xs"
                      >
                        {tech}
                      </li>
                    ))}
                  </ul>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`case-${p.slug}`}
                      initial={reducedMotion ? false : { height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={reducedMotion ? undefined : { height: 0, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 260, damping: 30 }}
                      className="overflow-hidden"
                    >
                      <div className="border-t-2 border-dashed border-line p-5 sm:p-6">
                        <p className="mb-4 font-mono text-xs text-ink-soft">
                          {p.role}
                        </p>
                        <div className="grid gap-6 sm:grid-cols-3">
                          <div>
                            <h4 className="mb-2 font-display text-lg">Problem</h4>
                            <p className="text-sm leading-relaxed">{p.problem}</p>
                          </div>
                          <div>
                            <h4 className="mb-2 font-display text-lg">What I built</h4>
                            <p className="text-sm leading-relaxed">{p.built}</p>
                          </div>
                          <div>
                            <h4 className="mb-2 font-display text-lg">Outcome</h4>
                            <p className="text-sm leading-relaxed">{p.outcome}</p>
                          </div>
                        </div>
                        {p.gallery && p.gallery.length > 0 && (
                          <div className="mt-6">
                            <h4 className="mb-3 font-display text-lg">
                              Screenshots
                            </h4>
                            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                              {p.gallery.map((img, i) => (
                                <li key={img.src}>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setLightbox({ images: p.gallery!, index: i });
                                      blip("toggle");
                                    }}
                                    className="pixel-border pixel-press block w-full overflow-hidden bg-paper"
                                    aria-label={`View screenshot: ${img.title}`}
                                  >
                                    <img
                                      src={img.src}
                                      alt={img.title}
                                      loading="lazy"
                                      className="aspect-video w-full object-cover object-top"
                                    />
                                  </button>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {p.links.length > 0 && (
                          <ul className="mt-6 flex flex-wrap gap-3">
                            {p.links.map((l) => (
                              <li key={l.href}>
                                <a
                                  href={l.href}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={() => blip()}
                                  className="pixel-border pixel-shadow-sm pixel-press inline-block bg-paper px-3 py-1.5 font-mono text-sm"
                                >
                                  {l.label} ↗
                                </a>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </article>
            </li>
          );
        })}
      </ul>

      <Lightbox
        images={lightbox?.images ?? []}
        index={lightbox ? lightbox.index : null}
        onClose={() => setLightbox(null)}
        onNavigate={(i) =>
          setLightbox((lb) => (lb ? { ...lb, index: i } : lb))
        }
      />
    </section>
  );
}
