import type { Category } from "./types";

export const systemCategory: Category = {
  id: "he-thong",
  name: { vi: "Hệ thống", en: "System" },
  description: {
    vi: "Kiến trúc phần mềm và thiết kế hệ thống",
    en: "Software architecture and system design",
  },
  icon: "🏗️",
  topics: [
    // ===== I. OVERVIEW (from System Design) =====
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
    // ===== II. SOFTWARE ARCHITECTURE =====
    {
      id: "system-architecture-overview",
      name: {
        vi: "Kiến trúc tổng quan hệ thống",
        en: "System Architecture Overview",
      },
      expanded: true,
      subtopics: [
        {
          id: "monolithic-architecture",
          name: {
            vi: "Monolithic Architecture",
            en: "Monolithic Architecture",
          },
        },
        {
          id: "modular-monolith",
          name: { vi: "Modular Monolith", en: "Modular Monolith" },
        },
        {
          id: "microservices-architecture",
          name: {
            vi: "Microservices Architecture",
            en: "Microservices Architecture",
          },
        },
        {
          id: "soa-architecture",
          name: {
            vi: "SOA (Service-Oriented Architecture)",
            en: "SOA (Service-Oriented Architecture)",
          },
        },
        {
          id: "serverless-architecture",
          name: {
            vi: "Serverless/Cloud Architecture",
            en: "Serverless/Cloud Architecture",
          },
        },
      ],
    },
    // ===== III. DESIGN PRINCIPLES =====
    {
      id: "design-principles",
      name: { vi: "Design Principles", en: "Design Principles" },
      expanded: true,
      subtopics: [
        {
          id: "solid-principle",
          name: { vi: "SOLID Principles", en: "SOLID Principles" },
        },
        {
          id: "dry-principle",
          name: {
            vi: "DRY (Don't Repeat Yourself)",
            en: "DRY (Don't Repeat Yourself)",
          },
        },
        {
          id: "kiss-principle",
          name: {
            vi: "KISS (Keep It Simple, Stupid)",
            en: "KISS (Keep It Simple, Stupid)",
          },
        },
        {
          id: "yagni-principle",
          name: {
            vi: "YAGNI (You Aren't Gonna Need It)",
            en: "YAGNI (You Aren't Gonna Need It)",
          },
        },
      ],
    },
    // ===== IV. DESIGN PATTERNS =====
    {
      id: "design-patterns",
      name: { vi: "Design Patterns", en: "Design Patterns" },
      expanded: true,
      subtopics: [
        {
          id: "creational",
          name: { vi: "Creational Patterns", en: "Creational Patterns" },
        },
        {
          id: "structural",
          name: { vi: "Structural Patterns", en: "Structural Patterns" },
        },
        {
          id: "behavioral",
          name: { vi: "Behavioral Patterns", en: "Behavioral Patterns" },
        },
      ],
    },
    // ===== V. ADVANCED ARCHITECTURE =====
    {
      id: "advanced-architecture",
      name: { vi: "Advanced Architecture", en: "Advanced Architecture" },
      expanded: true,
      subtopics: [
        {
          id: "ddd",
          name: { vi: "Domain-Driven Design (DDD)", en: "Domain-Driven Design (DDD)" },
        },
        {
          id: "cqrs-event-sourcing",
          name: { vi: "CQRS & Event Sourcing", en: "CQRS & Event Sourcing" },
        },
        {
          id: "clean-architecture",
          name: { vi: "Clean & Hexagonal Architecture", en: "Clean & Hexagonal Architecture" },
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
