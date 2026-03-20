# Database Scenario → Query Optimization Process

## Steps

1. **Identify** slow queries (slow query log, APM).
2. **Analyze** execution plan (EXPLAIN/ANALYZE).
3. **Optimize SQL:** Drop SELECT *, reduce unnecessary JOINs, add filters, paginate correctly.
4. **Add/proper indexes;** re-check plan.
5. **Check infrastructure:** Connection pool, caching, partition/shard if needed.
6. **Re-measure** and compare before/after.