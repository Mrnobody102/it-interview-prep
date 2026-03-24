# System Design

## 8. Production Application Architecture

Một ứng dụng web production điển hình bao gồm nhiều layers, mỗi layer có trách nhiệm cụ thể.

### 8.1. Tổng quan kiến trúc

```mermaid
flowchart TD
    subgraph CL["TẦNG CLIENT"]
        C["Browser / Mobile App"]
    end
    C -->|HTTPS| CDN_EDGE
    subgraph CDN["TẦNG CDN / EDGE"]
        CDN_EDGE["Cloudflare / CloudFront / Fastly"]
    end
    CDN_EDGE --> LB
    subgraph LB_LAYER["TẦNG LOAD BALANCER"]
        LB["Nginx / HAProxy / AWS ALB"]
    end
    LB --> AG1
    LB --> AG2
    AG1["API Gateway (Auth, Rate Limit)"]
    AG2["API Gateway (Backup)"]
    AG1 --> SM
    AG2 --> SM
    subgraph SM["SERVICE MESH / KUBERNETES"]
        A["Service A (Auth)"]
        B["Service B (Users)"]
        C["Service C (Orders)"]
        D["Service D (Search)"]
    end
    A --> MQ
    B --> MQ
    C --> MQ
    D --> MQ
    subgraph MQ_LAYER["TẦNG MESSAGE QUEUE"]
        MQ["Kafka / RabbitMQ"]
    end
    MQ --> DL
    subgraph DL["TẦNG DATA"]
        PG["PostgreSQL (Primary)"]
        MG["MongoDB (Documents)"]
        RD["Redis (Cache)"]
        S3["S3 (Storage)"]
    end
```

---

### 8.2. Frontend Layer

| Concern | Technology |
|---|---|
| **Deployment** | CDN (CloudFront, Cloudflare) |
| **Security** | HTTPS, CSP (Content Security Policy), Subresource Integrity |
| **Performance** | Lazy loading, code splitting, image optimization |
| **State Management** | Redux, Zustand, React Query |

---

### 8.3. Backend Layer

| Component | Description |
|---|---|
| **API Gateway** | Single entry point. Handles routing, authentication, rate limiting, request/response transformation |
| **Services** | Microservices hoặc modular monolith (Spring Boot, Node.js, Go, .NET) |
| **GraphQL Federation** | Cho nhu cầu query phức tạp across services |

---

### 8.4. Database Layer

| Type | Examples | Use Case |
|---|---|---|
| **Relational (RDBMS)** | PostgreSQL, MySQL | Structured data, transactions, complex queries |
| **Document Store** | MongoDB | Flexible schema, JSON documents |
| **Key-Value** | Redis, DynamoDB | Caching, session storage |
| **Time-Series** | InfluxDB, TimescaleDB | Metrics, IoT sensor data |
| **Graph** | Neo4j | Relationships, social networks |
| **Search** | Elasticsearch | Full-text search, log analysis |

#### 8.4.1. Database Best Practices

- **Replication:** Primary-replica setup cho read scaling và failover
- **Sharding:** Horizontal partitioning cho very large datasets
- **Backup:** Regular automated backups với point-in-time recovery
- **Access Control:** Principle of least privilege cho application accounts

---

### 8.5. Caching Layer

| Technology | Use Case |
|---|---|
| **Redis** | Session store, distributed cache, pub/sub, rate limiting |
| **Memcached** | Simple key-value caching |
| **Varnish** | HTTP caching proxy |

---

### 8.6. Message Queue Layer

| Technology | Characteristics |
|---|---|
| **Kafka** | High throughput, persistent, log-based. Event streaming, analytics |
| **RabbitMQ** | Flexible routing, easy setup. Business workflows, task queues |
| **AWS SQS** | Fully managed, simple queue service |
| **ActiveMQ** | Java ecosystem integration |

---

### 8.7. File Storage

| Service | Description |
|---|---|
| **AWS S3** | Object storage cho images, videos, documents |
| **GCS** | Google Cloud Storage |
| **Azure Blob** | Microsoft Azure blob storage |
| **MinIO** | Self-hosted S3-compatible storage |

---

### 8.8. DevOps & CI/CD

| Category | Tools |
|---|---|
| **Containerization** | Docker, containerd |
| **Orchestration** | Kubernetes, Docker Swarm |
| **CI/CD** | GitHub Actions, Jenkins, GitLab CI, ArgoCD |
| **Infrastructure as Code** | Terraform, Pulumi, AWS CDK |
| **Configuration Management** | Helm charts, Kustomize |

---

### 8.9. Monitoring & Logging

| Category | Tools |
|---|---|
| **Metrics** | Prometheus, Datadog |
| **Dashboards** | Grafana |
| **Logging** | ELK Stack (Elasticsearch, Logstash, Kibana), Loki |
| **Distributed Tracing** | Jaeger, Zipkin, OpenTelemetry |
| **Uptime Monitoring** | PagerDuty, UptimeRobot |

---

### 8.10. Security Layer

| Concern | Solution |
|---|---|
| **Transport** | HTTPS (TLS 1.3), HSTS |
| **Authentication** | JWT, OAuth 2.0, OpenID Connect |
| **Authorization** | RBAC, ABAC |
| **Secrets Management** | HashiCorp Vault, AWS Secrets Manager |
| **API Security** | API keys, rate limiting, input validation |
| **DDoS Protection** | Cloudflare, AWS Shield, Akamai |

---

### 8.11. High Availability & Scalability

| Strategy | Description |
|---|---|
| **Load Balancing** | Phân phối traffic (Nginx, HAProxy, AWS ELB) |
| **Auto-scaling** | Horizontal Pod Autoscaler (HPA), AWS ASG |
| **Multi-region** | Deploy across geographic regions cho DR và latency |
| **Circuit Breaker** | Ngăn cascade failures (Resilience4j, Hystrix) |
| **Graceful Degradation** | Giữ core features chạy under load |

> **Tip:** Khi thiết kế production system, luôn bắt đầu với kiến trúc đơn giản nhất đáp ứng được yêu cầu hiện tại. Thêm complexity (caching, message queues, multiple services) chỉ khi có bằng chứng rõ ràng (metrics, user growth).
