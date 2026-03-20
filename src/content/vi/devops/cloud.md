# DevOps - Cloud Computing

## 1. Service Models

| Model | Mô tả | Ví dụ | Bạn quản lý | Provider quản lý |
|-------|-------|-------|-------------|-------------------|
| **IaaS** | Virtual machines, storage, networks | AWS EC2, GCP Compute Engine, Azure VMs | OS trở lên | Hardware, virtualization layer |
| **PaaS** | Platform để run applications | Elastic Beanstalk, App Engine, Heroku, Azure App Service | Code + Config | Runtime, OS, Infrastructure |
| **SaaS** | Ready-to-use applications | Gmail, Salesforce, Slack, Office 365 | Data + Config | Mọi thứ |

> **Tip:** IaaS cho **flexibility** cao nhất, PaaS cho **developer productivity**, SaaS cho **simplicity**.

---

## 2. Cloud Providers Overview

### 2.1. AWS (Amazon Web Services)

**Largest market share**, broadest service coverage. Hơn 200+ services.

### 2.2. Google Cloud Platform (GCP)

**Strengths:** Data analytics (BigQuery), ML/AI (Vertex AI), Kubernetes (GKE origin), Big Data processing.

### 2.3. Microsoft Azure

**Strengths:** Enterprise integration (Active Directory, Office 365), Windows workloads, hybrid cloud (Azure Arc), .NET ecosystem.

---

## 3. AWS Core Services

### 3.1. Compute

| Service | Mô tả | Use case |
|---------|-------|----------|
| **EC2** | Virtual servers (instances) | General-purpose workloads |
| **EC2 Auto Scaling** | Tự động scale instances | Dynamic workloads |
| **Lambda** | Serverless functions (FaaS) | Event-driven, burst workloads |
| **ECS** | Docker container orchestration | Containers on AWS |
| **EKS** | Managed Kubernetes | Production K8s workloads |
| **Fargate** | Serverless compute for containers | Container workloads without managing servers |
| **Lightsail** | Simple VPS | Simple projects, beginners |
| **Batch** | Batch computing | Scheduled jobs, ETL |

### 3.2. Storage

| Service | Loại | Mô tả |
|---------|------|-------|
| **S3** | Object | Unlimited object storage, 11 9's durability (99.999999999%) |
| **EBS** | Block | Block storage gắn vào EC2 (single AZ) |
| **EFS** | File | Managed NFS for EC2 (multi-AZ) |
| **FSx** | File | Managed file systems (Windows FS, Lustre) |
| **S3 Glacier** | Archive | Cheap archival storage (minutes to hours retrieval) |
| **S3 Glacier Deep Archive** | Archive | Lowest cost archive (12+ hours retrieval) |

### 3.3. Database

| Service | Loại | Mô tả |
|---------|------|-------|
| **RDS** | Relational | MySQL, PostgreSQL, Oracle, SQL Server, MariaDB (managed) |
| **Aurora** | Relational | MySQL/PostgreSQL-compatible, auto-scaling storage, multi-AZ |
| **DynamoDB** | NoSQL (key-value, document) | Serverless, single-digit latency, provisioned or on-demand |
| **ElastiCache** | In-memory | Redis, Memcached |
| **DocumentDB** | NoSQL (MongoDB-compatible) | JSON document storage |
| **Neptune** | Graph | Social networks, fraud detection |
| **Redshift** | Data Warehouse | Analytics, BI, petabyte scale |
| **Keyspaces** | Wide-column (Cassandra) | Time-series, IoT |
| **Timestream** | Time-series | IoT applications |
| **QLDB** | Ledger | Immutable, cryptographically verifiable transactions |

### 3.4. Networking

| Service | Mô tả | Use case |
|---------|-------|----------|
| **VPC** | Virtual Private Cloud — isolated virtual network | Isolated networks |
| **Route 53** | DNS service | Domain management, health checks |
| **CloudFront** | CDN (Content Delivery Network) | Global content delivery, edge locations |
| **API Gateway** | Managed API service | Serverless APIs, REST/WebSocket |
| **ELB (ALB/NLB/CLB)** | Elastic Load Balancer | Distribute traffic across targets |
| **Direct Connect** | Dedicated network connection | On-premise to AWS (consistent latency) |
| **VPN** | Virtual Private Network | Secure on-premise connectivity |
| **PrivateLink** | Private connectivity to AWS services | Access services without internet |
| **Global Accelerator** | Improve availability and performance | Global traffic routing |

### 3.5. Security & Identity

| Service | Mô tả |
|---------|-------|
| **IAM** | Identity and Access Management — users, roles, policies |
| **Cognito** | User authentication & authorization |
| **Secrets Manager** | Secure storage cho secrets (rotated automatically) |
| **KMS** | Key Management Service — encryption keys |
| **Security Hub** | Centralized security view |
| **WAF** | Web Application Firewall |
| **Shield** | DDoS protection (Standard: free, Advanced: paid) |
| **GuardDuty** | Threat detection (Malware, crypto-mining) |
| **Macie** | Data security and privacy (S3 data discovery) |

### 3.6. Developer Tools

| Service | Mô tả |
|---------|-------|
| **CodeCommit** | Git repositories (private) |
| **CodeBuild** | Build and test service |
| **CodeDeploy** | Deployment automation |
| **CodePipeline** | CI/CD pipeline orchestration |
| **CodeStar** | Full CI/CD project templates |
| **X-Ray** | Distributed tracing |
| **CloudWatch** | Monitoring và logging |
| **CloudTrail** | API activity audit |
| **CodeArtifact** | Managed artifact repository |

### 3.7. Serverless

| Service | Mô tả |
|---------|-------|
| **Lambda** | Functions as a Service |
| **API Gateway** | Serverless APIs |
| **DynamoDB** | Serverless NoSQL |
| **S3** | Serverless object storage |
| **Step Functions** | Serverless workflow/orchestration (state machines) |
| **EventBridge** | Serverless event bus (event-driven architecture) |
| **App Runner** | Containerized apps without infra management |
| **SQS** | Message queue (fully managed) |
| **SNS** | Pub/sub messaging |
| **SES** | Email sending service |

---

## 4. GCP Core Services

### 4.1. Compute

| Service | Mô tả | AWS equivalent |
|---------|-------|----------------|
| **Compute Engine** | VMs | EC2 |
| **GKE (Google Kubernetes Engine)** | Managed Kubernetes | EKS |
| **Cloud Run** | Serverless containers (stateless) | ECS Fargate |
| **App Engine** | PaaS | Elastic Beanstalk, App Service |
| **Cloud Functions** | Serverless functions (1st gen) | Lambda |
| **Cloud Functions v2** | Serverless functions (2nd gen, Eventarc) | Lambda |
| **Anthos** | Hybrid/multi-cloud K8s | - |

### 4.2. Storage & Database

| Service | Loại | Mô tả |
|---------|------|-------|
| **Cloud Storage** | Object | Tương đương S3 |
| **Persistent Disk** | Block | Tương đương EBS |
| **Filestore** | File | Managed NFS |
| **Cloud SQL** | Relational | MySQL, PostgreSQL, SQL Server |
| **Spanner** | Relational globally distributed | Strong consistency, horizontal scale |
| **Firestore** | NoSQL document | Real-time sync, mobile/web |
| **Bigtable** | NoSQL wide-column | IoT, analytics |
| **BigQuery** | Data Warehouse | Serverless, petabyte scale |
| **Memorystore** | In-memory | Redis, Memcached |
| **Datastore** | NoSQL | Legacy Firestore mode |

### 4.3. Networking

| Service | Mô tả |
|---------|-------|
| **VPC Network** | Virtual network |
| **Cloud DNS** | DNS service |
| **Cloud CDN** | CDN |
| **Cloud Load Balancing** | Global load balancing |
| **Cloud Armor** | WAF & DDoS protection |
| **Apigee** | API management (full lifecycle) |
| **Artifact Registry** | Container & artifact registry |
| **Network Intelligence Center** | Network monitoring and diagnostics |

---

## 5. Azure Core Services

### 5.1. Compute

| Service | Mô tả | AWS equivalent |
|---------|-------|----------------|
| **Virtual Machines** | VMs | EC2 |
| **Virtual Machine Scale Sets** | Auto-scaling VMs | Auto Scaling Group |
| **Azure Kubernetes Service (AKS)** | Managed Kubernetes | EKS/GKE |
| **Azure Container Instances (ACI)** | Serverless containers | Lambda (container) |
| **Azure Functions** | Serverless functions | Lambda |
| **Azure App Service** | PaaS cho web apps | Elastic Beanstalk |
| **Azure Spring Apps** | Managed Spring Boot | - |
| **Azure Red Hat OpenShift** | OpenShift on Azure | - |

### 5.2. Storage & Database

| Service | Mô tả |
|---------|-------|
| **Blob Storage** | Object storage |
| **Azure Files** | Managed NFS/SMB file shares |
| **Azure Disk Storage** | Block storage |
| **Azure SQL** | Managed SQL Server |
| **Azure Database for PostgreSQL/MySQL** | Managed open-source DBs |
| **Cosmos DB** | Multi-model NoSQL globally distributed |
| **Azure Cache for Redis** | In-memory cache |
| **Azure Synapse Analytics** | Data warehouse |

### 5.3. Networking

| Service | Mô tả |
|---------|-------|
| **Virtual Network (VNet)** | Virtual network |
| **Azure DNS** | DNS |
| **Azure CDN** | CDN |
| **Azure Load Balancer** | L4 load balancing |
| **Application Gateway** | L7 load balancing + WAF |
| **VPN Gateway** | Site-to-site VPN |
| **ExpressRoute** | Dedicated private connection |
| **Azure Front Door** | Global load balancing + CDN + WAF |
| **Azure Bastion** | Secure VM access (no public IP) |

---

## 6. Cloud Architecture Patterns

### 6.1. Scalability Patterns

| Pattern | Mô tả |
|---------|-------|
| **Vertical Scaling** | Tăng resource của instance (CPU/RAM) — scale up |
| **Horizontal Scaling** | Thêm instances — scale out |
| **Sharding** | Chia data across multiple databases |
| **Read Replicas** | Scale reads by replicating data |
| **Caching** | Giảm DB load bằng cache (Redis, Memcached) |

### 6.2. Resilience Patterns

| Pattern | Mô tả |
|---------|-------|
| **Redundancy** | Multiple copies của resources |
| **Failover** | Tự động chuyển sang backup |
| **Circuit Breaker** | Ngăn cascade failures (trip khi error rate cao) |
| **Bulkhead** | Cô lập failures — không ảnh hưởng toàn hệ thống |
| **Retry with exponential backoff** | Thử lại failed requests với delay tăng dần |
| **Timeout** | Giới hạn thời gian chờ — tránh blocking vô hạn |

### 6.3. Well-Architected Framework (AWS)

| Pillar | Mô tả |
|--------|-------|
| **Operational Excellence** | Run và monitor systems — automation, feedback |
| **Security** | Protect data & systems — IAM, encryption, compliance |
| **Reliability** | Recover from failures — HA, DR, scaling |
| **Performance Efficiency** | Use resources efficiently — right-sizing, serverless |
| **Cost Optimization** | Avoid unnecessary costs — pay for what you use |
| **Sustainability** | Minimize environmental impact |

---

## 7. Common Interview Questions

### Q: Sự khác biệt giữa S3 Standard, IA, và Glacier?

| Storage Class | Use case | Cost | Retrieval time |
|---------------|----------|------|----------------|
| **S3 Standard** | Frequently accessed data | Highest | Immediate |
| **S3 IA (Infrequent Access)** | Less frequent but needs rapid access | Lower (~54% cheaper) | Milliseconds |
| **S3 Glacier** | Long-term archive | Lowest | Minutes to Hours |
| **S3 Glacier Deep Archive** | Regulatory archive (7-10 years) | Very lowest | 12+ Hours |

### Q: AWS S3 vs EBS vs EFS?

| | S3 | EBS | EFS |
|--|---|-----|-----|
| **Loại** | Object storage | Block storage | File storage |
| **Access** | HTTP(S) API | EC2 attach (single AZ) | EC2 mount (NFS/SMB) |
| **Sharing** | Global | Single EC2 | Multiple EC2 |
| **Durability** | 11 9's (99.999999999%) | AZ-level | Multi-AZ |
| **Use case** | Data lake, backup, static assets | Database, app storage | Shared file system |

### Q: VPC best practices?

1. **Multi-AZ deployment:** Deploy resources across multiple Availability Zones.
2. **Public & Private subnets:** Public for load balancers/NAT, private for app/DB.
3. **Network ACLs + Security Groups:** Layered security (stateless vs stateful).
4. **VPC Endpoints:** Private access to AWS services (S3, DynamoDB) không qua internet.
5. **Bastion host / SSM Session Manager:** Secure SSH/RDP access.
6. **Tight IAM policies:** Principle of least privilege.
7. **Separate VPC per environment:** Dev, staging, production isolation.

### Q: Multi-cloud strategy advantages & challenges?

| | Advantages | Challenges |
|--|------------|------------|
| **Avoid vendor lock-in** | Portability | Complexity |
| **Best-of-breed** | Use best service per task | Integration overhead |
| **Resilience** | Provider redundancy | Data consistency |
| **Cost optimization** | Competitive pricing | Billing complexity |
| **Compliance** | Data residency options | Governance |

### Q: Serverless vs Container?

| Tiêu chí | Serverless | Container |
|----------|------------|-----------|
| **Management** | Không quản lý server | Tự quản lý hoặc managed (EKS/GKE/AKS) |
| **Cold start** | Có thể có latency (Lambda: ~100ms-1s) | Không có |
| **Cost model** | Pay-per-invocation | Pay-per-second (reserved/on-demand) |
| **Execution time** | Limited (Lambda: 15 phút max) | Unlimited |
| **Control** | Ít control (runtime constrained) | Full control |
| **Scalability** | Automatic, fine-grained, instant | Manual or auto (HPA/KEDA) |
| **Best for** | Event-driven, unpredictable traffic | Long-running, consistent workloads |

### Q: DR (Disaster Recovery) strategies?

| Strategy | RPO | RTO | Cost | Complexity |
|----------|-----|-----|------|------------|
| **Backup & Restore** | Hours | Hours | Lowest | Low |
| **Pilot Light** | Minutes | Minutes-Hours | Medium | Medium |
| **Warm Standby** | Seconds-Minutes | Seconds-Minutes | High | High |
| **Multi-Site (Active-Active)** | Near zero | Near zero | Highest | Highest |

> **RPO (Recovery Point Objective):** Maximum acceptable data loss (time).
> **RTO (Recovery Time Objective):** Maximum acceptable downtime.

### Q: Sự khác biệt giữa IAM Role và IAM User?

| | IAM User | IAM Role |
|--|---------|----------|
| **Identity** | Gắn với một person/application cố định | Temporary, assumable by anyone được phép |
| **Credentials** | Static (password, access key) | Temporary security credentials (STS) |
| **Use case** | Human users, applications cố định | Cross-account access, EC2, Lambda |
| **Security** | Rotation cần thiết | Tự động rotate |

### Q: Shared Responsibility Model?

| Bạn chịu trách nhiệm | AWS/Provider chịu trách nhiệm |
|----------------------|------------------------------|
| Data classification | Physical security of data centers |
| IAM & access management | Hardware/software infrastructure |
| Application security | Network infrastructure |
| OS patches (IaaS) | Server maintenance (PaaS/SaaS) |
| Encryption (client-side) | Encryption at rest & transit (managed services) |
