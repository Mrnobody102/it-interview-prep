# DevOps — Kubernetes (K8s)

## 1. What is Kubernetes?

**Kubernetes** (K8s) is an open-source container orchestration platform that automates deploying, scaling, and managing containerized applications.

### 1.1. Why Kubernetes?

| Feature | Benefit |
|---------|---------|
| **Auto-scaling** | Scale pods based on CPU/memory or custom metrics |
| **Self-healing** | Automatically restart failed containers |
| **Load balancing** | Distribute traffic across pods |
| **Rolling updates** | Zero-downtime deployments |
| **Service discovery** | DNS-based service-to-service communication |
| **Secret management** | Securely store sensitive data |

---

## 2. Core Concepts

### 2.1. Pod

The **Pod** is the smallest deployable unit in Kubernetes. It represents a single instance of a running process and can contain one or more containers that share storage and network.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: my-pod
spec:
  containers:
    - name: my-container
      image: nginx:latest
      ports:
        - containerPort: 80
```

### 2.2. Deployment

A **Deployment** manages the desired state of Pods — it handles scaling, rolling updates, and self-healing.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: my-app
  template:
    metadata:
      labels:
        app: my-app
    spec:
      containers:
        - name: my-app
          image: myapp:latest
          ports:
            - containerPort: 3000
```

### 2.3. Service

A **Service** exposes Pods to the network, providing a stable IP and DNS name regardless of pod restarts.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  selector:
    app: my-app
  ports:
    - protocol: TCP
      port: 80
      targetPort: 3000
  type: LoadBalancer
```

### 2.4. Ingress

An **Ingress** manages HTTP/HTTPS routing to services, providing external access with path-based routing and SSL termination.

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: my-ingress
spec:
  rules:
    - host: myapp.example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: my-service
                port:
                  number: 80
```

### 2.5. ConfigMap & Secret

**ConfigMap** stores non-sensitive configuration data. **Secret** stores sensitive data (base64 encoded).

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  DATABASE_HOST: "db-service"
  LOG_LEVEL: "info"
---
apiVersion: v1
kind: Secret
metadata:
  name: app-secret
stringData:
  API_KEY: "your-secret-key"
```

### 2.6. Namespace

A **Namespace** provides virtual clustering, isolating resources within a cluster for multi-team or multi-environment use.

---

## 3. Common Commands

```bash
# Pod operations
kubectl get pods                    # List all pods
kubectl get pods -o wide           # Detailed pod info
kubectl describe pod <name>        # Pod details
kubectl logs <pod-name>            # View pod logs
kubectl logs -f <pod-name>          # Follow logs
kubectl exec -it <pod> -- /bin/sh   # Shell into pod
kubectl delete pod <name>          # Delete pod

# Deployment operations
kubectl get deployments
kubectl apply -f deployment.yaml   # Apply from file
kubectl scale deployment myapp --replicas=5
kubectl rollout status deployment/myapp
kubectl rollout undo deployment/myapp  # Rollback

# Service operations
kubectl get services
kubectl get svc

# Cluster info
kubectl get nodes
kubectl cluster-info
kubectl get namespaces
kubectl get all -n <namespace>
```

---

## 4. Kubernetes Architecture

### 4.1. Control Plane (Master Node)

| Component | Role |
|-----------|------|
| **kube-apiserver** | Exposes the Kubernetes API, the front-end for the control plane |
| **etcd** | Consistent and highly-available key-value store for cluster data |
| **kube-scheduler** | Assigns pods to nodes based on resources and constraints |
| **kube-controller-manager** | Runs controller processes that regulate cluster state |

### 4.2. Worker Nodes

| Component | Role |
|-----------|------|
| **kubelet** | Agent that ensures containers are running in pods |
| **kube-proxy** | Network proxy that maintains network rules on nodes |
| **container runtime** | Software for running containers (e.g., containerd) |

---

## 5. Deployment Strategies

### 5.1. Rolling Update

Gradually replace old pods with new ones. Zero downtime.

### 5.2. Blue-Green Deployment

Run two identical environments. Switch traffic from blue (old) to green (new) instantly.

### 5.3. Canary Deployment

Gradually shift a small percentage of traffic to the new version before full rollout.

---

## 6. Interview Questions

**Q: What is the difference between a Pod and a Deployment?**

> A **Pod** is the smallest scheduling unit — it represents a single container (or group of containers). A **Deployment** manages Pods, handling scaling, updates, and self-healing automatically.

**Q: How does Kubernetes handle service discovery?**

> Kubernetes assigns a stable DNS name to each Service. Containers in the cluster can access other services using the DNS name (e.g., `http://my-service.default.svc.cluster.local`).

**Q: What is a StatefulSet?**

> A **StatefulSet** manages stateful applications that require stable network IDs and persistent storage (e.g., databases). Unlike Deployments, pods in a StatefulSet have stable, unique identifiers.

**Q: How do you manage secrets securely in Kubernetes?**

> Use Kubernetes Secrets (base64 encoded, suitable for non-critical data), or integrate with external secret managers like **HashiCorp Vault**, **AWS Secrets Manager**, or **Azure Key Vault** for production environments.
