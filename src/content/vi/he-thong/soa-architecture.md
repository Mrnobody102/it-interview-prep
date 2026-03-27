# SOA - Service-Oriented Architecture

## 1. Tổng quan

**SOA (Service-Oriented Architecture)** là kiến trúc tổ chức hệ thống thành các **service có khả năng tái sử dụng**, giao tiếp với nhau qua **ESB (Enterprise Service Bus)**. SOA ra đời từ những năm 2000 và được sử dụng rộng rãi trong các doanh nghiệp lớn để tích hợp các hệ thống legacy với nhau.

---

## 2. Các thành phần cốt lõi

### 2.1. ESB (Enterprise Service Bus)

| Khía cạnh | Mô tả |
|-----------|-------|
| **Định nghĩa** | Trung tâm giao tiếp trung tâm giữa các service |
| **Vai trò** | Routing, transformation, protocol mediation |
| **Ví dụ công cụ** | MuleSoft, IBM Integration Bus (IIB), WSO2, Apache ServiceMix |

```
┌──────────┐    ┌──────────┐    ┌──────────┐
│ Service A│    │ Service B│    │ Service C│
└────┬─────┘    └────┬─────┘    └────┬─────┘
     │               │               │
     └───────────┬───┘───────────────┘
                 │
           ┌─────┴─────┐
           │    ESB    │
           │           │
           │ • Routing │
           │ • Transform│
           │ • Protocol │
           └─────┬─────┘
                 │
     ┌───────────┼───────────┐
     │           │           │
┌────┴────┐ ┌────┴────┐ ┌────┴────┐
│  DB A   │ │   DB B  │ │   DB C  │
└─────────┘ └─────────┘ └─────────┘
```

### 2.2. Service Registry

| Khía cạnh | Mô tả |
|-----------|-------|
| **Định nghĩa** | Nơi lưu trữ metadata của các service |
| **Vai trò** | Giúp discover và binding service động |
| **Tiêu chuẩn** | UDDI (Universal Description, Discovery and Integration) |

### 2.3. Service Repository

| Khía cạnh | Mô tả |
|-----------|-------|
| **Định nghĩa** | Nơi lưu trữ WSDL contract và documentation |
| **Vai trò** | Tài liệu về service interface, version, owner |

---

## 3. Đặc điểm chính của SOA

| Đặc điểm | Mô tả |
|---------|-------|
| **Loose Coupling** | Service giao tiếp qua ESB, không gọi trực tiếp nhau |
| **Service Reusability** | Service được thiết kế để tái sử dụng bởi nhiều ứng dụng khác nhau |
| **Business Alignment** | Service được tổ chức theo business capability |
| **Enterprise Focus** | Thường dùng trong doanh nghiệp lớn với nhiều hệ thống legacy |
| **Interoperability** | Hỗ trợ nhiều protocol: SOAP, REST, JMS, WS-* |
| **Governance** | Governance tập trung ở enterprise level |

### 3.1. Service Classification

| Loại | Mô tả | Ví dụ |
|------|-------|-------|
| **Business Service** | Đại diện cho nghiệp vụ cụ thể | `ProcessOrderService`, `CalculatePricingService` |
| **Enterprise Service** | Kết hợp nhiều business service | `OrderFulfillmentService` |
| **Application Service** | Cung cấp chức năng cho một ứng dụng cụ thể | `GenerateInvoiceService` |
| **Infrastructure Service** | Hỗ trợ nghiệp vụ như logging, security | `AuthenticationService`, `LoggingService` |

---

## 4. So sánh SOA với Microservices

| Tiêu chí | SOA | Microservices |
|----------|-----|--------------|
| **Mô hình giao tiếp** | ESB (centralized hub) | API/giao tiếp trực tiếp (decentralized) |
| **Kích thước service** | Lớn, theo business service | Nhỏ, theo single responsibility |
| **Data management** | Database chia sẻ (thường) | Database riêng mỗi service |
| **Protocol** | SOAP, WS-*, JMS | REST, gRPC, Message Queue |
| **Deployment** | Tương đối độc lập | Hoàn toàn độc lập (CI/CD riêng) |
| **Governance** | Tập trung (enterprise-level) | Phi tập trung (team-driven) |
| **Coupling** | Trung bình | **Rất thấp** |
| **Complexity** | Cao (ESB là central point) | Cao (khác loại — distributed systems) |
| **Service contract** | WSDL (XML-based) | API contract (OpenAPI/Swagger) |
| **Message format** | XML (thường) | JSON, Protobuf |
| **Transaction** | ACID, XA distributed transaction | BASE, eventual consistency |
| **Scalability** | Vertical và một phần horizontal | Full horizontal scaling |
| **Use case phổ biến** | Doanh nghiệp lớn, legacy integration | Cloud-native, rapid development |

### 4.1. Sơ đồ so sánh

```
SOA:
┌─────────────────────────────────────────────┐
│                   ESB                       │
│  (routing, transformation, protocol)        │
│                                             │
│  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐        │
│  │ Svc │  │ Svc │  │ Svc │  │ Svc │        │
│  │  A  │  │  B  │  │  C  │  │  D  │        │
│  └──┬──┘  └──┬──┘  └──┬──┘  └──┬──┘        │
│     │       │       │       │              │
│  ┌──┴───────┴───────┴───────┴──┐           │
│  │        Shared Database      │           │
│  └─────────────────────────────┘           │
└─────────────────────────────────────────────┘

Microservices:
┌──────┐   ┌──────┐   ┌──────┐   ┌──────┐
│ Svc  │   │ Svc  │   │ Svc  │   │ Svc  │
│  A   │   │  B   │   │  C   │   │  D   │
└──┬───┘   └──┬───┘   └──┬───┘   └──┬───┘
┌──┴──┐  ┌───┴───┐ ┌───┴──┐  ┌───┴──┐
│ DB  │  │  DB   │ │  DB  │  │  DB  │
│  A  │  │   B   │ │   C  │  │   D  │
└─────┘  └───────┘ └──────┘  └──────┘
```

---

## 5. Ưu điểm của SOA

| Ưu điểm | Mô tả |
|---------|-------|
| **Tái sử dụng cao** | Service có thể dùng cho nhiều ứng dụng/nghiệp vụ khác nhau |
| **Interoperability** | Hỗ trợ nhiều protocol (SOAP, REST, JMS, WS-*) — kết nối hệ thống khác công nghệ |
| **Business Agility** | Dễ thay đổi business process bằng cách recombination service |
| **Kết nối hệ thống legacy** | SOA thường dùng để gắn kết hệ thống cũ với hệ thống mới |
| **Governance tập trung** | Quản lý tiêu chuẩn, policy ở enterprise level |
| **Phù hợp enterprise** | Thích hợp với tổ chức lớn cần integration nhiều hệ thống |

---

## 6. Nhược điểm của SOA

| Nhược điểm | Mô tả |
|-----------|-------|
| **ESB là single point of failure** | Nếu ESB chết, toàn bộ hệ thống ảnh hưởng |
| **ESB trở thành "god component"** | Quá nhiều logic tập trung ở ESB — trở nên phức tạp, khó bảo trì |
| **Overhead của SOAP/WS-*** | Message XML nặng, parsing tốn CPU |
| **Performance — ESB transformation** | Message transformation ở ESB gây latency |
| **Coupling qua ESB** | Mặc dù giao tiếp gián tiếp, nhưng ESB vẫn là điểm trung tâm |
| **Distributed transaction phức tạp** | Cần XA protocol cho cross-service transaction |
| **Vendor lock-in** | ESB vendor-specific (MuleSoft, IBM) khó di chuyển |

---

## 7. Khi nào nên dùng SOA?

### 7.1. Use Cases phù hợp

| Scenario | Mô tả |
|----------|-------|
| **Doanh nghiệp lớn** | Cần tích hợp nhiều hệ thống legacy với nhau |
| **Nhiều protocol khác nhau** | Cần giao tiếp qua SOAP, JMS, REST cùng lúc |
| **Enterprise governance** | Cần governance tập trung, standard enforcement |
| **Business process orchestration** | Cần BPM (Business Process Management) |
| **Legacy modernization** | Dần dần expose legacy systems qua service layer |

### 7.2. Use Cases không phù hợp

| Scenario | Thay thế tốt hơn |
|----------|------------------|
| Dự án nhỏ, nhanh | Monolith hoặc Modular Monolith |
| Cloud-native application | Microservices |
| Team nhỏ | Simpler architecture |
| Cần horizontal scaling mạnh | Microservices |
| Microservices-over-SOA | Microservices là evolution của SOA |

---

## 8. SOA vs Microservices vs Monolith

| Tiêu chí | Monolith | SOA | Microservices |
|----------|----------|-----|--------------|
| **Kích thước** | Một khối lớn | Lớn (business service) | Nhỏ (single function) |
| **Giao tiếp** | In-process call | ESB | API/REST/gRPC/MQ |
| **Database** | 1 database | Shared database | DB riêng mỗi service |
| **Deployment** | Toàn bộ | Toàn bộ hoặc service | Từng service |
| **Thay đổi** | Sửa cả codebase | Sửa cả service | Chỉ cần sửa service |
| **Entry barrier** | Thấp | Cao (ESB, tools) | Cao (distributed systems) |
| **Phù hợp** | MVP, dự án nhỏ | Doanh nghiệp lớn | Dự án cloud-native |

---

## 9. Các tiêu chuẩn và công nghệ trong SOA

| Tiêu chuẩn/Công nghệ | Mô tả |
|---------------------|-------|
| **SOAP** | Giao thức message dựa trên XML |
| **WSDL** | Ngôn ngữ mô tả service interface |
| **UDDI** | Tiêu chuẩn discover service |
| **WS-*** | Bộ tiêu chuẩn bổ sung (WS-Security, WS-ReliableMessaging...) |
| **ESB** | MuleSoft, IBM IIB, WSO2, Apache Camel |
| **BPM** | Business Process Management (Camunda, Bonita) |
| **XML/JSON** | Message format |
