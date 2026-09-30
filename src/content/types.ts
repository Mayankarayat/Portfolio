export type SocialId = "github" | "linkedin" | "instagram" | "email" | "phone";

export interface SocialLink {
  id: SocialId;
  label: string;
  href: string;
  /** Human-readable form of the link, e.g. "github.com/Mayankarayat". */
  display: string;
}

export interface Role {
  title: string;
  company: string;
  location: string;
  /** ISO-ish month strings keep the data sortable and machine-readable. */
  start: string;
  end: string | null;
  summary: string;
  highlights: string[];
  stack: string[];
}

/** A body of product work within a role, shown as a module card. */
export interface ProductModule {
  name: string;
  description: string;
  tech: string[];
}

export type ProjectCover = "bookstore" | "food" | "tasks";

export interface Project {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  stack: string[];
  repo: string;
  live: string;
  cover: ProjectCover;
}

export interface SkillGroup {
  label: string;
  items: string[];
}

export interface Education {
  degree: string;
  institution: string;
  start: string;
  end: string;
}
