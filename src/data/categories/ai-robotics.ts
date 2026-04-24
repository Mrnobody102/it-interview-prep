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
          expanded: true,
          subtopics: [
            {
              id: "machine-learning-supervised-basics",
              name: {
                vi: "Supervised Learning & Core Baselines",
                en: "Supervised Learning & Core Baselines",
              },
            },
            {
              id: "machine-learning-tree-ensemble",
              name: {
                vi: "Trees, Ensembles & Tabular ML",
                en: "Trees, Ensembles & Tabular ML",
              },
            },
            {
              id: "machine-learning-unsupervised-evaluation",
              name: {
                vi: "Unsupervised Learning, Metrics & Validation",
                en: "Unsupervised Learning, Metrics & Validation",
              },
            },
            {
              id: "machine-learning-uncertainty-robotics",
              name: {
                vi: "Uncertainty, Time-Series & ML for Robotics",
                en: "Uncertainty, Time-Series & ML for Robotics",
              },
            },
          ],
        },
        {
          id: "deep-learning",
          name: { vi: "Deep Learning", en: "Deep Learning" },
          expanded: true,
          subtopics: [
            {
              id: "deep-learning-fundamentals",
              name: {
                vi: "DL Fundamentals & Optimization",
                en: "DL Fundamentals & Optimization",
              },
            },
            {
              id: "deep-learning-architectures",
              name: {
                vi: "CNNs, RNNs & Core Architectures",
                en: "CNNs, RNNs & Core Architectures",
              },
            },
            {
              id: "deep-learning-transformers",
              name: {
                vi: "Transformers, Foundation Models & Fine-tuning",
                en: "Transformers, Foundation Models & Fine-tuning",
              },
            },
            {
              id: "deep-learning-multimodal-embodied",
              name: {
                vi: "Multimodal, World Models & Embodied DL",
                en: "Multimodal, World Models & Embodied DL",
              },
            },
          ],
        },
        {
          id: "computer-vision",
          name: { vi: "Computer Vision", en: "Computer Vision" },
          expanded: true,
          subtopics: [
            {
              id: "computer-vision-fundamentals",
              name: {
                vi: "CV Fundamentals & Classical Vision",
                en: "CV Fundamentals & Classical Vision",
              },
            },
            {
              id: "computer-vision-detection-segmentation",
              name: {
                vi: "Detection, Segmentation & Recognition",
                en: "Detection, Segmentation & Recognition",
              },
            },
            {
              id: "computer-vision-video-tracking",
              name: {
                vi: "Video Understanding & Tracking",
                en: "Video Understanding & Tracking",
              },
            },
            {
              id: "computer-vision-3d-geometry",
              name: {
                vi: "3D Vision, Geometry & Pose",
                en: "3D Vision, Geometry & Pose",
              },
            },
            {
              id: "computer-vision-vlm-grounding",
              name: {
                vi: "VLMs, Grounding & Open-Vocabulary Vision",
                en: "VLMs, Grounding & Open-Vocabulary Vision",
              },
            },
            {
              id: "computer-vision-production-robotics",
              name: {
                vi: "Production CV for Robotics",
                en: "Production CV for Robotics",
              },
            },
          ],
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
          expanded: true,
          subtopics: [
            {
              id: "nlp-foundations",
              name: {
                vi: "NLP Foundations & Text Representation",
                en: "NLP Foundations & Text Representation",
              },
            },
            {
              id: "nlp-transformers-llms",
              name: {
                vi: "Transformers, LLMs & Context Windows",
                en: "Transformers, LLMs & Context Windows",
              },
            },
            {
              id: "nlp-adaptation-alignment",
              name: {
                vi: "Fine-tuning, Alignment & Model Adaptation",
                en: "Fine-tuning, Alignment & Model Adaptation",
              },
            },
            {
              id: "nlp-applications-production",
              name: {
                vi: "Applications, Prompting & Production NLP",
                en: "Applications, Prompting & Production NLP",
              },
            },
          ],
        },
        {
          id: "ai-agents-rag",
          name: {
            vi: "RAG, Agents & Tool Use",
            en: "RAG, Agents & Tool Use",
          },
          expanded: true,
          subtopics: [
            {
              id: "ai-agents-rag-retrieval-foundations",
              name: {
                vi: "Retrieval Foundations & RAG Architecture",
                en: "Retrieval Foundations & RAG Architecture",
              },
            },
            {
              id: "ai-agents-rag-tool-calling",
              name: {
                vi: "Tool Calling, APIs & Structured Actions",
                en: "Tool Calling, APIs & Structured Actions",
              },
            },
            {
              id: "ai-agents-rag-agent-orchestration",
              name: {
                vi: "Agent Orchestration & Multi-Step Systems",
                en: "Agent Orchestration & Multi-Step Systems",
              },
            },
            {
              id: "ai-agents-rag-memory-evaluation",
              name: {
                vi: "Memory, Context & Agent Evaluation",
                en: "Memory, Context & Agent Evaluation",
              },
            },
          ],
        },
        {
          id: "mlops",
          name: {
            vi: "MLOps & AI Production",
            en: "MLOps & AI Production",
          },
          expanded: true,
          subtopics: [
            {
              id: "mlops-data-experimentation",
              name: {
                vi: "Data Quality, Versioning & Experimentation",
                en: "Data Quality, Versioning & Experimentation",
              },
            },
            {
              id: "mlops-platform-registry",
              name: {
                vi: "Feature Stores, Registry & Governance",
                en: "Feature Stores, Registry & Governance",
              },
            },
            {
              id: "mlops-serving-orchestration",
              name: {
                vi: "Serving, CI/CD & Orchestration",
                en: "Serving, CI/CD & Orchestration",
              },
            },
            {
              id: "mlops-monitoring-llmops",
              name: {
                vi: "Monitoring, LLMOps & Fleet Learning",
                en: "Monitoring, LLMOps & Fleet Learning",
              },
            },
          ],
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
          expanded: true,
          subtopics: [
            {
              id: "robotics-foundations-robot-stack",
              name: {
                vi: "Robot Stack Architecture & Middleware",
                en: "Robot Stack Architecture & Middleware",
              },
            },
            {
              id: "robotics-foundations-ros2-communication",
              name: {
                vi: "ROS 2 Communication, QoS & Lifecycle",
                en: "ROS 2 Communication, QoS & Lifecycle",
              },
            },
            {
              id: "robotics-foundations-tf-urdf-calibration",
              name: {
                vi: "TF2, URDF, Frames & Calibration",
                en: "TF2, URDF, Frames & Calibration",
              },
            },
            {
              id: "robotics-foundations-kinematics-control",
              name: {
                vi: "Kinematics, ros2_control & Integration",
                en: "Kinematics, ros2_control & Integration",
              },
            },
          ],
        },
        {
          id: "robot-perception-localization",
          name: {
            vi: "Robot Perception, Localization & SLAM",
            en: "Robot Perception, Localization & SLAM",
          },
          expanded: true,
          subtopics: [
            {
              id: "robot-perception-localization-sensors-fusion",
              name: {
                vi: "Sensors, Calibration & Sensor Fusion",
                en: "Sensors, Calibration & Sensor Fusion",
              },
            },
            {
              id: "robot-perception-localization-localization-slam",
              name: {
                vi: "Localization, State Estimation & SLAM",
                en: "Localization, State Estimation & SLAM",
              },
            },
            {
              id: "robot-perception-localization-maps-navigation",
              name: {
                vi: "Maps, Scene Representation & Navigation Perception",
                en: "Maps, Scene Representation & Navigation Perception",
              },
            },
            {
              id: "robot-perception-localization-manipulation-semantic",
              name: {
                vi: "Manipulation Perception & Semantic Grounding",
                en: "Manipulation Perception & Semantic Grounding",
              },
            },
          ],
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
          expanded: true,
          subtopics: [
            {
              id: "motion-planning-control-kinematics-planning",
              name: {
                vi: "Kinematics, Feasibility & Planning Layers",
                en: "Kinematics, Feasibility & Planning Layers",
              },
            },
            {
              id: "motion-planning-control-mobile-navigation",
              name: {
                vi: "Mobile Navigation & Trajectory Planning",
                en: "Mobile Navigation & Trajectory Planning",
              },
            },
            {
              id: "motion-planning-control-manipulation-trajectories",
              name: {
                vi: "Manipulation Planning & Trajectory Generation",
                en: "Manipulation Planning & Trajectory Generation",
              },
            },
            {
              id: "motion-planning-control-control-realtime",
              name: {
                vi: "Control, Real-Time Systems & Execution",
                en: "Control, Real-Time Systems & Execution",
              },
            },
          ],
        },
        {
          id: "robot-learning-embodied-ai",
          name: {
            vi: "Robot Learning & Embodied AI",
            en: "Robot Learning & Embodied AI",
          },
          expanded: true,
          subtopics: [
            {
              id: "robot-learning-embodied-ai-learning-paradigms",
              name: {
                vi: "Robot Learning Paradigms & Policy Learning",
                en: "Robot Learning Paradigms & Policy Learning",
              },
            },
            {
              id: "robot-learning-embodied-ai-policy-representations",
              name: {
                vi: "Policy Representations, Skills & Action Spaces",
                en: "Policy Representations, Skills & Action Spaces",
              },
            },
            {
              id: "robot-learning-embodied-ai-vla-foundation-models",
              name: {
                vi: "VLA Models, World Models & Embodied FMs",
                en: "VLA Models, World Models & Embodied FMs",
              },
            },
            {
              id: "robot-learning-embodied-ai-data-evaluation",
              name: {
                vi: "Data Scaling, Evaluation & Real-World Constraints",
                en: "Data Scaling, Evaluation & Real-World Constraints",
              },
            },
          ],
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
          expanded: true,
          subtopics: [
            {
              id: "simulation-sim2real-simulation-foundations",
              name: {
                vi: "Simulation Foundations & Physics Fidelity",
                en: "Simulation Foundations & Physics Fidelity",
              },
            },
            {
              id: "simulation-sim2real-sim2real-strategies",
              name: {
                vi: "Domain Randomization & Sim2Real Strategies",
                en: "Domain Randomization & Sim2Real Strategies",
              },
            },
            {
              id: "simulation-sim2real-synthetic-data",
              name: {
                vi: "Synthetic Data, Rendering & Scenario Generation",
                en: "Synthetic Data, Rendering & Scenario Generation",
              },
            },
            {
              id: "simulation-sim2real-evaluation-benchmarking",
              name: {
                vi: "Evaluation Ladders, Replay & Benchmarking",
                en: "Evaluation Ladders, Replay & Benchmarking",
              },
            },
          ],
        },
        {
          id: "robot-systems-safety",
          name: {
            vi: "Robot Systems, Safety & Deployment",
            en: "Robot Systems, Safety & Deployment",
          },
          expanded: true,
          subtopics: [
            {
              id: "robot-systems-safety-architecture-runtime",
              name: {
                vi: "Production Architecture & Runtime Boundaries",
                en: "Production Architecture & Runtime Boundaries",
              },
            },
            {
              id: "robot-systems-safety-safety-supervision",
              name: {
                vi: "Safety Layers, Guardrails & Supervision",
                en: "Safety Layers, Guardrails & Supervision",
              },
            },
            {
              id: "robot-systems-safety-observability-operations",
              name: {
                vi: "Observability, Incident Response & Operations",
                en: "Observability, Incident Response & Operations",
              },
            },
            {
              id: "robot-systems-safety-deployment-human-loop",
              name: {
                vi: "Deployment Patterns & Human-in-the-Loop",
                en: "Deployment Patterns & Human-in-the-Loop",
              },
            },
          ],
        },
      ],
    },
  ],
};
