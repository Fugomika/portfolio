"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { tracks, type Palette, type Track } from "@/data/music";
import { useUi } from "@/components/ui-provider";

export type MusicStatus = "idle" | "loading" | "playing" | "error";

type Music = {
  tracks: Track[];
  index: number;
  track: Track;
  /** Music mode: while on, the current track plays and its palette and effect are applied. */
  on: boolean;
  status: MusicStatus;
  /** How far through the current track, 0–1. */
  progress: number;
  toggle: () => void;
  step: (delta: number) => void;
};

const MusicContext = createContext<Music | null>(null);

export function useMusic() {
  const ctx = useContext(MusicContext);
  if (!ctx) throw new Error("useMusic must be used inside MusicProvider");
  return ctx;
}

const TRACK_KEY = "fugo_track";
const FADE_MS = 1000;

const VARS: [keyof Omit<Palette, "scheme">, string][] = [
  ["paper", "--paper"],
  ["card", "--card"],
  ["ink", "--ink"],
  ["inkSoft", "--ink-soft"],
  ["line", "--line"],
  ["lime", "--lime"],
  ["limeDeep", "--lime-deep"],
  ["amber", "--amber"],
  ["shadow", "--shadow"],
  ["onLime", "--on-lime"],
];

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const [index, setIndex] = useState(0);
  const [on, setOn] = useState(false);
  const [status, setStatus] = useState<MusicStatus>("idle");
  const [progress, setProgress] = useState(0);
  const audio = useRef<HTMLAudioElement | null>(null);
  // Read by the audio element's "ended" listener, which outlives renders.
  const indexRef = useRef(0);
  const played = useRef(new Set<string>());
  // What we last assigned to the audio element. Compared instead of `el.src`,
  // which the browser normalises (e.g. spaces become %20).
  const loadedSrc = useRef<string | null>(null);
  const { unlock } = useUi();
  const track = tracks[index];

  const select = useCallback((i: number) => {
    const n = (i + tracks.length) % tracks.length;
    indexRef.current = n;
    setIndex(n);
    setProgress(0);
    try {
      localStorage.setItem(TRACK_KEY, tracks[n].id);
    } catch {}
  }, []);

  // Restore the last track once on the client.
  useEffect(() => {
    try {
      const i = tracks.findIndex((t) => t.id === localStorage.getItem(TRACK_KEY));
      if (i >= 0) {
        indexRef.current = i;
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIndex(i);
      }
    } catch {}
  }, []);

  // Paint the site in the track's palette while music mode is on.
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-music-fade", "");
    if (on) {
      for (const [key, cssVar] of VARS) root.style.setProperty(cssVar, track.palette[key]);
      root.setAttribute("data-music-scheme", track.palette.scheme);
      root.setAttribute("data-music-track", track.id);
    } else {
      for (const [, cssVar] of VARS) root.style.removeProperty(cssVar);
      root.removeAttribute("data-music-scheme");
      root.removeAttribute("data-music-track");
    }
    // Drop the fade afterwards so the normal dark-mode toggle stays snappy.
    const t = setTimeout(() => root.removeAttribute("data-music-fade"), FADE_MS);
    return () => clearTimeout(t);
  }, [on, track]);

  // Drive the audio from (on, track). Pausing keeps the position, so
  // pressing play again resumes; a new track starts from the top.
  useEffect(() => {
    if (!audio.current) {
      const el = new Audio();
      // Album mode: when a song ends, the next one starts (wrapping around).
      el.addEventListener("ended", () => select(indexRef.current + 1));
      el.addEventListener("timeupdate", () => {
        if (el.duration) setProgress(el.currentTime / el.duration);
      });
      audio.current = el;
    }
    const el = audio.current;
    let cancelled = false;
    /* eslint-disable react-hooks/set-state-in-effect */
    if (!on) {
      el.pause();
      setStatus("idle");
      return;
    }
    setStatus("loading");
    /* eslint-enable react-hooks/set-state-in-effect */
    if (loadedSrc.current !== track.src) {
      loadedSrc.current = track.src;
      el.src = track.src;
    }
    el.play()
      .then(() => {
        if (cancelled) return;
        setStatus("playing");
        played.current.add(track.id);
        if (played.current.size === tracks.length) unlock("crate-digger");
      })
      .catch(() => !cancelled && setStatus("error"));
    return () => {
      cancelled = true;
    };
  }, [on, track, select, unlock]);

  useEffect(() => () => audio.current?.pause(), []);

  const step = useCallback((delta: number) => select(indexRef.current + delta), [select]);
  const toggle = useCallback(() => setOn((o) => !o), []);

  // OS media controls (media keys, lock screen, "now playing" widgets).
  useEffect(() => {
    if (!("mediaSession" in navigator)) return;
    const ms = navigator.mediaSession;
    ms.metadata = on
      ? new MediaMetadata({
          title: track.title,
          artist: track.credit,
          album: "fugo.fm",
          artwork: [{ src: new URL(track.cover, location.href).href, sizes: "447x447" }],
        })
      : null;
    ms.setActionHandler("play", () => setOn(true));
    ms.setActionHandler("pause", () => setOn(false));
    ms.setActionHandler("nexttrack", () => step(1));
    ms.setActionHandler("previoustrack", () => step(-1));
  }, [on, track, step]);

  return (
    <MusicContext.Provider value={{ tracks, index, track, on, status, progress, toggle, step }}>
      {children}
    </MusicContext.Provider>
  );
}
