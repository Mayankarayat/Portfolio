import { education, skills } from "@/content/profile";
import { Section } from "@/components/ui/Section";

export function Skills() {
  return (
    <Section id="skills" index="04" eyebrow="Skills & education" title="The toolkit.">
      <dl className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3" data-reveal>
        {skills.map((group) => (
          <div key={group.label} className="bg-bg p-6 sm:p-8">
            <dt className="eyebrow">{group.label}</dt>
            <dd className="mt-4">
              <ul className="flex flex-wrap gap-x-4 gap-y-2 text-[15px]">
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-16 grid gap-6 lg:grid-cols-12" data-reveal>
        <h3 className="eyebrow lg:col-span-3">Education</h3>
        <ul className="lg:col-span-9">
          {education.map((item) => (
            <li key={item.degree} className="flex flex-col gap-1 border-t border-line pt-6 sm:flex-row sm:items-baseline sm:justify-between">
              <div>
                <p className="text-lg font-semibold tracking-tight">{item.degree}</p>
                <p className="text-muted">{item.institution}</p>
              </div>
              <p className="font-mono text-sm text-subtle">
                {item.start} — {item.end}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
