import { SectionTitle } from "@/components/section-title";

function PixelAvatar() {
  // Cyber-fox self-portrait (GitHub avatar).
  return (
    <img
      src="/avatar.png"
      alt="Illustrated cyberpunk portrait of Farras"
      width={460}
      height={460}
      className="block w-full"
    />
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
