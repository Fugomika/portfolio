export type Experience = {
  title: string;
  company: string;
  location: string;
  period: string;
  bullets: string[];
};

export type Education = {
  school: string;
  degree: string;
  detail: string;
};

export const experience: Experience[] = [
  {
    title: "Software Engineer",
    company: "GEOSAT — PT Geomatika Satelit Indonesia",
    location: "Jakarta",
    period: "Mar 2025 — Present",
    bullets: [
      "Build and maintain Python pipelines that process raw satellite AIS data feeding the ship-tracking platform.",
      "Develop the real-time maritime monitoring frontend in Vue.js and the Laravel REST APIs behind it.",
      "Introduced a Scrum board to the team and drove the workflow change that came with it.",
    ],
  },
  {
    title: "Software Engineer",
    company: "Techno Infinity",
    location: "Bandung",
    period: "May 2023 — Feb 2025",
    bullets: [
      "Shipped 9 production client applications end to end: HRIS, GRC/risk management, document management, financial administration, and assessment platforms.",
      "Built the company's Laravel boilerplate with ADRs and usage docs — the starting point for every new project after it.",
      "Presented features and progress directly to clients through delivery.",
    ],
  },
  {
    title: "Software Engineer (Internship)",
    company: "Techno Infinity",
    location: "Bandung",
    period: "Aug 2022 — Dec 2022",
    bullets: [
      "First taste of the industry: project lifecycles, planning, and shipping code that other people depend on.",
    ],
  },
];

export const education: Education[] = [
  {
    school: "Telkom University",
    degree: "BSc Computer Science",
    detail: "Studying while working full-time.",
  },
  {
    school: "SMK Wikrama Bogor",
    degree: "Software Engineering",
    detail:
      "Best Graduate 2024 · 2nd place, Bebras Computational Thinking Challenge (city level) · Student Council Head of IT Division.",
  },
];
