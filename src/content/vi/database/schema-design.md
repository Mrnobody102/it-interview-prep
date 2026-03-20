# Database -> Schema Design

## 1. Normalization (Chuẩn hóa)

### 1.1. Khái niệm

- **Normalization** là quá trình tổ chức dữ liệu để **giảm dư thừa** và **đảm bảo nhất quán**.
- Mỗi dạng chuẩn (Normal Form) có các quy tắc cụ thể mà database schema phải thỏa mãn.

### 1.2. Các dạng chuẩn

| Dạng chuẩn | Quy tắc | Ví dụ |
|-----------|---------|-------|
| **1NF (First Normal Form)** | Mỗi ô chỉ chứa **giá trị nguyên tử** (không có danh sách, không có bảng con) | Tách `phone_numbers` (nhiều số) thành bảng riêng |
| **2NF (Second Normal Form)** | Thỏa 1NF + **không có phụ thuộc bộ phận** (non-key column phụ thuộc một phần của composite key) | Nếu `order_id + product_id` là key, thì `product_name` chỉ phụ thuộc `product_id` -> tách bảng |
| **3NF (Third Normal Form)** | Thỏa 2NF + **không có phụ thuộc bắc cầu** (non-key column không phụ thuộc non-key column khác) | `city` phụ thuộc `zip_code`, không phải key -> tách bảng |
| **BCNF (Boyce-Codd)** | Phiên bản mạnh hơn 3NF, xử lý trường hợp **overlapping candidate keys** | Khi có nhiều candidate key và một phụ thuộc bắc cầu |
| **4NF** | Thỏa BCNF + **không có multi-valued dependency** | Một khách hàng có nhiều sở thích và nhiều liên hệ -> tách thành 2 bảng |

### 1.3. Ví dụ minh họa

```sql
-- ❌ Vi phạm 1NF: cột chứa nhiều giá trị
CREATE TABLE orders_bad (
    id INT PRIMARY KEY,
    customer_name VARCHAR(100),
    phone_numbers VARCHAR(500)  -- "0901-0902-0903"
);

-- ✅ Thỏa 1NF: mỗi ô nguyên tử
CREATE TABLE orders_good (
    id INT PRIMARY KEY,
    customer_name VARCHAR(100)
);

CREATE TABLE customer_phones (
    customer_id INT,
    phone VARCHAR(20)
);
```

```sql
-- ❌ Vi phạm 2NF: phụ thuộc bộ phận (composite key)
CREATE TABLE order_items_bad (
    order_id INT,
    product_id INT,
    product_name VARCHAR(100),   -- Chỉ phụ thuộc product_id, không phụ thuộc order_id
    quantity INT,
    PRIMARY KEY (order_id, product_id)
);

-- ✅ Thỏa 2NF: tách bảng products
CREATE TABLE products (
    id INT PRIMARY KEY,
    name VARCHAR(100)
);

CREATE TABLE order_items (
    order_id INT,
    product_id INT,
    quantity INT,
    PRIMARY KEY (order_id, product_id)
);
```

### 1.4. Lợi ích của Normalization

- **Giảm dư thừa dữ liệu** — mỗi dữ liệu chỉ lưu một nơi.
- **Đảm bảo nhất quán** — cập nhật một chỗ, thay đổi áp dụng toàn bộ.
- **Tránh anomaly**: Update anomaly, Insert anomaly, Delete anomaly.

### 1.5. Nhược điểm khi normalized quá mức

- **Nhiều JOIN** khi truy vấn — ảnh hưởng hiệu năng.
- Trong thực tế, schema thường dừng ở **3NF** hoặc **BCNF**.

---

## 2. Denormalization (Phi chuẩn hóa)

### 2.1. Khái niệm

- **Chủ động lặp dữ liệu** (duplicate data) để **giảm số lượng JOIN**, tối ưu tốc độ đọc.
- Là kỹ thuật **đánh đổi**: lấy hiệu năng đọc đổi lấy bộ nhớ và rủi ro dữ liệu không nhất quán.

### 2.2. Khi nào nên Denormalize?

| Tình huống | Giải pháp |
|-----------|-----------|
| Dashboard cần hiển thị nhiều bảng | Thêm **materialized view** hoặc lưu kết quả JOIN sẵn |
| Report thường xuyên chạy chậm | Tạo bảng **summary/aggregate** (daily_sales, monthly_revenue) |
| Đọc nhiều hơn ghi (read-heavy) | Lưu trùng dữ liệu tần suất cao |
| Cache dữ liệu trong bảng | Lưu `product_name` vào bảng `orders` thay vì JOIN |

### 2.3. Ví dụ: Summary table

```sql
-- Bảng tổng hợp cho report
CREATE TABLE daily_sales_summary (
    date DATE PRIMARY KEY,
    total_orders INT,
    total_revenue DECIMAL(15,2),
    total_customers INT
);

-- Trigger tự động cập nhật khi có đơn hàng mới
CREATE OR REPLACE FUNCTION update_daily_summary()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE daily_sales_summary
    SET total_orders = total_orders + 1,
        total_revenue = total_revenue + NEW.total
    WHERE date = NEW.order_date;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

---

## 3. Thiết kế Schema thực tế

### 3.1. Các nguyên tắc cơ bản

| Nguyên tắc | Mô tả |
|-----------|-------|
| **Chọn đúng kiểu dữ liệu** | `INT` vs `BIGINT` vs `VARCHAR(n)` — không lãng phí, không tràn |
| **Đặt NOT NULL khi có thể** | Giảm bộ nhớ, rõ ràng hơn cho optimizer |
| **Dùng surrogate key** | ID tự tăng (AUTO_INCREMENT, SERIAL) thay vì natural key phức tạp |
| **Đặt tên nhất quán** | `snake_case`, rõ ràng: `created_at`, `updated_at`, `is_active` |
| **Soft delete thay hard delete** | Dùng `deleted_at TIMESTAMP` thay vì `DELETE` để phục hồi |

### 3.2. Audit columns (Bắt buộc với mọi bảng)

```sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,

    -- Audit columns
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_by BIGINT REFERENCES users(id),
    updated_by BIGINT REFERENCES users(id),
    deleted_at TIMESTAMP  -- Soft delete
);
```

### 3.3. Câu hỏi phỏng vấn thường gặp

> **Normalization vs Denormalization — khi nào dùng cái nào?**
>
> Nên **bắt đầu với normalized schema** (3NF) để đảm bảo tính nhất quán và giảm dư thừa. Chỉ **denormalize khi có đo lường hiệu năng** (profiling) cho thấy JOIN là bottleneck. Denormalize có chọn lọc, không phải toàn bộ database.

> **Soft delete vs Hard delete — ưu nhược điểm?**
>
> Soft delete (`deleted_at`, `is_deleted`) cho phép **phục hồi dữ liệu**, giữ referential integrity, hỗ trợ audit. Nhược điểm: query cần thêm điều kiện `WHERE deleted_at IS NULL`, index phải bao gồm cột này. Hard delete tiết kiệm bộ nhớ nhưng mất dữ liệu vĩnh viễn.

> **Đặt cột `updated_at` tự động cập nhật như thế nào?**
>
> PostgreSQL: dùng trigger hoặc `DEFAULT CURRENT_TIMESTAMP` với rule. MySQL: dùng trigger `BEFORE UPDATE`. Nhiều ORM (JPA, Hibernate) hỗ trợ annotation `@LastModifiedDate`.

> **Sự khác nhau giữa Surrogate Key và Natural Key?**
>
> **Surrogate Key** (UUID, auto-increment) không có ý nghĩa nghiệp vụ, không thay đổi — lý tưởng làm primary key. **Natural Key** có ý nghĩa nghiệp vụ (ví dụ: ISBN cho sách, SSN cho người) — khó quản lý nếu business rule thay đổi.

---

## 4. Mối quan hệ giữa các bảng (Relationships)

### 4.1. Các loại relationship

| Loại | Mô tả | Ví dụ |
|------|--------|-------|
| **One-to-One** | Mỗi bản ghi A tương ứng với một bản ghi B | `users` - `user_profiles` |
| **One-to-Many** | Một bản ghi A tương ứng nhiều bản ghi B | `categories` - `products` |
| **Many-to-Many** | Nhiều bản ghi A tương ứng nhiều bản ghi B | `students` - `courses` |
| **Self-referential** | Bảng tham chiếu chính nó | `employees` - `manager_id` |

### 4.2. Ví dụ: E-commerce Schema

```sql
-- Một - Nhiều: Category -> Products
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    parent_id INT REFERENCES categories(id)  -- Self-referential
);

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2),
    category_id INT REFERENCES categories(id)
);

-- Nhiều - Nhiều: Orders <-> Products (qua bảng trung gian)
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    customer_id BIGINT NOT NULL,
    order_date DATE,
    status VARCHAR(20)
);

CREATE TABLE order_items (
    order_id INT REFERENCES orders(id),
    product_id INT REFERENCES products(id),
    quantity INT,
    price DECIMAL(10,2),
    PRIMARY KEY (order_id, product_id)
);
```

---

## 5. Index Design

### 5.1. Primary Key vs Unique Index

| Tiêu chí | Primary Key | Unique Index |
|----------|-------------|-------------|
| **Null** | Không cho NULL | Chỉ một NULL (MySQL) hoặc nhiều NULL (PostgreSQL) |
| **Số lượng** | Một bảng có một PK | Có nhiều unique index |
| **Thường dùng** | Surrogate key (ID) | Email, username, số điện thoại |

### 5.2. Foreign Key và Index

```sql
-- Foreign key nên có index (đặc biệt khi bảng lớn)
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_product ON order_items(product_id);
```

---

## 6. Tóm tắt

- **Bắt đầu với 3NF** — giảm dư thừa, đảm bảo nhất quán.
- **Denormalize có đo lường** — chỉ khi profiling xác nhận bottleneck.
- **Surrogate key** làm primary key, đặt audit columns cho mọi bảng.
- **Soft delete** thay hard delete trừ khi bắt buộc xóa vĩnh viễn.
- **Đặt tên nhất quán** — `snake_case`, rõ ràng nghiệp vụ.
