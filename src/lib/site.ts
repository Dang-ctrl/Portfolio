/* Single source of truth for identity + links used across the site. */

export const SITE = {
  name: "Vidit Dang",
  title: "Vidit Dang",
  description:
    "Vidit Dang builds products — fintech tools, AI agents and the occasional bit of hardware. CSE at SRM University, partnerships at 4ZE Racing.",
  email: "viditdang9@gmail.com",
  location: "Chennai, India",
  timezone: "Asia/Kolkata",
  github: "https://github.com/Dang-ctrl",
  linkedin: "https://linkedin.com/in/vidit-dang",
};

/* Absolute URL for sitemap / RSS / OG tags.
   Set NEXT_PUBLIC_SITE_URL in Vercel once a custom domain is attached. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000")
).replace(/\/$/, "");

export const NAV_LINKS = [
  { href: "/work",    label: "Work"    },
  { href: "/journal", label: "Journal" },
  { href: "/about",   label: "About"   },
] as const;

/* Label shown on the page-transition curtain for each route. */
export function routeLabel(path: string) {
  const clean = path.split(/[?#]/)[0];
  if (clean === "/") return "Home";
  if (clean.startsWith("/work/")) return "Case study";
  if (clean.startsWith("/journal/")) return "Journal";
  const hit = NAV_LINKS.find((l) => l.href === clean);
  return hit ? hit.label : "";
}
