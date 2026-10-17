"use client";

import { useRef, useState } from "react";
import { site } from "@/data/site";
import { SectionTitle } from "@/components/section-title";
import { useUi } from "@/components/ui-provider";

export function Contact() {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const { blip } = useUi();

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      blip("toggle");
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked — the mailto link right next to it still works.
    }
  };

  return (
    <section id="contact" className="mx-auto max-w-5xl scroll-mt-20 px-4 py-16 sm:px-6">
      <SectionTitle eyebrow="start conversation" title="Contact" />
      <div className="pixel-border pixel-shadow bg-card p-6 sm:p-8">
        <p className="max-w-xl text-lg leading-relaxed">
          Open to interesting roles, freelance work, or just talking shop about
          web dev, servers, or whatever you&apos;re building. Email is the
          fastest way to reach me.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <a
            href={`mailto:${site.email}`}
            onClick={() => blip()}
            className="pixel-border pixel-shadow-sm pixel-press inline-block bg-lime px-5 py-2.5 font-mono text-sm text-on-lime sm:text-base"
          >
            {site.email}
          </a>
          <button
            type="button"
            onClick={copy}
            className="pixel-border pixel-shadow-sm pixel-press bg-paper px-5 py-2.5 font-mono text-sm"
            aria-live="polite"
          >
            {copied ? "Copied ✓" : "Copy email"}
          </button>
        </div>
        <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-2">
          {site.socials.map((s) => (
            <li key={s.label}>
              <a
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => blip()}
                className="link-sweep font-mono text-sm"
              >
                {s.label} ↗
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
