import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Experience } from "@/components/sections/Experience";
import { Hero } from "@/components/sections/Hero";
import { Projects } from "@/components/sections/Projects";
import { Skills } from "@/components/sections/Skills";
import { siteConfig } from "@/config/site";
import { education, experience, profile, socials } from "@/content/profile";

function personJsonLd() {
  const current = experience.find((role) => role.end === null);
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    url: siteConfig.url,
    image: `${siteConfig.url}/opengraph-image`,
    jobTitle: profile.role,
    description: profile.summary,
    email: `mailto:${profile.email}`,
    address: { "@type": "PostalAddress", addressLocality: "Noida", addressRegion: "Uttar Pradesh", addressCountry: "IN" },
    worksFor: current ? { "@type": "Organization", name: current.company } : undefined,
    alumniOf: education.map((e) => ({ "@type": "CollegeOrUniversity", name: e.institution })),
    sameAs: socials.map((s) => s.href),
    knowsAbout: ["Next.js", "React", "TypeScript", "Tailwind CSS", "HRMS", "Frontend development"],
  };
}

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        // Static, build-time data only — no user input reaches this string.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd()).replace(/</g, "\\u003c") }}
      />
      <SiteHeader />
      <main id="main">
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Contact />
      </main>
      <SiteFooter />
    </>
  );
}
