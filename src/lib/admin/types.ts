import type { Category } from "@/lib/journal-shared";

/* Shapes exchanged between the admin UI and its API routes. */

export interface AdminImage {
  src: string;      // public URL path, e.g. /journal/my-post/photo-1a2b.webp
  alt: string;
  width?: number;
  height?: number;
}

export interface AdminPost {
  slug: string;
  title: string;
  date: string;
  category: Category;
  summary: string;
  location: string;
  tags: string[];
  link: string;
  draft: boolean;
  cover?: AdminImage;
  gallery: AdminImage[];
  body: string;
}

export interface AdminPostSummary {
  slug: string;
  title: string;
  date: string;
  category: Category;
  draft: boolean;
}

export interface AdminProject {
  slug: string;
  name: string;
  year: string;
  role: string;
  summary: string;
  description: string[];
  highlights: string[];
  stack: string[];
  link?: string;
  featured?: boolean;
  cover?: AdminImage;
}

/* A file uploaded as a git blob, waiting to be included in the next commit. */
export interface PendingUpload {
  path: string;     // repo path, e.g. public/journal/my-post/photo-1a2b.webp
  sha: string;
}
