// Songs and covers live at the repo root. `new URL(..., import.meta.url)`
// and image imports make the bundler copy them into the build with hashed
// names, so they don't need to be in public/.
import terrariaCover from "../../Terraria.jpeg";
import personaCover from "../../Persona.jpeg";
import undertaleCover from "../../Undertale.png";

const song = {
  spaceDay: new URL("../../Space Day.mp3", import.meta.url).href,
  iwatodai: new URL("../../Iwatodai Dorm.mp3", import.meta.url).href,
  sans: new URL("../../Song That Plays When Somebody Verses Sans.mp3", import.meta.url).href,
};

export type Palette = {
  /** Which way the robot's stars etc. behave while this palette is active. */
  scheme: "light" | "dark";
  paper: string;
  card: string;
  ink: string;
  inkSoft: string;
  line: string;
  /** The accent (buttons, highlights). */
  lime: string;
  limeDeep: string;
  amber: string;
  shadow: string;
  /** Text drawn on top of the accent. */
  onLime: string;
};

export type TrackSource =
  /** An audio URL — see `song` above for files in the repo. */
  | { kind: "file"; src: string }
  /** The id from a YouTube link: youtube.com/watch?v=<id>. */
  | { kind: "youtube"; videoId: string };

export type Track = {
  id: string;
  title: string;
  credit: string;
  /** Leave undefined until you've picked a file or video — the theme still works. */
  source?: TrackSource;
  /** Album art shown in the player. */
  cover?: string;
  palette: Palette;
  effect: "stars" | "motes" | "glitch";
};

const monochrome: Palette = {
  scheme: "dark",
  paper: "#0a0a0a",
  card: "#141414",
  ink: "#f4f4f4",
  inkSoft: "#a3a3a3",
  line: "#f4f4f4",
  lime: "#ffffff",
  limeDeep: "#ffffff",
  amber: "#d4d4d4",
  shadow: "#000000",
  onLime: "#0a0a0a",
};

// The first track is the default.
export const tracks: Track[] = [
  {
    id: "terraria-space-day",
    title: "Space Day",
    credit: "Terraria OST — Re-Logic",
    source: { kind: "file", src: song.spaceDay },
    cover: terrariaCover.src,
    palette: {
      scheme: "dark",
      paper: "#0c0a24",
      card: "#16133a",
      ink: "#ebe8ff",
      inkSoft: "#a39ddb",
      line: "#ebe8ff",
      lime: "#7fe7ff",
      limeDeep: "#7fe7ff",
      amber: "#ffd84a",
      shadow: "#04030f",
      onLime: "#0c0a24",
    },
    effect: "stars",
  },
  {
    id: "iwatodai-dorm-reload",
    title: "Iwatodai Dorm -Reload-",
    credit: "Persona 3 Reload OST — ATLUS",
    source: { kind: "file", src: song.iwatodai },
    cover: personaCover.src,
    palette: {
      scheme: "light",
      paper: "#eef4ff",
      card: "#ffffff",
      ink: "#0b2a8a",
      inkSoft: "#4a64b8",
      line: "#0b2a8a",
      lime: "#1f8bff",
      limeDeep: "#0b5bd3",
      amber: "#8fd3ff",
      shadow: "#0b2a8a",
      onLime: "#ffffff",
    },
    effect: "motes",
  },
  {
    id: "verses-sans",
    title: "Song That Plays When Somebody Verses Sans",
    credit: "Undertale 10th Anniversary OST — Toby Fox",
    source: { kind: "file", src: song.sans },
    cover: undertaleCover.src,
    palette: monochrome,
    effect: "glitch",
  },
  // No local file for these two yet, so they still stream from YouTube.
  {
    id: "megalovania-jazz",
    title: "Megalovania (jazz)",
    credit: "Undertale — Toby Fox, jazz cover by insaneintherainmusic",
    source: { kind: "youtube", videoId: "1JbKOeeGRAM" },
    cover: undertaleCover.src,
    palette: monochrome,
    effect: "glitch",
  },
  {
    id: "megalovania-slowed",
    title: "Megalovania (slowed)",
    credit: "Undertale — Toby Fox, slowed edit by Mr.Blackhole",
    source: { kind: "youtube", videoId: "R6l8LIk8Vas" },
    cover: undertaleCover.src,
    palette: monochrome,
    effect: "glitch",
  },
];
