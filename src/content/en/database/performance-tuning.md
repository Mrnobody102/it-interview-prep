# Database Performance Tuning

## 1. Overview

Performance tuning is the process of optimizing a database to achieve the fastest response times, highest throughput, and most efficient resource usage. It covers query optimization, indexes, configuration, resource usage, and architecture.

### 1.1. Approach

```
1. Measure    → Identify the problem
2. Analyze    → Find root cause
3. Optimize   → Make changes
4. Verify     → Re-measure after changes
5. Repeat     → Continue improving
```

### 1.2. Key Metrics

| Metric | Description | Target |
|--------|-------------|--------|
| **Query Latency (P50/P95/P99)** | Query response time | P95 < 100ms |
| **Throughput (QPS)** | Queries per second | Depends on workload |
| **CPU Usage** | CPU utilization | < 70% continuous |
| **I/O Wait** | I/O wait time | < 20% |
| **Buffer Cache Hit Ratio** | Cache hit rate | > 95% |
| **Connection Usage** | % connections in use | < 80% |
| **Replication Lag** | Replication delay | < 1 second |
| **Lock Waits** | Lock contention count | As low as possible |

---

## 2. Finding Slow Queries

### 2.1. PostgreSQL - Slow Query Log

```sql
-- Enable slow query log (postgresql.conf)
-- Method 1: By execution time
ALTER SYSTEM SET log_min_duration_statement = 1000;  -- Log queries > 1s

-- Method 2: Statistics view
SELECT
    query,
    calls,
    mean_exec_time,
    total_exec_time,
    rows
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 20;
```

```sql
-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

-- View top 10 slowest queries
SELECT
    substring(query, 1, 100) AS query_preview,
    calls,
    round(mean_exec_time::numeric, 2) AS avg_ms,
    round(total_exec_time::numeric, 2) AS total_ms,
    rows,
    round((100 * shared_blks_hit::numeric /
           NULLIF(shared_blks_hit + shared_blks_read, 0)), 2)
        AS cache_hit_ratio
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;
```

### 2.2. MySQL - Slow Query Log

```sql
-- Enable slow query log
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL slow_query_log_file = '/var/log/mysql/slow.log';
SET GLOBAL long_query_time = 1;  -- Log queries > 1s
SET GLOBAL log_queries_not_using_indexes = 'ON';

-- View queries
SHOW FULL PROCESSLIST;

-- ANALYZE TABLE before optimizing
ANALYZE TABLE users;
ANALYZE TABLE orders;
```

---

## 3. EXPLAIN Plans

### 3.1. PostgreSQL EXPLAIN

```sql
-- Basic EXPLAIN (does not execute)
EXPLAIN
SELECT u.name, o.total
FROM users u
JOIN orders o ON u.id = o.user_id
WHERE u.created_at > '2024-01-01';

-- EXPLAIN ANALYZE (executes and measures)
EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT)
SELECT u.name, o.total
FROM users u
JOIN orders o ON u.id = o.user_id
WHERE u.created_at > '2024-01-01';
```

EXPLAIN output example:

```
Nested Loop  (cost=0.43..134.25 rows=95 width=36)
              (actual time=0.045..1.234 rows=1500 loops=1)
  Buffers: shared hit=45 read=10
  ->  Index Scan using users_created_at_idx on users u
        (cost=0.43..45.12 rows=95 width=20)
        (actual time=0.021..0.456 rows=1500 loops=1)
        Index Cond: (created_at > '2024-01-01'::date)
  ->  Index Scan using orders_user_id_idx on orders o
        (cost=0.29..0.89 rows=1 width=24)
        (actual time=0.002..0.003 rows=1 loops=1500)
        Index Cond: (user_id = u.id)
Planning Time: 0.234 ms
Execution Time: 1.567 ms
```

**Node types in EXPLAIN:**

| Node Type | Meaning | Good? |
|-----------|---------|-------|
| **Seq Scan** | Full table scan | Usually bad for large tables |
| **Index Scan** | Scan index then fetch row | Good |
| **Index Only Scan** | Read only from index | Best |
| **Nested Loop** | Nested join | Good with small tables |
| **Hash Join** | Join using hash table | Good for large datasets |
| **Merge Join** | Join using sorted data | Good when data is sorted |
| **Bitmap Heap Scan** | Bitmap index scan | Intermediate |

> **Tip:** Look for warning signs in EXPLAIN: `Seq Scan` on large tables, `Sort` with large datasets, `Hash` with very large rows.

### 3.2. MySQL EXPLAIN

```sql
EXPLAIN
SELECT u.name, o.total
FROM users u
JOIN orders o ON u.id = o.user_id
WHERE u.created_at > '2024-01-01';

EXPLAIN ANALYZE
SELECT u.name, o.total
FROM users u
JOIN orders o ON u.id = o.user_id
WHERE u.created_at > '2024-01-01';
```

---

## 4. Query Optimizer Concepts

### 4.1. Join Strategies

| Strategy | How it works | Best for |
|----------|-------------|---------|
| **Nested Loop** | Outer table scanned, inner table searched via index for each row | Small outer table, indexed inner column |
| **Hash Join** | Build hash table from smaller table, probe with larger | Large tables, equi-joins, no index |
| **Merge Join** | Both tables sorted, then merged | Pre-sorted data, large equi-joins |

### 4.2. Index Types

| Index Type | PostgreSQL | MySQL | Use case |
|-----------|-----------|-------|---------|
| **B-Tree** (default) | B-tree | BTREE | Equality, range, sorting |
| **Hash** | Hash | HASH | Equality only |
| **GiST** | GiST | - | Geometric, full-text |
| **SP-GiST** | SP-GiST | - | Partitioned data |
| **GIN** | GIN | - | Array, JSON, full-text |
| **BRIN** | BRIN | - | Very large tables, sequential data |

---

## 5. Indexing Strategy

### 5.1. Creating Effective Indexes

```sql
-- Single column index
CREATE INDEX idx_users_email ON users(email);

-- Composite index (order is critical!)
-- This index supports:
--   (status)              OK
--   (status, type)        OK
--   (status, type, created_at) OK
-- But does NOT support:
--   (type)                NOT OK
--   (created_at)          NOT OK
CREATE INDEX idx_orders_status_type_created
    ON orders(status, type, created_at);

-- Partial index (only index rows matching condition)
CREATE INDEX idx_users_active_email
    ON users(email)
    WHERE active = true;

-- Covering index (index includes columns needed for SELECT)
CREATE INDEX idx_users_covering
    ON users(email)
    INCLUDE (id, name, phone);
```

```sql
-- Unique index
CREATE UNIQUE INDEX idx_users_email ON users(email);

-- Index with CONCURRENTLY (PostgreSQL - no table lock)
CREATE INDEX CONCURRENTLY idx_orders_user_id ON orders(user_id);

-- Index on expression
CREATE INDEX idx_users_lower_email ON users(LOWER(email));
CREATE INDEX idx_orders_year ON orders(EXTRACT(YEAR FROM created_at));

-- Index on JSON field (PostgreSQL)
CREATE INDEX idx_users_metadata ON users USING GIN(metadata);
-- Query: WHERE metadata @> '{"role": "admin"}'
```

### 5.2. Index Best Practices

| Best Practice | Reason |
|--------------|--------|
| **Index columns in WHERE** | Enables fast filtering |
| **Composite index: EQ + Range + Sort** | Order: equality columns first, range last |
| **Partial index for hot partitions** | Reduces index size |
| **Covering index for frequent queries** | Index Only Scan, no table lookup |
| **Monitor index usage** | DROP unused indexes (saves storage, improves writes) |
| **Don't over-index** | Every index slows INSERT/UPDATE/DELETE |

```sql
-- PostgreSQL: Check index usage
SELECT
    indexrelname,
    idx_scan,
    idx_tup_read,
    idx_tup_fetch,
    pg_size_pretty(pg_relation_size(indexrelid)) AS index_size
FROM pg_stat_user_indexes
ORDER BY idx_scan ASC;
```

### 5.3. Index Maintenance

```sql
-- PostgreSQL: REINDEX to defragment
REINDEX INDEX CONCURRENTLY idx_users_email;
REINDEX TABLE users;

-- MySQL: OPTIMIZE TABLE to defragment
OPTIMIZE TABLE users;

-- Check index bloat (PostgreSQL)
SELECT
    tablename,
    indexname,
    pg_size_pretty(pg_relation_size(indexrelid)) AS index_size,
    idx_scan
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY pg_relation_size(indexrelid) DESC;
```

---

## 6. Connection Pooling

### 6.1. Why Connection Pooling?

Every new database connection consumes resources (memory, CPU). Creating a new connection per request is expensive. Connection pooling reuses connections.

```
Without Pooling:
Request 1 ──► New Connection ──► DB ──► Close ──► Response
Request 2 ──► New Connection ──► DB ──► Close ──► Response
Request 3 ──► New Connection ──► DB ──► Close ──► Response

With Pooling:
Request 1 ──► Borrow Connection 1 ──► DB ──► Return ──► Response
Request 2 ──► Borrow Connection 2 ──► DB ──► Return ──► Response
Request 3 ──► Borrow Connection 1 ──► DB ──► Return ──► Response
```

### 6.2. HikariCP Configuration (Spring Boot)

```yaml
# application.yml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/mydb
    username: app_user
    password: xxx
    hikari:
      maximum-pool-size: 20
      minimum-idle: 5
      idle-timeout: 300000        # 5 minutes
      max-lifetime: 1800000       # 30 minutes
      connection-timeout: 30000   # 30 seconds
      leak-detection-threshold: 60000  # 1 minute
```

**Key HikariCP settings:**

| Property | Recommended | Description |
|----------|-------------|-------------|
| `maximum-pool-size` | 20-50 | Max connections in pool |
| `minimum-idle` | 5-10 | Min idle connections |
| `connection-timeout` | 30000ms | Max wait for connection |
| `idle-timeout` | 600000ms | Max idle time before removal |
| `max-lifetime` | 1800000ms | Max connection lifetime |
| `leak-detection-threshold` | 60000ms | Detect connection leaks |

### 6.3. Monitoring Connection Pool

```java
// HikariCP metrics (expose via JMX/Prometheus)
HikariPool pool = hikariDataSource.getHikariPoolMXBean();
System.out.println("Active: " + pool.getActiveConnections());
System.out.println("Idle: " + pool.getIdleConnections());
System.out.println("Waiting: " + pool.getThreadsAwaitingConnection());
System.out.println("Total: " + pool.getTotalConnections());
```

---

## 7. Caching

### 7.1. Query Cache vs Result Cache

| Layer | Technology | What it caches |
|-------|-----------|---------------|
| **Database buffer** | PostgreSQL shared_buffers, MySQL InnoDB buffer pool | Pages read from disk |
| **Application cache** | Redis, Ehcache | Query results |
| **Query cache** | MySQL (removed in 8.0) | SELECT results |

### 7.2. Redis as Application-Level Cache

```java
@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    private static final String PRODUCT_KEY = "product:";

    public Product findById(Long id) {
        String key = PRODUCT_KEY + id;

        // Try cache first
        Product product = (Product) redisTemplate.opsForValue().get(key);
        if (product != null) {
            return product;
        }

        // Cache miss - query database
        product = productRepository.findById(id).orElse(null);
        if (product != null) {
            redisTemplate.opsForValue().set(key, product, 10, TimeUnit.MINUTES);
        }
        return product;
    }

    @Transactional
    public Product update(Long id, Product updated) {
        Product product = productRepository.findById(id)
            .orElseThrow(() -> new NotFoundException("Product not found"));
        product.setName(updated.getName());
        product.setPrice(updated.getPrice());
        Product saved = productRepository.save(product);

        // Invalidate cache
        redisTemplate.delete(PRODUCT_KEY + id);
        return saved;
    }
}
```

### 7.3. Cache Strategies

| Strategy | Description | Use case |
|---------|-------------|---------|
| **Cache-Aside** | App checks cache, then DB, then populates cache | Read-heavy, infrequent updates |
| **Write-Through** | Write to cache and DB simultaneously | Data consistency priority |
| **Write-Behind** | Write to cache, async write to DB | High write throughput |
| **Refresh-Ahead** | Proactively refresh expiring entries | Predictable access patterns |

---

## 8. Batch Processing

### 8.1. JPA/Hibernate Batch Processing

```java
// application.yml configuration
spring:
  jpa:
    properties:
      hibernate:
        jdbc:
          batch_size: 50
        order_inserts: true
        order_updates: true
        default_batch_fetch_size: 20
    show-sql: false
    hibernate:
      ddl-auto: validate
```

```java
@Service
public class UserImportService {

    @PersistenceContext
    private EntityManager entityManager;

    @Transactional
    public void importUsers(List<UserDTO> userDTOs) {
        int batchSize = 50;
        for (int i = 0; i < userDTOs.size(); i++) {
            User user = convertToEntity(userDTOs.get(i));
            entityManager.persist(user);

            if (i > 0 && i % batchSize == 0) {
                entityManager.flush();
                entityManager.clear();  // Release memory
            }
        }
        entityManager.flush();
        entityManager.clear();
    }
}
```

### 8.2. MySQL Batch Insert

```sql
-- Single insert (slow - N round trips)
INSERT INTO users (name, email) VALUES ('User1', 'user1@example.com');
INSERT INTO users (name, email) VALUES ('User2', 'user2@example.com');

-- Batch insert (fast - single round trip)
INSERT INTO users (name, email) VALUES
    ('User1', 'user1@example.com'),
    ('User2', 'user2@example.com'),
    ('User3', 'user3@example.com'),
    ('User4', 'user4@example.com');
```

```java
// JDBC batch insert
String sql = "INSERT INTO users (name, email) VALUES (?, ?)";
try (PreparedStatement ps = connection.prepareStatement(sql)) {
    for (User user : users) {
        ps.setString(1, user.getName());
        ps.setString(2, user.getEmail());
        ps.addBatch();
    }
    ps.executeBatch();
}
```

---

## 9. Keyset Pagination vs OFFSET

### 9.1. Why OFFSET is Slow

```sql
-- Bad: OFFSET with large page numbers
-- OFFSET 10000: Database still reads and skips 10000 rows
SELECT * FROM orders ORDER BY id LIMIT 10 OFFSET 10000;
-- The larger the OFFSET, the slower the query

-- Bad: Page 100 with 20 items per page
SELECT * FROM orders ORDER BY id LIMIT 20 OFFSET 2000;
-- Database scans 2020 rows just to return 20
```

### 9.2. Keyset Pagination (Cursor-Based)

```sql
-- Good: Keyset pagination - constant performance
SELECT * FROM orders
WHERE id < 10001
ORDER BY id DESC
LIMIT 10;

-- Best: Composite keyset for multi-column sort
SELECT * FROM orders
WHERE (created_at, id) < ('2024-01-15', 12345)
ORDER BY created_at DESC, id DESC
LIMIT 10;
```

### 9.3. Implementation in Spring Data

```java
// OFFSET pagination (slow for large offsets)
Page<User> findByStatus(String status, Pageable pageable);
// Usage: PageRequest.of(500, 20) - slow!

// Keyset pagination (fast - use last item's ID as cursor)
@Query("SELECT u FROM User u WHERE u.id < :cursor ORDER BY u.id DESC")
List<User> findNextPage(@Param("cursor") Long cursor, Pageable pageable);

// Frontend sends cursor from last item
public PageResult<User> getUsers(Long cursor, int limit) {
    List<User> users = userRepository.findNextPage(cursor, PageRequest.of(0, limit));
    String nextCursor = users.isEmpty() ? null
        : String.valueOf(users.get(users.size() - 1).getId());
    return new PageResult<>(users, nextCursor);
}
```

---

## 10. Common SQL Performance Problems

### 10.1. N+1 Query Problem

```sql
-- BAD: N+1 queries
-- 1 query to get users + N queries to get orders for each user
SELECT * FROM users WHERE active = true;        -- 1 query
-- Then in code:
-- for user in users:
--   SELECT * FROM orders WHERE user_id = user.id  -- N queries!
```

```sql
-- GOOD: Join to get everything in 1 query
SELECT u.id, u.name, u.email,
       o.id AS order_id, o.total, o.created_at
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.active = true;
```

### 10.2. Subqueries vs Joins

```sql
-- BAD: Correlated subquery (runs N times)
SELECT p.name,
       (SELECT COUNT(*) FROM orders o WHERE o.product_id = p.id) AS order_count
FROM products p;

-- GOOD: LEFT JOIN with GROUP BY
SELECT p.name, COUNT(o.id) AS order_count
FROM products p
LEFT JOIN orders o ON p.id = o.product_id
GROUP BY p.id, p.name;
```

### 10.3. Lock Contention

```sql
-- PostgreSQL: Check blocking
SELECT
    bl.pid AS blocking_pid,
    a.pid AS blocked_pid,
    a.query AS blocked_query
FROM pg_stat_activity a
JOIN pg_stat_activity bl ON bl.pid = ANY(pg_blocking_pids(a.pid))
WHERE a.pid != pg_backend_pid();

-- Solution: Use SELECT FOR UPDATE SKIP LOCKED
UPDATE orders
SET status = 'processing', updated_at = NOW()
WHERE id = (
    SELECT id FROM orders
    WHERE status = 'pending'
    ORDER BY created_at
    LIMIT 1
    FOR UPDATE SKIP LOCKED
);
```

---

## 11. Database Configuration Tuning

### 11.1. PostgreSQL Configuration

```ini
; postgresql.conf

; --- Memory Settings ---
shared_buffers = 25% of RAM          ; ~8GB for 32GB RAM
work_mem = 64MB                       ; per sort/hash operation
maintenance_work_mem = 2GB            ; for VACUUM, CREATE INDEX
effective_cache_size = 75% of RAM    ; ~24GB for 32GB RAM

; --- Query Planner ---
random_page_cost = 1.1                 ; SSD: 1.1, HDD: 4.0
effective_io_concurrency = 200        ; SSD: 200, HDD: 1

; --- Connection Settings ---
max_connections = 200

; --- Logging ---
log_min_duration_statement = 1000    ; Log queries > 1s
log_lock_waits = on
```

### 11.2. MySQL (InnoDB) Configuration

```ini
; my.cnf / my.ini

[mysqld]

; --- InnoDB Settings ---
innodb_buffer_pool_size = 12G         ; 70-80% of RAM for dedicated MySQL
innodb_buffer_pool_instances = 8
innodb_log_file_size = 2G
innodb_flush_log_at_trx_commit = 2    ; 1=safe, 2=faster, 0=fastest
innodb_io_capacity = 4000              ; SSD

; --- Connection Settings ---
max_connections = 500
wait_timeout = 600

; --- Temp Table & Sort ---
tmp_table_size = 256M
max_heap_table_size = 256M
sort_buffer_size = 4M

; --- Logging ---
slow_query_log = 1
long_query_time = 1
```

---

## 12. Table Maintenance

### 12.1. VACUUM (PostgreSQL)

PostgreSQL uses MVCC (Multi-Version Concurrency Control), which creates dead tuples that need to be cleaned up by VACUUM.

```sql
-- Manual VACUUM
VACUUM FULL users;  -- Locks table, only use when needed
VACUUM ANALYZE users;

-- VACUUM without lock (PostgreSQL 13+)
VACUUM (VERBOSE, ANALYZE) users;

-- Autovacuum configuration
ALTER TABLE users SET (
    autovacuum_vacuum_threshold = 50,
    autovacuum_analyze_threshold = 50
);
```

### 12.2. ANALYZE

```sql
-- Update statistics for better query planning
ANALYZE users;
ANALYZE VERBOSE users;

-- Check statistics
SELECT
    tablename,
    n_live_tup,
    n_dead_tup,
    last_vacuum,
    last_analyze
FROM pg_stat_user_tables
ORDER BY n_dead_tup DESC;
```

---

## 13. Performance Tuning Checklist

### 13.1. Pre-Production Checklist

- [ ] EXPLAIN ANALYZE all critical queries
- [ ] Verify indexes are used (no unused indexes)
- [ ] Query statistics collected (pg_stat_statements)
- [ ] Slow query log enabled and monitored
- [ ] Connection pool configured properly
- [ ] Autovacuum tuned for workload
- [ ] Database statistics up-to-date (ANALYZE)
- [ ] No N+1 queries in application
- [ ] No SELECT * in production queries
- [ ] Pagination using keyset instead of OFFSET

### 13.2. Production Monitoring Checklist

| Check | Frequency | Action if Issue |
|-------|-----------|-----------------|
| Slow query log | Daily | Optimize or add index |
| Cache hit ratio | Weekly | Tune shared_buffers |
| Connection usage | Real-time | Scale connection pool |
| Replication lag | Real-time | Optimize network / add replicas |
| Dead tuples | Weekly | Run VACUUM |
| Table/index bloat | Monthly | REINDEX, VACUUM FULL |
| Lock waits | Daily | Analyze contention |
