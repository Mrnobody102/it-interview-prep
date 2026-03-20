# Database → Performance Tuning

## Slow Query

- Enable slow query log/profiling; measure before/after optimization.

## Connection Pool

- Tune connection pool, timeouts, keep-alive.

## Config

- Optimize DB buffer/cache configs; consider I/O, SSD, network.

## Query Best Practices

- Avoid SELECT *, prevent N+1, paginate properly (LIMIT/OFFSET or keyset pagination).