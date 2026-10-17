"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { playSfx } from "@/lib/sfx";

type Achievement = { id: string; title: string; detail: string };

// `satisfies` keeps the literal keys, so unlock() rejects unknown ids.
const ACHIEVEMENTS = {
  "crate-digger": {
    id: "crate-digger",
    title: "Crate digger",
    detail: "You played all three records. Good taste, honestly.",
  },
  "cheat-code": {
    id: "cheat-code",
    title: "Cheat code accepted",
    detail: "↑↑↓↓←→←→BA — a person of culture. Nothing is unlocked. Or is it?",
  },
} satisfies Record<string, Achievement>;

type Ui = {
  dark: boolean;
  scanlines: boolean;
  sfx: boolean;
  toggleDark: () => void;
  toggleScanlines: () => void;
  toggleSfx: () => void;
  blip: (kind?: Parameters<typeof playSfx>[0]) => void;
  unlock: (id: keyof typeof ACHIEVEMENTS) => void;
};

const UiContext = createContext<Ui | null>(null);

export function useUi() {
  const ctx = useContext(UiContext);
  if (!ctx) throw new Error("useUi must be used inside UiProvider");
  return ctx;
}

const KONAMI = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "KeyB",
  "KeyA",
];

export function UiProvider({ children }: { children: React.ReactNode }) {
  const [dark, setDark] = useState(false);
  const [scanlines, setScanlines] = useState(false);
  const [sfx, setSfx] = useState(false);
  const [toast, setToast] = useState<Achievement | null>(null);
  const [confetti, setConfetti] = useState(false);
  const unlocked = useRef<Set<string>>(new Set());
  const reducedMotion = useReducedMotion();

  // One-time sync with what the pre-paint <head> script and localStorage
  // already decided — this state simply can't exist during SSR.
  useEffect(() => {
    const root = document.documentElement;
    /* eslint-disable react-hooks/set-state-in-effect */
    setDark(root.classList.contains("dark"));
    setScanlines(root.classList.contains("scanlines"));
    setSfx(localStorage.getItem("fugo_sfx") === "on");
    /* eslint-enable react-hooks/set-state-in-effect */
    try {
      unlocked.current = new Set(
        JSON.parse(localStorage.getItem("fugo_achievements") ?? "[]")
      );
    } catch {
      unlocked.current = new Set();
    }
  }, []);

  const blip = useCallback(
    (kind: Parameters<typeof playSfx>[0] = "blip") => {
      if (sfx) playSfx(kind);
    },
    [sfx]
  );

  const unlock = useCallback(
    (id: keyof typeof ACHIEVEMENTS) => {
      if (unlocked.current.has(id)) return;
      unlocked.current.add(id);
      localStorage.setItem(
        "fugo_achievements",
        JSON.stringify([...unlocked.current])
      );
      setToast(ACHIEVEMENTS[id]);
      blip("fanfare");
      if (!reducedMotion) {
        setConfetti(true);
        setTimeout(() => setConfetti(false), 2600);
      }
      setTimeout(() => setToast(null), 5000);
    },
    [blip, reducedMotion]
  );

  useEffect(() => {
    let pos = 0;
    const onKey = (e: KeyboardEvent) => {
      pos = e.code === KONAMI[pos] ? pos + 1 : e.code === KONAMI[0] ? 1 : 0;
      if (pos === KONAMI.length) {
        pos = 0;
        unlock("cheat-code");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [unlock]);

  const toggleDark = useCallback(() => {
    setDark((d) => {
      const next = !d;
      document.documentElement.classList.toggle("dark", next);
      localStorage.setItem("fugo_theme", next ? "dark" : "light");
      return next;
    });
    blip("toggle");
  }, [blip]);

  const toggleScanlines = useCallback(() => {
    setScanlines((s) => {
      const next = !s;
      document.documentElement.classList.toggle("scanlines", next);
      localStorage.setItem("fugo_scanlines", next ? "on" : "off");
      return next;
    });
    blip("toggle");
  }, [blip]);

  const toggleSfx = useCallback(() => {
    setSfx((s) => {
      const next = !s;
      localStorage.setItem("fugo_sfx", next ? "on" : "off");
      if (next) playSfx("toggle");
      return next;
    });
  }, []);

  return (
    <UiContext.Provider
      value={{ dark, scanlines, sfx, toggleDark, toggleScanlines, toggleSfx, blip, unlock }}
    >
      {children}

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            role="status"
            aria-live="polite"
            className="fixed bottom-6 left-1/2 z-70 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2"
          >
            <div className="pixel-border pixel-shadow flex items-center gap-3 bg-card p-3">
              <span aria-hidden className="font-display text-2xl text-lime-deep">
                ★
              </span>
              <div>
                <p className="font-display text-sm uppercase tracking-wide">
                  Achievement unlocked: {toast.title}
                </p>
                <p className="text-sm text-ink-soft">{toast.detail}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {confetti && (
        <div aria-hidden className="pointer-events-none fixed inset-0 z-65 overflow-hidden">
          {Array.from({ length: 24 }).map((_, i) => (
            <span
              key={i}
              className="absolute top-0 block h-2 w-2"
              style={{
                left: `${(i * 41) % 100}%`,
                background: i % 3 === 0 ? "var(--lime)" : i % 3 === 1 ? "var(--amber)" : "var(--ink)",
                animation: `confetti-fall ${1.6 + (i % 5) * 0.25}s linear ${(i % 8) * 0.12}s forwards`,
              }}
            />
          ))}
        </div>
      )}
    </UiContext.Provider>
  );
}
