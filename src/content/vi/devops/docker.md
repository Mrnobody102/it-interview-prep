# DevOps - Docker

## 1. Containers vs Virtual Machines

**Container** và **Virtual Machine (VM)** đều là công nghệ ảo hóa, nhưng hoạt động theo cách khác nhau.

| Tiêu chí | Container | Virtual Machine |
|----------|-----------|-----------------|
| **Trọng lượng** | Nhẹ, shared host OS kernel | Nặng, full OS riêng mỗi VM |
| **Khởi động** | Vài giây | Vài phút |
| **Tài nguyên** | Ít tốn (MB) | Nhiều tốn (GB) |
| **Cô lập** | Process-level | Full isolation (hardware-level) |
| **Portability** | Cao — chạy được mọi nơi có container runtime | Thấp hơn, phụ thuộc hypervisor |
| **Performance** | Gần native | Overhead từ virtualization |

> **Tip:** Containers lý tưởng cho **microservices**, còn VM phù hợp cho workload cần **isolation cao** hoặc chạy full OS khác host.

---

## 2. Kiến trúc Docker

### 2.1. Các thành phần chính

| Thành phần | Mô tả |
|------------|-------|
| **Image** | Template **chỉ đọc** để tạo container. Bao gồm code, runtime, dependencies. |
| **Container** | Instance **chạy được** từ image. Có thể start, stop, delete. |
| **Dockerfile** | Script định nghĩa cách **build** image. |
| **Registry** | Kho lưu trữ images. Ví dụ: **Docker Hub**, **ECR**, **GCR**, **Quay**. |
| **Volume** | Cơ chế **persist data** ngoài container lifecycle. |
| **Network** | Cho phép containers giao tiếp với nhau và bên ngoài. |
| **Docker Daemon** | Service chạy nền (`dockerd`), quản lý containers, images, networks. |

### 2.2. Docker vs Podman

| Tiêu chí | Docker | Podman |
|----------|--------|--------|
| **Daemon** | Cần `dockerd` chạy nền | Không daemon (**daemonless**) |
| **Root** | Thường cần root privilege | Có thể chạy **rootless** |
| **Security** | Single point of failure | Tốt hơn (no daemon = no daemon exploit) |
| **OCI Support** | Có | Có |
| **Commands** | `docker` CLI | `podman` CLI (tương thích docker) |
| **Build** | Tích hợp sẵn | Cần `buildah` riêng |

---

## 3. Basic Commands

### 3.1. Build & Run

```bash
# Build image từ Dockerfile
docker build -t myapp:latest .

# Chạy container (detached, port mapping)
docker run -d -p 8080:80 --name mycontainer myapp:latest

# Chạy container với biến môi trường và volume
docker run -d -p 8080:80 \
  -e NODE_ENV=production \
  -e DATABASE_URL=postgres://db:5432/myapp \
  -v $(pwd)/data:/app/data \
  --name mycontainer myapp:latest

# Chạy container tương tác
docker run -it --rm ubuntu:22.04 /bin/bash

# Override CMD trong Dockerfile
docker run myapp:latest npm start
```

### 3.2. Container Management

```bash
docker ps                        # Liệt kê containers đang chạy
docker ps -a                     # Liệt kê tất cả containers (kể cả đã dừng)
docker ps -l                     # Container cuối được tạo
docker ps -q                     # Chỉ hiển thị container IDs

docker stop <container_id>       # Dừng container gracefully (SIGTERM)
docker start <container_id>      # Khởi động lại container đã dừng
docker restart <container_id>    # Restart container
docker kill <container_id>       # Force kill container (SIGKILL)

docker rm <container_id>         # Xóa container (phải stop trước)
docker rm -f <container_id>      # Force remove (stop + remove)
docker rm $(docker ps -aq)       # Xóa tất cả containers

docker logs <container_id>        # Xem logs
docker logs -f <container_id>     # Follow logs real-time
docker logs --tail 100 <id>      # 100 dòng cuối logs
docker logs --since 10m <id>     # Logs trong 10 phút gần

docker exec -it <id> /bin/sh     # Vào shell bên trong container
docker exec <id> cat /etc/os-release  # Chạy command bên trong container

docker inspect <container_id>    # Chi tiết container (JSON)
docker stats                      # Real-time resource usage
docker top <container_id>        # Running processes trong container
docker diff <container_id>       # Xem thay đổi filesystem
```

### 3.3. Image Management

```bash
docker images                    # Liệt kê images local
docker images -a                 # Bao gồm intermediate layers
docker image ls                  # Cú pháp mới (Docker CLI 1.13+)

docker rmi <image_id>            # Xóa image
docker rmi $(docker images -q)   # Xóa tất cả images
docker image prune               # Xóa dangling images

docker pull nginx:1.25-alpine    # Pull image từ registry
docker tag myapp:latest myapp:v1  # Đặt tag cho image
docker push myregistry.com/myapp:v1  # Push lên registry

docker history <image>           # Xem layers của image
docker image inspect <image>     # Chi tiết image

docker system df                 # Xem disk usage
docker system prune -a           # Dọn dẹp tất cả unused resources
docker system prune -a --volumes # Dọn cả volumes
docker builder prune            # Dọn build cache
```

---

## 4. Dockerfile Best Practices

### 4.1. Multi-stage Build

```dockerfile
# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app

# Cache dependency installation
COPY package*.json ./
RUN npm ci --only=production

# Copy source và build
COPY . .
RUN npm run build

# Stage 2: Production
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1
CMD ["nginx", "-g", "daemon off;"]
```

### 4.2. Essential Best Practices

> **Nguyên tắc quan trọng:**
> - Luôn `COPY package*.json` **trước** `COPY .` để tận dụng **Docker cache**.
> - Dùng **`.dockerignore`** để loại trừ `node_modules`, `.git`, `dist`, các file không cần thiết.
> - Sử dụng **multi-stage build** để giảm kích thước image cuối cùng.
> - Không chạy container với **root user** — tạo user riêng.
> - **Không hardcode secrets** trong Dockerfile — dùng `ARG` và `ENV` hợp lý.
> - Dùng **specific tags** (`node:20-alpine`) thay vì `node:latest`.
> - Mỗi `RUN` command nên là một **logical step**.
> - **Gộp layers** bằng `&&` để giảm số lượng layers.

### 4.3. Non-root User

```dockerfile
FROM node:20-alpine

# Tạo non-root user
RUN addgroup -g 1001 appgroup && adduser -u 1001 -G appgroup -s /bin/sh -D appuser

WORKDIR /app
COPY --chown=appuser:appgroup . .

USER appuser
CMD ["node", "server.js"]
```

### 4.4. .dockerignore

```bash
# .dockerignore
node_modules
npm-debug.log
.git
.gitignore
.env
.env.*
README.md
dist
coverage
.vscode
.idea
*.md
```

---

## 5. Docker Compose

### 5.1. Cú pháp cơ bản

```yaml
version: '3.8'

services:
  web:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "8080:80"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgres://admin:secret@db:5432/myapp
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_started
    networks:
      - app-network
    volumes:
      - ./src:/app/src:ro
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost/"]
      interval: 30s
      timeout: 10s
      retries: 3
    restart: unless-stopped

  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: myapp
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: secret
    volumes:
      - db-data:/var/lib/postgresql/data
    networks:
      - app-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U admin -d myapp"]
      interval: 10s
      timeout: 5s
      retries: 5
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    networks:
      - app-network
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    depends_on:
      - web
    networks:
      - app-network
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro

volumes:
  db-data:

networks:
  app-network:
    driver: bridge
```

### 5.2. Common Commands

```bash
docker compose up -d              # Khởi động tất cả services (detached)
docker compose up -d --build      # Build lại images trước khi start
docker compose down               # Dừng và xóa containers, networks
docker compose down -v            # Dừng + xóa containers + volumes
docker compose down --rmi all     # Dừng + xóa cả images

docker compose logs -f            # Theo dõi logs tất cả services
docker compose logs -f web        # Logs của service cụ thể
docker compose logs --tail=100 web

docker compose ps                 # Trạng thái services
docker compose ps -a

docker compose restart web         # Restart service cụ thể
docker compose restart             # Restart tất cả

docker compose build              # Build lại images
docker compose build --no-cache   # Build không cache

docker compose exec web sh        # Vào container
docker compose run web npm test   # Chạy command trong service

docker compose config             # Validate và hiển thị merged config
docker compose top                 # Processes đang chạy

docker compose scale web=3        # Scale service (deprecated, dùng replicas)
```

---

## 6. Docker Networking

### 6.1. Network Drivers

| Driver | Mục đích | Use case |
|--------|----------|----------|
| **bridge** | Mặc định. Kết nối containers trong cùng host | Development, simple setups |
| **host** | Bỏ qua network isolation, dùng host network trực tiếp | Performance-critical, khi cần tránh overhead |
| **overlay** | Kết nối containers qua nhiều Docker hosts (Swarm mode) | Distributed systems, Swarm |
| **none** | Không có networking | Isolated tasks, security |
| **macvlan** | Gán MAC address thật cho container | Khi cần container xuất hiện như physical device |

### 6.2. Network Commands

```bash
docker network ls                  # Liệt kê networks
docker network create mynet        # Tạo network
docker network rm mynet            # Xóa network
docker network inspect mynet       # Chi tiết network

# Kết nối container vào network
docker network connect mynet container1
docker network disconnect mynet container1

# Container communication
docker run -it --network=mynet --rm ubuntu:22.04 ping container_name
```

---

## 7. Docker Volumes

### 7.1. Volume Types

| Type | Mô tả | Use case |
|------|-------|----------|
| **Named volume** | Docker quản lý, persist qua container lifecycle | Database data, application state |
| **Bind mount** | Map host directory vào container | Development (hot reload), config files |
| **tmpfs mount** | Lưu trong memory, không persist | Secrets, sensitive data tạm thời |
| **anonymous volume** | Docker tự tạo, không có tên cụ thể | Fallback cho `VOLUME` trong Dockerfile |

### 7.2. Volume Commands

```bash
docker volume create myvolume        # Tạo named volume
docker volume ls                     # Liệt kê volumes
docker volume inspect myvolume      # Chi tiết volume
docker volume rm myvolume           # Xóa volume
docker volume prune                  # Xóa unused volumes

# Bind mount
docker run -v /host/path:/container/path:ro myapp

# tmpfs mount
docker run --tmpfs /run:rw,noexec,nosuid,size=64m myapp

# Sử dụng trong compose
# volumes:
#   - db-data:/var/lib/postgresql/data     # named volume
#   - ./config:/app/config:ro              # bind mount
#   - /tmp/app-temp:/app/temp              # tmpfs
```

---

## 8. Docker Security

### 8.1. Best Practices

- **Rootless containers:** Chạy container với user không phải root (`USER appuser`).
- **Read-only root filesystem:** `--read-only` flag hoặc `readOnlyRootFilesystem: true`.
- **No privileged mode:** Không dùng `--privileged`.
- **No capability escalation:** Dùng `--cap-drop=ALL` và `--cap-add` chỉ khi cần.
- **Scan vulnerabilities:** Dùng `trivy`, `snyk`, `grype`.
- **Signed images:** Dùng Docker Content Trust (`DOCKER_CONTENT_TRUST=1`).
- **Minimal base images:** Ưu tiên `alpine`, `distroless`, `scratch`.
- **Secrets management:** Không hardcode secrets — dùng Docker Secrets hoặc external secrets manager.

### 8.2. Security Scanning

```bash
# Scan image với Trivy
trivy image --severity HIGH,CRITICAL myapp:latest
trivy image --vuln-type os,library myapp:latest

# Scan image với Grype
grype myapp:latest

# Dockerfile linting với Hadolint
hadolint Dockerfile

# Snyk container scan
snyk container test myapp:latest

# Docker Bench Security (host security audit)
docker run -it --net host --pid host --userns host \
  -v /var/lib/docker:/var/lib/docker \
  aquasec/docker-bench-security:latest
```

### 8.3. Runtime Security Options

```bash
# Container với security options
docker run -d \
  --read-only \
  --cap-drop=ALL \
  --security-opt=no-new-privileges \
  --user=1001 \
  --tmpfs /tmp:rw,noexec,nosuid,size=64m \
  myapp:latest

# Seccomp profile (mặc định Docker đã áp dụng)
docker run --security-opt seccomp=default.json myapp

# AppArmor profile
docker run --security-opt apparmor=default myapp
```

---

## 9. Common Interview Questions

### Q: Sự khác biệt giữa `COPY` và `ADD` trong Dockerfile?

| Chỉ thị | COPY | ADD |
|---------|------|-----|
| **Chức năng** | Sao chép file từ build context vào image | Sao chép + giải nén + fetch URL |
| **Khuyến nghị** | **Nên dùng** — rõ ràng, dễ hiểu | Chỉ dùng khi cần tar extraction hoặc URL |
| **Độ rõ ràng** | Rõ ràng, dễ predict | Ngầm định nhiều hơn |

> **Quy tắc đơn giản:** Dùng `COPY` trừ khi bạn cần `ADD` cho tar extraction hoặc URL.

### Q: Làm sao để giảm kích thước Docker image?

1. Dùng **multi-stage build**.
2. Dùng **minimal base image** (`alpine`, `distroless`, `scratch`).
3. Gộp layers bằng cách chạy nhiều `RUN` commands trong một layer (`&&`).
4. Loại trừ file không cần thiết qua **`.dockerignore`**.
5. Chạy `npm ci --only=production` thay vì `npm install` (với `--production=false` nếu cần devDeps).
6. **CLEAN UP** trong cùng layer: `RUN apt-get update && apt-get install -y nginx && rm -rf /var/lib/apt/lists/*`
7. Sử dụng **specific tags** thay vì `latest`.

### Q: Docker restart policy?

| Policy | Hành vi |
|--------|---------|
| `no` | Không bao giờ tự restart (mặc định) |
| `always` | Luôn restart khi container dừng (kể cả daemon restart) |
| `unless-stopped` | Restart trừ khi được manual stop |
| `on-failure` | Restart khi exit code khác 0 |

### Q: Sự khác biệt giữa `EXPOSE` và `-p` trong port mapping?

- **`EXPOSE`** trong Dockerfile: Chỉ là **documentation** — thông báo container listen port nào.
- **`-p`** trong CLI: Thực sự **map port** từ container ra host.

### Q: Làm sao để persist data trong Docker?

- **Named volumes:** `docker volume create` + mount vào container. Docker quản lý vòng đời.
- **Bind mounts:** Map host directory. Dùng khi cần truy cập host files.
- **tmpfs mounts:** Lưu trong memory. Dùng cho secrets, sensitive data tạm thời.
- **Bind mounts vs Named volumes:** Named volumes dễ backup/restore hơn, bind mounts linh hoạt hơn.

### Q: Docker lifecycle?

```
created → running → paused → stopped → deleted
              ↓
         restarting
```
