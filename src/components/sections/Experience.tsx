import { experience, productModules } from "@/content/profile";
import { formatMonth } from "@/lib/format";
import { Section } from "@/components/ui/Section";
import { TagList } from "@/components/ui/Tag";

export function Experience() {
  return (
    <Section
      id="experience"
      index="02"
      eyebrow="Experience"
      title="Shipping an enterprise HRMS, one module at a time."
      intro="Most of my work lives inside Workedge HR — payroll, attendance, appraisals and settlement flows used by HR teams every day."
    >
      <ol className="border-t border-line">
        {experience.map((role) => (
          <li key={`${role.company}-${role.start}`} className="grid gap-6 border-b border-line py-10 lg:grid-cols-12" data-reveal>
            <div className="lg:col-span-3">
              <p className="font-mono text-sm text-fg">
                <time dateTime={role.start}>{formatMonth(role.start)}</time>
                {" — "}
                {role.end ? <time dateTime={role.end}>{formatMonth(role.end)}</time> : "Present"}
              </p>
              <p className="mt-1 text-sm text-subtle">{role.location}</p>
            </div>
            <div className="lg:col-span-9">
              <h3 className="text-xl font-semibold tracking-tight sm:text-2xl">
                {role.title}
                <span className="text-muted"> · {role.company}</span>
              </h3>
              <p className="mt-3 max-w-3xl text-pretty text-muted">{role.summary}</p>
              <ul className="mt-6 max-w-3xl space-y-3">
                {role.highlights.map((item) => (
                  <li key={item.slice(0, 32)} className="relative pl-6 text-pretty leading-relaxed text-muted">
                    <span aria-hidden="true" className="absolute left-0 top-[0.7em] h-px w-3 bg-accent" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <TagList items={role.stack} label={`Technologies used at ${role.company}`} />
              </div>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-20" data-reveal>
        <h3 className="eyebrow mb-6">Inside Workedge HR — modules I&apos;ve built on</h3>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {productModules.map((module, i) => (
            <li key={module.name} className="card group flex flex-col p-6 transition-colors hover:border-line-strong">
              <span className="font-mono text-xs text-accent">{String(i + 1).padStart(2, "0")}</span>
              <h4 className="mt-6 text-lg font-semibold tracking-tight">{module.name}</h4>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{module.description}</p>
              <p className="mt-6 font-mono text-[11px] text-subtle">{module.tech.join(" · ")}</p>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
