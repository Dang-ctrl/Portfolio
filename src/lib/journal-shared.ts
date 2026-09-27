/* Client-safe journal types + helpers (no fs). */

export const CATEGORIES = {
  achievement: { label: "Achievement", plural: "Achievements" },
  event:       { label: "Event",       plural: "Events"       },
  milestone:   { label: "Milestone",   plural: "Milestones"   },
  note:        { label: "Note",        plural: "Notes"        },
} as const;

export type Category = keyof typeof CATEGORIES;

export interface PostMeta {
  slug: string;
  title: string;
  date: string;          // ISO yyyy-mm-dd
  category: Category;
  summary: string;
  location?: string;
  cover?: string;
  coverAlt?: string;
  tags: string[];
  link?: string;
  readingMinutes: number;
}

export function formatDate(iso: string, style: "long" | "short" = "long") {
  const d = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", {
    timeZone: "UTC",
    day: style === "long" ? "numeric" : undefined,
    month: style === "long" ? "long" : "short",
    year: "numeric",
  });
}
