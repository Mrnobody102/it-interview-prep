# System Design

## 10. Design Requirements

### 10.1. Identifying Requirements

#### 10.1.1. Functional Requirements

What the system must do:

- User authentication and authorization
- CRUD operations on resources
- Search and filtering capabilities
- Notifications and messaging
- Payment processing
- Reporting and analytics

#### 10.1.2. Non-Functional Requirements (Quality Attributes)

How the system performs:

| Requirement | Description | Example |
|---|---|---|
| **Scalability** | Ability to handle increased load | Support 10K → 1M users without redesign |
| **Performance** | Fast response, low latency | p99 latency < 200ms |
| **Availability** | Uptime, minimal downtime | 99.9% (three 9s) = ~8.7 hours downtime/year |
| **Security** | Data protection, authN/authZ | HTTPS, encryption at rest, RBAC |
| **Maintainability** | Easy to fix, upgrade, extend | Clean code, good documentation |
| **Reliability** | Consistent correct behavior | Graceful degradation under failures |
| **Cost** | Deployment and operational expenses | Stay within budget constraints |
| **Observability** | Visibility into system state | Logs, metrics, traces |

### 10.2. Scalability Dimensions

#### 10.2.1. Vertical Scaling (Scale Up)

- Add more CPU, RAM, or storage to existing machines
- **Pros:** Simpler, no code changes needed
- **Cons:** Hardware limits, single point of failure, expensive at scale

#### 10.2.2. Horizontal Scaling (Scale Out)

- Add more machines to the pool
- **Pros:** Near-unlimited scale, fault tolerance
- **Cons:** More complex (load balancing, data partitioning, session management)

### 10.3. CAP Theorem

The **CAP theorem** states that a distributed system can only guarantee **two out of three** properties simultaneously.

| Property | Description |
|---|---|
| **Consistency (C)** | All nodes return the same data at any point in time. Every read receives the most recent write. |
| **Availability (A)** | Every request receives a response, even if it is not the most recent data. |
| **Partition Tolerance (P)** | The system continues to operate despite network partitions (messages lost between nodes). |

> **Key insight:** Network partitions are inevitable in distributed systems. Therefore, you must choose between **CP** (Consistency + Partition Tolerance) or **AP** (Availability + Partition Tolerance).

#### 10.3.1. CP vs. AP in Practice

| System Type | Priority | Rationale |
|---|---|---|
| **Banks / Financial systems** | CP | Consistency is critical — wrong balance could cause financial loss |
| **Social media feeds** | AP | Availability matters — users want to see content even if slightly stale |
| **E-commerce inventory** | CP (usually) | Prevent overselling products |
| **CDN / DNS** | AP | Always serve cached content, even if slightly outdated |

### 10.4. Consistency Models

| Model | Description | Example Systems |
|---|---|---|
| **Strong Consistency** | All reads see most recent write | Traditional RDBMS, Zookeeper |
| **Eventual Consistency** | Writes propagate asynchronously; reads may see stale data temporarily | DynamoDB, Cassandra |
| **Causal Consistency** | Respects causality — if A causes B, B sees A's effects | Some NoSQL databases |
| **Read-your-Writes** | A client always sees its own writes | Session guarantees |

### 10.5. PACELC Model

An extension of CAP — even when there is **no partition**, you must choose between **Latency (L)** and **Consistency (C)**:

> **P**artition + **A**vailability + **C**onsistency
> **E**lse → **L**atency + **C**onsistency

| System | PACELC |
|---|---|
| DynamoDB (writes) | PA/EC |
| Cassandra | PA/EC |
| Bigtable / HBase | PC/EC |
| MongoDB | PA/EC (configurable) |

### 10.6. Common Trade-offs

| Trade-off | Consideration |
|---|---|
| **Consistency vs. Latency** | Strong consistency requires coordination (slower). Async replication is faster but eventual. |
| **Read vs. Write performance** | Optimizing for reads (more caching) can hurt write performance and vice versa |
| **Normalization vs. Denormalization** | Normalized data (no redundancy) is easier to update. Denormalized (redundant) is faster to read. |
| **Monolith vs. Microservices** | Simplicity vs. scalability |
| **Sync vs. Async** | Simpler with sync. More resilient with async (but more complex) |

### 10.7. SLA (Service Level Agreement)

| Availability | Downtime per Year | Downtime per Month | Downtime per Week |
|---|---|---|---|
| 99% | 3.65 days | 7.31 hours | 1.68 hours |
| 99.9% | 8.76 hours | 43.83 minutes | 10.08 minutes |
| 99.99% | 52.60 minutes | 4.38 minutes | 1.01 minutes |
| 99.999% | 5.26 minutes | 26.30 seconds | 6.05 seconds |

> **Tip:** When designing a system, always clarify requirements with the interviewer. Ask: "What are the expected QPS? How many users? What latency is acceptable? What is the most critical non-functional requirement?"
