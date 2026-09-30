import type {
  Education,
  Project,
  ProductModule,
  Role,
  SkillGroup,
  SocialLink,
} from "./types";

/**
 * Single source of truth for portfolio content.
 * Sourced from the September 2026 résumé; nothing here should be invented.
 */
export const profile = {
  name: "Mayank Karayat",
  firstName: "Mayank",
  role: "Associate Software Developer",
  headline: "Frontend developer building enterprise HR software with Next.js, React and TypeScript.",
  location: "Noida, Uttar Pradesh, India",
  email: "mayank64641karayat@gmail.com",
  phone: "+91 9717985116",
  resume: "/Mayank-Karayat-Resume.docx",
  summary:
    "Frontend-focused Associate Software Developer with 1+ year of professional experience building Workedge HR, an enterprise HRMS product. I work across payroll, attendance, performance management, onboarding and Full & Final settlement — data-heavy dashboards, dynamic multi-step forms, reusable component libraries and REST API integration.",
  about: [
    "I build the frontend of Workedge HR at Guidona Softpedia — an enterprise HRMS where the interface has to make Indian statutory payroll, attendance data and multi-stage appraisals feel clear instead of overwhelming.",
    "My day-to-day is Next.js, React and strict TypeScript with Tailwind CSS and shadcn/ui: typing screens against backend API models, turning complex workflows into guided multi-step flows, and building reusable components shared across modules.",
    "I also have working knowledge of Node.js, Express.js and Prisma ORM on the backend, and contribute to the Flutter mobile app.",
  ],
  facts: [
    { label: "Experience", value: "1+ year professional" },
    { label: "Currently", value: "Guidona Softpedia" },
    { label: "Based in", value: "Noida, India" },
    { label: "Focus", value: "Enterprise HRMS frontend" },
  ],
} as const;

export const socials: SocialLink[] = [
  {
    id: "github",
    label: "GitHub",
    href: "https://github.com/Mayankarayat",
    display: "github.com/Mayankarayat",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/mayank-karayat-38a283213/",
    display: "linkedin.com/in/mayank-karayat",
  },
  {
    id: "instagram",
    label: "Instagram",
    href: "https://www.instagram.com/_mayankkarayat_/",
    display: "@_mayankkarayat_",
  },
];

export const experience: Role[] = [
  {
    title: "Associate Software Developer",
    company: "Guidona Softpedia Private Limited",
    location: "Noida",
    start: "2025-05",
    end: null,
    summary:
      "Develop and maintain the frontend of Workedge HR, an enterprise HRMS product, using Next.js, React.js, strict TypeScript, Tailwind CSS and shadcn/ui.",
    highlights: [
      "Built a Payroll Analytics Dashboard with Recharts and Zustand covering Indian statutory payroll components — PF, ESI, TDS, UAN and Full & Final settlement.",
      "Developed HR Attendance Analytics and Employee Distribution dashboards with KPI cards, distribution charts, date-based navigation and a paginated employee directory, typed against backend API models.",
      "Building the Performance Management System appraisal module: dynamic form schemas for Goal Sheet, KRA and Competency reviews, a five-stage workflow from self-rating to final closure, and weighted KRA scoring.",
      "Redesigned Full & Final Settlement and candidate onboarding flows with reusable components (DataTable, StepIndicator, SectionHeader) and built a multi-step bulk bonus calculation wizard.",
      "Migrated legacy styles to Tailwind CSS, resolved layout bugs and added Framer Motion animations for a consistent, responsive experience.",
      "Integrate REST APIs with the backend team (Node.js, Express.js, Prisma ORM), contribute to the Flutter mobile app, and own manual and functional testing before release.",
    ],
    stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "shadcn/ui", "Zustand", "Recharts", "Framer Motion"],
  },
  {
    title: "Frontend Developer Intern",
    company: "Extra Infotech",
    location: "Noida (Remote)",
    start: "2024-06",
    end: "2024-08",
    summary:
      "A 3-month internship building interactive, responsive browser-game interfaces.",
    highlights: [
      "Developed interactive, responsive browser-game interfaces using HTML, CSS, JavaScript and jQuery.",
      "Implemented smooth animations and improved user experience through debugging and performance fixes.",
    ],
    stack: ["HTML", "CSS", "JavaScript", "jQuery"],
  },
];

/** Workedge HR modules — the product surface area behind the current role. */
export const productModules: ProductModule[] = [
  {
    name: "Payroll Analytics",
    description:
      "Dashboard covering Indian statutory payroll — PF, ESI, TDS, UAN and Full & Final settlement.",
    tech: ["Recharts", "Zustand"],
  },
  {
    name: "Attendance & Workforce",
    description:
      "Attendance analytics and employee distribution dashboards: KPI cards, distribution charts, date navigation and a paginated directory.",
    tech: ["TypeScript", "REST APIs"],
  },
  {
    name: "Performance Management",
    description:
      "Appraisal module with dynamic Goal Sheet, KRA and Competency form schemas, a five-stage review workflow and weighted KRA scoring.",
    tech: ["Dynamic forms", "Workflow state"],
  },
  {
    name: "F&F Settlement & Onboarding",
    description:
      "Redesigned settlement and candidate onboarding flows plus a configure → review → confirm bulk bonus wizard.",
    tech: ["DataTable", "StepIndicator", "shadcn/ui"],
  },
];

export const projects: Project[] = [
  {
    slug: "bookish-bliss",
    title: "Bookish Bliss",
    tagline: "Full-stack online bookstore",
    description:
      "An online bookstore built on the MERN stack with a responsive UI and a secure shopping flow for browsing and buying books.",
    stack: ["MongoDB", "Express.js", "React", "Node.js", "Tailwind CSS", "Context API"],
    repo: "https://github.com/Mayankarayat/Book_Store",
    live: "https://book-store-6b3q.onrender.com",
    cover: "bookstore",
  },
  {
    slug: "dish-delight",
    title: "Dish Delight",
    tagline: "Food-ordering web app",
    description:
      "A responsive food-ordering app with client-side routing, global cart state via Context API and toast feedback.",
    stack: ["React", "Tailwind CSS", "React Router", "Context API"],
    repo: "https://github.com/Mayankarayat/DishDelight",
    live: "https://mayankarayat.github.io/DishDelight/",
    cover: "food",
  },
  {
    slug: "to-dos",
    title: "To-Do's",
    tagline: "Task management app",
    description:
      "A fully responsive task-management app for creating, updating and tracking tasks.",
    stack: ["React", "Tailwind CSS"],
    repo: "https://github.com/Mayankarayat/To-Do-s",
    live: "https://mayankarayat.github.io/To-Do-s/",
    cover: "tasks",
  },
];

export const skills: SkillGroup[] = [
  { label: "Languages", items: ["JavaScript (ES6+)", "TypeScript", "HTML5", "CSS3"] },
  {
    label: "Frontend",
    items: [
      "React.js",
      "Next.js (App Router)",
      "Tailwind CSS",
      "shadcn/ui",
      "Zustand",
      "Context API",
      "React Router",
      "Framer Motion",
      "Recharts",
      "Bootstrap",
      "jQuery",
    ],
  },
  { label: "Backend & Data", items: ["Node.js", "Express.js", "REST APIs", "Prisma ORM", "MongoDB"] },
  { label: "Mobile", items: ["Flutter"] },
  {
    label: "Practice",
    items: ["Git & GitHub", "Responsive design", "Reusable component design", "Manual & functional testing"],
  },
  {
    label: "Domain",
    items: ["HRMS", "Indian payroll (PF, ESI, TDS, UAN)", "Attendance", "Performance management", "Onboarding", "Full & Final settlement"],
  },
];

export const education: Education[] = [
  {
    degree: "Bachelor of Computer Applications (BCA)",
    institution: "Chaudhary Charan Singh University",
    start: "2022",
    end: "2025",
  },
];
