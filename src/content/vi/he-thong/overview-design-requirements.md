# Yêu cầu thiết kế hệ thống

### Xác định yêu cầu

#### Functional Requirements (Yêu cầu chức năng)

Những gì hệ thống **phải làm**:

- User authentication và authorization
- CRUD operations trên resources
- Search và filtering capabilities
- Notifications và messaging
- Payment processing
- Reporting và analytics

#### Non-Functional Requirements (Yêu cầu phi chức năng)

Hệ thống **hoạt động như thế nào**:

| Requirement | Mô tả | Ví dụ |
|---|---|---|
| **Scalability** | Khả năng xử lý tải tăng | Hỗ trợ 10K → 1M users |
| **Performance** | Phản hồi nhanh, latency thấp | p99 latency < 200ms |
| **Availability** | Uptime, downtime tối thiểu | 99.9% = ~8.7h downtime/năm |
| **Security** | Bảo vệ data, authN/authZ | HTTPS, encryption at rest, RBAC |
| **Maintainability** | Dễ fix, upgrade, extend | Clean code, good documentation |
| **Reliability** | Hoạt động đúng đắn, nhất quán | Graceful degradation |
| **Cost** | Chi phí deployment và vận hành | Nằm trong ngân sách |
| **Observability** | Visibility vào system state | Logs, metrics, traces |

---

### CAP Theorem

**CAP theorem** phát biểu rằng một distributed system chỉ có thể đảm bảo **hai trong ba** thuộc tính cùng lúc.

| Thuộc tính | Mô tả |
|---|---|
| **Consistency (C)** | Tất cả nodes trả về cùng data tại bất kỳ thời điểm nào. Mọi read nhận được write gần nhất. |
| **Availability (A)** | Mọi request nhận được response, dù có phải data mới nhất. |
| **Partition Tolerance (P)** | Hệ thống tiếp tục hoạt động dù có network partitions. |

> **Khái niệm quan trọng:** Network partitions là không thể tránh khỏi trong distributed systems. Do đó, phải chọn giữa **CP** (Consistency + Partition Tolerance) hoặc **AP** (Availability + Partition Tolerance).

#### CP vs. AP trong thực tế

| Loại hệ thống | Ưu tiên | Lý do |
|---|---|---|
| **Banks / Financial** | CP | Consistency là thiết yếu — sai số dẫn đến tổn thất tài chính |
| **Social media feeds** | AP | Availability quan trọng — users muốn xem content dù hơi cũ |
| **E-commerce inventory** | CP (thường) | Ngăn overselling |
| **CDN / DNS** | AP | Luôn serve cached content |

---

### PACELC Model

Mở rộng của CAP — ngay cả khi **không có partition**, phải chọn giữa **Latency (L)** và **Consistency (C)**:

> **P**artition + **A**vailability + **C**onsistency
> **E**lse → **L**atency + **C**onsistency

| System | PACELC |
|---|---|
| DynamoDB (writes) | PA/EC |
| Cassandra | PA/EC |
| Bigtable / HBase | PC/EC |
| MongoDB | PA/EC (configurable) |

---

### Consistency Models

| Model | Mô tả | Ví dụ Systems |
|---|---|---|
| **Strong Consistency** | Mọi reads thấy write gần nhất | Traditional RDBMS, Zookeeper |
| **Eventual Consistency** | Writes lan truyền bất đồng bộ; reads có thể thấy stale data tạm thời | DynamoDB, Cassandra |
| **Causal Consistency** | Tôn trọng causality — nếu A gây ra B, B thấy effects của A | Some NoSQL databases |
| **Read-your-Writes** | Một client luôn thấy writes của chính mình | Session guarantees |

---

### Các Trade-offs phổ biến

| Trade-off | Cân nhắc |
|---|---|
| **Consistency vs. Latency** | Strong consistency cần coordination (chậm). Async replication nhanh hơn nhưng eventual. |
| **Read vs. Write performance** | Tối ưu cho reads (nhiều caching) có thể ảnh hưởng write performance và ngược lại |
| **Normalization vs. Denormalization** | Normalized data (không redundancy) dễ update. Denormalized nhanh hơn để đọc. |
| **Monolith vs. Microservices** | Simplicity vs. scalability |
| **Sync vs. Async** | Đơn giản với sync. Bền vững hơn với async (nhưng phức tạp hơn) |

---

### SLA (Service Level Agreement)

| Availability | Downtime/năm | Downtime/tháng | Downtime/tuần |
|---|---|---|---|
| 99% | 3.65 ngày | 7.31 giờ | 1.68 giờ |
| 99.9% | 8.76 giờ | 43.83 phút | 10.08 phút |
| 99.99% | 52.60 phút | 4.38 phút | 1.01 phút |
| 99.999% | 5.26 phút | 26.30 giây | 6.05 giây |

> **Tip:** Khi thiết kế một hệ thống, luôn làm rõ yêu cầu với interviewer. Hỏi: "Expected QPS là bao nhiêu? Bao nhiêu users? Latency nào được chấp nhận? Non-functional requirement quan trọng nhất là gì?"
