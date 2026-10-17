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
  /** Whether Tailwind's `dark:` variant applies while this palette is active. */
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

export type Track = {
  id: string;
  title: string;
  credit: string;
  /** Audio URL — see `song` above. */
  src: string;
  /** Album art on the record's label. */
  cover: string;
  palette: Palette;
  effect: "stars" | "motes" | "bones";
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

// Played in this order, wrapping back to the first.
export const tracks: Track[] = [
  {
    id: "terraria-space-day",
    title: "Space Day",
    credit: "Terraria OST — Re-Logic",
    src: song.spaceDay,
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
    src: song.iwatodai,
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
    src: song.sans,
    cover: undertaleCover.src,
    palette: monochrome,
    effect: "bones",
  },
];
