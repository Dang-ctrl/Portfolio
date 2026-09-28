import "server-only";
import matter from "gray-matter";
import { CATEGORIES, type Category } from "@/lib/journal-shared";
import type { AdminImage, AdminPost, AdminProject } from "./types";

/* Validation + (de)serialisation for everything the admin portal writes. */

export const JOURNAL_DIR = "src/content/journal";
export const PROJECTS_FILE = "src/content/projects.json";

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const IMAGE_EXT = /\.(jpe?g|png|webp|gif|avif)$/i;

export class ValidationError extends Error {}

export function assertSlug(slug: string) {
  if (!SLUG.test(slug) || slug.length > 80) {
    throw new ValidationError("Slug must be lowercase letters, numbers and dashes (e.g. sih-2026-finals).");
  }
}

/* Uploaded/removed image paths must stay inside the right public folder. */
export function assertImagePath(path: string, prefix: "public/journal/" | "public/work/") {
  if (!path.startsWith(prefix) || path.includes("..") || path.includes("//") || !IMAGE_EXT.test(path)) {
    throw new ValidationError(`Invalid image path: ${path}`);
  }
}

const str = (v: unknown, max = 5000) => (typeof v === "string" ? v.trim().slice(0, max) : "");

function cleanImage(v: unknown): AdminImage | undefined {
  if (!v || typeof v !== "object") return undefined;
  const o = v as Record<string, unknown>;
  const src = str(o.src, 300);
  if (!src.startsWith("/") || src.includes("..")) return undefined;
  const img: AdminImage = { src, alt: str(o.alt, 300) };
  if (Number.isFinite(o.width)) img.width = Math.round(Number(o.width));
  if (Number.isFinite(o.height)) img.height = Math.round(Number(o.height));
  return img;
}

/* ── Journal posts ── */

export function parsePostFile(slug: string, text: string): AdminPost {
  const { data, content } = matter(text);
  const date = data.date instanceof Date ? data.date.toISOString().slice(0, 10) : String(data.date ?? "").slice(0, 10);
  const cover = typeof data.cover === "string"
    ? { src: data.cover, alt: String(data.coverAlt ?? ""), width: data.coverWidth, height: data.coverHeight }
    : undefined;
  return {
    slug,
    title: String(data.title ?? ""),
    date,
    category: (data.category in CATEGORIES ? data.category : "note") as Category,
    summary: String(data.summary ?? ""),
    location: data.location ? String(data.location) : "",
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    link: data.link ? String(data.link) : "",
    draft: Boolean(data.draft),
    cover: cleanImage(cover),
    gallery: Array.isArray(data.gallery) ? data.gallery.map(cleanImage).filter((g): g is AdminImage => !!g) : [],
    body: content.replace(/^\n+/, ""),
  };
}

export function validatePost(input: unknown): AdminPost {
  const o = (input ?? {}) as Record<string, unknown>;
  const post: AdminPost = {
    slug: str(o.slug, 80),
    title: str(o.title, 200),
    date: str(o.date, 10),
    category: (str(o.category) in CATEGORIES ? str(o.category) : "note") as Category,
    summary: str(o.summary, 400),
    location: str(o.location, 120),
    tags: Array.isArray(o.tags) ? o.tags.map((t) => str(t, 40)).filter(Boolean).slice(0, 12) : [],
    link: str(o.link, 500),
    draft: Boolean(o.draft),
    cover: cleanImage(o.cover),
    gallery: Array.isArray(o.gallery) ? o.gallery.map(cleanImage).filter((g): g is AdminImage => !!g).slice(0, 60) : [],
    body: typeof o.body === "string" ? o.body.slice(0, 100_000) : "",
  };
  assertSlug(post.slug);
  if (!post.title) throw new ValidationError("Title is required.");
  if (!DATE.test(post.date)) throw new ValidationError("Date must be yyyy-mm-dd.");
  if (post.link && !/^https?:\/\//.test(post.link)) throw new ValidationError("Link must start with http:// or https://");
  return post;
}

export function serializePost(p: AdminPost) {
  const data: Record<string, unknown> = { title: p.title, date: p.date, category: p.category };
  if (p.summary) data.summary = p.summary;
  if (p.location) data.location = p.location;
  if (p.cover) {
    data.cover = p.cover.src;
    if (p.cover.alt) data.coverAlt = p.cover.alt;
    if (p.cover.width) data.coverWidth = p.cover.width;
    if (p.cover.height) data.coverHeight = p.cover.height;
  }
  if (p.gallery.length) data.gallery = p.gallery;
  if (p.tags.length) data.tags = p.tags;
  if (p.link) data.link = p.link;
  if (p.draft) data.draft = true;
  return matter.stringify(`\n${p.body.trim()}\n`, data);
}

/* ── Projects ── */

export function validateProjects(input: unknown): AdminProject[] {
  if (!Array.isArray(input)) throw new ValidationError("Projects must be a list.");
  const seen = new Set<string>();
  return input.map((raw, i) => {
    const o = (raw ?? {}) as Record<string, unknown>;
    const lines = (v: unknown, max: number) =>
      Array.isArray(v) ? v.map((x) => str(x, 2000)).filter(Boolean).slice(0, max) : [];
    const p: AdminProject = {
      slug: str(o.slug, 80),
      name: str(o.name, 120),
      year: str(o.year, 20),
      role: str(o.role, 120),
      summary: str(o.summary, 300),
      description: lines(o.description, 12),
      highlights: lines(o.highlights, 12),
      stack: lines(o.stack, 20),
    };
    const link = str(o.link, 500);
    if (link) p.link = link;
    if (o.featured) p.featured = true;
    const cover = cleanImage(o.cover);
    if (cover) p.cover = cover;

    assertSlug(p.slug);
    if (seen.has(p.slug)) throw new ValidationError(`Two projects use the slug "${p.slug}".`);
    seen.add(p.slug);
    if (!p.name) throw new ValidationError(`Project ${i + 1} needs a name.`);
    if (link && !/^https?:\/\//.test(link)) throw new ValidationError(`${p.name}: link must start with http(s)://`);
    return p;
  });
}
