import { getImageProps } from "next/image";
import type { CSSProperties } from "react";
import { profile, socials } from "@/content/profile";
import { storyChapters, type StoryChapter } from "@/content/story";
import { StoryScene } from "@/components/three/StoryScene";
import { Icon } from "@/components/ui/Icon";

/**
 * Scroll story + hero. A pinned stage holds the 3D scene; chapters scroll over
 * it. Without WebGL (or before it loads) each chapter shows its own graded
 * still as a sticky full-bleed background, so the page reads the same way.
 */
export function Story() {
  const media = storyChapters.map((c) => ({
    posters: { landscape: c.image.src, portrait: c.imagePortrait.src },
    video: c.video,
    mode: c.mode,
  }));
  const [hero, ...chapters] = storyChapters;

  return (
    <section aria-labelledby="hero-title" className="story relative" data-story="poster">
      <div aria-hidden="true" className="sticky top-0 -mb-[100svh] h-svh w-full overflow-hidden bg-bg">
        <StoryScene media={media} />
      </div>

      {hero ? <HeroChapter chapter={hero} /> : null}
      {chapters.map((chapter, i) => (
        <Chapter key={chapter.id} chapter={chapter} last={i === chapters.length - 1} />
      ))}
    </section>
  );
}

/**
 * Art-directed still: the native 9:16 frame on portrait screens, the 4K 16:9
 * AI-upscaled crop elsewhere. Served at a higher quality than the default,
 * since these are full-bleed.
 */
function Poster({ chapter, eager = false }: { chapter: StoryChapter; eager?: boolean }) {
  const common = { alt: chapter.alt, sizes: "100vw", quality: 85 } as const;
  const {
    props: { srcSet: portrait },
  } = getImageProps({ ...common, src: chapter.imagePortrait });
  const { props: landscape } = getImageProps({
    ...common,
    src: chapter.image,
    loading: eager ? "eager" : "lazy",
    fetchPriority: eager ? "high" : "auto",
  });

  return (
    <div className="story-poster absolute inset-0">
      <div className="sticky top-0 h-svh overflow-hidden">
        <picture>
          <source media="(orientation: portrait)" srcSet={portrait} sizes={common.sizes} />
          {/* eslint-disable-next-line jsx-a11y/alt-text -- alt is included in the spread props */}
          <img {...landscape} className="absolute inset-0 h-full w-full object-cover" />
        </picture>
      </div>
    </div>
  );
}

/** Legibility scrim: left-to-right on wide screens, bottom-up on phones. */
function Scrim() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg via-bg/70 via-40% to-transparent md:bg-gradient-to-r md:from-bg/90 md:via-bg/45 md:via-45%"
    />
  );
}

function HeroChapter({ chapter }: { chapter: StoryChapter }) {
  const step = (i: number) => ({ "--i": i }) as CSSProperties;
  return (
    <article id={chapter.id} className="relative flex min-h-svh flex-col">
      <Poster chapter={chapter} eager />
      <Scrim />
      <div className="container-page relative flex flex-1 flex-col justify-end pb-24 pt-28 md:justify-center">
        <p className="rise eyebrow flex items-center gap-3 !text-fg/80" style={step(0)}>
          <span className="pulse-dot size-2 rounded-full bg-success" aria-hidden="true" />
          {chapter.eyebrow}
        </p>
        <h1
          id="hero-title"
          className="settle mt-6 text-[clamp(3rem,10vw,8rem)] font-semibold leading-[0.9] tracking-[-0.045em]"
        >
          {profile.firstName}
          <br />
          <span className="text-fg/60">Karayat</span>
        </h1>
        <p className="rise mt-7 max-w-lg text-pretty text-lg text-fg/80 sm:text-xl" style={step(2)}>
          {chapter.body[0]}
        </p>
        <div className="rise mt-9 flex flex-wrap items-center gap-3" style={step(3)}>
          <a href="#about" className="btn btn-primary">
            Start the story
            <Icon name="arrowDown" size={16} />
          </a>
          <a href={profile.resume} download className="btn btn-ghost">
            Download résumé
            <Icon name="download" size={16} />
          </a>
          <ul className="ml-1 flex items-center gap-1" aria-label="Social profiles">
            {socials
              .filter((s) => s.id !== "instagram")
              .map((s) => (
                <li key={s.id}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${s.label} (opens in a new tab)`}
                    className="grid size-11 place-items-center rounded-full text-fg/75 transition-colors hover:bg-elevated hover:text-fg"
                  >
                    <Icon name={s.id} size={19} />
                  </a>
                </li>
              ))}
          </ul>
        </div>
      </div>
      <div className="container-page relative flex items-end justify-between pb-8 font-mono text-[11px] uppercase tracking-[0.08em] text-fg/60">
        <p className="flex items-center gap-2">
          <Icon name="pin" size={13} />
          Noida, India
        </p>
        <p className="hidden sm:block">Scroll · a day in four frames</p>
      </div>
    </article>
  );
}

function Chapter({ chapter, last }: { chapter: StoryChapter; last: boolean }) {
  const headingId = `${chapter.id}-title`;
  return (
    // The last chapter is taller: its second half is the dive into the monitor.
    <article id={chapter.id} aria-labelledby={headingId} className={`relative ${last ? "min-h-[200svh]" : "min-h-svh"}`}>
      <Poster chapter={chapter} />
      <Scrim />
      <div className="container-page relative flex min-h-svh flex-col justify-end pb-20 md:justify-center md:pb-0">
        <div className="max-w-md" data-reveal>
          <p className="eyebrow !text-accent-strong">{chapter.eyebrow}</p>
          <h2 id={headingId} className="mt-4 text-balance text-3xl font-semibold tracking-tight sm:text-5xl">
            {chapter.title}
          </h2>
          <div className="mt-6 space-y-4 text-pretty text-base leading-relaxed text-fg/75 sm:text-lg">
            {chapter.body.map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}
          </div>
          {chapter.id === "about" ? (
            <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line">
              {profile.facts.map((fact) => (
                <div key={fact.label} className="bg-bg/80 p-4 backdrop-blur-sm">
                  <dt className="eyebrow">{fact.label}</dt>
                  <dd className="mt-1.5 text-sm font-medium">{fact.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}
        </div>
      </div>
    </article>
  );
}
