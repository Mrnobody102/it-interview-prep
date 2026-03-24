# Database -> DB Types (SQL vs NoSQL)

## 1. Relational Databases (SQL)

Relational databases store data in **tables** (rows + columns) with a predefined schema and strong consistency guarantees.

### Key characteristics

- Structured schema (DDL first, then data)
- ACID transactions
- Strong support for JOINs and constraints
- Mature query optimizers

### Typical systems

- PostgreSQL
- MySQL / MariaDB
- Oracle
- SQL Server

### Best-fit use cases

- Financial transactions
- Order/payment systems
- Strong data integrity requirements
- Complex reporting with multi-table JOINs

---

## 2. NoSQL Databases

NoSQL databases prioritize flexibility and horizontal scalability for high-volume or fast-changing workloads.

### Main categories

| Type | Model | Example | Best for |
|---|---|---|---|
| Document | JSON/BSON documents | MongoDB | Product catalog, user profile |
| Key-Value | key -> value | Redis, DynamoDB | Cache, session, token, counters |
| Column-family | Wide-column storage | Cassandra, HBase | Time-series, IoT ingest |
| Graph | Nodes + relationships | Neo4j | Recommendation, social graph |

### Typical strengths

- Flexible schema
- Easy horizontal scaling
- High write throughput (engine-dependent)
- Good fit for distributed systems

### Trade-offs

- Fewer complex relational operations
- Potential eventual consistency (depends on product/config)
- Query model differs per database

---

## 3. SQL vs NoSQL Decision Guide

| Criterion | SQL | NoSQL |
|---|---|---|
| Schema stability | High | Low / evolving |
| Relationship complexity | High | Low to medium |
| Transaction strictness | Strict ACID | Often relaxed or scoped ACID |
| Horizontal scale | Harder | Easier |
| Query flexibility | Strong SQL | Engine-specific |

Choose **SQL** when correctness and relational consistency dominate.
Choose **NoSQL** when scale/flexibility/write throughput dominate.

---

## 4. Practical Architecture Pattern (Common in interviews)

Most production systems use **polyglot persistence**:

- PostgreSQL/MySQL for core business entities
- Redis for caching/session/rate-limit
- MongoDB/Elasticsearch for document/search/log workflows

This keeps strong consistency where needed and scalability where beneficial.

---

## 5. Interview Q&A

### Q1: When should I pick SQL over NoSQL?

Use SQL for relational models, transactional integrity, and complex joins. Use NoSQL when schema changes quickly, data volume is huge, and horizontal scaling is the primary concern.

### Q2: Is NoSQL always eventually consistent?

No. Consistency is product- and configuration-specific. Many NoSQL systems support stronger consistency modes at higher latency/cost.

### Q3: Can one project use both SQL and NoSQL?

Yes, and it is common. Keep transactional data in SQL, high-speed cache/session in Redis, and specialized workloads (search/document/event data) in dedicated stores.