"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useMusic, type MusicStatus } from "@/components/music-provider";
import { useUi } from "@/components/ui-provider";

const STATUS: Record<MusicStatus, string> = {
  idle: "press start",
  loading: "dropping the needle…",
  playing: "now playing",
  error: "couldn't play this one",
};

const pad = (n: number) => String(n).padStart(2, "0");

/** Pixel tonearm; pivots onto the record while playing. */
function Tonearm({ on }: { on: boolean }) {
  return (
    <svg
      viewBox="0 0 24 48"
      aria-hidden
      className="pointer-events-none absolute -right-[9%] -top-[6%] h-[58%] transition-transform duration-700 ease-out"
      style={{
        shapeRendering: "crispEdges",
        transformOrigin: "75% 12%",
        // Parked off the record when paused; needle on the grooves when playing.
        transform: `rotate(${on ? 22 : -16}deg)`,
      }}
    >
      {/* pivot base */}
      <rect x="13" y="1" width="10" height="10" fill="var(--card)" stroke="var(--line)" strokeWidth="1.5" />
      <rect x="16" y="4" width="4" height="4" fill="var(--line)" />
      {/* arm */}
      <rect x="17" y="10" width="2" height="26" fill="var(--line)" />
      <rect x="13" y="34" width="6" height="2" fill="var(--line)" />
      {/* headshell + needle */}
      <rect x="9" y="33" width="6" height="9" fill="var(--amber)" stroke="var(--line)" strokeWidth="1" />
      <rect x="11" y="42" width="2" height="3" fill="var(--line)" />
    </svg>
  );
}

export function Vinyl() {
  const { tracks, index, track, on, status, progress, toggle, step } = useMusic();
  const { blip } = useUi();
  const reducedMotion = useReducedMotion();

  const change = (delta: number) => {
    step(delta);
    blip();
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center gap-6 sm:gap-7">
        <button
          type="button"
          onClick={() => change(-1)}
          aria-label="Previous song"
          className="pixel-border pixel-shadow-sm pixel-press h-11 w-11 shrink-0 bg-card font-mono text-lg"
        >
          ‹
        </button>

        <div id="vinyl" className="relative aspect-square w-[min(16rem,52vw)] md:w-48 lg:w-60">
          {/* Song progress around the rim */}
          {/* Sized explicitly: Safari won't stretch an svg from insets alone, which
              pushed the ring off-centre on iPhone. */}
          <svg
            viewBox="0 0 100 100"
            aria-hidden
            className="absolute left-[-7%] top-[-7%] h-[114%] w-[114%] -rotate-90"
          >
            <circle cx="50" cy="50" r="48" fill="none" stroke="var(--line)" strokeOpacity="0.15" strokeWidth="2" />
            <circle
              cx="50"
              cy="50"
              r="48"
              fill="none"
              stroke="var(--lime-deep)"
              strokeWidth="2"
              pathLength={100}
              strokeDasharray={`${progress * 100} 100`}
              className="transition-[stroke-dasharray] duration-300 ease-linear"
            />
          </svg>

          {/* The record — grooves and label spin, the sheen above stays put */}
          <div
            className="vinyl-disc vinyl-spin absolute inset-0 rounded-full"
            style={{ animationPlayState: on ? "running" : "paused" }}
          >
            <div className="absolute inset-[31%] overflow-hidden rounded-full border-2 border-[#0e0e0e] bg-[#222]">
              <AnimatePresence initial={false}>
                <motion.img
                  key={track.id}
                  src={track.cover}
                  alt=""
                  initial={reducedMotion ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={reducedMotion ? undefined : { opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </AnimatePresence>
              <span className="absolute left-1/2 top-1/2 h-[9%] w-[9%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0e0e0e]" />
            </div>
          </div>
          <div aria-hidden className="vinyl-sheen pointer-events-none absolute inset-0 rounded-full" />

          {/* START / pause — sits over the label but doesn't spin, so it stays readable */}
          <button
            type="button"
            onClick={() => {
              toggle();
              blip("toggle");
            }}
            aria-pressed={on}
            aria-label={on ? `Pause ${track.title}` : `Play ${track.title}`}
            className="group absolute inset-[31%] flex items-center justify-center rounded-full"
          >
            {on ? (
              <span className="pixel-border bg-card px-2 py-1 font-mono text-sm opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                ❚❚
              </span>
            ) : (
              <span className="start-blink pixel-border pixel-shadow-sm bg-lime px-2 py-1 font-display text-sm text-on-lime sm:text-base">
                ▶ START
              </span>
            )}
          </button>

          <Tonearm on={on} />
        </div>

        <button
          type="button"
          onClick={() => change(1)}
          aria-label="Next song"
          className="pixel-border pixel-shadow-sm pixel-press h-11 w-11 shrink-0 bg-card font-mono text-lg"
        >
          ›
        </button>
      </div>

      <div className="mt-8 w-[min(18rem,80vw)] text-center">
        <p aria-live="polite" className="font-mono text-[11px] uppercase tracking-wider text-ink-soft">
          {pad(index + 1)} / {pad(tracks.length)} · {STATUS[status]}
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
      </div>
    </div>
  );
}
