# DevOps — Cloud Computing

## 1. Cloud Service Models

| Model | What You Manage | What Cloud Provides | Examples |
|-------|---------------|-------------------|----------|
| **IaaS** | Applications, data, runtime, middleware | Virtual machines, storage, networking | AWS EC2, GCP Compute Engine, Azure VMs |
| **PaaS** | Applications, data | Runtime, middleware, OS, virtualization | Heroku, Elastic Beanstalk, Google App Engine |
| **SaaS** | Nothing (almost) | Everything | Gmail, Salesforce, Slack, Microsoft 365 |

> **IaaS** gives the most control. **SaaS** gives the least. **PaaS** balances control with convenience.

---

## 2. AWS Core Services

### 2.1. Compute

| Service | Description |
|---------|-------------|
| **EC2** | Resizable virtual servers in the cloud |
| **Lambda** | Serverless functions — pay only for execution time |
| **ECS / EKS** | Container orchestration (EC2 or Fargate) |
| **Lightsail** | Simple virtual private servers |
| **Elastic Beanstalk** | PaaS for deploying applications |

### 2.2. Storage

| Service | Description |
|---------|-------------|
| **S3** | Object storage — highly durable, scalable |
| **EBS** | Block storage attached to EC2 |
| **EFS** | Managed NFS file storage |
| **Glacier** | Low-cost archival storage |

### 2.3. Database

| Service | Type | Use Case |
|---------|------|---------|
| **RDS** | Relational (MySQL, PostgreSQL, Oracle, MariaDB) | Managed relational databases |
| **DynamoDB** | NoSQL (document, key-value) | High-throughput, low-latency apps |
| **Aurora** | Relational (MySQL/PostgreSQL compatible) | Enterprise-grade, auto-scaling |
| **ElastiCache** | In-memory (Redis, Memcached) | Caching, session storage |
| **Redshift** | Data warehouse | Analytics and BI |

### 2.4. Networking

| Service | Description |
|---------|-------------|
| **VPC** | Virtual Private Cloud — isolated network |
| **CloudFront** | Content Delivery Network (CDN) |
| **Route 53** | Managed DNS service |
| **ELB** | Elastic Load Balancing |
| **API Gateway** | Managed API hosting |

---

## 3. AWS Identity & Access Management (IAM)

### 3.1. Key Concepts

| Concept | Description |
|---------|-------------|
| **IAM User** | Individual identity for applications/users |
| **IAM Role** | Identity with temporary credentials |
| **IAM Policy** | JSON document defining permissions |
| **IAM Group** | Collection of users with shared permissions |

### 3.2. Best Practices

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:GetObject", "s3:PutObject"],
      "Resource": "arn:aws:s3:::my-bucket/*"
    }
  ]
}
```

- **Principle of least privilege** — grant only the minimum permissions needed
- **Never use root account** for daily tasks
- **Enable MFA** on all accounts
- **Rotate credentials** regularly

---

## 4. Serverless Architecture

### 4.1. What is Serverless?

> **Serverless** means you don't manage servers — the cloud provider handles provisioning, scaling, and server management. You only write the application code.

### 4.2. Serverless vs Traditional

| Aspect | Traditional | Serverless |
|--------|------------|------------|
| Server management | You manage | Cloud provider manages |
| Scaling | Manual or configured | Automatic |
| Cost | Pay for always-on instances | Pay per invocation |
| Cold start | N/A | Latency on first invocation |
| Best for | Consistent traffic | Variable, event-driven workloads |

### 4.3. Serverless Services by Provider

| Provider | Compute | Database | Storage | API |
|----------|---------|----------|---------|-----|
| **AWS** | Lambda | DynamoDB | S3 | API Gateway |
| **Azure** | Azure Functions | Cosmos DB | Blob Storage | API Management |
| **GCP** | Cloud Functions | Firestore | Cloud Storage | Cloud Endpoints |

---

## 5. Cloud Networking

### 5.1. VPC (Virtual Private Cloud)

```
Internet Gateway
       |
  Route Table
       |
 +-----+-----+-------+
 |     |     |       |
 Public  Public  Private Subnet
 Subnet Subnet    (no direct internet)
```

### 5.2. CIDR Notation

```bash
# CIDR block examples
10.0.0.0/16     # 65,536 IP addresses (10.0.x.x)
10.0.0.0/24     # 256 IP addresses (10.0.0.x)
192.168.1.0/24  # 256 IP addresses
```

### 5.3. Security Groups vs NACLs

| | Security Groups | Network ACLs (NACLs) |
|--|----------------|----------------------|
| Scope | Instance level | Subnet level |
| Type | Stateful | Stateless |
| Evaluation | All rules evaluated | Rules processed in order |
| Use | Instance-level firewall | Subnet-level firewall |

---

## 6. Cloud Cost Optimization

| Strategy | Description |
|----------|-------------|
| **Right-sizing** | Match instance sizes to actual needs |
| **Reserved instances** | Commit to 1-3 years for discounts |
| **Spot instances** | Use spare capacity at 70-90% discount |
| **Auto-scaling** | Scale in/out based on demand |
| **Lifecycle policies** | Move old data to cheaper storage tiers |
| **Use managed services** | Reduces operational overhead |

---

## 7. Interview Questions

**Q: What is the difference between scaling vertically and horizontally?**

> **Vertical scaling (scale-up)** means adding more resources (CPU, RAM) to an existing machine. **Horizontal scaling (scale-out)** means adding more machines to handle the load. Horizontal is generally preferred in cloud environments because it offers better fault tolerance.

**Q: Explain the shared responsibility model.**

> The **cloud provider** is responsible for security **of** the cloud (infrastructure, hardware, network). The **customer** is responsible for security **in** the cloud (data, access, application configuration, operating system patches for IaaS).

**Q: What is a CDN and why use it?**

> A **CDN (Content Delivery Network)** caches content at edge locations closer to users, reducing latency, improving load times, and reducing origin server load. CloudFront, Cloudflare, and Akamai are popular CDN providers.

**Q: How do you ensure high availability in the cloud?**

> Deploy across **multiple availability zones (AZs)** within a region. Use **load balancers** to distribute traffic. Implement **auto-scaling** groups. For global high availability, deploy across **multiple regions**. Use managed services with built-in redundancy.
