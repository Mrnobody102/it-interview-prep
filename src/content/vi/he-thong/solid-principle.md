# SOLID Principles - Nguyên tắc thiết kế hướng đối tượng

## 1. Tổng quan

**SOLID** là 5 nguyên tắc thiết kế hướng đối tượng giúp code trở nên **dễ bảo trì** (maintainable), **dễ mở rộng** (extendable), **dễ tái sử dụng** (reusable) và **ít lỗi** (less buggy). Được đề xuất bởi **Robert C. Martin** (Uncle Bob).

| Chữ | Nguyên tắc | Ý chính |
|-----|-----------|---------|
| **S** | Single Responsibility Principle | Mỗi class có một trách nhiệm duy nhất |
| **O** | Open/Closed Principle | Mở rộng chức năng mà không sửa code cũ |
| **L** | Liskov Substitution Principle | Subclass thay thế được superclass |
| **I** | Interface Segregation Principle | Interface nhỏ, cụ thể thay vì lớn, chung chung |
| **D** | Dependency Inversion Principle | Phụ thuộc abstraction, không phải concrete class |

---

## 2. S - Single Responsibility Principle (SRP)

### 2.1. Nguyên tắc

> Một class chỉ có **một lý do duy nhất** để thay đổi.

Mỗi class nên chỉ làm **một việc** và làm tốt việc đó. Nếu một class có nhiều hơn một lý do để thay đổi, nó đang vi phạm SRP.

### 2.2. Ví dụ vi phạm SRP

```java
// ❌ Vi phạm SRP — class làm quá nhiều việc, có nhiều lý do thay đổi
class UserManager {
    void saveUser(User user) { /* lưu DB */ }
    void sendEmail(User user) { /* gửi email */ }
    void generateReport(User user) { /* tạo report */ }
    void validateUser(User user) { /* validate */ }
    void logActivity(User user) { /* ghi log */ }
    void exportToPDF(User user) { /* export PDF */ }

    // Lý do 1: Thay đổi cách lưu trữ (DB schema)
    // Lý do 2: Thay đổi cách gửi email (SMTP provider)
    // Lý do 3: Thay đổi format report
    // Lý do 4: Thay đổi validation rules
    // Lý do 5: Thay đổi logging format
    // Lý do 6: Thay đổi export format
}
```

### 2.3. Tuân thủ SRP

```java
// ✅ Tuân thủ SRP — mỗi class một trách nhiệm duy nhất

// Class chỉ lo việc lưu trữ
class UserRepository {
    private final EntityManager em;

    UserRepository(EntityManager em) { this.em = em; }

    void save(User user) {
        em.persist(user);
    }

    Optional<User> findById(Long id) {
        return Optional.ofNullable(em.find(User.class, id));
    }

    List<User> findAll() {
        return em.createQuery("SELECT u FROM User u", User.class).getResultList();
    }
}

// Class chỉ lo việc gửi email
class EmailService {
    private final JavaMailSender mailSender;

    EmailService(JavaMailSender mailSender) { this.mailSender = mailSender; }

    void sendWelcomeEmail(User user) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(user.getEmail());
        message.setSubject("Welcome!");
        message.setText("Hello " + user.getName());
        mailSender.send(message);
    }
}

// Class chỉ lo việc tạo report
class ReportGenerator {
    Report generateUserReport(User user) {
        return new Report(user.getName(), user.getEmail(), LocalDateTime.now());
    }
}

// Class chỉ lo việc validate
class UserValidator {
    void validate(User user) {
        if (user.getName() == null || user.getName().isBlank()) {
            throw new ValidationException("Name is required");
        }
        if (user.getEmail() == null || !user.getEmail().contains("@")) {
            throw new ValidationException("Invalid email");
        }
    }
}
```

### 2.4. Dấu hiệu vi phạm SRP

| Dấu hiệu | Mô tả |
|---------|-------|
| Class quá lớn | Hàng trăm dòng code |
| Nhiều responsibility | Một class làm nhiều việc không liên quan |
| Thay đổi thường xuyên | Class phải sửa vì nhiều lý do khác nhau |
| Khó test | Khó viết unit test vì quá nhiều dependencies |

---

## 3. O - Open/Closed Principle (OCP)

### 3.1. Nguyên tắc

> **Open for extension**, **closed for modification**.
> Thiết kế class để có thể **mở rộng** (thêm tính năng mới) mà **không cần sửa** code hiện có.

### 3.2. Ví dụ vi phạm OCP

```java
// ❌ Vi phạm OCP — mỗi khi thêm payment method mới phải sửa class này
class PaymentProcessor {
    void processPayment(Order order, String paymentType) {
        if ("CREDIT_CARD".equals(paymentType)) {
            // Xử lý credit card
        } else if ("PAYPAL".equals(paymentType)) {
            // Xử lý PayPal
        } else if ("BANK_TRANSFER".equals(paymentType)) {
            // Xử lý bank transfer
        }
        // Thêm method mới? Phải sửa code ở đây!
    }
}
```

### 3.3. Tuân thủ OCP

```java
// ✅ Tuân thủ OCP — dùng interface để mở rộng không cần sửa code cũ

// Interface mở rộng được
interface PaymentMethod {
    void pay(Money amount);
    PaymentStatus getStatus();
}

// Các implementation cụ thể
class CreditCardPayment implements PaymentMethod {
    @Override
    public void pay(Money amount) {
        // Gọi payment gateway
    }
    @Override
    public PaymentStatus getStatus() {
        return PaymentStatus.SUCCESS;
    }
}

class PayPalPayment implements PaymentMethod {
    @Override
    public void pay(Money amount) {
        // Gọi PayPal API
    }
    @Override
    public PaymentStatus getStatus() {
        return PaymentStatus.PENDING;
    }
}

class BankTransferPayment implements PaymentMethod {
    @Override
    public void pay(Money amount) {
        // Gọi bank API
    }
    @Override
    public PaymentStatus getStatus() {
        return PaymentStatus.PROCESSING;
    }
}

// PaymentProcessor không cần sửa khi thêm payment method mới!
class PaymentProcessor {
    private final PaymentMethod paymentMethod;

    PaymentProcessor(PaymentMethod paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    Receipt processPayment(Order order) {
        Money total = order.calculateTotal();
        paymentMethod.pay(total);
        return new Receipt(order.getId(), paymentMethod.getStatus());
    }
}

// Thêm method mới — chỉ cần implement interface
class CryptoPayment implements PaymentMethod {
    @Override
    public void pay(Money amount) {
        // Xử lý crypto payment
    }
    @Override
    public PaymentStatus getStatus() {
        return PaymentStatus.SUCCESS;
    }
}
```

### 3.4. Strategy Pattern

OCP thường được implement qua **Strategy Pattern** — đóng gói các thuật toán có thể thay thế cho nhau:

```java
// Strategy Interface
interface DiscountStrategy {
    Money applyDiscount(Money originalPrice);
}

// Concrete Strategies
class NoDiscount implements DiscountStrategy {
    @Override
    public Money applyDiscount(Money originalPrice) {
        return originalPrice;
    }
}

class PercentageDiscount implements DiscountStrategy {
    private final double percentage;

    PercentageDiscount(double percentage) { this.percentage = percentage; }

    @Override
    public Money applyDiscount(Money originalPrice) {
        return originalPrice.multiply(1 - percentage / 100.0);
    }
}

class FixedDiscount implements DiscountStrategy {
    private final Money discountAmount;

    FixedDiscount(Money discountAmount) { this.discountAmount = discountAmount; }

    @Override
    public Money applyDiscount(Money originalPrice) {
        return originalPrice.subtract(discountAmount);
    }
}

// Context — không cần sửa khi thêm discount strategy mới
class PriceCalculator {
    private final DiscountStrategy discountStrategy;

    PriceCalculator(DiscountStrategy discountStrategy) {
        this.discountStrategy = discountStrategy;
    }

    Money calculatePrice(Money basePrice) {
        return discountStrategy.applyDiscount(basePrice);
    }
}
```

---

## 4. L - Liskov Substitution Principle (LSP)

### 4.1. Nguyên tắc

> Subclass (lớp con) phải có thể **thay thế được** superclass (lớp cha) mà **không làm hỏng** chương trình.

Nói cách khác: nếu class `B` extends `A`, thì mọi nơi dùng `A` đều có thể dùng `B` mà không gây lỗi.

### 4.2. Ví dụ vi phạm LSP

```java
// ❌ Vi phạm LSP — Penguin extends Bird nhưng không thể bay
class Bird {
    void fly() {
        System.out.println("Flying");
    }
}

// Penguin không thể bay, nhưng vẫn extends Bird
class Penguin extends Bird {
    @Override
    void fly() {
        throw new UnsupportedOperationException("Penguins can't fly!");
    }
}

// Code dùng Bird không thể dùng Penguin mà không bị crash
void makeBirdFly(Bird bird) {
    bird.fly(); // ❌ Penguin sẽ throw exception!
}
```

### 4.3. Tuân thủ LSP

```java
// ✅ Tuân thủ LSP — chia thành interface phù hợp

// Interface cho loài bay được
interface FlyingBird {
    void fly();
}

// Interface cho tất cả loài chim
interface Bird {
    String getName();
}

// Loài bay được — implement FlyingBird
class Eagle implements Bird, FlyingBird {
    @Override
    public String getName() { return "Eagle"; }
    @Override
    public void fly() { System.out.println("Eagle soars high"); }
}

class Sparrow implements Bird, FlyingBird {
    @Override
    public String getName() { return "Sparrow"; }
    @Override
    public void fly() { System.out.println("Sparrow flutters"); }
}

// Loài không bay được — chỉ implement Bird
class Penguin implements Bird {
    @Override
    public String getName() { return "Penguin"; }
    // Không implement FlyingBird — hoàn toàn hợp lý!
}

// Code dùng FlyingBird an toàn với mọi implementation
void makeBirdFly(FlyingBird bird) {
    bird.fly(); // ✅ Mọi bird ở đây đều có thể bay
}

// Code dùng Bird an toàn với mọi loài chim
void printBirdName(Bird bird) {
    System.out.println(bird.getName()); // ✅ Mọi bird đều có name
}
```

### 4.4. LSP Checklist

| Điều kiện | Mô tả |
|-----------|-------|
| **Preconditions không được mạnh hơn** | Subclass không được yêu cầu nhiều hơn superclass |
| **Postconditions không được yếu hơn** | Subclass không được đảm bảo ít hơn superclass |
| **Invariants phải giữ nguyên** | Tính bất biến của object phải được bảo toàn |
| **Không throw unexpected exceptions** | Subclass không ném exception không có trong superclass |

```java
// ❌ Vi phạm: Subclass tăng precondition
class Rectangle {
    void setWidth(double width) { this.width = width; }
    void setHeight(double height) { this.height = height; }
}

class Square extends Rectangle {
    @Override
    void setWidth(double width) {
        // Tăng precondition — yêu cầu width == height
        super.setWidth(width);
        super.setHeight(width); // Side effect không mong muốn
    }
    // Code dùng Rectangle dùng Square sẽ bị unexpected behavior
}

// ✅ Tuân thủ: Tách thành 2 class riêng, không inherit
class Rectangle { /* ... */ }
class Square { /* ... */ }
```

---

## 5. I - Interface Segregation Principle (ISP)

### 5.1. Nguyên tắc

> Không nên ép class implement interface có method **mà nó không dùng đến**.
> Chia interface lớn, chung chung thành nhiều interface nhỏ, cụ thể.

### 5.2. Ví dụ vi phạm ISP

```java
// ❌ Vi phạm ISP — MultifunctionPrinter phải implement tất cả
interface Machine {
    void print();
    void scan();
    void fax();
    void photocopy();
}

// SimplePrinter chỉ cần print nhưng phải implement tất cả
class SimplePrinter implements Machine {
    @Override
    public void print() { /* in ấn */ }
    @Override
    public void scan() { throw new UnsupportedOperationException(); }
    @Override
    public void fax() { throw new UnsupportedOperationException(); }
    @Override
    public void photocopy() { throw new UnsupportedOperationException(); }
}

// => Code smell: nhiều method không dùng, dễ quên throw exception
```

### 5.3. Tuân thủ ISP

```java
// ✅ Tuân thủ ISP — chia nhỏ interface

// Interface nhỏ, cụ thể
interface Printer {
    void print(Document document);
}

interface Scanner {
    Document scan();
}

interface Fax {
    void fax(Document document, String recipient);
}

interface Copier {
    void photocopy(Document document);
}

// SimplePrinter chỉ implement những gì cần
class SimplePrinter implements Printer {
    @Override
    public void print(Document document) {
        System.out.println("Printing: " + document.getTitle());
    }
}

// AllInOnePrinter implement tất cả
class AllInOnePrinter implements Printer, Scanner, Fax, Copier {
    @Override
    public void print(Document document) { /* ... */ }
    @Override
    public Document scan() { /* ... */ return null; }
    @Override
    public void fax(Document document, String recipient) { /* ... */ }
    @Override
    public void photocopy(Document document) { /* ... */ }
}

// Scanner-only device
class PhotoScanner implements Scanner {
    @Override
    public Document scan() { /* ... */ return null; }
}
```

### 5.4. So sánh OCP và ISP

| Nguyên tắc | Tập trung vào | Giải pháp |
|-----------|-------------|-----------|
| **OCP** | Mở rộng behavior | Tách behavior ra interface |
| **ISP** | Thu hẹp interface | Chia interface lớn thành nhỏ |

---

## 6. D - Dependency Inversion Principle (DIP)

### 6.1. Nguyên tắc

> **High-level modules** (class xử lý nghiệp vụ) không nên phụ thuộc **low-level modules** (class thực hiện chi tiết).
> Cả hai nên phụ thuộc **abstraction** (interface/abstract class).

Hệ quả: Abstractions không nên phụ thuộc Details. Details nên phụ thuộc Abstractions.

### 6.2. Ví dụ vi phạm DIP

```java
// ❌ Vi phạm DIP — OrderService phụ thuộc trực tiếp vào concrete class
class OrderService {
    // Phụ thuộc cụ thể vào MySQL
    private MySQLRepository repo = new MySQLRepository();

    void saveOrder(Order order) {
        repo.insert(order); // Không thể thay thế bằng MongoDB
    }
}

// => Muốn đổi sang MongoDB? Phải sửa OrderService
```

### 6.3. Tuân thủ DIP

```java
// ✅ Tuân thủ DIP — phụ thuộc interface (abstraction)

// Abstraction (high-level concept)
interface OrderRepository {
    void save(Order order);
    Optional<Order> findById(Long id);
    List<Order> findAll();
}

// Low-level implementation 1
class MySQLOrderRepository implements OrderRepository {
    private final EntityManager em;

    MySQLOrderRepository(EntityManager em) { this.em = em; }

    @Override
    public void save(Order order) { em.persist(order); }
    @Override
    public Optional<Order> findById(Long id) { return Optional.ofNullable(em.find(Order.class, id)); }
    @Override
    public List<Order> findAll() { return em.createQuery("SELECT o FROM Order o", Order.class).getResultList(); }
}

// Low-level implementation 2
class MongoDBOrderRepository implements OrderRepository {
    private final MongoTemplate mongoTemplate;

    MongoDBOrderRepository(MongoTemplate mongoTemplate) { this.mongoTemplate = mongoTemplate; }

    @Override
    public void save(Order order) { mongoTemplate.save(order); }
    @Override
    public Optional<Order> findById(Long id) { return Optional.ofNullable(mongoTemplate.findById(id, Order.class)); }
    @Override
    public List<Order> findAll() { return mongoTemplate.findAll(Order.class); }
}

// High-level module — chỉ phụ thuộc abstraction
class OrderService {
    private final OrderRepository orderRepository;

    // DI qua constructor — IoC Container sẽ tiêm implementation cụ thể
    OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    void placeOrder(Order order) {
        validateOrder(order);
        orderRepository.save(order);
        sendConfirmation(order);
    }

    private void validateOrder(Order order) {
        if (order.getItems().isEmpty()) {
            throw new IllegalArgumentException("Order must have items");
        }
    }

    private void sendConfirmation(Order order) {
        // ...
    }
}

// Configuration — quyết định dùng implementation nào
@Configuration
class AppConfig {
    @Bean
    public OrderRepository orderRepository(DataSource dataSource) {
        // Có thể đổi sang MongoDBOrderRepository chỉ bằng sửa ở đây
        return new MySQLOrderRepository(dataSource);
    }

    @Bean
    public OrderService orderService(OrderRepository orderRepository) {
        return new OrderService(orderRepository);
    }
}
```

---

## 7. Tổng kết và mối quan hệ

### 7.1. Bảng tổng hợp

| Chữ | Nguyên tắc | Gốc tiếng Anh | Hành động |
|-----|-----------|--------------|-----------|
| **S** | Single Responsibility | *"Do one thing, do it well"* | Chia class lớn thành nhiều class nhỏ |
| **O** | Open/Closed | *"Open for extension, closed for modification"* | Dùng interface/abstract class |
| **L** | Liskov Substitution | *"Subclasses must be substitutable for their base classes"* | Đảm bảo subclass thay thế được base class |
| **I** | Interface Segregation | *"Prefer small, specific interfaces"* | Chia interface lớn thành nhỏ |
| **D** | Dependency Inversion | *"Depend on abstractions, not concretions"* | Phụ thuộc interface, không phải class cụ thể |

### 7.2. Mối quan hệ giữa các nguyên tắc

```
SRP ──────► Giúp ISP
   └──► Giúp OCP (class có SRP dễ mở rộng)

LSP ──────► Điều kiện tiên quyết cho OCP
   └──► Nếu LSP vi phạm, OCP sẽ bị phá vỡ khi thêm subclass

ISP ──────► Giúp DIP
   └──► Interface nhỏ dễ implement, giảm coupling

DIP ──────► Giúp OCP
   └──► High-level phụ thuộc abstraction → dễ thêm implementation mới
```

### 7.3. Quy tắc đọc ngược từ D → S

| Từ dưới lên (implementation) | Lên trên (abstraction) |
|------------------------------|------------------------|
| **D** — Phụ thuộc interface | |
| **I** — Interface nhỏ, cụ thể | |
| **L** — Subclass thay thế được | |
| **O** — Mở rộng bằng subclass | |
| **S** — Mỗi class một trách nhiệm | |

> **Tip nhớ**: *"[S]olid [I]s [L]ike [O]pen [S]ource [D]evelopment"* — SOLID như một hệ thống phân cấp từ low-level details (D) lên high-level design (S).
