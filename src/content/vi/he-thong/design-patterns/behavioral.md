# Behavioral Patterns (Nhóm Hành vi)

## Tổng quan
Nhóm này giải quyết câu hỏi: **"Các Object nói chuyện với nhau như thế nào để hệ thống không bị rối rắm?"**

---

## 1. Observer Pattern (Kẻ Quan Sát)

### Giải thích siêu dễ hiểu
Giống hệt nút **"Theo dõi" (Subscribe)** kênh YouTube.
- **Subject (YouTube Channel):** Kênh phát sóng.
- **Observer (Bạn):** Người đăng ký nhận thông báo.
Mỗi khi có Video mới, YouTube sẽ tự động bắn thông báo cho 1 triệu người đăng ký cùng lúc, thay vì mỗi ngày bạn phải tự vào kênh kiểm tra xem có video mới chưa.

### Dùng khi nào?
Khi một sự kiện xảy ra cần thông báo cho N nơi khác, nhưng bạn không muốn code "cứng" N nơi đó vào class chính.

### Trong Spring Boot
Bạn dùng suốt ngày với `@EventListener` và `ApplicationEventPublisher`.

```java
// Subject: Đăng video
@Service
public class YoutubeChannel {
    @Autowired private ApplicationEventPublisher publisher;

    public void uploadVideo(String title) {
        publisher.publishEvent(new NewVideoEvent(this, title));
    }
}

// Observer: Điện thoại nhận thông báo
@Component
public class PhoneNotification {
    @EventListener
    public void onNewVideo(NewVideoEvent event) {
        System.out.println("Ting ting! Có video mới: " + event.getTitle());
    }
}
```

---

## 2. Strategy Pattern (Chiến lược)

### Giải thích siêu dễ hiểu
Bạn đi từ nhà lên công ty. Tùy thuộc vào thời tiết mà bạn chọn phương tiện:
- Nắng: Đi xe máy
- Mưa: Đi Taxi
- Tắc đường: Đi bộ
Đích đến không đổi, nhưng **"chiến lược đi"** thay đổi linh hoạt lúc bạn ra khỏi nhà (runtime).

### Dùng khi nào?
Để giết chết đống `if-else` hoặc `switch-case` khổng lồ. Rất hay dùng cho việc chọn Phương thức thanh toán (Visa, Momo, ZaloPay).

```java
interface PaymentStrategy { void pay(int amount); }

class MomoPayment implements PaymentStrategy { ... }
class VisaPayment implements PaymentStrategy { ... }

class ShoppingCart {
    private PaymentStrategy strategy; // Lắp chiến lược vào đây
    
    // Giao việc cho chiến lược xử lý
    void checkout(int amount) { strategy.pay(amount); }
}
```

---

## 3. Chain of Responsibility Pattern (Chuỗi Trách Nhiệm)

### Giải thích siêu dễ hiểu
Giống hệt **Quy trình xin nghỉ phép**.
- Nghỉ 1 ngày: Xin sếp trực tiếp duyệt.
- Nghỉ 3 ngày: Sếp trực tiếp ký nháy -> Chuyển lên Trưởng phòng duyệt.
- Nghỉ 1 tháng: Chuyển tờ đơn từ Sếp trực tiếp -> Trưởng phòng -> Giám đốc.
Tờ đơn (Request) sẽ đi qua một dây chuyền, ai đủ thẩm quyền thì duyệt, không đủ thì đẩy lên tay người tiếp theo.

### Dùng khi nào?
Khi bạn code `Filter` chặn request trong Spring Security. 
Request đi qua Filter 1 (Chống Spam) -> Filter 2 (Kiểm tra Token) -> Filter 3 (Kiểm tra Quyền hạn) -> Controller.

---

## 4. State Pattern (Trạng thái)

### Giải thích siêu dễ hiểu
Con người khi vui thì hiền lành, khi đói thì cáu gắt. Rõ ràng là cùng một con người, nhưng **hành vi** thay đổi hoàn toàn tùy theo **trạng thái (state)** hiện tại.

### Dùng khi nào?
Dùng để quản lý vòng đời của Đơn Hàng (Chờ xử lý -> Đang giao -> Hoàn thành). Thay vì viết một cái `if(state == "DANG_GIAO")` khổng lồ, ta tạo ra các class `StateDangGiao`, `StateHoanThanh` riêng biệt.

---

## Tóm tắt nhanh đi Phỏng vấn

| Pattern | Tóm tắt 1 câu | Ứng dụng thực tế |
|---------|---------|----------|
| **Observer** | 1 người nói, vạn người nghe | Nút Subscribe, Event Listener |
| **Strategy** | Rút thẻ đổi chiêu linh hoạt | Chọn cổng thanh toán (MoMo/VNPay) |
| **Chain of Resp.** | Tờ đơn chạy qua nhiều cửa | Spring Security Filter |
| **State** | Thái độ đổi theo tâm trạng | Vòng đời đơn hàng (Chờ/Giao/Xong) |
