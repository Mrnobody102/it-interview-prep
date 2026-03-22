import { Category } from "./types";

export const frontend: Category = {
  id: "frontend",
  name: { vi: "Frontend", en: "Frontend" },
  description: {
    vi: "Dành cho frontend dev & full-stack",
    en: "For frontend dev & full-stack",
  },
  icon: "🎨",
  topics: [
    {
      id: "html-css-js",
      name: {
        vi: "HTML / CSS / JavaScript core",
        en: "HTML / CSS / JavaScript core",
      },
    },
    {
      id: "async-js",
      name: {
        vi: "Async JS (Promise, async/await)",
        en: "Async JS (Promise, async/await)",
      },
    },
    {
      id: "react",
      name: { vi: "React", en: "React" },
    },
    {
      id: "javascript",
      name: { vi: "JavaScript ES6+", en: "JavaScript ES6+" },
    },
    {
      id: "angular",
      name: { vi: "Angular", en: "Angular" },
    },
    {
      id: "vue",
      name: { vi: "Vue", en: "Vue" },
    },
    {
      id: "state-management",
      name: { vi: "State Management", en: "State Management" },
    },
  ],
};
