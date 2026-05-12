# DevOps - Helm

## 1. Helm là gì?

**Helm** là package manager cho Kubernetes. Thay vì tự apply nhiều file YAML rời rạc, bạn đóng gói chúng thành một **Chart** rồi dùng Helm để cài, nâng cấp, rollback.

Nói đơn giản: Helm giống `npm` hoặc `apt`, nhưng dành cho ứng dụng chạy trên Kubernetes.

### 1.1. Tại sao nên dùng Helm?

| Tính năng | Lợi ích |
|-----------|---------|
| **Đóng gói** | Gom nhiều YAML thành một chart có version |
| **Template** | Dùng cùng template cho dev/staging/prod với value khác nhau |
| **Quản lý release** | Theo dõi lịch sử cài đặt/nâng cấp, rollback dễ |
| **Quản lý phụ thuộc** | Chart có thể dùng chart khác, ví dụ app phụ thuộc PostgreSQL |
| **Atomic upgrade** | Nếu nâng cấp lỗi, rollback để cluster không ở trạng thái nửa vời |

---

## 2. Cấu trúc Chart

Chart là một thư mục có cấu trúc chuẩn:

```text
mychart/
├── Chart.yaml          # Metadata của chart (name, version, dependencies)
├── values.yaml         # Giá trị cấu hình mặc định
├── values.schema.json  # Tùy chọn: schema để validate values
├── charts/             # Chart phụ thuộc
├── templates/          # Manifest Kubernetes dạng template
│   ├── deployment.yaml
│   ├── service.yaml
│   ├── ingress.yaml
│   └── _helpers.tpl    # Named template dùng chung
├── templates/NOTES.txt # Ghi chú sau khi cài đặt
└── .helmignore         # File loại trừ khi đóng gói
```

### 2.1. Chart.yaml

```yaml
apiVersion: v2           # Chart API version (v2 cho Helm 3)
name: my-application
version: 1.0.0           # Phiên bản semantic của chart
appVersion: "2.1.0"      # Phiên bản ứng dụng được đóng gói
description: Chart cho web application
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
dependencies:            # Phụ thuộc của Chart (Helm 3)
  - name: postgresql
    version: "12.x.x"
    repository: "https://charts.bitnami.com"
    condition: postgresql.enabled
```

### 2.2. values.yaml

```yaml
# Giá trị mặc định cho my-application

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

Helm sử dụng Go's `text/template` để tạo ra các manifest Kubernetes.

### 3.1. Các đối tượng tích hợp sẵn (built-in objects)

| Object | Mo ta |
|--------|-------|
| `.Values` | Giá trị người dùng cung cấp (từ `values.yaml` hoặc `--set`) |
| `.Release` | Metadata của release (name, namespace, revision, service) |
| `.Chart` | Metadata của chart từ `Chart.yaml` |
| `.Files` | Truy cập các file không phải template trong chart |
| `.Capabilities` | Khả năng của cluster (K8s version, Helm version) |
| `.Template` | Context của template hiện tại |
| `.Release.IsUpgrade` | Boolean: true nếu thao tác hiện tại là upgrade |
| `.Release.IsInstall` | Boolean: true nếu thao tác hiện tại là install |

### 3.2. Hàm template

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

### 3.3. Named templates (partials)

```yaml
# templates/_helpers.tpl
{{/*
Mở rộng tên chart.
*/}}
{{- define "myapp.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Tạo tên app đầy đủ mặc định.
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
Labels dùng chung.
*/}}
{{- define "myapp.labels" -}}
helm.sh/chart: {{ .Chart.Name }}-{{ .Chart.Version }}
{{ include "myapp.selectorLabels" . }}
{{- end }}

{{/*
Labels dùng cho selector.
*/}}
{{- define "myapp.selectorLabels" -}}
app.kubernetes.io/name: {{ include "myapp.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Tạo tên secret.
*/}}
{{- define "myapp.secretName" -}}
{{- printf "%s-secrets" (include "myapp.fullname" .) }}
{{- end }}
```

### 3.4. Các hàm template phổ biến

```yaml
# Xử lý chuỗi
{{ .Values.image.repository | upper }}           # Viết hoa
{{ .Values.image.repository | lower }}           # Viết thường
{{ .Values.image.repository | quote }}           # "giá trị"
{{ .Values.image.tag | default "latest" }}     # Giá trị mặc định nếu rỗng
{{ "hello-world" | replace "-" "_" }}           # Thay thế
{{ "hello" | printf "%s-world" }}               # printf

# Cấu trúc điều khiển
{{- if .Values.ingress.enabled }}              # if (dấu gạch ngang loại bỏ khoảng trắng)
...
{{- else if .Values.ingress.className }}
...
{{- else }}
...
{{- end }}

{{- range $key, $value := .Values.env }}       # Vòng lặp range
- name: {{ $key | quote }}
  value: {{ $value | quote }}
{{- end }}

{{- range .Values.services }}                  # Range over list
- name: {{ .name }}
  port: {{ .port }}
{{- end }}

# Xử lý YAML
{{ .Values.configmap | toYaml }}              # Chuyển đổi thành block YAML
{{ .Values.labels | toJson }}                  # Chuyển đổi thành JSON
{{ .Values.resources | toYaml | nindent 8 }}   # YAML với indent
```

---

## 4. Các lệnh Helm

### 4.1. Cài đặt & nâng cấp

```bash
# Cài đặt một chart
helm install my-release mychart/
helm install my-release mychart/ --namespace myns --create-namespace

# Cài đặt với giá trị tùy chỉnh
helm install my-release mychart/ --set replicaCount=5
helm install my-release mychart/ -f production.yaml
helm install my-release mychart/ -f values.yaml --set image.tag=v1.2.3

# Dry-run (xem các template đã render mà không cài đặt)
helm install my-release mychart/ --dry-run --debug

# Render template ra stdout
helm template my-release mychart/

# Nâng cấp một release
helm upgrade my-release mychart/
helm upgrade my-release mychart/ --set image.tag=v1.2.3 --timeout 5m

# Nâng cấp hoặc cài đặt (thao tác nguyên tử)
helm upgrade --install my-release mychart/

# Nâng cấp nguyên tử (rollback nếu lỗi)
helm upgrade my-release mychart/ --atomic

# Cài đặt phiên bản cụ thể
helm install my-release mychart/ --version 1.0.0
```

### 4.2. Quản lý release

```bash
# Danh sách tất cả releases
helm list
helm list --all                                  # Bao gồm đã xóa
helm list --all --namespace myns                 # Namespace cu the
helm list -o json                               # Dinh dang JSON

# Lịch sử release
helm history my-release                         # Hiển thị mọi phiên bản
helm history my-release --output json

# Rollback
helm rollback my-release 1                      # Rollback về phiên bản 1
helm rollback my-release --dry-run              # Dry-run rollback
helm rollback my-release 1 --timeout 5m

# Gỡ bỏ cài đặt
helm uninstall my-release                        # Xóa release
helm uninstall my-release --keep-history        # Giữ lại lịch sử để rollback

# Lấy manifest
helm get manifest my-release                     # Full rendered manifest
helm get values my-release                        # Giá trị người dùng cung cấp
helm get hooks my-release                        # Hook resources
```

### 4.3. Quản lý repository

```bash
# Thêm repository
helm repo add bitnami https://charts.bitnami.com
helm repo add prometheus https://prometheus-community.github.io/helm-charts
helm repo add grafana https://grafana.github.io/helm-charts

# Cập nhật chỉ mục repository
helm repo update

# Tìm kiếm
helm search repo nginx                           # Tìm theo tên chart
helm search repo bitnami/postgresql
helm search hub wordpress                        # Tìm trên Helm Hub

# Danh sách và quản lý repos
helm repo list
helm repo remove bitnami
helm repo update

# Build phụ thuộc
helm dependency build mychart/                   # Cài đặt charts/ requirements
helm dependency update mychart/                  # Cập nhật và cài đặt
```

### 4.4. Thao tác Chart

```bash
# Tạo chart mới
helm create mychart

# Đóng gói chart
helm package mychart/

# Lint một chart (kiểm tra cú pháp và best practices)
helm lint mychart/

# Xác minh chart package
helm verify mychart-1.0.0.tgz

# Hiển thị thông tin chart
helm show chart bitnami/nginx
helm show values bitnami/nginx
helm show readme bitnami/nginx
helm show all bitnami/nginx

# Kiểm tra chart
helm inspect values bitnami/postgresql
```

---

## 5. Hook trong Helm

Hooks chạy tại các thời điểm cụ thể trong vòng đời của một release.

### 5.1. Các hook có sẵn

| Hook | Thời điểm chạy |
|------|----------------|
| `pre-install` | Sau khi template được render, trước khi tạo resources |
| `post-install` | Sau khi tất cả resources được tải |
| `pre-upgrade` | Sau khi template được render, trước khi cập nhật resources |
| `post-upgrade` | Sau khi tất cả resources được nâng cấp |
| `pre-delete` | Trước khi xóa resources |
| `post-delete` | Sau khi xóa resources |
| `pre-rollback` | Trước khi khôi phục resources |
| `post-rollback` | Sau khi khôi phục resources |
| `test` | Khi chạy `helm test` (legacy) |

### 5.2. Ví dụ Hook (Database Migration)

```yaml
# templates/job-migration.yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: {{ include "myapp.fullname" . }}-migration
  labels:
    {{- include "myapp.labels" . | nindent 4 }}
  annotations:
    # Đánh dấu là hook
    "helm.sh/hook": pre-upgrade,pre-install
    "helm.sh/hook-weight": "-1"         # Chạy sớm hơn (âm = chạy sớm hơn)
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

### 5.3. Trọng số và policy của hook

```yaml
annotations:
  "helm.sh/hook": pre-install,pre-upgrade
  "helm.sh/hook-weight": "1"             # Thứ tự thực thi (cao hơn = chạy sau)
  "helm.sh/hook-delete-policy": hook-succeeded   # Xóa nếu hook thành công
  # Các tùy chọn khác: hook-failed, before-hook-creation
```

---

## 6. Chiến lược rollback

### 6.1. Rollback thủ công

```bash
# Xem lịch sử
helm history my-release

# REVISION  UPDATED                  STATUS     CHART           DESCRIPTION
# 1         Mon Jan 15 10:00:00 2024  superseded myapp-1.0.0     Install complete
# 2         Tue Jan 16 14:30:00 2024  superseded myapp-1.1.0   Upgrade complete
# 3         Wed Jan 17 09:00:00 2024  deployed   myapp-1.2.0   Upgrade complete

# Rollback về phiên bản trước đó
helm rollback my-release

# Rollback về phiên bản cụ thể
helm rollback my-release 1
```

### 6.2. Rollback tự động

```bash
# Rollback nguyên tử khi gặp lỗi
helm upgrade my-release mychart/ --atomic

# Với timeout
helm upgrade my-release mychart/ --timeout 5m

# Với cleanup khi gặp lỗi
helm upgrade my-release mychart/ --atomic --cleanup-on-fail
```

---

## 7. Thực hành tốt

### 7.1. Phát triển chart

> - Dùng **semantic versioning** cho cả `version` và `appVersion`.
> - **Không hardcode giá trị** - luôn dùng `{{ .Values }}`.
> - Dùng `{{ .Chart.AppVersion }}` làm tag image mặc định.
> - Định nghĩa tất cả giá trị có thể cấu hình trong `values.yaml` với **mặc định hợp lý**.
> - Dùng named templates (`_helpers.tpl`) để tránh lặp.
> - Dùng `nindent` để indent đúng trong YAML bên trong templates.
> - Ưu tiên `include` hơn `template` để đầu ra được indent đúng.

### 7.2. Bảo mật

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
# Luôn lint trước khi phát hành
helm lint mychart/ --strict

# Dùng --dry-run --debug để kiểm tra
helm install my-release mychart/ --dry-run --debug -f production.yaml

# Dùng atomic upgrades trong CI/CD
helm upgrade --install my-release mychart/ --atomic --timeout 5m

# Gắn phiên bản chart trong production
helm install my-release mychart-1.0.0.tgz

# Dùng secrets manager cho giá trị nhạy cảm
# Lưu secrets trong Vault, tham chiếu qua external-secrets operator
```

---

## 8. Câu hỏi phỏng vấn

**Q: Khác biệt giữa Helm 2 và Helm 3?**

> Helm 3 đã loại bỏ **Tiller** (thành phần server-side), nên bảo mật hơn. Nó dùng **three-way strategic merge patch** cho các lần nâng cấp và hỗ trợ **library charts**. Phụ thuộc được quản lý khác đi, release secret cũng đơn giản hơn.

**Q: Helm xử lý secrets như thế nào?**

> Mặc định, Helm lưu thông tin release bằng Kubernetes Secret trong Helm 3, nhưng nội dung vẫn chỉ base64 nếu cluster không bật mã hóa. Với production, nên bật **secrets encryption at rest** trong etcd, hoặc tích hợp **HashiCorp Vault** qua Vault plugin/external-secrets operator.

**Q: Helm three-way merge là gì?**

> Khi nâng cấp, Helm so sánh: (1) **old manifest** (trạng thái đã áp dụng lần cuối), (2) **current cluster state** (trạng thái hiện tại của cluster), và (3) **new desired manifest** (manifest mong muốn mới). Nhờ vậy Helm có thể giữ lại thay đổi trực tiếp trên cluster nếu phù hợp, đồng thời áp dụng cập nhật từ chart.

**Q: Làm thế nào để quản lý Helm chart dependencies?**

> Khai báo phụ thuộc trong `Chart.yaml`, trong trường `dependencies`. Dùng `helm dependency build` để tải chart vào thư mục `charts/`. Với production, nên dùng **Helm repository** hoặc **OCI registry** để host chart.

**Q: Library chart là gì?**

> Library chart là loại Helm chart (`type: library`) cung cấp các định nghĩa template có thể tái sử dụng nhưng không triển khai resource nào. Nó dùng để chia sẻ template chung, ví dụ `_common.tpl`, giữa nhiều application chart.
