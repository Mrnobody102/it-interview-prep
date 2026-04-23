import type { Category } from "./types";

export const aiRobotics: Category = {
  id: "ai-robotics",
  name: {
    vi: "AI, Robotics & Physical AI",
    en: "AI, Robotics & Physical AI",
  },
  description: {
    vi: "Trí tuệ nhân tạo, Robotics và hệ thống Physical AI",
    en: "Artificial Intelligence, Robotics, and Physical AI systems",
  },
  icon: "🤖",
  topics: [
    {
      id: "ai-foundations",
      name: {
        vi: "AI Foundations",
        en: "AI Foundations",
      },
      expanded: true,
      subtopics: [
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
      ],
    },
    {
      id: "language-agent-systems",
      name: {
        vi: "Language AI & Agent Systems",
        en: "Language AI & Agent Systems",
      },
      expanded: true,
      subtopics: [
        {
          id: "nlp",
          name: {
            vi: "NLP, LLMs & Transformers",
            en: "NLP, LLMs & Transformers",
          },
        },
        {
          id: "ai-agents-rag",
          name: {
            vi: "RAG, Agents & Tool Use",
            en: "RAG, Agents & Tool Use",
          },
        },
        {
          id: "mlops",
          name: {
            vi: "MLOps & AI Production",
            en: "MLOps & AI Production",
          },
        },
      ],
    },
    {
      id: "robotics-core-systems",
      name: {
        vi: "Robotics Core Systems",
        en: "Robotics Core Systems",
      },
      expanded: true,
      subtopics: [
        {
          id: "robotics-foundations",
          name: {
            vi: "Robotics Foundations & ROS 2",
            en: "Robotics Foundations & ROS 2",
          },
        },
        {
          id: "robot-perception-localization",
          name: {
            vi: "Robot Perception, Localization & SLAM",
            en: "Robot Perception, Localization & SLAM",
          },
        },
      ],
    },
    {
      id: "robot-motion-learning",
      name: {
        vi: "Motion, Control & Robot Learning",
        en: "Motion, Control & Robot Learning",
      },
      expanded: true,
      subtopics: [
        {
          id: "motion-planning-control",
          name: {
            vi: "Motion Planning, Manipulation & Control",
            en: "Motion Planning, Manipulation & Control",
          },
        },
        {
          id: "robot-learning-embodied-ai",
          name: {
            vi: "Robot Learning & Embodied AI",
            en: "Robot Learning & Embodied AI",
          },
        },
      ],
    },
    {
      id: "simulation-safety-deployment",
      name: {
        vi: "Simulation, Safety & Deployment",
        en: "Simulation, Safety & Deployment",
      },
      expanded: true,
      subtopics: [
        {
          id: "simulation-sim2real",
          name: {
            vi: "Simulation, Sim2Real & Synthetic Data",
            en: "Simulation, Sim2Real & Synthetic Data",
          },
        },
        {
          id: "robot-systems-safety",
          name: {
            vi: "Robot Systems, Safety & Deployment",
            en: "Robot Systems, Safety & Deployment",
          },
        },
      ],
    },
  ],
};
