# Database -> DB Types (SQL vs NoSQL)

## 1. Relational Database (SQL)

### 1.1. Khái niệm

- Tổ chức dữ liệu thành **bảng (table)**, **hàng (row)**, **cột (column)**.
- **Schema cố định** — cấu trúc bảng được định nghĩa trước khi insert dữ liệu.
- Đảm bảo tính chất **ACID** (Atomicity, Consistency, Isolation, Durability).
- Dùng **SQL (Structured Query Language)** để thao tác dữ liệu.

### 1.2. Đại diện

| Database | Đặc điểm nổi bật |
|----------|-----------------|
| **PostgreSQL** | Open-source mạnh nhất, hỗ trợ JSON, full-text search, GIS |
| **MySQL** | Phổ biến nhất, tốc độ cao, dùng nhiều trong web stack (LAMP) |
| **Oracle** | Doanh nghiệp lớn, tính năng enterprise, chi phí license cao |
| **SQL Server** | Tích hợp sâu với hệ sinh thái Microsoft |

### 1.3. Use cases phù hợp

- Dữ liệu quan hệ phức tạp, cần nhiều **JOIN** giữa các bảng.
- Hệ thống yêu cầu **transaction** chặt chẽ: ngân hàng, tài chính, đơn hàng.
- Dữ liệu có cấu trúc ổn định, ít thay đổi schema.

### 1.4. Câu hỏi phỏng vấn thường gặp

> **Khi nào chọn SQL thay vì NoSQL?**
>
> Chọn SQL khi dữ liệu có **quan hệ rõ ràng** giữa các thực thể (ví dụ: đơn hàng - khách hàng - sản phẩm), khi cần **transaction ACID** nghiêm ngặt, và khi **schema tương đối ổn định**. Nếu dữ liệu semi-structured hoặc cần scale ngang với lượng data cực lớn, NoSQL phù hợp hơn.

---

## 2. NoSQL (Non-relational Database)

### 2.1. Khái niệm

- Dữ liệu **linh hoạt**, không yêu cầu schema cố định.
- Dễ **mở rộng ngang (horizontal scaling)**.
- Một số loại bỏ bớt tính ACID để đổi lấy hiệu năng và tính mở rộng (**eventual consistency**).

### 2.2. Các loại NoSQL

| Loại | Mô tả | Ví dụ | Use case |
|------|--------|--------|----------|
| **Document Store** | Lưu trữ document (JSON/BSON) | MongoDB, CouchDB | CMS, catalog, user profile |
| **Key-Value Store** | Cặp key-value đơn giản | Redis, DynamoDB | Cache, session, leaderboard |
| **Column-Family Store** | Cột động, tối ưu ghi/đọc theo cột | Cassandra, HBase | Time-series, IoT, log |
| **Graph Database** | Dữ liệu dạng đồ thị, node và edge | Neo4j, Amazon Neptune | Mạng xã hội, recommendation |

### 2.3. Use cases phù hợp

- Dữ liệu **phi cấu trúc** hoặc semi-structured (JSON, log, sensor data).
- Ứng dụng **real-time**: chat, notification, streaming.
- Dữ liệu **social** (post, comment, like — không cần JOIN phức tạp).
- Hệ thống **IoT** với lượng data cực lớn cần ingestion nhanh.

### 2.4. MongoDB chi tiết

```javascript
// Document trong MongoDB (BSON)
{
  "_id": ObjectId("..."),
  "username": "huy",
  "email": "huy@example.com",
  "profile": {
    "age": 28,
    "city": "Hanoi",
    "skills": ["Java", "PostgreSQL", "Redis"]
  },
  "orders": [
    { "orderId": 1001, "total": 250000, "status": "delivered" },
    { "orderId": 1002, "total": 180000, "status": "pending" }
  ]
}
```

```javascript
// Truy vấn với MongoDB
db.users.find({ "profile.city": "Hanoi", "orders.status": "pending" })
```

### 2.5. Redis chi tiết

```bash
# Key-Value đơn giản
SET user:1001:session "token-abc123"
GET user:1001:session

# Hash — lưu trữ object
HSET user:1001 name "Huy" email "huy@example.com" age "28"
HGETALL user:1001

# Sorted Set — leaderboard
ZADD leaderboard 1500 "player_A"
ZADD leaderboard 1200 "player_B"
ZREVRANGE leaderboard 0 9 WITHSCORES
```

### 2.6. Câu hỏi phỏng vấn thường gặp

> **SQL vs NoSQL — So sánh tổng quan**

| Tiêu chí | SQL | NoSQL |
|----------|-----|-------|
| **Schema** | Cố định (static) | Linh hoạt (dynamic) |
| **Relationship** | Quan hệ qua JOIN | Nhúng (embed) hoặc tham chiếu |
| **Transaction** | ACID đầy đủ | Thường BASE (eventual consistency) |
| **Scale** | Dọc (vertical) | Ngang (horizontal) |
| **Query** | SQL chuẩn hóa | API riêng từng DB |
| **JOIN** | Mạnh | Hạn chế hoặc không hỗ trợ |

> **Redis được dùng để làm gì trong thực tế?**
>
> Redis là **in-memory data store** được dùng làm: **cache** (giảm tải DB), **session store** (quản lý session người dùng), **message broker** (pub/sub), **rate limiter** (giới hạn tần suất request), **distributed lock**, và **leaderboard/real-time ranking**.

> **Khi nào chọn Cassandra thay vì PostgreSQL?**
>
> Chọn Cassandra khi cần **write-heavy workload** (ví dụ: log ingestion, IoT sensor data), cần **multi-datacenter replication**, và có thể chấp nhận **eventual consistency** thay vì read-after-write. PostgreSQL mạnh hơn về read với JOIN phức tạp và transaction đầy đủ.

---

## 3. So sánh chi tiết các Database phổ biến

### 3.1. PostgreSQL vs MySQL

| Tiêu chí | PostgreSQL | MySQL |
|----------|------------|-------|
| **Kiểu** | ACID đầy đủ, ORDBMS | ACID (với InnoDB), RDBMS |
| **Index** | B-tree, Hash, GiST, GIN, BRIN | B-tree, Hash, R-tree, FULLTEXT |
| **JSON** | Native JSONB (binary, indexed) | JSON dạng text (MySQL 5.7+) |
| **Concurrency** | MVCC mạnh, đọc không block ghi | InnoDB: MVCC, row-level locking |
| **Extension** | Hỗ trợ extension (PostGIS, pgvector) | Ít mở rộng hơn |
| **Use case** | Data warehouse, geospatial, phức tạp | Web app, OLTP, CMS |

### 3.2. So sánh MongoDB vs PostgreSQL cho project thực tế

| Tiêu chí | MongoDB | PostgreSQL |
|----------|---------|------------|
| **Schema** | Flexible document | Rigid table |
| **JOIN** | $lookup (aggregation) hoặc embed | INNER/LEFT/RIGHT JOIN |
| **Transaction** | Multi-document (v4.0+) | Multi-statement, savepoint |
| **Scaling** | Sharding tự động | Sharding thủ công (Citus) |
| **Performance** | Nhanh với write-heavy | Nhanh với read-heavy, complex query |

> **Tip**: Nhiều dự án dùng **hybrid approach** — PostgreSQL cho dữ liệu quan hệ chính (users, orders), Redis cho cache, MongoDB cho log/analytics.

---

## 4. Khi nào dùng Multi-Model Database?

Một số database hỗ trợ nhiều model trong cùng một instance:

| Database | Models hỗ trợ |
|----------|--------------|
| **Azure Cosmos DB** | Document, Key-Value, Column, Graph |
| **ArangoDB** | Document, Graph, Key-Value |
| **Couchbase** | Document, Key-Value |

---

## 5. Tóm tắt

- **SQL (RDBMS)**: Chọn khi dữ liệu có quan hệ rõ ràng, cần ACID, schema ổn định.
- **NoSQL**: Chọn khi cần linh hoạt, scale ngang, eventual consistency chấp nhận được.
- **Hybrid**: Thực tế nhiều hệ thống dùng cả SQL + NoSQL + Cache phù hợp với từng use case cụ thể.
