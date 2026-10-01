import type { StaticImageData } from "next/image";
import bike from "@/assets/story/bike.jpg";
import desk from "@/assets/story/desk.jpg";
import pen from "@/assets/story/pen.jpg";
import push from "@/assets/story/push.jpg";
import { profile } from "./profile";

/**
 * The scroll story at the top of the page. Copy is drawn from the résumé
 * (profile.ts); chapter titles are framing only — no new facts.
 *
 * Media: graded 16:9 crops of Mayank's own clips. Posters are imported so they
 * get hashed, immutable URLs; videos live in /public/story at two renditions
 * (720p/480p) in two codecs (H.264 MP4, VP9 WebM).
 */
export interface StoryChapter {
  /** Anchor id; chapter 0 is the page hero. */
  id: string;
  eyebrow: string;
  title: string;
  body: readonly string[];
  image: StaticImageData;
  alt: string;
  /** Base path of the clip renditions (see story-scene.ts). */
  video: string;
  /** Ambient loop, or scrubbed by scroll (the push into the monitor). */
  mode: "loop" | "scrub";
}

export const storyChapters: readonly StoryChapter[] = [
  {
    id: "top",
    eyebrow: `${profile.role} · Guidona Softpedia`,
    title: profile.name,
    body: [profile.headline],
    image: bike,
    alt: `${profile.name} standing beside a motorcycle on a street in Noida`,
    video: "/story/bike",
    mode: "loop",
  },
  {
    id: "about",
    eyebrow: "Chapter 01 · Clock in",
    title: "By day, I build Workedge HR.",
    body: [profile.about[0]],
    image: desk,
    alt: `${profile.name} working at his desk in the office`,
    video: "/story/desk",
    mode: "loop",
  },
  {
    id: "approach",
    eyebrow: "Chapter 02 · Think it through",
    title: "Every screen starts as a model.",
    body: [profile.about[1], profile.about[2]],
    image: pen,
    alt: `${profile.name} holding a pen, reviewing a form on his monitor`,
    video: "/story/pen",
    mode: "loop",
  },
  {
    id: "into-the-screen",
    eyebrow: "Chapter 03 · Into the screen",
    title: "Where payroll, attendance and appraisals become interfaces.",
    body: [
      "Data-heavy dashboards, dynamic multi-step forms, reusable component libraries and REST API integration — across payroll, attendance, performance management, onboarding and Full & Final settlement.",
    ],
    image: push,
    alt: `The camera moving toward the HR software on ${profile.name}'s monitor`,
    video: "/story/push",
    mode: "scrub",
  },
];
