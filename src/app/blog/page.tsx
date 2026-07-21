import type { Metadata } from "next";
import { Header } from "@/components/header";
import { SectionTitle } from "@/components/section-title";
import { BlogList } from "@/components/blog-list";
import { getAllPosts } from "@/lib/blog";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: `Blog — ${site.handle}`,
  description: "Notes on code, systems, and whatever I've been reading about.",
};

export default function BlogIndex() {
  const posts = getAllPosts();

  return (
    <>
      <Header />
      <main id="main" className="grow">
        <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
          <SectionTitle eyebrow="brain dump" title="Blog" />
          <BlogList posts={posts} />
        </section>
      </main>
      <footer className="border-t-2 border-line">
        <div className="mx-auto max-w-3xl px-4 py-6 font-mono text-xs text-ink-soft sm:px-6">
          © {new Date().getFullYear()} {site.shortName}
        </div>
      </footer>
    </>
  );
}
