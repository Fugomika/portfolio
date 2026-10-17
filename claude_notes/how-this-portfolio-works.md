# How this portfolio works

## The big picture

This is a Next.js (App Router) single-page portfolio, fully static — `next build`
prerenders everything (`output: "export"`), so it deploys to GitHub Pages (see
`deploy-github-pages.md`) with no server cost. The page is composed of sections in `src/app/page.tsx`:
Header → Hero → About → Projects → Experience → Skills → Contact → footer.

**The one rule of the architecture:** content lives in `src/data/`, layout lives in
`src/components/`. To change what the site says, you never touch a component.

## Where to edit things

| You want to change… | Edit this file |
|---|---|
| Name, pitch, email, social links, company | `src/data/site.ts` |
| Projects and their case studies | `src/data/projects.ts` |
| Work history / education | `src/data/experience.ts` |
| Skill groups | `src/data/skills.ts` |
| The resume | replace `public/resume.pdf` (currently a placeholder!) |
| About text / avatar | `src/components/about.tsx` |
| Colors | the `:root` and `.dark` blocks in `src/app/globals.css` |

Why a typed data file instead of MDX? With 4 projects, MDX buys you a compile
pipeline and frontmatter parsing for no real benefit. A typed array gives you
autocomplete, a type error if you forget a field, and one obvious place to edit.
If you ever grow to 15+ projects with long-form write-ups, that's the moment to
revisit MDX.

## The design system

Everything visual derives from CSS custom properties defined in `globals.css`:

- `--paper` (background), `--card` (raised surfaces), `--ink` (text + borders),
  `--lime` (the accent), `--amber` (small highlights), `--shadow`.
- Dark mode works by **redefining the same variables** under `.dark` on `<html>`.
  No component knows about dark mode; they just use the variables. This is why
  the satellite, cards, and buttons all adapt automatically.
- Tailwind v4 maps these to utilities via the `@theme inline` block, so
  `bg-paper`, `text-ink-soft`, `border-line` etc. work everywhere.

The "chunky pixel" look comes from three custom utilities:

- `pixel-border` — 2px solid ink border
- `pixel-shadow` — a hard 4px offset box-shadow (no blur = pixel aesthetic)
- `pixel-press` — on `:active`, the element translates 4px down-right and its
  shadow collapses to 0. That's the entire "press the button into the page"
  effect: the element physically moves into the space its shadow occupied.

Fonts: Pixelify Sans (headings only — pixel personality without hurting body
readability), Nunito Sans (body), IBM Plex Mono (labels, chips, the `// eyebrow`
comments). All loaded through `next/font`, which self-hosts them — no request to
Google at runtime, no layout shift (`font-display: swap` + size-adjust handled
for you).

## Theme init without the flash

`layout.tsx` injects a tiny inline `<script>` in `<head>` that reads
`localStorage` and sets the `dark` / `scanlines` classes on `<html>` **before
first paint**. Without this, a returning dark-mode user would see a cream flash
on every load. React later reads the same classes in `UiProvider` to sync its
state (`suppressHydrationWarning` on `<html>` because the server doesn't know
the class).

Defaults for a fresh visitor: **light theme** (dark only if they've explicitly
chosen it — the OS preference is deliberately ignored) and **scanlines on**
(off only if they've toggled them off before).

## The interaction layer (`src/components/ui-provider.tsx`)

One React context owns all the "game feel" state: dark mode, scanlines, SFX,
achievements. Notable decisions:

- **SFX are synthesized** in `src/lib/sfx.ts` with the WebAudio API — square-wave
  beeps built from two oscillators. Zero audio files, zero network, and it only
  ever runs after a user gesture with the toggle explicitly on (muted by default,
  persisted in localStorage).
- **Achievements** persist to localStorage so you don't get spammed with the same
  toast twice. Two exist: click the robot 5 times, and the Konami code
  (↑↑↓↓←→←→BA — there's a hint in the footer).
- **Scanlines** are a `body::before` overlay with a repeating-linear-gradient,
  toggled by a class on `<html>` — pure CSS, costs nothing when off.
- The grain texture is an inline SVG `feTurbulence` data-URI on `body::after` at
  5% opacity. No image file.

## The robot (`src/components/robot.tsx`)

The hero sprite is a fox-eared pixel robot — the same "robot fox" identity as
the helmet avatar in the About section, so the site has one consistent mascot.
It's an inline SVG drawn with `shape-rendering: crispEdges` (that's what keeps
the rectangles pixel-sharp instead of antialiased). Idle animation (floating
bob, blinking antenna beacon, occasional eye-blink) is plain CSS keyframes. The
click spin uses Motion's spring, and the "signal ping" rings are short-lived
DOM elements with a stepped scale animation — `steps(8)` easing makes the ring
expand in discrete jumps, which reads as "retro" rather than smooth. The visor
is a fixed dark color in both themes on purpose: it's a screen, and screens
stay dark.

Stars only render in dark mode (`hidden dark:block`) — the dark sky is what makes
them make sense.

## Motion / reduced motion

The animation library is `motion` — this is Framer Motion's successor (same team,
same API, imported from `motion/react`). Two layers of reduced-motion support:

1. A global CSS `@media (prefers-reduced-motion: reduce)` kill-switch that
   flattens all CSS animations/transitions.
2. `useReducedMotion()` in components that drive JS animation: the robot
   skips its spin, project cards skip the expand spring (content just appears),
   confetti never renders.

## Accessibility checklist (verified in browser)

- Skip link ("Skip to content") appears on first Tab press.
- All toggles are `<button>` with `aria-pressed` + descriptive `aria-label`.
- Project cards are `<button aria-expanded aria-controls>` — expandable via
  keyboard, and the case-study region is linked by id.
- Achievement toast is `role="status" aria-live="polite"` — announced by screen
  readers without stealing focus.
- Focus is a thick lime outline (`:focus-visible`, so mouse clicks don't show it).
- Contact copy button falls back gracefully if the Clipboard API is blocked
  (the mailto link next to it always works).

## TODO before you ship it

1. **Replace `public/resume.pdf`** — the current one is a generated placeholder.
2. Skim `src/data/experience.ts` and the Geotraking / Techno Infinity case
   studies in `src/data/projects.ts` — they're sourced from the resume JSON
   behind your old dev-porto site; double-check anything client-confidential.
3. ~~Swap the pixel avatar~~ — done (`public/avatar.png`).
4. ~~Deploy~~ — done via GitHub Pages; the manual DNS/Settings steps are in
   `deploy-github-pages.md`.

## Section order (why About comes before Projects)

Developer-portfolio guides converge on Hero → Projects → About → Skills →
proof → Contact; the one point they argue about is where About goes. We use
**Hero → About → Projects → Experience → Skills → Contact**: About is short (three
paragraphs), so projects still arrive fast, and Experience (real employers) is
stronger proof than a list of tools, so it sits above Skills.
