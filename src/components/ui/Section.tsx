import type { ReactNode } from "react";

interface SectionProps {
  id: string;
  index: string;
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  children: ReactNode;
  className?: string;
}

/** Consistent section shell: numbered mono eyebrow, heading, optional intro. */
export function Section({ id, index, eyebrow, title, intro, children, className = "" }: SectionProps) {
  const headingId = `${id}-title`;
  return (
    <section id={id} aria-labelledby={headingId} className={`scroll-mt-20 py-24 sm:py-32 ${className}`}>
      <div className="container-page">
        <header className="mb-12 grid gap-6 sm:mb-16 lg:grid-cols-12" data-reveal>
          <p className="eyebrow lg:col-span-3">
            <span className="text-accent">{index}</span>
            <span aria-hidden="true" className="mx-2 text-line-strong">/</span>
            {eyebrow}
          </p>
          <div className="lg:col-span-9">
            <h2 id={headingId} className="text-balance text-[clamp(2.4rem,5vw,4rem)] leading-[1.02]">
              {title}
            </h2>
            {intro ? <p className="mt-5 max-w-2xl text-pretty text-lg text-muted">{intro}</p> : null}
          </div>
        </header>
        {children}
      </div>
    </section>
  );
}
