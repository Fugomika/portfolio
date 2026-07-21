import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/header";
import { getAllPosts, getPost } from "@/lib/blog";
import { site } from "@/data/site";

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  return { title: `${post.title} — ${site.handle}`, description: post.excerpt };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);

  return (
    <>
      <Header />
      <main id="main" className="grow">
        <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
          <Link
            href="/blog"
            className="link-sweep font-mono text-sm text-ink-soft"
          >
            ← all articles
          </Link>

          <h1 className="mt-6 font-display text-3xl leading-tight sm:text-4xl">
            {post.title}
          </h1>
          <p className="mt-3 font-mono text-xs text-ink-soft">
            {post.readingMinutes} min read
          </p>

          <div
            className="prose-pixel mt-10"
            dangerouslySetInnerHTML={{ __html: post.html }}
          />
        </article>
      </main>
      <footer className="border-t-2 border-line">
        <div className="mx-auto max-w-3xl px-4 py-6 font-mono text-xs text-ink-soft sm:px-6">
          © {new Date().getFullYear()} {site.shortName}
        </div>
      </footer>
    </>
  );
}
