"use client";

import { useCallback, useEffect, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

export type GalleryImage = { src: string; title: string; link?: string };

export function Lightbox({
  images,
  index,
  onClose,
  onNavigate,
}: {
  images: GalleryImage[];
  index: number | null;
  onClose: () => void;
  onNavigate: (next: number) => void;
}) {
  const reducedMotion = useReducedMotion();
  const dialogRef = useRef<HTMLDivElement>(null);
  const open = index !== null;
  const current = open ? images[index] : null;

  const go = useCallback(
    (delta: number) => {
      if (index === null) return;
      onNavigate((index + delta + images.length) % images.length);
    },
    [index, images.length, onNavigate],
  );

  useEffect(() => {
    if (!open) return;
    dialogRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    // Lock body scroll while the modal is up.
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, go, onClose]);

  return (
    <AnimatePresence>
      {open && current && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0b0a12]/92 p-4 backdrop-blur-md"
          initial={reducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reducedMotion ? undefined : { opacity: 0 }}
          onClick={onClose}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={current.title}
            tabIndex={-1}
            style={{ outline: "none" }}
            className="relative flex max-h-[90vh] w-full max-w-5xl flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between gap-4">
              <p className="font-mono text-sm text-[#ece8dc]">
                {(index ?? 0) + 1} / {images.length}
              </p>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="pixel-border pixel-press flex h-9 w-9 items-center justify-center bg-card font-mono text-sm"
              >
                ✕
              </button>
            </div>

            <div className="relative flex min-h-0 grow items-center justify-center">
              {images.length > 1 && (
                <button
                  type="button"
                  onClick={() => go(-1)}
                  aria-label="Previous image"
                  className="pixel-border pixel-press absolute left-2 z-10 flex h-10 w-10 items-center justify-center bg-card font-mono"
                >
                  ‹
                </button>
              )}
              <motion.img
                key={current.src}
                src={current.src}
                alt={current.title}
                initial={reducedMotion ? false : { opacity: 0.4 }}
                animate={{ opacity: 1 }}
                className="max-h-[74vh] w-auto max-w-full border-2 border-line bg-card object-contain"
              />
              {images.length > 1 && (
                <button
                  type="button"
                  onClick={() => go(1)}
                  aria-label="Next image"
                  className="pixel-border pixel-press absolute right-2 z-10 flex h-10 w-10 items-center justify-center bg-card font-mono"
                >
                  ›
                </button>
              )}
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <p className="font-mono text-sm text-[#ece8dc]">{current.title}</p>
              {current.link && (
                <a
                  href={current.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pixel-border pixel-shadow-sm pixel-press inline-block bg-lime px-3 py-1.5 font-mono text-sm text-on-lime"
                >
                  Visit live ↗
                </a>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
