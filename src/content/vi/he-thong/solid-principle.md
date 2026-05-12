# SOLID Principles (5 Nguyên lý Vàng)

## Tổng quan
**SOLID** không chỉ là mớ lý thuyết suông dùng để "vượt ải" phỏng vấn. Trong thực tế, đây là bộ quy tắc sống còn giúp code của bạn không trở thành một "đống rác" (Spaghetti code) sau vài tháng phát triển. 

Người nắm vững SOLID sẽ viết ra những hệ thống mà khi cần thêm tính năng mới, họ chỉ việc "lắp ghép" thêm thay vì phải "đập đi xây lại".

---

## 1. S - Single Responsibility Principle (Nguyên lý Đơn nhiệm)
> **Triết lý:** Một Class chỉ nên giữ **một trách nhiệm duy nhất**. Nếu bạn sửa code vì nhiều lý do khác nhau, nghĩa là Class đó đang làm quá nhiều việc.

**❌ Sai:** Một class `ReportManager` vừa tính lương, vừa tạo file PDF, vừa gửi Email. Nếu sếp muốn đổi định dạng PDF, bạn sửa class này. Nếu sếp muốn đổi nhà cung cấp Email, bạn cũng lại phải vào đây sửa.
```java
public class ReportManager {
    public void calculateSalary() { /* Logic tính toán phức tạp */ }
    public void generatePdf() { /* Logic render PDF */ }
    public void sendEmail() { /* Logic kết nối Mail Server */ }
}
```

**✅ Đúng:** Tách ra thành các class chuyên biệt.
```java
class SalaryCalculator { ... }
class PdfGenerator { ... }
class EmailSender { ... }
```
👉 **Góc nhìn phỏng vấn:** Việc tách nhỏ giúp code dễ Unit Test hơn hẳn. Bạn có thể test riêng logic tính lương mà không cần quan tâm đến PDF hay Email.

---

## 2. O - Open/Closed Principle (Nguyên lý Đóng/Mở)
> **Triết lý:** Mở rộng tính năng bằng cách **viết thêm code mới**, đừng sửa code cũ đang chạy ổn định.

**❌ Sai:** Dùng `if-else` hoặc `switch-case` để kiểm tra loại thanh toán. Cứ mỗi lần công ty ký hợp đồng với một ví điện tử mới (ZaloPay, ViettelPay), bạn lại phải vào hàm `process` để "nhồi" thêm `if-else`.
```java
public void processPayment(String type) {
    if (type.equals("VISA")) { ... }
    else if (type.equals("MOMO")) { ... }
}
```

**✅ Đúng:** Dùng Interface.
```java
interface PaymentMethod { void pay(int amount); }

class VisaPayment implements PaymentMethod { public void pay(int amount) { ... } }
class MomoPayment implements PaymentMethod { public void pay(int amount) { ... } }

// Khi cần thêm ZaloPay, bạn chỉ việc tạo class mới implements PaymentMethod. 
// Code cũ vẫn giữ nguyên, không sợ "râu ông nọ chắp cằm bà kia".
```

---

## 3. L - Liskov Substitution Principle (Nguyên lý Thay thế)
> **Triết lý:** Class con phải có thể thay thế class cha mà không làm hỏng chương trình.

**Ví dụ kinh điển: Chim cánh cụt và Chim bay.**
Nếu bạn có class cha `Bird` có hàm `fly()`, rồi cho `Penguin` kế thừa `Bird`. Vì chim cánh cụt không biết bay, bạn buộc phải quăng ra một lỗi `UnsupportedOperationException`.

**Hệ quả:** Nếu một đoạn code khác đang duyệt danh sách các con chim và bảo chúng `fly()`, khi gặp con chim cánh cụt, chương trình của bạn sẽ **sập**. Đó là vi phạm LSP.

**✅ Giải pháp:** Đừng bắt con chim cánh cụt làm việc nó không thể. Hãy tách khả năng bay ra một Interface `Flyable`. Chỉ những con chim nào biết bay mới thực hiện Interface đó.

---

## 4. I - Interface Segregation Principle (Nguyên lý Phân tách Interface)
> **Triết lý:** Đừng ép một Class phải thực hiện những hàm mà nó không cần dùng tới.

**❌ Sai:** Một Interface `SmartWorker` có cả `work()` và `eat()`. Khi bạn tạo một `RobotWorker`, bạn vẫn phải viết code rỗng cho hàm `eat()` vì Robot đâu có biết ăn. Điều này làm "rác" code và gây hiểu lầm.

**✅ Đúng:** Tách thành 2 Interface nhỏ: `Workable` và `Eatable`. Robot chỉ cần quan tâm đến `Workable`.

---

## 5. D - Dependency Inversion Principle (Đảo ngược phụ thuộc)
> **Triết lý:** Các module cấp cao không nên phụ thuộc vào module cấp thấp. Cả hai nên phụ thuộc vào **Interface (Abstractions)**.

**❌ Sai:** Class `NotificationService` trực tiếp khởi tạo `GmailService`. Nếu sau này muốn đổi sang `SendGrid`, bạn phải sửa lại toàn bộ code bên trong `NotificationService`.
```java
public class NotificationService {
    private GmailService gmail = new GmailService(); // Dính chặt vào Gmail
}
```

**✅ Đúng:** Dùng Dependency Injection.
```java
public class NotificationService {
    private MessageService messageService; // Phụ thuộc vào Interface

    public NotificationService(MessageService service) { 
        this.messageService = service; 
    }
}
```
👉 **Góc nhìn phỏng vấn:** Đây chính là nền tảng của **Spring IoC/DI**. Nó giúp hệ thống cực kỳ linh hoạt và dễ dàng Mock dữ liệu khi viết Test.

---

## 6. Câu hỏi phỏng vấn "Thực chiến"

> **Q: "Em có áp dụng SOLID cho tất cả mọi dự án không?"**
>
> **Trả lời:** "Dạ không. SOLID là một công cụ mạnh nhưng không miễn phí. Nó làm tăng số lượng class và interface, khiến cấu trúc project trở nên phức tạp hơn. 
> - Với các dự án **Startup/Prototype** cần chạy cực nhanh để kiểm chứng thị trường, việc áp dụng cứng nhắc SOLID sẽ là **Over-engineering**.
> - Em chỉ áp dụng khi dự án xác định sẽ **phát triển lâu dài**, có nhiều người cùng tham gia và cần khả năng bảo trì, mở rộng tốt."

---

## Tóm tắt nhanh
- **S:** Mỗi ông 1 việc.
- **O:** Muốn thêm thì viết mới, đừng sửa cũ.
- **L:** Con không được làm hỏng việc của cha.
- **I:** Cần gì dùng nấy, đừng ép nhau.
- **D:** Đừng gọi trực tiếp, hãy gọi qua "trung gian" (Interface).
