"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { PostMeta } from "@/lib/blog";
import { useUi } from "@/components/ui-provider";

export function BlogList({ posts }: { posts: PostMeta[] }) {
  const [query, setQuery] = useState("");
  const { blip } = useUi();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return posts;
    return posts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q),
    );
  }, [posts, query]);

  return (
    <div>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search articles…"
        aria-label="Search articles"
        className="pixel-border w-full bg-card px-4 py-3 font-mono text-sm outline-none placeholder:text-ink-soft"
      />

      <p className="mt-3 font-mono text-xs text-ink-soft">
        {filtered.length} {filtered.length === 1 ? "article" : "articles"}
      </p>

      <ul className="mt-6 space-y-4">
        {filtered.map((p) => (
          <li key={p.slug}>
            <Link
              href={`/blog/${p.slug}`}
              onClick={() => blip()}
              className="pixel-border pixel-shadow pixel-press block bg-card p-5 sm:p-6"
            >
              <h2 className="font-display text-xl leading-snug sm:text-2xl">
                {p.title}
              </h2>
              {p.excerpt && (
                <p className="mt-2 leading-relaxed text-ink-soft">{p.excerpt}</p>
              )}
              <p className="mt-3 font-mono text-xs text-ink-soft">
                {p.readingMinutes} min read →
              </p>
            </Link>
          </li>
        ))}
      </ul>

      {filtered.length === 0 && (
        <p className="mt-10 text-center font-mono text-sm text-ink-soft">
          No articles match “{query}”.
        </p>
      )}
    </div>
  );
}
