# Database → Caching

## Strategies

- Use Redis/Memcached to offload DB, speed up common queries.
- **Cache aside (read-through):** Check cache first, on miss query DB then update cache.
- **Write-through:** Write to DB and cache simultaneously.
- **Write-back:** Write to cache first, sync to DB later.
- Define TTL and invalidation clearly.