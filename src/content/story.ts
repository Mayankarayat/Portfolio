import type { StaticImageData } from "next/image";
import bikePortrait from "@/assets/story/bike-portrait.jpg";
import bike from "@/assets/story/bike.jpg";
import deskPortrait from "@/assets/story/desk-portrait.jpg";
import desk from "@/assets/story/desk.jpg";
import penPortrait from "@/assets/story/pen-portrait.jpg";
import pen from "@/assets/story/pen.jpg";
import pushPortrait from "@/assets/story/push-portrait.jpg";
import push from "@/assets/story/push.jpg";
import { profile } from "./profile";

/**
 * The scroll story at the top of the page. Copy is drawn from the résumé
 * (profile.ts); chapter titles are framing only — no new facts.
 *
 * Media: Mayank's own clips, graded to the site palette. Landscape screens get
 * AI-upscaled (Real-ESRGAN) 16:9 crops — 4K stills, 1080p video; portrait
 * screens get the clips' native 9:16 framing. Stills are imported so they get
 * hashed, immutable URLs; videos live in /public/story (see story-scene.ts).
 */
export interface StoryChapter {
  /** Anchor id; chapter 0 is the page hero. */
  id: string;
  eyebrow: string;
  title: string;
  body: readonly string[];
  /** 16:9 still for landscape screens. */
  image: StaticImageData;
  /** 9:16 still for portrait screens. */
  imagePortrait: StaticImageData;
  alt: string;
  /** Clip base name (renditions resolved in story-scene.ts). */
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
    imagePortrait: bikePortrait,
    alt: `${profile.name} standing beside a motorcycle on a street in Noida`,
    video: "bike",
    mode: "loop",
  },
  {
    id: "about",
    eyebrow: "Chapter 01 · Clock in",
    title: "By day, I build Workedge HR.",
    body: [profile.about[0]],
    image: desk,
    imagePortrait: deskPortrait,
    alt: `${profile.name} working at his desk in the office`,
    video: "desk",
    mode: "loop",
  },
  {
    id: "approach",
    eyebrow: "Chapter 02 · Think it through",
    title: "Every screen starts as a model.",
    body: [profile.about[1], profile.about[2]],
    image: pen,
    imagePortrait: penPortrait,
    alt: `${profile.name} holding a pen, reviewing a form on his monitor`,
    video: "pen",
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
    imagePortrait: pushPortrait,
    alt: `The camera moving toward the HR software on ${profile.name}'s monitor`,
    video: "push",
    mode: "scrub",
  },
];
