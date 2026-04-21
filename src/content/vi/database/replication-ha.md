# Database -> Replication & High Availability

## Replication là gì?

Replication là cơ chế sao chép dữ liệu từ một node chính sang một hoặc nhiều node phụ để tăng khả năng đọc, cải thiện tính sẵn sàng và hỗ trợ disaster recovery.

Mục tiêu phổ biến:

- scale read traffic
- giảm downtime khi primary lỗi
- có bản sao dữ liệu ở vùng hoặc máy khác

---

## Mô hình replication phổ biến

### Primary - Replica

Một node **primary** nhận ghi, các node **replica** sao chép dữ liệu từ primary và thường phục vụ đọc.

```text
Application
  |- write -> Primary
  |- read  -> Replica 1
  |- read  -> Replica 2
```

Ưu điểm:

- dễ hiểu
- read scaling tốt
- failover đơn giản hơn multi-primary

Nhược điểm:

- primary vẫn là điểm tập trung cho write
- có replication lag

### Multi-Primary

Nhiều node cùng nhận write. Mô hình này phức tạp hơn vì phải xử lý conflict, ordering và consistency.

Chỉ nên dùng khi có nhu cầu thật rõ ràng như:

- active-active đa region
- workload yêu cầu nhiều điểm ghi độc lập

---

## Asynchronous, Semi-Synchronous, Synchronous

### Asynchronous replication

Primary xác nhận transaction cho client trước, rồi replica mới nhận hoặc áp dụng thay đổi sau.

- **Ưu điểm**: write latency thấp
- **Nhược điểm**: có thể mất dữ liệu mới nhất nếu primary chết trước khi replica nhận kịp

### Semi-synchronous replication

Primary đợi ít nhất một replica xác nhận đã nhận event rồi mới trả kết quả cho client.

- **Ưu điểm**: giảm nguy cơ mất dữ liệu so với async thuần
- **Nhược điểm**: latency cao hơn async

### Synchronous replication

Primary đợi replica xác nhận đầy đủ trước khi commit trả về client.

- **Ưu điểm**: nhất quán mạnh hơn, giảm nguy cơ mất dữ liệu
- **Nhược điểm**: write chậm hơn đáng kể, phụ thuộc network và replica chậm nhất

---

## Replication lag

Replication lag là độ trễ giữa thời điểm dữ liệu được ghi ở primary và thời điểm replica nhìn thấy thay đổi đó.

Ví dụ:

1. User tạo comment.
2. API ghi thành công vào primary.
3. Request kế tiếp đọc từ replica ngay lập tức.
4. Comment có thể chưa xuất hiện nếu replica chưa apply xong.

Nguyên nhân thường gặp:

- network chậm
- replica bị quá tải I/O hoặc CPU
- transaction lớn
- index maintenance hoặc vacuum/checkpoint nặng

Hệ quả:

- mất read-after-write consistency
- dashboard/reporting hiển thị dữ liệu cũ
- failover có thể mất một phần dữ liệu mới nhất

---

## Theo dõi replication

### PostgreSQL

```sql
SELECT
  application_name,
  client_addr,
  state,
  sync_state,
  write_lag,
  flush_lag,
  replay_lag
FROM pg_stat_replication;
```

### MySQL 8+

MySQL 8 dùng terminology mới là **source/replica** thay cho `master/slave`.

```sql
SHOW REPLICA STATUS\G
```

Các trường cần theo dõi:

- `Seconds_Behind_Source`
- `Replica_IO_Running`
- `Replica_SQL_Running`
- trạng thái error của replication threads

> Lưu ý: `START SLAVE`, `SHOW SLAVE STATUS`, `CHANGE MASTER TO` là cú pháp cũ. Với MySQL 8 hiện đại nên ưu tiên `START REPLICA`, `SHOW REPLICA STATUS`, `CHANGE REPLICATION SOURCE TO`.

---

## Cấu hình cơ bản

### MySQL 8 replica setup

```sql
CHANGE REPLICATION SOURCE TO
  SOURCE_HOST = 'primary-host',
  SOURCE_USER = 'repl',
  SOURCE_PASSWORD = 'password',
  SOURCE_LOG_FILE = 'binlog.000001',
  SOURCE_LOG_POS = 157;

START REPLICA;
SHOW REPLICA STATUS\G
```

### PostgreSQL synchronous replication

```conf
synchronous_commit = on
synchronous_standby_names = 'FIRST 1 (replica1, replica2)'
```

---

## Failover

Failover là quá trình promote replica thành primary khi primary cũ bị lỗi.

Các bước thường có:

1. phát hiện primary lỗi
2. xác minh không phải chỉ là network glitch
3. chọn replica tốt nhất để promote
4. chuyển traffic ứng dụng sang primary mới
5. cấu hình lại các replica còn lại

### Manual failover

Ưu điểm:

- kiểm soát tốt hơn
- giảm nguy cơ failover nhầm

Nhược điểm:

- chậm
- phụ thuộc con người

### Automatic failover

Ưu điểm:

- giảm downtime
- phản ứng nhanh hơn

Nhược điểm:

- dễ gây split-brain nếu health check hoặc quorum thiết kế kém

---

## Split-brain

Split-brain xảy ra khi hai node cùng tin rằng mình là primary và đều nhận write. Đây là một trong những lỗi nguy hiểm nhất của hệ HA.

Cách giảm rủi ro:

- quorum-based election
- fencing token
- witness node / odd number of nodes
- network redundancy

---

## Read scaling

Read replicas phù hợp cho:

- reporting
- analytics
- truy vấn đọc nhiều
- API đọc có thể chấp nhận dữ liệu hơi cũ

Không nên dùng replica cho:

- luồng cần read-after-write consistency mạnh
- nghiệp vụ tài chính nhạy với dữ liệu stale

Giải pháp hay dùng:

- route read quan trọng về primary
- route reporting sang replica
- thêm cache cho query đọc nặng

---

## Công cụ HA thường gặp

### PostgreSQL

- **Patroni**: orchestration/failover phổ biến
- **PgBouncer**: connection pooling
- **Keepalived**: VIP failover

### MySQL

- **Orchestrator**: topology management và failover
- **MHA** hoặc giải pháp managed cloud

### Cloud managed

- Amazon RDS / Aurora
- Cloud SQL
- Azure Database

Ưu điểm của managed service là giảm vận hành nhưng đánh đổi quyền kiểm soát thấp hơn.

---

## Best Practices

### 1. Tách rõ write path và read path

Ứng dụng cần biết request nào bắt buộc đi primary, request nào có thể đi replica.

### 2. Luôn monitor lag

Không monitor replication lag thì read replica rất dễ trở thành nguồn bug khó đoán.

### 3. Test failover định kỳ

Nếu chưa diễn tập failover, gần như chắc chắn runbook của bạn còn thiếu.

### 4. Chấp nhận trade-off rõ ràng

HA không miễn phí:

- thêm độ phức tạp
- tăng chi phí
- tăng latency nếu dùng sync

### 5. Tránh multi-primary nếu chưa thật cần

Primary-replica thường là điểm bắt đầu an toàn hơn và đơn giản hơn nhiều.

---

## Câu hỏi phỏng vấn thường gặp

> **Replication lag là gì và xử lý thế nào?**
>
> Đó là độ trễ giữa primary và replica. Cách xử lý là monitor lag, route các read cần dữ liệu mới nhất về primary, tối ưu replica, và tránh transaction quá lớn.

> **Asynchronous và synchronous replication khác gì nhau?**
>
> Async cho write nhanh hơn nhưng có nguy cơ mất dữ liệu mới nhất khi primary chết. Sync an toàn hơn nhưng write latency cao hơn vì phải đợi replica xác nhận.

> **Làm sao thiết kế HA cho PostgreSQL?**
>
> Có primary, một hoặc nhiều standby, dùng Patroni hoặc giải pháp tương đương để election/failover, dùng PgBouncer cho pooling, monitor lag và rehearsed failover định kỳ.
