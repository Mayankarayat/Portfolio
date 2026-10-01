import { profile } from "@/content/profile";

const FALLBACK_SITE_URL = "https://portfolio-chi-vert-33.vercel.app";

function resolveSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim() || FALLBACK_SITE_URL;
  return raw.replace(/\/+$/, "");
}

export const siteConfig = {
  url: resolveSiteUrl(),
  title: `${profile.name} — ${profile.role}`,
  description: profile.summary,
  locale: "en_IN",
  keywords: [
    profile.name,
    "Frontend Developer",
    "Next.js Developer",
    "React Developer",
    "TypeScript",
    "HRMS",
    "Noida",
  ],
} as const;

/**
 * EmailJS identifiers are designed to be public (they ship to the browser).
 * Defaults preserve the previously deployed configuration; override via env.
 */
export const emailConfig = {
  serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "Contact_service",
  templateId: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || "template_8ebjen4",
  publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "RtLCdc_m6UZOa56i2",
} as const;

export const navigation = [
  { id: "about", label: "About" },
  { id: "work", label: "Work" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
] as const;
