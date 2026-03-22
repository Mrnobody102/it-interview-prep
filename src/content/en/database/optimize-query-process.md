# Database Query Optimization Process

## 1. Identifying Slow Queries

### 1.1. Slow Query Log

Enable and analyze the database slow query log:

```sql
-- MySQL: Enable slow query log
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL slow_query_log_file = '/var/log/mysql/slow.log';
SET GLOBAL long_query_time = 1; -- Log queries running > 1 second

-- PostgreSQL: pg_stat_statements
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

-- View top slow queries
SELECT query, calls, mean_time, total_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 20;
```

### 1.2. APM Tools

| Tool | Database | Features |
|------|---------|---------|
| **pg_stat_statements** | PostgreSQL | Query timing, call count |
| **Performance Schema** | MySQL | Query analysis, wait analysis |
| **DataDog APM** | All | Distributed tracing, query analysis |
| **New Relic** | All | APM, slow query detection |
| **pganalyze** | PostgreSQL | Query plan analysis, recommendations |

---

## 2. Analyzing Execution Plan

### 2.1. EXPLAIN / EXPLAIN ANALYZE

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

### 2.2. Reading Execution Plans

| Node Type | Meaning |
|-----------|---------|
| **Seq Scan** | Full table scan - usually a problem |
| **Index Scan** | Uses index - good |
| **Index Only Scan** | Reads only from index, no table hit - best |
| **Nested Loop** | Nested join with indexed columns - OK |
| **Hash Join** | Join using hash table - can be OK |
| **Sort** | Sorting - check if covered by index |
| **Bitmap Heap Scan** | Index scan reading many rows - can be slow |

> **Warning signs to optimize:** `Seq Scan` on large tables, `Sort` without index, `Hash Join` with large tables.

---

## 3. Common SQL Optimization Mistakes

### 3.1. Avoid SELECT *

```sql
-- Bad: Fetching all columns
SELECT * FROM orders WHERE user_id = 1001;

-- Good: Only fetch required columns
SELECT id, total, status, created_at
FROM orders WHERE user_id = 1001;
```

### 3.2. Reduce Unnecessary JOINs

```sql
-- Bad: JOINing many unnecessary tables
SELECT o.*, u.name, c.category_name, p.product_name
FROM orders o
JOIN users u ON o.user_id = u.id
JOIN order_items oi ON o.id = oi.order_id
JOIN products p ON oi.product_id = p.id
JOIN categories c ON p.category_id = c.id
WHERE o.id = 12345;

-- Good: Split into multiple queries or use subquery
SELECT id, total, status FROM orders WHERE id = 12345;
SELECT name FROM users WHERE id = (SELECT user_id FROM orders WHERE id = 12345);
```

### 3.3. Early Filtering

```sql
-- Bad: JOIN then filter
SELECT o.total, u.name
FROM orders o
JOIN users u ON o.user_id = u.id
WHERE u.country = 'Vietnam';

-- Good: Filter before JOIN (PostgreSQL)
SELECT o.total, u.name
FROM (SELECT * FROM users WHERE country = 'Vietnam') u
JOIN orders o ON o.user_id = u.id;
```

### 3.4. Subqueries vs Joins

```sql
-- Bad: Correlated subquery (runs N times)
SELECT p.name,
       (SELECT COUNT(*) FROM orders o WHERE o.product_id = p.id) AS order_count
FROM products p;

-- Good: LEFT JOIN with GROUP BY
SELECT p.name, COUNT(o.id) AS order_count
FROM products p
LEFT JOIN orders o ON p.id = o.product_id
GROUP BY p.id, p.name;
```

---

## 4. N+1 Query Problem

The N+1 problem occurs when fetching N parent entities and accessing M child entities generates **1 + N** queries.

### 4.1. Problem Example

```java
// BAD: N+1 query
List<User> users = userRepository.findByActiveTrue();
for (User user : users) {
    List<Order> orders = orderRepository.findByUserId(user.getId()); // N+1!
}
```

### 4.2. Solution 1: Fetch Join

```java
@Query("SELECT u FROM User u LEFT JOIN FETCH u.orders WHERE u.active = true")
List<User> findActiveWithOrders();
```

```java
// Fetch join with multiple relationships
@Query("SELECT DISTINCT u FROM User u " +
       "LEFT JOIN FETCH u.orders " +
       "LEFT JOIN FETCH u.addresses " +
       "WHERE u.active = true")
List<User> findActiveWithDetails();
```

### 4.3. Solution 2: @EntityGraph

```java
@EntityGraph(attributePaths = {"orders", "addresses"})
@Query("SELECT u FROM User u WHERE u.active = true")
List<User> findActiveWithDetails();
```

```java
// Named entity graph
@NamedEntityGraph(
    name = "User.withOrdersAndAddresses",
    attributeNodes = {
        @NamedAttributeNode("orders"),
        @NamedAttributeNode("addresses")
    }
)
@Entity
public class User { ... }

// Usage
@EntityGraph(value = "User.withOrdersAndAddresses", type = EntityGraph.EntityGraphType.FETCH)
Optional<User> findById(Long id);
```

### 4.4. Solution 3: @BatchSize

```java
// Per-relationship config
@OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
@BatchSize(size = 20)
private List<Order> orders;
```

```java
// Global config - application.yml
spring:
  jpa:
    properties:
      hibernate:
        default_batch_fetch_size: 20
```

| Solution | When to use | Pros | Cons |
|----------|------------|------|------|
| **Fetch Join** | Always need child data | Single query, complete control | Limited flexibility, can cause cartesian product |
| **@EntityGraph** | Varying fetch needs per query | Flexible, explicit | Still limited flexibility |
| **@BatchSize** | Default lazy loading behavior | Transparent, easy | Still N queries (just batched), extra query on first access |

---

## 5. Aggregate Report Queries

### 5.1. Native Queries for Complex Aggregation

```java
// Native query for complex reporting
@Query(value = """
    SELECT u.region,
           DATE_TRUNC('month', o.created_at) AS month,
           COUNT(o.id) AS order_count,
           SUM(o.total) AS total_sales,
           AVG(o.total) AS avg_order_value
    FROM orders o
    JOIN users u ON o.user_id = u.id
    WHERE o.created_at >= :startDate
      AND o.created_at < :endDate
    GROUP BY u.region, DATE_TRUNC('month', o.created_at)
    ORDER BY u.region, month
    """, nativeQuery = true)
List<Object[]> getMonthlySalesReport(
    @Param("startDate") LocalDateTime startDate,
    @Param("endDate") LocalDateTime endDate);
```

### 5.2. Database Views

```sql
-- Create a view for the report
CREATE VIEW monthly_sales_report AS
SELECT
    u.region,
    DATE_TRUNC('month', o.created_at) AS month,
    COUNT(o.id) AS order_count,
    SUM(o.total) AS total_sales,
    AVG(o.total) AS avg_order_value
FROM orders o
JOIN users u ON o.user_id = u.id
GROUP BY u.region, DATE_TRUNC('month', o.created_at);
```

```java
// Map to DTO
public class MonthlySalesDTO {
    private String region;
    private LocalDate month;
    private Long orderCount;
    private BigDecimal totalSales;
    private BigDecimal avgOrderValue;
}

@Query("SELECT new com.example.MonthlySalesDTO(" +
       "  FUNCTION('DATE_TRUNC', 'month', o.createdAt)," +
       "  u.region, COUNT(o), SUM(o.total), AVG(o.total)) " +
       "FROM Order o JOIN o.user u " +
       "GROUP BY FUNCTION('DATE_TRUNC', 'month', o.createdAt), u.region")
List<MonthlySalesDTO> getMonthlySales();
```

### 5.3. Stored Procedures

```sql
-- PostgreSQL stored procedure
CREATE OR REPLACE FUNCTION get_monthly_report(
    p_start_date DATE,
    p_end_date DATE
)
RETURNS TABLE (
    region VARCHAR,
    month DATE,
    order_count BIGINT,
    total_sales NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        u.region,
        DATE_TRUNC('month', o.created_at)::DATE,
        COUNT(o.id),
        SUM(o.total)
    FROM orders o
    JOIN users u ON o.user_id = u.id
    WHERE o.created_at >= p_start_date
      AND o.created_at < p_end_date
    GROUP BY u.region, DATE_TRUNC('month', o.created_at)
    ORDER BY u.region, month;
END;
$$ LANGUAGE plpgsql;
```

```java
@Query(value = "SELECT * FROM get_monthly_report(:startDate, :endDate)", nativeQuery = true)
List<Object[]> getMonthlyReport(
    @Param("startDate") Date startDate,
    @Param("endDate") Date endDate);
```

---

## 6. Batch Insert/Update

### 6.1. EntityManager Flush and Clear

```java
@Service
public class BatchImportService {

    @PersistenceContext
    private EntityManager entityManager;

    @Transactional
    public void importUsers(List<UserDTO> dtos) {
        int batchSize = 50;
        int total = dtos.size();

        for (int i = 0; i < total; i++) {
            User user = toEntity(dtos.get(i));
            entityManager.persist(user);

            // Flush and clear every batchSize records
            if (i > 0 && i % batchSize == 0) {
                entityManager.flush();
                entityManager.clear();  // Release memory, release persistence context
            }
        }

        // Final flush for remaining records
        entityManager.flush();
        entityManager.clear();
    }
}
```

**Why flush() and clear()?**

- `flush()`: Sends pending SQL statements to the database (executes batched inserts/updates)
- `clear()`: Clears the persistence context, detaching all managed entities
- Prevents `OutOfMemoryException` with large datasets
- Without clear(), all previously inserted entities remain in memory

### 6.2. Hibernate batch_size Configuration

```yaml
# application.yml
spring:
  jpa:
    properties:
      hibernate:
        jdbc:
          batch_size: 50
        order_inserts: true    # Order inserts by entity type
        order_updates: true    # Order updates by entity type
        batch_fetch_style: PERSISTENT
    hibernate:
      ddl-auto: validate
```

```java
// Verify batch inserts are working
spring:
  jpa:
    show-sql: true
    properties:
      hibernate:
        format_sql: true
        use_sql_comments: true
```

### 6.3. MySQL Batch Insert with JDBC

```java
@Service
public class JdbcBatchService {

    @Autowired
    private DataSource dataSource;

    @Transactional
    public void batchInsertUsers(List<UserDTO> users) {
        String sql = "INSERT INTO users (name, email, status) VALUES (?, ?, ?)";

        try (Connection conn = dataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            conn.setAutoCommit(false);  // Disable auto-commit for batching

            for (UserDTO user : users) {
                ps.setString(1, user.getName());
                ps.setString(2, user.getEmail());
                ps.setString(3, user.getStatus());
                ps.addBatch();
            }

            ps.executeBatch();  // Execute all
            conn.commit();     // Commit transaction

        } catch (SQLException e) {
            throw new RuntimeException("Batch insert failed", e);
        }
    }
}
```

---

## 7. Keyset Pagination (Cursor-Based)

### 7.1. Why OFFSET is Slow

```sql
-- Bad: OFFSET with large page numbers
-- Database must read and skip 10000 rows to return just 10
SELECT * FROM orders ORDER BY id LIMIT 10 OFFSET 10000;
-- The larger the OFFSET, the slower the query
-- Page 1000 (20 items): Database scans 20000 rows

-- Bad: Page 100 with 20 items per page
SELECT * FROM orders ORDER BY id LIMIT 20 OFFSET 2000;
```

### 7.2. Keyset Pagination Implementation

```sql
-- Keyset pagination: Constant time regardless of page
-- Page 2 (after ID 10000)
SELECT * FROM orders
WHERE id > 10000
ORDER BY id
LIMIT 10;

-- Composite keyset for multi-column sort
SELECT * FROM orders
WHERE (created_at, id) < ('2024-01-15', 12345)
ORDER BY created_at DESC, id DESC
LIMIT 10;
```

### 7.3. Spring Data Implementation

```java
// Repository with keyset query
@Query("SELECT o FROM Order o WHERE o.id > :cursor ORDER BY o.id ASC")
List<Order> findNextBatch(@Param("cursor") Long cursor, Pageable pageable);

@Query("SELECT o FROM Order o " +
       "WHERE (o.createdAt < :lastDate OR (o.createdAt = :lastDate AND o.id < :lastId)) " +
       "ORDER BY o.createdAt DESC, o.id DESC")
List<Order> findNextWithCompositeCursor(
    @Param("lastDate") LocalDateTime lastDate,
    @Param("lastId") Long lastId,
    Pageable pageable);
```

```java
// Service layer
@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    public PageResult<Order> getOrders(Long cursor, int pageSize) {
        List<Order> orders = orderRepository.findNextBatch(
            cursor, PageRequest.of(0, pageSize));

        // Generate next cursor from last item
        String nextCursor = null;
        if (orders.size() == pageSize) {
            Order last = orders.get(orders.size() - 1);
            nextCursor = String.valueOf(last.getId());
        }

        return new PageResult<>(orders, nextCursor);
    }
}

// DTO for cursor-based response
public class PageResult<T> {
    private List<T> items;
    private String nextCursor;
    private boolean hasMore;

    public PageResult(List<T> items, String nextCursor) {
        this.items = items;
        this.nextCursor = nextCursor;
        this.hasMore = nextCursor != null;
    }
}
```

### 7.4. REST API Design

```
// Request with cursor (no OFFSET)
GET /api/orders?cursor=10000&limit=20

// Response
{
  "items": [...],
  "nextCursor": "10020",
  "hasMore": true
}

// Frontend: Store nextCursor and send it in next request
```

---

## 8. Composite Index Examples

### 8.1. Index Column Order Rules

**Rule: Equality columns first, Range/Sort columns last.**

```sql
-- Query: WHERE status = 'pending' AND created_at > '2024-01-01'
-- Correct: status (equality) first, created_at (range) last
CREATE INDEX idx_orders_status_created ON orders(status, created_at);

-- Query: WHERE user_id = ? AND status = ?
-- Both are equality - order by selectivity (high cardinality first)
CREATE INDEX idx_orders_user_status ON orders(user_id, status);
```

### 8.2. Common Patterns

```sql
-- E-commerce orders table
-- Query: WHERE user_id = ? AND status = ? ORDER BY created_at DESC
CREATE INDEX idx_orders_user_status_created
    ON orders(user_id, status, created_at DESC);

-- Query: WHERE status = 'completed' AND category = ?
CREATE INDEX idx_orders_status_category ON orders(status, category);

-- Query: WHERE email LIKE 'prefix%' (prefix search)
CREATE INDEX idx_users_email_prefix ON users(email);

-- Query: WHERE created_at >= ? AND status = ? (date range)
CREATE INDEX idx_orders_created_status ON orders(created_at, status);

-- Partial index for active orders only
CREATE INDEX idx_orders_active_user
    ON orders(user_id, created_at)
    WHERE status = 'active';
```

### 8.3. Covering Index

An index that includes all columns needed by a query - eliminates table access:

```sql
-- Query needs: name, email WHERE id = ?
-- Create covering index
CREATE INDEX idx_users_covering ON users(id) INCLUDE (name, email);

-- Now this query only reads from index (Index Only Scan)
SELECT name, email FROM users WHERE id = 1001;
```

---

## 9. Full-Text Search

### 9.1. B-Tree vs Full-Text Index

| Feature | B-Tree Index | Full-Text Index |
|---------|-------------|-----------------|
| **Use case** | Exact match, prefix, range | Word search, phrase search |
| **Pattern** | `WHERE name = 'John'` | `WHERE MATCH(name) AGAINST('John')` |
| **Wildcard** | `LIKE 'prefix%'` (indexed) | `LIKE '%word%'` (full scan) |
| **Ranking** | No | Yes (relevance score) |

### 9.2. PostgreSQL Full-Text Search

```sql
-- Create GIN index for full-text search
CREATE INDEX idx_products_search ON products USING GIN(to_tsvector('english', name || ' ' || description));

-- Search query
SELECT * FROM products
WHERE to_tsvector('english', name || ' ' || description)
      @@ to_tsquery('english', 'spring & boot & framework');
```

```java
// JPA with full-text search
@Query(value = """
    SELECT * FROM products
    WHERE to_tsvector('english', name || ' ' || description)
          @@ to_tsquery('english', :query)
    """, nativeQuery = true)
List<Product> fullTextSearch(@Param("query") String query);
```

### 9.3. MySQL Full-Text Search

```sql
-- Create full-text index
ALTER TABLE products ADD FULLTEXT INDEX ft_products_name_desc (name, description);

-- Search
SELECT *, MATCH(name, description) AGAINST('spring framework' IN NATURAL LANGUAGE MODE) AS relevance
FROM products
WHERE MATCH(name, description) AGAINST('spring framework' IN NATURAL LANGUAGE MODE)
ORDER BY relevance DESC;
```

---

## 10. Query Optimization Checklist

| Step | Action |
|------|--------|
| 1 | Enable slow query log, find top queries |
| 2 | Run EXPLAIN ANALYZE, find Seq Scan without index |
| 3 | Avoid SELECT *, add early filtering |
| 4 | Create appropriate indexes for WHERE, JOIN, ORDER BY |
| 5 | Check connection pool size |
| 6 | Add cache (Redis) for frequently-read queries |
| 7 | Re-measure and compare before/after |

> **Tip:** Always optimize queries with **index scans** first. Adding an index is often the fastest solution. If a query is still slow despite an index, consider: covering index, partition, or denormalization.
