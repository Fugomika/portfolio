"use client";

import { site } from "@/data/site";
import { Robot } from "@/components/robot";
import { useUi } from "@/components/ui-provider";

export function Hero() {
  const { blip } = useUi();

  return (
    <section className="mx-auto grid max-w-5xl items-center gap-10 px-4 pb-16 pt-14 sm:px-6 md:grid-cols-[3fr_2fr] md:pt-20">
      <div>
        <p className="mb-4 font-mono text-sm text-ink-soft">
          {"// software engineer @ "}
          <span className="text-lime-deep">{site.company}</span>
        </p>
        <h1 className="font-display text-3xl leading-tight sm:text-4xl md:text-5xl">
          {site.name}
        </h1>
        <p className="mt-2 font-mono text-sm text-ink-soft">
          aka <span className="text-ink">{site.handle}</span> · {site.location}
        </p>
        <p className="mt-6 max-w-xl text-lg leading-relaxed">{site.pitch}</p>

        <div className="mt-8 flex flex-wrap gap-4">
          <a
            href="#contact"
            onClick={() => blip()}
            className="pixel-border pixel-shadow pixel-press inline-block bg-lime px-6 py-3 font-display text-lg text-[#26221a]"
          >
            Get in touch
          </a>
          <a
            href={site.resumeUrl}
            download
            onClick={() => blip()}
            className="pixel-border pixel-shadow pixel-press inline-block bg-card px-6 py-3 font-display text-lg"
          >
            Resume (PDF)
          </a>
        </div>

        <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-2">
          {site.socials.map((s) => (
            <li key={s.label}>
              <a
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="link-sweep font-mono text-sm"
                onClick={() => blip()}
              >
                {s.label} ↗
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <Robot />
        <p aria-hidden className="text-center font-mono text-xs text-ink-soft">
          {"// try clicking the robot"}
        </p>
      </div>
    </section>
  );
}
