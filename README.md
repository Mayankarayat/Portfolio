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
    sections/           Story (hero + chapters), Work, Experience, Projects, Skills, Contact
    three/              StoryScene/TerrainScene (client), story-scene/terrain-scene (WebGL),
                        story-path/terrain-math (pure, tested), useProgressiveScene, render-loop
    contact/            ContactForm (client)
    ui/                 Icon, Section, TagList
  config/site.ts        site URL, navigation, EmailJS config
  content/              typed content model — profile.ts (facts) and story.ts (chapters)
  lib/                  render-tier (device capability), contact validation, formatting
```

- **Content is data.** Every fact on the page comes from `src/content/profile.ts`, typed by
  `src/content/types.ts`. Updating the résumé means editing one file.
- **Server-first.** Sections are React Server Components; only the header, contact form and
  the two 3D loaders ship JavaScript. Scroll reveals use CSS scroll-driven animations (zero JS) and
  degrade to static content where unsupported or when reduced motion is requested.

### 3D story (top of the page)

The page opens as a scroll story told with Mayank's own clips — outside, at the
desk, thinking it through, then *into the screen*:

- **Media pipeline:** the original portrait 1080×1920 clips are cropped to 16:9,
  colour-graded to the site palette and encoded at 720p/480p in H.264 MP4 and VP9
  WebM (`public/story`). Ambient clips are forward+reverse loops (seamless); the
  final push-in is encoded with short GOPs for smooth scroll-scrubbing. Graded
  first frames are the poster stills (`src/assets/story`).
- **Scene** (`story-scene.ts`): each clip is a rounded, film-grained frame hung in a
  dark, dusty 3D space. Scroll drives the camera along a choreographed path
  (`story-path.ts`, pure + unit tested): the hero frame fills the screen, pulls
  back to reveal it floats in space, flies to each chapter's frame beside its copy,
  and finally dives into the monitor while the clip scrubs — landing in the Work
  section's data terrain.
- **Streaming:** only nearby chapters load; a clip preloads within one chapter and
  only decodes while its frame is on screen. Posters reuse the optimised images
  the page already downloaded. The engine picks MP4 or WebM per browser support.
- **Fallback:** chapters are real server-rendered HTML with sticky full-bleed stills,
  so without WebGL (reduced motion, Save-Data, software GPU, slow devices) the page
  reads as a cinematic stills story and downloads no video at all.

### Data terrain (Work section)

"Inside Workedge HR": an organic surface of bars (raw data) that resolves into an
ordered, grouped bar chart (a dashboard) as you scroll.

- One `InstancedBufferGeometry` draw call; heights, the pointer ripple, the intro and the
  ordered/organic morph are computed in the vertex shader from a few uniforms.
- `terrain-math.ts` is the reference height model; the GLSL mirrors it and the build-time
  SVG poster (`/hero-terrain.svg`) is generated from it.

### Shared WebGL lifecycle

Both scenes use `useProgressiveScene` + `render-loop.ts`:

- three.js is dynamically imported after `load` + `requestIdleCallback`, and only once the
  section is near the viewport — never on the critical path.
- **Tiers** (`src/lib/render-tier.ts`, probed once per page): `none` (no WebGL, software GL
  such as SwiftShader/llvmpipe, reduced motion, Save-Data, 2G, <2 GiB RAM) keeps the static
  imagery; `low` (touch, narrow, 3G, ≤4 cores, <4 GiB) gets 480p clips, fewer particles,
  lower DPR caps and no pointer tracking; `high` gets everything.
- **Runtime safety:** rendering pauses off-screen and in hidden tabs; DPR adapts down when
  frames are slow; if a device still can't hold ~22 fps at DPR 1, the context is lost, or
  reduced motion is switched on, the scene tears down and the static imagery remains.
- QA override: append `?scene=off|low|high` to force a tier (forced tiers skip the
  performance fallback).

### Contact form

Posts directly to the EmailJS REST API (no SDK) using the existing template's field names,
with client-side validation, a honeypot, a request timeout and an `aria-live` status region.
