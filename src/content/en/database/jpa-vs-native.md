# Database Scenario -> JPA vs Native Query

## 1. Quick Definitions

- **JPA/JPQL**: ORM abstraction for entity-centric access
- **Native SQL**: direct SQL for engine-specific control

Both are valid; choice depends on query complexity, portability needs, and performance goals.

---

## 2. Comparison

| Aspect | JPA / JPQL | Native SQL |
|---|---|---|
| Developer speed | High for CRUD | Slower for basic CRUD |
| Portability | Better | Lower (dialect-specific) |
| Complex analytics SQL | Limited/verbose | Strong |
| DB-specific features | Limited | Full access |
| Mapping convenience | Entity mapping built-in | Manual/DTO mapping needed |

---

## 3. When to Use JPA

Use JPA for:

- Standard CRUD
- Entity lifecycle and relationships
- Pagination/filtering with predictable patterns
- Faster team productivity and maintainability

Example:

```java
@Query("SELECT o FROM Order o WHERE o.user.id = :userId AND o.status = :status")
Page<Order> findOrders(@Param("userId") Long userId,
                       @Param("status") OrderStatus status,
                       Pageable pageable);
```

---

## 4. When to Use Native SQL

Use native SQL for:

- Window functions / CTE-heavy reports
- Engine-specific optimizations and hints
- Bulk updates/inserts where ORM is inefficient
- Fine-grained query plan control

Example:

```sql
WITH ranked AS (
  SELECT user_id,
         total,
         ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at DESC) rn
  FROM orders
)
SELECT user_id, total
FROM ranked
WHERE rn = 1;
```

---

## 5. Practical Team Policy

A pragmatic interview-grade policy:

1. Start with JPA for maintainable CRUD and domain flows.
2. Profile real bottlenecks.
3. Introduce native SQL only where it clearly improves correctness/performance.
4. Keep native queries isolated in repository/service layer with tests.

---

## 6. Common Pitfalls

### JPA pitfalls

- N+1 query issues due to lazy loading
- Accidental full entity loads when DTO projection is better
- Over-reliance on ORM defaults without query plan inspection

### Native SQL pitfalls

- Harder portability and refactoring
- Mapping errors and type conversion issues
- Security risk if parameterization is not strict

---

## 7. Interview Q&A

### Q1: Is native SQL always faster?

Not always. For many CRUD paths JPA is sufficient and optimized. Native SQL wins mostly on complex, DB-specific, or bulk-heavy paths.

### Q2: How do you decide in production?

Measure first (`EXPLAIN ANALYZE`, APM latency, throughput). Use JPA by default, native SQL only for proven hotspots.

### Q3: How to avoid JPA N+1 problems?

Use fetch joins/entity graphs/DTO projections deliberately and verify query counts in integration tests.