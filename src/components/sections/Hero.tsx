import Image from "next/image";
import type { CSSProperties } from "react";
import hero from "@/assets/portrait/hero.png";
import { Tilt } from "@/components/portrait/Tilt";
import { Icon } from "@/components/ui/Icon";
import { experience, profile, socials } from "@/content/profile";

const step = (i: number) => ({ "--i": i }) as CSSProperties;
const depth = (z: number) => ({ "--z": `${z}px` }) as CSSProperties;

/**
 * Hero: Mayank's full-body cut-out (AI-upscaled, background removed) standing
 * in a softly lit arch, with skill chips floating at different depths. CSS 3D
 * only — the photo stays pin-sharp and nothing heavy loads up front.
 */
export function Hero() {
  const current = experience.find((role) => role.end === null);

  return (
    <section id="top" aria-labelledby="hero-title" className="relative isolate overflow-hidden">
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="wash -right-24 -top-32 h-[34rem] w-[34rem] wash-peach" />
        <div className="wash right-[18%] top-[30%] h-[30rem] w-[30rem] wash-lilac" />
        <div className="wash -left-40 bottom-0 h-[26rem] w-[26rem] wash-sage opacity-70" />
      </div>

      <div className="container-page grid min-h-svh items-center gap-10 pb-16 pt-28 lg:grid-cols-12 lg:gap-6 lg:pb-10">
        <div className="lg:col-span-7">
          {current ? (
            <p
              className="rise inline-flex items-center gap-2.5 rounded-full border border-line bg-white/60 px-3.5 py-1.5 text-[13px] font-medium text-muted backdrop-blur-sm"
              style={step(0)}
            >
              <span className="pulse-dot size-2 rounded-full bg-success" aria-hidden="true" />
              {current.title} at {current.company.replace(" Private Limited", "")}
            </p>
          ) : null}

          <h1 id="hero-title" className="settle mt-7 text-[clamp(3.6rem,9.5vw,8.5rem)] leading-[0.88]">
            Mayank
            <br />
            <em className="text-accent">Karayat</em>
          </h1>

          <p className="rise mt-7 max-w-xl text-pretty text-lg leading-relaxed text-muted sm:text-xl" style={step(2)}>
            {profile.headline}
          </p>

          <div className="rise mt-9 flex flex-wrap items-center gap-3" style={step(3)}>
            <a href="#about" className="btn btn-primary">
              Read my story
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
                      className="grid size-11 place-items-center rounded-full text-muted transition-colors hover:bg-white hover:text-fg"
                    >
                      <Icon name={s.id} size={19} />
                    </a>
                  </li>
                ))}
            </ul>
          </div>

          <dl className="rise mt-12 grid max-w-xl grid-cols-3 divide-x divide-line border-y border-line" style={step(4)}>
            {[
              { label: "Experience", value: "1+ year" },
              { label: "Stack", value: "Next.js · TS" },
              { label: "Based in", value: "Noida, IN" },
            ].map((fact) => (
              <div key={fact.label} className="px-4 py-4 first:pl-0">
                <dt className="eyebrow">{fact.label}</dt>
                <dd className="mt-1 font-serif text-xl sm:text-2xl">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <Tilt max={6} className="relative mx-auto h-[min(74svh,700px)] w-full max-w-md lg:col-span-5">
          <div className="relative h-full w-full" style={{ transformStyle: "preserve-3d" }}>
            {/* Arch of light behind the figure */}
            <div
              aria-hidden="true"
              className="layer-3d absolute inset-x-[8%] bottom-[4%] top-[10%] rounded-t-full bg-gradient-to-b from-white via-accent-soft to-wash-peach ring-1 ring-white [mask-image:linear-gradient(to_bottom,#000_70%,transparent)]"
              style={depth(-60)}
            />
            <div
              aria-hidden="true"
              className="layer-3d absolute inset-x-[8%] bottom-[4%] top-[10%] overflow-hidden rounded-t-full [mask-image:linear-gradient(to_bottom,#000_70%,transparent)]"
              style={depth(-58)}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgb(255_255_255/0.9),transparent_60%)]" />
            </div>

            {/* Contact shadow */}
            <div
              aria-hidden="true"
              className="layer-3d absolute bottom-[2.5%] left-1/2 h-6 w-48 -translate-x-1/2 rounded-[50%] bg-black/25 blur-md"
              style={depth(-10)}
            />

            <div className="layer-3d absolute inset-0" style={depth(0)}>
              <Image
                src={hero}
                alt={`${profile.name} standing, hands clasped, in a green shirt`}
                fill
                sizes="(min-width: 1024px) 260px, 50vw"
                quality={90}
                preload
                className="object-contain object-bottom drop-shadow-[0_24px_30px_rgb(24_22_18/0.18)]"
              />
            </div>

            {[
              { label: "Next.js", pos: "left-0 top-[24%]", z: 90, float: "float-slow" },
              { label: "TypeScript", pos: "right-0 top-[42%]", z: 130, float: "float-slower" },
              { label: "React", pos: "left-[4%] bottom-[20%]", z: 110, float: "float-slower" },
            ].map((chip) => (
              <span
                key={chip.label}
                aria-hidden="true"
                className={`layer-3d ${chip.float} absolute ${chip.pos} rounded-full border border-white/80 bg-white/70 px-4 py-2 text-[13px] font-medium shadow-[var(--shadow-soft)] backdrop-blur-md`}
                style={depth(chip.z)}
              >
                <span className="mr-2 inline-block size-1.5 -translate-y-px rounded-full bg-accent align-middle" />
                {chip.label}
              </span>
            ))}
          </div>
        </Tilt>
      </div>
    </section>
  );
}
