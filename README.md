# Mayank Karayat — Portfolio

Personal portfolio of Mayank Karayat, Associate Software Developer (Next.js, React, TypeScript).
Live: https://portfolio-chi-vert-33.vercel.app

## Stack

- **Next.js 16** (App Router, fully static prerender) + **React 19** + **strict TypeScript**
- **Tailwind CSS v4** with design tokens in `src/app/globals.css`
- **three.js** (vanilla, lazy-loaded) for the hero scene
- **Geist** fonts self-hosted via `next/font`
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
    sections/           Hero, About, Experience, Projects, Skills, Contact (server)
    three/              HeroScene (client loader) + terrain-scene (WebGL) + terrain-math
    contact/            ContactForm (client)
    ui/                 Icon, Section, TagList
  config/site.ts        site URL, navigation, EmailJS config
  content/              typed content model — the only place portfolio facts live
  lib/                  render-tier (device capability), contact validation, formatting
```

- **Content is data.** Every fact on the page comes from `src/content/profile.ts`, typed by
  `src/content/types.ts`. Updating the résumé means editing one file.
- **Server-first.** Sections are React Server Components; only the header, contact form and
  3D loader ship JavaScript. Scroll reveals use CSS scroll-driven animations (zero JS) and
  degrade to static content where unsupported or when reduced motion is requested.

### Hero 3D scene

The hero shows a "data terrain": an organic, noisy surface of bars (raw data) that resolves
into an ordered, grouped bar chart (a dashboard) as you scroll — a direct nod to the payroll
and attendance analytics work.

- One `InstancedBufferGeometry` draw call; heights, the pointer ripple, the intro and the
  ordered/organic morph are computed in the vertex shader from a few uniforms, so there are
  no per-frame buffer uploads.
- `terrain-math.ts` is the reference height model. The GLSL mirrors it, the build-time SVG
  poster (`/hero-terrain.svg`) and the OG image are generated from it, and it is unit tested.
- **Progressive loading:** the poster is the first paint. After `load` + `requestIdleCallback`,
  `HeroScene` decides a render tier (`src/lib/render-tier.ts`) and only then dynamically imports
  three.js (~133 KB gzip, never on the critical path).
- **Tiers:** `none` (no WebGL, software GL such as SwiftShader/llvmpipe, reduced motion,
  Save-Data, 2G, <2 GiB RAM) keeps the poster; `low` (touch, narrow, 3G, ≤4 cores, <4 GiB)
  gets a smaller grid, lower DPR cap and no pointer tracking; `high` gets the full scene.
- **Runtime safety:** rendering pauses off-screen and in hidden tabs; DPR adapts down when
  frames are slow; if the device still can't hold ~22 fps at DPR 1, or the WebGL context is
  lost, or reduced motion is switched on, the scene tears down and the poster remains.
- QA override: append `?scene=off|low|high` to force a tier.

### Contact form

Posts directly to the EmailJS REST API (no SDK) using the existing template's field names,
with client-side validation, a honeypot, a request timeout and an `aria-live` status region.
