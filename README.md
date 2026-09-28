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
| `/admin` | Private portal for the journal and projects (see below) |

`/craft`, `/thinking` and `/now` redirect to `/about`. Also generated: `/sitemap.xml`, `/robots.txt`, `/journal/feed.xml` (RSS).

## ✍️ The portal (`/admin`)

A private editor on the site itself for the journal and projects:

- **Journal:** write posts in Markdown with a toolbar and live preview, add a cover photo, inline photos and a gallery,
  save drafts, edit, unpublish or delete.
- **Projects:** edit every field, reorder, choose which ones are featured in the home reel, add cover images.
- Photos are resized to 2000px and compressed in the browser before upload.
- Every save is one commit to `main`. Vercel redeploys automatically, so changes are live in about a minute,
  and the full history is in git.

### One-time setup

1. **Create a GitHub token** — GitHub → Settings → Developer settings → Personal access tokens →
   **Fine-grained tokens** → *Generate new token*.
   - Repository access: **Only select repositories** → `Dang-ctrl/Portfolio`
   - Permissions → Repository permissions → **Contents: Read and write**
2. **Add environment variables in Vercel** — Project → Settings → Environment Variables (Production):

   | Name | Value |
   |---|---|
   | `ADMIN_PASSWORD` | a long password only you know |
   | `GITHUB_TOKEN` | the token from step 1 |
   | `GITHUB_REPO` | *(optional)* defaults to `Dang-ctrl/Portfolio` |
   | `GITHUB_BRANCH` | *(optional)* defaults to `main` |

3. **Redeploy** (Deployments → ⋯ → Redeploy), then open `/admin` and sign in.

To use the portal locally, put the same variables in `.env.local` (git-ignored) and run `npm run dev`.
Saves from local dev still commit to GitHub.

Notes: the token never reaches the browser. Changing `ADMIN_PASSWORD` signs out every session. The editor previews
already-committed photos from `raw.githubusercontent.com`, which only works while the repo is public.

### Posting by hand

You can still add posts without the portal: copy `src/content/journal/_template.md`, fill in the front-matter,
write Markdown below it, and push. Files starting with `_` are ignored, and `draft: true` hides a post.

## Editing content
- Identity, email, social links → `src/lib/site.ts`
- Projects → the portal, or `src/content/projects.json` (`featured: true` puts one in the home reel)
- About page (now, experience, books) → `src/app/about/page.tsx`

## Motion notes
- Internal links use `components/TLink.tsx`, which plays the curtain (`components/motion/Curtain.tsx`).
- Scroll animations are declarative: add `data-split` (line reveal), `data-reveal` (fade up),
  `data-parallax="0.2"`, `data-spin="1"` (rotate with scroll) or `data-annotate="underline|circle|highlight|box"`
  (hand-drawn mark via rough-notation) to any element; `components/motion/Reveals.tsx` wires them up.
- Small details: `components/PixelShape.tsx` (pixel-grid glyphs), `RoundBadge.tsx`, and a custom cursor
  (`motion/Cursor.tsx`) — add `data-cursor="Label"` for a labelled cursor or `data-magnetic="0.3"` for a magnetic pull.
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
