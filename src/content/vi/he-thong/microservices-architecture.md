# Kiến trúc phần mềm

## 2. Kiến trúc Microservices

### 2.1. Tổng quan

Mỗi chức năng được tách ra thành các **service nhỏ, độc lập** giao tiếp qua API (REST, gRPC, GraphQL). Mỗi service quản lý dữ liệu riêng và có thể được phát triển, deploy, scale độc lập.

### 2.2. Đặc điểm chính

- **Single Responsibility:** Mỗi service làm một việc tốt
- **Deployment độc lập:** Có thể deploy mà không cần phối hợp với service khác
- **Dữ liệu phi tập trung:** Mỗi service quản lý database riêng
- **Đa dạng công nghệ:** Service có thể dùng ngôn ngữ, framework, database khác nhau
- **Khả năng phục hồi:** Lỗi một service không lan sang service khác

### 2.3. Các mô hình giao tiếp

| Mô hình | Mô tả | Use Case |
|---|---|---|
| **Đồng bộ (REST/gRPC)** | Request-response | Truy vấn đơn giản, đọc dữ liệu |
| **Bất đồng bộ (Message Queue)** | Fire-and-forget qua Kafka, RabbitMQ | Event-driven, background jobs |
| **GraphQL** | Client linh hoạt truy vấn | Nhu cầu dữ liệu phức tạp |

### 2.4. Ưu điểm

- **Scale độc lập:** Scale từng service theo nhu cầu (ví dụ: scale service recommendation mà không cần scale toàn bộ app)
- **Deployment độc lập:** Deploy fix và feature mà không ảnh hưởng service khác
- **Cô lập lỗi:** Một service crash (ví dụ: payment) không làm sập service khác (ví dụ: search)
- **Linh hoạt công nghệ:** Dùng tool tốt nhất cho từng job (Go cho high-performance, Python cho ML, v.v.)
- **Tự chủ team:** Team có thể sở hữu service từ đầu đến cuối

### 2.5. Nhược điểm

- **Độ phức tạp vận hành:** Yêu cầu DevOps mạnh — CI/CD pipelines, container orchestration (Kubernetes), service mesh, monitoring
- **Network Latency:** Giao tiếp inter-service qua network thêm latency
- **Dữ liệu phân tán:** Đảm bảo consistency giữa các service là thách thức (saga pattern, eventual consistency)
- **Bảo mật mạng:** Nhiều surface tấn công hơn; cần service-to-service authentication (mTLS, JWT)
- **Độ phức tạp test:** Integration test giữa các service khó hơn test monolith

### 2.6. Các thành phần hỗ trợ thiết yếu

- **API Gateway:** Điểm vào cho tất cả request từ client. Xử lý routing, authentication, rate limiting
- **Service Discovery:** Consul, Kubernetes built-in DNS để các service tìm nhau
- **Message Broker:** Kafka hoặc RabbitMQ cho giao tiếp bất đồng bộ
- **Distributed Tracing:** Jaeger hoặc Zipkin để trace request qua các service
- **Container Orchestration:** Kubernetes cho deployment, scaling, và quản lý

### 2.7. Khi nào chọn Microservices

- Team lớn (10+ developers) làm việc trên các feature khác nhau
- Ứng dụng có các domain chức năng riêng biệt cần scale độc lập
- Cần polyglot persistence (data store khác nhau cho nhu cầu khác nhau)
- Yêu cầu deployment thường xuyên, độc lập

### 2.8. So sánh tổng quan

| Tiêu chí | Monolith | Microservices |
|---|---|---|
| **Độ phức tạp** | Thấp | Cao |
| **Deployment** | Một artifact | Độc lập theo service |
| **Scaling** | Toàn bộ app | Theo từng service |
| **Công nghệ** | Một stack | Đa dạng |
| **Cô lập lỗi** | Kém | Tốt |
| **Quy mô team** | Nhỏ | Lớn |
| **CI/CD** | Đơn giản | Phức tạp |
| **Data consistency** | Dễ (single DB) | Khó (distributed) |
| **Time to Market** | Nhanh | Chậm hơn |

> **Lưu ý:** Microservices giải quyết các vấn đề tổ chức và kỹ thuật thực sự. Nếu team nhỏ hoặc ứng dụng đơn giản, overhead có thể lớn hơn lợi ích. Cân nhắc **Modular Monolith** trước — một monolith có ranh giới module rõ ràng có thể tách ra sau.
