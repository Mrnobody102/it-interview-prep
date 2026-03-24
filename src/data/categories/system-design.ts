import { Category } from "./types";

export const systemDesign: Category = {
  id: "system-design",
  name: { vi: "Thiết kế hệ thống", en: "System Design" },
  description: {
    vi: "Chủ đề mid → senior → lead",
    en: "Topic for mid → senior → lead",
  },
  icon: "🏗️",
  topics: [
    // ===== I. OVERVIEW =====
    {
      id: "overview",
      name: { vi: "Overview", en: "Overview" },
      expanded: true,
      subtopics: [
        {
          id: "overview-computer-architecture",
          name: { vi: "Computer Architecture", en: "Computer Architecture" },
        },
        {
          id: "production-app-architecture",
          name: {
            vi: "Production App Architecture",
            en: "Production App Architecture",
          },
        },
        {
          id: "overview-design-requirements",
          name: { vi: "Design Requirements", en: "Design Requirements" },
        },
        {
          id: "networking",
          name: { vi: "Networking", en: "Networking" },
        },
        {
          id: "overview-api-design",
          name: { vi: "API Design", en: "API Design" },
        },
        {
          id: "caching-cdn",
          name: { vi: "Caching & CDN", en: "Caching & CDN" },
        },
        {
          id: "overview-proxy-server",
          name: { vi: "Proxy Server", en: "Proxy Server" },
        },
        {
          id: "load-balancer",
          name: { vi: "Load Balancer", en: "Load Balancer" },
        },
        {
          id: "overview-message-queue-main",
          name: {
            vi: "Message Queue (Kafka, RabbitMQ, ActiveMQ)",
            en: "Message Queue (Kafka, RabbitMQ, ActiveMQ)",
          },
        },
      ],
    },
    // ===== SCENARIO =====
    {
      id: "scenario",
      name: { vi: "Scenario", en: "Scenario" },
      expanded: true,
      subtopics: [
        {
          id: "scenario-design-millions-users",
          name: {
            vi: "Một hệ thống hàng triệu người dùng thiết kế thế nào? Những điểm quan trọng để tối ưu hệ thống đó.",
            en: "Design for millions of users? Key optimization points.",
          },
        },
        {
          id: "request-response-flow",
          name: {
            vi: "Một luồng request-response client đi qua các thành phần của một hệ thống web application hiện đại thế nào",
            en: "Request-response flow in modern web application",
          },
        },
      ],
    },
  ],
};
