# Mayank Karayat — Portfolio

Personal portfolio of Mayank Karayat, Associate Software Developer (Next.js, React, TypeScript).
Live: https://portfolio-chi-vert-33.vercel.app

## Stack

- **Next.js 16** (App Router, fully static prerender) + **React 19** + **strict TypeScript**
- **Tailwind CSS v4** with design tokens in `src/app/globals.css` (light "paper" palette)
- **CSS 3D** portraits (cut-out photos with depth + pointer tilt) and a lazy-loaded
  **three.js** data terrain
- **Instrument Serif** (display) + **Inter** (text), self-hosted via `next/font/local` (SIL OFL)
- **Vitest** for unit tests

## Scripts

```bash
npm run dev        # local development
npm run build      # production build
npm run start      # serve the production build
npm run lint       # ESLint (next/core-web-vitals + typescript)
npm run typecheck  # route typegen + tsc
npm run test       # unit tests
npm run check      # all of the above
```

Copy `.env.example` to `.env.local` to override the canonical site URL or EmailJS identifiers.

## Architecture

```
src/
  app/                  routes, metadata, OG image, sitemap/robots/manifest,
                        hero-terrain.svg (build-time generated poster)
  components/
    layout/             SiteHeader (client: scroll-spy, mobile menu), SiteFooter
    sections/           Hero, Chapters, Work, Experience, Projects, Skills, Contact
    portrait/           PopOutPortrait (server), Tilt (client: pointer → CSS vars)
    three/              TerrainScene (client), terrain-scene (WebGL), terrain-math (pure, tested),
                        useProgressiveScene, render-loop
    contact/            ContactForm (client)
    ui/                 Icon, Section, TagList
  config/site.ts        site URL, navigation, EmailJS config
  content/              typed content model — profile.ts (facts) and story.ts (chapters)
  assets/portrait/      AI-upscaled photos and their cut-outs (PNG with alpha)
  fonts/                self-hosted woff2 files + licences
  lib/                  render-tier (device capability), contact validation, formatting
```

- **Content is data.** Every fact on the page comes from `src/content/profile.ts`, typed by
  `src/content/types.ts`. Updating the résumé means editing one file.
- **Server-first.** Sections are React Server Components; only the header, contact form and
  the 3D tilt and terrain loader ship JavaScript. Scroll reveals use CSS scroll-driven animations (zero JS) and
  degrade to static content where unsupported or when reduced motion is requested.

### 3D portraits (hero + chapters)

Built from Mayank's own photos — no video, nothing blurry:

- **Imagery pipeline:** each photo is upscaled ×4 with Real-ESRGAN (`realesr-general-x4v3`)
  and cut out with BiRefNet (portrait model) into a transparent PNG. Masters are kept at 2×
  display size; `next/image` serves AVIF/WebP at the size each screen needs.
- **Hero:** the full-body cut-out stands in a softly lit arch with skill chips floating at
  different depths (`translateZ`) inside one CSS 3D rig.
- **Chapters:** each is a photo *card* (from the chin down) plus a *pop* layer — the cut-out
  head and shoulders — 30px in front, rising out of the card's top edge; the layer's scale
  cancels its perspective growth so the seam lines up, and a feathered mask hides it.
- **Motion:** `Tilt` maps the pointer to two CSS variables (fine pointers only, rAF-batched,
  no React re-renders); cards swing in with CSS scroll-driven animations; chips float. All of
  it is disabled for `prefers-reduced-motion`, and the page is fully static without JS.

### Data terrain (Work section)

"Inside Workedge HR": an organic surface of bars (raw data) that resolves into an
ordered, grouped bar chart (a dashboard) as you scroll.

- One `InstancedBufferGeometry` draw call; heights, the pointer ripple, the intro and the
  ordered/organic morph are computed in the vertex shader from a few uniforms.
- `terrain-math.ts` is the reference height model; the GLSL mirrors it and the build-time
  SVG poster (`/hero-terrain.svg`) is generated from it.

### WebGL lifecycle

`TerrainScene` uses `useProgressiveScene` + `render-loop.ts`:

- three.js is dynamically imported after `load` + `requestIdleCallback`, and only once the
  section is near the viewport — never on the critical path.
- **Tiers** (`src/lib/render-tier.ts`, probed once per page): `none` (no WebGL, software GL
  such as SwiftShader/llvmpipe, reduced motion, Save-Data, 2G, <2 GiB RAM) keeps the static
  SVG poster; `low` (touch, narrow, 3G, ≤4 cores, <4 GiB) gets a smaller grid, lower DPR cap
  and no pointer tracking; `high` gets everything.
- **Runtime safety:** rendering pauses off-screen and in hidden tabs; DPR adapts down when
  frames are slow; if a device still can't hold ~22 fps at DPR 1, the context is lost, or
  reduced motion is switched on, the scene tears down and the poster remains.
- QA override: append `?scene=off|low|high` to force a tier (forced tiers skip the
  performance fallback).

### Contact form

Posts directly to the EmailJS REST API (no SDK) using the existing template's field names,
with labelled fields and placeholders, client-side validation, a honeypot, a request timeout
and an `aria-live` status region.
