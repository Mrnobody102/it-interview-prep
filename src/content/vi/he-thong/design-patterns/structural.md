# Structural Patterns (Nhóm Cấu trúc)

## Tổng quan
Nhóm này giải quyết câu hỏi: **"Làm sao để lắp ráp các viên gạch (Objects) thành một tòa nhà vững chắc, dễ mở rộng mà không đụng chạm đến code cũ?"**

---

## 1. Adapter Pattern (Đầu Chuyển Đổi)

### Giải thích siêu dễ hiểu
Giống hệt **cái đầu chuyển đổi ổ cắm điện**. 
Máy sấy tóc nhà bạn dùng phích cắm 3 chấu vuông (chuẩn Anh). Nhưng khách sạn bạn ở lại chỉ có ổ cắm 2 lỗ tròn (chuẩn Việt Nam). 
Bạn không thể đập ổ cắm của khách sạn đi xây lại, cũng không thể cắt cụt phích cắm máy sấy tóc. Thay vào đó, bạn ra chợ mua cái **Đầu chuyển đổi (Adapter)** nhét vào giữa.

### Dùng khi nào?
Khi bạn tích hợp một Thư viện bên thứ 3 (Thanh toán Stripe, PayPal) vào code cũ của bạn. Interface của thư viện không khớp với Interface hệ thống hiện tại. Hãy tạo ra lớp Wrapper/Adapter để chuyển đổi.

```java
// Máy sấy tóc (Code cũ của ta)
interface OCam2Lo { void cam2Lo(); }

// Ổ cắm khách sạn (Thư viện người khác)
class OCam3Chau { void cam3ChauVuong() { ... } }

// Đầu chuyển đổi (Adapter)
class Adapter implements OCam2Lo {
    private OCam3Chau oCam3Chau;
    
    // Khi ai đó cắm 2 lỗ, ta ngầm chuyển nó thành 3 lỗ
    public void cam2Lo() { oCam3Chau.cam3ChauVuong(); }
}
```

---

## 2. Decorator Pattern (Trang Trí Bao Bọc)

### Giải thích siêu dễ hiểu
Lại là câu chuyện **Trà sữa**.
Ly gốc là Trà sữa trân châu. 
Trời lạnh, bạn bảo nhân viên bọc thêm 1 lớp giấy giữ nhiệt (Lớp Decorator 1). 
Bạn mang về cho sếp, sếp đòi thắt nơ đỏ. Bạn bọc thêm 1 lớp ruy băng (Lớp Decorator 2).
Bản chất bên trong cùng vẫn là ly trà sữa, nhưng chức năng và vẻ bề ngoài của nó đã được "Bao bọc" và tăng cấp dần.

### Dùng khi nào?
Để thêm tính năng cho class mà không dùng Kế thừa (Inheritance). Kế thừa tạo ra một phả hệ class quá cứng nhắc và khổng lồ. Bọc (Decorator) lại linh hoạt xếp chồng lên nhau vô hạn.

> **💡 Ví dụ kinh điển:** Luồng đọc file của Java I/O.
> `new BufferedReader( new InputStreamReader( new FileInputStream("file.txt") ) )` 
> 👉 FileInputStream bị bọc 2 lần để có chức năng đọc theo từng Buffer.

---

## 3. Facade Pattern (Bức Mặt Tiền)

### Giải thích siêu dễ hiểu
Chữ "Facade" tiếng Pháp nghĩa là Bức bình phong/Mặt tiền.
Khi bạn vào xe Ô tô, bạn chỉ cần cắm chìa khóa, vặn và đạp ga. Xe chạy. 
Bạn không cần phải biết: Động cơ bơm xăng thế nào, bugi đánh lửa ra sao, hộp số chuyển số 1-2-3 như nào. Tất cả sự phức tạp đó bị che giấu đằng sau "Cái vô lăng và cái bàn đạp" (Facade).

### Dùng khi nào?
Khi bạn có một hệ thống (hoặc Microservices) quá lằng nhằng, chằng chịt các logic. Hãy tạo ra một class `Facade` duy nhất chứa 1 hàm duy nhất `xuLyDonHang()`, bên trong hàm đó gọi 10 class khác nhau tùy ý. Lập trình viên khác chỉ cần gọi class Facade của bạn là đủ xài.

---

## 4. Proxy Pattern (Kẻ Đóng Thế / Môi giới)

### Giải thích siêu dễ hiểu
Giống như **Thư ký của Giám đốc**.
Bất kỳ ai muốn gặp Giám đốc, hoặc nhờ Giám đốc ký giấy, đều phải đi qua tay Thư ký. 
Thư ký (Proxy) kiểm tra xem bạn có hẹn không, giấy tờ đủ không (Validate), nếu không đủ, Thư ký đá bạn ra ngoài ngay lập tức mà Giám đốc không hề hay biết.

### Dùng khi nào?
Để "ăn chặn" (intercept) ở giữa lời gọi hàm, nhằm kiểm tra quyền (Security), lưu log (Logging), hoặc tải chậm (Lazy Loading).

> **💡 Mẹo Phỏng vấn:** Trong Spring Boot, các tính năng `@Transactional` (Giao dịch database) hay `@Cacheable` (Bộ nhớ đệm) đều hoạt động dựa trên Proxy! Spring sẽ âm thầm tạo ra một Thư ký đứng che trước Class của bạn để tự động đóng/mở Transaction.

---

## Tóm tắt nhanh đi Phỏng vấn

| Pattern | Tóm tắt 1 câu | Ứng dụng thực tế |
|---------|---------|----------|
| **Adapter** | Đầu nối 3 chấu sang 2 chấu | Tích hợp Library bên thứ 3 |
| **Decorator** | Búp bê Nga (Bọc tính năng từ ngoài vào trong) | `BufferedReader` trong Java |
| **Facade** | Che giấu cỗ máy phức tạp sau 1 nút bấm | Gom 10 API gọi thành 1 hàm duy nhất |
| **Proxy** | Kẻ đứng giữa ăn chặn (Thư ký) | `@Transactional` của Spring |
