# Nguyên lý thiết kế

## 5. Nguyên lý YAGNI — You Aren't Gonna Need It

### 5.1. Khái niệm cốt lõi

> Không implement các features, abstractions, hoặc flexibility mà bạn không cần ngay bây giờ.

YAGNI là một nguyên lý của extreme programming (XP) khuyên rằng không nên thiết kế dự phòng. Chỉ xây dựng những gì được yêu cầu bởi requirements hiện tại, không phải những gì bạn dự đoán có thể cần trong tương lai.

### 5.2. Mục đích

- **Tránh nỗ lực lãng phí:** Không dành thời gian code features sẽ không bao giờ được dùng
- **Codebase nhỏ gọn hơn, sạch hơn:** Ít code hơn có nghĩa ít bug hơn và dễ bảo trì hơn
- **Giao hàng nhanh hơn:** Ship giá trị cho người dùng sớm hơn
- **Giảm độ phức tạp:** Không có abstractions không cần thiết làm rối thiết kế

### 5.3. YAGNI trong thực tế

#### 5.3.1. Những gì KHÔNG NÊN làm

```typescript
// Bad: Thêm "flexibility" cho nhu cầu tưởng tượng trong tương lai
class UserRepository {
  // Dùng complex abstraction "just in case" switch databases
  save(user: User, databaseType: 'postgres' | 'mongodb' | 'redis') {
    // 500 dòng code database-agnostic
  }
}

// Bad: Xây dựng admin panels, roles, permissions "for future use"
class User {
  // Comment: "Will add role-based access control later"
  permissions: string[] = [];
}
```

#### 5.3.2. Những gì NÊN làm thay thế

```typescript
// Good: Đơn giản và trực tiếp — giải quyết vấn đề hiện tại
class UserRepository {
  private db: PostgresDatabase;

  async save(user: User): Promise<void> {
    await this.db.query(
      'INSERT INTO users (id, name, email) VALUES ($1, $2, $3)',
      [user.id, user.name, user.email]
    );
  }
}
```

### 5.4. YAGNI vs. Nguyên lý SOLID

YAGNI không có nghĩa là viết code lộn xộn, không thể mở rộng. Nó có nghĩa là:

| Nguyên lý | YAGNI nói | SOLID nói |
|---|---|---|
| **Abstraction** | Không thêm abstraction "just in case" | Làm abstraction đúng khi cần |
| **Open/Closed** | Không over-engineer cho extensibility | Open for extension, closed for modification |
| **Dependency Inversion** | Không thêm interfaces "for future mocking" | Depend on abstractions |

> **Tip:** Chìa khóa là **timing**. Nguyên lý SOLID giúp khi cần mở rộng code hiện tại. YAGNI nói: đợi cho đến khi thực sự cần mở rộng nó. Premature abstraction cũng có hại như premature optimization.

### 5.5. Nhận diện vi phạm YAGNI

Cẩn thận với các dấu hiệu đỏ sau:

- **Comments "Just in case":** `// Might need this later`
- **Tham số không dùng:** `calculateArea(width, height, unusedParam)`
- **Code đã comment-out:** Code cũ được giữ "just in case"
- **Feature flags cho features chưa quyết định:** Hệ thống over-configured
- **Interfaces quá nhiều:** Một interface cho mỗi class, kể cả internal services nhỏ

### 5.6. Khi nào YAGNI có thể bị áp dụng quá đà

- Khi nó dẫn đến **code trùng lặp** rõ ràng nên được chia sẻ
- Khi codebase trở nên **khó test** do tight coupling
- Khi **nhu cầu kiến trúc rõ ràng** (ví dụ: database layer) bị bỏ qua

### 5.7. Quy tắc thực tế

| Câu hỏi | YAGNI verdict |
|---|---|
| Feature này được user hoặc stakeholder yêu cầu? | Xây dựng nó |
| Feature này cho "potential future" use? | Không xây dựng |
| Đây là để tránh một code smell rõ ràng? | Sửa smell đó |
| Đây là vì "we might need it"? | Không thêm |

### 5.8. Mối quan hệ YAGNI và DRY

> **Tóm tắt:** YAGNI và DRY bổ sung cho nhau. YAGNI ngăn xây dựng những thứ sẽ không được dùng. DRY ngăn lặp lại những thứ sẽ được dùng. Cùng nhau, chúng giúp codebase gọn gàng và phù hợp.

| Tình huống | YAGNI | DRY |
|---|---|---|
| Code trùng lặp 2 lần, có thể sẽ thay đổi cùng nhau | Không can thiệp | Trích xuất function |
| Code trùng lặp "phòng xa" cho future | Bỏ qua | Không trích xuất |
| Có thể abstract hóa rõ ràng ngay bây giờ | Đợi cho rõ ràng | Trích xuất |
