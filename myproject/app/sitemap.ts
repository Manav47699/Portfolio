import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { projects } from "@/content/projects";
import { getPosts } from "@/lib/blog";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: site.url, lastModified: now, priority: 1 },
    { url: `${site.url}/projects`, lastModified: now, priority: 0.9 },
    { url: `${site.url}/lab`, lastModified: now, priority: 0.8 },
    { url: `${site.url}/blogs`, lastModified: now, priority: 0.7 },
    { url: `${site.url}/contacts`, lastModified: now, priority: 0.6 },
    ...projects.map((p) => ({ url: `${site.url}/projects/${p.slug}`, lastModified: new Date(p.date), priority: p.archived ? 0.4 : 0.8 })),
    ...getPosts().map((p) => ({ url: `${site.url}/blogs/${p.slug}`, lastModified: new Date(p.date), priority: 0.6 })),
  ];
}
