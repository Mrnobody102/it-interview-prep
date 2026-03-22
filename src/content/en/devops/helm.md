# DevOps - Helm

## 1. What is Helm?

**Helm** is the package manager for Kubernetes. It bundles Kubernetes manifests (YAML files) into a distributable unit called a **Chart**, making it easy to install, upgrade, and manage applications on Kubernetes clusters.

### 1.1. Why Helm?

| Feature | Benefit |
|---------|---------|
| **Package management** | Bundle, version, and share Kubernetes apps |
| **Templating** | DRY principle — reuse templates with different values |
| **Release management** | Track install/upgrade history, rollback easily |
| **Dependency management** | Charts can depend on other charts |
| **Atomic operations** | Rollback on failure, ensuring cluster consistency |

---

## 2. Chart Structure

A Helm Chart is a directory with a specific structure:

```text
mychart/
├── Chart.yaml          # Chart metadata (name, version, dependencies)
├── values.yaml         # Default configuration values
├── values.schema.json  # Optional: JSON schema for values validation
├── charts/              # Local chart dependencies
├── templates/           # Kubernetes manifest templates
│   ├── deployment.yaml
│   ├── service.yaml
│   ├── ingress.yaml
│   └── _helpers.tpl    # Named template definitions
├── templates/NOTES.txt # Post-install notes shown to user
└── .helmignore          # Files to exclude from packaging
```

### 2.1. Chart.yaml

```yaml
apiVersion: v2           # Chart API version (v2 for Helm 3)
name: my-application
version: 1.0.0           # Semantic version of the chart
appVersion: "2.1.0"      # Version of the application being packaged
description: A web application chart
type: application
keywords:
  - web
  - http
  - api
home: https://myapp.com
sources:
  - https://github.com/myorg/myapp
maintainers:
  - name: DevOps Team
    email: devops@myorg.com
dependencies:            # Chart dependencies (Helm 3)
  - name: postgresql
    version: "12.x.x"
    repository: "https://charts.bitnami.com"
    condition: postgresql.enabled
```

### 2.2. values.yaml

```yaml
# Default values for my-application

replicaCount: 3

image:
  repository: myorg/myapp
  pullPolicy: IfNotPresent
  tag: "latest"

service:
  type: LoadBalancer
  port: 80
  targetPort: 8080

ingress:
  enabled: true
  className: nginx
  host: myapp.example.com
  tls: true

resources:
  limits:
    cpu: 500m
    memory: 256Mi
  requests:
    cpu: 100m
    memory: 128Mi

autoscaling:
  enabled: true
  minReplicas: 2
  maxReplicas: 10
  targetCPUUtilizationPercentage: 75

env:
  NODE_ENV: production
  LOG_LEVEL: info

configmap:
  app.conf: |
    server {
      listen 8080;
      server_name localhost;
      location / {
        root /usr/share/nginx/html;
        index index.html;
      }
    }

postgresql:
  enabled: true
  auth:
    database: myapp
    username: myapp_user
    password: changeme
```

---

## 3. Templating

Helm uses Go's `text/template` engine for generating Kubernetes manifests.

### 3.1. Built-in Objects

| Object | Description |
|--------|-------------|
| `.Values` | User-provided values (from `values.yaml` or `--set`) |
| `.Release` | Release metadata (name, namespace, revision, service) |
| `.Chart` | Chart metadata from `Chart.yaml` |
| `.Files` | Access non-template files in the chart |
| `.Capabilities` | Cluster capabilities (K8s version, Helm version) |
| `.Template` | Current template context |
| `.Release.IsUpgrade` | Boolean: true if current operation is an upgrade |
| `.Release.IsInstall` | Boolean: true if current operation is an install |

### 3.2. Template Functions

```yaml
# templates/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ include "myapp.fullname" . }}
  labels:
    {{- include "myapp.labels" . | nindent 4 }}
    chart: {{ .Chart.Name }}-{{ .Chart.Version }}
spec:
  replicas: {{ .Values.replicaCount }}
  selector:
    matchLabels:
      {{- include "myapp.selectorLabels" . | nindent 6 }}
  template:
    metadata:
      labels:
        {{- include "myapp.selectorLabels" . | nindent 8 }}
    spec:
      containers:
        - name: {{ .Chart.Name }}
          image: "{{ .Values.image.repository }}:{{ .Values.image.tag | default .Chart.AppVersion }}"
          ports:
            - name: http
              containerPort: {{ .Values.service.targetPort }}
              protocol: TCP
          env:
            {{- range $key, $value := .Values.env }}
            - name: {{ $key | quote }}
              value: {{ $value | quote }}
            {{- end }}
          resources:
            {{- toYaml .Values.resources | nindent 12 }}
          livenessProbe:
            httpGet:
              path: /health
              port: http
          readinessProbe:
            httpGet:
              path: /ready
              port: http
```

### 3.3. Named Templates (Partials)

```yaml
# templates/_helpers.tpl
{{/*
Expand the name of the chart.
*/}}
{{- define "myapp.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
*/}}
{{- define "myapp.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Common labels.
*/}}
{{- define "myapp.labels" -}}
helm.sh/chart: {{ .Chart.Name }}-{{ .Chart.Version }}
{{ include "myapp.selectorLabels" . }}
{{- end }}

{{/*
Selector labels.
*/}}
{{- define "myapp.selectorLabels" -}}
app.kubernetes.io/name: {{ include "myapp.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Create the name for the secret.
*/}}
{{- define "myapp.secretName" -}}
{{- printf "%s-secrets" (include "myapp.fullname" .) }}
{{- end }}
```

### 3.4. Common Template Functions

```yaml
# String manipulation
{{ .Values.image.repository | upper }}           # UPPERCASE
{{ .Values.image.repository | lower }}           # lowercase
{{ .Values.image.repository | quote }}           # "value"
{{ .Values.image.tag | default "latest" }}       # default if empty
{{ "hello-world" | replace "-" "_" }}           # replace
{{ "hello" | printf "%s-world" }}               # printf

# Control structures
{{- if .Values.ingress.enabled }}              # if (trailing dash removes whitespace)
...
{{- else if .Values.ingress.className }}
...
{{- else }}
...
{{- end }}

{{- range $index, $value := .Values.env }}      # range loop
- name: {{ $key | quote }}
  value: {{ $value | quote }}
{{- end }}

{{- range .Values.services }}                   # range over list
- name: {{ .name }}
  port: {{ .port }}
{{- end }}

# YAML manipulation
{{ .Values.configmap | toYaml }}               # Convert to YAML block
{{ .Values.labels | toJson }}                  # Convert to JSON
{{ .Values.resources | toYaml | nindent 8 }}  # YAML with indentation
```

---

## 4. Helm Commands

### 4.1. Installation & Upgrades

```bash
# Install a chart
helm install my-release mychart/
helm install my-release mychart/ --namespace myns --create-namespace

# Install with custom values
helm install my-release mychart/ --set replicaCount=5
helm install my-release mychart/ -f production.yaml
helm install my-release mychart/ -f values.yaml --set image.tag=v1.2.3

# Dry-run (see rendered templates without installing)
helm install my-release mychart/ --dry-run --debug

# Template rendering (output to stdout)
helm template my-release mychart/

# Upgrade a release
helm upgrade my-release mychart/
helm upgrade my-release mychart/ --set image.tag=v1.2.3 --timeout 5m

# Upgrade or install (atomic operation)
helm upgrade --install my-release mychart/

# Atomic upgrade (rollback on failure)
helm upgrade my-release mychart/ --atomic

# Install specific version
helm install my-release mychart/ --version 1.0.0
```

### 4.2. Release Management

```bash
# List all releases
helm list
helm list --all                                  # Include deleted
helm list --all --namespace myns                 # Specific namespace
helm list -o json                               # JSON output

# Release history
helm history my-release                         # Show all revisions
helm history my-release --output json

# Rollback
helm rollback my-release 1                      # Rollback to revision 1
helm rollback my-release --dry-run              # Dry-run rollback
helm rollback my-release 1 --timeout 5m

# Uninstall
helm uninstall my-release                        # Remove release
helm uninstall my-release --keep-history        # Keep history for rollback

# Get manifest
helm get manifest my-release                     # Full rendered manifest
helm get values my-release                        # User-provided values
helm get hooks my-release                        # Hook resources
```

### 4.3. Repository Management

```bash
# Add repositories
helm repo add bitnami https://charts.bitnami.com
helm repo add prometheus https://prometheus-community.github.io/helm-charts
helm repo add grafana https://grafana.github.io/helm-charts

# Update repository index
helm repo update

# Search
helm search repo nginx                           # Search by chart name
helm search repo bitnami/postgresql
helm search hub wordpress                        # Search Helm Hub

# List and manage repos
helm repo list
helm repo remove bitnami
helm repo update

# Build dependency
helm dependency build mychart/                   # Install charts/ requirements
helm dependency update mychart/                  # Update and install
```

### 4.4. Chart Operations

```bash
# Create a new chart
helm create mychart

# Package a chart
helm package mychart/

# Lint a chart (validate syntax and best practices)
helm lint mychart/

# Verify a chart package
helm verify mychart-1.0.0.tgz

# Show chart info
helm show chart bitnami/nginx
helm show values bitnami/nginx
helm show readme bitnami/nginx
helm show all bitnami/nginx

# Inspect a chart
helm inspect values bitnami/postgresql
```

---

## 5. Helm Hooks

Hooks run at specific points in a release's lifecycle.

### 5.1. Available Hooks

| Hook | When it runs |
|------|-------------|
| `pre-install` | After templates are rendered, before resources are created |
| `post-install` | After all resources are loaded |
| `pre-upgrade` | After templates rendered, before resources are updated |
| `post-upgrade` | After all resources are upgraded |
| `pre-delete` | Before deleting resources |
| `post-delete` | After deleting resources |
| `pre-rollback` | Before resources are restored |
| `post-rollback` | After resources are restored |
| `test` | On `helm test` (legacy) |

### 5.2. Hook Example (Database Migration)

```yaml
# templates/job-migration.yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: {{ include "myapp.fullname" . }}-migration
  labels:
    {{- include "myapp.labels" . | nindent 4 }}
  annotations:
    # Mark as hook
    "helm.sh/hook": pre-upgrade,pre-install
    "helm.sh/hook-weight": "-1"         # Run earlier (negative = earlier)
    "helm.sh/hook-delete-policy": hook-succeeded,before-hook-creation
spec:
  backoffLimit: 3
  template:
    metadata:
      labels:
        {{- include "myapp.labels" . | nindent 8 }}
    spec:
      restartPolicy: OnFailure
      containers:
        - name: migration
          image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"
          command: ["npm", "run", "migrate"]
          env:
            - name: DATABASE_URL
              valueFrom:
                secretKeyRef:
                  name: {{ include "myapp.secretName" . }}
                  key: database-url
```

### 5.3. Hook Weights & Policies

```yaml
annotations:
  "helm.sh/hook": pre-install,pre-upgrade
  "helm.sh/hook-weight": "1"             # Execution order (higher = later)
  "helm.sh/hook-delete-policy": hook-succeeded   # Delete if hook succeeded
  # Other options: hook-failed, before-hook-creation
```

---

## 6. Rollback Strategies

### 6.1. Manual Rollback

```bash
# List history
helm history my-release

# REVISION  UPDATED                  STATUS     CHART           DESCRIPTION
# 1         Mon Jan 15 10:00:00 2024  superseded myapp-1.0.0     Install complete
# 2         Tue Jan 16 14:30:00 2024  superseded myapp-1.1.0   Upgrade complete
# 3         Wed Jan 17 09:00:00 2024  deployed   myapp-1.2.0   Upgrade complete

# Rollback to previous
helm rollback my-release

# Rollback to specific revision
helm rollback my-release 1
```

### 6.2. Automated Rollback

```bash
# Atomic rollback on failure
helm upgrade my-release mychart/ --atomic

# With timeout
helm upgrade my-release mychart/ --timeout 5m

# With cleanup on failure
helm upgrade my-release mychart/ --atomic --cleanup-on-fail
```

---

## 7. Best Practices

### 7.1. Chart Development

> - Use **semantic versioning** for both `version` and `appVersion`.
> - **Never hardcode values** — always use `{{ .Values }}`.
> - Use `{{ .Chart.AppVersion }}` as the default image tag.
> - Define all configurable values in `values.yaml` with **sensible defaults**.
> - Use named templates (`_helpers.tpl`) to avoid repetition.
> - Use `nindent` for proper YAML indentation inside templates.
> - Use `include` over `template` so output is properly indented.

### 7.2. Security

```yaml
# values.yaml
securityContext:
  runAsNonRoot: true
  runAsUser: 10001
  fsGroup: 10001

podSecurityContext:
  seccompProfile:
    type: RuntimeDefault

containerSecurityContext:
  allowPrivilegeEscalation: false
  readOnlyRootFilesystem: true
  capabilities:
    drop:
      - ALL
```

### 7.3. Production Checklist

```bash
# Always lint before releasing
helm lint mychart/ --strict

# Use --dry-run --debug for testing
helm install my-release mychart/ --dry-run --debug -f production.yaml

# Use atomic upgrades in CI/CD
helm upgrade --install my-release mychart/ --atomic --timeout 5m

# Pin chart versions in production
helm install my-release mychart-1.0.0.tgz

# Use secrets manager for sensitive values
# Store secrets in Vault, reference via external-secrets operator
```

---

## 8. Interview Questions

**Q: What is the difference between Helm 2 and Helm 3?**

> Helm 3 removed **Tiller** (the server-side component), making it more secure. It uses a **three-way strategic merge patch** for upgrades and supports **library charts**. Dependencies are managed differently and secrets storage is simplified.

**Q: How does Helm handle secrets?**

> By default, Helm stores release information as ConfigMaps (not encrypted). For production, use **secrets encryption at rest** in etcd, or integrate with **HashiCorp Vault** via the Vaulted plugin or external-secrets operator. The `--secrets-file` flag can be used with `helm secrets` plugin.

**Q: What is the Helm three-way merge?**

> When upgrading, Helm compares: (1) the **old manifest** (last applied state), (2) the **current cluster state**, and (3) the **new desired manifest**. This allows Helm to intelligently merge changes — keeping modifications made directly on the cluster while applying chart updates.

**Q: How do you manage Helm chart dependencies?**

> Declare dependencies in `Chart.yaml` under the `dependencies` field. Use `helm dependency build` to download charts into the `charts/` directory. For production, consider using a **Helm repository** or **OCI registry** to host your charts.

**Q: What is a library chart?**

> A library chart is a type of Helm chart (type: library) that provides reusable template definitions without deploying any resources. It is used to share common templates (e.g., `_common.tpl`) across multiple application charts.
