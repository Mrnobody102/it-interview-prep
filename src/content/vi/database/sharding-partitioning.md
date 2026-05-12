# Database -> Sharding & Partitioning

## Partitioning và sharding khác nhau thế nào?

Hai khái niệm này thường bị dùng lẫn, nhưng phạm vi khác nhau:

- **Partitioning**: chia một bảng trong cùng một database instance thành nhiều phần.
- **Sharding**: chia dữ liệu ra nhiều database instance hoặc nhiều server độc lập.

Nói ngắn gọn:

- partitioning là kỹ thuật ở mức database engine
- sharding là quyết định ở mức kiến trúc hệ thống

Nếu cần nhớ nhanh: partitioning giúp một DB lớn đỡ nặng hơn, còn sharding giúp nhiều DB cùng gánh dữ liệu.

---

## Partitioning

Partitioning giúp chia một bảng lớn thành nhiều partition nhỏ hơn để:

- tăng hiệu quả query
- dễ archive dữ liệu cũ
- giảm chi phí maintenance

### Range partitioning

Dữ liệu được chia theo khoảng giá trị, thường là thời gian hoặc numeric id.

```sql
CREATE TABLE orders (
    id BIGSERIAL,
    user_id BIGINT,
    total DECIMAL(10,2),
    created_at DATE
) PARTITION BY RANGE (created_at);

CREATE TABLE orders_2024_q1 PARTITION OF orders
    FOR VALUES FROM ('2024-01-01') TO ('2024-04-01');

CREATE TABLE orders_2024_q2 PARTITION OF orders
    FOR VALUES FROM ('2024-04-01') TO ('2024-07-01');
```

Phù hợp với:

- time-series data
- log
- order history

### List partitioning

Dữ liệu được chia theo tập giá trị rời rạc.

```sql
CREATE TABLE users (
    id BIGSERIAL,
    username VARCHAR(100),
    region VARCHAR(50)
) PARTITION BY LIST (region);

CREATE TABLE users_apac PARTITION OF users
    FOR VALUES IN ('VN', 'TH', 'SG', 'JP');

CREATE TABLE users_eu PARTITION OF users
    FOR VALUES IN ('DE', 'FR', 'UK');
```

Phù hợp khi partition key có domain nhỏ và rõ ràng.

### Hash partitioning

Database tự phân phối dữ liệu theo hàm hash trên partition key.

```sql
CREATE TABLE transactions (
    id BIGSERIAL,
    user_id BIGINT,
    amount DECIMAL(10,2)
) PARTITION BY HASH (user_id);
```

Phù hợp khi muốn phân phối tương đối đều mà không có range tự nhiên.

---

## Lợi ích của partitioning

### 1. Partition pruning

Optimizer có thể bỏ qua các partition không liên quan.

```sql
SELECT *
FROM orders
WHERE created_at BETWEEN '2024-03-01' AND '2024-03-31';
```

Nếu bảng partition theo `created_at`, database chỉ cần scan các partition phù hợp.

### 2. Dễ archive và purge

Thay vì `DELETE` hàng triệu dòng, có thể detach hoặc drop một partition cũ.

```sql
ALTER TABLE orders DETACH PARTITION orders_2023_q1;
DROP TABLE orders_2023_q1;
```

### 3. Maintenance rẻ hơn

Index rebuild, vacuum, analyze hoặc backup cục bộ trên từng partition thường dễ hơn làm trên bảng khổng lồ.

---

## Sharding

Sharding là khi dữ liệu nằm trên **nhiều database servers** khác nhau. Mỗi shard giữ một phần dữ liệu.

Ví dụ:

- shard 1 giữ user `1..1,000,000`
- shard 2 giữ user `1,000,001..2,000,000`

Hoặc:

- shard theo hash của `user_id`

### Application-level sharding

Ứng dụng hoặc tầng middleware tự quyết định query đi shard nào.

```java
public class ShardRouter {
    private final Map<Integer, DataSource> shards;

    public DataSource getShardForUserId(long userId) {
        int shardIndex = (int) (userId % shards.size());
        return shards.get(shardIndex);
    }
}
```

### Proxy-based sharding

Một tầng trung gian như Vitess hoặc Apache ShardingSphere nhận query và route tới đúng shard.

Ưu điểm:

- giảm logic sharding trong application

Nhược điểm:

- thêm một tầng vận hành

---

## Chọn shard key

Shard key là yếu tố quan trọng nhất trong thiết kế sharding.

Shard key tốt cần:

- có **cardinality cao** nghĩa là có nhiều giá trị khác nhau
- phân phối read/write tương đối đều
- xuất hiện trong phần lớn query filter

Ví dụ tốt:

- `user_id`
- `tenant_id`

Ví dụ xấu:

- `status`
- `country` nếu chỉ có vài giá trị lớn

Shard key xấu sẽ gây **hot shard**: một shard chịu phần lớn lưu lượng.

---

## Các chiến lược sharding phổ biến

### Hash-based sharding

```java
int shardIndex = Math.abs(Long.hashCode(userId)) % shardCount;
```

Ưu điểm:

- phân phối khá đều
- đơn giản

Nhược điểm:

- thêm hoặc bớt shard thường phải reshard

### Range-based sharding

Ví dụ:

- shard A: user `1..1,000,000`
- shard B: user `1,000,001..2,000,000`

Ưu điểm:

- dễ hiểu
- hỗ trợ query theo range tốt

Nhược điểm:

- dễ hotspot nếu range mới nhất luôn nóng

### Directory-based sharding

Có bảng ánh xạ key -> shard.

```sql
CREATE TABLE shard_map (
    shard_key VARCHAR(100) PRIMARY KEY,
    shard_id INT NOT NULL
);
```

Ưu điểm:

- linh hoạt, dễ rebalance hơn

Nhược điểm:

- thêm một bước lookup
- shard map có thể trở thành bottleneck

---

## Khó khăn lớn nhất của sharding

### 1. Cross-shard query

Nếu query không chứa shard key, hệ thống có thể phải query tất cả shards rồi merge kết quả.

```sql
SELECT *
FROM orders
WHERE created_at >= '2024-01-01';
```

Nếu shard theo `user_id`, query trên không biết nên chạy ở shard nào.

### 2. Cross-shard join

Join giữa hai bảng ở hai shard khác nhau rất tốn kém và thường phải giải quyết ở application layer hoặc qua denormalization.

### 3. Distributed transaction

Một transaction ghi lên nhiều shard khó đảm bảo atomicity và thường đòi hỏi 2PC hoặc Saga.

### 4. Rebalancing

Khi shard đầy hoặc phân phối lệch, việc chia lại dữ liệu là bài toán vận hành khó:

1. tạo shard mới
2. backfill dữ liệu
3. đổi routing
4. cắt traffic
5. dọn shard cũ

---

## Khi nào nên partition, khi nào nên shard?

### Chọn partitioning trước nếu

- vẫn dùng được một database server
- vấn đề chính là bảng quá lớn
- cần archive dữ liệu theo thời gian
- cần query pruning tốt hơn

### Chọn sharding khi

- một server không đủ write throughput
- dung lượng dữ liệu vượt quá khả năng scale dọc hợp lý
- cần phân tán dữ liệu giữa nhiều vùng hoặc nhiều tenant lớn

### Chưa nên shard nếu

- index/query còn chưa tối ưu
- cache chưa được dùng đúng
- workload chưa thật sự vượt giới hạn của single primary

Sharding gần như luôn là **last resort** vì chi phí vận hành và độ phức tạp tăng mạnh.

---

## Ví dụ công nghệ

### MongoDB

MongoDB hỗ trợ sharding built-in với shard key, chunk và balancer.

### Vitess

Vitess là lớp proxy/orchestration trước MySQL, hỗ trợ sharding, routing, resharding và connection management.

### CockroachDB

CockroachDB tự động chia dữ liệu thành ranges và replicate bằng Raft, giảm gánh nặng sharding thủ công ở application layer.

---

## Câu hỏi phỏng vấn thường gặp

> **Partitioning và sharding khác nhau thế nào?**
>
> Partitioning chia dữ liệu trong cùng một database instance. Sharding chia dữ liệu ra nhiều database instance độc lập. Partitioning là kỹ thuật engine-level, còn sharding là quyết định kiến trúc.

> **Shard key nên chọn thế nào?**
>
> Chọn key có cardinality cao, phân phối đều và xuất hiện thường xuyên trong điều kiện truy vấn. `user_id` hoặc `tenant_id` thường là lựa chọn tốt hơn `status`.

> **Thách thức lớn nhất khi sharding là gì?**
>
> Cross-shard query, cross-shard join, transaction phân tán và rebalancing là các bài toán khó nhất. Chi phí vận hành tăng mạnh so với một database đơn.
