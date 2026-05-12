# Database -> Transaction, Isolation & Locking

## 1. Transaction

### 1.1. Khái niệm

**Transaction** là tập hợp các thao tác với database, được thực hiện như một **đơn vị duy nhất**.

- **Commit**: Lưu tất cả thay đổi vào database.
- **Rollback**: Hủy bỏ tất cả thay đổi, quay về trạng thái trước transaction.

Nói dễ hiểu: transaction là "làm hết hoặc không làm gì". Với chuyển tiền, không được phép trừ tiền người A thành công nhưng cộng tiền người B thất bại.

### 1.2. Ví dụ: Chuyển tiền

```sql
BEGIN TRANSACTION;

  UPDATE accounts SET balance = balance - 100 WHERE id = 1;  -- Trừ A
  UPDATE accounts SET balance = balance + 100 WHERE id = 2;  -- Cộng B

COMMIT;
```

| Tính chất | Kết quả |
|-----------|---------|
| **Atomicity** | Crash ở giữa -> rollback, không ai mất tiền |
| **Consistency** | Tổng balance A+B không đổi |
| **Durability** | Sau COMMIT -> lưu vĩnh viễn |

---

## 2. ACID

| Chữ | Ý nghĩa | Mô tả chi tiết |
|-----|---------|---------------|
| **A — Atomicity** | Nguyên tử | Tất cả hoặc không có gì — giao dịch hoặc thực hiện toàn bộ hoặc không làm gì cả |
| **C — Consistency** | Nhất quán | Sau transaction, DB luôn ở trạng thái hợp lệ, không vi phạm ràng buộc (constraint, key) |
| **I — Isolation** | Cô lập | Các transaction đồng thời không ảnh hưởng lẫn nhau |
| **D — Durability** | Bền vững | Kết quả đã commit được lưu vĩnh viễn, không mất kể sự cố (crash, restart) |

> **Lưu ý**: Không phải mọi database đều hỗ trợ ACID đầy đủ. **MongoDB** (trước v4.0) và nhiều **NoSQL** chỉ hỗ trợ **BASE** (Basically Available, Soft state, Eventual consistency).

---

## 3. Isolation Levels

### 3.1. Tổng quan

**Isolation level** quyết định transaction này nhìn thấy thay đổi của transaction khác tới mức nào. Isolation càng cao thì dữ liệu càng an toàn, nhưng hệ thống thường chậm hơn vì phải khóa hoặc kiểm tra xung đột nhiều hơn.

| Level | Dirty Read | Non-repeatable Read | Phantom Read |
|-------|-----------|---------------------|--------------|
| **Read Uncommitted** | Có thể | Có thể | Có thể |
| **Read Committed** | Không | Có thể | Có thể |
| **Repeatable Read** | Không | Không | Có thể |
| **Serializable** | Không | Không | Không |

> **Default của các DB phổ biến**: PostgreSQL & Oracle & SQL Server = **Read Committed** | MySQL (InnoDB) = **Repeatable Read**

---

### 3.2. Read Uncommitted

- Transaction đọc dữ liệu **chưa commit** của transaction khác.
- Rủi ro cao nhất — **dirty read** (đọc dữ liệu ảo, có thể bị rollback).
- Hiếm khi dùng trong thực tế.

```sql
-- Session A: Bắt đầu transaction, cập nhật nhưng chưa commit
BEGIN;
UPDATE accounts SET balance = 0 WHERE id = 1;

-- Session B: Đọc được balance = 0 (dữ liệu chưa commit)
-- Nếu Session A rollback -> Session B đọc dữ liệu ảo
SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;
SELECT balance FROM accounts WHERE id = 1;  -- Đọc được giá trị chưa commit
```

---

### 3.3. Read Committed *(Mặc định: PostgreSQL, Oracle, SQL Server)*

- Chỉ đọc dữ liệu **đã commit**.
- Vẫn có thể xảy ra: đọc cùng một dòng 2 lần trong 1 transaction -> kết quả khác nhau (**non-repeatable read**).

```sql
-- Session A: Đọc balance = 1000
SELECT balance FROM accounts WHERE id = 1;  -- 1000

-- Session B: Commit thay đổi balance = 2000
UPDATE accounts SET balance = 2000 WHERE id = 1; COMMIT;

-- Session A: Đọc lại -> 2000 (khác với lần trước!)
SELECT balance FROM accounts WHERE id = 1;  -- 2000
```

---

### 3.4. Repeatable Read *(Mặc định: MySQL InnoDB)*

- Trong suốt transaction, dòng đã đọc sẽ **không thay đổi** — snapshot được chụp lúc bắt đầu.
- Vẫn có thể: thêm/bớt dòng mới -> **phantom read** (số dòng thay đổi).

---

### 3.5. Serializable

- Isolation level **cao nhất** — transaction tuần tự tuyệt đối.
- **Nhược điểm**: Hiệu năng thấp nhất, dễ bị **wait** và deadlock.
- Thực tế: chỉ dùng khi cần đảm bảo tuyệt đối không có conflict.

---

## 4. Hiện tượng cần biết

| Hiện tượng | Mô tả | Xảy ra khi |
|-----------|--------|-----------|
| **Dirty Read** | Đọc dữ liệu chưa commit — có thể đọc dữ liệu ảo (sẽ bị rollback) | Read Uncommitted |
| **Non-repeatable Read** | Đọc cùng dòng 2 lần -> kết quả khác nhau (dòng đó bị sửa) | Read Uncommitted, Read Committed |
| **Phantom Read** | Đọc cùng điều kiện 2 lần -> số dòng khác nhau (thêm/bớt dòng mới) | Read Uncommitted, Read Committed, Repeatable Read |
| **Lost Update** | 2 transaction cùng đọc rồi ghi -> update của transaction trước bị ghi đè | Mọi level (nếu không có locking) |

---

## 5. Locking (Khóa)

### 5.1. Pessimistic Locking (Khóa bi quan)

**Đặt lock ngay khi đọc** — ngăn transaction khác sửa.

```java
// Spring Data JPA
@Lock(LockModeType.PESSIMISTIC_WRITE)
@Query("SELECT u FROM User u WHERE u.id = :id")
Optional<User> findByIdWithLock(@Param("id") Long id);
```

```sql
-- Lock dòng cụ thể (SELECT FOR UPDATE)
SELECT * FROM accounts WHERE id = 1 FOR UPDATE;
-- Exclusive Lock: chỉ một người ghi/đọc được
-- Shared Lock: nhiều người đọc được, nhưng không ai ghi được
SELECT * FROM accounts WHERE id = 1 FOR SHARE;
```

| Loại lock | Mô tả |
|-----------|-------|
| **Exclusive Lock (X)** | Chặn mọi lock khác — ghi/đọc |
| **Shared Lock (S)** | Cho phép nhiều Shared Lock, chặn Exclusive Lock |

> **Khi nào dùng Pessimistic Locking?**
>
> Khi có **nhiều transaction cùng ghi** cùng một dòng, và việc conflict gây hậu quả nghiêm trọng (ví dụ: thanh toán, booking). Đảm bảo không có lost update.

---

### 5.2. Optimistic Locking (Khóa lạc quan)

**Không khóa khi đọc** — kiểm tra khi ghi.

```java
@Version
private Long version;
```

```sql
-- Khi update, kiểm tra version
UPDATE accounts
SET balance = 2000, version = version + 1
WHERE id = 1 AND version = 5;  -- Nếu version != 5 -> 0 rows affected

-- Nếu 0 rows affected -> OptimisticLockException (version đã thay đổi)
```

| Tiêu chí | Pessimistic | Optimistic |
|----------|-------------|-----------|
| **Cơ chế** | Lock khi đọc | Kiểm tra version khi ghi |
| **Conflict** | Ngăn conflict từ đầu | Cho phép conflict, xử lý sau |
| **Performance** | Chậm hơn (lock) | Nhanh hơn (không block) |
| **Phù hợp** | Write-heavy, conflict thường xuyên | Read-heavy, conflict hiếm |
| **Xử lý conflict** | Đợi đến khi lock release | Retry logic khi exception |

---

### 5.3. So sánh chi tiết

```java
// Pessimistic Locking — ngăn chặn
@Transactional
public void transferPessimistic(Long fromId, Long toId, BigDecimal amount) {
    Account from = repo.findByIdWithLock(fromId);  // SELECT FOR UPDATE
    Account to = repo.findByIdWithLock(toId);      // Lock ở đây
    from.setBalance(from.getBalance().subtract(amount));
    to.setBalance(to.getBalance().add(amount));
    repo.saveAll(List.of(from, to));
}

// Optimistic Locking — phát hiện và retry
@Transactional
public void transferOptimistic(Long fromId, Long toId, BigDecimal amount) {
    while (true) {
        Account from = repo.findById(fromId);  // .withOptimisticLocking()
        Account to = repo.findById(toId);
        from.setBalance(from.getBalance().subtract(amount));
        to.setBalance(to.getBalance().add(amount));
        try {
            repo.saveAll(List.of(from, to));
            break;  // Thành công -> thoát
        } catch (OptimisticLockException e) {
            // Conflict -> retry
        }
    }
}
```

---

## 6. Deadlock (Bế tắc)

### 6.1. Khái niệm

Hai hay nhiều transaction **chờ nhau** giải phóng lock mà không transaction nào có thể tiếp tục.

### 6.2. Ví dụ minh họa

```
Transaction A: Lock(Rec1) -> Chờ Lock(Rec2)...
Transaction B: Lock(Rec2) -> Chờ Lock(Rec1)...
-> DEADLOCK
```

### 6.3. Cách xử lý

| Cách | Mô tả |
|------|--------|
| **Hệ thống tự phát hiện** | PostgreSQL, MySQL tự động phát hiện và rollback một transaction (thường là transaction có lock ít hơn) |
| **Thứ tự truy cập cố định** | Luôn truy cập các bảng/theo thứ tự A -> B -> C (ngăn deadlock từ đầu) |
| **Lock nhỏ gọn** | Chỉ lock những bản ghi thực sự cần, không lock cả bảng |
| **Transaction ngắn** | Giới hạn thời gian giữ lock — commit/rollback sớm |
| **Retry logic** | Bắt `DeadlockLoserDataAccessException` và retry với exponential backoff |

```java
// Retry logic với Spring
@Transactional
public void updateOrder(Long id, String status) {
    // Spring tự động retry deadlock transaction (mặc định 3 lần)
}
```

---

## 7. Two-Phase Locking (2PL)

### 7.1. Khái niệm

**Two-Phase Locking** là giao thức đảm bảo serializability:

1. **Growing Phase**: Chỉ **yêu cầu** lock — không được giải phóng lock nào.
2. **Shrinking Phase**: Chỉ **giải phóng** lock — không được yêu cầu lock mới.

### 7.2. Strict 2PL vs Conservative 2PL

| Loại | Mô tả |
|------|--------|
| **Strict 2PL** | Giữ exclusive lock đến khi commit/rollback (phổ biến nhất) |
| **Conservative 2PL** | Yêu cầu tất cả lock trước khi bắt đầu (ít dùng) |

---

## 8. Cấu hình trong Spring Boot

```properties
# Isolation level mặc định (Read Committed)
spring.datasource.hikari.transaction-isolation=TRANSACTION_READ_COMMITTED

# Timeout cho lock (ms)
spring.jpa.properties/jakarta.persistence.lock.timeout=3000
```

```java
// Isolation cho method cụ thể
@Transactional(isolation = Isolation.READ_COMMITTED)
public void updateOrder(Long id, String status) {
    // ...
}

// Hoặc dùng enum
@Transactional(isolation = Isolation.REPEATABLE_READ)
public void processPayment(Long orderId) {
    // ...
}
```

---

## 9. Câu hỏi phỏng vấn thường gặp

> **Sự khác nhau giữa Pessimistic và Optimistic Locking?**
>
> Pessimistic: **khóa ngay khi đọc** — transaction giữ lock cho đến khi commit. Đảm bảo không có conflict nhưng **block** các transaction khác. Optimistic: **không khóa** — kiểm tra version khi ghi. Nếu conflict -> ném exception và retry. Phù hợp khi conflict **hiếm** xảy ra.

> **Tại sao Serializable hiếm khi dùng?**
>
> Serializable tạo lock trên toàn bộ range dữ liệu, gây **nghẽn nghiêm trọng**. Mỗi transaction phải đợi transaction trước xong mới chạy được. Với 1000 concurrent user, hệ thống sẽ **chết**. Thường dùng Read Committed + optimistic locking cho hầu hết use case.

> **MVCC là gì và liên quan gì đến Isolation?**
>
> **MVCC (Multi-Version Concurrency Control)** cho phép nhiều transaction đọc **snapshot** khác nhau cùng lúc mà không block nhau. PostgreSQL dùng MVCC với Read Committed — mỗi câu SELECT thấy snapshot tại thời điểm bắt đầu câu lệnh đó. InnoDB (MySQL) cũng dùng MVCC với Repeatable Read.

> **Lost Update xảy ra như thế nào?**
>
> T1 đọc balance = 1000, T2 đọc balance = 1000, T1 ghi balance = 1000 + 500 = 1500, T2 ghi balance = 1000 + 300 = 1300. Update của T1 bị **mất** (overwritten by T2). Giải pháp: dùng **SELECT FOR UPDATE** (pessimistic) hoặc **@Version** (optimistic).
