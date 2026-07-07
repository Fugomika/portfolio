export type SkillGroup = {
  label: string;
  items: string[];
};

export const skillGroups: SkillGroup[] = [
  {
    label: "Languages",
    items: ["PHP", "Python", "JavaScript", "TypeScript", "Go", "Java", "Dart"],
  },
  {
    label: "Web",
    items: [
      "Laravel",
      "Vue",
      "Next.js",
      "CodeIgniter",
      "Tailwind CSS",
      "Livewire",
      "Filament",
      "Bootstrap",
      "jQuery",
    ],
  },
  {
    label: "Data & servers",
    items: ["MySQL", "Linux", "Nginx", "MQTT", "Git", "tmux", "Neovim"],
  },
  {
    label: "Currently learning",
    items: ["AI / LLM apps", "Flutter", "Infra & configs"],
  },
];
