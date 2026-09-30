import { experience, profile, socials } from "@/content/profile";
import { HeroScene } from "@/components/three/HeroScene";
import { Icon } from "@/components/ui/Icon";

export function Hero() {
  const current = experience.find((role) => role.end === null);

  return (
    <section id="top" aria-labelledby="hero-title" className="relative isolate flex min-h-[100svh] flex-col overflow-hidden">
      {/* Visual layer: static poster first, live WebGL scene fades in over it when appropriate. */}
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        {/* eslint-disable-next-line @next/next/no-img-element -- build-generated SVG; next/image adds nothing here */}
        <img
          src="/hero-terrain.svg"
          alt=""
          decoding="async"
          fetchPriority="low"
          className="absolute inset-0 h-full w-full object-cover object-[50%_85%] md:object-[70%_60%]"
        />
        <HeroScene />
        <div className="absolute inset-0 bg-gradient-to-b from-bg via-bg/70 via-45% to-transparent md:bg-gradient-to-r md:via-bg/75 md:via-30%" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-bg to-transparent" />
      </div>

      <div className="container-page flex flex-1 flex-col pb-24 pt-28 md:justify-center md:pt-32">
        {current ? (
          <p className="rise eyebrow flex items-center gap-3" style={{ "--i": 0 } as React.CSSProperties}>
            <span className="pulse-dot size-2 rounded-full bg-success" aria-hidden="true" />
            <span>
              {current.title} · {current.company.replace(" Private Limited", "")}
            </span>
          </p>
        ) : null}

        <h1
          id="hero-title"
          className="settle mt-6 text-[clamp(3rem,11vw,8.5rem)] font-semibold leading-[0.9] tracking-[-0.045em]"
        >
          {profile.firstName}
          <br />
          <span className="text-muted">Karayat</span>
        </h1>

        <p
          className="rise mt-8 max-w-xl text-pretty text-lg text-muted sm:text-xl"
          style={{ "--i": 2 } as React.CSSProperties}
        >
          {profile.headline}
        </p>

        <div className="rise mt-10 flex flex-wrap items-center gap-3" style={{ "--i": 3 } as React.CSSProperties}>
          <a href="#experience" className="btn btn-primary">
            See my work
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
                    className="grid size-11 place-items-center rounded-full text-muted transition-colors hover:bg-elevated hover:text-fg"
                  >
                    <Icon name={s.id} size={19} />
                  </a>
                </li>
              ))}
          </ul>
        </div>
      </div>

      <div className="container-page flex items-end justify-between gap-6 pb-8 font-mono text-[11px] uppercase tracking-[0.08em] text-subtle">
        <p className="flex items-center gap-2">
          <Icon name="pin" size={13} />
          {profile.location.split(",")[0]}, India
        </p>
        <p className="hidden max-w-xs text-right sm:block">Raw data → clear interfaces. Scroll to resolve the surface.</p>
      </div>
    </section>
  );
}
