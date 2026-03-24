# Database -> Schema Design

## 1. Normalization

Normalization reduces data redundancy and update anomalies while preserving integrity.

### Common normal forms

| Form | Rule | Practical impact |
|---|---|---|
| 1NF | Atomic values only | No arrays/lists in one column |
| 2NF | No partial dependency on composite key | Move attributes to proper entity |
| 3NF | No transitive dependency | Cleaner domain separation |

### Why normalize first

- Prevent duplicate truth sources
- Avoid update/insert/delete anomalies
- Keep constraints easier to enforce

---

## 2. Denormalization

Denormalization intentionally duplicates or pre-computes data to improve read performance.

### Common patterns

- Summary tables (daily/monthly aggregates)
- Materialized views
- Storing computed fields (e.g., order_total)

### Trade-off

- Faster reads
- More complex writes and consistency handling

Rule of thumb: **normalize first, denormalize with measured bottlenecks**.

---

## 3. Core Schema Design Principles

### 3.1 Data type discipline

- Use smallest safe numeric type
- Prefer `TIMESTAMP WITH TIME ZONE` for event time
- Avoid unbounded text for indexed/filter columns

### 3.2 Keys and constraints

- Use surrogate PK (`BIGSERIAL`, UUID) for stability
- Add unique constraints for business keys (email, code)
- Enforce foreign keys where referential integrity matters

### 3.3 Audit columns

- `created_at`
- `updated_at`
- optional `created_by`, `updated_by`
- optional soft-delete: `deleted_at`

---

## 4. Relationship Modeling

| Relationship | Typical implementation |
|---|---|
| 1-1 | Unique FK |
| 1-N | FK on child table |
| N-N | Junction table with composite PK |
| Self-reference | `parent_id` FK to same table |

Example N-N:

```sql
CREATE TABLE order_items (
  order_id BIGINT NOT NULL,
  product_id BIGINT NOT NULL,
  quantity INT NOT NULL,
  unit_price NUMERIC(12,2) NOT NULL,
  PRIMARY KEY (order_id, product_id)
);
```

---

## 5. Migration and Evolution

When schema changes in production:

1. Add backward-compatible columns/tables first
2. Deploy app code that writes both old/new if needed
3. Backfill data in batches
4. Switch reads to new shape
5. Drop old columns/tables in a later release

Use migration tooling (Flyway/Liquibase) and avoid manual drift.

---

## 6. Interview Q&A

### Q1: Normalization vs denormalization?

Normalize by default for correctness and maintainability; denormalize selectively for proven read bottlenecks.

### Q2: Surrogate key or natural key?

Use surrogate keys as PK for stability. Keep natural keys as unique constraints when business requires.

### Q3: Soft delete or hard delete?

Soft delete is safer for audit/recovery and cross-table references. Hard delete is suitable for strict retention policies or storage cleanup jobs.