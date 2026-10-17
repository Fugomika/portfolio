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

export type MusicStatus = "idle" | "loading" | "playing" | "no-source" | "error";

type Music = {
  tracks: Track[];
  index: number;
  track: Track;
  /** Music mode: while on, the current track's palette and effect are applied. */
  on: boolean;
  status: MusicStatus;
  toggle: () => void;
  select: (i: number) => void;
  step: (delta: number) => void;
  /** Where the YouTube player mounts (YouTube requires it to be visible). */
  youtubeHost: React.RefObject<HTMLDivElement | null>;
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

// --- Minimal YouTube IFrame API typings -----------------------------------
type YTPlayer = {
  loadVideoById: (id: string) => void;
  playVideo: () => void;
  stopVideo: () => void;
  destroy: () => void;
};
type YTNamespace = {
  Player: new (
    el: HTMLElement,
    opts: {
      width: number;
      height: number;
      videoId: string;
      playerVars: Record<string, string | number>;
      events: {
        onReady?: (e: { target: YTPlayer }) => void;
        onStateChange?: (e: { data: number }) => void;
        onError?: () => void;
      };
    },
  ) => YTPlayer;
};
declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let ytLoading: Promise<YTNamespace> | null = null;
function loadYouTube(): Promise<YTNamespace> {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  ytLoading ??= new Promise((resolve, reject) => {
    window.onYouTubeIframeAPIReady = () => resolve(window.YT!);
    const s = document.createElement("script");
    s.src = "https://www.youtube.com/iframe_api";
    s.onerror = () => {
      ytLoading = null;
      reject(new Error("YouTube API failed to load"));
    };
    document.head.appendChild(s);
  });
  return ytLoading;
}
// ---------------------------------------------------------------------------

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const [index, setIndex] = useState(0);
  const [on, setOn] = useState(false);
  const [status, setStatus] = useState<MusicStatus>("idle");
  const audio = useRef<HTMLAudioElement | null>(null);
  const yt = useRef<YTPlayer | null>(null);
  const youtubeHost = useRef<HTMLDivElement | null>(null);
  const track = tracks[index];

  // Restore the last chosen track once on the client.
  useEffect(() => {
    try {
      const i = tracks.findIndex((t) => t.id === localStorage.getItem(TRACK_KEY));
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (i >= 0) setIndex(i);
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

  const stopAll = useCallback(() => {
    audio.current?.pause();
    yt.current?.stopVideo();
  }, []);

  // Drive the actual audio from (on, track).
  useEffect(() => {
    let cancelled = false;
    stopAll();
    /* eslint-disable react-hooks/set-state-in-effect */
    if (!on) {
      setStatus("idle");
      return;
    }
    const src = track.source;
    if (!src) {
      setStatus("no-source");
      return;
    }
    setStatus("loading");
    /* eslint-enable react-hooks/set-state-in-effect */

    if (src.kind === "file") {
      audio.current ??= new Audio();
      const el = audio.current;
      el.loop = true;
      if (!el.src.endsWith(src.src)) el.src = src.src;
      el.play()
        .then(() => !cancelled && setStatus("playing"))
        .catch(() => !cancelled && setStatus("error"));
    } else {
      loadYouTube()
        .then((YT) => {
          if (cancelled || !youtubeHost.current) return;
          if (yt.current) {
            yt.current.loadVideoById(src.videoId);
            return;
          }
          const mount = document.createElement("div");
          youtubeHost.current.replaceChildren(mount);
          yt.current = new YT.Player(mount, {
            width: 200,
            height: 200,
            videoId: src.videoId,
            // loop needs the same id as a one-item playlist
            playerVars: { autoplay: 1, loop: 1, playlist: src.videoId, playsinline: 1, rel: 0 },
            events: {
              onReady: (e) => e.target.playVideo(),
              onStateChange: (e) => e.data === 1 && setStatus("playing"),
              onError: () => setStatus("error"),
            },
          });
        })
        .catch(() => !cancelled && setStatus("error"));
    }
    return () => {
      cancelled = true;
    };
  }, [on, track, stopAll]);

  useEffect(() => () => {
    audio.current?.pause();
    yt.current?.destroy();
  }, []);

  const select = useCallback((i: number) => {
    const n = (i + tracks.length) % tracks.length;
    setIndex(n);
    try {
      localStorage.setItem(TRACK_KEY, tracks[n].id);
    } catch {}
  }, []);

  const step = useCallback((delta: number) => select(index + delta), [index, select]);
  const toggle = useCallback(() => setOn((o) => !o), []);

  return (
    <MusicContext.Provider
      value={{ tracks, index, track, on, status, toggle, select, step, youtubeHost }}
    >
      {children}
    </MusicContext.Provider>
  );
}
