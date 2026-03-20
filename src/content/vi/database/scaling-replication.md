# Chủ đề Database Scaling và Replication

## 1. Tổng quan về Database Scaling

### 1.1. Scale Up vs Scale Out

Khi lưu lượng truy cập tăng, database cần được mở rộng. Có hai hướng tiếp cận chính:

**Vertical Scaling (Scale Up):**
- Tăng cấu hình phần cứng của server hiện tại: CPU, RAM, Disk (SSD/NVMe).
- Đơn giản, không cần thay đổi kiến trúc ứng dụng.
- Giới hạn: max hardware, chi phí tăng phi tuyến tính, single point of failure.

**Horizontal Scaling (Scale Out):**
- Thêm nhiều server/database nodes để phân phối dữ liệu và tải.
- Phức tạp hơn về kiến trúc (sharding, partitioning).
- Không giới hạn về mặt lý thuyết.

| Tiêu chí | Vertical Scaling | Horizontal Scaling |
|---|---|---|
| **Chi phí ban đầu** | Thấp | Cao |
| **Chi phí tăng dần** | Cao (phần cứng đắt) | Thấp hơn (commodity hardware) |
| **Độ phức tạp** | Thấp | Cao |
| **GIới hạn** | Max 1 server | Không giới hạn lý thuyết |
| **Availability** | Single point of failure | High availability |
| **Use case** | Startup, moderate load | Large scale, high traffic |

### 1.2. Khi nào cần Scale?

Theo dõi các metrics sau để quyết định:

| Metric | Ngưỡng cảnh báo | Hành động |
|---|---|---|
| CPU Usage | > 70% liên tục | Optimise queries, scale up |
| Memory Usage | > 85% | Tăng RAM, optimize buffer pool |
| Disk I/O | > 70% utilization | Dùng SSD, scale out |
| Connection count | > 80% max_connections | Connection pooling, scale out |
| Query latency | > 100ms P95 | Optimise indexes, query tuning |
| Replication lag | > 1s | Optimize network, reduce load |

---

## 2. Read Replicas (Bản sao đọc)

### 2.1. Khái niệm Read Replica

Read Replica là một bản sao của database chính (Primary), chỉ cho phép đọc. Tất cả write operations được điều hướng đến Primary, read operations có thể được phân tán đến replicas.

```
                    ┌─────────────────┐
                    │   Application   │
                    └────────┬────────┘
                             │
              ┌──────────────┴──────────────┐
              │                              │
        Write │                              │ Read
              │                              │
              ▼                              ▼
     ┌─────────────────┐          ┌─────────────────┐
     │     Primary     │ ──────►  │  Read Replica 1 │
     │   (Master)      │          │                 │
     └─────────────────┘          └─────────────────┘
                                        ▲
                                        │ Replication
                                        │
                              ┌─────────────────┐
                              │  Read Replica 2 │
                              │                 │
                              └─────────────────┘
```

### 2.2. Lợi ích của Read Replica

- **Tăng read throughput**: Phân phối read load ra nhiều replicas.
- **Cải thiện availability**: Replica có thể thay thế Primary khi fail.
- **Geographic distribution**: Đặt replicas ở các region gần người dùng hơn.
- **Backup không ảnh hưởng Primary**: Chạy backup trên replica.
- **Reporting & Analytics**: Tách biệt workload phân tích ra khỏi OLTP.

### 2.3. Triển khai Read Replica

#### MySQL Replication

```sql
-- Trên Primary: Tạo replication user
CREATE USER 'repl_user'@'%' IDENTIFIED BY 'repl_password';
GRANT REPLICATION SLAVE ON *.* TO 'repl_user'@'%';

-- Cấu hình Primary (my.cnf)
[mysqld]
server-id = 1
log-bin = mysql-bin
binlog_format = ROW
binlog_row_image = FULL
sync_binlog = 1
innodb_flush_log_at_trx_commit = 1
```

```sql
-- Trên Replica: Kết nối đến Primary
CHANGE MASTER TO
  MASTER_HOST = 'primary-host',
  MASTER_USER = 'repl_user',
  MASTER_PASSWORD = 'repl_password',
  MASTER_LOG_FILE = 'mysql-bin.000001',
  MASTER_LOG_POS = 157;

START SLAVE;
SHOW SLAVE STATUS\G
```

#### PostgreSQL Streaming Replication

```bash
# Cấu hình Primary (postgresql.conf)
listen_addresses = '*'
max_wal_senders = 5
wal_level = replica
hot_standby = on

# pg_hba.conf - cho phép replication
host  replication  repl_user  replica_ip/32  md5

# Trên Replica: Tạo base backup
pg_basebackup -h primary-host -U repl_user -D /var/lib/postgresql/data -R -P
```

### 2.4. Read/Write Splitting trong Ứng dụng

```python
# Python: Read-Write Splitting
import readwrite分离 as rws

class DatabaseRouter:
    def db_for_read(self, model):
        return random.choice(['replica1', 'replica2', 'replica3'])

    def db_for_write(self, model):
        return 'primary'


# Manual routing trong FastAPI
class DatabaseManager:
    def __init__(self):
        self.primary = create_engine(DATABASE_URL_PRIMARY)
        self.replicas = [
            create_engine(REPLICA_URL_1),
            create_engine(REPLICA_URL_2),
        ]

    def read_query(self, query):
        # Load balancing đơn giản
        replica = random.choice(self.replicas)
        return replica.execute(query)

    def write_query(self, query):
        return self.primary.execute(query)
```

---

## 3. Sharding (Phân mảnh dữ liệu)

### 3.1. Sharding là gì?

Sharding là kỹ thuật chia nhỏ dữ liệu thành nhiều partitions (shards), mỗi shard được lưu trữ trên một database node riêng biệt. Mỗi shard chứa một tập con của toàn bộ dữ liệu.

### 3.2. Phân loại Sharding

#### Hash-Based Sharding

Dữ liệu được phân phối dựa trên hash value của shard key:

```
shard = hash(shard_key) % num_shards
```

```python
# Hash-Based Sharding
def get_shard(user_id: int, num_shards: int = 4) -> int:
    return user_id % num_shards

# Mapping shard -> database connection
SHARD_MAP = {
    0: "postgres://db-shard-0:5432/mydb",
    1: "postgres://db-shard-1:5432/mydb",
    2: "postgres://db-shard-2:5432/mydb",
    3: "postgres://db-shard-3:5432/mydb",
}

def get_user(user_id: int):
    shard_id = get_shard(user_id, num_shards=4)
    conn = get_connection(SHARD_MAP[shard_id])
    return conn.query(f"SELECT * FROM users WHERE id = {user_id}")
```

**Ưu điểm:**
- Phân phối đều dữ liệu (uniform distribution).
- Đơn giản để implement.

**Nhược điểm:**
- Khó scale out khi cần thêm nodes (cần resharding).
- Range queries khó implement hiệu quả.

> **Lưu ý:** Khi resharding (thêm/bớt shards), hash function thay đổi dẫn đến cần migrate lại dữ liệu. Giải pháp: Consistent Hashing (Cassandra, DynamoDB).

#### Range-Based Sharding

Dữ liệu được chia theo khoảng giá trị của shard key:

```sql
-- Range-Based Sharding
CREATE TABLE orders (
    id BIGINT,
    user_id BIGINT,
    amount DECIMAL,
    created_at DATE
) PARTITION BY RANGE (created_at);

CREATE TABLE orders_2024_Q1 PARTITION OF orders
    FOR VALUES FROM ('2024-01-01') TO ('2024-04-01');

CREATE TABLE orders_2024_Q2 PARTITION OF orders
    FOR VALUES FROM ('2024-04-01') TO ('2024-07-01');
```

**Ưu điểm:**
- Range queries hiệu quả.
- Dễ hiểu, dễ quản lý.

**Nhược điểm:**
- Có thể gây hot spot (dữ liệu tập trung vào một partition).
- Cần cân bằng lại khi partition quá lớn.

### 3.3. Sharding Strategies

| Chiến lược | Mô tả | Use case |
|---|---|---|
| **Tenant-based** | Mỗi tenant một shard | SaaS multi-tenant |
| **Hash-based** | Hash key mod num_shards | User data, transaction data |
| **Range-based** | Khoảng giá trị key | Time-series data, orders |
| **Directory-based** | Lookup table để find shard | Phức tạp nhưng linh hoạt |

### 3.4. Sharding Considerations

| Vấn đề | Giải pháp |
|---|---|
| **Cross-shard queries** | Application-level join, denormalization |
| **Transaction spanning shards** | Sử dụng distributed transaction (2PC) hoặc eventual consistency |
| **Data rebalancing** | Online resharding với consistent hashing |
| **Shard key selection** | Chọn key có cardinality cao, tránh hot spot |

---

## 4. Partitioning (Phân vùng bảng)

### 4.1. Partitioning vs Sharding

- **Partitioning**: Chia bảng thành các partitions vật lý, nhưng vẫn trong cùng một database instance.
- **Sharding**: Chia dữ liệu ra nhiều database instances (nodes) khác nhau.

```
Database Instance
    │
    ├── Partition 1 (users_1)
    ├── Partition 2 (users_2)
    └── Partition 3 (users_3)
```

### 4.2. PostgreSQL Partitioning

```sql
-- Tạo partitioned table
CREATE TABLE sales (
    id BIGSERIAL,
    sale_date DATE NOT NULL,
    product_id BIGINT,
    amount DECIMAL(10, 2),
    region VARCHAR(50)
) PARTITION BY RANGE (sale_date);

-- Tạo partitions cụ thể
CREATE TABLE sales_2024_01 PARTITION OF sales
    FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');

CREATE TABLE sales_2024_02 PARTITION OF sales
    FOR VALUES FROM ('2024-02-01') TO ('2024-03-01');

-- Default partition cho các giá trị không khớp
CREATE TABLE sales_default PARTITION OF sales DEFAULT;

-- Index trên partitioned table
CREATE INDEX idx_sales_date ON sales (sale_date);
CREATE INDEX idx_sales_product ON sales (product_id);
```

### 4.3. MySQL Partitioning

```sql
-- Range Partitioning
CREATE TABLE orders (
    id BIGINT AUTO_INCREMENT,
    order_date DATE,
    customer_id BIGINT,
    total DECIMAL(10, 2),
    PRIMARY KEY (id, order_date)
) PARTITION BY RANGE (YEAR(order_date)) (
    PARTITION p2022 VALUES LESS THAN (2023),
    PARTITION p2023 VALUES LESS THAN (2024),
    PARTITION p2024 VALUES LESS THAN (2025),
    PARTITION p_future VALUES LESS THAN MAXVALUE
);

-- Hash Partitioning
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(255)
) PARTITION BY HASH(id) PARTITIONS 8;

-- List Partitioning
CREATE TABLE employees (
    id INT,
    country VARCHAR(50),
    salary DECIMAL
) PARTITION BY LIST COLUMNS (country) (
    PARTITION p_asia VALUES IN ('Vietnam', 'Thailand', 'Indonesia'),
    PARTITION p_europe VALUES IN ('Germany', 'France', 'UK'),
    PARTITION p_americas VALUES IN ('USA', 'Canada')
);
```

---

## 5. Data Replication

### 5.1. Các mô hình Replication

#### Single-Primary Replication

```
Primary (Write) ────► Replica 1 (Read)
       │
       └──► Replica 2 (Read)
```

Một Primary node xử lý tất cả writes, nhiều replicas xử lý reads.

#### Multi-Primary (Multi-Master)

```
        ┌──────► Node 1 (Write/Read) ──────►
        │                                  ▲
        │                                  │
Node 3 ◄┘                                  │
(Write/Read)                                │
       ▲                                    │
       │                                    │
       └────────────────────────────────────┘
```

Nhiều nodes có thể xử lý writes. Phức tạp hơn về conflict resolution.

### 5.2. Synchronous vs Asynchronous Replication

| Loại | Mô tả | Ưu điểm | Nhược điểm |
|---|---|---|---|
| **Synchronous** | Write chỉ complete khi replica xác nhận | Strong consistency | Tăng latency, replica down -> không write được |
| **Asynchronous** | Write complete ngay trên Primary | Low latency | Có thể mất data nếu Primary fail trước khi replicate |
| **Semi-synchronous** | Chờ ít nhất 1 replica xác nhận | Cân bằng | Latency trung gian |

```sql
-- MySQL: Cấu hình replication mode
-- Synchronous (几乎 như sync)
SET GLOBAL sync_binlog = 1;
SET GLOBAL innodb_flush_log_at_trx_commit = 1;

-- Asynchronous (mặc định)
SET GLOBAL sync_binlog = 0;
SET GLOBAL innodb_flush_log_at_trx_commit = 2;
```

```bash
# PostgreSQL: Synchronous Replication
# postgresql.conf on Primary
synchronous_commit = on  # synchronous
# synchronous_commit = remote_apply  # Đợi apply hoàn tất

# pg_hba.conf - thêm replication connection

# Trên Primary - khai báo synchronous_standby_names
ALTER SYSTEM SET synchronous_standby_names = 'replica1_name';
SELECT pg_reload_conf();
```

### 5.3. Replication Lag

Replication lag là khoảng thời gian từ khi write trên Primary đến khi replicate trên Replica.

```sql
-- MySQL: Kiểm tra replication lag
SHOW SLAVE STATUS\G
-- Look for: Seconds_Behind_Master

-- PostgreSQL: Kiểm tra lag
SELECT client_addr, state,
       pg_wal_lsn_diff(pg_current_wal_lsn(), replay_lsn) AS lag_bytes
FROM pg_stat_replication;
```

**Nguyên nhân Replication Lag:**
- Network chậm giữa Primary và Replica.
- Replica đang apply changes chậm (heavy writes trên Primary).
- Replica resource constraints (CPU, I/O).

**Giải pháp:**
- Thêm nhiều replicas để san sẻ tải.
- Dùng semi-synchronous replication.
- Optimize network infrastructure.
- Tăng cấu hình Replica (CPU, RAM, SSD).

### 5.4. Conflict Resolution (Multi-Master)

Trong multi-master replication, conflicts có thể xảy ra khi cùng một row được update trên nhiều nodes:

```sql
-- Ví dụ conflict: User A update trên Node 1, User B update trên Node 2
-- cùng lúc, cùng row

-- Chiến lược resolution:
-- 1. Last-Write-Wins (LWW): Timestamp-based
-- 2. Version vectors: Conflict detection
-- 3. Application-level resolution: Custom logic
-- 4. Conflict-free replicated data types (CRDTs)
```

---

## 6. Consistency Trade-offs (CAP Theorem)

### 6.1. CAP Theorem

Trong distributed systems, chỉ có thể đảm bảo 2 trong 3 properties:

- **Consistency (C)**: Tất cả nodes nhìn thấy cùng dữ liệu tại cùng thời điểm.
- **Availability (A)**: Mọi request đều nhận được response.
- **Partition Tolerance (P)**: Hệ thống tiếp tục hoạt động khi mạng bị phân mảnh.

> **Thực tế:** Partition là không thể tránh khỏi trong distributed systems. Vì vậy, chỉ có thể chọn **CP** hoặc **AP**.

### 6.2. Eventual Consistency

Trong hầu hết distributed databases (Cassandra, DynamoDB, Riak), **Eventual Consistency** được chấp nhận:

- Sau một khoảng thời gian, tất cả replicas sẽ converge về cùng giá trị.
- Có thể đọc stale data trong thời gian chưa converge.

```python
# Cassandra: Read consistency levels
# Quorum = (replication_factor / 2) + 1
# ConsistencyLevel.ONE  - Chỉ 1 node replicate -> fastest
# ConsistencyLevel.QUORUM - Quorum nodes -> balanced
# ConsistencyLevel.ALL - Tất cả nodes -> strongest consistency
```

### 6.3. PACELC Model

PACELC mở rộng CAP để cover cả trường hợp không có partition:

- **If P**: choose between **C** or **E** (latency)
- **Else** (no partition): choose between **C** or **L** (latency)

| Database | PACELC | Mô tả |
|---|---|---|
| Cassandra | PA/EL | Cho phép availability + eventual consistency để giảm latency |
| HBase | PC/EC | Ưu tiên consistency |
| MongoDB | PA/EC | Tùy cấu hình |
| DynamoDB | PA/EL | Tối ưu latency và availability |
| PostgreSQL | PC/EC | Strong consistency, configurable |

---

## 7. Database Clustering

### 7.1. PostgreSQL HA Cluster (Patroni + HAProxy)

```yaml
# docker-compose.yml cho PostgreSQL HA Cluster
version: '3.8'
services:
  postgres1:
    image: postgres:15
    environment:
      POSTGRES_PASSWORD: secret
      PATRONI_NAME: postgres1
      PATRONI_SCOPE: postgres-cluster
      PATRONI DCS_ENDPOINT: etcd:2379
    volumes:
      - pg1_data:/var/lib/postgresql/data

  postgres2:
    image: postgres:15
    environment:
      POSTGRES_PASSWORD: secret
      PATRONI_NAME: postgres2
      PATRONI_SCOPE: postgres-cluster
      PATRONI DCS_ENDPOINT: etcd:2379
    volumes:
      - pg2_data:/var/lib/postgresql/data

  haproxy:
    image: haproxy:2.8
    ports:
      - "5432:5000"
    volumes:
      - ./haproxy.cfg:/usr/local/etc/haproxy/haproxy.cfg
```

```bash
# haproxy.cfg - Load balancing PostgreSQL
listen postgres
    bind *:5000
    mode tcp
    balance roundrobin
    option tcp-check
    tcp-check expect string is accepting connections
    server pg1 postgres1:5432 check inter 3s fall 2 rise 2
    server pg2 postgres2:5432 check inter 3s fall 2 rise 2
```

### 7.2. MySQL Group Replication

```sql
-- Cấu hình MySQL Group Replication
-- my.cnf trên mỗi node
[mysqld]
server_id = 1
gtid_mode = ON
enforce_gtid_consistency = ON
binlog_checksum = NONE
log_slave_updates = ON
group_replication_group_name = "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee"
group_replication_start_on_boot = OFF
group_replication_local_address = "node1:33061"
group_replication_group_seeds = "node1:33061,node2:33061,node3:33061"
group_replication_bootstrap_group = OFF
```

---

## 8. Data Migration và Resharding

### 8.1. Migration Plan Checklist

| Bước | Mô tả | Công cụ |
|---|---|---|
| **1. Assessment** | Phân tích data size, growth rate, current schema | pg_dump, mysqldump |
| **2. Strategy** | Chọn migration approach (live vs downtime) | pt-online-schema-change, gh-ost |
| **3. Schema** | Tạo schema mới trên target | pg_dump, mysqldump |
| **4. Data Sync** | Đồng bộ dữ liệu ban đầu | Custom script, ETL tools |
| **5. Incremental Sync** | Đồng bộ incremental trong migration window | CDC, Debezium, Change Data Capture |
| **6. Cutover** | Chuyển traffic sang database mới | Feature flag, DNS switch |
| **7. Validation** | Kiểm tra data integrity sau migration | Checksum, row count |

### 8.2. Zero-Downtime Migration với Expand-Contract Pattern

```
Phase 1: EXPAND  - Thêm bảng/column mới (backward compatible)
         ↓
Phase 2: FILL    - Migrate dữ liệu từ cũ sang mới
         ↓
Phase 3: CODE    - Deploy code sử dụng cả cũ và mới
         ↓
Phase 4: CONTRACT - Xoá bảng/column cũ
```

```sql
-- Phase 1: Thêm column mới (nullable, có default)
ALTER TABLE users ADD COLUMN email VARCHAR(255);

-- Phase 2: Migrate data
UPDATE users SET email = old_email_column WHERE email IS NULL;

-- Phase 3: Dual-write - Code ghi vào cả 2 columns

-- Phase 4: Xoá column cũ (sau khi verify)
ALTER TABLE users DROP COLUMN old_email_column;
```

### 8.3. Online Schema Change Tools

```bash
# pt-online-schema-change (Percona Toolkit) - MySQL
pt-online-schema-change \
  --alter "ADD COLUMN new_col VARCHAR(255)" \
  --user=root \
  --password=xxx \
  D=tiktok_db,t=users \
  --execute

# pg_repack - PostgreSQL
pg_repack -t users --add-column email
```

---

## 9. Best Practices

### 9.1. Scaling Best Practices

| Best Practice | Mô tả |
|---|---|
| **Start with optimization** | Trước khi scale, hãy tối ưu queries và indexes |
| **Read replicas cho read-heavy** | Nếu 80%+ là reads, read replicas là giải pháp nhanh nhất |
| **Vertical scale trước** | Dùng vertical scaling làm interim solution |
| **Choose right shard key** | Shard key nên có cardinality cao, tránh hot spots |
| **Denormalize for cross-shard** | Tránh joins cross-shards, denormalize khi cần |
| **Monitor everything** | replication lag, query latency, connection counts |
| **Test failure scenarios** | Simulate replica failure, primary failover |

### 9.2. Capacity Planning

```python
# Ước tính số shards cần thiết
def estimate_shard_count(
    total_users: int,
    target_rows_per_shard: int = 5_000_000,
    growth_factor: float = 1.5,  # 50% growth buffer
) -> int:
    base_shards = total_users / target_rows_per_shard
    return int(base_shards * growth_factor) + 1

# Ví dụ: 10 triệu users
# shards = 10000000 / 5000000 * 1.5 + 1 = 4 shards
estimated = estimate_shard_count(10_000_000)
print(f"Số shards cần thiết: {estimated}")
```
