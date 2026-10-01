import { profile, socials } from "@/content/profile";
import { ContactForm } from "@/components/contact/ContactForm";
import { Icon } from "@/components/ui/Icon";
import { Section } from "@/components/ui/Section";

export function Contact() {
  const tel = profile.phone.replace(/\s+/g, "");

  return (
    <Section
      id="contact"
      index="05"
      eyebrow="Contact"
      title={
        <>
          Have a role or a project in mind? <em className="text-accent">Let&apos;s talk.</em>
        </>
      }
    >
      <div className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5" data-reveal>
          <a
            href={`mailto:${profile.email}`}
            className="link-underline break-all text-xl font-medium tracking-tight sm:text-2xl"
          >
            {profile.email}
          </a>
          <ul className="mt-10 divide-y divide-line border-y border-line">
            <li>
              <a href={`tel:${tel}`} className="flex items-center justify-between py-4 text-muted transition-colors hover:text-fg">
                <span className="flex items-center gap-3">
                  <Icon name="phone" size={17} /> {profile.phone}
                </span>
                <Icon name="arrowUpRight" size={15} />
              </a>
            </li>
            {socials.map((s) => (
              <li key={s.id}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between py-4 text-muted transition-colors hover:text-fg"
                >
                  <span className="flex items-center gap-3">
                    <Icon name={s.id} size={17} />
                    <span>
                      {s.label}
                      <span className="sr-only"> (opens in a new tab)</span>
                    </span>
                  </span>
                  <span className="flex items-center gap-2 font-mono text-xs text-subtle">
                    {s.display} <Icon name="arrowUpRight" size={15} />
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="card relative p-6 sm:p-8 lg:col-span-7" data-reveal>
          <ContactForm fallbackEmail={profile.email} />
        </div>
      </div>
    </Section>
  );
}
