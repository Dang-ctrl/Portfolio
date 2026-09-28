import raw from "@/content/projects.json";

/* Project data lives in src/content/projects.json so the admin portal can edit it. */

export interface Image {
  src: string;       // path under /public, e.g. /work/alloy/cover.jpg
  alt: string;
  width?: number;
  height?: number;
}

export interface Project {
  slug: string;
  name: string;
  year: string;
  role: string;
  summary: string;        // one line, used in lists and the home reel
  description: string[];  // paragraphs on the project page
  highlights: string[];
  stack: string[];
  link?: string;
  featured?: boolean;     // shown in the home page reel
  cover?: Image;          // replaces the typographic card in the reel, shown on the project page
}

export const PROJECTS = raw as Project[];

export const getProject = (slug: string) => PROJECTS.find((p) => p.slug === slug);
