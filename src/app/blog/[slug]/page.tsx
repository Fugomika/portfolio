import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/header";
import { getAllPosts, getPost } from "@/lib/blog";
import { site } from "@/data/site";
import { OG_ALT, OG_SIZE } from "@/app/og.png/route";

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
  // A page's openGraph replaces the layout's (no merge), so restate the image.
  return {
    title: `${post.title} — ${site.handle}`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      url: `/blog/${slug}`,
      siteName: site.handle,
      images: [{ url: "/og.png", ...OG_SIZE, alt: OG_ALT, type: "image/png" }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [{ url: "/og.png", alt: OG_ALT }],
    },
  };
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
