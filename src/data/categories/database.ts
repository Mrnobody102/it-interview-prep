import { Category } from "./types";

export const database: Category = {
  id: "database",
  name: { vi: "Database", en: "Database" },
  description: {
    vi: 'Chủ đề "đào sâu" trong phỏng vấn',
    en: "Deep dive topic in interviews",
  },
  icon: "💾",
  topics: [
    // ===== I. OVERVIEW =====
    {
      id: "database-overview",
      name: { vi: "Overview", en: "Overview" },
      expanded: true,
      subtopics: [
        {
          id: "db-types",
          name: {
            vi: "DB Types (SQL vs NoSQL)",
            en: "DB Types (SQL vs NoSQL)",
          },
        },
        {
          id: "schema-design",
          name: { vi: "Schema Design", en: "Schema Design" },
        },
        {
          id: "indexing-optimization",
          name: {
            vi: "Indexing & Query Optimization",
            en: "Indexing & Query Optimization",
          },
        },
        {
          id: "transactions-isolation",
          name: {
            vi: "Transaction, Isolation, Locking",
            en: "Transaction, Isolation, Locking",
          },
        },
        {
          id: "scaling-replication",
          name: {
            vi: "Partitioning, Sharding, Replication",
            en: "Partitioning, Sharding, Replication",
          },
        },
        {
          id: "db-caching",
          name: { vi: "Caching", en: "Caching" },
        },
        {
          id: "backup-recovery",
          name: { vi: "Backup & Recovery", en: "Backup & Recovery" },
        },
        {
          id: "performance-tuning",
          name: { vi: "Performance Tuning", en: "Performance Tuning" },
        },
        {
          id: "orm-jpa",
          name: {
            vi: "ORM, JPA, Spring Data JPA",
            en: "ORM, JPA, Spring Data JPA",
          },
        },
      ],
    },
    // ===== SCENARIO =====
    {
      id: "database-scenario",
      name: { vi: "Scenario", en: "Scenario" },
      expanded: true,
      subtopics: [
        {
          id: "jpa-vs-native",
          name: {
            vi: "Dùng JPA khác gì Native Query?",
            en: "JPA vs Native Query",
          },
        },
        {
          id: "optimize-query-process",
          name: {
            vi: "Quy trình tối ưu query",
            en: "Query Optimization Process",
          },
        },
      ],
    },
  ],
};
