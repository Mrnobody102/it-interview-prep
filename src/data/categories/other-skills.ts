import { Category } from "./types";

export const otherSkills: Category = {
  id: "other-skills",
  name: { vi: "Kĩ năng khác", en: "Other Skills" },
  description: {
    vi: 'Phân biệt dev "code được" và "làm được việc"',
    en: 'Differentiates "can code" vs "can work"',
  },
  icon: "🛡️",
  topics: [
    {
      id: "testing",
      name: {
        vi: "Unit / Integration / E2E Testing",
        en: "Unit / Integration / E2E Testing",
      },
    },
    {
      id: "tdd-bdd",
      name: { vi: "TDD / BDD", en: "TDD / BDD" },
    },
    {
      id: "code-review",
      name: { vi: "Code Review", en: "Code Review" },
    },
    {
      id: "owasp",
      name: { vi: "OWASP Top 10", en: "OWASP Top 10" },
    },
    {
      id: "agile",
      name: { vi: "Agile / Scrum", en: "Agile / Scrum" },
    },
  ],
};
