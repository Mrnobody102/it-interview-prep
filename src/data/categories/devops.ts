import { Category } from "./types";

export const devops: Category = {
  id: "devops",
  name: { vi: "DevOps & Cloud", en: "DevOps & Cloud" },
  description: {
    vi: "Backend hiện đại gần như bắt buộc",
    en: "Almost mandatory for modern backend",
  },
  icon: "☁️",
  topics: [
    {
      id: "linux",
      name: { vi: "Linux", en: "Linux" },
    },
    {
      id: "docker",
      name: { vi: "Docker", en: "Docker" },
    },
    {
      id: "kubernetes",
      name: { vi: "Kubernetes", en: "Kubernetes" },
    },
    {
      id: "cicd",
      name: { vi: "CI/CD", en: "CI/CD" },
    },
    {
      id: "cloud",
      name: {
        vi: "Cloud (AWS / GCP / Azure)",
        en: "Cloud (AWS / GCP / Azure)",
      },
    },
  ],
};
