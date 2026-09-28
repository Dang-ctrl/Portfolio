import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";
import { CATEGORIES, type Category, type PostMeta } from "./journal-shared";

/* ─────────────────────────────────────────────
   Journal = markdown files in src/content/journal.
   Add a file, push, and it shows up. Files that
   start with "_" (like _template.md) are ignored.
   ───────────────────────────────────────────── */

const DIR = path.join(process.cwd(), "src/content/journal");

export { CATEGORIES, formatDate } from "./journal-shared";
export type { Category, PostMeta } from "./journal-shared";

export interface Post extends PostMeta {
  html: string;
}

function toIsoDate(v: unknown): string {
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  return String(v ?? "").slice(0, 10);
}

function parse(file: string): Post | null {
  const slug = file.replace(/\.mdx?$/, "");
  const raw = fs.readFileSync(path.join(DIR, file), "utf8");
  const { data, content } = matter(raw);
  if (data.draft) return null;

  const category = (data.category in CATEGORIES ? data.category : "note") as Category;
  const words = content.trim().split(/\s+/).filter(Boolean).length;

  return {
    slug,
    title: String(data.title ?? slug),
    date: toIsoDate(data.date),
    category,
    summary: String(data.summary ?? ""),
    location: data.location ? String(data.location) : undefined,
    cover: data.cover ? String(data.cover) : undefined,
    coverAlt: data.coverAlt ? String(data.coverAlt) : undefined,
    coverWidth: Number(data.coverWidth) || undefined,
    coverHeight: Number(data.coverHeight) || undefined,
    gallery: Array.isArray(data.gallery)
      ? data.gallery
          .filter((g: unknown) => g && typeof (g as { src?: unknown }).src === "string")
          .map((g: { src: string; alt?: string; width?: number; height?: number }) => ({
            src: g.src, alt: String(g.alt ?? ""), width: Number(g.width) || undefined, height: Number(g.height) || undefined,
          }))
      : [],
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    link: data.link ? String(data.link) : undefined,
    readingMinutes: Math.max(1, Math.round(words / 200)),
    html: marked.parse(content, { async: false }) as string,
  };
}

let cache: Post[] | null = null;

export function getAllPosts(): Post[] {
  if (cache && process.env.NODE_ENV === "production") return cache;
  if (!fs.existsSync(DIR)) return [];
  cache = fs
    .readdirSync(DIR)
    .filter((f) => /\.mdx?$/.test(f) && !f.startsWith("_"))
    .map(parse)
    .filter((p): p is Post => p !== null)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
  return cache;
}

export function getPostMetas(): PostMeta[] {
  return getAllPosts().map(({ html: _html, ...meta }) => meta);
}

export function getPost(slug: string): Post | undefined {
  return getAllPosts().find((p) => p.slug === slug);
}
