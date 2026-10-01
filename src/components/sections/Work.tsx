import { productModules } from "@/content/profile";
import { TerrainScene } from "@/components/three/TerrainScene";

/**
 * Where the story's dive lands: "inside the screen". The data terrain
 * (organic → ordered chart on scroll) sits behind the Workedge HR modules.
 */
export function Work() {
  return (
    <section id="work" aria-labelledby="work-title" className="relative isolate scroll-mt-16 overflow-hidden">
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        {/* eslint-disable-next-line @next/next/no-img-element -- build-generated SVG; next/image adds nothing here */}
        <img
          src="/hero-terrain.svg"
          alt=""
          decoding="async"
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover object-[50%_85%] md:object-[70%_50%]"
        />
        <TerrainScene />
        <div className="absolute inset-0 bg-gradient-to-b from-bg via-bg/60 via-35% to-transparent md:bg-gradient-to-r md:via-bg/70 md:via-30%" />
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-bg to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-72 bg-gradient-to-t from-bg via-bg/80 to-transparent" />
      </div>

      <div className="container-page flex min-h-[120svh] flex-col justify-between gap-16 py-28 sm:py-36">
        <header className="max-w-xl" data-reveal>
          <p className="eyebrow">
            <span className="text-accent">01</span>
            <span aria-hidden="true" className="mx-2 text-line-strong">/</span>
            Inside Workedge HR
          </p>
          <h2 id="work-title" className="mt-6 text-balance text-[clamp(2.4rem,5vw,4rem)] leading-[1.02]">
            Raw HR data in, <em className="text-accent">clear interfaces out.</em>
          </h2>
          <p className="mt-5 text-pretty text-lg text-muted">
            The modules I build on at Guidona Softpedia. Scroll and watch the surface resolve into a chart.
          </p>
        </header>

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" data-reveal>
          {productModules.map((module, i) => (
            <li
              key={module.name}
              className="flex flex-col rounded-2xl border border-white/80 bg-white/75 p-6 shadow-[var(--shadow-soft)] backdrop-blur-md transition-[border-color,transform] duration-500 hover:-translate-y-1 hover:border-line-strong"
            >
              <span className="font-mono text-xs text-accent">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-6 text-2xl">{module.name}</h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{module.description}</p>
              <p className="mt-6 font-mono text-[11px] text-subtle">{module.tech.join(" · ")}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
