export type Figure = { src: string; caption: string; link?: string };

export type Project = {
  slug: string;
  title: string;
  tagline: string;
  /** "YYYY-MM". Projects are sorted newest-first by this. */
  start: string;
  /** "YYYY-MM" or "present". Omit for a single-month project. */
  end?: string;
  kind: "work" | "personal" | "college";
  /** Shown as the paper's affiliation line. */
  affiliation: string;
  role: string;
  abstract: string;
  /** Numbered body sections of the write-up. */
  sections?: { heading: string; body: string }[];
  stack: string[];
  links: { label: string; href: string }[];
  /** First figure doubles as the card cover. */
  figures?: Figure[];
};

const img = (dir: string, file: string) => `/img/projects/${dir}/${file}.webp`;

// To add a project: append an entry anywhere — the grid sorts by `start`.
const all: Project[] = [
  {
    slug: "makan-apa",
    title: "MakanApa",
    tagline: "A food picker for the eternally undecided",
    start: "2026-07",
    kind: "personal",
    affiliation: "Personal project",
    role: "Design + build, solo",
    abstract:
      "\"Makan apa?\" — \"what should we eat?\" — is the question that ruins more Indonesian evenings than bad traffic. MakanApa is a mobile web app that walks you through a short choice tree and lands on a verdict.",
    sections: [
      {
        heading: "Problem",
        body: "Choice paralysis is real. Given every option at once, nobody picks; given three small questions in a row, everybody does.",
      },
      {
        heading: "What I built",
        body: "A step-by-step choice tree (mood, budget, cuisine) that ends on a single recommendation. Vanilla JS with no build step, and a playful lime-and-pastel UI inspired by modern mobile app design.",
      },
      {
        heading: "Outcome",
        body: "Zero-dependency and loads instantly on any phone. A small app, but every interaction in it is hand-tuned — it's my playground for UI feel.",
      },
    ],
    stack: ["Vanilla JS", "HTML", "CSS", "Mobile-first"],
    links: [{ label: "Repo", href: "https://github.com/Fugomika/makan-apa" }],
  },
  {
    slug: "bloom",
    title: "Bloom",
    tagline: "A personal dashboard, built as a gift",
    start: "2026-06",
    end: "present",
    kind: "personal",
    affiliation: "Personal project",
    role: "Design + build, solo",
    abstract:
      "One person's tasks, habits, and notes were scattered across three different apps — and none of them felt like hers. Bloom pulls them into one cozy dashboard.",
    sections: [
      {
        heading: "What I built",
        body: "Task tracking, habit streaks, and notes in a single dashboard. It started as a single-file vanilla JS app with localStorage persistence, then was rebuilt in Vue as it grew. Every feature request from its one user is treated as a first-class requirement.",
      },
      {
        heading: "Outcome",
        body: "Daily-driver status achieved. Also the project that taught me the jump from 'one big HTML file' to a component framework — and why you make it.",
      },
    ],
    stack: ["Vue", "JavaScript", "Vite", "Supabase"],
    links: [{ label: "Repo", href: "https://github.com/Fugomika/Bloom" }],
  },
  {
    slug: "geotraking",
    title: "Geotraking",
    tagline: "Real-time vessel monitoring from satellite AIS data",
    start: "2025-03",
    end: "present",
    kind: "work",
    affiliation: "GEOSAT — PT Geomatika Satelit Indonesia",
    role: "Software Engineer",
    abstract:
      "Geotraking is a satellite-based vessel tracking platform providing real-time monitoring, journey history, and an interactive map for maritime efficiency and security across Indonesian waters.",
    sections: [
      {
        heading: "Problem",
        body: "Maritime operators need to know where every vessel is right now, where it has been, and whether anything looks off — from raw satellite signals.",
      },
      {
        heading: "What I built",
        body: "I work across the whole pipeline: Python scripts that process satellite AIS inputs into usable position data, Laravel REST APIs that serve it, and the Vue.js frontend with live interactive maps and journey-history playback.",
      },
      {
        heading: "Outcome",
        body: "In production for maritime monitoring and security. Client work, so no public repo — happy to talk through the architecture in an interview.",
      },
    ],
    stack: ["Python", "Laravel", "Vue.js", "RESTful API", "Maps"],
    links: [{ label: "Company", href: "https://www.geomatika.co.id" }],
  },
  {
    slug: "pixel-game",
    title: "Pixel game",
    tagline: "A tiny browser game experiment",
    start: "2025-03",
    kind: "personal",
    affiliation: "Personal project",
    role: "Design + build, solo",
    abstract:
      "A quick experiment in pixel art and a hand-rolled browser game loop — plain JavaScript, no engine.",
    stack: ["JavaScript", "HTML"],
    links: [{ label: "Repo", href: "https://github.com/Fugomika/pixel-game" }],
  },
  {
    slug: "voyage-vms",
    title: "Voyage VMS",
    tagline: "Landing page for a maritime vessel-management company",
    start: "2025-01",
    kind: "personal",
    affiliation: "Personal project",
    role: "Design + build, solo",
    abstract:
      "A one-page marketing site for a company in the maritime field, built as a portfolio piece. An exercise in shipping a polished page fast, with no framework overhead.",
    stack: ["HTML", "SCSS", "JavaScript"],
    links: [{ label: "Repo", href: "https://github.com/Fugomika/voyage-vms" }],
  },
  {
    slug: "desa-kedisan",
    title: "Desa Kedisan",
    tagline: "Announcements and tourism site for a Balinese village",
    start: "2024-11",
    end: "2024-12",
    kind: "college",
    affiliation: "Telkom University — college project",
    role: "Fullstack developer",
    abstract:
      "A website for Kedisan Village in Kintamani, Bali, built to publish village announcements and promote local tourism, with an admin dashboard for managing content.",
    stack: ["CodeIgniter 4", "Bootstrap", "jQuery", "AJAX", "MySQL"],
    links: [{ label: "Repo", href: "https://github.com/Fugomika/desa-info" }],
    figures: [
      { src: img("desa-kedisan-info", "landing"), caption: "Landing page" },
      { src: img("desa-kedisan-info", "profil"), caption: "Village profile" },
      { src: img("desa-kedisan-info", "explore"), caption: "Explore — tourism listings" },
      { src: img("desa-kedisan-info", "dashboard-admin"), caption: "Admin dashboard" },
      { src: img("desa-kedisan-info", "pengumuman-admin"), caption: "Admin — announcements" },
    ],
  },
  {
    slug: "desamart",
    title: "DesaMart",
    tagline: "A marketplace for trading goods within a village",
    start: "2024-11",
    end: "2024-12",
    kind: "college",
    affiliation: "Telkom University — college project",
    role: "Fullstack developer",
    abstract:
      "A web app designed to make local transactions of goods within a village easier, with a public catalogue and separate dashboards for admins and users.",
    stack: ["CodeIgniter 4", "Bootstrap", "jQuery", "AJAX", "MySQL"],
    links: [],
    figures: [
      { src: img("desa-mart", "landing"), caption: "Landing page" },
      { src: img("desa-mart", "catalogue"), caption: "Product catalogue" },
      { src: img("desa-mart", "dashboard-admin"), caption: "Admin dashboard" },
      { src: img("desa-mart", "dashboard-user"), caption: "User dashboard" },
    ],
  },
  {
    slug: "pelni-qhsse",
    title: "Pelni QHSSE",
    tagline: "Quality, health, safety, security & environment platform",
    start: "2024-10",
    end: "2025-02",
    kind: "work",
    affiliation: "Techno Infinity — for PT Pelayaran Nasional Indonesia (Persero)",
    role: "Software Engineer",
    abstract:
      "A web application for Indonesia's national shipping line to manage and monitor Quality, Health, Safety, Security, and Environment (QHSSE) aspects across the company.",
    sections: [
      {
        heading: "Approach",
        body: "Built on Laravel 11 using the company boilerplate I had written earlier, with an emphasis on clean, maintainable code for a long-lived enterprise system.",
      },
    ],
    stack: ["Laravel 11", "Bootstrap", "jQuery", "AJAX"],
    links: [],
  },
  {
    slug: "erms-pancaran",
    title: "ERMS — Pancaran Group",
    tagline: "Enterprise risk management system",
    start: "2024-10",
    kind: "work",
    affiliation: "Techno Infinity — for Pancaran Group",
    role: "Software Engineer",
    abstract:
      "A Governance, Risk, and Compliance (GRC) system that helps the company manage risks, comply with regulations, and track progress toward its goals.",
    sections: [
      {
        heading: "My contribution",
        body: "Developed the Risk Matrix, the Risk Profile dashboards, and the Master Data pages.",
      },
    ],
    stack: ["Laravel"],
    links: [],
    figures: [
      { src: img("pancaran", "dashboard"), caption: "Risk profile dashboard" },
      { src: img("pancaran", "risk-matrix"), caption: "Risk matrix" },
    ],
  },
  {
    slug: "techno-web",
    title: "Techno Infinity website",
    tagline: "Company website, content, and social integration",
    start: "2024-08",
    end: "2025-02",
    kind: "work",
    affiliation: "Techno Infinity",
    role: "Software Engineer",
    abstract:
      "Maintained and extended the company's WordPress website, including the team page, a link hub for social media, and articles — one of which I wrote.",
    stack: ["WordPress", "Social media integration", "Graphic design"],
    links: [{ label: "Live site", href: "https://technoinfinity.co.id/" }],
    figures: [
      { src: img("website-techno", "homepage"), caption: "Homepage", link: "https://technoinfinity.co.id/" },
      {
        src: img("website-techno", "articles"),
        caption: "\"Dari Programmer ke Problem Solver\" — an article I wrote",
        link: "https://technoinfinity.co.id/dari-programmer-ke-problem-solver/",
      },
      {
        src: img("website-techno", "meet-techno-infinity-team"),
        caption: "Meet the team",
        link: "https://technoinfinity.co.id/meet-techno-infinity-team/",
      },
      {
        src: img("website-techno", "link-techno-infinity"),
        caption: "Social media link hub",
        link: "https://technoinfinity.co.id/link/",
      },
    ],
  },
  {
    slug: "talentern",
    title: "Talentern",
    tagline: "Internship management for Telkom University",
    start: "2024-06",
    end: "2024-10",
    kind: "work",
    affiliation: "Techno Infinity — for Telkom University School of Applied Science",
    role: "Software Engineer",
    abstract:
      "An online platform for university students to search and apply for internships, with a management system that keeps the selection process and intern data organised.",
    sections: [
      {
        heading: "My contribution",
        body: "Fullstack development on Laravel 11, plus project delivery — presenting features and progress directly to the client.",
      },
    ],
    stack: ["Laravel 11", "Bootstrap", "jQuery", "AJAX"],
    links: [{ label: "Live site", href: "https://talentern.telkomuniversity.ac.id/" }],
    figures: [
      { src: img("talentern", "talentern"), caption: "Public landing page", link: "https://talentern.telkomuniversity.ac.id/" },
      { src: img("talentern", "corporate-partners"), caption: "Corporate partners" },
      { src: img("talentern", "internship-management"), caption: "Internship management" },
      { src: img("talentern", "admin-dashboard"), caption: "Admin dashboard" },
      { src: img("talentern", "internship-selection"), caption: "Internship selection" },
      { src: img("talentern", "intern-logbook-system"), caption: "Intern logbook" },
    ],
  },
  {
    slug: "tigor",
    title: "TIGOR",
    tagline: "GIS prototype for an oil & gas state enterprise",
    start: "2024-05",
    end: "2024-06",
    kind: "work",
    affiliation: "Techno Infinity — for Timor Gap E.P.",
    role: "Software Engineer",
    abstract:
      "A prototype geospatial information system for Timor Gap, a state-owned enterprise in Timor-Leste, to manage and visualise data related to the oil and gas industry.",
    stack: ["Laravel", "Python", "JSON"],
    links: [],
    figures: [
      { src: img("timorgap", "landing-page"), caption: "Landing page" },
      { src: img("timorgap", "basemap"), caption: "Timor basemap" },
      { src: img("timorgap", "dashboard"), caption: "Dashboard" },
      { src: img("timorgap", "login"), caption: "Login" },
    ],
  },
  {
    slug: "examroom",
    title: "Examroom",
    tagline: "Employee assessment app",
    start: "2024-01",
    kind: "work",
    affiliation: "Techno Infinity",
    role: "Software Engineer",
    abstract:
      "An employee assessment application for running performance appraisals efficiently — from question preparation and validation by subject-matter experts to real-time reporting.",
    stack: ["Laravel", "Bootstrap", "jQuery"],
    links: [],
    figures: [
      { src: img("examroom", "exam-management"), caption: "Exam management" },
      { src: img("examroom", "course-selection"), caption: "Course selection" },
      { src: img("examroom", "exam-selection"), caption: "Exam selection" },
      { src: img("examroom", "exam-instruction"), caption: "Exam instructions" },
      { src: img("examroom", "running-exam"), caption: "Running exam" },
      { src: img("examroom", "sme-validate"), caption: "Question validation by SME" },
    ],
  },
  {
    slug: "cash-connected",
    title: "Cash Connected",
    tagline: "Multi-tenant financial administration",
    start: "2023-09",
    end: "2024-07",
    kind: "work",
    affiliation: "Techno Infinity — for Proxsis Consulting Group",
    role: "Software Engineer",
    abstract:
      "An application for managing financial documents and streamlining financial recording — vouchers, budget plans (RAB), approvals, and document numbering — across multiple tenant companies.",
    stack: ["Laravel 11", "Multi-tenant DB", "JavaScript", "AJAX", "Dashboards"],
    links: [],
    figures: [
      { src: img("cash-connected", "application"), caption: "Application overview" },
      { src: img("cash-connected", "dashboard"), caption: "Dashboard" },
      { src: img("cash-connected", "dummy-bank-voucher-page"), caption: "Bank voucher (dummy data)" },
      { src: img("cash-connected", "dummy-bank-voucher-approval"), caption: "Voucher approval (dummy data)" },
      { src: img("cash-connected", "dummy-bank-voucher-approval-history"), caption: "Approval history (dummy data)" },
      { src: img("cash-connected", "rab-flow"), caption: "Budget plan (RAB) flow" },
      { src: img("cash-connected", "rab-history"), caption: "RAB version history" },
      { src: img("cash-connected", "document-numbering"), caption: "Document numbering" },
      { src: img("cash-connected", "login"), caption: "Login" },
    ],
  },
  {
    slug: "harmonie",
    title: "Harmonie",
    tagline: "Integrated management system",
    start: "2023-05",
    kind: "work",
    affiliation: "Techno Infinity",
    role: "Software Engineer",
    abstract:
      "An integrated management system product. I assisted with the i18n integration that lets customers customise the app's labels.",
    stack: ["Laravel", "JavaScript", "i18n"],
    links: [{ label: "Product site", href: "https://harmonie.id/" }],
    figures: [{ src: img("harmonie", "harmonie"), caption: "Harmonie homepage", link: "https://harmonie.id/" }],
  },
  {
    slug: "safegard",
    title: "Safegard — Asuransi Jasindo",
    tagline: "Enterprise risk management system",
    start: "2022-11",
    kind: "work",
    affiliation: "Techno Infinity — for PT Asuransi Jasa Indonesia",
    role: "Software Engineer (intern)",
    abstract:
      "A Governance, Risk, and Compliance (GRC) system that helps the company manage risks and comply with regulations.",
    sections: [
      {
        heading: "My contribution",
        body: "Developed the Compliance Worksheet and its related Master Data pages.",
      },
    ],
    stack: ["Laravel 8", "MySQL", "Bootstrap", "jQuery", "AJAX"],
    links: [{ label: "Product page", href: "https://technoinfinity.co.id/aplikasi-grc-terintegrasi-safegard/" }],
    figures: [
      {
        src: img("safegard", "safegard"),
        caption: "Safegard integrated GRC",
        link: "https://technoinfinity.co.id/aplikasi-grc-terintegrasi-safegard/",
      },
    ],
  },
  {
    slug: "workspace",
    title: "Workspace",
    tagline: "Human resource information system (HRIS)",
    start: "2022-08",
    end: "2023-08",
    kind: "work",
    affiliation: "Techno Infinity",
    role: "Software Engineer",
    abstract:
      "An HRIS that streamlines employee administrative processes and improves data accuracy for HR teams.",
    stack: ["Laravel", "JavaScript", "jQuery", "Bootstrap", "DataTables"],
    links: [{ label: "Product page", href: "https://technoinfinity.co.id/workspace-aplikasi-hr/" }],
    figures: [
      {
        src: img("workspace", "workspace"),
        caption: "Workspace — one-stop HR app",
        link: "https://technoinfinity.co.id/workspace-aplikasi-hr/",
      },
    ],
  },
  {
    slug: "documine",
    title: "Documine",
    tagline: "Document management system",
    start: "2022-08",
    end: "2022-12",
    kind: "work",
    affiliation: "Techno Infinity",
    role: "Software Engineer (intern)",
    abstract:
      "A system for managing important company documents, making recording, numbering, and approval quick and concise.",
    stack: ["CodeIgniter 3", "JavaScript", "CSS", "MySQL"],
    links: [],
    figures: [
      { src: img("documine", "documine"), caption: "Documine" },
      { src: img("documine", "dashboard"), caption: "Dashboard" },
      { src: img("documine", "approval"), caption: "Approval flow" },
      { src: img("documine", "print"), caption: "Print view" },
      { src: img("documine", "rab-history"), caption: "RAB version history" },
    ],
  },
];

export const projects = [...all].sort((a, b) => b.start.localeCompare(a.start));

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function month(ym: string) {
  const [y, m] = ym.split("-");
  return `${MONTHS[Number(m) - 1]} ${y}`;
}

export function formatPeriod(p: Pick<Project, "start" | "end">) {
  if (!p.end || p.end === p.start) return month(p.start);
  return `${month(p.start)} — ${p.end === "present" ? "Present" : month(p.end)}`;
}
