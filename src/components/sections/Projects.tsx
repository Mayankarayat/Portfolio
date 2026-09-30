import { projects } from "@/content/profile";
import { Icon } from "@/components/ui/Icon";
import { Section } from "@/components/ui/Section";
import { TagList } from "@/components/ui/Tag";
import { ProjectCover } from "./ProjectCover";

export function Projects() {
  return (
    <Section
      id="projects"
      index="03"
      eyebrow="Projects"
      title="Independent builds."
      intro="Full-stack and frontend projects built outside of work — each is live and open source."
    >
      <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <li key={project.slug} data-reveal>
            <article className="card group relative flex h-full flex-col overflow-hidden transition-colors hover:border-line-strong">
              <div className="aspect-[8/5] border-b border-line bg-bg/40 transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.02]">
                <ProjectCover kind={project.cover} />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <p className="eyebrow">{project.tagline}</p>
                <h3 className="mt-2 text-xl font-semibold tracking-tight">{project.title}</h3>
                <p className="mt-3 flex-1 text-pretty text-sm leading-relaxed text-muted">{project.description}</p>
                <div className="mt-6">
                  <TagList items={project.stack} label={`${project.title} technologies`} />
                </div>
                <div className="mt-6 flex gap-2 border-t border-line pt-5">
                  <a
                    href={project.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-ghost !py-2 text-sm"
                    aria-label={`${project.title} live demo (opens in a new tab)`}
                  >
                    Live demo <Icon name="arrowUpRight" size={15} />
                  </a>
                  <a
                    href={project.repo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn !py-2 text-sm text-muted hover:text-fg"
                    aria-label={`${project.title} source code on GitHub (opens in a new tab)`}
                  >
                    <Icon name="github" size={15} /> Source
                  </a>
                </div>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </Section>
  );
}
