# Database -> Caching

## 1. Why Caching Matters

Caching stores frequently accessed data in faster storage (usually memory) to reduce database load and latency.

Benefits:

- Lower response time
- Higher throughput
- Reduced DB cost
- Better resilience during traffic spikes

Core metric: **cache hit ratio**.

---

## 2. Caching Strategies

### 2.1 Cache-aside (most common)

1. Read from cache
2. On miss, read DB
3. Write result into cache

Pros: simple and widely used.
Cons: stale data risk if invalidation is weak.

### 2.2 Write-through

Write cache and DB in the same flow.

Pros: reads are fresh.
Cons: higher write latency.

### 2.3 Write-behind (write-back)

Write to cache first, flush to DB asynchronously.

Pros: very fast writes.
Cons: durability/consistency complexity.

### 2.4 Refresh-ahead

Refresh hot keys before TTL expires to reduce cache misses.

---

## 3. Invalidation and TTL

Stale data is the hardest cache problem.

### Invalidation patterns

- Delete-on-write for updated entities
- Versioned keys (`user:42:v17`)
- Event-driven invalidation (message bus/CDC)

### TTL guidance

- Volatile data: short TTL (seconds/minutes)
- Mostly static reference data: longer TTL
- Add jitter to TTL to prevent stampede

---

## 4. Cache Stampede Protection

When a hot key expires, many requests can hammer the DB simultaneously.

Mitigation:

- Request coalescing / singleflight
- Soft TTL + background refresh
- Distributed lock for rebuild path
- Circuit breaker + fallback defaults

---

## 5. Common Use Cases

- Session/token lookup
- User profile snapshots
- Product/catalog pages
- Rate limiting counters
- Leaderboards/realtime counters

---

## 6. Interview Q&A

### Q1: Cache-aside vs write-through?

Cache-aside is easier and dominant for reads. Write-through is better when read-after-write freshness is critical.

### Q2: How do you keep cache consistent with DB?

Use clear invalidation on writes, short-enough TTL, and event-driven updates for distributed services.

### Q3: What is cache stampede and how to prevent it?

Stampede is a miss storm on hot keys after expiry. Prevent with request coalescing, jittered TTL, and background refresh.