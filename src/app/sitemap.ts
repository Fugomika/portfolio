import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog";
import { site } from "@/data/site";

// Required with `output: "export"`: write sitemap.xml once at build time.
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: site.url },
    { url: `${site.url}/blog` },
    ...getAllPosts().map((p) => ({ url: `${site.url}/blog/${p.slug}` })),
  ];
}
