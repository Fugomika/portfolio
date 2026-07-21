import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { marked } from "marked";

const BLOG_DIR = join(process.cwd(), "content", "blog");

export type PostMeta = {
  slug: string;
  title: string;
  excerpt: string;
  readingMinutes: number;
};

export type Post = PostMeta & { html: string };

// Minimal frontmatter parse — the files only ever carry title + excerpt, so a
// full YAML dependency would be overkill.
function parseFrontmatter(raw: string): { data: Record<string, string>; body: string } {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(raw);
  if (!match) return { data: {}, body: raw };

  const data: Record<string, string> = {};
  for (const line of match[1].split(/\r?\n/)) {
    const kv = /^(\w+):\s*(.*)$/.exec(line);
    if (kv) data[kv[1]] = kv[2].replace(/^["']|["']$/g, "");
  }
  return { data, body: raw.slice(match[0].length) };
}

function toMeta(slug: string, raw: string): { meta: PostMeta; body: string } {
  const { data, body } = parseFrontmatter(raw);
  const words = body.trim().split(/\s+/).length;
  return {
    meta: {
      slug,
      title: data.title || slug,
      excerpt: data.excerpt || "",
      readingMinutes: Math.max(1, Math.round(words / 200)),
    },
    body,
  };
}

export function getAllPosts(): PostMeta[] {
  return readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const slug = f.replace(/\.md$/, "");
      return toMeta(slug, readFileSync(join(BLOG_DIR, f), "utf8")).meta;
    })
    .sort((a, b) => a.title.localeCompare(b.title));
}

export function getPost(slug: string): Post {
  const { meta, body } = toMeta(slug, readFileSync(join(BLOG_DIR, `${slug}.md`), "utf8"));
  return { ...meta, html: marked.parse(body, { async: false }) };
}
