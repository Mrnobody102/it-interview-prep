# Database -> Partitioning, Sharding, Replication

## 1. Scaling Approaches

### Vertical scaling (scale up)

Upgrade CPU/RAM/IO on a single DB node.

- Simple operationally
- Fast first step
- Limited ceiling and potential single point of failure

### Horizontal scaling (scale out)

Distribute load/data across multiple nodes.

- Higher complexity
- Better long-term scale and availability

---

## 2. Replication

Replication keeps one or more copies of data from a primary source.

### Common topology

- Primary handles writes
- Replicas handle reads

Benefits:

- Increased read throughput
- Better fault tolerance
- Region-local reads for global users

Key concern: **replication lag** (read-after-write inconsistency on replicas).

---

## 3. Sharding

Sharding splits data across multiple independent database nodes.

### Shard key options

- Hash-based (good distribution)
- Range-based (good range queries)
- Tenant-based (SaaS isolation)

Design risks:

- Hot shards from poor key choice
- Cross-shard joins/transactions
- Rebalancing complexity

---

## 4. Partitioning (inside one DB cluster/instance)

Partitioning divides a logical table into physical partitions.

Useful for:

- Time-series/order/event data
- Faster pruning by date/key range
- Easier archival and maintenance

Example categories:

- Range partition (`created_at`)
- Hash partition (`tenant_id`)
- List partition (`region`)

---

## 5. Practical Read/Write Strategy

- Route writes to primary
- Route non-critical reads to replicas
- Route read-after-write or strongly consistent reads to primary
- Monitor lag and failover health continuously

---

## 6. Interview Q&A

### Q1: Replication vs sharding?

Replication copies the same dataset for availability/read scaling. Sharding splits dataset for storage/write scaling.

### Q2: How to choose shard key?

Choose high-cardinality key with even traffic distribution and query locality. Avoid keys that create hotspots.

### Q3: Why can read replicas cause stale reads?

Because replication is asynchronous in many systems; writes commit on primary before replicas catch up.