# Database -> Database Migration

## Tại sao database migration quan trọng?

Database migration là cách quản lý thay đổi schema bằng version control, đi cùng với code ứng dụng. Thay vì sửa database thủ công trên từng môi trường, team định nghĩa các thay đổi dưới dạng script hoặc changelog để có thể review, chạy lặp lại, và theo dõi lịch sử.

Các vấn đề migration giải quyết:

- **Schema drift**: dev, staging, production dễ lệch schema nếu cập nhật thủ công.
- **Thiếu lịch sử thay đổi**: khó biết production đang ở version nào.
- **Rollback khó khăn**: thay đổi sai trên production rất khó khôi phục nếu không có quy trình rõ ràng.
- **Deploy không an toàn**: code mới và schema mới có thể không tương thích nếu rollout sai thứ tự.

---

## Flyway

### Khái niệm cốt lõi

Flyway dùng các file migration có version, thường đặt trong thư mục `db/migration`. Mỗi file được chạy theo thứ tự version và lịch sử thực thi được lưu trong bảng `flyway_schema_history`.

### Quy ước đặt tên

```text
V1__init.sql
V2__create_users.sql
V3__add_user_status.sql
R__refresh_reporting_view.sql
```

- `V` là versioned migration, chạy một lần theo thứ tự.
- `R` là repeatable migration, chạy lại khi nội dung thay đổi.
- Hai dấu gạch dưới `__` phân tách version và mô tả.

### Các lệnh thường dùng

```bash
flyway migrate
flyway info
flyway validate
flyway repair
flyway baseline -version=1 -description="Existing schema"
```

### Ví dụ migration

```sql
-- V1__init.sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

```sql
-- V2__add_user_status.sql
ALTER TABLE users
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active';
```

### Tích hợp Spring Boot

```xml
<dependency>
    <groupId>org.flywaydb</groupId>
    <artifactId>flyway-core</artifactId>
</dependency>
```

```yaml
spring:
  flyway:
    enabled: true
    locations: classpath:db/migration
    validate-on-migrate: true
    baseline-on-migrate: false
```

---

## Liquibase

### Khái niệm cốt lõi

Liquibase quản lý thay đổi bằng changelog XML, YAML, JSON hoặc SQL. Mỗi thay đổi được đóng gói trong một `changeset`, và lịch sử được ghi vào bảng `databasechangelog`.

### Ví dụ changelog XML

```xml
<databaseChangeLog
    xmlns="http://www.liquibase.org/xml/ns/dbchangelog"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://www.liquibase.org/xml/ns/dbchangelog
        http://www.liquibase.org/xml/ns/dbchangelog/dbchangelog-latest.xsd">

    <changeSet id="1" author="team">
        <createTable tableName="users">
            <column name="id" type="BIGINT" autoIncrement="true">
                <constraints primaryKey="true"/>
            </column>
            <column name="username" type="VARCHAR(100)">
                <constraints nullable="false" unique="true"/>
            </column>
        </createTable>
    </changeSet>
</databaseChangeLog>
```

### Tích hợp Spring Boot

```xml
<dependency>
    <groupId>org.liquibase</groupId>
    <artifactId>liquibase-core</artifactId>
</dependency>
```

```yaml
spring:
  liquibase:
    enabled: true
    change-log: classpath:db/changelog/db.changelog-master.xml
    contexts: dev
```

---

## Flyway vs Liquibase

| Tiêu chí | Flyway | Liquibase |
|----------|--------|-----------|
| Cách tiếp cận | SQL versioned scripts | Declarative changelog |
| Độ đơn giản | Cao | Trung bình |
| Rollback | Thường cần script riêng | Hỗ trợ tốt hơn qua `rollback` |
| Phù hợp với | Team thích viết SQL thuần | Team cần đa DB, metadata rõ |

> Nếu team mạnh về SQL và muốn ít abstraction, Flyway thường là lựa chọn gọn hơn. Nếu cần changelog giàu metadata, rollback rõ ràng và hỗ trợ multi-database mạnh, Liquibase phù hợp hơn.

---

## Best Practices

### 1. Mỗi migration chỉ nên làm một việc

Tách riêng:

- Tạo bảng
- Thêm cột
- Tạo index
- Backfill dữ liệu

Điều này giúp rollback và review dễ hơn.

### 2. Không trộn schema migration và data migration nặng

Không nên vừa đổi schema vừa backfill hàng chục triệu dòng trong cùng một migration nếu hệ thống cần uptime cao.

Nên dùng chiến lược:

1. **Expand**: thêm cột/bảng mới.
2. Deploy code tương thích với cả schema cũ và mới.
3. Backfill dữ liệu bằng job riêng.
4. **Contract**: xóa cột/bảng cũ ở đợt sau.

### 3. Ưu tiên migration idempotent khi hợp lý

```sql
ALTER TABLE users
ADD COLUMN IF NOT EXISTS status VARCHAR(20);
```

Điều này giảm rủi ro khi migration bị chạy lại trong môi trường dev/test.

### 4. Luôn kiểm thử trên dữ liệu gần production

Migration chạy tốt với 1.000 bản ghi chưa chắc chạy ổn với 100 triệu bản ghi. Cần kiểm tra:

- lock time
- thời gian chạy
- WAL/binlog growth
- tác động tới CPU, I/O và replication

### 5. Backup trước khi chạy production migration

```bash
pg_dump -U postgres mydb > pre_migration_backup.sql
```

### 6. Có rollback plan thật sự

Rollback không chỉ là “chạy lệnh ngược lại”. Với thay đổi destructive như `DROP COLUMN`, cần có kế hoạch backup, khôi phục dữ liệu hoặc quy trình forward-fix.

---

## Câu hỏi phỏng vấn thường gặp

> **Làm sao triển khai migration mà không downtime?**
>
> Dùng mô hình expand-contract: trước tiên thêm schema mới theo cách backward-compatible, deploy code mới, backfill dữ liệu nếu cần, rồi mới xóa schema cũ ở lần deploy sau.

> **Khi nào nên dùng Flyway, khi nào dùng Liquibase?**
>
> Flyway phù hợp khi team muốn SQL-first và quy trình đơn giản. Liquibase phù hợp khi cần changelog nhiều metadata, rollback rõ, và hỗ trợ đa hệ quản trị tốt hơn.

> **Lỗi migration trên production thì xử lý thế nào?**
>
> Trước hết dừng rollout, đánh giá trạng thái schema và dữ liệu, rồi chọn rollback hoặc forward-fix. Nếu dùng Flyway có thể cần `repair` sau khi xử lý thủ công; nếu dùng Liquibase có thể rollback theo changeset hoặc tag.
