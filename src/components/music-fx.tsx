"use client";

import { useMemo } from "react";
import { useReducedMotion } from "motion/react";
import { useMusic } from "@/components/music-provider";

// Seeded PRNG so the layout is stable between renders (and lint-pure).
function rng(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function Stars() {
  const stars = useMemo(() => {
    const r = rng(7);
    return Array.from({ length: 70 }, () => ({
      left: r() * 100,
      top: r() * 100,
      size: r() < 0.8 ? 2 : 3,
      delay: r() * 4,
      duration: 2 + r() * 3,
    }));
  }, []);
  return (
    <>
      {stars.map((s, i) => (
        <span
          key={i}
          className="absolute bg-ink"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            animation: `star-twinkle ${s.duration}s steps(4) ${s.delay}s infinite`,
          }}
        />
      ))}
      {[0, 1].map((i) => (
        <span
          key={`shoot-${i}`}
          className="shooting-star absolute h-0.5 w-24"
          style={{ top: `${12 + i * 30}%`, left: `${55 + i * 20}%`, animationDelay: `${i * 4.5}s` }}
        />
      ))}
    </>
  );
}

function Motes() {
  const motes = useMemo(() => {
    const r = rng(3);
    return Array.from({ length: 28 }, () => ({
      left: r() * 100,
      size: 3 + Math.floor(r() * 4),
      delay: -r() * 20,
      duration: 14 + r() * 12,
    }));
  }, []);
  return (
    <>
      {motes.map((m, i) => (
        <span
          key={i}
          className="absolute bottom-0 bg-amber"
          style={{
            left: `${m.left}%`,
            width: m.size,
            height: m.size,
            opacity: 0.55,
            animation: `mote-rise ${m.duration}s linear ${m.delay}s infinite`,
          }}
        />
      ))}
    </>
  );
}

function Glitch() {
  // Thin bars that flick across now and then — low opacity, no flashing.
  return (
    <>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="glitch-bar absolute left-0 right-0 bg-ink"
          style={{ height: 2 + i * 3, animationDelay: `${i * 2.3}s`, animationDuration: `${5 + i * 1.7}s` }}
        />
      ))}
    </>
  );
}

/** Ambient background layer for the current track, behind all content. */
export function MusicFx() {
  const { on, track } = useMusic();
  const reducedMotion = useReducedMotion();
  if (!on || reducedMotion) return null;
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {track.effect === "stars" && <Stars />}
      {track.effect === "motes" && <Motes />}
      {track.effect === "glitch" && <Glitch />}
    </div>
  );
}
