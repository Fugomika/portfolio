"use client";

import { useMemo } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
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

// --- Terraria: sky islands + wyverns ---------------------------------------
// Fixed Terraria-ish colours: these are drawn objects, not UI, so they don't
// follow the palette.
const T = {
  grass: "#5cbf3a",
  grassLight: "#8fe05a",
  dirt: "#8a5a33",
  stone: "#6f6a80",
  stoneDark: "#4d495c",
  trunk: "#6b4423",
  leaves: "#3f9a2e",
  brick: "#a6513c",
  roof: "#6e2c22",
  door: "#3a2a1a",
  scale: "#efeaf7",
  scaleShade: "#b9b2d6",
  eye: "#d93a4f",
};

/** A small floating island: grass, dirt, a tapering stone underside, a tree and a hut. */
function Island({ width, house }: { width: number; house?: boolean }) {
  const r = (x: number, y: number, w: number, h: number, fill: string) => (
    <rect x={x} y={y} width={w} height={h} fill={fill} />
  );
  return (
    <svg width={width} viewBox="0 0 40 30" style={{ shapeRendering: "crispEdges" }}>
      {/* tree */}
      {r(7, 3, 2, 7, T.trunk)}
      {r(4, 0, 8, 2, T.leaves)}
      {r(3, 2, 10, 3, T.leaves)}
      {r(5, 5, 6, 1, T.leaves)}
      {/* hut */}
      {house && (
        <>
          {r(23, 4, 12, 2, T.roof)}
          {r(24, 3, 10, 1, T.roof)}
          {r(24, 6, 10, 4, T.brick)}
          {r(28, 7, 2, 3, T.door)}
        </>
      )}
      {/* ground */}
      {r(2, 10, 36, 1, T.grassLight)}
      {r(2, 11, 36, 2, T.grass)}
      {r(3, 13, 34, 3, T.dirt)}
      {r(5, 16, 30, 3, T.stone)}
      {r(9, 19, 22, 3, T.stone)}
      {r(13, 22, 14, 3, T.stoneDark)}
      {r(17, 25, 6, 2, T.stoneDark)}
      {r(19, 27, 2, 2, T.stoneDark)}
      {/* dangling bits */}
      {r(6, 19, 2, 2, T.dirt)}
      {r(33, 19, 1, 3, T.dirt)}
    </svg>
  );
}

// Wide screens: parked in the side gutters (outside the 1024px content
// column) so they never sit behind text.
const ISLANDS: {
  side: "left" | "right";
  inset: string;
  top: string;
  width: number;
  house?: boolean;
  duration: number;
  /** Narrow screens have no gutters, so they get their own single island. */
  screens: "wide" | "narrow";
}[] = [
  { side: "left", inset: "1rem", top: "16%", width: 112, house: true, duration: 5, screens: "wide" },
  { side: "right", inset: "1.25rem", top: "58%", width: 96, duration: 6.5, screens: "wide" },
  { side: "left", inset: "2rem", top: "80%", width: 64, duration: 4.2, screens: "wide" },
  { side: "left", inset: "56%", top: "40%", width: 76, house: true, duration: 5.5, screens: "narrow" },
];

function Islands() {
  return (
    <>
      {ISLANDS.map((isl, i) => (
        <span
          key={i}
          className={`absolute ${isl.screens === "wide" ? "hidden xl:block" : "xl:hidden"}`}
          style={{
            [isl.side]: isl.inset,
            top: isl.top,
            animation: `island-bob ${isl.duration}s steps(6) ${-i * 1.3}s infinite alternate`,
          }}
        >
          <Island width={isl.width} house={isl.house} />
        </span>
      ))}
    </>
  );
}

type Part = "head" | "body" | "legs" | "tail";

/** One wyvern segment on a 16x16 grid, facing right (+x); offset-rotate turns it along the path. */
function WyvernPart({ part }: { part: Part }) {
  const r = (x: number, y: number, w: number, h: number, fill: string) => (
    <rect x={x} y={y} width={w} height={h} fill={fill} />
  );
  return (
    // The head is drawn larger so the front reads as a dragon, not a tube.
    <svg
      width={part === "head" ? 40 : 32}
      height={part === "head" ? 40 : 32}
      viewBox="0 0 16 16"
      style={{ shapeRendering: "crispEdges" }}
    >
      {part === "head" && (
        <>
          {r(1, 1, 2, 4, T.scaleShade)}
          {r(4, 0, 2, 4, T.scaleShade)}
          {r(1, 4, 10, 9, T.scale)}
          {r(11, 6, 4, 5, T.scale)}
          {r(1, 11, 10, 2, T.scaleShade)}
          {r(11, 10, 4, 1, T.scaleShade)}
          {r(8, 6, 2, 2, T.eye)}
          {r(13, 7, 1, 1, T.scaleShade)}
        </>
      )}
      {(part === "body" || part === "legs") && (
        <>
          {r(5, 1, 6, 2, T.scaleShade)}
          {r(1, 3, 14, 10, T.scale)}
          {r(1, 11, 14, 2, T.scaleShade)}
          {/* shaded back edge: the next segment tucks under it, so each one reads as a rib */}
          {r(1, 3, 2, 10, T.scaleShade)}
          {r(4, 6, 2, 2, T.scaleShade)}
          {r(10, 7, 2, 2, T.scaleShade)}
          {part === "legs" && (
            <>
              {r(3, 13, 2, 2, T.scaleShade)}
              {r(2, 15, 3, 1, T.scaleShade)}
              {r(11, 13, 2, 2, T.scaleShade)}
              {r(10, 15, 3, 1, T.scaleShade)}
            </>
          )}
        </>
      )}
      {part === "tail" && (
        <>
          {r(7, 4, 9, 8, T.scale)}
          {r(3, 6, 4, 4, T.scale)}
          {r(0, 7, 3, 2, T.scaleShade)}
          {r(7, 10, 9, 2, T.scaleShade)}
        </>
      )}
    </svg>
  );
}

// A long wavy path, wider than any screen; it starts and ends off-screen.
const WAVE =
  "path('M -500 70 Q -350 -50 -200 70 T 100 70 T 400 70 T 700 70 T 1000 70 T 1300 70 T 1600 70 T 1900 70 T 2200 70 T 2500 70 T 2800 70')";
const PARTS: Part[] = ["head", "body", "legs", "body", "body", "body", "body", "legs", "body", "body", "body", "tail"];
const FLIGHT_S = 28;
// Path is ~3.9k px and the flight is 70% of FLIGHT_S (~200 px/s), so this
// keeps ~24px between segments: chunky segments that still overlap a little.
const SEGMENT_GAP_S = 0.12;

function Wyvern({ top, delay }: { top: string; delay: number }) {
  return (
    <div className="absolute left-0" style={{ top }}>
      {PARTS.map((part, i) => (
        <span
          key={i}
          className="absolute left-0 top-0 block"
          style={{
            offsetPath: WAVE,
            offsetRotate: "auto",
            offsetDistance: "0%",
            // Each segment trails the one in front of it by a fixed delay.
            animation: `wyvern-fly ${FLIGHT_S}s linear ${delay + i * SEGMENT_GAP_S}s infinite`,
            zIndex: PARTS.length - i,
          }}
        >
          <WyvernPart part={part} />
        </span>
      ))}
    </div>
  );
}

function Wyverns() {
  return (
    <>
      <Wyvern top="10%" delay={1} />
      <Wyvern top="44%" delay={14} />
    </>
  );
}

function Motes() {
  const motes = useMemo(() => {
    const r = rng(3);
    return Array.from({ length: 28 }, () => ({
      left: r() * 100,
      size: 5 + Math.floor(r() * 5),
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

/** A pixel bone, `h` px tall: knobs at both ends, a shaft between. */
function Bone({ h }: { h: number }) {
  return (
    <svg width="12" height={h} viewBox={`0 0 12 ${h}`} style={{ shapeRendering: "crispEdges" }}>
      <rect x="0" y="0" width="5" height="5" fill="var(--ink)" />
      <rect x="7" y="0" width="5" height="5" fill="var(--ink)" />
      <rect x="3" y="3" width="6" height={h - 6} fill="var(--ink)" />
      <rect x="0" y={h - 5} width="5" height="5" fill="var(--ink)" />
      <rect x="7" y={h - 5} width="5" height="5" fill="var(--ink)" />
    </svg>
  );
}

function Bones() {
  const bones = useMemo(() => {
    const r = rng(11);
    return Array.from({ length: 12 }, () => ({
      fromTop: r() < 0.35,
      height: 40 + Math.floor(r() * 150),
      ltr: r() < 0.5,
      duration: 7 + r() * 6,
      delay: -r() * 13,
    }));
  }, []);
  return (
    <>
      {bones.map((bone, i) => (
        <span
          key={i}
          className={`absolute left-0 ${bone.fromTop ? "top-0" : "bottom-0"}`}
          style={{
            opacity: 0.5,
            animation: `${bone.ltr ? "bone-ltr" : "bone-rtl"} ${bone.duration}s linear ${bone.delay}s infinite`,
          }}
        >
          <Bone h={bone.height} />
        </span>
      ))}
      {/* Every so often, a quick row of short bones dashes along the floor */}
      <span
        className="absolute bottom-0 left-0 flex gap-3"
        style={{ opacity: 0.6, animation: "bone-wave 9s steps(40) 2s infinite" }}
      >
        {Array.from({ length: 9 }, (_, i) => (
          <Bone key={i} h={34} />
        ))}
      </span>
    </>
  );
}

/** Ambient background layer for the current track, behind all content. */
export function MusicFx() {
  const { on, track } = useMusic();
  const reducedMotion = useReducedMotion();
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Keyed by effect, so switching songs cross-fades old → new */}
      <AnimatePresence>
        {on && !reducedMotion && (
          <motion.div
            key={track.effect}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4, ease: "easeInOut" }}
          >
            {track.effect === "stars" && (
              <>
                <Stars />
                <Islands />
                <Wyverns />
              </>
            )}
            {track.effect === "motes" && <Motes />}
            {track.effect === "bones" && (
              <>
                <Bones />
                <Glitch />
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
