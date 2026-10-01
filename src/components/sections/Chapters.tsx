import { PopOutPortrait } from "@/components/portrait/PopOutPortrait";
import { profile } from "@/content/profile";
import { storyChapters, type StoryChapter } from "@/content/story";

/** Splits the title so its emphasised phrase can be set in italic serif. */
function Title({ chapter, id }: { chapter: StoryChapter; id: string }) {
  const at = chapter.title.lastIndexOf(chapter.emphasis);
  const before = at >= 0 ? chapter.title.slice(0, at) : chapter.title;
  return (
    <h2 id={id} className="mt-4 text-balance text-[clamp(2.4rem,5vw,4rem)] leading-[1.02]">
      {before}
      {at >= 0 ? <em className="text-accent">{chapter.emphasis}</em> : null}
    </h2>
  );
}

/**
 * "A day in frames": three chapters, each a 3D pop-out portrait beside its
 * copy, alternating sides on wide screens.
 */
export function Chapters() {
  return (
    <div className="relative isolate overflow-hidden">
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="wash -left-32 top-[20%] h-[28rem] w-[28rem] wash-lilac opacity-60" />
        <div className="wash -right-40 top-[55%] h-[30rem] w-[30rem] wash-peach opacity-60" />
      </div>

      {storyChapters.map((chapter, i) => {
        const headingId = `${chapter.id}-title`;
        const flip = i % 2 === 1;
        return (
          <section key={chapter.id} id={chapter.id} aria-labelledby={headingId} className="scroll-mt-16 py-20 sm:py-28">
            <div className="container-page grid items-center gap-14 lg:grid-cols-12 lg:gap-10">
              <div className={`lg:col-span-5 ${flip ? "lg:order-2 lg:col-start-8" : ""}`} data-reveal>
                <p className="eyebrow !text-accent">{chapter.eyebrow}</p>
                <Title chapter={chapter} id={headingId} />
                <div className="mt-6 space-y-4 text-pretty text-[17px] leading-relaxed text-muted">
                  {chapter.body.map((paragraph) => (
                    <p key={paragraph.slice(0, 24)}>{paragraph}</p>
                  ))}
                </div>
                {chapter.id === "about" ? (
                  <dl className="mt-8 grid grid-cols-2 gap-3">
                    {profile.facts.map((fact) => (
                      <div key={fact.label} className="card !rounded-2xl p-4">
                        <dt className="eyebrow">{fact.label}</dt>
                        <dd className="mt-1.5 text-[15px] font-medium">{fact.value}</dd>
                      </div>
                    ))}
                  </dl>
                ) : null}
              </div>

              <div className={`lg:col-span-6 ${flip ? "lg:order-1 lg:col-start-1" : "lg:col-start-7"}`}>
                <PopOutPortrait
                  image={chapter.portrait}
                  chips={chapter.chips}
                  sizes="(min-width: 1216px) 560px, (min-width: 1024px) 46vw, 92vw"
                />
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
