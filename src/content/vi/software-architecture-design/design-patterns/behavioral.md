# Behavioral Design Patterns

Behavioral patterns giải quyết vấn đề **giao tiếp và phân chia trách nhiệm** giữa các đối tượng.

## Observer Pattern

### Khái niệm

Cho phép một đối tượng (**Subject**) thông báo thay đổi đến nhiều **Observer** khi có sự kiện.

### Ví dụ

Khi bạn đăng ký nhận thông báo trên Facebook: mỗi khi có post mới, tất cả người theo dõi đều nhận được thông báo.

### Trong Spring

```java
// Subject
@Service
public class OrderService {
    @Autowired private ApplicationEventPublisher publisher;

    public void placeOrder(Order order) {
        // xử lý đơn hàng
        publisher.publishEvent(new OrderPlacedEvent(this, order));
    }
}

// Observer
@Component
public class EmailNotificationListener {
    @EventListener
    public void onOrderPlaced(OrderPlacedEvent event) {
        // gửi email xác nhận
    }
}
```

## Strategy Pattern

### Khái niệm

Cho phép thay đổi thuật toán/hành vi tại **runtime** mà không cần thay đổi mã nguồn của đối tượng đó.

### Ví dụ

Chọn nhiều phương thức thanh toán khác nhau (thẻ, chuyển khoản, ví điện tử) mà không cần thay đổi code đặt hàng.

```java
interface PaymentStrategy {
    void pay(double amount);
}

class CreditCardPayment implements PaymentStrategy { /* ... */ }
class PayPalPayment implements PaymentStrategy { /* ... */ }

class ShoppingCart {
    private PaymentStrategy strategy;
    void checkout() { strategy.pay(total); }
}
```

## Template Method Pattern

### Khái niệm

Định nghĩa **skeleton** của một thuật toán, cho phép subclass override các bước cụ thể mà không thay đổi cấu trúc tổng thể.

### Ví dụ

Quy trình chuẩn bị đồ uống: đun nước → pha → rót → thêm topping. Các loại đồ uống thay đổi ở bước "pha".

```java
abstract class BeverageTemplate {
    final void prepare() {
        boilWater();
        brew();        // subclass override
        pourInCup();
        addCondiments(); // subclass override
    }
    abstract void brew();
    abstract void addCondiments();
}
```

## Chain of Responsibility Pattern

### Khái niệm

Gửi yêu cầu dọc theo **chuỗi handler**. Mỗi handler quyết định xử lý hoặc chuyển tiếp.

### Ví dụ

- Duyệt đơn từ: nhân viên → trưởng phòng → giám đốc.
- Servlet Filters trong Java Web.
- **Spring Security Filter Chain**.

```java
interface Handler {
    Handler setNext(Handler next);
    void handle(Request request);
}

class AuthHandler implements Handler {
    public void handle(Request request) {
        if (!authenticate(request)) return; // pass to next
        next.handle(request);
    }
}
```

## Command Pattern

### Khái niệm

Đóng gói request thành **object**. Cho phép queue, log, undo/redo.

### Ví dụ

- Undo/Redo operations trong editor.
- Scheduling tasks.

```java
interface Command {
    void execute();
    void undo();
}

class AddCommand implements Command {
    public void execute() { list.add(item); }
    public void undo() { list.remove(item); }
}
```

## State Pattern

### Khái niệm

Object thay đổi behavior khi **internal state** thay đổi.

### Ví dụ

Trạng thái đơn hàng: New → Processing → Shipped → Delivered.

```java
interface OrderState {
    void next(OrderContext context);
    String getStatus();
}

class NewOrderState implements OrderState { /* ... */ }
class ShippedOrderState implements OrderState { /* ... */ }
```

## Mediator Pattern

### Khái niệm

Định nghĩa object đóng gói cách nhiều objects giao tiếp, **giảm coupling** giữa các đối tượng.

### Ví dụ

- Controller trong MVC là mediator giữa Model và View.
- UI Dialog là mediator giữa các Button, TextField.

## So sánh nhanh

| Pattern | Mục đích | Use case |
|---------|---------|----------|
| Observer | Thông báo thay đổi | Event listener, subscribe |
| Strategy | Thay đổi thuật toán | Payment, sorting |
| Template Method | Khung algorithm | Data processing pipeline |
| Chain of Responsibility | Pass request along chain | Filters, handlers |
| Command | Đóng gói request | Undo, queue, scheduler |
| State | Thay đổi theo state | State machine |
| Mediator | Trung gian giao tiếp | UI dialog, Controller |
