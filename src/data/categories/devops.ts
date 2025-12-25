import { Category } from "./types";

export const devops: Category = {
  id: "devops",
  name: { vi: "DevOps & Cloud", en: "DevOps & Cloud" },
  description: {
    vi: "Backend hiện đại gần như bắt buộc",
    en: "Almost mandatory for modern backend",
  },
  icon: "☁️",
  topics: [
    {
      id: "linux",
      name: { vi: "Linux", en: "Linux" },
      content: {
        vi: `# Linux Basics

## Essential Commands

### File Operations
\`\`\`bash
ls -la          # List files
cd /path        # Change directory
cp src dest     # Copy
mv src dest     # Move/Rename
rm file         # Remove
mkdir dir       # Create directory
\`\`\`

### File Viewing
\`\`\`bash
cat file        # Display content
less file       # Page through
head -n 10 file # First 10 lines
tail -f file    # Follow file (logs)
\`\`\`

### Search & Filter
\`\`\`bash
grep "pattern" file
find /path -name "*.log"
\`\`\`

### Process Management
\`\`\`bash
ps aux          # List processes
top/htop        # Monitor processes
kill PID        # Kill process
\`\`\`

### Permissions
\`\`\`bash
chmod 755 file  # Change permissions
chown user:group file
\`\`\`

### Networking
\`\`\`bash
curl URL
wget URL
netstat -tulpn
\`\`\``,
        en: `# Linux Basics

## Essential Commands

### File Operations
\`\`\`bash
ls -la          # List files
cd /path        # Change directory
cp src dest     # Copy
mv src dest     # Move/Rename
rm file         # Remove
mkdir dir       # Create directory
\`\`\`

### File Viewing
\`\`\`bash
cat file        # Display content
less file       # Page through
head -n 10 file # First 10 lines
tail -f file    # Follow file (logs)
\`\`\`

### Search & Filter
\`\`\`bash
grep "pattern" file
find /path -name "*.log"
\`\`\`

### Process Management
\`\`\`bash
ps aux          # List processes
top/htop        # Monitor processes
kill PID        # Kill process
\`\`\`

### Permissions
\`\`\`bash
chmod 755 file  # Change permissions
chown user:group file
\`\`\`

### Networking
\`\`\`bash
curl URL
wget URL
netstat -tulpn
\`\`\``,
      },
    },
    {
      id: "docker",
      name: { vi: "Docker", en: "Docker" },
      content: {
        vi: `# Docker

## What is Docker?
Platform để package applications vào containers

## Containers vs VMs

### Containers
- Lightweight
- Share host OS kernel
- Seconds to start
- Less resource usage

### VMs
- Heavy
- Full OS per VM
- Minutes to start
- More resource usage

## Docker Components

### Image
Template to create containers

### Container
Running instance of image

### Dockerfile
Script to build image

### Docker Hub
Registry for images

## Basic Commands

\`\`\`bash
docker build -t myapp .
docker run -p 8080:80 myapp
docker ps               # List running containers
docker stop <id>
docker logs <id>
docker exec -it <id> bash
\`\`\`

## Dockerfile Example

\`\`\`dockerfile
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
\`\`\``,
        en: `# Docker

## What is Docker?
Platform to package applications into containers

## Containers vs VMs

### Containers
- Lightweight
- Share host OS kernel
- Seconds to start
- Less resource usage

### VMs
- Heavy
- Full OS per VM
- Minutes to start
- More resource usage

## Docker Components

### Image
Template to create containers

### Container
Running instance of image

### Dockerfile
Script to build image

### Docker Hub
Registry for images

## Basic Commands

\`\`\`bash
docker build -t myapp .
docker run -p 8080:80 myapp
docker ps               # List running containers
docker stop <id>
docker logs <id>
docker exec -it <id> bash
\`\`\`

## Dockerfile Example

\`\`\`dockerfile
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
\`\`\``,
      },
    },
    {
      id: "kubernetes",
      name: { vi: "Kubernetes", en: "Kubernetes" },
      content: {
        vi: `# Kubernetes (K8s)

## What is Kubernetes?
Container orchestration platform - quản lý deploy, scale, và manage containerized applications

## Key Concepts

### Pod
Smallest deployable unit, chứa 1+ containers

### Deployment
Manage desired state of Pods

### Service
Expose Pods to network

### Namespace
Virtual clusters trong cluster

### ConfigMap & Secret
Configuration và sensitive data

### Ingress
HTTP/HTTPS routing to services

## Why Kubernetes?

- Auto-scaling
- Self-healing (restart failed containers)
- Load balancing
- Rolling updates
- Service discovery

## Basic Commands

\`\`\`bash
kubectl get pods
kubectl get services
kubectl apply -f deployment.yaml
kubectl scale deployment myapp --replicas=5
kubectl logs <pod-name>
\`\`\`

## Popular Managed K8s
- AWS EKS
- Google GKE
- Azure AKS`,
        en: `# Kubernetes (K8s)

## What is Kubernetes?
Container orchestration platform - manages deploy, scale, and manage containerized applications

## Key Concepts

### Pod
Smallest deployable unit, contains 1+ containers

### Deployment
Manages desired state of Pods

### Service
Exposes Pods to network

### Namespace
Virtual clusters within cluster

### ConfigMap & Secret
Configuration and sensitive data

### Ingress
HTTP/HTTPS routing to services

## Why Kubernetes?

- Auto-scaling
- Self-healing (restart failed containers)
- Load balancing
- Rolling updates
- Service discovery

## Basic Commands

\`\`\`bash
kubectl get pods
kubectl get services
kubectl apply -f deployment.yaml
kubectl scale deployment myapp --replicas=5
kubectl logs <pod-name>
\`\`\`

## Popular Managed K8s
- AWS EKS
- Google GKE
- Azure AKS`,
      },
    },
    {
      id: "cicd",
      name: { vi: "CI/CD", en: "CI/CD" },
      content: {
        vi: `# CI/CD

## Continuous Integration (CI)

### What?
Automatically build và test code mỗi khi commit

### Benefits
- Early bug detection
- Reduce integration issues
- Faster feedback

### Tools
- Jenkins
- GitLab CI
- GitHub Actions
- CircleCI

## Continuous Deployment/Delivery (CD)

### Continuous Delivery
Code luôn sẵn sàng deploy (manual trigger)

### Continuous Deployment
Tự động deploy to production sau khi pass tests

### Benefits
- Faster releases
- Smaller, safer changes
- Automated rollback

## Typical Pipeline

1. **Commit** → Push code
2. **Build** → Compile, bundle
3. **Test** → Unit, integration tests
4. **Deploy to Staging** → Test environment
5. **Deploy to Production** → Live environment

## Best Practices
- Keep builds fast
- Test early and often
- Automate everything
- Monitor deployments`,
        en: `# CI/CD

## Continuous Integration (CI)

### What?
Automatically build and test code on every commit

### Benefits
- Early bug detection
- Reduce integration issues
- Faster feedback

### Tools
- Jenkins
- GitLab CI
- GitHub Actions
- CircleCI

## Continuous Deployment/Delivery (CD)

### Continuous Delivery
Code always ready to deploy (manual trigger)

### Continuous Deployment
Automatically deploy to production after passing tests

### Benefits
- Faster releases
- Smaller, safer changes
- Automated rollback

## Typical Pipeline

1. **Commit** → Push code
2. **Build** → Compile, bundle
3. **Test** → Unit, integration tests
4. **Deploy to Staging** → Test environment
5. **Deploy to Production** → Live environment

## Best Practices
- Keep builds fast
- Test early and often
- Automate everything
- Monitor deployments`,
      },
    },
    {
      id: "cloud",
      name: {
        vi: "Cloud (AWS / GCP / Azure)",
        en: "Cloud (AWS / GCP / Azure)",
      },
      content: {
        vi: `# Cloud Computing

## Service Models

### IaaS (Infrastructure as a Service)
- Virtual machines, storage, networks
- Examples: AWS EC2, Google Compute Engine

### PaaS (Platform as a Service)
- Platform để run applications
- Examples: AWS Elastic Beanstalk, Google App Engine, Heroku

### SaaS (Software as a Service)
- Ready-to-use applications
- Examples: Gmail, Salesforce

## AWS Common Services

### Compute
- **EC2:** Virtual servers
- **Lambda:** Serverless functions
- **ECS/EKS:** Container orchestration

### Storage
- **S3:** Object storage
- **EBS:** Block storage for EC2

### Database
- **RDS:** Relational databases
- **DynamoDB:** NoSQL

### Networking
- **VPC:** Virtual network
- **CloudFront:** CDN
- **Route 53:** DNS

## Benefits
- Scalability
- Pay-as-you-go
- Global reach
- Managed services`,
        en: `# Cloud Computing

## Service Models

### IaaS (Infrastructure as a Service)
- Virtual machines, storage, networks
- Examples: AWS EC2, Google Compute Engine

### PaaS (Platform as a Service)
- Platform to run applications
- Examples: AWS Elastic Beanstalk, Google App Engine, Heroku

### SaaS (Software as a Service)
- Ready-to-use applications
- Examples: Gmail, Salesforce

## AWS Common Services

### Compute
- **EC2:** Virtual servers
- **Lambda:** Serverless functions
- **ECS/EKS:** Container orchestration

### Storage
- **S3:** Object storage
- **EBS:** Block storage for EC2

### Database
- **RDS:** Relational databases
- **DynamoDB:** NoSQL

### Networking
- **VPC:** Virtual network
- **CloudFront:** CDN
- **Route 53:** DNS

## Benefits
- Scalability
- Pay-as-you-go
- Global reach
- Managed services`,
      },
    },
  ],
};
