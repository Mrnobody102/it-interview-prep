# Chủ đề Performance Tuning

## 1. Tổng quan về Performance Tuning

### 1.1. Performance Tuning là gì?

Performance tuning là quá trình tối ưu hoá database để đạt được thời gian phản hồi nhanh nhất, throughput cao nhất, và sử dụng tài nguyên hiệu quả nhất. Bao gồm tối ưu queries, indexes, configuration, resource usage, và kiến trúc.

### 1.2. Các bước tiếp cận

```
1. Measure (Đo)     → Biết vấn đề ở đâu
2. Analyze (Phân tích) → Tìm root cause
3. Optimize (Tối ưu)  → Thực hiện thay đổi
4. Verify (Xác nhận)  → Đo lại sau thay đổi
5. Repeat             → Tiếp tục cải thiện
```

### 1.3. Các Metrics quan trọng

| Metric | Mô tả | Ngưỡng lý tưởng |
|---|---|---|
| **Query Latency (P50/P95/P99)** | Thời gian phản hồi truy vấn | P95 < 100ms |
| **Throughput (QPS)** | Số truy vấn mỗi giây | Phụ thuộc workload |
| **CPU Usage** | Mức sử dụng CPU | < 70% liên tục |
| **I/O Wait** | Thời gian chờ I/O | < 20% |
| **Buffer Cache Hit Ratio** | Tỷ lệ cache hit | > 95% |
| **Connection Usage** | % connections đang sử dụng | < 80% |
| **Replication Lag** | Độ trễ replication | < 1 giây |
| **Lock Waits** | Số lock contention | Càng thấp càng tốt |

---

## 2. Query Optimization

### 2.1. Tìm các truy vấn chậm

#### PostgreSQL - Slow Query Log

```sql
-- Bật slow query log (postgresql.conf)
-- Cách 1: Theo thời gian thực thi
ALTER SYSTEM SET log_min_duration_statement = 1000;  -- Log queries > 1s

-- Cách 2: Statistics view
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
-- Enable extensions cần thiết
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

-- Xem top 10 queries chậm nhất
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

#### MySQL - Slow Query Log

```sql
-- Bật slow query log
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL slow_query_log_file = '/var/log/mysql/slow.log';
SET GLOBAL long_query_time = 1;  -- Log queries > 1s
SET GLOBAL log_queries_not_using_indexes = 'ON';

-- Xem queries
SHOW FULL PROCESSLIST;

-- ANALYZE TABLE trước khi optimize
ANALYZE TABLE users;
ANALYZE TABLE orders;
```

### 2.2. EXPLAIN Plans

#### PostgreSQL EXPLAIN

```sql
-- Basic EXPLAIN (không execute)
EXPLAIN
SELECT u.name, o.total
FROM users u
JOIN orders o ON u.id = o.user_id
WHERE u.created_at > '2024-01-01';

-- EXPLAIN ANALYZE (execute và đo thực tế)
EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT)
SELECT u.name, o.total
FROM users u
JOIN orders o ON u.id = o.user_id
WHERE u.created_at > '2024-01-01';
```

Output EXPLAIN:

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

**Các node type trong EXPLAIN:**

| Node Type | Ý nghĩa | Tốt? |
|---|---|---|
| **Seq Scan** | Full table scan | Thường xấu cho large tables |
| **Index Scan** | Scan index rồi fetch row | Tốt |
| **Index Only Scan** | Chỉ đọc từ index | Tốt nhất |
| **Nested Loop** | Join lồng nhau | Tốt khi tables nhỏ |
| **Hash Join** | Join dùng hash table | Tốt cho large datasets |
| **Merge Join** | Join dùng sorted data | Tốt khi data đã sorted |
| **Bitmap Heap Scan** | Bitmap index scan | Trung gian |

> **Mẹo:** Tìm các dấu hiệu cảnh báo trong EXPLAIN: `Seq Scan` trên large tables, `Sort` với large datasets, `Hash` với very large rows.

#### MySQL EXPLAIN

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

### 2.3. Các lỗi thường gặp trong SQL

#### N+1 Query Problem

```sql
-- BAD: N+1 queries
-- 1 query lấy users + N queries lấy orders cho từng user
SELECT * FROM users WHERE active = true;        -- 1 query
-- Sau đó trong code:
-- for user in users:
--   SELECT * FROM orders WHERE user_id = user.id  -- N queries!
```

```sql
-- GOOD: Join để lấy tất cả trong 1 query
SELECT u.id, u.name, u.email,
       o.id AS order_id, o.total, o.created_at
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.active = true;
```

```java
// BAD: N+1 trong JPA
List<User> users = userRepository.findByActiveTrue();
for (User user : users) {
    List<Order> orders = orderRepository.findByUserId(user.getId()); // N+1!
}

// GOOD: Fetch join
@Query("SELECT u FROM User u LEFT JOIN FETCH u.orders WHERE u.active = true")
List<User> findActiveWithOrders();
```

#### Sử dụng SELECT *

```sql
-- BAD: Lấy tất cả columns
SELECT * FROM orders WHERE id = 12345;

-- GOOD: Chỉ lấy columns cần thiết
SELECT id, user_id, total, status, created_at
FROM orders WHERE id = 12345;
```

#### OFFSET Pagination vs Keyset Pagination

```sql
-- BAD: OFFSET với large page numbers
-- OFFSET 10000: Database vẫn phải đọc và bỏ qua 10000 rows
SELECT * FROM orders ORDER BY id LIMIT 10 OFFSET 10000;
-- OFFSET càng lớn, query càng chậm

-- GOOD: Keyset (Cursor) Pagination - hiệu năng constant
SELECT * FROM orders
WHERE id < 10001
ORDER BY id DESC
LIMIT 10;

-- BEST: Composite keyset cho multi-column sort
SELECT * FROM orders
WHERE (created_at, id) < ('2024-01-15', 12345)
ORDER BY created_at DESC, id DESC
LIMIT 10;
```

#### Subqueries vs Joins

```sql
-- BAD: Correlated subquery (chạy N lần)
SELECT p.name,
       (SELECT COUNT(*) FROM orders o WHERE o.product_id = p.id) AS order_count
FROM products p;

-- GOOD: LEFT JOIN với GROUP BY
SELECT p.name, COUNT(o.id) AS order_count
FROM products p
LEFT JOIN orders o ON p.id = o.product_id
GROUP BY p.id, p.name;
```

---

## 3. Indexing Strategy

### 3.1. Index Fundamentals

Index là cấu trúc dữ liệu giúp tìm kiếm nhanh, tương tự như mục lục trong sách.

**Các loại Index chính:**

| Index Type | PostgreSQL | MySQL | Use case |
|---|---|---|---|
| **B-Tree** (mặc định) | B-tree | BTREE | Equality, range, sorting |
| **Hash** | Hash | HASH | Equality only |
| **GiST** | GiST | - | Geometric, full-text |
| **SP-GiST** | SP-GiST | - | Partitioned data |
| **GIN** | GIN | - | Array, JSON, full-text |
| **BRIN** | BRIN | - | Very large tables, sequential data |

### 3.2. Tạo Index hiệu quả

```sql
-- Single column index
CREATE INDEX idx_users_email ON users(email);

-- Composite index (thứ tự rất quan trọng!)
-- Index này hỗ trợ:
--   (status)        OK
--   (status, type)  OK
--   (status, type, created_at) OK
-- Nhưng KHÔNG hỗ trợ:
--   (type)          NOT OK
--   (created_at)    NOT OK
CREATE INDEX idx_orders_status_type_created
    ON orders(status, type, created_at);

-- Partial index (chỉ index rows thỏa điều kiện)
CREATE INDEX idx_users_active_email
    ON users(email)
    WHERE active = true;

-- Covering index (index bao gồm cả columns cần select)
CREATE INDEX idx_users_covering
    ON users(email)
    INCLUDE (id, name, phone);
```

```sql
-- Unique index
CREATE UNIQUE INDEX idx_users_email ON users(email);

-- Index với CONCURRENTLY (PostgreSQL - không lock table)
CREATE INDEX CONCURRENTLY idx_orders_user_id ON orders(user_id);

-- Index cho expression
CREATE INDEX idx_users_lower_email ON users(LOWER(email));
CREATE INDEX idx_orders_year ON orders(EXTRACT(YEAR FROM created_at));

-- Index cho JSON field (PostgreSQL)
CREATE INDEX idx_users_metadata ON users USING GIN(metadata);
-- Query: WHERE metadata @> '{"role": "admin"}'
```

### 3.3. Index Best Practices

| Best Practice | Lý do |
|---|---|
| **Index columns trong WHERE** | Giúp lọc nhanh |
| **Composite index: EQ + Range + Sort** | Thứ tự: equality columns trước, range sau |
| **Partial index cho hot partitions** | Giảm kích thước index |
| **Covering index cho frequent queries** | Index Only Scan, không cần lookup table |
| **Monitor index usage** | DROP unused indexes (tiết kiệm storage, improve write) |
| **Don't over-index** | Mỗi index làm chậm INSERT/UPDATE/DELETE |

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

### 3.4. Index Maintenance

```sql
-- PostgreSQL: REINDEX để defragment
REINDEX INDEX CONCURRENTLY idx_users_email;
REINDEX TABLE users;  -- Reindex tất cả indexes trên table

-- MySQL: OPTIMIZE TABLE để defragment
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

## 4. Connection Pooling

### 4.1. Tại sao cần Connection Pooling?

Mỗi kết nối database tốn tài nguyên (memory, CPU). Tạo kết nối mới cho mỗi request là expensive. Connection pooling tái sử dụng connections.

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

### 4.2. Cấu hình Connection Pool

#### PgBouncer (PostgreSQL)

```ini
; pgbouncer.ini
[databases]
mydb = host=localhost port=5432 dbname=mydb

[pgbouncer]
listen_addr = *
listen_port = 6432
auth_type = md5
auth_file = /etc/pgbouncer/userlist.txt

; Pool settings
pool_mode = transaction  ; Recommended for web apps
max_client_conn = 1000
default_pool_size = 25   ; Per database/user
min_pool_size = 5
reserve_pool_size = 5
reserve_pool_timeout = 3

; Timeouts
server_idle_timeout = 600
server_connect_timeout = 15
query_timeout = 30
```

```bash
# Kết nối qua pgbouncer
psql -h localhost -p 6432 -U app_user mydb
```

#### HikariCP (Java)

```java
// Java/Spring Boot - application.yml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/mydb
    username: app_user
    password: xxx
    hikari:
      maximum-pool-size: 20
      minimum-idle: 5
      idle-timeout: 300000      # 5 phút
      max-lifetime: 1800000      # 30 phút
      connection-timeout: 30000   # 30 giây
      leak-detection-threshold: 60000  # 1 phút
```

#### MySQL Connection Pooling

```sql
-- MySQL: max_connections
SHOW VARIABLES LIKE 'max_connections';
-- Default: 151, production nên tăng lên 500-1000

-- Active connections
SHOW STATUS LIKE 'Threads_connected';
SHOW STATUS LIKE 'Max_used_connections';
```

```java
// Java - HikariCP for MySQL
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/mydb?useSSL=false
    driver-class-name: com.mysql.cj.jdbc.Driver
    hikari:
      maximum-pool-size: 20
      minimum-idle: 5
      connection-timeout: 30000
      idle-timeout: 600000
      max-lifetime: 1800000
      leak-detection-threshold: 60000
```

### 4.3. Monitoring Connection Pool

```java
// HikariCP metrics (expose qua JMX/Prometheus)
HikariPool pool = hikariDataSource.getHikariPoolMXBean();
System.out.println("Active: " + pool.getActiveConnections());
System.out.println("Idle: " + pool.getIdleConnections());
System.out.println("Waiting: " + pool.getThreadsAwaitingConnection());
System.out.println("Total: " + pool.getTotalConnections());
```

---

## 5. Database Configuration Tuning

### 5.1. PostgreSQL Configuration

```sql
-- Xem current settings
SHOW all;
SHOW shared_buffers;
SHOW work_mem;
SHOW effective_cache_size;

-- Key parameters nên tune
```

```ini
; postgresql.conf

; --- Memory Settings ---
shared_buffers = 25% of RAM          ; ~8GB for 32GB RAM
work_mem = 64MB                       ; per sort/hash operation
maintenance_work_mem = 2GB            ; for VACUUM, CREATE INDEX
effective_cache_size = 75% of RAM    ; ~24GB for 32GB RAM
temp_buffers = 64MB

; --- Query Planner ---
random_page_cost = 1.1                 ; SSD: 1.1, HDD: 4.0
effective_io_concurrency = 200        ; SSD: 200, HDD: 1
constraint_exclusion = partition       ; Enable for partitioned tables

; --- Write Settings ---
wal_buffers = 16MB
checkpoint_completion_target = 0.9
max_wal_size = 2GB
min_wal_size = 1GB

; --- Connection Settings ---
max_connections = 200
tcp_keepalives_idle = 60
tcp_keepalives_interval = 10
tcp_keepalives_count = 10

; --- Logging ---
log_min_duration_statement = 1000    ; Log queries > 1s
log_lock_waits = on
log_temp_files = 0                     ; Log temp files > 0KB
```

```sql
-- Tính shared_buffers phù hợp
-- Rule of thumb: 25% of RAM (nhưng có thể tăng lên 40% cho dedicated DB)
SELECT
    pg_size_pretty(current_setting('shared_buffers')::bigint) AS current,
    pg_size_pretty((SELECT pg_total_relation_size('users') / 1024 / 1024 * 4 FROM pg_class LIMIT 1)) AS recommended;
```

### 5.2. MySQL Configuration

```ini
; my.cnf / my.ini

[mysqld]

; --- InnoDB Settings ---
innodb_buffer_pool_size = 12G         ; 70-80% of RAM for dedicated MySQL
innodb_buffer_pool_instances = 8      ; Multiple instances
innodb_log_file_size = 2G             ; Log file size
innodb_log_buffer_size = 64M
innodb_flush_log_at_trx_commit = 2    ; 1=safe, 2=faster, 0=fastest
innodb_flush_method = O_DIRECT
innodb_file_per_table = 1
innodb_io_capacity = 4000              ; SSD
innodb_io_capacity_max = 16000
innodb_read_io_threads = 8
innodb_write_io_threads = 8

; --- Connection Settings ---
max_connections = 500
thread_cache_size = 50
wait_timeout = 600
interactive_timeout = 600

; --- Query Cache (MySQL 8 đã loại bỏ) ---
; MySQL 8+: Use proxy/protocol caching thay thế

; --- Temp Table & Sort ---
tmp_table_size = 256M
max_heap_table_size = 256M
sort_buffer_size = 4M
join_buffer_size = 4M

; --- Logging ---
slow_query_log = 1
slow_query_log_file = /var/log/mysql/slow.log
long_query_time = 1
log_queries_not_using_indexes = 1
```

### 5.3. Sizing Formulas

```python
# Tính toán cấu hình PostgreSQL
def calculate_postgres_config(total_ram_gb: int, db_size_gb: int, num_connections: int):
    return {
        "shared_buffers": f"{int(total_ram_gb * 0.25)}GB",
        "effective_cache_size": f"{int(total_ram_gb * 0.75)}GB",
        "work_mem": f"{int((total_ram_gb * 1024 * 0.1) / num_connections)}MB",
        "maintenance_work_mem": f"{int(total_ram_gb * 0.1)}GB",
        "max_connections": num_connections,
        # "effective_io_concurrency": 200 if ssd else 1,
    }

config = calculate_postgres_config(total_ram_gb=32, db_size_gb=500, num_connections=100)
for k, v in config.items():
    print(f"{k} = {v}")
```

---

## 6. Table Maintenance

### 6.1. VACUUM (PostgreSQL)

PostgreSQL sử dụng MVCC (Multi-Version Concurrency Control), tạo ra dead tuples cần được dọn dẹp bởi VACUUM.

```sql
-- Manual VACUUM
VACUUM FULL users;  -- Lock table, chỉ dùng khi cần
VACUUM ANALYZE users;

-- VACUUM không lock (PostgreSQL 13+)
VACUUM (VERBOSE, ANALYZE) users;

-- Autovacuum configuration
ALTER TABLE users SET (
    autovacuum_vacuum_threshold = 50,
    autovacuum_analyze_threshold = 50,
    autovacuum_vacuum_cost_delay = 10,
    autovacuum_vacuum_cost_limit = 1000
);
```

```ini
; postgresql.conf - Autovacuum settings
autovacuum = on
autovacuum_max_workers = 4
autovacuum_naptime = 1min
autovacuum_vacuum_threshold = 50
autovacuum_analyze_threshold = 50
autovacuum_vacuum_scale_factor = 0.1
autovacuum_analyze_scale_factor = 0.05
autovacuum_vacuum_cost_delay = 2ms
```

### 6.2. ANALYZE

```sql
-- Cập nhật statistics để query planner đưa ra quyết định tốt hơn
ANALYZE users;
ANALYZE VERBOSE users;

-- Check statistics
SELECT
    tablename,
    n_live_tup,
    n_dead_tup,
    last_vacuum,
    last_autovacuum,
    last_analyze,
    n_mod_since_analyze
FROM pg_stat_user_tables
ORDER BY n_dead_tup DESC;
```

### 6.3. MySQL OPTIMIZE TABLE

```sql
-- Defragment table và indexes
OPTIMIZE TABLE orders;

-- Với pt-online-schema-change cho tables lớn
-- pt-online-schema-change - tạo bảng mới, copy data, swap
pt-online-schema-change \
  --alter "OPTIMIZE TABLE orders" \
  D=mydb,t=orders \
  --execute
```

---

## 7. Monitoring và Profiling

### 7.1. PostgreSQL Monitoring Queries

```sql
-- Top queries by total execution time
SELECT
    substring(query, 1, 200) AS query,
    calls,
    round(total_exec_time::numeric, 2) AS total_ms,
    round(mean_exec_time::numeric, 2) AS mean_ms,
    round((100 * total_exec_time::numeric /
           SUM(total_exec_time) OVER ()), 2) AS percent_total
FROM pg_stat_statements
WHERE query NOT LIKE '%pg_stat_statements%'
ORDER BY total_exec_time DESC
LIMIT 20;

-- Tables with most I/O
SELECT
    schemaname,
    relname,
    seq_scan,
    idx_scan,
    n_tup_ins,
    n_tup_upd,
    n_tup_del,
    n_live_tup,
    n_dead_tup,
    last_vacuum,
    last_autovacuum
FROM pg_stat_user_tables
ORDER BY seq_scan + idx_scan DESC
LIMIT 20;

-- Current locks
SELECT
    pg_blocking_pids(pid) AS blocked_by,
    pid,
    usename,
    query,
    state,
    wait_event_type,
    wait_event,
    state_change,
    query_start
FROM pg_stat_activity
WHERE state != 'idle'
  AND pid != pg_backend_pid()
ORDER BY query_start;

-- Database size
SELECT
    pg_database.datname,
    pg_size_pretty(pg_database_size(pg_database.datname)) AS size
FROM pg_database
ORDER BY pg_database_size(pg_database.datname) DESC;
```

### 7.2. MySQL Monitoring Queries

```sql
-- Slow queries
SELECT
    start_time,
    query_time,
    lock_time,
    rows_sent,
    rows_examined,
    db,
    last_insert_id,
    insert_id,
    server_id,
    sql_text
FROM mysql.slow_log
ORDER BY start_time DESC
LIMIT 20;

-- Table stats
SELECT
    TABLE_NAME,
    ENGINE,
    TABLE_ROWS,
    DATA_LENGTH,
    INDEX_LENGTH,
    DATA_FREE,
    AUTO_INCREMENT,
    TABLE_COLLATION
FROM information_schema.TABLES
WHERE TABLE_SCHEMA = 'mydb'
ORDER BY DATA_LENGTH DESC;

-- InnoDB status
SHOW ENGINE INNODB STATUS;

-- Full processlist
SHOW FULL PROCESSLIST;
```

### 7.3. pg_stat_monitor (Advanced)

```sql
-- pg_stat_monitor: Better query statistics
SELECT
    query,
    calls,
    total_exec_time,
    min_exec_time,
    max_exec_time,
    mean_exec_time,
    stddev_exec_time,
    rows,
    blk_hit_rate,
    cpu_source
FROM pg_stat_monitor()
ORDER BY total_exec_time DESC
LIMIT 20;

-- Real-time monitoring view
SELECT
    datname,
    pid,
    usename,
    application_name,
    client_addr,
    backend_start,
    xact_start,
    query_start,
    state,
    wait_event_type,
    left(query, 100) AS query_preview
FROM pg_stat_activity
WHERE state != 'idle'
ORDER BY query_start;
```

---

## 8. Common Performance Problems và Solutions

### 8.1. Problem: Slow JOINs

**Nguyên nhân:** Thiếu indexes trên join columns, large tables join không có filter.

**Giải pháp:**

```sql
-- Kiểm tra EXPLAIN plan
EXPLAIN (ANALYZE, BUFFERS)
SELECT * FROM orders o
JOIN users u ON o.user_id = u.id
WHERE o.created_at > '2024-01-01';

-- Thêm indexes
CREATE INDEX CONCURRENTLY idx_orders_user_id ON orders(user_id);
CREATE INDEX CONCURRENTLY idx_orders_created ON orders(created_at);

-- Rewrite query để filter trước
EXPLAIN
SELECT u.name, SUM(o.total) AS total_amount
FROM (
    SELECT id, user_id, total
    FROM orders
    WHERE created_at > '2024-01-01'
) o
JOIN users u ON o.user_id = u.id
GROUP BY u.name;
```

### 8.2. Problem: Lock Contention

**Nguyên nhân:** Nhiều transactions cùng modify cùng rows/tables.

**Giải pháp:**

```sql
-- PostgreSQL: Kiểm tra blocking
SELECT
    bl.pid AS blocking_pid,
    bl.usename AS blocking_user,
    a.query AS blocking_query,
    a.pid AS blocked_pid,
    a.query AS blocked_query
FROM pg_stat_activity a
JOIN pg_stat_activity bl ON bl.pid = ANY(pg_blocking_pids(a.pid))
WHERE a.pid != pg_backend_pid();

-- Giải quyết: Dùng SELECT FOR UPDATE SKIP LOCKED (PostgreSQL)
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

### 8.3. Problem: Bloat (Table/Index bloat)

**Nguyên nhân:** UPDATE/DELETE tạo dead tuples, table không được VACUUM.

**Giải pháp:**

```sql
-- Check bloat (PostgreSQL)
SELECT
    tablename,
    pg_size_pretty(pg_total_relation_size(tablename::regclass)) AS total_size,
    pg_size_pretty(pg_relation_size(tablename::regclass)) AS table_size,
    pg_size_pretty(pg_total_relation_size(tablename::regclass) -
                   pg_relation_size(tablename::regclass)) AS bloat_size,
    round(100 * (pg_total_relation_size(tablename::regclass) -
                 pg_relation_size(tablename::regclass)) /
          NULLIF(pg_total_relation_size(tablename::regclass), 0), 2) AS bloat_pct
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(tablename::regclass) DESC;
```

### 8.4. Problem: Statistics Stale

**Nguyên nhân:** Sau khi bulk insert/update/delete, statistics không được update.

**Giải pháp:**

```sql
-- Sau bulk operations
ANALYZE users;
ANALYZE VERBOSE orders;

-- Hoặc tăng statistics target cho specific columns
ALTER TABLE users ALTER COLUMN email SET STATISTICS 500;
ANALYZE users;
```

---

## 9. Advanced Optimization

### 9.1. Materialized Views

```sql
-- PostgreSQL: Materialized View cho expensive queries
CREATE MATERIALIZED VIEW monthly_sales AS
SELECT
    DATE_TRUNC('month', o.created_at) AS month,
    u.region,
    COUNT(o.id) AS order_count,
    SUM(o.total) AS total_sales
FROM orders o
JOIN users u ON o.user_id = u.id
GROUP BY DATE_TRUNC('month', o.created_at), u.region
WITH DATA;

-- Index trên materialized view
CREATE UNIQUE INDEX ON monthly_sales(month, region);

-- Refresh khi cần
REFRESH MATERIALIZED VIEW CONCURRENTLY monthly_sales;
REFRESH MATERIALIZED VIEW monthly_sales;

-- Sử dụng trong query
SELECT * FROM monthly_sales WHERE month >= '2024-01-01';
```

### 9.2. Partition Pruning

```sql
-- PostgreSQL: Xem partitions được sử dụng trong query
EXPLAIN
SELECT * FROM orders
WHERE created_at BETWEEN '2024-06-01' AND '2024-06-30'
  AND status = 'completed';

-- Nên hiển thị "Batch 0 only" thay vì "Batch 0-11"
-- Nghĩa là chỉ scan partition tháng 6
```

### 9.3. Parallel Query Execution

```sql
-- PostgreSQL: Bật parallel query
SHOW max_parallel_workers_per_gather;

-- Cấu hình
ALTER SYSTEM SET max_parallel_workers_per_gather = 4;
ALTER SYSTEM SET max_parallel_workers = 8;
ALTER SYSTEM SET parallel_tuple_cost = 0.01;
ALTER SYSTEM SET parallel_setup_cost = 100;

-- Xem parallel plan
EXPLAIN (ANALYZE)
SELECT COUNT(*), status
FROM orders
GROUP BY status;
-- Nên thấy "Parallel Seq Scan" hoặc "Parallel Hash Aggregate"
```

---

## 10. Performance Tuning Checklist

### 10.1. Pre-Production Checklist

- [ ] EXPLAIN ANALYZE tất cả critical queries
- [ ] Verify indexes được sử dụng (không unused indexes)
- [ ] Query statistics collected (pg_stat_statements)
- [ ] Slow query log enabled và monitored
- [ ] Connection pool configured
- [ ] Autovacuum tuned cho workload
- [ ] Database statistics up-to-date (ANALYZE)
- [ ] No N+1 queries
- [ ] No SELECT *
- [ ] Pagination sử dụng keyset thay vì OFFSET

### 10.2. Production Monitoring Checklist

| Check | Frequency | Action nếu Issue |
|---|---|---|
| Slow query log | Daily | Optimize hoặc add index |
| Cache hit ratio | Weekly | Tune shared_buffers |
| Connection usage | Real-time | Scale connection pool |
| Replication lag | Real-time | Optimize network / add replicas |
| Dead tuples | Weekly | Run VACUUM |
| Table/index bloat | Monthly | REINDEX, VACUUM FULL |
| Storage growth | Weekly | Monitor và plan capacity |
| Lock waits | Daily | Analyze contention |
