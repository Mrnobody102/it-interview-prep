# API Design - Thiết kế API

## 1. Tổng quan

**API (Application Programming Interface)** là cầu nối giữa các thành phần phần mềm. Thiết kế API tốt giúp:
- **Developer experience** tốt — dễ hiểu, dễ sử dụng
- **Scalability** — hỗ trợ mở rộng mà không phá vỡ clients
- **Security** — bảo vệ dữ liệu và ngăn truy cập trái phép
- **Performance** — nhanh, hiệu quả

---

## 2. Các kiểu API phổ biến

### 2.1. REST (Representational State Transfer)

| Khía cạnh | Mô tả |
|-----------|-------|
| **Nguyên tắc** | Stateless, dùng HTTP methods chuẩn (GET, POST, PUT, DELETE) |
| **Dữ liệu** | JSON (phổ biến), XML |
| **Ưu điểm** | Dễ hiểu, widely adopted, caching tốt |
| **Nhược điểm** | Dễ over-fetching hoặc under-fetching, không có built-in contract |
| **Phù hợp** | Public APIs, web services, CRUD operations |

```http
### REST Examples
GET    /api/users          -- Lấy danh sách users
GET    /api/users/123      -- Lấy user có ID 123
POST   /api/users          -- Tạo user mới
PUT    /api/users/123      -- Cập nhật user 123
DELETE /api/users/123      -- Xóa user 123
```

### 2.2. GraphQL

| Khía cạnh | Mô tả |
|-----------|-------|
| **Nguyên tắc** | Client chỉ lấy đúng dữ liệu cần, tránh over/under-fetching |
| **Dữ liệu** | JSON (query language) |
| **Ưu điểm** | Flexible queries, giảm số roundtrips, strongly typed schema |
| **Nhược điểm** | Khó caching (HTTP caching không hoạt động), query phức tạp ảnh hưởng server |
| **Phù hợp** | Mobile apps, complex data requirements, BFF (Backend for Frontend) |

```graphql
# GraphQL Query
query {
  user(id: "123") {
    name
    email
    orders(last: 5) {
      items {
        product { name }
        quantity
      }
    }
  }
}
```

### 2.3. gRPC (Google Remote Procedure Call)

| Khía cặnh | Mô tả |
|-----------|-------|
| **Nguyên tắc** | Xây dựng trên HTTP/2, dùng Protocol Buffers (binary) |
| **Dữ liệu** | Binary (Protobuf) |
| **Ưu điểm** | Hiệu năng cao (smaller payload, multiplexing), strongly typed, bi-directional streaming |
| **Nhược điểm** | Dữ liệu binary không human-readable, cần .proto definition |
| **Phù hợp** | Microservices, real-time streaming, high-performance internal APIs |

```protobuf
// user.proto
syntax = "proto3";
package user;

service UserService {
  rpc GetUser(GetUserRequest) returns (User);
  rpc StreamUsers(StreamUsersRequest) returns (stream User);
}

message GetUserRequest {
  string user_id = 1;
}

message User {
  string id = 1;
  string name = 2;
  string email = 3;
}
```

### 2.4. So sánh REST vs GraphQL vs gRPC

| Tiêu chí | REST | GraphQL | gRPC |
|----------|------|---------|------|
| **Payload** | JSON (human-readable) | JSON (custom shape) | Binary Protobuf |
| **Caching** | HTTP caching ✅ | Khó (cần client-side) | HTTP/2 multiplexing |
| **Type safety** | Không (hoặc OpenAPI) | Có (schema) | Có (.proto) |
| **Overfetching** | Có | Không | Không |
| **Underfetching** | Có | Không | Không |
| **Streaming** | Không native | Không native | Bidirectional streaming |
| **Browser support** | ✅ Native | ✅ Native | ⚠️ Cần grpc-web |
| **Learning curve** | Thấp | Trung bình | Cao |
| **Tooling** | Nhiều | Growing | Good (but less) |
| **Use case** | Public APIs | Mobile, BFF | Microservices, real-time |

---

## 3. REST Best Practices

### 3.1. Naming Conventions

| Quy tắc | Tốt | Xấu |
|---------|-----|-----|
| **Dùng danh từ, không dùng động từ** | `GET /users`, `POST /orders` | `GET /getUsers` |
| **Dùng số nhiều** | `GET /users/123` | `GET /user/123` |
| **Snake_case hay kebab-case** | `/user-profiles`, `/order_items` | `/userProfiles` |
| **Nhất quán** | `/users/{id}/orders` | `/getUserOrders?id=` |

### 3.2. HTTP Status Codes

| Code | Ý nghĩa | Khi nào dùng |
|------|---------|-------------|
| **200 OK** | Thành công | GET thành công, PUT/PATCH update thành công |
| **201 Created** | Tạo thành công | POST tạo resource mới |
| **204 No Content** | Thành công, không có body | DELETE thành công |
| **400 Bad Request** | Request không hợp lệ | Validation error |
| **401 Unauthorized** | Chưa xác thực | Missing/invalid token |
| **403 Forbidden** | Không có quyền | Đã xác thực nhưng không có quyền |
| **404 Not Found** | Resource không tồn tại | Resource ID không tồn tại |
| **409 Conflict** | Conflict | Duplicate resource, version conflict |
| **422 Unprocessable Entity** | Validation failed | Dữ liệu hợp lệ về format nhưng không hợp lệ về nghiệp vụ |
| **429 Too Many Requests** | Rate limited | Vượt quota |
| **500 Internal Server Error** | Lỗi server | Lỗi không xác định |
| **503 Service Unavailable** | Service tạm dừng | Maintenance, overload |

### 3.3. API Versioning

| Phương pháp | Ví dụ | Ưu điểm | Nhược điểm |
|-------------|-------|---------|-----------|
| **URL Path** | `/v1/users`, `/v2/users` | **Phổ biến nhất**, rõ ràng | Phá vỡ URL consistency |
| **Query String** | `/users?version=2` | Không phá vỡ URL | Khó cache |
| **Header** | `Accept: application/vnd.api.v2+json` | URL sạch | Không visible, phức tạp |
| **Content Negotiation** | `Accept: application/vnd.api.v2+json` | API-driven | Phức tạp |

> **Khuyến nghị**: Dùng **URL Path versioning** — đơn giản, rõ ràng, dễ debug.

### 3.4. Pagination

```json
// Offset-based pagination
GET /api/users?page=2&limit=20
{
  "data": [...],
  "pagination": {
    "page": 2,
    "limit": 20,
    "total": 1000,
    "totalPages": 50
  }
}

// Cursor-based pagination (tốt hơn cho large datasets)
GET /api/users?cursor=eyJpZCI6MTIzfQ&limit=20
{
  "data": [...],
  "nextCursor": "eyJpZCI6MTQzfQ",
  "hasMore": true
}
```

### 3.5. Error Response Format

```json
// ✅ Chuẩn error format
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request parameters",
    "details": [
      {
        "field": "email",
        "message": "Email format is invalid"
      },
      {
        "field": "age",
        "message": "Age must be greater than 0"
      }
    ],
    "requestId": "req_abc123xyz",
    "timestamp": "2026-03-20T10:30:00Z"
  }
}
```

---

## 4. Authentication & Security

### 4.1. Các phương pháp Authentication

| Phương pháp | Mô tả | Phù hợp |
|-------------|-------|--------|
| **API Key** | Key static cho mỗi client | Internal APIs, simple use cases |
| **Basic Auth** | Username/password encoded | Legacy systems, internal |
| **JWT** | Token stateless, có expiry | Modern REST APIs, stateless |
| **OAuth 2.0** | Delegated authorization | Public APIs, third-party access |
| **mTLS** | Mutual TLS (certificate) | High-security internal APIs |

### 4.2. JWT Structure

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
   .
eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ
   .
SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
   │
   │ Header (Algorithm, Type)
   │ Payload (Claims: sub, name, iat, exp, roles)
   │ Signature (HMAC-SHA256)
```

```json
// JWT Payload example
{
  "sub": "user_123",
  "name": "Nguyen Van A",
  "email": "a@example.com",
  "roles": ["USER", "ADMIN"],
  "iat": 1710914400,
  "exp": 1710999900,
  "iss": "https://api.example.com"
}
```

### 4.3. Rate Limiting

```json
// Response headers
X-RateLimit-Limit: 1000       // Số request tối đa
X-RateLimit-Remaining: 999   // Số request còn lại
X-RateLimit-Reset: 1710918000 // Thời điểm reset (Unix timestamp)
Retry-After: 30              // Số giây chờ (khi bị limit)
```

---

## 5. API Documentation

### 5.1. OpenAPI (Swagger)

```yaml
# openapi.yaml
openapi: 3.0.3
info:
  title: User Management API
  version: 2.0.0
  description: API for managing users

paths:
  /users/{id}:
    get:
      summary: Get user by ID
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: integer
      responses:
        '200':
          description: User found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'
        '404':
          $ref: '#/components/responses/NotFound'

components:
  schemas:
    User:
      type: object
      properties:
        id:
          type: integer
        name:
          type: string
        email:
          type: string
          format: email
```

---

## 6. Performance Optimization

| Kỹ thuật | Mô tả |
|----------|-------|
| **Caching** | Response caching (Cache-Control, ETag) |
| **Compression** | Gzip, Brotli |
| **Pagination** | Tránh trả về quá nhiều data |
| **Field selection** | GraphQL hoặc query params (`?fields=id,name`) |
| **Async processing** | Webhook, polling thay vì long-polling |
| **Batch requests** | Gộp nhiều requests thành một |
| **CDN** | Cache static/dynamic responses tại edge |
