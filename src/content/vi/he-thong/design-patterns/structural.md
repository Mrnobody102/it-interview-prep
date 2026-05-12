# Structural Patterns (Nhóm Cấu trúc)

## 1. Adapter (Bộ chuyển đổi)

**Giải thích:** Giống như cái đầu chuyển đổi ổ cắm 3 chấu sang 2 chấu. Giúp 2 interface không liên quan có thể làm việc được với nhau.

**Code minh họa:**
```java
// Hệ thống cũ chỉ nhận 2 chấu
interface TwoPinPlug { void connect(); }

// Thiết bị mới có 3 chấu
class ThreePinDevice { void plugIn() { ... } }

// Adapter giúp 3 chấu cắm vào được 2 chấu
class SocketAdapter implements TwoPinPlug {
    private ThreePinDevice device;
    public void connect() { device.plugIn(); }
}
```

---

## 2. Decorator (Trang trí)

**Giải thích:** Thêm tính năng cho đối tượng mà không làm thay đổi cấu trúc của nó. Giống như bọc thêm lớp vỏ cho một món quà.

**Ví dụ kinh điển:** Luồng I/O của Java.
```java
InputStream is = new FileInputStream("file.txt");
// Bọc thêm khả năng đọc buffer để chạy nhanh hơn
BufferedInputStream bis = new BufferedInputStream(is);
```

---

## 3. Facade (Mặt tiền)

**Giải thích:** Cung cấp một giao diện đơn giản cho một hệ thống con phức tạp. Giống như việc bạn chỉ cần bấm nút "Start" trên xe ô tô, thay vì phải tự tay bơm xăng, đánh lửa, gài số...

---

## 4. Proxy (Người đại diện)

**Giải thích:** Thay thế hoặc giữ chỗ cho một đối tượng khác để kiểm soát quyền truy cập. Giống như Thư ký đại diện cho Giám đốc để tiếp khách.

**Ứng dụng:** `@Transactional` trong Spring Boot. Spring tạo ra một Proxy bao quanh Class của bạn để tự động mở/đóng Transaction.

---

## 5. Mẹo phỏng vấn

| Pattern | Tóm tắt | Thực tế hay dùng |
|:---|:---|:---|
| **Adapter** | Chế đầu chuyển đổi | Tích hợp thư viện bên thứ 3 |
| **Decorator** | Bọc thêm tính năng | Java I/O, `@Cacheable` |
| **Facade** | Một nút bấm cho vạn tính năng | API Gateway, Service Facade |
| **Proxy** | Kẻ đứng giữa ăn chặn | Spring AOP, Security, Lazy Loading |
