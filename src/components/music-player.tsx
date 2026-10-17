"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useMusic, type MusicStatus } from "@/components/music-provider";
import { useUi } from "@/components/ui-provider";

const STATUS: Record<MusicStatus, string> = {
  idle: "paused",
  loading: "loading…",
  playing: "now playing",
  "no-source": "theme only — no audio added yet",
  error: "couldn't play this track",
};

function NoteIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-5 w-5" aria-hidden style={{ shapeRendering: "crispEdges" }}>
      <rect x="6" y="2" width="2" height="9" fill="currentColor" />
      <rect x="8" y="2" width="5" height="2" fill="currentColor" />
      <rect x="11" y="4" width="2" height="5" fill="currentColor" />
      <rect x="3" y="10" width="4" height="4" fill="currentColor" />
      <rect x="10" y="8" width="3" height="3" fill="currentColor" />
    </svg>
  );
}

/** Three stepped bars that bounce while music mode is on. */
function Equalizer({ active }: { active: boolean }) {
  return (
    <span aria-hidden className="flex h-4 items-end gap-0.5">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="eq-bar block w-1 bg-current"
          style={{
            height: active ? undefined : "25%",
            animationPlayState: active ? "running" : "paused",
            animationDelay: `${i * -0.3}s`,
          }}
        />
      ))}
    </span>
  );
}

export function MusicPlayer() {
  const { tracks, index, track, on, status, toggle, select, step, youtubeHost } = useMusic();
  const { blip } = useUi();
  const reducedMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const youtubeVisible = on && track.source?.kind === "youtube";

  return (
    <div className="fixed bottom-4 left-4 z-[80] flex flex-col items-start gap-2">
      {/* YouTube's player must stay mounted and visible while it plays. */}
      <div
        ref={youtubeHost}
        aria-label="YouTube player"
        className={`pixel-border pixel-shadow-sm h-[204px] w-[204px] bg-card ${youtubeVisible ? "" : "hidden"}`}
      />

      <AnimatePresence>
        {open && (
          <motion.section
            aria-label="Music player"
            initial={reducedMotion ? false : { y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={reducedMotion ? undefined : { y: 16, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="pixel-border pixel-shadow w-[min(18rem,calc(100vw-2rem))] bg-card"
          >
            <div className="flex items-center justify-between border-b-2 border-line px-3 py-2 font-mono text-xs">
              <span>fugo.fm</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close music player"
                className="h-6 w-6 hover:text-lime-deep"
              >
                ✕
              </button>
            </div>

            <div className="p-3">
              <p aria-live="polite" className="font-mono text-[11px] uppercase tracking-wider text-ink-soft">
                {STATUS[status]}
              </p>
              <div className="mt-1 overflow-hidden whitespace-nowrap font-display text-lg" title={track.title}>
                {on && !reducedMotion ? (
                  // Two copies scrolling by exactly one copy's width = seamless loop.
                  <p className="marquee-run" aria-label={track.title}>
                    <span aria-hidden>{track.title} ✦ </span>
                    <span aria-hidden>{track.title} ✦ </span>
                  </p>
                ) : (
                  <p className="truncate">{track.title}</p>
                )}
              </div>
              <p className="truncate font-mono text-[11px] text-ink-soft">{track.credit}</p>

              <div className="mt-3 flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    step(-1);
                    blip();
                  }}
                  aria-label="Previous track"
                  className="pixel-border pixel-shadow-sm pixel-press h-9 w-9 bg-paper font-mono"
                >
                  ‹‹
                </button>
                <button
                  type="button"
                  onClick={() => {
                    toggle();
                    blip("toggle");
                  }}
                  aria-label={on ? "Pause music" : "Play music"}
                  aria-pressed={on}
                  className="pixel-border pixel-shadow-sm pixel-press h-11 w-14 bg-lime font-mono text-lg text-on-lime"
                >
                  {on ? "❚❚" : "▶"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    step(1);
                    blip();
                  }}
                  aria-label="Next track"
                  className="pixel-border pixel-shadow-sm pixel-press h-9 w-9 bg-paper font-mono"
                >
                  ››
                </button>
              </div>
            </div>

            <ol className="max-h-48 overflow-y-auto border-t-2 border-dashed border-line py-1">
              {tracks.map((t, i) => (
                <li key={t.id}>
                  <button
                    type="button"
                    onClick={() => {
                      select(i);
                      blip();
                    }}
                    aria-current={i === index ? "true" : undefined}
                    className={`flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm ${
                      i === index ? "bg-lime text-on-lime" : "hover:bg-paper"
                    }`}
                  >
                    {/* Palette preview: background, ink, accent */}
                    <span aria-hidden className="flex shrink-0 border border-current">
                      {[t.palette.paper, t.palette.ink, t.palette.lime].map((c, k) => (
                        <span key={k} className="block h-3 w-2" style={{ background: c }} />
                      ))}
                    </span>
                    <span className="truncate">{t.title}</span>
                    {!t.source && (
                      <span className="ml-auto shrink-0 font-mono text-[10px] opacity-70">no audio</span>
                    )}
                  </button>
                </li>
              ))}
            </ol>
          </motion.section>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => {
          setOpen((o) => !o);
          blip();
        }}
        aria-expanded={open}
        aria-label={open ? "Hide music player" : "Show music player"}
        className={`pixel-border pixel-shadow-sm pixel-press flex h-11 items-center gap-2 px-3 ${
          on ? "bg-lime text-on-lime" : "bg-card"
        }`}
      >
        <NoteIcon />
        <Equalizer active={on && !reducedMotion} />
      </button>
    </div>
  );
}
