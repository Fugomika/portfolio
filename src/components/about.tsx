import { SectionTitle } from "@/components/section-title";

function PixelAvatar() {
  // Placeholder pixel portrait — replace with <img src="/avatar.jpg" alt="..." />
  // (or a real pixel-art commission) when you have one you like.
  return (
    <svg
      viewBox="0 0 16 16"
      className="w-full"
      style={{ shapeRendering: "crispEdges" }}
      role="img"
      aria-label="Pixel-art avatar of Farras wearing a robot fox helmet"
    >
      <rect width="16" height="16" fill="var(--lime)" />
      <rect x="2" y="0" width="1" height="1" fill="var(--amber)" />
      <rect x="13" y="0" width="1" height="1" fill="var(--amber)" />
      <rect x="2" y="1" width="2" height="2" fill="var(--amber)" />
      <rect x="12" y="1" width="2" height="2" fill="var(--amber)" />
      <rect x="7.5" y="0" width="1" height="1" fill="var(--amber)" />
      <rect x="4" y="1" width="8" height="2" fill="var(--card)" />
      <rect x="3" y="2" width="10" height="2" fill="var(--card)" />
      <rect x="2" y="4" width="12" height="1" fill="var(--line)" />
      <rect x="4" y="5" width="8" height="6" fill="#e8b98a" />
      <rect x="2" y="5" width="2" height="5" fill="var(--card)" />
      <rect x="12" y="5" width="2" height="5" fill="var(--card)" />
      <rect x="5" y="7" width="2" height="2" fill="var(--ink)" />
      <rect x="9" y="7" width="2" height="2" fill="var(--ink)" />
      <rect x="4" y="9" width="8" height="1" fill="#26221a" opacity="0.15" />
      <rect x="6" y="10" width="4" height="1" fill="#26221a" />
      <rect x="3" y="12" width="10" height="4" fill="var(--card)" />
      <rect x="3" y="12" width="10" height="1" fill="var(--line)" />
    </svg>
  );
}

export function About() {
  return (
    <section id="about" className="mx-auto max-w-5xl scroll-mt-20 px-4 py-16 sm:px-6">
      <SectionTitle eyebrow="player profile" title="About" />
      <div className="grid items-start gap-8 sm:grid-cols-[1fr_3fr]">
        <div className="pixel-border pixel-shadow mx-auto w-40 bg-card p-2 sm:w-full sm:max-w-48">
          <PixelAvatar />
        </div>
        <div className="space-y-4 text-lg leading-relaxed">
          <p>
            I&apos;m Farras, a fullstack developer from Bogor, Indonesia. By day
            I turn satellite AIS signals into live vessel-tracking maps at
            GEOSAT; by night I make small apps for the people around me — a
            dashboard as a gift, a food picker to end the nightly &quot;what
            should we eat&quot; debate.
          </p>
          <p>
            Before that I spent two and a half agency years at Techno Infinity
            shipping nine client applications — HR, risk, finance, document
            workflows — which is where I learned to pick up an unfamiliar
            domain fast. I care about the whole stack: the Laravel or Vue app
            on top, but also the Linux box it runs on — my tmux and Neovim
            configs have their own repos, which tells you most of what you
            need to know.
          </p>
          <p>
            Right now I&apos;m studying Computer Science at Telkom University
            while working, and learning how to build with AI properly — not
            just bolting a chatbot onto things. If a tool is genuinely better,
            I want to know about it.
          </p>
        </div>
      </div>
    </section>
  );
}
