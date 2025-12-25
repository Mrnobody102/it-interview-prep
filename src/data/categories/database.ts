import { Category } from "./types";

export const database: Category = {
  id: "database",
  name: { vi: "Database", en: "Database" },
  description: {
    vi: 'Chủ đề "đào sâu" trong phỏng vấn',
    en: "Deep dive topic in interviews",
  },
  icon: "💾",
  topics: [
    // ===== I. OVERVIEW =====
    {
      id: "database-overview",
      name: { vi: "I. Overview", en: "I. Overview" },
      expanded: true,
      subtopics: [
        {
          id: "db-types",
          name: {
            vi: "DB Types (SQL vs NoSQL)",
            en: "DB Types (SQL vs NoSQL)",
          },
          content: {
            vi: `# <span style="color: #2563eb; font-weight: bold; font-size: 1.5em;">DB Types (SQL vs NoSQL)</span>

<br>

- **Relational DB (SQL):**

Tổ chức dữ liệu thành bảng, hàng, cột. Schema cố định, đảm bảo ACID.

+ Ví dụ: PostgreSQL, MySQL, Oracle.

+ Use cases: Dữ liệu quan hệ phức tạp, cần JOIN, transaction đảm bảo; hệ thống ngân hàng, đơn hàng.

- **NoSQL (Non-relational):**

Dữ liệu linh hoạt, không yêu cầu schema cố định, dễ mở rộng ngang.

+ Types: Document (MongoDB), Key-Value (Redis), Column (Cassandra), Graph (Neo4j).

+ Use cases: Dữ liệu phi cấu trúc hoặc thay đổi thường xuyên (profile, log, session); hệ thống real-time, social, IoT; không cần JOIN phức tạp.`,
            en: `# <span style="color: #2563eb; font-weight: bold; font-size: 1.5em;">DB Types (SQL vs NoSQL)</span>

<br>

- **Relational DB (SQL):**

Organize data into tables/rows/columns. Fixed schema, ACID guarantees.

+ Examples: PostgreSQL, MySQL, Oracle.

+ Use cases: Complex relational data, need JOINs and strong transactions; banking, order management.

- **NoSQL (Non-relational):**

Flexible data, no fixed schema, easy horizontal scaling.

+ Types: Document (MongoDB), Key-Value (Redis), Column (Cassandra), Graph (Neo4j).

+ Use cases: Unstructured or fast-changing data (profile, log, session); real-time/social/IoT; no complex JOINs needed.`,
          },
        },
        {
          id: "schema-design",
          name: { vi: "Schema Design", en: "Schema Design" },
          content: {
            vi: `# <span style="color: #2563eb; font-weight: bold; font-size: 1.5em;">Schema Design</span>

<br>

- **Normalization:**

Tổ chức dữ liệu giảm dư thừa, đảm bảo nhất quán (1NF, 2NF, 3NF...).

- **Denormalization:**

Chủ động lặp dữ liệu để giảm JOIN, tối ưu đọc; cân bằng giữa hiệu năng và nhất quán.`,
            en: `# <span style="color: #2563eb; font-weight: bold; font-size: 1.5em;">Schema Design</span>

<br>

- **Normalization:**

Organize data to reduce redundancy and keep consistency (1NF, 2NF, 3NF...).

- **Denormalization:**

Intentionally duplicate data to reduce JOINs and speed up reads; balance performance vs consistency.`,
          },
        },
        {
          id: "indexing-optimization",
          name: {
            vi: "Indexing & Query Optimization",
            en: "Indexing & Query Optimization",
          },
          content: {
            vi: `# <span style="color: #2563eb; font-weight: bold; font-size: 1.5em;">Indexing & Query Optimization</span>

<br>

- Index giúp tìm kiếm nhanh hơn (B-Tree, Hash, Full-text, Composite).

- Chỉ số phải phù hợp cột WHERE, JOIN, ORDER BY; tránh over-index gây tốn ghi.

- Dùng EXPLAIN/EXPLAIN ANALYZE để xem execution plan và tối ưu.

- Quy trình tối ưu query: xác định query chậm, xem plan, bổ sung/điều chỉnh index, tối ưu SQL (giảm SELECT * / JOIN dư), đo lại.`,
            en: `# <span style="color: #2563eb; font-weight: bold; font-size: 1.5em;">Indexing & Query Optimization</span>

<br>

- Index speeds up lookup (B-Tree, Hash, Full-text, Composite).

- Pick indexes for WHERE, JOIN, ORDER BY; avoid over-indexing which hurts writes.

- Use EXPLAIN/EXPLAIN ANALYZE to inspect execution plan and tune.

- Query tuning flow: identify slow query, inspect plan, add/adjust indexes, refine SQL (avoid SELECT * / extra JOINs), re-measure.`,
          },
        },
        {
          id: "transactions-isolation",
          name: {
            vi: "Transaction, Isolation, Locking",
            en: "Transaction, Isolation, Locking",
          },
          content: {
            vi: `# <span style="color: #2563eb; font-weight: bold; font-size: 1.5em;">Transaction, Isolation, Locking</span>

<br>

- **ACID:** Atomicity, Consistency, Isolation, Durability.

- **Isolation levels:** Read Uncommitted, Read Committed, Repeatable Read, Serializable.

- **Hiện tượng:** Dirty Read, Non-repeatable Read, Phantom Read.

- **Locking:** Shared vs Exclusive; cần tránh deadlock, giữ transaction ngắn, truy cập bảng theo thứ tự cố định.`,
            en: `# <span style="color: #2563eb; font-weight: bold; font-size: 1.5em;">Transaction, Isolation, Locking</span>

<br>

- **ACID:** Atomicity, Consistency, Isolation, Durability.

- **Isolation levels:** Read Uncommitted, Read Committed, Repeatable Read, Serializable.

- **Phenomena:** Dirty Read, Non-repeatable Read, Phantom Read.

- **Locking:** Shared vs Exclusive; avoid deadlock by short transactions and consistent lock ordering.`,
          },
        },
        {
          id: "scaling-replication",
          name: {
            vi: "Partitioning, Sharding, Replication",
            en: "Partitioning, Sharding, Replication",
          },
          content: {
            vi: `# <span style="color: #2563eb; font-weight: bold; font-size: 1.5em;">Partitioning, Sharding, Replication</span>

<br>

- **Partitioning/Sharding:** Chia dữ liệu theo key/phân vùng để scale ngang, giảm kích thước mỗi node.

- **Replication:** Master/Primary ghi, Read Replica đọc; tăng throughput đọc và HA.

- **Data migration:** Cần kế hoạch cutover, đồng bộ dữ liệu, rollback plan.`,
            en: `# <span style="color: #2563eb; font-weight: bold; font-size: 1.5em;">Partitioning, Sharding, Replication</span>

<br>

- **Partitioning/Sharding:** Split data by key/partition to scale horizontally and shrink per-node size.

- **Replication:** Master/Primary for writes, Read Replicas for reads; boost read throughput and HA.

- **Data migration:** Plan cutover, data sync, and rollback strategy.`,
          },
        },
        {
          id: "db-caching",
          name: { vi: "Caching", en: "Caching" },
          content: {
            vi: `# <span style="color: #2563eb; font-weight: bold; font-size: 1.5em;">Caching</span>

<br>

- Dùng Redis/Memcached để giảm tải database, phục vụ nhanh các truy vấn phổ biến.

- Chiến lược: cache aside (read-through), write-through, write-back; TTL, key invalidation rõ ràng.

- Chọn đúng dữ liệu để cache (ít thay đổi, truy cập nhiều).`,
            en: `# <span style="color: #2563eb; font-weight: bold; font-size: 1.5em;">Caching</span>

<br>

- Use Redis/Memcached to offload DB and speed up hot queries.

- Strategies: cache-aside (read-through), write-through, write-back; define TTL and invalidation.

- Pick data to cache (hot, infrequently changing).`,
          },
        },
        {
          id: "backup-recovery",
          name: { vi: "Backup & Recovery", en: "Backup & Recovery" },
          content: {
            vi: `# <span style="color: #2563eb; font-weight: bold; font-size: 1.5em;">Backup & Recovery</span>

<br>

- Thiết lập backup định kỳ (full, incremental) và kiểm tra restore định kỳ.

- Lưu trữ backup tách biệt, có versioning, kiểm soát quyền truy cập.

- Kế hoạch DR/BCP cho kịch bản mất dữ liệu hoặc outage vùng.`,
            en: `# <span style="color: #2563eb; font-weight: bold; font-size: 1.5em;">Backup & Recovery</span>

<br>

- Set up regular backups (full, incremental) and test restores.

- Store backups separately, with versioning and access control.

- DR/BCP plan for data loss or regional outage.`,
          },
        },
        {
          id: "performance-tuning",
          name: { vi: "Performance Tuning", en: "Performance Tuning" },
          content: {
            vi: `# <span style="color: #2563eb; font-weight: bold; font-size: 1.5em;">Performance Tuning</span>

<br>

- Bật slow query log, profiling; đo trước và sau khi tối ưu.

- Kiểm soát connection pool, timeout, keep-alive.

- Tối ưu cấu hình buffer/cache của DB; cân nhắc vật lý (I/O, SSD, mạng).

- Giảm SELECT *, tránh N+1, phân trang chuẩn (LIMIT/OFFSET hoặc keyset pagination).`,
            en: `# <span style="color: #2563eb; font-weight: bold; font-size: 1.5em;">Performance Tuning</span>

<br>

- Enable slow query log/profiling; measure before/after optimization.

- Tune connection pool, timeouts, keep-alive.

- Optimize DB buffer/cache configs; consider hardware (I/O, SSD, network).

- Avoid SELECT *, prevent N+1, paginate properly (LIMIT/OFFSET or keyset pagination).`,
          },
        },
        {
          id: "orm-jpa",
          name: {
            vi: "ORM, JPA, Spring Data JPA",
            en: "ORM, JPA, Spring Data JPA",
          },
          content: {
            vi: `# <span style="color: #2563eb; font-weight: bold; font-size: 1.5em;">ORM, JPA, Spring Data JPA</span>

<br>

- ORM map object ↔ table giúp giảm code SQL lặp lại.

- JPA là specification; Hibernate là implementation phổ biến.

- Spring Data JPA: repository pattern, method name query, JPQL/native query, pagination/sorting.

- Lưu ý N+1, lazy vs eager loading, fetch join khi cần.`,
            en: `# <span style="color: #2563eb; font-weight: bold; font-size: 1.5em;">ORM, JPA, Spring Data JPA</span>

<br>

- ORM maps object ↔ table, reducing repetitive SQL.

- JPA is a specification; Hibernate is a common implementation.

- Spring Data JPA: repository pattern, method-name queries, JPQL/native queries, pagination/sorting.

- Watch out for N+1, lazy vs eager loading, use fetch join when needed.`,
          },
        },
      ],
    },
    // ===== II. SCENARIO =====
    {
      id: "database-scenario",
      name: { vi: "II. Scenario", en: "II. Scenario" },
      expanded: true,
      subtopics: [
        {
          id: "jpa-vs-native",
          name: {
            vi: "Dùng JPA khác gì Native Query?",
            en: "JPA vs Native Query",
          },
          content: {
            vi: `# <span style="color: #2563eb; font-weight: bold; font-size: 1.5em;">Dùng JPA khác gì Native Query?</span>

<br>

- **JPA:** Trừu tượng hóa SQL, portable giữa DB, hỗ trợ entity mapping, transaction, caching, pagination.

- **Native Query:** Viết SQL thuần, tận dụng đặc thù DB, tối ưu hiệu năng cho case phức tạp.

- Thực tế: ưu tiên JPA/JPQL cho CRUD và truy vấn phổ biến; dùng native cho truy vấn phức tạp/đặc thù hoặc cần tối ưu sâu.`,
            en: `# <span style="color: #2563eb; font-weight: bold; font-size: 1.5em;">JPA vs Native Query</span>

<br>

- **JPA:** Abstracts SQL, portable across DBs, supports entity mapping, transactions, caching, pagination.

- **Native Query:** Raw SQL leveraging DB-specific features, best for complex/optimized cases.

- Practice: favor JPA/JPQL for CRUD/common queries; use native for complex/specialized or performance-critical queries.`,
          },
        },
        {
          id: "optimize-query-process",
          name: {
            vi: "Quy trình tối ưu query",
            en: "Query Optimization Process",
          },
          content: {
            vi: `# <span style="color: #2563eb; font-weight: bold; font-size: 1.5em;">Quy trình tối ưu query</span>

<br>

- Xác định query chậm (slow query log, APM).

- Xem execution plan (EXPLAIN/ANALYZE) để biết scan/index/joins.

- Tối ưu SQL: bỏ SELECT *, giảm JOIN không cần, thêm điều kiện lọc, dùng pagination đúng.

- Thiết kế/bổ sung index phù hợp; kiểm tra lại plan.

- Kiểm tra hạ tầng: connection pool, cache, partition/shard nếu cần.

- Đo lại và so sánh trước/sau.`,
            en: `# <span style="color: #2563eb; font-weight: bold; font-size: 1.5em;">Query Optimization Process</span>

<br>

- Identify slow queries (slow query log, APM).

- Inspect execution plan (EXPLAIN/ANALYZE) for scan/index/joins.

- Optimize SQL: drop SELECT *, reduce unnecessary JOINs, add filters, paginate correctly.

- Design/add proper indexes; re-check plan.

- Check infrastructure: connection pool, caching, partition/shard if needed.

- Re-measure and compare before/after.`,
          },
        },
      ],
    },
  ],
};
