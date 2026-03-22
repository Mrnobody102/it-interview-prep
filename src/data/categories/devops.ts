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
    {
      id: "deployment-strategies",
      name: { vi: "Deployment Strategies", en: "Deployment Strategies" },
    },
    {
      id: "monitoring-logging",
      name: { vi: "Monitoring & Logging", en: "Monitoring & Logging" },
    },
    {
      id: "jenkins",
      name: { vi: "Jenkins", en: "Jenkins" },
    },
    {
      id: "devops-security",
      name: { vi: "DevOps Security", en: "DevOps Security" },
    },
  ],
};
