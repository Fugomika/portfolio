import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { Projects } from "@/components/projects";
import { Experience } from "@/components/experience";
import { About } from "@/components/about";
import { Skills } from "@/components/skills";
import { Contact } from "@/components/contact";
import { site } from "@/data/site";

export default function Home() {
  return (
    <>
      <Header />
      <main id="main" className="grow">
        <Hero />
        <Projects />
        <Experience />
        <About />
        <Skills />
        <Contact />
      </main>
      <footer className="border-t-2 border-line">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-2 px-4 py-6 font-mono text-xs text-ink-soft sm:px-6">
          <p>
            © {new Date().getFullYear()} {site.shortName} · built with Next.js
          </p>
          <p aria-hidden title="Old habits die hard">
            ↑↑↓↓←→←→BA
          </p>
        </div>
      </footer>
    </>
  );
}
