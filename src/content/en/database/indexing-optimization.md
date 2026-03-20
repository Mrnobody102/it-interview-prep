# Database → Indexing & Query Optimization

## Index

- Speeds up lookup (B-Tree, Hash, Full-text, Composite).
- Index on WHERE, JOIN, ORDER BY columns; avoid over-indexing which hurts writes.

## EXPLAIN / EXPLAIN ANALYZE

- Inspect execution plan and tune query.

## Query Tuning Flow

1. Identify slow query (slow query log).
2. Inspect plan (EXPLAIN).
3. Add/adjust indexes.
4. Refine SQL (avoid SELECT *, extra JOINs).
5. Re-measure.