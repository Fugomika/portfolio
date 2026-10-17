"use client";

import Link from "next/link";
import { useUi } from "@/components/ui-provider";
import { useMusic } from "@/components/music-provider";

const NAV = [
  { label: "About", href: "/#about" },
  { label: "Projects", href: "/#projects" },
  { label: "Experience", href: "/#experience" },
  { label: "Skills", href: "/#skills" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/#contact" },
];

function Icon({ name }: { name: "sound-on" | "sound-off" | "scanlines" | "sun" | "moon" }) {
  const paths: Record<string, React.ReactNode> = {
    "sound-on": (
      <>
        <path d="M3 6h3l4-3v10l-4-3H3z" fill="currentColor" />
        <rect x="11" y="6" width="1.5" height="4" fill="currentColor" />
        <rect x="13" y="4.5" width="1.5" height="7" fill="currentColor" />
      </>
    ),
    "sound-off": (
      <>
        <path d="M3 6h3l4-3v10l-4-3H3z" fill="currentColor" />
        <path d="M11 6l4 4M15 6l-4 4" stroke="currentColor" strokeWidth="1.5" />
      </>
    ),
    scanlines: (
      <>
        <rect x="2" y="3" width="12" height="1.5" fill="currentColor" />
        <rect x="2" y="7" width="12" height="1.5" fill="currentColor" />
        <rect x="2" y="11" width="12" height="1.5" fill="currentColor" />
      </>
    ),
    sun: (
      <>
        <rect x="6" y="6" width="4" height="4" fill="currentColor" />
        <rect x="7.25" y="1" width="1.5" height="3" fill="currentColor" />
        <rect x="7.25" y="12" width="1.5" height="3" fill="currentColor" />
        <rect x="1" y="7.25" width="3" height="1.5" fill="currentColor" />
        <rect x="12" y="7.25" width="3" height="1.5" fill="currentColor" />
        <rect x="3" y="3" width="1.5" height="1.5" fill="currentColor" />
        <rect x="11.5" y="3" width="1.5" height="1.5" fill="currentColor" />
        <rect x="3" y="11.5" width="1.5" height="1.5" fill="currentColor" />
        <rect x="11.5" y="11.5" width="1.5" height="1.5" fill="currentColor" />
      </>
    ),
    moon: (
      <>
        <rect x="5" y="2" width="6" height="2" fill="currentColor" />
        <rect x="3" y="4" width="4" height="2" fill="currentColor" />
        <rect x="2" y="6" width="3" height="4" fill="currentColor" />
        <rect x="3" y="10" width="4" height="2" fill="currentColor" />
        <rect x="5" y="12" width="6" height="2" fill="currentColor" />
        <rect x="11" y="3" width="2" height="2" fill="currentColor" />
        <rect x="11" y="11" width="2" height="2" fill="currentColor" />
      </>
    ),
  };
  return (
    <svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden style={{ shapeRendering: "crispEdges" }}>
      {paths[name]}
    </svg>
  );
}

function Toggle({
  pressed,
  onClick,
  label,
  disabled,
  children,
}: {
  pressed: boolean;
  onClick: () => void;
  label: string;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={pressed}
      aria-label={label}
      title={label}
      className={`pixel-border pixel-shadow-sm pixel-press flex h-9 w-9 items-center justify-center font-mono text-sm disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none ${
        pressed ? "bg-lime text-on-lime" : "bg-card"
      }`}
    >
      {children}
    </button>
  );
}

export function Header() {
  const { dark, scanlines, sfx, toggleDark, toggleScanlines, toggleSfx, blip } =
    useUi();
  // While a song plays, its palette is the theme; your setting returns after.
  const { on: musicOn } = useMusic();

  return (
    <header className="sticky top-0 z-50 border-b-2 border-line bg-paper/95 backdrop-blur-sm">
      <a
        href="#main"
        className="absolute left-2 top-2 -translate-y-20 bg-lime px-3 py-2 font-mono text-sm text-on-lime focus:translate-y-0"
      >
        Skip to content
      </a>
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="font-display text-xl tracking-wide"
          onClick={() => blip()}
        >
          fugomika<span className="text-lime-deep">_</span>
        </Link>

        <nav aria-label="Sections" className="hidden gap-5 sm:flex">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="link-sweep font-mono text-sm"
              onClick={() => blip()}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Toggle
            pressed={sfx}
            onClick={toggleSfx}
            label={sfx ? "Turn sound effects off" : "Turn sound effects on"}
          >
            <Icon name={sfx ? "sound-on" : "sound-off"} />
          </Toggle>
          <Toggle
            pressed={scanlines}
            onClick={toggleScanlines}
            label={scanlines ? "Turn CRT scanlines off" : "Turn CRT scanlines on"}
          >
            <Icon name="scanlines" />
          </Toggle>
          <Toggle
            pressed={dark}
            onClick={toggleDark}
            disabled={musicOn}
            label={
              musicOn
                ? "Theme follows the song while music plays"
                : dark
                  ? "Switch to light mode"
                  : "Switch to dark mode"
            }
          >
            <Icon name={dark ? "moon" : "sun"} />
          </Toggle>
        </div>
      </div>
    </header>
  );
}
