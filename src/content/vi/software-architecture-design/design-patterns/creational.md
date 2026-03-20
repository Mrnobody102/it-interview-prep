# Creational Design Patterns

Creational patterns giải quyết vấn đề **khởi tạo đối tượng** một cách linh hoạt và hiệu quả.

## Singleton

### Khái niệm

Đảm bảo class chỉ có **một instance duy nhất** trong toàn bộ ứng dụng.

### Trong Spring Boot

Mặc định mọi Spring Bean đều là **singleton** — chỉ có một instance được tạo và chia sẻ.

```java
@Configuration
public class AppConfig {
    @Bean
    public MyService myService() {
        return new MyService(); // singleton by default
    }
}
```

### Cách implement thủ công

```java
public class Singleton {
    private static final Singleton INSTANCE = new Singleton();
    private Singleton() {}
    public static Singleton getInstance() { return INSTANCE; }
}
```

## Builder

### Khái niệm

Tạo object phức tạp theo **từng bước**, tránh constructor dài với nhiều tham số.

### Ví dụ

```java
// Lombok
@Data @Builder
class User {
    private String name;
    private int age;
    private String email;
}

User user = User.builder()
    .name("Huy")
    .age(25)
    .email("huy@example.com")
    .build();
```

### So với Factory Method

| Builder | Factory Method |
|---------|---------------|
| Tạo object phức tạp bước-by-step | Tạo object qua inheritance |
| Fluent interface | Tạo một lần |
| Mutable/Immutable đều được | Thường dùng cho immutable |

## Factory Method

### Khái niệm

Cho **subclass** quyết định tạo đối tượng nào, tăng tính linh hoạt.

```java
interface DocumentFactory {
    Document createDocument();
}

class PdfFactory implements DocumentFactory {
    public Document createDocument() { return new PdfDocument(); }
}

class WordFactory implements DocumentFactory {
    public Document createDocument() { return new WordDocument(); }
}
```

## Abstract Factory

### Khái niệm

Tạo **nhóm đối tượng liên quan** mà không chỉ rõ lớp cụ thể.

### Ví dụ

```java
interface GUIFactory {
    Button createButton();
    Checkbox createCheckbox();
}

class WindowsFactory implements GUIFactory {
    public Button createButton() { return new WindowsButton(); }
    public Checkbox createCheckbox() { return new WindowsCheckbox(); }
}

class MacFactory implements GUIFactory {
    public Button createButton() { return new MacButton(); }
    public Checkbox createCheckbox() { return new MacCheckbox(); }
}
```

## Prototype

### Khái niệm

Tạo object mới bằng cách **sao chép** từ prototype.

### Trong Java

```java
class Shape implements Cloneable {
    public Shape clone() {
        try { return (Shape) super.clone(); }
        catch (CloneNotSupportedException e) { return null; }
    }
}
```

### Trong Spring

```java
@Component
@Scope("prototype")
public class BeanScopePrototype {
    // Mỗi lần getBean() tạo instance mới
}
```

## So sánh

| Pattern | Mục đích | Khi nào dùng |
|---------|---------|-------------|
| Singleton | Một instance duy nhất | Config, Logger, Connection pool |
| Builder | Tạo object phức tạp step-by-step | Object có nhiều tham số tùy chọn |
| Factory Method | Delegate việc tạo cho subclass | Cần flexibility về class cụ thể |
| Abstract Factory | Tạo family of related objects | Hệ thống cần làm việc với nhiều platform/theme |
| Prototype | Clone object thay vì tạo mới | Tạo object có chi phí cao, hoặc tránh subclass explosion |
