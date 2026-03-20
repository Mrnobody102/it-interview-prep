# DevOps — Docker

## 1. Containers vs Virtual Machines

| Aspect | Containers | Virtual Machines |
|--------|-----------|-------------------|
| **Weight** | Lightweight | Heavy |
| **OS** | Share host OS kernel | Full OS per VM |
| **Startup** | Seconds | Minutes |
| **Resource Usage** | Less | More |
| **Isolation** | Process-level | Full hardware-level |

### Key Takeaway

> **Containers** package the application and its dependencies together, while **VMs** virtualize the entire hardware stack. Containers are more efficient and start much faster.

---

## 2. Core Concepts

### 2.1. Image

A **Docker Image** is a read-only template used to create containers. It contains the application code, runtime, libraries, and configuration.

### 2.2. Container

A **Container** is a runnable instance of an image. It is isolated but shares the host OS kernel with other containers.

### 2.3. Dockerfile

A **Dockerfile** is a script that defines how to build a Docker image.

```dockerfile
# syntax=docker/dockerfile:1
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

### 2.4. Docker Compose

A **docker-compose.yml** defines and runs multi-container applications.

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    depends_on:
      - db
  db:
    image: postgres:15
    environment:
      POSTGRES_PASSWORD: secret
```

---

## 3. Basic Commands

### 3.1. Building & Running

```bash
# Build an image from Dockerfile
docker build -t myapp .

# Run a container (interactive)
docker run -it --name my-container myapp

# Run in background with port mapping
docker run -d -p 8080:80 --name my-running-app myapp

# Run with environment variables
docker run -e NODE_ENV=production -p 8080:3000 myapp
```

### 3.2. Container Management

```bash
# List running containers
docker ps

# List all containers (including stopped)
docker ps -a

# Stop a container
docker stop <container_id>

# Start a stopped container
docker start <container_id>

# Remove a container
docker rm <container_id>

# Remove a running container (force)
docker rm -f <container_id>
```

### 3.3. Image Management

```bash
# List local images
docker images

# Remove an image
docker rmi <image_id>

# Pull an image from Docker Hub
docker pull nginx:latest
```

### 3.4. Debugging

```bash
# View container logs
docker logs <container_id>

# Follow logs in real-time
docker logs -f <container_id>

# Execute a command inside a running container
docker exec -it <container_id> bash

# Inspect container details
docker inspect <container_id>

# Check resource usage
docker stats
```

---

## 4. Common Patterns

### 4.1. Multi-stage Build

Reduce image size by using a slim build stage.

```dockerfile
# Build stage
FROM node:20 AS builder
WORKDIR /app
COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
CMD ["node", "dist/index.js"]
```

### 4.2. Docker Networking

```bash
# Create a network
docker network create my-network

# Run container in network
docker run --network my-network --name app myapp

# Containers in same network can communicate by name
```

---

## 5. Interview Questions

**Q: What is the difference between `COPY` and `ADD` in Dockerfile?**

> `COPY` is preferred — it is simpler and more transparent. `ADD` has additional features (tar extraction, URL support) that are rarely needed and can lead to unexpected behavior.

**Q: What is the difference between `ENTRYPOINT` and `CMD`?**

> `CMD` provides default arguments that can be overridden at runtime. `ENTRYPOINT` configures the container to run as an executable. Both can be used together — `CMD` passes arguments to `ENTRYPOINT`.

**Q: How do you reduce Docker image size?**

- Use slim/alpine base images
- Use multi-stage builds
- Minimize the number of layers (combine RUN commands)
- Copy only necessary files (use `.dockerignore`)
- Remove package manager caches

**Q: What is a volume mount?**

> A volume mounts a directory from the host or a named volume into the container, persisting data beyond the container's lifecycle. Essential for databases and development hot-reload.
