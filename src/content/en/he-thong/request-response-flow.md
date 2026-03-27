# System Design

## 16. Request-Response Flow

### 16.1. Full Request-Response Flow

Understanding the complete journey of a request through a production system is fundamental to system design.

### 16.2. Step-by-Step Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│  STEP 1: DNS Resolution                                                │
│  Client → DNS Resolver → TLD Server → Authoritative NS → IP Address   │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  STEP 2: TCP Connection (3-Way Handshake)                              │
│  Client --- SYN ---→ Server                                            │
│  Client ←-- SYN-ACK -- Server                                          │
│  Client --- ACK ---→ Server                                            │
│  Connection established                                                │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  STEP 3: TLS Handshake (HTTPS)                                         │
│  Client → ClientHello (supported ciphers, TLS version)                 │
│  Client ← ServerHello (chosen cipher, certificate)                     │
│  Client → Key exchange (premaster secret)                              │
│  Client & Server derive session keys                                   │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  STEP 4: Load Balancer                                                 │
│  Request → Load Balancer                                               │
│  LB selects backend server (health check passed)                        │
│  LB forwards request (may add headers like X-Real-IP)                   │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  STEP 5: API Gateway / Reverse Proxy                                    │
│  - Authentication (verify JWT/API key)                                  │
│  - Rate limiting check                                                  │
│  - Request validation                                                   │
│  - Route to appropriate microservice                                    │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  STEP 6: Microservice / Application Server                              │
│  - Business logic execution                                             │
│  - Database queries (possibly hitting cache first)                      │
│  - Service-to-service calls (with circuit breaker)                      │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  STEP 7: Data Layer (Cache + Database)                                  │
│  Check Redis Cache                                                     │
│    HIT? → Return cached data                                           │
│    MISS? → Query PostgreSQL                                            │
│          → Store in Redis (with TTL)                                   │
│          → Return data                                                 │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  STEP 8: Response Assembly                                             │
│  - Serialize response (JSON/Protobuf)                                   │
│  - Response headers (Cache-Control, CORS)                               │
│  - HTTP status code                                                     │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  STEP 9: Reverse Path                                                  │
│  Application Server → API Gateway (add monitoring headers)               │
│                → Load Balancer (health check metrics)                  │
│                → Client (TLS encrypted response)                        │
└─────────────────────────────────────────────────────────────────────────┘
```

### 16.3. Typical Latency Breakdown

| Step | Latency | Notes |
|---|---|---|
| DNS lookup | 1–100 ms | Cached DNS helps significantly |
| TCP handshake | 1–3 ms | Can be skipped with connection keep-alive |
| TLS handshake | 3–10 ms | TLS 1.3 reduces this |
| Load balancer routing | < 1 ms | Near-instant |
| API gateway processing | 1–5 ms | Auth, validation, routing |
| Service logic | 5–100 ms | Depends on complexity |
| Database query | 1–50 ms | Optimized queries, proper indexing |
| Cache lookup | 0.1–1 ms | Redis: sub-millisecond |
| Network between services | 1–5 ms | Local network |

> **Total typical round-trip (optimized system):** 20–100 ms

### 16.4. Critical Path vs. Non-Critical Path

| Path | Description | Optimization Priority |
|---|---|---|
| **Critical path** | User-facing request/response | Highest — every ms counts |
| **Background jobs** | Async processing (emails, reports) | Medium — can tolerate delays |
| **Event-driven** | Kafka messages, webhooks | Low — eventually consistent |

### 16.5. Async Flow Example

For long-running operations, the request-response flow splits:

```
Synchronous (User Request):
Client → API → "Accepted. Job ID: 1234" → Client polls /jobs/1234

Asynchronous (Background Processing):
API → Message Queue → Worker Service → Database
                                        ↓
                                        (Notification Service)
                                        ↓
Client ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← (Webhook / SSE / WebSocket)
```

### 16.6. End-to-End Request Flow Example

```
Browser: GET https://api.example.com/api/v1/products?category=electronics&page=1
  │
  ├─→ [~50ms] DNS: api.example.com → 203.0.113.42
  │
  ├─→ [~5ms]  TCP SYN → 203.0.113.42:443
  │   ← TCP SYN-ACK
  │   → TCP ACK
  │
  ├─→ [~10ms] TLS 1.3 Handshake
  │
  ├─→ [~1ms]  Nginx (Load Balancer)
  │           Health check: OK, Route to upstream server-2
  │
  ├─→ [~2ms]  API Gateway
  │           ✓ JWT valid (user: alice)
  │           ✓ Rate limit OK (950/1000)
  │           Route: /api/v1/products → product-service
  │
  ├─→ [~1ms]  Redis Cache
  │           GET product:category:electronics:page:1
  │           MISS
  │
  ├─→ [~15ms] PostgreSQL
  │           SELECT * FROM products
  │           WHERE category = 'electronics'
  │           LIMIT 20 OFFSET 0
  │           Index used: idx_category_created
  │
  ├─→ [~1ms]  Redis Cache
  │           SETEX product:category:electronics:page:1:3600 {json}
  │
  ├─→ [~1ms]  Serialize response to JSON
  │
  └─→ [~60ms] Total RTT (optimized, same region)
```

### 16.7. Where Bottlenecks Occur

| Bottleneck | Symptom | Solution |
|---|---|---|
| **Database queries** | High latency, slow p99 | Indexing, query optimization, caching |
| **N+1 queries** | Multiple small DB round-trips | Eager loading, batch queries |
| **No cache** | Repeated expensive computations | Redis caching with proper TTL |
| **Synchronous calls** | Blocking, slow response | Async/await, parallel calls |
| **Large payload** | High bandwidth, slow transfer | Compression, pagination, filtering |
| **Connection pool exhaustion** | Requests queuing | Tune pool size, add replicas |

> **Tip:** In system design interviews, walk through the request flow step by step when asked "how would you design X?" This demonstrates deep understanding and helps identify where optimizations are needed.
