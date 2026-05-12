# Creational Patterns (Nhóm Khởi tạo)

## 1. Singleton (Độc tôn)

**Giải thích:** Đảm bảo một Class chỉ có duy nhất **một đối tượng** tồn tại trong suốt vòng đời ứng dụng.

**Code minh họa (Thread-safe):**
```java
public class DatabaseConnection {
    private static DatabaseConnection instance;
    private DatabaseConnection() {} // Chặn new từ bên ngoài
    
    public static synchronized DatabaseConnection getInstance() {
        if (instance == null) instance = new DatabaseConnection();
        return instance;
    }
}
```
**Ứng dụng:** Kết nối Database, Quản lý cấu hình, Spring Beans (mặc định là Singleton).

---

## 2. Builder (Người xây dựng)

**Giải thích:** Dùng để tạo các đối tượng phức tạp với rất nhiều tham số tùy chọn. Giống như việc gọi một ly trà sữa: Thêm trân châu, bớt đường, thêm đá...

**Code minh họa (với Lombok):**
```java
@Builder
public class BubbleTea {
    private String type;
    private int sugarLevel;
    private boolean pearl;
}

// Cách dùng
BubbleTea myTea = BubbleTea.builder()
    .type("Oolong")
    .sugarLevel(50)
    .pearl(true)
    .build();
```

---

## 3. Factory Method (Nhà máy)

**Giải thích:** Bạn quẳng yêu cầu vào "nhà máy", nó tự biết cách chế tạo và quẳng ra sản phẩm cho bạn. Bạn không cần biết bên trong lắp ráp thế nào.

**Code minh họa:**
```java
public class AnimalFactory {
    public Animal createAnimal(String type) {
        if (type.equals("DOG")) return new Dog();
        if (type.equals("CAT")) return new Cat();
        return null;
    }
}
```

---

## 4. Mẹo phỏng vấn

> **Hỏi: "Spring Framework dùng Singleton như thế nào?"**
>
> **Trả lời:** "Mặc định, các Bean trong Spring (@Service, @Component) đều là Singleton. Spring Container sẽ tạo chúng một lần duy nhất lúc khởi động và nhét vào RAM để dùng chung, giúp tiết kiệm bộ nhớ cực lớn."
