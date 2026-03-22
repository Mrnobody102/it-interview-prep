import type { Category } from "./types";

export const softwareArchitectureDesign: Category = {
  id: "software-architecture-design",
  name: {
    vi: "Kiến trúc phần mềm",
    en: "Software Architecture",
  },
  description: {
    vi: "Kiến trúc phần mềm và thiết kế hệ thống",
    en: "Software architecture and system design",
  },
  icon: "📐",
  topics: [
    // ===== I. KIẾN TRÚC TỔNG QUAN HỆ THỐNG =====
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
    // ===== DESIGN PRINCIPLES =====
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
    // ===== DESIGN PATTERNS =====
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
    // ===== ADVANCED ARCHITECTURE =====
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
  ],
};
