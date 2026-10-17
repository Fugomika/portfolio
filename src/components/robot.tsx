"use client";

import { useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { useUi } from "@/components/ui-provider";

const STARS = [
  { top: "8%", left: "12%", size: 3, delay: "0s" },
  { top: "18%", left: "78%", size: 2, delay: "0.7s" },
  { top: "30%", left: "30%", size: 2, delay: "1.4s" },
  { top: "55%", left: "85%", size: 3, delay: "0.3s" },
  { top: "70%", left: "10%", size: 2, delay: "1.1s" },
  { top: "82%", left: "60%", size: 3, delay: "1.8s" },
  { top: "12%", left: "50%", size: 2, delay: "2.2s" },
  { top: "65%", left: "42%", size: 2, delay: "0.9s" },
];

function RobotPixels() {
  return (
    <svg
      viewBox="0 0 24 26"
      className="w-full"
      style={{ shapeRendering: "crispEdges" }}
      aria-hidden
    >
      {/* antenna beacon — blinks while idle */}
      <rect
        x="10.75"
        y="0.75"
        width="2.5"
        height="2.5"
        fill="var(--amber)"
        style={{ animation: "beacon-blink 3.2s steps(2) infinite" }}
      />
      <rect x="11.5" y="3" width="1" height="3" fill="var(--line)" />
      {/* fox ears */}
      <rect x="5" y="2" width="2" height="2" fill="var(--amber)" />
      <rect x="4" y="4" width="4" height="2" fill="var(--amber)" />
      <rect x="5" y="4" width="2" height="1.5" fill="var(--line)" opacity="0.3" />
      <rect x="17" y="2" width="2" height="2" fill="var(--amber)" />
      <rect x="16" y="4" width="4" height="2" fill="var(--amber)" />
      <rect x="17" y="4" width="2" height="1.5" fill="var(--line)" opacity="0.3" />
      {/* head */}
      <rect x="4" y="6" width="16" height="8" fill="var(--card)" stroke="var(--line)" strokeWidth="1" />
      {/* visor stays dark in both themes — it's a screen */}
      <rect x="6" y="8" width="12" height="4" fill="#211e2e" />
      <rect
        x="8"
        y="9"
        width="2"
        height="2"
        fill="var(--lime)"
        style={{ animation: "eye-blink 4s steps(2) infinite" }}
      />
      <rect
        x="14"
        y="9"
        width="2"
        height="2"
        fill="var(--lime)"
        style={{ animation: "eye-blink 4s steps(2) 0.15s infinite" }}
      />
      <rect x="10.5" y="12.6" width="3" height="0.8" fill="var(--line)" opacity="0.5" />
      {/* neck + body */}
      <rect x="10" y="14" width="4" height="1" fill="var(--line)" />
      <rect x="6" y="15" width="12" height="7" fill="var(--card)" stroke="var(--line)" strokeWidth="1" />
      {/* chest screen + buttons */}
      <rect x="8" y="17" width="4" height="3" fill="var(--lime)" />
      <rect x="14" y="17" width="1.5" height="1.5" fill="var(--amber)" />
      <rect x="14" y="19" width="1.5" height="1.5" fill="var(--line)" opacity="0.4" />
      {/* arms with lime mittens */}
      <rect x="2.5" y="16" width="2.5" height="4" fill="var(--card)" stroke="var(--line)" strokeWidth="1" />
      <rect x="2.5" y="20" width="2.5" height="1.5" fill="var(--lime)" />
      <rect x="19" y="16" width="2.5" height="4" fill="var(--card)" stroke="var(--line)" strokeWidth="1" />
      <rect x="19" y="20" width="2.5" height="1.5" fill="var(--lime)" />
      {/* legs + feet */}
      <rect x="8" y="22" width="3" height="2.5" fill="var(--card)" stroke="var(--line)" strokeWidth="1" />
      <rect x="13" y="22" width="3" height="2.5" fill="var(--card)" stroke="var(--line)" strokeWidth="1" />
      <rect x="7.5" y="24.5" width="4" height="1.5" fill="var(--line)" />
      <rect x="12.5" y="24.5" width="4" height="1.5" fill="var(--line)" />
      {/* dithered shading */}
      <rect x="7" y="21" width="1" height="1" fill="var(--line)" opacity="0.25" />
      <rect x="9" y="21" width="1" height="1" fill="var(--line)" opacity="0.25" />
      <rect x="11" y="21" width="1" height="1" fill="var(--line)" opacity="0.25" />
      <rect x="13" y="21" width="1" height="1" fill="var(--line)" opacity="0.25" />
      <rect x="15" y="21" width="1" height="1" fill="var(--line)" opacity="0.25" />
    </svg>
  );
}

export function Robot() {
  const { blip } = useUi();
  const reducedMotion = useReducedMotion();
  const [rings, setRings] = useState<number[]>([]);
  const [spin, setSpin] = useState(0);
  const lastPing = useRef(0);

  const ping = () => {
    const now = Date.now();
    if (now - lastPing.current < 350) return;
    lastPing.current = now;
    const id = now;
    setRings((r) => [...r.slice(-3), id]);
    setTimeout(() => setRings((r) => r.filter((x) => x !== id)), 900);
  };

  const onClick = () => {
    ping();
    blip("ping");
    if (!reducedMotion) setSpin((s) => s + 1);
  };

  return (
    <div className="relative mx-auto flex aspect-square w-full max-w-xs items-center justify-center sm:max-w-sm">
      {/* starfield — only visible against the dark-mode sky */}
      <div aria-hidden className="absolute inset-0 hidden dark:block">
        {STARS.map((s, i) => (
          <span
            key={i}
            className="absolute bg-ink"
            style={{
              top: s.top,
              left: s.left,
              width: s.size,
              height: s.size,
              animation: `star-twinkle 2.8s steps(2) ${s.delay} infinite`,
            }}
          />
        ))}
      </div>

      <div
        aria-hidden
        className="absolute inset-[6%] rounded-full border-2 border-dashed border-line opacity-20"
      />

      {rings.map((id) => (
        <span
          key={id}
          aria-hidden
          className="absolute h-24 w-24 rounded-full border-2 border-lime-deep"
          style={{ animation: "ping-ring 0.9s steps(8) forwards" }}
        />
      ))}

      <motion.button
        type="button"
        onClick={onClick}
        onMouseEnter={() => {
          ping();
          blip("blip");
        }}
        animate={{ rotate: spin * 360 }}
        transition={{ type: "spring", stiffness: 120, damping: 14 }}
        className="relative w-2/3 cursor-pointer border-0 bg-transparent p-4"
        style={{
          animation: reducedMotion ? undefined : "float-bob 4.5s ease-in-out infinite",
        }}
        aria-label="Pixel robot. Click to send it spinning."
        title="Beep boop"
      >
        <RobotPixels />
      </motion.button>
    </div>
  );
}
