# Software Architecture

## 2. Microservices Architecture

### 2.1. Overview

Each function is separated into small, independent services that communicate via APIs (REST, gRPC, GraphQL). Each service owns its own data and can be developed, deployed, and scaled independently.

### 2.2. Key Characteristics

- **Single Responsibility:** Each service does one thing well
- **Independent Deployment:** Services can be deployed without coordinating with others
- **Decentralized Data:** Each service manages its own database
- **Technology Diversity:** Services can use different languages, frameworks, and databases
- **Resilience:** Failure in one service does not cascade to others

### 2.3. Communication Patterns

| Pattern | Description | Use Case |
|---|---|---|
| **Synchronous (REST/gRPC)** | Request-response style | Simple queries, reads |
| **Asynchronous (Message Queue)** | Fire-and-forget via Kafka, RabbitMQ | Event-driven, background jobs |
| **GraphQL** | Flexible queries from client | Complex data requirements |

### 2.4. Advantages

- **Independent Scaling:** Scale individual services based on demand (e.g., scale the recommendation service without scaling the entire app)
- **Independent Deployment:** Deploy fixes and features without touching other services
- **Fault Isolation:** A crash in one service (e.g., payment) does not bring down others (e.g., search)
- **Technology Flexibility:** Use the best tool for each job (Go for high-performance services, Python for ML, etc.)
- **Team Autonomy:** Teams can own services end-to-end

### 2.5. Disadvantages

- **Operational Complexity:** Requires strong DevOps practices — CI/CD pipelines, container orchestration (Kubernetes), service mesh, monitoring
- **Network Latency:** Inter-service communication over the network adds latency
- **Distributed Data:** Ensuring data consistency across services is challenging (saga pattern, eventual consistency)
- **Network Security:** More attack surfaces; requires service-to-service authentication (mTLS, JWT)
- **Testing Complexity:** Integration testing across services is harder than testing a monolith

### 2.6. Essential Supporting Components

- **API Gateway:** Entry point for all client requests. Handles routing, authentication, rate limiting
- **Service Discovery:** Tools like Consul or Kubernetes built-in DNS for services to find each other
- **Message Broker:** Kafka or RabbitMQ for asynchronous communication
- **Distributed Tracing:** Jaeger or Zipkin to trace requests across services
- **Container Orchestration:** Kubernetes for deployment, scaling, and management

### 2.7. When to Choose Microservices

- Large teams (10+ developers) working on different features
- Application with distinct functional domains that scale independently
- Need for polyglot persistence (different data stores for different needs)
- Requirement for frequent, independent deployments

> **Note:** Microservices solve real organizational and technical problems. If your team is small or your application is simple, the overhead may outweigh the benefits. Consider a **modular monolith** first — a monolith with clear module boundaries that can later be extracted.
