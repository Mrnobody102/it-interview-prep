# Creational Patterns (Nhóm Khởi tạo)

## Tổng quan
Nhóm này giải quyết câu hỏi: **"Làm sao để dùng từ khóa `new` một cách khôn ngoan nhất?"** Việc khởi tạo Object một cách bừa bãi sẽ làm code bị dính chặt (Coupling) vào nhau.

---

## 1. Singleton Pattern (Độc Tôn)

### Giải thích siêu dễ hiểu
Singleton nghĩa là **"Độc nhất vô nhị trên cõi đời này"**. Dù bạn có gọi bao nhiêu lần đi nữa, hệ thống cũng chỉ trả về đúng 1 bản sao duy nhất. 
Giống như nước Mỹ chỉ có 1 Tổng Thống duy nhất tại một thời điểm. Ai cần xin chữ ký thì đều tìm đến đúng ông đó, không thể tạo ra ông thứ 2.

### Dùng khi nào?
Dùng để chứa các cấu hình chung, Connection Pool kết nối Database. Việc tạo đi tạo lại các object này rất tốn RAM và làm chậm hệ thống.

> **💡 Mẹo Phỏng vấn:** Trong Spring Boot, mọi class đánh dấu `@Service`, `@Component`, `@Repository` **mặc định đều là Singleton**! Spring container chỉ khởi tạo chúng 1 lần duy nhất lúc bật server và nhét vào RAM dùng chung.

```java
// Cách viết chuẩn (Thread-safe) ở Java
public class Singleton {
    private static final Singleton INSTANCE = new Singleton();
    private Singleton() {} // Cấm dùng từ khóa new từ bên ngoài
    public static Singleton getInstance() { return INSTANCE; }
}
```

---

## 2. Builder Pattern (Thợ Xây)

### Giải thích siêu dễ hiểu
Giống hệt **cách bạn đi mua Trà Sữa**. Bạn không mua một ly trà sữa làm sẵn. Bạn "build" nó theo ý mình: Trà ô long (20k) + Ít đá + Nhiều đường + Thêm Trân châu đen (5k) + Thêm Kem cheese (10k) -> Cuối cùng nhân viên mới giao ly trà sữa cho bạn (`build()`).

### Dùng khi nào?
Khi một Object có **quá nhiều tham số** truyền vào hàm Khởi tạo (Constructor), khiến bạn không nhớ tham số nào nằm ở vị trí nào. Hoặc có những tham số là tự chọn (Optional).

```java
// Nhờ thư viện Lombok, chỉ cần 1 annotation là xong!
@Builder
class TraSua {
    private String loaiTra;
    private int mucDa;
    private boolean tranChauDen;
    private boolean kemCheese;
}

// Khi dùng: Đẹp, rõ ràng, không thể nhầm lẫn
TraSua lyCuaToi = TraSua.builder()
    .loaiTra("O_LONG")
    .mucDa(50)
    .kemCheese(true)
    .build();
```

---

## 3. Factory Method (Nhà Máy Sản Xuất)

### Giải thích siêu dễ hiểu
Bạn đến xưởng xe VinFast. Bạn bảo: "Bán cho tôi 1 chiếc SUV màu đỏ". Vài ngày sau họ giao cho bạn xe VF8. Bạn không hề biết quá trình hàn sắt, lắp lốp, sơn xe bên trong xưởng diễn ra thế nào.

### Dùng khi nào?
Thay vì gọi `new VF8()` ở khắp mọi nơi trong dự án, ta gom việc tạo xe vào một cái `VehicleFactory`. Ngày mai xưởng đổi mẫu mã thành xe đời mới, ta chỉ cần cập nhật bên trong xưởng, phần còn lại của ứng dụng không cần sửa.

```java
// Client chỉ nói cái mình cần, Factory tự lo việc chế tạo
Vehicle xeCuaToi = VehicleFactory.createVehicle("SUV"); 
```

---

## Tóm tắt nhanh đi Phỏng vấn

| Pattern | Tóm tắt 1 câu | Ứng dụng thực tế |
|---------|---------|----------|
| **Singleton** | Độc nhất vô nhị trên cõi đời này | Database Connection, Spring Bean |
| **Builder** | Khởi tạo từng bước (như mua Trà sữa) | Tạo Object có nhiều thuộc tính tuỳ chọn |
| **Factory Method** | Quẳng yêu cầu vào xưởng, nhận thành phẩm | Che giấu logic khởi tạo phức tạp |
