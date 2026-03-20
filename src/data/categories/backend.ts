import { Category } from "./types";

export const backend: Category = {
  id: "backend",
  name: { vi: "Backend", en: "Backend" },
  description: { vi: "Kiến thức Backend", en: "Backend Knowledge" },
  icon: "🛠️",
  topics: [
    {
      id: "java-backend",
      name: { vi: "Java Backend", en: "Java Backend" },
      subtopics: [
        {
          id: "java-core",
          name: { vi: "Java Core", en: "Java Core" },
          subtopics: [
            {
              id: "java-core-oop",
              name: { vi: "OOP", en: "OOP" },
            },
            {
              id: "java-core-collections",
              name: { vi: "Collections", en: "Collections" },
            },
            {
              id: "java-core-concurrency",
              name: { vi: "Concurrency", en: "Concurrency" },
            },
            {
              id: "java-core-lambda-stream",
              name: { vi: "Lambda & Stream", en: "Lambda & Stream" },
            },
            {
              id: "java-core-generics",
              name: { vi: "Generics", en: "Generics" },
            },
            {
              id: "java-core-io",
              name: { vi: "Java I/O", en: "Java I/O" },
            },
            {
              id: "java-core-jvm-gc",
              name: { vi: "JVM & GC", en: "JVM & GC" },
            },
            {
              id: "java-core-versions",
              name: { vi: "Java Versions", en: "Java Versions" },
            },
          ],
        },
        {
          id: "spring-boot",
          name: { vi: "Spring / Spring Boot", en: "Spring / Spring Boot" },
          subtopics: [
            {
              id: "spring-core",
              name: { vi: "Spring Core", en: "Spring Core" },
            },
            {
              id: "spring-boot-intro",
              name: { vi: "Spring Boot", en: "Spring Boot" },
            },
            {
              id: "rest-api",
              name: { vi: "Spring MVC (REST)", en: "Spring MVC (REST)" },
            },
            {
              id: "security",
              name: { vi: "Spring Security 6", en: "Spring Security 6" },
            },
            {
              id: "transaction",
              name: { vi: "Data & Transaction", en: "Data & Transaction" },
            },
            {
              id: "async",
              name: { vi: "Async & Scheduler", en: "Async & Scheduler" },
            },
            {
              id: "spring-testing",
              name: { vi: "Testing", en: "Testing" },
            },
            {
              id: "spring-actuator-monitoring",
              name: {
                vi: "Actuator & Monitoring",
                en: "Actuator & Monitoring",
              },
            },
            {
              id: "spring-cloud",
              name: { vi: "Spring Cloud", en: "Spring Cloud" },
            },
          ],
        },
      ],
    },
    {
      id: "python-backend",
      name: { vi: "Python Backend", en: "Python Backend" },
      subtopics: [
        {
          id: "django-fastapi",
          name: { vi: "Django / FastAPI", en: "Django / FastAPI" },
        },
      ],
    },
    {
      id: "nodejs-backend",
      name: { vi: "Node.js Backend", en: "Node.js Backend" },
      subtopics: [
        {
          id: "express-nestjs",
          name: { vi: "Express / NestJS", en: "Express / NestJS" },
        },
        {
          id: "event-loop",
          name: { vi: "Event Loop", en: "Event Loop" },
        },
      ],
    },
    {
      id: "dotnet-backend",
      name: { vi: ".NET Backend", en: ".NET Backend" },
    },
    {
      id: "golang-backend",
      name: { vi: "Golang Backend", en: "Golang Backend" },
    },
  ],
};
