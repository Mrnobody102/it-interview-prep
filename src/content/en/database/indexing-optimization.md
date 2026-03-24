# Database -> Indexing & Query Optimization

## 1. Index Fundamentals

An index is a secondary structure (often B-Tree) that reduces scan cost for selective lookups.

### Common index types

- Single-column index
- Composite index
- Unique index
- Full-text index
- Partial/filtered index (engine-specific)

---

## 2. Composite Index Rule

Order matters.

For index `(customer_id, status, created_at)`:

- `WHERE customer_id = ?` -> uses index
- `WHERE customer_id = ? AND status = ?` -> uses index
- `WHERE status = ?` -> generally cannot use leading key effectively

Design composite indexes by real query patterns, not guesswork.

---

## 3. Where to index

Good candidates:

- Frequent `WHERE` predicates
- `JOIN` keys (especially foreign keys)
- `ORDER BY` / `GROUP BY` hot queries
- High-selectivity columns

Avoid over-indexing:

- Low-cardinality columns alone (e.g., boolean)
- Write-heavy tables with too many indexes
- Large text columns unless full-text/search-specific

---

## 4. Query Plan Analysis

Use `EXPLAIN` / `EXPLAIN ANALYZE` to inspect real execution behavior.

### Warning signs

- Sequential scan on large table
- Sort/hash spill to disk
- Wrong join order/cardinality estimates
- Large rows removed by filter

### Optimization flow

1. Capture slow queries (slow log / APM)
2. Inspect plan and cardinality estimates
3. Add/adjust indexes
4. Rewrite SQL if needed
5. Re-run `EXPLAIN ANALYZE`
6. Validate production metrics

---

## 5. High-impact SQL practices

- Avoid `SELECT *`
- Filter early
- Use keyset pagination for deep pages
- Replace expensive correlated subqueries with joins/window functions when appropriate
- Keep statistics updated (`ANALYZE`/autovacuum health)

Keyset pagination example:

```sql
-- Better than OFFSET for deep paging
SELECT id, created_at, total
FROM orders
WHERE (created_at, id) < (:lastCreatedAt, :lastId)
ORDER BY created_at DESC, id DESC
LIMIT 50;
```

---

## 6. Interview Q&A

### Q1: Why can indexes slow down writes?

Each insert/update/delete must also maintain every related index, increasing CPU/IO and lock pressure.

### Q2: How do you know an index helped?

Compare before/after via `EXPLAIN ANALYZE`, latency percentiles, and buffer/read metrics under realistic workload.

### Q3: OFFSET pagination problem?

Large OFFSET requires scanning/skipping many rows. Keyset pagination seeks directly from the last seen key, keeping latency stable.