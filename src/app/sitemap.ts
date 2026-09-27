import type { MetadataRoute } from "next";
import { getPostMetas } from "@/lib/journal";
import { NAV_LINKS, SITE_URL } from "@/lib/site";
import { PROJECTS } from "@/data/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", ...NAV_LINKS.map((l) => l.href)].map((path) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.8,
  }));
  const posts = getPostMetas().map((p) => ({
    url: `${SITE_URL}/journal/${p.slug}`,
    lastModified: p.date,
    priority: 0.6,
  }));
  const projects = PROJECTS.map((p) => ({ url: `${SITE_URL}/work/${p.slug}`, priority: 0.7 }));
  return [...pages, ...projects, ...posts];
}
