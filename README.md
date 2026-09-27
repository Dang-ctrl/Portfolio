# Vidit Dang — Portfolio

Personal site built with the Next.js App Router: a markdown-powered **Journal**, case-study pages for each project,
a curtain page transition and a scroll-driven horizontal work reel.

## Stack
- **Next.js 14** (App Router, fully static) · **React 18** · **TypeScript**
- **GSAP** (ScrollTrigger + SplitText) — curtain transition, text reveals, pinned horizontal reel with 3D card turns
- **Lenis** — smooth scrolling, synced to GSAP's ticker
- **Geist** Sans / Mono / Pixel — the only typefaces
- **gray-matter** + **marked** — journal posts in Markdown
- Plain CSS in `src/app/globals.css` · **FormSubmit** for the contact form

## Pages

| Route | What's there |
|---|---|
| `/` | Hero, selected-work reel (vertical scroll → horizontal), short intro, latest journal entries |
| `/work` | All projects |
| `/work/[slug]` | A case study per project |
| `/journal` | Achievements, events, milestones and notes, filterable, grouped by year |
| `/journal/[slug]` | A single post |
| `/about` | Bio, now, experience, books, contact form |

`/craft`, `/thinking` and `/now` redirect to `/about`. Also generated: `/sitemap.xml`, `/robots.txt`, `/journal/feed.xml` (RSS).

## ✍️ Posting to the journal

1. Copy `src/content/journal/_template.md` to a new file, e.g. `src/content/journal/sih-2026-finals.md`.
   The file name becomes the URL: `/journal/sih-2026-finals`.
2. Fill in the front-matter:
   ```yaml
   ---
   title: "Smart India Hackathon — finals"
   date: 2026-09-20
   category: event        # achievement | event | milestone | note
   summary: "One or two lines for the list and link previews."
   location: "Chennai, India"            # optional
   cover: /journal/sih-2026.jpg          # optional — image goes in public/journal/
   coverAlt: "Our team on stage"         # optional
   tags: [Hackathon, AI]                 # optional
   link: https://example.com             # optional (certificate, event page…)
   ---
   ```
3. Write the post below the `---` in Markdown, commit and push. Vercel redeploys and the post shows up on
   `/journal`, the home page, the sitemap and the RSS feed.

Tips: add `draft: true` to hide a post; files starting with `_` are ignored.

## Editing content
- Identity, email, social links → `src/lib/site.ts`
- Projects (set `featured: true` to put one in the home reel) → `src/data/projects.ts`
- About page (now, experience, books) → `src/app/about/page.tsx`

## Motion notes
- Internal links use `components/TLink.tsx`, which plays the curtain (`components/motion/Curtain.tsx`).
- Scroll animations are declarative: add `data-split` (line reveal), `data-reveal` (fade up) or
  `data-parallax="0.2"` to any element; `components/motion/Reveals.tsx` wires them up.
- The work reel only pins on desktop with a mouse; touch devices get a native swipeable row.
- `prefers-reduced-motion` disables smooth scroll, the curtain and all scroll animations.

## Run locally
```bash
npm install
npm run dev     # → http://localhost:3000
npm run build   # production build
```

## Deploy
Push to GitHub and import into Vercel. Set `NEXT_PUBLIC_SITE_URL` (e.g. `https://viditdang.com`) so the
sitemap, RSS and social previews use your real domain.
