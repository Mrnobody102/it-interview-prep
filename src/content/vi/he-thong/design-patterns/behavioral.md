# Behavioral Patterns (Nhóm Hành vi)

## 1. Observer Pattern (Người theo dõi)

**Giải thích:** Giống như nút **Subscribe** trên Youtube. Khi kênh có video mới, tất cả người đăng ký sẽ nhận được thông báo tự động.

**Code minh họa:**
```java
// Subject (Kênh Youtube)
public class YoutubeChannel {
    private List<Subscriber> subs = new ArrayList<>();
    
    public void upload(String video) {
        for (Subscriber s : subs) s.update(video);
    }
}

// Observer (Người dùng)
interface Subscriber { void update(String video); }

class User implements Subscriber {
    public void update(String video) { System.out.println("Xem ngay: " + video); }
}
```

---

## 2. Strategy Pattern (Chiến lược)

**Giải thích:** Thay đổi thuật toán linh hoạt lúc đang chạy (Runtime). Giống như việc bạn chọn phương thức thanh toán (Momo, Visa, Zalopay) khi Checkout.

**Code minh họa:**
```java
interface PaymentStrategy { void pay(int amount); }

class MomoPayment implements PaymentStrategy { 
    public void pay(int amount) { System.out.println("Trả qua Momo: " + amount); } 
}

class ShoppingCart {
    private PaymentStrategy strategy;
    public void setStrategy(PaymentStrategy s) { this.strategy = s; }
    public void checkout(int amount) { strategy.pay(amount); }
}
```

---

## 3. Chain of Responsibility (Chuỗi trách nhiệm)

**Giải thích:** Request đi qua một chuỗi các "trạm gác". Ai xử lý được thì xử lý, không thì đẩy cho người tiếp theo. Ví dụ: Duyệt đơn xin nghỉ phép (Sếp trực tiếp -> Trưởng phòng -> Giám đốc).

**Ứng dụng thực tế:** `Filter` trong Spring Security. Request đi qua các filter kiểm tra Token, Spam, Quyền hạn trước khi vào Controller.

---

## 4. Mẹo phỏng vấn

| Pattern | Tóm tắt | Thực tế hay dùng |
|:---|:---|:---|
| **Observer** | 1 người nói, vạn người nghe | Event Listeners, Kafka, Pub/Sub |
| **Strategy** | Rút thẻ đổi chiêu linh hoạt | Chọn cổng thanh toán, Thuật toán sắp xếp |
| **Chain** | Chuyền bóng qua từng trạm | Spring Filter, Middleware, Xử lý Exception |
