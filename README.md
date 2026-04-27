# Vidit Dang — Premium Developer Portfolio

A high-performance, cinematic developer portfolio built with Next.js App Router. Features a responsive grid system, an interactive side-drawer project showcase, animated SVG backgrounds, and a seamless light/dark mode experience.

## Stack
- **Next.js 14** (App Router)
- **React 18**
- **TypeScript**
- **Tailwind CSS** — utility-based styling
- **Vanilla CSS / CSS Grid** — complex layout animations and sticky positioning
- **FormSubmit** — serverless email forwarding for contact forms

## Typography
- **Anton** — display headlines and marquee
- **DM Sans** — body text & nav links
- **DM Mono** — labels, tags, eyebrows, and code
- **Cormorant Garamond** — italic quotes and massive serifs
- **Lora** — rich body copy

## Architecture & Pages

| Route | Description |
|---|---|
| `/` | Split landing page featuring interactive navigation cards and dynamic hover tracking. |
| `/about` | Deep dive into principles, experience timeline, and an integrated FormSubmit contact form. |
| `/work` | Project list with interactive hovering, expanding into a fixed side-drawer for in-depth case studies. |
| `/craft` | A 2×2 grid showcasing technical skills, philosophies, and a real-time stat strip. |
| `/thinking` | A collection of books, UX intuitions, and mental models with a concentric ring background. |
| `/now` | A live dashboard of current focus areas, dynamic semester progress, and recent milestones. |

## Key Features
- **Page wipe transition** — cinematic overlay and animated rings between every route change.
- **Custom cursor** — tracking dot + lagging ring effect for a premium feel.
- **FormSubmit integration** — functional contact form out-of-the-box (requires 1-click email activation).
- **Responsive design** — scales elegantly from mobile to 4K monitors.
- **Theme persistence** — defaults to light mode with a smooth, flash-free dark mode toggle.
- **Stagger reveals** — hardware-accelerated IntersectionObserver animations on scroll.

## Run Locally
```bash
npm install
npm run dev
# → http://localhost:3000
```

## Deployment
Push to GitHub and connect to Vercel. Zero configuration is needed for Next.js.

---
*Built in 2026 for Vidit Dang.*
