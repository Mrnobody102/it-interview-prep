# Nguyên lý thiết kế

## 3. Nguyên lý DRY — Don't Repeat Yourself

### 3.1. Khái niệm cốt lõi

> Mỗi phần logic chỉ nên tồn tại ở **một, duy nhất một** vị trí có thẩm quyền trong hệ thống.

Nguyên lý DRY phát biểu rằng việc trùng lặp logic — dù là trong code, data, hay tài liệu — tạo ra cơn ác mộng bảo trì và tăng khả năng có bug.

### 3.2. Mục đích

- **Giảm bug:** Sửa logic ở một chỗ, không phải N chỗ
- **Cải thiện khả năng bảo trì:** Thay đổi lan truyền nhất quán trong codebase
- **Tăng rõ ràng:** Một nguồn sự thật duy nhất giúp code dễ hiểu
- **Khả năng tái sử dụng tốt hơn:** Logic dùng chung có thể test một lần và dùng ở mọi nơi

### 3.3. Cách áp dụng DRY

#### 3.3.1. Trích xuất hàm/phương thức dùng chung

Thay vì trùng lặp logic:

```typescript
// Bad: Tính toán trùng lặp
const area1 = width1 * height1;
const area2 = width2 * height2;

// Good: Một hàm dùng chung
function calculateArea(width: number, height: number): number {
  return width * height;
}

const area1 = calculateArea(width1, height1);
const area2 = calculateArea(width2, height2);
```

#### 3.3.2. Sử dụng Inheritance hoặc Composition

```typescript
// Composition over inheritance
class UserService {
  constructor(private logger: Logger) {}

  createUser(user: User) {
    this.logger.info(`Creating user: ${user.email}`);
    // ...
  }
}

// Inheritance cho shared behavior
class Animal {
  eat() { /* shared */ }
}

class Dog extends Animal {
  bark() { /* specific */ }
}
```

#### 3.3.3. Tập trung hóa Constants và Configuration

```typescript
// Bad: Số ma thuật trải rộng trong code
if (user.age > 18) { ... }

// Good: Constant có tên
const MINIMUM_AGE = 18;
if (user.age > MINIMUM_AGE) { ... }
```

```typescript
// Tập trung API endpoints
export const API_ENDPOINTS = {
  USERS: '/api/v1/users',
  PRODUCTS: '/api/v1/products',
  ORDERS: '/api/v1/orders',
} as const;
```

#### 3.3.4. Trích xuất Utilities dùng chung

```typescript
// utils/validation.ts
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^\+?[0-9]{10,15}$/;
  return phoneRegex.test(phone);
}
```

### 3.4. DRY vs. WET

| Khía cạnh | DRY | WET (Write Every Time) |
|---|---|---|
| **Trùng lặp code** | Tối thiểu hóa | Cho phép |
| **Khả năng bảo trì** | Cao | Thấp |
| **Độ dễ đọc** | Có thể trừu tượng | Rõ ràng hơn |
| **Rủi ro over-abstraction** | Có | Không |

### 3.5. Khi nào KHÔNG nên áp dụng DRY

> **Quan trọng:** DRY là nguyên tắc chỉ đạo, không phải quy luật tuyệt đối. Áp dụng DRY quá đà dẫn đến over-engineering.

- **Khi abstraction sai:** Tạo base class chung cho hai thứ tương tự nhưng sẽ phân kỳ trong tương lai thì tệ hơn trùng lặp
- **Khi ưu tiên sự đơn giản:** Trùng lặp một câu SQL đơn giản ở hai chỗ có thể rõ ràng hơn tạo abstraction layer phức tạp
- **Khi lo ngại về coupling:** Cưỡng ép shared logic giữa các module không liên quan có thể tạo unwanted coupling

> **Tip:** Code trùng lặp mà tiến hóa cùng nhau là một smell. Code trùng lặp mà thay đổi vì lý do khác nhau thì đôi khi acceptable. Hỏi: "Hai phần code này sẽ thay đổi vì cùng lý do không?"

### 3.6. Mối quan hệ DRY và YAGNI

DRY và YAGNI bổ sung cho nhau nhưng đôi khi xung đột:

| Câu hỏi | DRY | YAGNI |
|---|---|---|
| Nên trích xuất function dùng chung? | Có — tránh trùng lặp | Có — nhưng chỉ khi thực sự cần |
| Nên tạo abstraction "phòng xa"? | Có — DRY | Không — chưa cần |
| Nên giữ code dùng 2 lần? | Có — trích xuất | Có — nhưng đợi cho rõ ràng |

> **Tóm tắt:** DRY ngăn việc lặp lại những gì sẽ được sử dụng. YAGNI ngăn việc xây dựng những thứ sẽ không bao giờ được dùng. Cùng nhau, chúng giúp codebase gọn gàng và phù hợp.
