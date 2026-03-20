# Database

## Quy trình tối ưu Query

### 1. Xác định query chậm

#### 1.1. Slow Query Log

Kích hoạt và phân tích slow query log của database:

```sql
-- MySQL: Bật slow query log
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL slow_query_log_file = '/var/log/mysql/slow.log';
SET GLOBAL long_query_time = 1; -- Query chạy > 1 giây được log

-- PostgreSQL: pg_stat_statements
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

-- Xem top queries chậm
SELECT query, calls, mean_time, total_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 20;
```

#### 1.2. APM Tools

| Tool | Database | Features |
|---|---|---|
| **pg_stat_statements** | PostgreSQL | Query timing, call count |
| **Performance Schema** | MySQL | Query analysis, wait analysis |
| **DataDog APM** | All | Distributed tracing, query analysis |
| **New Relic** | All | APM, slow query detection |

---

### 2. Phân tích Execution Plan

#### 2.1. EXPLAIN / EXPLAIN ANALYZE

```sql
-- PostgreSQL
EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT)
SELECT u.name, o.total
FROM users u
JOIN orders o ON u.id = o.user_id
WHERE u.created_at > '2024-01-01'
ORDER BY o.total DESC
LIMIT 100;

-- MySQL
EXPLAIN FORMAT=JSON
SELECT * FROM orders WHERE user_id IN (SELECT id FROM users WHERE active = 1);
```

#### 2.2. Đọc Execution Plan

| Node Type | Ý nghĩa |
|---|---|
| **Seq Scan** | Full table scan — thường là vấn đề |
| **Index Scan** | Sử dụng index — tốt |
| **Index Only Scan** | Chỉ đọc từ index, không đụng bảng — tốt nhất |
| **Nested Loop** | Join nhỏ với index tốt — OK |
| **Hash Join** | Join lớn, dùng hash table — có thể OK |
| **Sort** | Sắp xếp — kiểm tra nếu có index covering |
| **Bitmap Heap Scan** | Index lớn, đọc nhiều rows — có thể chậm |

> **Dấu hiệu cần tối ưu:** `Seq Scan` trên bảng lớn, `Sort` không có index, `Hash Join` với large tables.

---

### 3. Tối ưu SQL

#### 3.1. Tránh SELECT *

```sql
-- Bad: Lấy tất cả columns
SELECT * FROM orders WHERE user_id = 1001;

-- Good: Chỉ lấy columns cần thiết
SELECT id, total, status, created_at
FROM orders WHERE user_id = 1001;
```

#### 3.2. Giảm JOIN không cần thiết

```sql
-- Bad: JOIN nhiều bảng không cần thiết
SELECT o.*, u.name, c.category_name, p.product_name
FROM orders o
JOIN users u ON o.user_id = u.id
JOIN order_items oi ON o.id = oi.order_id
JOIN products p ON oi.product_id = p.id
JOIN categories c ON p.category_id = c.id
WHERE o.id = 12345;

-- Good: Tách thành nhiều queries hoặc dùng subquery
SELECT id, total, status FROM orders WHERE id = 12345;
SELECT name FROM users WHERE id = (SELECT user_id FROM orders WHERE id = 12345);
```

#### 3.3. Thêm điều kiện lọc sớm

```sql
-- Bad: JOIN rồi mới lọc
SELECT o.total, u.name
FROM orders o
JOIN users u ON o.user_id = u.id
WHERE u.country = 'Vietnam';

-- Good: Lọc trước khi JOIN (áp dụng cho PostgreSQL)
SELECT o.total, u.name
FROM (SELECT * FROM users WHERE country = 'Vietnam') u
JOIN orders o ON o.user_id = u.id;
```

#### 3.4. Phân trang đúng cách

```sql
-- Bad: OFFSET lớn rất chậm
SELECT * FROM orders ORDER BY id LIMIT 100 OFFSET 100000;

-- Good: Keyset pagination (cursor-based)
SELECT * FROM orders
WHERE id > 100000
ORDER BY id
LIMIT 100;

-- PostgreSQL: Dùng CTE với index
WITH ordered AS (
    SELECT *, id AS cursor
    FROM orders
    ORDER BY id
)
SELECT * FROM ordered
WHERE cursor > (SELECT id FROM orders WHERE id = 100000)
LIMIT 100;
```

---

### 4. Thiết kế Index

#### 4.1. Index phù hợp

| Loại Index | Dùng khi |
|---|---|
| **B-tree (default)** | Equality, range queries, ORDER BY |
| **Hash** | Equality only (`WHERE id = ?`) |
| **GIN** | Full-text search, JSONB |
| **GiST** | Geometric, range types |
| **Partial** | Chỉ index một phần bảng thỏa điều kiện |
| **Composite** | Multi-column queries với điều kiện |

#### 4.2. Composite Index Order

Quy tắc: **Equality trước, Range sau.**

```sql
-- Query: WHERE status = 'pending' AND created_at > '2024-01-01'
-- Đúng: status (equality) trước, created_at (range) sau
CREATE INDEX idx_orders_status_created ON orders(status, created_at);

-- Query: WHERE user_id = ? AND status = ?
-- Thứ tự không quan trọng lắm, nhưng nên đặt selectivity cao trước
CREATE INDEX idx_orders_user_status ON orders(user_id, status);
```

#### 4.3. Covering Index

Index chứa đủ columns cần thiết — không cần đụng bảng:

```sql
-- Query cần: name, email từ users WHERE id = ?
-- Tạo covering index
CREATE INDEX idx_users_covering ON users(id) INCLUDE (name, email);

-- Giờ query này chỉ đọc từ index (Index Only Scan)
SELECT name, email FROM users WHERE id = 1001;
```

---

### 5. Kiểm tra hạ tầng

#### 5.1. Connection Pooling

```yaml
# PostgreSQL - HikariCP (Java)
spring:
  datasource:
    hikari:
      maximum-pool-size: 20
      minimum-idle: 5
      connection-timeout: 30000
      idle-timeout: 600000
      max-lifetime: 1800000

# MySQL - C3P0 hoặc HikariCP
# important: KHÔNG để max pool size quá lớn
# Công thức: max_connections = (core_count * 2) + effective_spindle_count
```

#### 5.2. Cache kết hợp

```sql
-- PostgreSQL: Bật query cache
ALTER SYSTEM SET shared_buffers = '4GB';
ALTER SYSTEM SET effective_cache_size = '12GB';
ALTER SYSTEM SET work_mem = '256MB';

-- MySQL: Tối ưu InnoDB
SET GLOBAL innodb_buffer_pool_size = 8 * 1024 * 1024 * 1024; -- 8GB
SET GLOBAL innodb_log_file_size = 1 * 1024 * 1024 * 1024; -- 1GB
```

---

### 6. Đo lại và so sánh

```sql
-- PostgreSQL: So sánh trước/sau với pg_stat_statements
SELECT query, calls, mean_time, total_time
FROM pg_stat_statements
WHERE query LIKE '%orders%'
ORDER BY total_time DESC;

-- MySQL: Dùng EXPLAIN ANALYZE
EXPLAIN ANALYZE SELECT ...
-- So sánh actual time vs estimated time
```

---

### Checklist tối ưu Query

| Bước | Action |
|---|---|
| 1 | Bật slow query log, tìm top queries |
| 2 | Chạy EXPLAIN ANALYZE, tìm Seq Scan không index |
| 3 | Tránh SELECT *, thêm điều kiện lọc sớm |
| 4 | Tạo/index phù hợp cho WHERE, JOIN, ORDER BY |
| 5 | Kiểm tra connection pool size |
| 6 | Thêm cache (Redis) cho queries đọc nhiều |
| 7 | Đo lại, so sánh trước/sau |

> **Tip:** Luôn tối ưu query **có index scan** trước. Thêm index thường là giải pháp nhanh nhất. Nếu query vẫn chậm dù có index, xem xét: covering index, partition, hoặc denormalization.
