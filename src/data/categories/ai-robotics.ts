import type { Category } from "./types";

export const aiRobotics: Category = {
  id: "ai-robotics",
  name: { vi: "AI & Robotics", en: "AI & Robotics" },
  description: {
    vi: "Trí tuệ nhân tạo và Robotics",
    en: "Artificial Intelligence and Robotics",
  },
  icon: "🤖",
  topics: [
    {
      id: "machine-learning",
      name: { vi: "Machine Learning", en: "Machine Learning" },
    },
    {
      id: "deep-learning",
      name: { vi: "Deep Learning", en: "Deep Learning" },
    },
    {
      id: "computer-vision",
      name: { vi: "Computer Vision", en: "Computer Vision" },
    },
    {
      id: "nlp",
      name: { vi: "NLP & Transformers", en: "NLP & Transformers" },
    },
    {
      id: "mlops",
      name: { vi: "MLOps", en: "MLOps" },
    },
  ],
};
