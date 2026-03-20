# Database -> Indexing & Query Optimization

## 1. Các loại Index

### 1.1. Single Column Index

Đánh index trên một cột đơn lẻ.

```sql
CREATE INDEX idx_user_email ON users(email);
```

---

### 1.2. Composite Index (Multi-column Index)

Đánh index trên **nhiều cột** — thứ tự cột **rất quan trọng**.

```sql
CREATE INDEX idx_order_customer_status
ON orders(customer_id, status);
```

> **Quy tắc quan trọng**: Cột đầu tiên nên là cột có **selectivity cao nhất** trong `WHERE` clause. Composite index hỗ trợ truy vấn theo cột đầu tiên hoặc cột đầu + cột thứ hai, nhưng **KHÔNG hỗ trợ** nếu bỏ qua cột đầu.

| Query | Dùng được index? |
|-------|----------------|
| `WHERE customer_id = 1` | ✅ Có (dùng prefix) |
| `WHERE customer_id = 1 AND status = 'pending'` | ✅ Có |
| `WHERE status = 'pending'` | ❌ Không (bỏ qua cột đầu) |

---

### 1.3. Unique Index

Đảm bảo giá trị trong cột **không trùng lặp**.

```sql
CREATE UNIQUE INDEX idx_user_email ON users(email);
```

> Thường dùng cho: email, username, số điện thoại, mã số thuế.

---

### 1.4. Full-text Index

Tìm kiếm văn bản hiệu quả — thay thế `LIKE '%keyword%'` chậm.

```sql
-- PostgreSQL: GIN index với tsvector
CREATE INDEX idx_product_name
ON products USING gin(to_tsvector('english', name));

-- Tìm kiếm
SELECT * FROM products
WHERE to_tsvector('english', name) @@ to_tsquery('english', 'laptop & gaming');
```

```sql
-- MySQL: FULLTEXT index
CREATE FULLTEXT INDEX idx_product_desc ON products(description);

-- Tìm kiếm
SELECT * FROM products
WHERE MATCH(description) AGAINST('laptop gaming' IN NATURAL LANGUAGE MODE);
```

> **Dùng khi**: Tìm kiếm từ khóa ở giữa chuỗi. Với B-Tree index thông thường không thể tìm suffix (ví dụ: tìm "an" trong "Huyền" — B-Tree chỉ tìm được prefix).

---

### 1.5. Partial Index (Index trên điều kiện)

Chỉ index những bản ghi thỏa điều kiện — tiết kiệm kích thước.

```sql
-- PostgreSQL: Chỉ index đơn hàng chưa xử lý
CREATE INDEX idx_orders_pending
ON orders(created_at)
WHERE status = 'pending';

-- MySQL: Tương tự với filtered index
CREATE INDEX idx_orders_pending ON orders(created_at, status);
```

---

### 1.6. Covering Index (Index bao trùm)

Index chứa đủ dữ liệu cần thiết — tránh đọc bảng chính (**Index Only Scan**).

```sql
-- Index bao trùm: chứa cả cột cần SELECT
CREATE INDEX idx_users_active_covering
ON users(status)
INCLUDE (name, email, created_at);

-- Query này KHÔNG cần đọc bảng chính
SELECT name, email FROM users WHERE status = 'active';
```

---

## 2. Cột nên và không nên đánh Index

### 2.1. Nên đánh Index

| Trường hợp | Ví dụ |
|-----------|-------|
| Cột trong `WHERE` thường xuyên tìm kiếm | `WHERE status = 'ACTIVE'` |
| Cột là **khóa ngoại** (JOIN) | `JOIN ON o.customer_id = c.id` |
| Cột trong `ORDER BY` | `ORDER BY created_date DESC` |
| Cột trong `GROUP BY` | `GROUP BY category` |
| Cột có **selectivity cao** (> 95% giá trị khác nhau) | Email, ID, UUID |
| Cột trong `DISTINCT` | `SELECT DISTINCT category FROM products` |

### 2.2. Không nên đánh Index

| Trường hợp | Lý do |
|-----------|-------|
| Cột có **quá ít giá trị phân biệt** | Giới tính (Nam/Nữ), Trạng thái (2-3 giá trị) |
| Bảng nhỏ (vài trăm dòng) | Full table scan có thể nhanh hơn |
| Cột thường xuyên **UPDATE/DELETE** | Index phải cập nhật theo — overhead cao |
| Cột kiểu TEXT/BLOB lớn | Tốn bộ nhớ, chậm cập nhật |

---

## 3. EXPLAIN & EXPLAIN ANALYZE

### 3.1. EXPLAIN — Kế hoạch dự kiến

Xem kế hoạch thực thi query mà **không chạy** query.

```sql
EXPLAIN SELECT * FROM users WHERE email = 'huy@example.com';
```

---

### 3.2. EXPLAIN ANALYZE — Thực thi và đo lường

Chạy query thực tế và hiển thị **thời gian thực**.

```sql
EXPLAIN ANALYZE SELECT * FROM orders WHERE customer_id = 123;
```

---

### 3.3. Đọc kết quả EXPLAIN

| Trường | Ý nghĩa |
|--------|---------|
| **Seq Scan** | Quét toàn bộ bảng — chậm với dữ liệu lớn |
| **Index Scan** | Dùng index — nhanh |
| **Index Only Scan** | Chỉ đọc từ index, không đụng bảng — nhanh nhất |
| **Bitmap Heap Scan** | Dùng bitmap index (khi nhiều rows khớp) |
| **cost=0.29..8.30** | Chi phí tương đối (khởi đầu..hoàn thành) |
| **rows=100** | Số dòng ước lượng trả về |
| **actual time** | Thời gian thực tế (ms) |
| **Buffers** | Số block đọc từ shared buffers |
| **loops** | Số lần node được thực thi |

---

### 3.4. Ví dụ so sánh

```sql
-- ✅ Có index -> Index Scan (nhanh)
EXPLAIN ANALYZE
SELECT * FROM users WHERE id = 123;
-- Index Scan using users_pkey on users
-- actual time=0.031..0.032 rows=1 loops=1
-- Buffers: shared hit=4

-- ❌ Không có index -> Seq Scan (chậm)
EXPLAIN ANALYZE
SELECT * FROM users WHERE email = 'huy@example.com';
-- Seq Scan on users
-- actual time=0.045..156.789 rows=1 loops=1
-- Rows Removed by Filter: 99999
-- Planning Time: 0.5ms, Execution Time: 156.8ms
```

---

## 4. Tối ưu Query

### 4.1. Tránh SELECT *

```sql
-- ❌ Chậm — trả về tất cả cột, không tận dụng covering index
SELECT * FROM orders WHERE customer_id = 1;

-- ✅ Nhanh hơn — chỉ lấy cột cần thiết
SELECT id, order_date, total FROM orders WHERE customer_id = 1;
```

---

### 4.2. Tránh Subquery khi dùng JOIN được

```sql
-- ❌ Subquery không cần thiết
SELECT * FROM orders
WHERE customer_id IN (
    SELECT customer_id FROM customers WHERE status = 'ACTIVE'
);

-- ✅ JOIN thay thế
SELECT o.* FROM orders o
JOIN customers c ON o.customer_id = c.customer_id
WHERE c.status = 'ACTIVE';
```

---

### 4.3. EXISTS vs IN

```sql
-- ✅ Dùng EXISTS cho subquery lớn (tối ưu hơn vì dừng sớm)
SELECT * FROM orders o
WHERE EXISTS (
    SELECT 1 FROM customers c
    WHERE c.customer_id = o.customer_id AND c.status = 'VIP'
);

-- Nên dùng IN khi danh sách IN nhỏ và cố định
SELECT * FROM products WHERE category_id IN (1, 2, 3);
```

---

### 4.4. Keyset Pagination thay vì OFFSET

```sql
-- ❌ OFFSET chậm với số lớn — DB phải đọc và bỏ 10000 dòng
SELECT * FROM products ORDER BY id LIMIT 20 OFFSET 10000;

-- ✅ Keyset pagination — nhanh hơn nhiều, thời gian không tăng
SELECT * FROM products
WHERE id > 10000
ORDER BY id
LIMIT 20;
```

> **Lý do**: OFFSET yêu cầu DB scan 10020 dòng (đọc 10000 dòng để bỏ, rồi đọc 20 dòng cần). Keyset chỉ cần index seek trực tiếp đến dòng tiếp theo.

---

### 4.5. Tránh hàm trên cột trong WHERE

```sql
-- ❌ Không dùng được index vì hàm trên cột
SELECT * FROM orders
WHERE YEAR(order_date) = 2024;

-- ✅ Dùng range condition — tận dụng index
SELECT * FROM orders
WHERE order_date >= '2024-01-01' AND order_date < '2025-01-01';
```

---

### 4.6. Batch Insert/Update

```sql
-- ❌ Chậm — nhiều roundtrip
INSERT INTO products (name, price) VALUES ('A', 100);
INSERT INTO products (name, price) VALUES ('B', 200);
INSERT INTO products (name, price) VALUES ('C', 300);

-- ✅ Nhanh — batch insert
INSERT INTO products (name, price) VALUES
    ('A', 100),
    ('B', 200),
    ('C', 300);

-- PostgreSQL: ON CONFLICT cho upsert
INSERT INTO products (name, price) VALUES
    ('A', 100),
    ('B', 200)
ON CONFLICT (name) DO UPDATE SET price = EXCLUDED.price;
```

---

## 5. Query Optimization Checklist

| # | Bước | Hành động |
|---|------|-----------|
| 1 | **Xác định query chậm** | Bật slow query log (`log_min_duration_statement = 1000`) |
| 2 | **Xem execution plan** | `EXPLAIN ANALYZE` |
| 3 | **Kiểm tra index** | Có dùng index không? Có Seq Scan không? |
| 4 | **Tối ưu SQL** | Tránh `SELECT *`, dùng JOIN thay subquery |
| 5 | **Thêm/điều chỉnh index** | Composite index cho WHERE nhiều cột |
| 6 | **Đo lại** | So sánh thời gian trước/sau |

---

## 6. Ví dụ thực tế với bảng Orders

```sql
-- Tạo bảng orders
CREATE TABLE orders (
    id BIGSERIAL PRIMARY KEY,
    customer_id BIGINT,
    order_date DATE,
    status VARCHAR(20),
    total DECIMAL(10,2)
);

-- Index cho tìm kiếm phổ biến
CREATE INDEX idx_orders_customer ON orders(customer_id);           -- Tìm đơn theo khách
CREATE INDEX idx_orders_date ON orders(order_date);               -- Thống kê theo ngày
CREATE INDEX idx_orders_status ON orders(status);                 -- Lọc theo trạng thái
CREATE INDEX idx_orders_customer_status ON orders(customer_id, status); -- Combo

-- Query tối ưu
SELECT id, order_date, total
FROM orders
WHERE customer_id = 123
  AND status = 'delivered'
ORDER BY order_date DESC;
```

---

## 7. Câu hỏi phỏng vấn thường gặp

> **Composite index thứ tự cột có quan trọng không?**
>
> Rất quan trọng. DB sử dụng **leftmost prefix** — index `(a, b, c)` hỗ trợ queries trên `(a)`, `(a, b)`, `(a, b, c)` nhưng **KHÔNG** hỗ trợ queries chỉ trên `(b)` hoặc `(c)`. Luôn đặt cột có **selectivity cao nhất** hoặc được dùng **thường xuyên nhất** làm cột đầu tiên.

> **B-Tree index hoạt động như thế nào?**
>
> B-Tree (Balanced Tree) lưu trữ dữ liệu theo cấu trúc cây cân bằng — độ sâu O(log n). Mỗi node chứa nhiều key và con trỏ. Tìm kiếm bắt đầu từ root, đi qua các intermediate nodes đến leaf node chứa giá trị thực và row pointer. Cấu trúc này đảm bảo tìm kiếm nhanh bất kể kích thước bảng.

> **Khi nào dùng B-Tree vs Hash index?**
>
> B-Tree: tìm kiếm range (`>`, `<`, `BETWEEN`), tìm prefix, ORDER BY. Hash: tìm kiếm chính xác (`=`) duy nhất — không hỗ trợ range, không hỗ trợ sorting. Redis dùng Hash index mặc định.

> **Index có nhược điểm gì?**
>
> Index tốn **bộ nhớ** (thường 10-30% kích thước bảng). Mỗi lần INSERT/UPDATE/DELETE phải cập nhật index — **overhead ghi**. Quá nhiều index trên bảng write-heavy sẽ làm chậm thao tác ghi.
