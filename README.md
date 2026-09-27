# Vidit Dang — Portfolio

Personal site built with the Next.js App Router, with a markdown-powered **Journal** and interactive **three.js** elements.

## Stack
- **Next.js 14** (App Router, static generation) · **React 18** · **TypeScript**
- **three.js** via **@react-three/fiber** + **drei** — lazy-loaded, only when WebGL is available
- **gray-matter** + **marked** — journal posts written in Markdown
- Plain CSS design system in `src/app/globals.css` (tokens → components → pages)
- **FormSubmit** — serverless contact form

Fonts (via `next/font`): **Instrument Serif** (display), **Inter** (body), **JetBrains Mono** (labels).

## Pages

| Route | What's there |
|---|---|
| `/` | Hero with an interactive 3D sculpture, section cards, latest journal entries |
| `/work` | Project cards → side drawer with a case study + micro-visualisation |
| `/craft` | Disciplines, proficiency bars, background |
| `/thinking` | Rotating convictions, books, people, topics being explored |
| `/journal` | Achievements, events, milestones and notes, filterable and grouped by year |
| `/journal/[slug]` | A single post |
| `/now` | Current focus, live clock, focus ring, streaks, recent journal milestones |
| `/about` | Principles, experience, contact form, 3D globe |

Also generated: `/sitemap.xml`, `/robots.txt`, `/journal/feed.xml` (RSS).

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
   `/journal`, the home page, the `/now` timeline, the sitemap and the RSS feed.

Tips: add `draft: true` to hide a post; files starting with `_` are ignored.

## Editing content
- Identity, email, social links → `src/lib/site.ts`
- Projects → `src/data/projects.ts`
- Books / people / convictions → `src/data/thinking.ts`
- Now page (sections, focus split, streaks, stack, **semester dates**, "Updated" label) → `src/data/now.ts`

## 3D & performance notes
- The background particle field and the inline scenes are code-split and load after the page is interactive.
- Inline scenes mount when they scroll near view and pause rendering when off-screen.
- `prefers-reduced-motion` stops continuous animation; devices without WebGL get a CSS gradient fallback.

## Run locally
```bash
npm install
npm run dev     # → http://localhost:3000
npm run build   # production build
```

## Deploy
Push to GitHub and import into Vercel. Set `NEXT_PUBLIC_SITE_URL` (e.g. `https://viditdang.com`) so the
sitemap, RSS and social previews use your real domain.
