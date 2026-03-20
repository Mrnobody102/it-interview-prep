# DevOps - Kubernetes (K8s)

## 1. Tổng quan

**Kubernetes (K8s)** là một container orchestration platform mã nguồn mở, giúp tự động hóa việc deploy, scale, và quản lý containerized applications.

> **Điểm mạnh:** Auto-scaling, Self-healing, Load balancing, Rolling updates, Service discovery, Horizontal scaling.

---

## 2. Kiến trúc

### 2.1. Control Plane (Master Node)

| Component | Chức năng |
|-----------|-----------|
| **kube-apiserver** | REST API entry point, authenticate & validate requests. Frontend cho toàn bộ K8s control plane. |
| **etcd** | Distributed key-value store (Raft consensus). Lưu trữ toàn bộ cluster state. |
| **kube-scheduler** | Phân bổ Pods tới nodes dựa trên resource availability, affinity/anti-affinity rules. |
| **kube-controller-manager** | Chạy các controller processes: Node Controller, Replication Controller, Endpoint Controller, etc. |
| **cloud-controller-manager** | Tương tác với cloud provider APIs (AWS, GCP, Azure). |

### 2.2. Worker Nodes

| Component | Chức năng |
|-----------|-----------|
| **kubelet** | Agent chạy trên mỗi node, đảm bảo containers chạy theo Pod spec. Giao tiếp với API server. |
| **kube-proxy** | Network proxy, duy trì network rules trên node (iptables hoặc IPVS). |
| **container runtime** | Phần mềm chạy containers: **containerd**, **CRI-O**, **Docker** (deprecated). |

---

## 3. Các Kubernetes Objects chính

### 3.1. Pod

**Pod** là đơn vị nhỏ nhất có thể deploy được. Mỗi Pod chứa một hoặc nhiều containers chia sẻ network (cùng IP) và storage.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: myapp-pod
  labels:
    app: myapp
    version: v1
spec:
  containers:
    - name: myapp
      image: myapp:latest
      imagePullPolicy: IfNotPresent
      ports:
        - containerPort: 8080
          protocol: TCP
      env:
        - name: NODE_ENV
          value: production
      resources:
        requests:
          memory: "64Mi"
          cpu: "250m"
        limits:
          memory: "128Mi"
          cpu: "500m"
      livenessProbe:
        httpGet:
          path: /healthz
          port: 8080
        initialDelaySeconds: 10
        periodSeconds: 15
        failureThreshold: 3
```

### 3.2. Deployment

**Deployment** quản lý desired state của Pods, hỗ trợ **rolling update** và **rollback**.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp-deployment
  labels:
    app: myapp
spec:
  replicas: 3
  selector:
    matchLabels:
      app: myapp
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  template:
    metadata:
      labels:
        app: myapp
        version: v1
    spec:
      containers:
        - name: myapp
          image: myapp:v1
          ports:
            - containerPort: 8080
          resources:
            requests:
              memory: "64Mi"
              cpu: "250m"
            limits:
              memory: "128Mi"
              cpu: "500m"
```

### 3.3. ReplicaSet

Đảm bảo số lượng Pod replicas luôn chạy. Thường được **Deployment quản lý** — bạn hiếm khi tạo ReplicaSet trực tiếp.

```yaml
apiVersion: apps/v1
kind: ReplicaSet
metadata:
  name: myapp-replicaset
spec:
  replicas: 3
  selector:
    matchLabels:
      app: myapp
  template:
    metadata:
      labels:
        app: myapp
    spec:
      containers:
        - name: myapp
          image: myapp:latest
          ports:
            - containerPort: 8080
```

### 3.4. Service

**Service** expose Pods ra network, cung cấp stable IP và DNS name. Tái phân phối traffic tự động khi Pods thay đổi.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: myapp-service
spec:
  selector:
    app: myapp
  ports:
    - protocol: TCP
      port: 80          # Port trên Service (cluster-internal)
      targetPort: 8080  # Port trên Pod container
      name: http
  type: ClusterIP       # LoadBalancer | NodePort | ClusterIP
```

### 3.5. Service Types

| Type | Mô tả | Use case |
|------|--------|----------|
| **ClusterIP** | Internal IP, chỉ truy cập trong cluster | Internal communication giữa các services |
| **NodePort** | Expose qua port trên mỗi node (`<NodeIP>:<NodePort>`) | Development, simple access |
| **LoadBalancer** | External LB từ cloud provider | Production external access |
| **Headless** | Không có ClusterIP, trả về Pod IPs trực tiếp | StatefulSets, custom service discovery |

### 3.6. ConfigMap & Secret

ConfigMap lưu config không bí mật. Secret lưu dữ liệu nhạy cảm (base64 encoded hoặc encryption at rest).

```yaml
# ConfigMap
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  DATABASE_HOST: "db-service"
  LOG_LEVEL: "info"
  API_URL: "https://api.example.com"
  config.json: |
    {
      "timeout": 30,
      "retries": 3
    }

---
# Secret (base64 encoded)
apiVersion: v1
kind: Secret
metadata:
  name: app-secret
type: Opaque
data:
  DB_PASSWORD: c3VwZXItc2VjcmV0        # echo -n 'super-secret' | base64
  API_KEY: YXBpLWtleS1oZXJl # echo -n 'api-key-here' | base64

# Sử dụng trong Pod
# env:
#   - name: DB_PASSWORD
#     valueFrom:
#       secretKeyRef:
#         name: app-secret
#         key: DB_PASSWORD
```

### 3.7. Ingress

**Ingress** quản lý HTTP/HTTPS routing vào các Services trong cluster. Cung cấp load balancing, SSL termination, và virtual hosting.

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: myapp-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
spec:
  ingressClassName: nginx
  tls:
    - hosts:
        - myapp.example.com
      secretName: myapp-tls
  rules:
    - host: myapp.example.com
      http:
        paths:
          - path: /api
            pathType: Prefix
            backend:
              service:
                name: api-service
                port:
                  number: 80
          - path: /
            pathType: Prefix
            backend:
              service:
                name: web-service
                port:
                  number: 80
```

### 3.8. PersistentVolume & PersistentVolumeClaim

**PV** là tài nguyên cluster-wide. **PVC** là request lưu trữ từ Pod.

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: app-pvc
spec:
  accessModes:
    - ReadWriteOnce      # Hoặc ReadOnlyMany, ReadWriteMany
  resources:
    requests:
      storage: 1Gi
  storageClassName: standard

---
apiVersion: v1
kind: Pod
metadata:
  name: app-pod
spec:
  containers:
    - name: app
      image: app:latest
      volumeMounts:
        - name: storage
          mountPath: /data
  volumes:
    - name: storage
      persistentVolumeClaim:
        claimName: app-pvc
```

### 3.9. Namespace

**Namespace** tạo virtual clusters để cô lập resources, phân chia quota, và quản lý access.

```bash
# Tạo namespace
kubectl create namespace myapp-namespace

# Liệt kê namespaces
kubectl get namespaces
kubectl get ns

# Set default namespace (tránh phải -n mỗi lần)
kubectl config set-context --current --namespace=myapp-namespace

# Xem resources trong namespace
kubectl get all -n myapp-namespace

# Delete namespace (xóa tất cả resources bên trong)
kubectl delete namespace myapp-namespace
```

### 3.10. DaemonSet

Đảm bảo một Pod chạy trên **mỗi node** trong cluster. Dùng cho: log collectors, monitoring agents, storage daemons.

```yaml
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: log-collector
spec:
  selector:
    matchLabels:
      app: log-collector
  template:
    metadata:
      labels:
        app: log-collector
    spec:
      containers:
        - name: fluentd
          image: fluentd:v1
      tolerations:
        - operator: Exists   # Chạy trên tất cả nodes kể cả unschedulable
```

### 3.11. Job & CronJob

- **Job:** Chạy một hoặc nhiều Pods, đảm bảo hoàn thành thành công.
- **CronJob:** Lên lịch Jobs theo thời gian (cron format).

```yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: db-backup
spec:
  schedule: "0 2 * * *"        # 2:00 AM mỗi ngày
  successfulJobsHistoryLimit: 3
  failedJobsHistoryLimit: 1
  concurrencyPolicy: Forbid     # Forbid | Replace | Allow
  jobTemplate:
    spec:
      template:
        spec:
          containers:
            - name: backup
              image: postgres:15
              command: ["pg_dump", "-h", "db", "-U", "admin", "-F", "tar", "-f", "/backup/db.tar"]
              volumeMounts:
                - name: backup
                  mountPath: /backup
          restartPolicy: OnFailure
          volumes:
            - name: backup
              persistentVolumeClaim:
                claimName: backup-pvc
```

---

## 4. Basic Commands

```bash
# Cluster info
kubectl cluster-info
kubectl get nodes
kubectl describe node <node-name>

# Pods
kubectl get pods                        # Liệt kê pods trong default namespace
kubectl get pods -o wide                # Thêm IP và node
kubectl get pods -n kube-system         # System pods
kubectl describe pod <pod-name>
kubectl logs <pod-name>                 # Logs
kubectl logs -f <pod-name>             # Follow logs
kubectl logs -c <container> <pod-name> # Logs container cụ thể
kubectl exec -it <pod-name> -- /bin/sh # Shell vào container
kubectl delete pod <pod-name>
kubectl apply -f pod.yaml              # Tạo từ file
kubectl replace --force -f pod.yaml    # Force replace

# Deployments
kubectl get deployments
kubectl get deploy
kubectl describe deployment <name>
kubectl apply -f deployment.yaml
kubectl delete deployment <name>
kubectl scale deployment myapp --replicas=5
kubectl rollout status deployment/myapp
kubectl rollout undo deployment/myapp    # Rollback về version trước
kubectl rollout history deployment/myapp # Xem history
kubectl rollout undo deployment/myapp --to-revision=2  # Rollback về revision cụ thể
kubectl set image deployment/myapp myapp=myapp:v2
kubectl rollout restart deployment/myapp  # Restart rolling

# Services
kubectl get services
kubectl get svc
kubectl describe service <svc-name>
kubectl expose deployment myapp --type=LoadBalancer --port=80

# ConfigMaps & Secrets
kubectl get configmaps
kubectl get secrets
kubectl create configmap app-config --from-literal=KEY=value
kubectl create secret generic app-secret --from-literal=DB_PASS=secret
kubectl describe configmap app-config
kubectl edit configmap app-config

# Namespaces
kubectl get namespaces
kubectl config set-context --current --namespace=<ns>
kubectl create namespace myns

# Inspect & Debug
kubectl get all -n <namespace>
kubectl get events --sort-by='.lastTimestamp'
kubectl top nodes                        # Resource usage
kubectl top pods
kubectl explain pod.spec                 # Document API object
kubectl api-resources                    # Liệt kê tất cả API resources

# Configuration
kubectl apply -f <file.yaml>           # Tạo/update resources
kubectl delete -f <file.yaml>          # Xóa resources
kubectl get <resource> -o yaml         # Export resource as YAML
kubectl get <resource> -o json         # Export as JSON
kubectl get <resource> -o wide         # Extra details
kubectl diff -f <file.yaml>            # Preview changes trước khi apply
kubectl label pods <pod> key=value     # Thêm label
kubectl annotate pods <pod> key=value  # Thêm annotation
kubectl port-forward <pod> 8080:80    # Local port forward
kubectl cp <pod>:/path/file ./local   # Copy file từ pod ra
kubectl exec <pod> -- cat /path/file  # Đọc file trong pod
```

---

## 5. Auto-scaling

### 5.1. Horizontal Pod Autoscaler (HPA)

Tự động thay đổi số replicas dựa trên CPU, memory, hoặc custom metrics.

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: myapp-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: myapp-deployment
  minReplicas: 2
  maxReplicas: 10
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70     # Scale up khi avg CPU > 70%
    - type: Resource
      resource:
        name: memory
        target:
          type: Utilization
          averageUtilization: 80     # Scale up khi avg memory > 80%
```

```bash
# CLI
kubectl autoscale deployment myapp --cpu-percent=70 --min=2 --max=10
kubectl get hpa
kubectl describe hpa myapp
kubectl delete hpa myapp
```

### 5.2. Vertical Pod Autoscaler (VPA)

Tự động điều chỉnh **CPU và memory requests** cho Pods dựa trên actual usage.

```yaml
apiVersion: autoscaling.k8s.io/v1
kind: VerticalPodAutoscaler
metadata:
  name: myapp-vpa
spec:
  targetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: myapp-deployment
  updatePolicy:
    updateMode: "Auto"
```

### 5.3. Cluster Autoscaler

Tự động thêm/xóa nodes trong cluster dựa trên pending pods.

---

## 6. Scheduling & Node Selection

### 6.1. nodeSelector

Gán Pod vào node cụ thể dựa trên labels.

```yaml
spec:
  nodeSelector:
    disktype: ssd
    region: us-east
```

### 6.2. Node Affinity & Anti-Affinity

```yaml
spec:
  affinity:
    nodeAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:
        nodeSelectorTerms:
          - matchExpressions:
              - key: "topology.kubernetes.io/zone"
                operator: In
                values:
                  - "us-east-1a"
                  - "us-east-1b"
      preferredDuringSchedulingIgnoredDuringExecution:
        - weight: 100
          preference:
            matchExpressions:
              - key: "workload-type"
                operator: In
                values:
                  - "compute"
    podAntiAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:
        - labelSelector:
            matchExpressions:
              - key: "app"
                operator: In
                values:
                  - "myapp"
          topologyKey: "kubernetes.io/hostname"
    podAffinity:
      preferredDuringSchedulingIgnoredDuringExecution:
        - weight: 50
          podAffinityTerm:
            labelSelector:
              matchExpressions:
                - key: "app"
                  operator: In
                  values:
                    - "database"
            topologyKey: "kubernetes.io/hostname"
```

### 6.3. Taints & Tolerations

- **Taint** trên node: "Không pods nào được schedule vào đây TRỪ KHI có toleration phù hợp."
- **Toleration** trên Pod: "Cho phép schedule vào node có taint phù hợp."

```bash
# Taint a node
kubectl taint nodes node1 key=value:NoSchedule
kubectl taint nodes node1 dedicated=compute:NoExecute
kubectl taint nodes node1 node-type=frontend:PreferNoSchedule

# Remove taint
kubectl taint nodes node1 key=value:NoSchedule-
```

```yaml
spec:
  tolerations:
    - key: "dedicated"
      operator: "Equal"
      value: "compute"
      effect: "NoSchedule"
    - key: "node-role"
      operator: "Exists"
      effect: "NoExecute"
    - key: "temp"
      operator: "Exists"
      effect: "NoSchedule"
      tolerationSeconds: 300    # Cho phép graceful eviction trong 300s
```

---

## 7. Resource Management

### 7.1. Resource Requests vs Limits

| | **Request** | **Limit** |
|--|-------------|-----------|
| **Ý nghĩa** | Minimum resource **đảm bảo** cho Pod | Maximum resource **cho phép** sử dụng |
| **Scheduling** | Dùng để schedule Pod lên node | Dùng để enforce cgroup (OOMKilled nếu vượt) |
| **QoS Class** | Xác định QoS class của Pod | Ảnh hưởng đến scheduling priority |

### 7.2. QoS Classes

| Class | Điều kiện | Priority |
|-------|-----------|----------|
| **Guaranteed** | Request = Limit cho cả CPU và memory | Cao nhất |
| **Burstable** | Request < Limit | Trung bình |
| **BestEffort** | Không có request/limit | Thấp nhất |

> **Tip:** Nên set requests và limits cho tất cả containers để đảm bảo predictable scheduling.

### 7.3. LimitRange & ResourceQuota

```yaml
# LimitRange: Set default/limit cho pods trong namespace
apiVersion: v1
kind: LimitRange
metadata:
  name: default-limits
spec:
  limits:
    - type: Container
      default:
        memory: 256Mi
        cpu: 200m
      defaultRequest:
        memory: 128Mi
        cpu: 100m
      max:
        memory: 1Gi
        cpu: 1
      min:
        memory: 64Mi
        cpu: 50m

---
# ResourceQuota: Giới hạn tổng resource trong namespace
apiVersion: v1
kind: ResourceQuota
metadata:
  name: compute-quota
spec:
  hard:
    requests.cpu: "4"
    requests.memory: 8Gi
    limits.cpu: "8"
    limits.memory: 16Gi
    pods: "20"
```

---

## 8. Health Checks

Kubernetes hỗ trợ 3 loại probes để kiểm tra container health.

```yaml
spec:
  containers:
    - name: app
      livenessProbe:
        httpGet:
          path: /healthz
          port: 8080
        initialDelaySeconds: 10
        periodSeconds: 15
        failureThreshold: 3
        successThreshold: 1
        timeoutSeconds: 5
      readinessProbe:
        httpGet:
          path: /ready
          port: 8080
        initialDelaySeconds: 5
        periodSeconds: 10
        failureThreshold: 3
        successThreshold: 1
        timeoutSeconds: 5
      startupProbe:
        httpGet:
          path: /started
          port: 8080
        failureThreshold: 30       # 30 * 10s = 5 phút
        periodSeconds: 10
```

| Probe | Mục đích | Fail behavior |
|-------|----------|----------------|
| **livenessProbe** | Container đang "sống" không? Nếu fail → **restart** container | Container bị restart |
| **readinessProbe** | Container sẵn sàng nhận traffic? Nếu fail → **loại khỏi Service endpoints** | Traffic không được forward |
| **startupProbe** | Container đã khởi động xong chưa? Nếu pass → **disabled** (liveness/readiness bắt đầu hoạt động) | Trì hoãn liveness/readiness |

---

## 9. Helm

**Helm** là package manager cho Kubernetes. Giúp đóng gói, install, upgrade, và manage K8s applications.

### 9.1. Common Commands

```bash
# Add repo
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update

# Search & Install
helm search repo nginx
helm install my-nginx bitnami/nginx
helm install my-release bitnami/wordpress -f values.yaml

# Upgrade & Rollback
helm upgrade my-nginx bitnami/nginx -f values.yaml
helm rollback my-nginx 1
helm history my-nginx

# List & Delete
helm list
helm list -A
helm uninstall my-nginx

# Template rendering
helm template my-release bitnami/wordpress
helm template my-release bitnami/wordpress -f values.yaml > rendered.yaml

# Dry-run & Debug
helm install myapp bitnami/nginx --dry-run
helm install myapp bitnami/nginx --dry-run --debug -f values.yaml
```

### 9.2. Helm Chart Structure

```
mychart/
  Chart.yaml              # Metadata (name, version, dependencies)
  values.yaml              # Default values
  values.schema.json       # JSON schema validation (optional)
  charts/                  # Sub-charts
  crds/                    # Custom Resource Definitions
  templates/               # K8s manifests (Go template)
    deployment.yaml
    service.yaml
    ingress.yaml
    _helpers.tpl           # Named templates
    NOTES.txt              # Post-install notes
```

### 9.3. values.yaml Example

```yaml
# values.yaml
replicaCount: 3

image:
  repository: myapp
  tag: "latest"
  pullPolicy: IfNotPresent

service:
  type: ClusterIP
  port: 80

ingress:
  enabled: true
  className: "nginx"
  annotations:
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
  hosts:
    - host: myapp.example.com
      paths:
        - path: /
          pathType: Prefix
  tls:
    - secretName: myapp-tls
      hosts:
        - myapp.example.com

resources:
  limits:
    cpu: 500m
    memory: 128Mi
  requests:
    cpu: 100m
    memory: 64Mi

autoscaling:
  enabled: true
  minReplicas: 2
  maxReplicas: 10
  targetCPUUtilizationPercentage: 70
```

---

## 10. Common Interview Questions

### Q: Sự khác biệt giữa Pod và Container?

- **Pod** là đơn vị nhỏ nhất deploy được trong K8s, chứa một hoặc nhiều containers.
- Containers trong cùng Pod chia sẻ: **network namespace** (cùng IP, localhost), **IPC**, **storage volumes**.
- Mỗi Pod có IP riêng, containers trong Pod giao tiếp qua `localhost`.

### Q: Deployment strategies?

| Strategy | Mô tả | Downtime |
|----------|-------|----------|
| **Rolling Update** | Thay thế từng Pod, mặc định | Không |
| **Recreate** | Xóa tất cả trước, tạo mới | Có |
| **Blue/Green** | 2 version cùng chạy, switch traffic | Không |
| **Canary** | % traffic sang version mới, gradual rollout | Không |

### Q: Kubernetes vs Docker Swarm?

| Tiêu chí | Kubernetes | Docker Swarm |
|----------|------------|--------------|
| **Độ phức tạp** | Cao hơn | Thấp hơn |
| **Auto-scaling** | Built-in HPA/VPA | Manual scaling |
| **Ecosystem** | Rất lớn | Nhỏ hơn |
| **Rolling updates** | Native | Native |
| **Service discovery** | DNS, Ingress | DNS |
| **Load balancing** | Ingress/Service | Mesh |
| **Best for** | Production, complex workloads | Simpler setups |

### Q: Pod lifecycle states?

| State | Mô tả |
|-------|-------|
| **Pending** | Container đang được schedule hoặc pull image |
| **Running** | Container đang chạy (ít nhất 1 container running) |
| **Succeeded** | Container exit với code 0 (Job hoàn thành) |
| **Failed** | Container exit với code khác 0 |
| **Unknown** | Node unreachable |
| **CrashLoopBackOff** | Container fail liên tục, K8s đang retry |

### Q: Strategy để optimize Kubernetes costs?

1. **Right-sizing Pod resources** — requests/limits phù hợp.
2. **Vertical Pod Autoscaler** để điều chỉnh resource requests.
3. **Node autoscaling** với Cluster Autoscaler.
4. **Spot/Preemptible instances** cho non-critical workloads.
5. **Use namespaces** với ResourceQuota và LimitRange.
6. **Monitor và analyze** với `kubectl top`, Prometheus, Grafana.
7. **Right-size clusters** — không để nodes idle.
8. **Use appropriate storage classes** — không dùng premium storage cho non-critical data.

### Q: Làm sao để debug Pod không start?

```bash
# 1. Kiểm tra trạng thái
kubectl get pod <name>

# 2. Mô tả chi tiết (xem Events)
kubectl describe pod <name>

# 3. Xem logs
kubectl logs <name> --previous    # Logs của container crashed trước đó
kubectl logs <name> -c <container>

# 4. Kiểm tra resource limits
kubectl top pod <name>

# 5. Kiểm tra node
kubectl describe node <node-name>

# 6. Kiểm tra events
kubectl get events --sort-by='.lastTimestamp'

# 7. Vào shell debug
kubectl run -it --rm debug --image=busybox --restart=Never -- sh
```
