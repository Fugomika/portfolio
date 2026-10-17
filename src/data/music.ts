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
  /** A file in public/, e.g. "/music/space.mp3". */
  | { kind: "file"; src: string }
  /** The id from a YouTube link: youtube.com/watch?v=<id>. */
  | { kind: "youtube"; videoId: string };

export type Track = {
  id: string;
  title: string;
  credit: string;
  /** Leave undefined until you've picked a file or video — the theme still works. */
  source?: TrackSource;
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
    id: "terraria-space",
    title: "Space",
    credit: "Terraria OST — Scott Lloyd Shelly",
    source: { kind: "youtube", videoId: "vdKdgAbluyo" },
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
    id: "iwatodai-dorm",
    title: "Iwatodai Dorm",
    credit: "Persona 3 OST — Shoji Meguro",
    source: { kind: "youtube", videoId: "zByoptQ2sS0" },
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
    id: "megalovania-jazz",
    title: "Megalovania (jazz)",
    credit: "Undertale — Toby Fox, jazz cover by insaneintherainmusic",
    source: { kind: "youtube", videoId: "1JbKOeeGRAM" },
    palette: monochrome,
    effect: "glitch",
  },
  {
    id: "megalovania-slowed",
    title: "Megalovania (slowed)",
    credit: "Undertale — Toby Fox, slowed edit by Mr.Blackhole",
    source: { kind: "youtube", videoId: "R6l8LIk8Vas" },
    palette: monochrome,
    effect: "glitch",
  },
];
