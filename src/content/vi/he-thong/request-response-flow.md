# Request-Response Flow

## 1. Tổng quan

Trong hệ thống web hiện đại, một request từ người dùng phải đi qua **nhiều tầng** trước khi nhận được response. Việc hiểu rõ luồng này giúp **debug nhanh hơn**, **tối ưu hiệu năng** tốt hơn và **thiết kế hệ thống** hiệu quả hơn.

---

## 2. Sơ đồ tổng quan

```
Browser (User)
      │
      │  1. DNS Resolution
      ▼
CDN / Edge Network
      │
      │  2. WAF (Web Application Firewall)
      ▼
API Gateway / Load Balancer
      │
      ├──► Service A ──► Database A
      │              └──► Cache A
      │
      ├──► Service B ──► Message Queue ──► Worker
      │
      └──► Service C ──► Object Storage
                        └──► CDN (Static Assets)
```

---

## 3. Chi tiết từng bước

### Bước 1: DNS Resolution

| Khía cạnh | Mô tả |
|-----------|-------|
| **Thành phần** | DNS Resolver ( ISP / Google 8.8.8.8 / Cloudflare 1.1.1.1 ) |
| **Quá trình** | Domain → IP Address (cache → recursive → authoritative) |
| **Thời gian** | 5–50ms (có cache), 100–500ms (toàn bộ lookup) |
| **Tối ưu** | DNS caching, DNS prefetch |

```
Browser Cache ─► OS Cache ─► Resolver Cache ─► Root Server ─► TLD Server ─► Authoritative NS
```

### Bước 2: CDN (Content Delivery Network)

| Khía cạnh | Mô tả |
|-----------|-------|
| **Thành phần** | CloudFront, Cloudflare, Fastly, Akamai |
| **Xử lý** | Kiểm tra cache tại edge location gần user |
| **Static content** | Cache hit → trả về ngay (JS, CSS, images, fonts) |
| **API request** | Cache miss → chuyển tiếp đến origin |
| **Tối ưu** | Cache-Control headers, CDN purge khi deploy |

```nginx
# CDN Cache Headers
Cache-Control: public, max-age=31536000, immutable
# Immutable: content không bao giờ thay đổi (hashed filenames)
ETag: "abc123"
Last-Modified: Sat, 20 Mar 2026 10:00:00 GMT
```

### Bước 3: WAF (Web Application Firewall)

| Khía cạnh | Mô tả |
|-----------|-------|
| **Thành phần** | Cloudflare WAF, AWS WAF, ModSecurity |
| **Kiểm tra** | Request validation — chặn SQL injection, XSS, DDoS |
| **Rule sets** | OWASP Top 10, custom rules |
| **Rate limiting** | Giới hạn request/giây theo IP |

```bash
# Ví dụ: WAF chặn SQL injection pattern
# Block: ' OR 1=1 --
# Block: UNION SELECT
# Block: <script>alert()
```

### Bước 4: Load Balancer

| Khía cạnh | Mô tả |
|-----------|-------|
| **Thành phần** | AWS ALB/NLB, Nginx, HAProxy, Traefik |
| **Thuật toán** | Round Robin, Least Connections, IP Hash |
| **Health check** | Kiểm tra backend server còn sống không |
| **Sticky session** | Giữ user gắn với một server |

```nginx
# Nginx Load Balancing
upstream backend {
    least_conn;
    server 10.0.0.1:8080 weight=5;
    server 10.0.0.2:8080 weight=3;
    server 10.0.0.3:8080 weight=2 backup;  # Backup server
}

server {
    listen 443 ssl;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

### Bước 5: API Gateway

| Khía cạnh | Mô tả |
|-----------|-------|
| **Thành phần** | AWS API Gateway, Kong, Zuul, Spring Cloud Gateway |
| **Xác thực** | JWT validation, OAuth2 token verification |
| **Định tuyến** | Route đến service phù hợp dựa trên path |
| **Rate limiting** | Giới hạn request/giây theo API key hoặc user |
| **Transformation** | Transform request/response (header, payload) |

```yaml
# AWS API Gateway example
/api/users:
  get:
    x-amazon-apigateway-integration:
      type: HTTP_PROXY
      uri: http://user-service/api/users
      passthroughBehavior: when_no_match
    security:
      - BearerAuth: []

/api/orders:
  post:
    x-amazon-apigateway-integration:
      type: HTTP_PROXY
      uri: http://order-service/api/orders
    throttle:
      burstLimit: 100
      rateLimit: 50
```

### Bước 6: Microservices

| Khía cạnh | Mô tả |
|-----------|-------|
| **Xử lý** | Business logic tại service |
| **Gọi DB** | PostgreSQL, MySQL, MongoDB |
| **Cache check** | Redis → giảm tải database |
| **Async processing** | Gửi message qua Kafka/RabbitMQ |

```java
// Ví dụ: Spring Boot Service
@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final CacheService cacheService;
    private final KafkaTemplate<String, OrderEvent> kafkaTemplate;

    public OrderDto getOrder(Long orderId) {
        // 1. Check cache trước
        OrderDto cached = cacheService.getOrder(orderId);
        if (cached != null) return cached;

        // 2. Query database
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new OrderNotFoundException(orderId));

        OrderDto dto = toDto(order);

        // 3. Cache kết quả
        cacheService.setOrder(orderId, dto, Duration.ofMinutes(10));

        return dto;
    }

    @Transactional
    public OrderDto createOrder(CreateOrderRequest request) {
        Order order = buildOrder(request);
        order = orderRepository.save(order);

        // 4. Publish event cho các service khác
        kafkaTemplate.send("order-events",
            order.getId().toString(),
            new OrderEvent("ORDER_CREATED", order.getId(), Instant.now())
        );

        return toDto(order);
    }
}
```

### Bước 7: Layer database

| Thành phần | Vai trò | Ví dụ |
|-----------|---------|-------|
| **Primary Database** | Ghi dữ liệu chính | PostgreSQL, MySQL |
| **Read Replica** | Đọc dữ liệu (scale read) | MySQL Replica, Aurora Read Replica |
| **Cache** | Lưu trữ tạm kết quả query | Redis, Memcached |
| **Search** | Full-text search | Elasticsearch |
| **Object Storage** | Lưu file, media | AWS S3, GCS |
| **Time-series DB** | Dữ liệu theo thời gian | InfluxDB, TimescaleDB |

### Bước 8: Response quay về

```
Response đi ngược qua cùng chuỗi:
      │
      │  Response có thể được cache tại CDN
      ▼
Client nhận được response
      │
      │  Browser parse HTML → JS → CSS
      ▼
Render trang web
```

---

## 4. Ví dụ luồng đầy đủ

### GET /api/users/123

```
TỐI ƯU: 1. Browser check CDN cache (Cache-Control)
        2. Redis cache check
        3. Nếu miss → Query DB với index trên user_id
        4. Cache kết quả trong Redis (TTL 10 phút)
        5. Response có ETag
        6. Browser cache với Cache-Control
```

### POST /api/orders

```
TỐI ƯU: 1. Validate request (DTO validation)
        2. Kiểm tra tồn kho (Redis cache)
        3. Tạo order trong transaction
        4. Publish OrderCreatedEvent vào Kafka
        5. Return response NGAY (async: email, notification)
        6. Worker xử lý Kafka event → gửi email
```

---

## 5. Các thành phần bảo mật trong luồng

| Thành phần | Vai trò bảo mật |
|-----------|----------------|
| **HTTPS** | Mã hóa dữ liệu truyền end-to-end |
| **TLS 1.3** | Phiên bản TLS mới nhất, nhanh và bảo mật |
| **WAF** | Chặn tấn công web phổ biến (SQLi, XSS, LFI) |
| **API Gateway** | Xác thực JWT, OAuth2, rate limiting |
| **CloudFront/CDN** | Ẩn infrastructure, DDoS protection |
| **Secret Manager** | Quản lý credentials an toàn (AWS Secrets Manager) |
| **IAM/RBAC** | Phân quyền truy cập service |
| **Input Validation** | Validate tất cả input ở mọi layer |
| **Output Encoding** | Encode output để ngăn XSS |

---

## 6. Điểm tối ưu hiệu năng

| Vị trí | Kỹ thuật | Hiệu quả |
|--------|----------|---------|
| **DNS** | DNS prefetch, low-TTL for dynamic | Giảm DNS lookup |
| **CDN** | Cache static assets, HTTP/2 | Giảm latency, giảm server load |
| **TLS** | TLS 1.3 0-RTT, session resumption | Giảm handshake time |
| **Load Balancer** | Connection pooling, keep-alive | Giảm overhead |
| **API Gateway** | Response caching, request batching | Giảm backend calls |
| **Service** | Connection pooling, async I/O | Tăng throughput |
| **Database** | Indexing, query optimization, connection pooling | Giảm query time |
| **Cache** | Redis, Memcached, CDN cache | Giảm database load |
| **Compression** | Gzip, Brotli | Giảm bandwidth |
