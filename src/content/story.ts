import type { StaticImageData } from "next/image";
import penCard from "@/assets/portrait/pen-card.jpg";
import penPop from "@/assets/portrait/pen-pop.png";
import thinkingCard from "@/assets/portrait/thinking-card.jpg";
import thinkingPop from "@/assets/portrait/thinking-pop.png";
import typingCard from "@/assets/portrait/typing-card.jpg";
import typingPop from "@/assets/portrait/typing-pop.png";
import { profile } from "./profile";

/**
 * The "a day in frames" chapters under the hero. Copy is drawn from the résumé
 * (profile.ts); chapter titles are framing only — no new facts.
 *
 * Imagery: Mayank's own photos, AI-upscaled ×4 (Real-ESRGAN) and cut out
 * (BiRefNet). Each chapter has a `card` (the photo from the chin down) and a
 * transparent `pop` layer (head and shoulders) that rises out of the card in 3D.
 */
export interface PopOutImage {
  card: StaticImageData;
  pop: StaticImageData;
  /** Rows (in source pixels) where `pop` overlaps the top of `card`. */
  overlap: number;
  alt: string;
}

export interface StoryChapter {
  id: string;
  eyebrow: string;
  title: string;
  /** Words of the title set in italic serif for emphasis. */
  emphasis: string;
  body: readonly string[];
  portrait: PopOutImage;
  chips: readonly string[];
}

const OVERLAP = 96;

export const storyChapters: readonly StoryChapter[] = [
  {
    id: "about",
    eyebrow: "Chapter 01 · Clock in",
    title: "By day, I build Workedge HR.",
    emphasis: "Workedge HR.",
    body: [profile.about[0]],
    portrait: {
      card: typingCard,
      pop: typingPop,
      overlap: OVERLAP,
      alt: `${profile.name} working at his desk at Guidona Softpedia`,
    },
    chips: ["Next.js", "TypeScript"],
  },
  {
    id: "approach",
    eyebrow: "Chapter 02 · Think it through",
    title: "Every screen starts as a model.",
    emphasis: "a model.",
    body: [profile.about[1], profile.about[2]],
    portrait: {
      card: thinkingCard,
      pop: thinkingPop,
      overlap: OVERLAP,
      alt: `${profile.name} thinking with a pen in hand, reviewing a form on his monitor`,
    },
    chips: ["Typed API models", "Multi-step flows"],
  },
  {
    id: "craft",
    eyebrow: "Chapter 03 · Into the screen",
    title: "Where payroll, attendance and appraisals become interfaces.",
    emphasis: "become interfaces.",
    body: [
      "Data-heavy dashboards, dynamic multi-step forms, reusable component libraries and REST API integration — across payroll, attendance, performance management, onboarding and Full & Final settlement.",
    ],
    portrait: {
      card: penCard,
      pop: penPop,
      overlap: OVERLAP,
      alt: `${profile.name} pointing a pen at the HR software on his monitor`,
    },
    chips: ["Recharts", "shadcn/ui"],
  },
];
