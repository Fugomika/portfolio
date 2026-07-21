export type Project = {
  slug: string;
  title: string;
  tagline: string;
  role: string;
  problem: string;
  built: string;
  outcome: string;
  stack: string[];
  links: { label: string; href: string }[];
  gallery?: { src: string; title: string; link?: string }[];
};

// Edit freely — the layout renders whatever is here.
// Each project becomes a card that expands into its case study.
export const projects: Project[] = [
  {
    slug: "geotraking",
    title: "Geotraking",
    tagline: "Real-time vessel monitoring from satellite AIS data",
    role: "Software Engineer at GEOSAT (professional work)",
    problem:
      "Maritime operators need to know where every vessel is right now, where it has been, and whether anything looks off — across Indonesian waters, from raw satellite signals.",
    built:
      "I work across the whole pipeline: Python scripts that process satellite AIS inputs into usable position data, Laravel REST APIs that serve it, and the Vue.js frontend with live interactive maps and journey-history playback.",
    outcome:
      "In production for maritime monitoring and security. Client work, so no public repo — happy to talk through the architecture in an interview.",
    stack: ["Python", "Laravel", "Vue.js", "RESTful API", "Maps"],
    links: [{ label: "Company", href: "https://www.geomatika.co.id" }],
  },
  {
    slug: "client-work",
    title: "Client work @ Techno Infinity",
    tagline: "9 production apps in two and a half years",
    role: "Software Engineer, fullstack",
    problem:
      "Agency work means a new domain every few months: HR, risk management, finance, document workflows, education — each with a client who needs it live on a deadline.",
    built:
      "Fullstack delivery on 9 applications, including a QHSSE platform for Pelni (Indonesia's national shipping line), Talentern — Telkom University's internship management system, Cash Connected for Proxsis (multi-tenant financial administration), GRC/risk systems for PT Asuransi Jasa Indonesia and Pancaran Group, an HRIS, a document management system, and a geospatial prototype for Timor Gap. I also built the Laravel boilerplate and ADR docs that later projects started from.",
    outcome:
      "Real users in real companies, plus the reps that made me fast at picking up an unfamiliar domain and shipping in it.",
    stack: ["Laravel", "CodeIgniter", "MySQL", "Bootstrap", "jQuery"],
    links: [{ label: "Techno Infinity", href: "https://technoinfinity.co.id" }],
    gallery: [
      { src: "/img/projects/talentern/talentern.png", title: "Talentern — internship management, Telkom University", link: "https://talentern.telkomuniversity.ac.id/" },
      { src: "/img/projects/cash-connected/application.png", title: "Cash Connected — financial administration, Proxsis" },
      { src: "/img/projects/examroom/exam-management.png", title: "Examroom — employee assessment app" },
      { src: "/img/projects/documine/documine.png", title: "Documine — document management system" },
      { src: "/img/projects/workspace/workspace.png", title: "Workspace — HRIS", link: "https://technoinfinity.co.id/workspace-aplikasi-hr/" },
      { src: "/img/projects/harmonie/harmonie.png", title: "Harmonie — integrated management system", link: "https://harmonie.id/" },
      { src: "/img/projects/timorgap/landing-page.png", title: "TIGOR — GIS prototype for Timor Gap E.P." },
      { src: "/img/projects/pancaran/dashboard.jpg", title: "ERMS — enterprise risk management, Pancaran Group" },
      { src: "/img/projects/safegard/safegard.png", title: "Safegard — integrated GRC for Asuransi Jasindo", link: "https://technoinfinity.co.id/aplikasi-grc-terintegrasi-safegard/" },
      { src: "/img/projects/website-techno/homepage.png", title: "Techno Infinity — company website", link: "https://technoinfinity.co.id/" },
    ],
  },
  {
    slug: "bloom",
    title: "Bloom",
    tagline: "A personal dashboard, built as a gift",
    role: "Design + build, solo",
    problem:
      "One person's tasks, habits, and notes were scattered across three different apps — and none of them felt like hers.",
    built:
      "A cozy personal dashboard with task tracking, habit streaks, and notes. Started as a single-file vanilla JS app with localStorage persistence, then rebuilt in Vue as it grew. Every feature request from its one user is treated as a first-class requirement.",
    outcome:
      "Daily-driver status achieved. Also the project that taught me the jump from 'one big HTML file' to a component framework — and why you make it.",
    stack: ["Vue", "TypeScript", "Vite", "localStorage"],
    links: [{ label: "Repo", href: "https://github.com/Fugomika/Bloom" }],
  },
  {
    slug: "makanapa",
    title: "MakanApa",
    tagline: "A food picker for the eternally undecided",
    role: "Design + build, solo",
    problem:
      "\"Makan apa?\" — \"what should we eat?\" — is the question that ruins more Indonesian evenings than bad traffic. Choice paralysis is real.",
    built:
      "A mobile web app that walks you through a step-by-step choice tree (mood, budget, cuisine) and lands on a verdict. Vanilla JS, no build step, with a playful lime-and-pastel UI inspired by modern mobile app design.",
    outcome:
      "Zero-dependency and loads instantly on any phone. A small app, but every interaction in it is hand-tuned — it's my playground for UI feel.",
    stack: ["Vanilla JS", "CSS", "Mobile-first"],
    links: [{ label: "Repo", href: "https://github.com/Fugomika/MakanApa" }],
  },
  {
    slug: "mockups",
    title: "Mockups & one-pagers",
    tagline: "Client-style landing pages and UI experiments",
    role: "Design + build, solo",
    problem:
      "Landing pages are where visual design meets performance budgets — each of these was an exercise in shipping a polished page fast, with no framework overhead.",
    built:
      "A set of one-page sites and UI experiments: Voyage, a landing page for a maritime vessel-management company; a village information site; and assorted pixel-art and layout experiments.",
    outcome:
      "Each one shipped as a single self-contained page. They're also where this portfolio's design habits — strong palettes, hand-placed details — got practiced.",
    stack: ["HTML", "CSS / SCSS", "JavaScript"],
    links: [
      { label: "Voyage VMS", href: "https://github.com/Fugomika/voyage-vms" },
      { label: "Desa Info", href: "https://github.com/Fugomika/desa-info" },
      { label: "Pixel game", href: "https://github.com/Fugomika/pixel-game" },
    ],
    gallery: [
      { src: "/img/projects/desa-kedisan-info/landing.png", title: "Desa Kedisan — village information site" },
      { src: "/img/projects/desa-mart/landing.png", title: "DesaMart — village marketplace landing" },
    ],
  },
];
