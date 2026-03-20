# Software Architecture

## 1. Monolithic Architecture

### 1.1. Overview

Single block architecture — the entire application is built as one unit. All components (UI, business logic, DB access) reside in a single codebase and are deployed together.

### 1.2. Characteristics

| Aspect | Description |
|---|---|
| **Structure** | All code in one codebase |
| **Deployment** | Single deployable unit |
| **Communication** | In-memory function calls |
| **Technology** | Single tech stack |

### 1.3. Advantages

- **Simple to start:** Ideal for new projects with fast development cycles
- **Easy to test and debug:** All code in one place, simpler debugging workflow
- **Simple deployment:** Deploy a single artifact
- **Low overhead:** No network latency between components

### 1.4. Disadvantages

- **Scalability limitations:** Hard to scale individual components independently
- **Single point of failure:** One small error can crash the entire system
- **Technology lock-in:** Hard to adopt new technology for individual parts
- **Slow build/deploy:** As codebase grows, CI/CD pipelines become slower

### 1.5. When to Use

- Small projects with a small team
- Simple requirements and limited scope
- Need to develop and launch quickly
- Early-stage prototypes and MVPs

### 1.6. Monolith vs. Microservices Comparison

| Criteria | Monolithic | Microservices |
|---|---|---|
| **Complexity** | Low | High |
| **Deployment** | Single | Independent per service |
| **Scaling** | Whole app | Per service |
| **Technology** | Single stack | Polyglot |
| **Fault Isolation** | Poor | Strong |
| **Team Size** | Small | Large |
| **Time to Market** | Fast | Slower setup |

> **Tip:** Start with a monolith. Extract services only when you have clear reasons (team scaling, independent deploy needs, different scaling requirements per component).
