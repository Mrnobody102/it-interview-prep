# DevOps - Helm

## 1. Helm la gi?

**Helm** la trinh quan ly goi (package manager) cho Kubernetes. Helm dong goi cac manifest Kubernetes (file YAML) thanh mot don vi co the phan phoi goi la **Chart**, giup viec cai dat, nang cap va quan ly ung dung tren Kubernetes cluster tro nen de dang.

### 1.1. Tai sao nen dung Helm?

| Tinh nang | Loi ich |
|-----------|---------|
| **Quan ly goi** | Dong goi, tao phien ban, chia se ung dung Kubernetes |
| **Templating** | Nguyen tac DRY - tai su dung template voi cac gia tri khac nhau |
| **Quan ly release** | Theo doi lich su cai dat/nang cap, rollback de dang |
| **Quan ly phu thuoc** | Chart co the phu thuoc vao chart khac |
| **Thao tac nguyen tu** | Rollback neu gap loi, dam bao tinh nhat quan cua cluster |

---

## 2. Cau truc Chart

Chart la mot thu muc co cau truc cu the:

```text
mychart/
├── Chart.yaml          # Metadata cua chart (name, version, dependencies)
├── values.yaml         # Gia tri cau hinh mac dinh
├── values.schema.json  # Tuy chon: JSON schema de validate values
├── charts/              # Cac phu thuoc chart cuc bo
├── templates/           # Cac manifest Kubernetes dang template
│   ├── deployment.yaml
│   ├── service.yaml
│   ├── ingress.yaml
│   └── _helpers.tpl    # Dinh nghia named template
├── templates/NOTES.txt # Ghi chu sau khi cai dat hien thi cho nguoi dung
└── .helmignore          # Cac file duoc loai tru khi dong goi
```

### 2.1. Chart.yaml

```yaml
apiVersion: v2           # Chart API version (v2 cho Helm 3)
name: my-application
version: 1.0.0           # Phien ban semantic cua chart
appVersion: "2.1.0"      # Phien ban cua ung dung duoc dong goi
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
dependencies:            # Phu thuoc cua Chart (Helm 3)
  - name: postgresql
    version: "12.x.x"
    repository: "https://charts.bitnami.com"
    condition: postgresql.enabled
```

### 2.2. values.yaml

```yaml
# Gia tri mac dinh cho my-application

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

Helm su dung Go's `text/template` de tao ra cac manifest Kubernetes.

### 3.1. Cac doi tuong tich hop san (Built-in Objects)

| Object | Mo ta |
|--------|-------|
| `.Values` | Gia tri nguoi dung cung cap (tu `values.yaml` hoac `--set`) |
| `.Release` | Metadata cua release (name, namespace, revision, service) |
| `.Chart` | Metadata cua chart tu `Chart.yaml` |
| `.Files` | Truy cap cac file khong phai template trong chart |
| `.Capabilities` | Kha nang cua cluster (K8s version, Helm version) |
| `.Template` | Context cua template hien tai |
| `.Release.IsUpgrade` | Boolean: true neu thao tac hien tai la upgrade |
| `.Release.IsInstall` | Boolean: true neu thao tac hien tai la install |

### 3.2. Ham Template

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

### 3.4. Cac ham Template pho bien

```yaml
# Xu ly chuoi
{{ .Values.image.repository | upper }}           # Viet hoa
{{ .Values.image.repository | lower }}           # Viet thuong
{{ .Values.image.repository | quote }}           # "gia tri"
{{ .Values.image.tag | default "latest" }}     # Gia tri mac dinh neu rong
{{ "hello-world" | replace "-" "_" }}           # Thay the
{{ "hello" | printf "%s-world" }}               # printf

# Cau truc dieu khien
{{- if .Values.ingress.enabled }}              # if (dau gach ngang loai bo khoang trang)
...
{{- else if .Values.ingress.className }}
...
{{- else }}
...
{{- end }}

{{- range $key, $value := .Values.env }}       # Vong lap range
- name: {{ $key | quote }}
  value: {{ $value | quote }}
{{- end }}

{{- range .Values.services }}                  # Range over list
- name: {{ .name }}
  port: {{ .port }}
{{- end }}

# Xu ly YAML
{{ .Values.configmap | toYaml }}              # Chuyen doi thanh block YAML
{{ .Values.labels | toJson }}                  # Chuyen doi thanh JSON
{{ .Values.resources | toYaml | nindent 8 }}   # YAML voi indent
```

---

## 4. Cac lenh Helm

### 4.1. Cai dat & Nang cap

```bash
# Cai dat mot chart
helm install my-release mychart/
helm install my-release mychart/ --namespace myns --create-namespace

# Cai dat voi gia tri tuy chinh
helm install my-release mychart/ --set replicaCount=5
helm install my-release mychart/ -f production.yaml
helm install my-release mychart/ -f values.yaml --set image.tag=v1.2.3

# Dry-run (xem cac template da render ma khong cai dat)
helm install my-release mychart/ --dry-run --debug

# Render template ra stdout
helm template my-release mychart/

# Nang cap mot release
helm upgrade my-release mychart/
helm upgrade my-release mychart/ --set image.tag=v1.2.3 --timeout 5m

# Nang cap hoac cai dat (thao tac nguyen tu)
helm upgrade --install my-release mychart/

# Nang cap nguyen tu (rollback neu loi)
helm upgrade my-release mychart/ --atomic

# Cai dat phien ban cu the
helm install my-release mychart/ --version 1.0.0
```

### 4.2. Quan ly Release

```bash
# Danh sach tat ca releases
helm list
helm list --all                                  # Bao gom da xoa
helm list --all --namespace myns                 # Namespace cu the
helm list -o json                               # Dinh dang JSON

# Lich su release
helm history my-release                         # Hien thi moi phien ban
helm history my-release --output json

# Rollback
helm rollback my-release 1                      # Rollback ve phien ban 1
helm rollback my-release --dry-run              # Dry-run rollback
helm rollback my-release 1 --timeout 5m

# Go bo cai dat
helm uninstall my-release                        # Xoa release
helm uninstall my-release --keep-history        # Giu lai lich su de rollback

# Lay manifest
helm get manifest my-release                     # Full rendered manifest
helm get values my-release                        # Gia tri nguoi dung cung cap
helm get hooks my-release                        # Hook resources
```

### 4.3. Quan ly Repository

```bash
# Them repository
helm repo add bitnami https://charts.bitnami.com
helm repo add prometheus https://prometheus-community.github.io/helm-charts
helm repo add grafana https://grafana.github.io/helm-charts

# Cap nhat chi muc repository
helm repo update

# Tim kiem
helm search repo nginx                           # Tim theo ten chart
helm search repo bitnami/postgresql
helm search hub wordpress                        # Tim tren Helm Hub

# Danh sach va quan ly repos
helm repo list
helm repo remove bitnami
helm repo update

# Build phu thuoc
helm dependency build mychart/                   # Cai dat charts/ requirements
helm dependency update mychart/                  # Cap nhat va cai dat
```

### 4.4. Thao tac Chart

```bash
# Tao chart moi
helm create mychart

# Dong goi chart
helm package mychart/

# Lint mot chart (kiem tra cu phap va best practices)
helm lint mychart/

# Xac minh chart package
helm verify mychart-1.0.0.tgz

# Hien thi thong tin chart
helm show chart bitnami/nginx
helm show values bitnami/nginx
helm show readme bitnami/nginx
helm show all bitnami/nginx

# Kiem tra chart
helm inspect values bitnami/postgresql
```

---

## 5. Helm Hooks

Hooks chay tai cac thoi diem cu the trong vong doi cua mot release.

### 5.1. Cac Hook co san

| Hook | Thoi diem chay |
|------|----------------|
| `pre-install` | Sau khi templates duoc render, truoc khi tao resources |
| `post-install` | Sau khi tat ca resources duoc tai |
| `pre-upgrade` | Sau khi templates rendered, truoc khi cap nhat resources |
| `post-upgrade` | Sau khi tat ca resources duoc nang cap |
| `pre-delete` | Truoc khi xoa resources |
| `post-delete` | Sau khi xoa resources |
| `pre-rollback` | Truoc khi khoi phuc resources |
| `post-rollback` | Sau khi khoi phuc resources |
| `test` | Khi chay `helm test` (legacy) |

### 5.2. Vi du Hook (Database Migration)

```yaml
# templates/job-migration.yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: {{ include "myapp.fullname" . }}-migration
  labels:
    {{- include "myapp.labels" . | nindent 4 }}
  annotations:
    # Danh dau la hook
    "helm.sh/hook": pre-upgrade,pre-install
    "helm.sh/hook-weight": "-1"         # Chay som hon (am = chay som hon)
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
  "helm.sh/hook-weight": "1"             # Thu tu thuc thi (cao hon = chay sau)
  "helm.sh/hook-delete-policy": hook-succeeded   # Xoa neu hook thanh cong
  # Cac tuy chon khac: hook-failed, before-hook-creation
```

---

## 6. Chiến luọc Rollback

### 6.1. Rollback thu cong

```bash
# Xem lich su
helm history my-release

# REVISION  UPDATED                  STATUS     CHART           DESCRIPTION
# 1         Mon Jan 15 10:00:00 2024  superseded myapp-1.0.0     Install complete
# 2         Tue Jan 16 14:30:00 2024  superseded myapp-1.1.0   Upgrade complete
# 3         Wed Jan 17 09:00:00 2024  deployed   myapp-1.2.0   Upgrade complete

# Rollback ve phien ban truoc do
helm rollback my-release

# Rollback ve phien ban cu the
helm rollback my-release 1
```

### 6.2. Rollback tu dong

```bash
# Rollback nguyen tu khi gap loi
helm upgrade my-release mychart/ --atomic

# voi timeout
helm upgrade my-release mychart/ --timeout 5m

#voi cleanup khi gap loi
helm upgrade my-release mychart/ --atomic --cleanup-on-fail
```

---

## 7. Best Practices

### 7.1. Phat trien Chart

> - Su dung **semantic versioning** cho ca `version` va `appVersion`.
> - **Khong bao gio hardcode gia tri** - luon su dung `{{ .Values }}`.
> - Su dung `{{ .Chart.AppVersion }}` lam tag image mac dinh.
> - Dinh nghia tat ca gia tri co the cau hinh trong `values.yaml` voi **mac dinh hop ly**.
> - Su dung named templates (`_helpers.tpl`) de tranh lap.
> - Su dung `nindent` cho indent dung trong YAML ben trong templates.
> - Uu tien `include` hơn `template` de dau ra duoc indent dung.

### 7.2. Bao mat

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

### 7.3. Checklist cho Production

```bash
# Luon lint truoc khi phat hanh
helm lint mychart/ --strict

# Su dung --dry-run --debug de kiem tra
helm install my-release mychart/ --dry-run --debug -f production.yaml

# Su dung atomic upgrades trong CI/CD
helm upgrade --install my-release mychart/ --atomic --timeout 5m

# Gan phien ban chart trong production
helm install my-release mychart-1.0.0.tgz

# Su dung secrets manager cho gia tri nhay cam
# Luu secrets trong Vault, tham chieu qua external-secrets operator
```

---

## 8. Cau hoi phong van

**Q: Khac biet giua Helm 2 va Helm 3?**

> Helm 3 da loai bo **Tiller** (thanh phan server-side), lam no bao mat hon. No su dung **three-way strategic merge patch** cho cac lan nang cap va ho tro **library charts**. Phu thuoc duoc quan ly khac di va luu tru secrets don gian hon.

**Q: Helm xu ly secrets nhu the nao?**

> Mac dinh, Helm luu thong tin release la ConfigMaps (khong ma hoa). Cho production, su dung **secrets encryption at rest** trong etcd, hoac tich hop voi **HashiCorp Vault** qua Vaulted plugin hoac external-secrets operator. Co the dung flag `--secrets-file` voi plugin `helm secrets`.

**Q: Helm three-way merge la gi?**

> Khi nang cap, Helm so sanh: (1) **old manifest** (trang thai da ap dung lan cuoi), (2) **current cluster state** (trang thai hien tai cua cluster), va (3) **new desired manifest** (manifest mong muon moi). Dieu nay cho phep Helm tong hop thong minh - giu lai cac thay doi duoc thuc hien truc tiep tren cluster dong thoi ap dung cap nhat tu chart.

**Q: Lam the nao de quan ly Helm chart dependencies?**

> Khai bao phu thuoc trong `Chart.yaml` trong truong `dependencies`. Su dung `helm dependency build` de tai chart vao thu muc `charts/`. Cho production, can su dung **Helm repository** hoac **OCI registry** de host cac chart.

**Q: Library chart la gi?**

> Library chart la mot loai Helm chart (type: library) cung cap cac dinh nghia template co the tai su dung ma khong trien khai bat ky resource nao. No duoc su dung de chia se cac template chung (vi du: `_common.tpl`) giua nhieu application charts.
