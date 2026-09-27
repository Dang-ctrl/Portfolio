/* Single source of truth for identity + links used across the site. */

export const SITE = {
  name: "Vidit Dang",
  title: "Vidit Dang — Builder & Creative Technologist",
  description:
    "Builder, creative technologist, and Corporate Rep at 4ZE Racing. B.Tech CSE at SRM University. Products and systems, built with intent.",
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
  { href: "/work",     label: "Work"     },
  { href: "/craft",    label: "Craft"    },
  { href: "/thinking", label: "Thinking" },
  { href: "/journal",  label: "Journal"  },
  { href: "/now",      label: "Now"      },
  { href: "/about",    label: "About"    },
] as const;
