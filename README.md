# Vidit Jain — Portfolio v3

Minimal editorial portfolio with pixel portrait landing, bold Anton headlines, and cinematic page wipe transitions.

## Stack
- **Next.js 14** App Router
- **Anton** — display headlines
- **DM Sans** — body text & nav
- **DM Mono** — labels, tags, eyebrows
- **Cormorant Garamond** — italic quotes
- **Tailwind CSS** — utilities
- **Canvas API** — pixel portrait + contour bg

## Pages

| Route | Description |
|---|---|
| `/` | Split landing — bio left, pixel portrait right. Subtle links to all sections woven into copy. |
| `/work` | Project list with Anton headlines, hover fill, click-to-expand case studies |
| `/craft` | Skills shown through projects in a 2×2 grid + stat strip |
| `/thinking` | Books (click to expand note), influences, italic mental notes |

## Features
- **Page wipe transition** — green scaleY overlay between every route
- **Custom cursor** — dot + lagging ring
- **Pixel portrait** — generative face rendered on canvas, redraws on theme switch
- **Theme persistence** — saved to localStorage, no flash on reload
- **Light / dark mode** — warm cream (#EDEBE4) ↔ void black (#080808)
- **Stagger reveals** — IntersectionObserver per element on mount
- **Marquee** — Anton ticker on Work page

## Run locally
```bash
npm install
npm run dev
# → http://localhost:3000
```

## Deploy
Push to GitHub → connect to Vercel. Zero config needed for Next.js 14.

## Customise

| What | Where |
|---|---|
| Bio copy & contact links | `src/app/page.tsx` |
| Projects | `src/app/work/page.tsx` → `PROJECTS` array |
| Craft cells | `src/app/craft/page.tsx` → `CRAFTS` array |
| Books / influences / notes | `src/app/thinking/page.tsx` |
| Colours | `src/app/globals.css` `:root` and `.dark` blocks |
| Pixel portrait pixel size | `src/components/PixelPortrait.tsx` → `const px = 9` |
| Nav links | `src/components/Nav.tsx` → `LINKS` array |

---
Built with Claude · 2025
