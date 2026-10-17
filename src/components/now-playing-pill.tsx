"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useMusic } from "@/components/music-provider";
import { useUi } from "@/components/ui-provider";

/**
 * While a song plays and the hero record is scrolled out of view, a small
 * pill keeps a pause button within reach. Pages without the record (the
 * blog) just show it whenever music is on.
 */
export function NowPlayingPill() {
  const { track, on, toggle } = useMusic();
  const { blip } = useUi();
  const reducedMotion = useReducedMotion();
  const [vinylVisible, setVinylVisible] = useState(false);

  useEffect(() => {
    const vinyl = document.getElementById("vinyl");
    if (!vinyl) return;
    const io = new IntersectionObserver(([entry]) => setVinylVisible(entry.isIntersecting));
    io.observe(vinyl);
    return () => io.disconnect();
  }, []);

  const show = on && !vinylVisible;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={reducedMotion ? false : { y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={reducedMotion ? undefined : { y: 24, opacity: 0 }}
          transition={{ type: "spring", stiffness: 420, damping: 30 }}
          className="pixel-border pixel-shadow-sm fixed bottom-4 left-4 z-[80] flex max-w-[calc(100vw-2rem)] items-center gap-2 bg-card py-1.5 pl-1.5 pr-2"
        >
          {/* Mini record: the cover, spinning */}
          <span
            aria-hidden
            className="vinyl-disc vinyl-spin relative block h-9 w-9 shrink-0 rounded-full"
            style={{ boxShadow: "0 0 0 2px var(--line)" }}
          >
            <img
              src={track.cover}
              alt=""
              className="absolute inset-[22%] h-[56%] w-[56%] rounded-full object-cover"
            />
          </span>
          <button
            type="button"
            onClick={() => {
              document.getElementById("vinyl")?.scrollIntoView({ behavior: "smooth", block: "center" });
              blip();
            }}
            title="Back to the record"
            className="min-w-0 max-w-48 truncate text-left text-sm hover:text-lime-deep"
          >
            <span className="sr-only">Now playing: </span>
            {track.title}
          </button>
          <button
            type="button"
            onClick={() => {
              toggle();
              blip("toggle");
            }}
            aria-label={`Pause ${track.title}`}
            className="pixel-border pixel-press h-8 w-8 shrink-0 bg-lime font-mono text-xs text-on-lime"
          >
            ❚❚
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
