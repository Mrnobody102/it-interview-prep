# Chủ đề Caching

## 1. Tổng quan về Caching

### 1.1. Caching là gì?

Caching là kỹ thuật lưu trữ bản sao của dữ liệu thường truy cập vào một tầng lưu trữ tốc độ cao (cache), nhằm giảm tải cho database chính và cải thiện thời gian phản hồi của ứng dụng. Cache có thể được lưu trữ ở nhiều tầng khác nhau trong kiến trúc ứng dụng:

- **In-memory cache** (Redis, Memcached): Lưu trữ trong RAM, tốc độ rất nhanh, phù hợp cho dữ liệu hay thay đổi.
- **Disk-based cache**: Lưu trữ trên ổ đĩa, tốc độ chậm hơn nhưng dung lượng lớn hơn.
- **CDN (Content Delivery Network)**: Cache nội dung tĩnh (hình ảnh, CSS, JavaScript) tại các edge server gần người dùng.
- **Browser cache**: Cache tài nguyên phía client để giảm số lượng request đến server.

### 1.2. Tại sao cần Caching?

Trong hầu hết các hệ thống, tỷ lệ đọc/ghi thường rất chênh lệch (read-heavy workload). Caching giúp:

- **Giảm độ trễ**: Thời gian truy cập cache tính bằng microseconds, so với milliseconds của database.
- **Giảm tải database**: Số lượng truy vấn đến database giảm đáng kể, tiết kiệm tài nguyên.
- **Tăng throughput**: Hệ thống có thể xử lý nhiều request đồng thời hơn.
- **Giảm chi phí vận hành**: Giảm nhu cầu scale database, tiết kiệm chi phí hạ tầng.

### 1.3. Cache Hit vs Cache Miss

- **Cache Hit**: Dữ liệu được tìm thấy trong cache. Thời gian phản hồi nhanh.
- **Cache Miss**: Dữ liệu không có trong cache. Cần truy vấn nguồn dữ liệu gốc (database) và cập nhật cache.

> **Mẹo:** Tỷ lệ cache hit càng cao, hiệu năng hệ thống càng tốt. Cần theo dõi tỷ lệ này để điều chỉnh chiến lược cache phù hợp. Tỷ lệ trên 80% thường được coi là tốt.

---

## 2. Các chiến lược Caching phổ biến

### 2.1. Cache-Aside (Lazy Loading)

Đây là chiến lược phổ biến nhất. Ứng dụng chủ động quản lý cache:

1. Khi cần đọc dữ liệu, kiểm tra cache trước.
2. Nếu **cache hit** -> trả dữ liệu từ cache.
3. Nếu **cache miss** -> truy vấn database, cập nhật cache, rồi trả dữ liệu.

```java
// Ví dụ Cache-Aside trong Java
public User getUser(Long userId) {
    // Bước 1: Thử đọc từ cache
    User user = cache.get("user:" + userId);

    if (user != null) {
        return user; // Cache hit
    }

    // Bước 2: Cache miss -> đọc từ database
    user = userRepository.findById(userId).orElse(null);

    if (user != null) {
        // Bước 3: Cập nhật cache
        cache.set("user:" + userId, user, Duration.ofMinutes(30));
    }

    return user;
}
```

```python
# Ví dụ Cache-Aside trong Python
def get_user(user_id: int) -> Optional[User]:
    # Thử đọc từ cache
    cache_key = f"user:{user_id}"
    cached = redis_client.get(cache_key)

    if cached:
        return User.parse_raw(cached)  # Cache hit

    # Cache miss -> đọc từ database
    user = db.query(User).filter(User.id == user_id).first()

    if user:
        redis_client.setex(cache_key, 1800, user.json())  # TTL 30 phút

    return user
```

**Ưu điểm:**
- Chỉ cache dữ liệu thực sự được sử dụng.
- Dễ triển khai và quản lý.
- Không làm tăng độ trễ ghi (write latency).

**Nhược điểm:**
- Lần đầu truy cập luôn là cache miss (cold start).
- Dữ liệu có thể không nhất quán nếu database thay đổi mà cache không được cập nhật.

### 2.2. Read-Through Cache

Tương tự Cache-Aside, nhưng logic truy vấn được ẩn trong lớp cache. Client chỉ cần yêu cầu dữ liệu mà không cần biết cache ở đâu.

```java
// Cache provider tự động load khi miss
User user = cacheLoader.get("user:123");
// Nếu miss, cache loader tự query DB và update cache
```

> **Phân biệt:** Cache-Aside là ứng dụng quản lý cache. Read-Through là cache tự động load khi miss.

### 2.3. Write-Through Cache

Dữ liệu được ghi đồng thời vào cả database và cache:

1. Ghi vào cache trước.
2. Ghi vào database.
3. Xác nhận ghi thành công.

```java
public void saveUser(User user) {
    // Bước 1: Ghi vào cache
    cache.set("user:" + user.getId(), user, Duration.ofMinutes(30));
    // Bước 2: Ghi vào database
    userRepository.save(user);
}
```

**Ưu điểm:**
- Dữ liệu trong cache luôn đồng nhất với database.
- Đọc sau ghi luôn đảm bảo có dữ liệu mới nhất.

**Nhược điểm:**
- Tăng độ trễ ghi (phải ghi 2 nơi).
- Có thể lãng phí cache nếu dữ liệu ít được đọc lại.

### 2.4. Write-Behind (Write-Back) Cache

Dữ liệu được ghi vào cache trước, sau đó đồng bộ xuống database một cách bất đồng bộ (batch hoặc theo interval):

```java
public void updateUser(User user) {
    // Ghi vào cache ngay lập tức
    cache.set("user:" + user.getId(), user, Duration.ofMinutes(30));

    // Đánh dấu cần đồng bộ (sẽ sync sau)
    syncQueue.add(new SyncTask("user", user.getId()));
}
```

**Ưu điểm:**
- Write latency cực thấp (chỉ ghi vào cache).
- Tăng throughput cho các workload write-heavy.
- Batch sync giảm số lượng I/O database.

**Nhược điểm:**
- Rủi ro mất dữ liệu nếu cache fail trước khi sync xuống DB.
- Phức tạp trong việc xử lý đồng bộ và rollback.

> **Cảnh báo:** Write-Behind chỉ nên dùng cho dữ liệu có thể chấp nhận mất mát, hoặc cần có cơ chế persistence (Redis AOF, battery-backed cache) để đảm bảo an toàn dữ liệu.

### 2.5. Refresh-Ahead Cache

Cache tự động refresh (làm mới) các entry sắp hết hạn trước khi chúng thực sự hết hạn:

```java
// Cấu hình refresh-ahead
CacheConfig config = CacheConfig.builder()
    .ttl(Duration.ofMinutes(30))
    .refreshWindow(Duration.ofMinutes(5))  // Refresh 5 phút trước khi hết hạn
    .build();
```

**Ưu điểm:** Giảm thiểu cache miss vì dữ liệu luôn được làm mới trước khi hết hạn.

**Nhược điểm:** Có thể gây tải không cần thiết nếu dữ liệu ít được truy cập.

---

## 3. Cache Invalidation (Vô hiệu hoá Cache)

### 3.1. Tại sao cần Invalidation?

Khi dữ liệu nguồn (database) thay đổi, cache phải được cập nhật hoặc xoá để tránh trả về dữ liệu cũ (stale data).

### 3.2. Các chiến lược Invalidation

| Chiến lược | Mô tả | Khi nào dùng |
|---|---|---|
| **Cache Invalidation** | Xoá cache khi dữ liệu thay đổi | Khi cần dữ liệu luôn fresh |
| **TTL-based** | Cache tự hết hạn sau khoảng thời gian | Dữ liệu có thể chấp nhận stale trong thời gian ngắn |
| **Event-driven** | Subscribe thay đổi từ database qua CDC/Event | Microservices, distributed systems |
| **Version-based** | Dùng version number để detect stale | Khi cần consistency chặt chẽ |

### 3.3. Invalidation patterns

```java
// Xoá cache tường minh khi update
public void updateUser(User user) {
    userRepository.save(user);
    cache.evict("user:" + user.getId());  // Xoá cache liên quan
}

// Invalidate tất cả related cache entries
public void invalidateUserCache(Long userId) {
    cache.evictPattern("user:*:" + userId);  // Xoá tất cả cache liên quan đến user
    cache.evictPattern("user-list:*");  // Xoá cả list cache
}
```

```python
# Ví dụ Cache Invalidation trong FastAPI
@router.put("/users/{user_id}")
async def update_user(user_id: int, user_data: UserUpdate):
    user = await db.update_user(user_id, user_data)

    # Invalidate cache
    redis_client.delete(f"user:{user_id}")
    redis_client.delete(f"user-list:*")  # Cần SCAN thay vì DELETE với pattern

    return user
```

### 3.4. Sử dụng Redis Pattern để Invalidate nhiều keys

```python
# Xoá tất cả keys theo pattern trong Redis
def invalidate_pattern(pattern: str):
    cursor = 0
    while True:
        cursor, keys = redis_client.scan(cursor, match=pattern, count=100)
        if keys:
            redis_client.delete(*keys)
        if cursor == 0:
            break
```

---

## 4. TTL (Time-To-Live)

### 4.1. TTL là gì?

TTL là thời gian tồn tại tối đa của một entry trong cache trước khi nó tự động bị xoá.

### 4.2. Cấu hình TTL hợp lý

```bash
# Redis: Set TTL khi tạo key
SET user:123 "data" EX 1800      # 30 phút
SET session:abc "token" EX 3600 # 1 giờ
```

```python
# Python Redis: TTL khi SET
redis_client.setex("user:123", 1800, json.dumps(user_data))
# Hoặc dùng pipeline cho nhiều keys
pipe = redis_client.pipeline()
pipe.setex("user:123", 1800, data)
pipe.setex("user:456", 1800, data)
pipe.execute()
```

### 4.3. Phân loại TTL theo loại dữ liệu

| Loại dữ liệu | TTL đề xuất | Lý do |
|---|---|---|
| Session, Token | 15 - 60 phút | Cần expire để bảo mật |
| User Profile | 15 - 60 phút | Thay đổi không thường xuyên |
| Danh sách, Catalog | 30 - 60 phút | Có thể stale trong thời gian ngắn |
| Kết quả tính toán nặng | 1 - 24 giờ | Phụ thuộc vào tần suất thay đổi nguồn |
| Dữ liệu reference, config | 1 - 24 giờ hoặc event-driven | Ít thay đổi |
| File nhị phân, CDN | 1 ngày - 1 tuần | Phụ thuộc vào pipeline deploy |

> **Lưu ý:** TTL quá ngắn -> cache hit thấp. TTL quá dài -> dữ liệu có thể stale. Cần cân bằng dựa trên tính chất dữ liệu.

---

## 5. Redis vs Memcached

### 5.1. So sánh Redis và Memcached

| Tiêu chí | Redis | Memcached |
|---|---|---|
| **Kiểu dữ liệu** | Strings, Hashes, Lists, Sets, Sorted Sets, Streams, Geospatial | Chỉ Strings (key-value đơn giản) |
| **Persistence** | Hỗ trợ RDB + AOF | Không (in-memory only, restart = mất hết) |
| **Replication** | Master-Slave, Sentinel, Cluster | Không hỗ trợ native replication |
| **Performance** | ~100K-1M ops/sec | ~100K-500K ops/sec |
| **Memory efficiency** | Tuỳ thuộc data structure | Tốt cho simple key-value strings |
| **Atomic operations** | Hỗ trợ transaction, Lua scripting | Không |
| **Cluster mode** | Có (Redis Cluster) | Ketal (client-side sharding) |
| **Expiry** | Per-key TTL | Per-key TTL |
| **Use case** | Complex data structures, pub/sub, leaderboard | Simple caching, session storage |

### 5.2. Redis Data Structures

```bash
# String - caching đơn giản
SET product:100 '{"name":"Laptop","price":999}' EX 3600

# Hash - lưu object
HSET user:123 name "Nguyen Van A" email "a@example.com" age "25"
HGETALL user:123

# List - queue, recent activity
LPUSH activity:user:123 "login"
LPUSH activity:user:123 "view_product"
LRANGE activity:user:123 0 9  # Lấy 10 hoạt động gần nhất

# Set - tags, unique items
SADD tags:product:100 "electronics" "laptop" "gaming"
SMEMBERS tags:product:100

# Sorted Set - leaderboard, ranking
ZADD leaderboard 1500 "player1"
ZADD leaderboard 2300 "player2"
ZREVRANGE leaderboard 0 9  # Top 10 players
```

### 5.3. Khi nào dùng Redis? Khi nào dùng Memcached?

**Dùng Redis khi:**
- Cần lưu trữ nhiều kiểu dữ liệu (hash, set, sorted set...).
- Cần persistence (AOF/RDB) để phục hồi sau restart.
- Cần replication (read replicas).
- Cần atomic operations hoặc Lua scripting.
- Xây dựng pub/sub, message queue, rate limiting, leaderboard.

**Dùng Memcached khi:**
- Chỉ cần caching đơn giản (key-value string).
- Cần performance cực cao cho simple data.
- Không cần persistence.
- Multi-process sharing (PHP-FPM với `memcached` extension).
- Dễ triển khai, cấu hình đơn giản.

---

## 6. Distributed Cache

### 6.1. Khái niệm Distributed Cache

Distributed cache là cache được chia sẻ giữa nhiều server/node trong hệ thống. Thay vì mỗi server có cache riêng (local cache), tất cả server dùng chung một cache cluster.

### 6.2. Lợi ích của Distributed Cache

- **Consistency**: Tất cả instances nhìn thấy cùng dữ liệu cache.
- **Fault tolerance**: Một node fail không ảnh hưởng toàn bộ cache.
- **Scalability**: Dễ dàng scale out bằng cách thêm nodes.
- **Reduced memory waste**: Tránh trùng lặp dữ liệu giữa các instances.

### 6.3. Redis Cluster

Redis Cluster là giải pháp distributed cache phổ biến nhất cho Redis:

```bash
# Redis Cluster architecture:
# 6 nodes (3 master + 3 replica)
# Hash slot: 16384 slots được phân bổ đều
# Mỗi master có 1 replica tự động failover
```

```python
# Kết nối Redis Cluster trong Python
from redis.cluster import RedisCluster

rc = RedisCluster(
    host="redis-cluster.example.com",
    port=6379,
    decode_responses=True
)

# Redis Cluster tự động routing đến đúng node
rc.set("user:123", "data")
value = rc.get("user:123")
```

### 6.4. Các vấn đề cần lưu ý trong Distributed Cache

**1. Network Partition:**
- Khi mạng bị phân mảnh, một số nodes không thể giao tiếp với nhau.
- Giải pháp: Redis Sentinel cho failover tự động, cấu hình `min-replicas-to-write`.

**2. Cache Stampede (Thundering Herd):**
- Khi cache miss, nhiều requests cùng query database cùng lúc.
- Giải pháp: Lock-based protection, probabilistic early expiration.

```python
# Giải pháp Cache Stampede với lock
import hashlib, time

def get_with_lock(key, ttl=300):
    cached = redis_client.get(key)
    if cached:
        return json.loads(cached)

    # Thử acquire lock
    lock_key = f"lock:{key}"
    lock_acquired = redis_client.set(lock_key, "1", nx=True, ex=10)

    if lock_acquired:
        try:
            # Query database
            data = db.query(key)
            redis_client.setex(key, ttl, json.dumps(data))
            return data
        finally:
            redis_client.delete(lock_key)
    else:
        # Đợi rồi thử lại
        time.sleep(0.1)
        return redis_client.get(key)
```

**3. Cache Penetration:**
- Request truy vấn key không tồn tại -> luôn miss -> luôn hit database.
- Giải pháp: Bloom filter, caching các key null (với TTL ngắn).

```python
# Giải pháp Cache Penetration
def get_user(user_id):
    cache_key = f"user:{user_id}"

    # Kiểm tra Bloom filter trước
    if bloom_filter.might_contain(cache_key):
        return None  # Chắc chắn không tồn tại

    cached = redis_client.get(cache_key)
    if cached:
        return json.loads(cached)

    user = db.query(user_id)
    if user:
        redis_client.setex(cache_key, 1800, json.dumps(user))
    else:
        # Cache kết quả null với TTL ngắn
        redis_client.setex(f"null:{cache_key}", 60, "1")
        bloom_filter.add(cache_key)

    return user
```

---

## 7. Multi-Layer Caching

### 7.1. Kiến trúc Multi-Layer

```
Browser Cache
     ↓
CDN (Content Delivery Network)
     ↓
API Gateway Cache
     ↓
Application Local Cache (L1) → Redis Cache (L2)
     ↓
Database
```

### 7.2. L1 Cache (Local Cache - In-Process)

```java
// Caffeine Cache - high-performance local cache cho Java
Cache<String, User> localCache = Caffeine.newBuilder()
    .maximumSize(10_000)
    .expireAfterWrite(Duration.ofMinutes(5))
    .build();

// Local cache + Redis cache combined
public User getUser(String userId) {
    // L1: Local cache check
    User user = localCache.getIfPresent(userId);
    if (user != null) {
        return user;
    }

    // L2: Redis cache check
    String cached = redis.get("user:" + userId);
    if (cached != null) {
        user = deserialize(cached);
        localCache.put(userId, user);  // Populate L1
        return user;
    }

    // Miss all -> query DB
    user = userRepository.findById(userId);
    redis.setex("user:" + userId, 1800, serialize(user));
    localCache.put(userId, user);
    return user;
}
```

### 7.3. L2 Cache (Redis)

Redis là L2 cache phổ biến nhất, đặt giữa application và database.

---

## 8. Cache Monitoring và Best Practices

### 8.1. Monitoring Metrics quan trọng

```bash
# Redis monitoring commands
INFO stats           # Toàn bộ stats
INFO memory          # Memory usage
INFO stats | grep -E "keyspace_hits|keyspace_misses"  # Cache hit/miss rate
INFO commandstats    # Command usage stats

# Tính hit rate
# hit_rate = keyspace_hits / (keyspace_hits + keyspace_misses) * 100
```

```python
# Monitoring cache metrics trong Python
def get_cache_stats(redis_client):
    info = redis_client.info('stats')
    hits = info.get('keyspace_hits', 0)
    misses = info.get('keyspace_misses', 0)
    total = hits + misses

    hit_rate = (hits / total * 100) if total > 0 else 0
    memory = redis_client.info('memory')

    return {
        "hits": hits,
        "misses": misses,
        "hit_rate_percent": round(hit_rate, 2),
        "memory_used_mb": memory.get('used_memory_human'),
        "connected_clients": info.get('connected_clients'),
    }
```

### 8.2. Best Practices Tổng hợp

| Best Practice | Mô tả |
|---|---|
| **Đặt TTL hợp lý** | Không quá ngắn (hit rate thấp), không quá dài (stale data) |
| **Key naming convention** | Sử dụng format nhất quán: `prefix:entity:id:field` |
| **Tránh oversized values** | Dữ liệu lớn làm chậm Redis, nén nếu cần |
| **Dùng connection pooling** | Tái sử dụng connections thay vì tạo mới mỗi lần |
| **Monitor memory** | Redis evict keys khi hết memory, cấu hình `maxmemory-policy` phù hợp |
| **Avoid hot keys** | Một key quá hot (nhiều request) gây bottleneck |
| **Pipeline commands** | Dùng pipeline cho nhiều operations để giảm round-trip |
| **Security** | Redis binding, password authentication, TLS |

### 8.3. Key Naming Convention

```
# Format: {service}:{entity}:{id}:{field}
user:profile:1234          # User profile
user:profile:1234:session # Session data
product:catalog:5678      # Product details
cache:session:token:abc123 # Session token
rate:limit:ip:192.168.1.1 # Rate limiting by IP
```

### 8.4. Redis Pipeline cho batch operations

```python
# Bad: Nhiều round-trips
for user_id in user_ids:
    redis_client.get(f"user:{user_id}")

# Good: Một round-trip với pipeline
pipe = redis_client.pipeline()
for user_id in user_ids:
    pipe.get(f"user:{user_id}")
results = pipe.execute()
```

---

## 9. Các Use Cases Caching phổ biến

### 9.1. Session Storage

```python
# Redis Session Storage
from redis import Redis
import json

redis_client = Redis(host='localhost', port=6379, db=0)

def create_session(user_id: int) -> str:
    session_id = secrets.token_urlsafe(32)
    session_data = {
        "user_id": user_id,
        "created_at": datetime.now().isoformat(),
    }
    redis_client.setex(
        f"session:{session_id}",
        3600,  # TTL: 1 giờ
        json.dumps(session_data)
    )
    return session_id

def get_session(session_id: str) -> dict:
    data = redis_client.get(f"session:{session_id}")
    return json.loads(data) if data else None
```

### 9.2. Rate Limiting

```python
# Rate Limiting với Redis Sliding Window
def is_rate_limited(client_id: str, max_requests: int, window_seconds: int) -> bool:
    key = f"rate:{client_id}"
    now = time.time()
    window_start = now - window_seconds

    pipe = redis_client.pipeline()
    # Xoá các entries cũ
    pipe.zremrangebyscore(key, 0, window_start)
    # Thêm request hiện tại
    pipe.zadd(key, {str(now): now})
    # Đếm số requests trong window
    pipe.zcard(key)
    # Set expiry cho key
    pipe.expire(key, window_seconds)

    results = pipe.execute()
    count = results[2]

    return count > max_requests
```

### 9.3. Distributed Lock

```python
# Distributed Lock với Redis
import time, uuid

class RedisLock:
    def __init__(self, redis_client, lock_name: str, timeout: int = 10):
        self.redis = redis_client
        self.lock_name = f"lock:{lock_name}"
        self.timeout = timeout
        self.token = uuid.uuid4().hex

    def acquire(self, blocking: bool = True, blocking_timeout: int = 5) -> bool:
        start = time.time()
        while True:
            if self.redis.set(self.lock_name, self.token, nx=True, ex=self.timeout):
                return True
            if not blocking:
                return False
            if time.time() - start > blocking_timeout:
                return False
            time.sleep(0.01)

    def release(self):
        # Chỉ release nếu token match (Lua script atomic)
        script = """
        if redis.call("get", KEYS[1]) == ARGV[1] then
            return redis.call("del", KEYS[1])
        else
            return 0
        end
        """
        self.redis.eval(script, 1, self.lock_name, self.token)

# Sử dụng
lock = RedisLock(redis_client, "payment:order:12345")
if lock.acquire():
    try:
        # Xử lý critical section
        process_payment()
    finally:
        lock.release()
```

### 9.4. Full-Page Cache

```python
# Full-Page Cache trong FastAPI
from functools import wraps

def cache_page(expire_seconds: int = 300):
    def decorator(func):
        @wraps(func)
        async def wrapper(request: Request, *args, **kwargs):
            cache_key = f"page:{request.url.path}:{request.query_params}"

            # Thử đọc từ cache
            cached = await redis_client.get(cache_key)
            if cached:
                return Response(content=cached, media_type="text/html")

            # Generate page
            response = await func(request, *args, **kwargs)
            body = response.body

            # Lưu vào cache
            await redis_client.setex(cache_key, expire_seconds, body)

            return response
        return wrapper
    return decorator
```
