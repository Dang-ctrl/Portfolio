export interface NowSection {
  heading: string;
  body: string[];
  tag: string;
  icon: string;
}

export const NOW: NowSection[] = [
  {
    tag: "01 / Building",
    heading: "Building.",
    icon: "⚡",
    body: [
      "Two projects running in parallel — which is always one too many, but here we are. Alloy, a B2B fintech platform for business credit lines, is deep in the product identity phase. Thinking in CAC curves and silent explainer scripts, not features.",
      "Repomind is an autonomous code-review agent that reads pull requests the way a senior engineer would — from codebase history, not just the diff. It shouldn't exist yet, but it does.",
    ],
  },
  {
    tag: "02 / Learning",
    heading: "Learning.",
    icon: "📚",
    body: [
      "Systems — networking, backend flows, and how things behave under load.",
      "Product — why things work, where they fail, and what actually delivers value.",
      "AI — not just models, but how they fit into real workflows.",
      "Design — type, spacing, and the small decisions that change how something feels.",
      "Trying to understand how all of it connects — not as separate skills, but as one system.",
    ],
  },
  {
    tag: "03 / Thinking about",
    heading: "Thinking about.",
    icon: "💭",
    body: [
      "Why most 'premium' products rely on pricing, not design.",
      "How much of a product is just communication — the system works, but the user never feels it.",
      "Where complexity hides, and why simple interfaces often mask complicated decisions underneath.",
      "What makes something feel obvious — and why most things don't.",
    ],
  },
  {
    tag: "04 / Reading",
    heading: "Reading.",
    icon: "📖",
    body: [
      "The Design of Everyday Things — still relevant, still mostly ignored.",
      "Zero to One — either obvious or uncomfortable, depending on the page.",
    ],
  },
  {
    tag: "05 / Outside the code",
    heading: "Outside the code.",
    icon: "🌍",
    body: [
      "Some work with 4ZE Racing — conversations, partnerships, and seeing how things move outside code.",
      "Trying to spend less time on screens late at night. Not going well.",
      "Thinking more about what to build next than what to consume.",
    ],
  },
];

export const FOCUS_DATA = [
  { label: "Building", pct: 40, weight: 1 },
  { label: "Learning", pct: 25, weight: 0.72 },
  { label: "Thinking", pct: 15, weight: 0.5 },
  { label: "Reading", pct: 10, weight: 0.34 },
  { label: "Other", pct: 10, weight: 0.2 },
];

export const STACK: string[] = [
  "Next.js", "TypeScript", "Python", "Figma",
  "Vercel", "Supabase", "Framer Motion", "Tailwind",
];

export const HABITS = [
  { label: "Code daily", streak: 23, unit: "day streak" },
  { label: "Read 30 min", streak: 12, unit: "day streak" },
  { label: "Ship weekly", streak: 6, unit: "weeks" },
];

/* Update these whenever the page content changes. */
export const UPDATED = "April 2026";
export const LOCATION = "Chennai";

/* The semester progress widget only shows while today falls inside this range.
   Set new dates each semester (or leave as is to hide it). */
export const SEMESTER = { start: "2026-01-05", end: "2026-06-04" };
