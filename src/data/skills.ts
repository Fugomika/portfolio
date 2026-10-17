export type Skill = {
  name: string;
  /** 1–3 characters drawn on the item tile. */
  short: string;
  /**
   * Lowercase prefixes matched against project stacks to count where the skill
   * was used. Defaults to the lowercased name ("laravel" matches "Laravel 11").
   */
  match?: string[];
  /** Places it was used that aren't in the projects list. */
  alsoIn?: string[];
  learning?: boolean;
};

export type SkillGroup = {
  label: string;
  items: Skill[];
};

export const skillGroups: SkillGroup[] = [
  {
    label: "Languages",
    items: [
      { name: "PHP", short: "Ph", match: ["laravel", "codeigniter", "wordpress"] },
      { name: "Python", short: "Py" },
      { name: "JavaScript", short: "JS", match: ["javascript", "vanilla js", "jquery"] },
      { name: "TypeScript", short: "TS", alsoIn: ["This portfolio"] },
      { name: "Go", short: "Go" },
      { name: "Java", short: "Jv", alsoIn: ["Smart parking management system (repo)"] },
      { name: "Dart", short: "Dt" },
    ],
  },
  {
    label: "Web",
    items: [
      { name: "Laravel", short: "Lv" },
      { name: "Vue", short: "Vu" },
      { name: "Next.js", short: "Nx", alsoIn: ["This portfolio"] },
      { name: "CodeIgniter", short: "CI" },
      { name: "Tailwind CSS", short: "Tw", alsoIn: ["This portfolio"] },
      { name: "Livewire", short: "Lw" },
      { name: "Filament", short: "Fi" },
      { name: "Bootstrap", short: "Bs" },
      { name: "jQuery", short: "jQ" },
    ],
  },
  {
    label: "Data & servers",
    items: [
      { name: "MySQL", short: "My" },
      { name: "Linux", short: "Lx" },
      { name: "Nginx", short: "Ng" },
      { name: "MQTT", short: "Mq", alsoIn: ["Cloud computing MQTT app (repo)"] },
      { name: "Git", short: "Gt" },
      { name: "tmux", short: "Tx", alsoIn: ["my-tmux-conf (repo)"] },
      { name: "Neovim", short: "Nv", alsoIn: ["astrovim_config (repo)"] },
    ],
  },
  {
    label: "Learning",
    items: [
      { name: "AI / LLM apps", short: "AI", learning: true },
      { name: "Flutter", short: "Fl", learning: true },
      { name: "Infra & configs", short: "If", learning: true },
    ],
  },
];
