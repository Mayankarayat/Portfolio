import Image from "next/image";
import portrait from "@/assets/portrait.jpg";
import { profile } from "@/content/profile";
import { Section } from "@/components/ui/Section";

export function About() {
  return (
    <Section
      id="about"
      index="01"
      eyebrow="About"
      title={
        <>
          I make complex HR data <span className="text-muted">feel simple to work with.</span>
        </>
      }
    >
      <div className="grid gap-12 lg:grid-cols-12">
        <figure className="lg:col-span-4" data-reveal>
          <div className="relative overflow-hidden rounded-2xl border border-line bg-surface">
            <Image
              src={portrait}
              alt={`Portrait of ${profile.name}`}
              placeholder="blur"
              sizes="(min-width: 1024px) 26rem, (min-width: 640px) 60vw, 100vw"
              className="aspect-[4/5] h-auto w-full object-cover grayscale-[35%] transition duration-700 hover:grayscale-0"
            />
          </div>
          <figcaption className="mt-3 font-mono text-[11px] uppercase tracking-[0.08em] text-subtle">
            {profile.name} · {profile.location}
          </figcaption>
        </figure>

        <div className="lg:col-span-7 lg:col-start-6">
          <div className="space-y-5 text-pretty text-lg leading-relaxed text-muted" data-reveal>
            {profile.about.map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}
          </div>

          <dl className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line" data-reveal>
            {profile.facts.map((fact) => (
              <div key={fact.label} className="bg-bg p-5 sm:p-6">
                <dt className="eyebrow">{fact.label}</dt>
                <dd className="mt-2 text-base font-medium sm:text-lg">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </Section>
  );
}
