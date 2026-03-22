# Java Core — Các phiên bản chính

## 1. Java 8

Phát hành **2014** — phiên bản có lẽ **quan trọng nhất** trong lịch sử Java.

| Tính năng | Mô tả |
|---|---|
| **Lambda Expressions** | Cách viết ngắn gọn cho functional interface |
| **Functional Interfaces** | Interface có 1 abstract method (`@FunctionalInterface`) |
| **Method Reference** | `ClassName::method` hoặc `object::method` |
| **Stream API** | Pipeline xử lý dữ liệu: `filter`, `map`, `reduce`... |
| **Default Methods** | Interface có method với implementation mặc định |
| **Static Methods in Interface** | Interface có method `static` |
| **Optional** | Tránh `NullPointerException` |
| **java.time API** | Thay thế `java.util.Date` và `Calendar` |
| **CompletableFuture** | Async programming nâng cao |
| **New Date/Time API** | `LocalDate`, `LocalDateTime`, `ZonedDateTime` |

### 1.1. Ví dụ tính năng nổi bật

```java
// Lambda + Stream
List<String> names = List.of("Alice", "Bob", "Charlie");
names.stream()
    .filter(n -> n.length() > 3)
    .map(String::toUpperCase)
    .forEach(System.out::println);

// java.time
LocalDate today = LocalDate.now();
LocalDateTime now = LocalDateTime.now();
ZonedDateTime tokyoTime = ZonedDateTime.now(ZoneId.of("Asia/Tokyo"));

// Optional
Optional<String> opt = Optional.ofNullable(getName());
String result = opt.orElse("Unknown");
```

## 2. Java 11 (intermediate)

| Tính năng | Mô tả |
|---|---|
| **Local-Variable Syntax for Lambda** | `var` trong lambda: `(var x, var y) -> x + y` |
| **String Methods** | `isBlank()`, `lines()`, `strip()`, `repeat()` |
| **Files.readString() / Files.writeString()** | Đọc/ghi file đơn giản |
| **Collection.toArray(IntFunction)** | `list.toArray(String[]::new)` |
| **Run Java File Directly** | `java HelloWorld.java` |
| **ZGC** | Garbage Collector latency cực thấp |

## 3. Java 17 (LTS)

Phát hành **2021** — phiên bản LTS phổ biến hiện tại.

| Tính năng | Mô tả | Code |
|---|---|---|
| **Sealed Classes** | Giới hạn class/interface được kế thừa | `sealed class Animal permits Dog, Cat {}` |
| **Pattern Matching for instanceof** | Không cần cast thủ công | `if (obj instanceof String s)` |
| **Records** | Immutable data class tự động | `record Point(int x, int y) {}` |
| **Text Blocks** | Chuỗi nhiều dòng | `"""..."""` |
| **Switch Expressions** | `switch` trả về giá trị | Cải thiện readability |
| **Sealed Interfaces** | Giới hạn implementation | `sealed interface Shape permits Circle, Square {}` |

### 3.1. Sealed Classes

```java
// Giới hạn ai được extends/implements
public sealed class Shape permits Circle, Rectangle, Square {
}

// Mỗi subclass phải khai báo loại:
public final class Circle extends Shape { }

public sealed class Rectangle extends Shape permits ColoredRectangle {
}
public final class ColoredRectangle extends Rectangle { }

public non-sealed class Square extends Shape { } // có thể được extends tự do
```

### 3.2. Pattern Matching for instanceof

```java
// Trước Java 17
if (obj instanceof String) {
    String s = (String) obj;
    System.out.println(s.length());
}

// Java 17+ — pattern variable được tự động cast
if (obj instanceof String s && s.length() > 5) {
    System.out.println(s.toUpperCase()); // s đã được cast
}

// Kết hợp null check
if (obj instanceof String s) {
    // s không null, đã cast
}
```

### 3.3. Records

```java
// Record — immutable data carrier
public record Person(String name, int age, String email) {
    // Tự động có:
    // - private final fields
    // - constructor (all-args)
    // - equals(), hashCode(), toString()
    // - getter methods: name(), age(), email()
}

// Compact constructor — validation
public record BankAccount(String id, double balance) {
    public BankAccount {
        if (balance < 0) {
            throw new IllegalArgumentException("Balance cannot be negative");
        }
    }
}

// Sử dụng
Person p = new Person("Alice", 25, "alice@example.com");
System.out.println(p.name()); // Alice
System.out.println(p); // Person[name=Alice, age=25, email=alice@example.com]
```

### 3.4. Text Blocks

```java
// Trước Java 17
String json = "{\n" +
    "  \"name\": \"Alice\",\n" +
    "  \"age\": 25\n" +
"}";

// Java 17+
String json = """
    {
        "name": "Alice",
        "age": 25
    }
    """;
```

### 3.5. Switch Expressions

```java
// Switch expression trả về giá trị
String dayType = switch (day) {
    case "Mon", "Tue", "Wed", "Thu", "Fri" -> "Weekday";
    case "Sat", "Sun" -> "Weekend";
    default -> "Unknown";
};

// Switch với block và yield
int result = switch (type) {
    case "A" -> 1;
    case "B" -> 2;
    case "C" -> {
        int r = compute();
        yield r * 10; // trả về giá trị từ block
    }
    default -> 0;
};
```

## 4. Java 21 (LTS)

Phát hành **2023** — phiên bản LTS mới nhất.

| Tính năng | Mô tả | Code |
|---|---|---|
| **Virtual Threads (Preview → GA)** | Thread nhẹ, hàng triệu thread | `Thread.startVirtualThread()` |
| **Pattern Matching for switch** | Match pattern trong switch | `case String s when s.length() > 5 ->` |
| **Record Patterns (GA)** | Decompose record trong pattern | `case Point(int x, int y) p ->` |
| **Sequenced Collections** | Collection có thứ tự xác định | `SequencedSet`, `SequencedMap` |
| **String Templates (Preview)** | Template strings | `STR."Hello \{name}"` |
| **Unnamed Patterns & Variables** | `_` cho biến không dùng | `case Point(_, _) p ->` |
| **Foreign Function & Memory API** | Gọi native code, quản lý off-heap memory | Thay thế JNI |

### 4.1. Virtual Threads (Project Loom)

```java
// Virtual Thread — nhẹ, chi phí thấp
// Có thể tạo hàng triệu virtual threads trên 1 máy

// Tạo virtual thread
Thread.startVirtualThread(() -> {
    System.out.println("Running in virtual thread");
});

// Hoặc dùng ExecutorService
try (ExecutorService executor = Executors.newVirtualThreadPerTaskExecutor()) {
    for (int i = 0; i < 10_000; i++) {
        final int id = i;
        executor.submit(() -> {
            // Xử lý request nhẹ nhàng
            System.out.println("Task " + id);
        });
    }
}

// So sánh với platform thread
Thread platformThread = new Thread(() -> {
    System.out.println("Platform thread");
});
platformThread.start();

// Structured Concurrency (Java 21)
try (var scope = new StructuredTaskScope.ShutdownOnFailure()) {
    Future<String> f1 = scope.fork(() -> fetchUser());
    Future<String> f2 = scope.fork(() -> fetchOrder());

    scope.join();           // Chờ tất cả
    scope.throwIfFailed();  // Ném exception nếu có

    String user = f1.resultNow();
    String order = f2.resultNow();
}
```

### 4.2. Pattern Matching for switch

```java
// Kết hợp pattern matching với switch
String describe = switch (obj) {
    case null      -> "Null value";
    case Integer i -> "Integer: " + i;
    case String s  -> "String: " + s;
    // Guard clause
    case String s when s.length() > 10 -> "Long string: " + s.length();
    case int[] arr -> "Array of length: " + arr.length;
    default        -> "Unknown";
};

// Record pattern trong switch
void printSum(Object obj) {
    if (obj instanceof Pair(int x, int y)) {
        System.out.println(x + y);
    }
}

record Pair(int x, int y) {}
```

### 4.3. Sequenced Collections (Java 21)

```java
// Collection có thứ tự first/last rõ ràng
SequencedCollection<Integer> sc = new ArrayList<>();
sc.addFirst(1);
sc.addLast(2);
sc.getFirst(); // 1
sc.getLast();  // 2
sc.reversed(); // view ngược

// SequencedSet, SequencedMap tương tự
SequencedMap<String, Integer> map = new LinkedHashMap<>();
map.putLast("a", 1);
map.putLast("b", 2);
map.firstKey();   // "a"
map.lastKey();   // "b"
```

### 4.4. String Templates (Preview — Java 21)

Thay thế concatenation bằng template literals với embedded expressions:

```java
String name = "Alice";
int age = 30;

// Dùng STR template processor
String message = STR."Hello, \{name}! You are \{age} years old.";
// "Hello, Alice! You are 30 years old."

// Template với expression phức tạp
int a = 10, b = 20;
String calc = STR."\{a} + \{b} = \{a + b}";
// "10 + 20 = 30"

// RAW template — không escape
String raw = RAW."First line\nSecond line";
```

### 4.5. Unnamed Patterns and Variables (Java 21)

Dùng `_` cho biến không sử dụng, giúp code rõ ràng hơn và compiler không cảnh báo:

```java
// Unnamed pattern variable — không cần dùng giá trị
switch (obj) {
    case Point(int x, int _) -> System.out.println("X = " + x);
    case Circle(double _, double _) -> System.out.println("Circle detected");
}

// Unnamed local variable
for (int i = 0, _ = init(); i < 10; i++) { }

// Trong lambda
list.stream()
    .map((_, index) -> "Item " + index)
    .toList();
```

### 4.6. Foreign Function & Memory API (Java 21)

Gọi native code và quản lý off-heap memory an toàn hơn JNI:

```java
// Java 21 — Foreign Function & Memory API
MemorySegment segment = MemorySegment.ofArray(new byte[]{1, 2, 3});
// Thay thế JNI phức tạp
```

### 4.7. Structured Concurrency (Java 21) — Preview

Nhóm nhiều task chạy trong một thread logic, tự động hủy khi có lỗi:

```java
try (var scope = new StructuredTaskScope.ShutdownOnFailure()) {
    Future<String> f1 = scope.fork(() -> fetchUser(id));
    Future<String> f2 = scope.fork(() -> fetchPermissions(id));

    scope.join();           // Chờ tất cả hoàn thành
    scope.throwIfFailed();  // Ném exception nếu có task thất bại

    String user = f1.resultNow();
    String perms = f2.resultNow();
    return new UserContext(user, perms);
}
```

### 4.8. Scoped Values (Java 21) — Preview

Chia sẻ dữ liệu immutable giữa các thread hiệu quả hơn `ThreadLocal`:

```java
// ScopedValue thay thế ThreadLocal cho immutable data
ScopedValue<String> USER_ID = ScopedValue.newInstance();

ScopedValue.where(USER_ID, "user-123").run(() -> {
    // Có thể truy cập trong virtual thread con
    String id = USER_ID.get();
});
```

## 5. So sánh các phiên bản

| Tiêu chí | Java 8 | Java 11 | Java 17 | Java 21 |
|---|---|---|---|---|
| **Phát hành** | 2014 | 2018 | 2021 | 2023 |
| **LTS?** | Không | Không | **Có** | **Có** |
| **Lambda/Stream** | Yes | Yes | Yes | Yes |
| **Records** | Không | Không | **Yes** | Yes |
| **Sealed Classes** | Không | Không | **Yes** | Yes |
| **Pattern Matching** | Không | instanceof only | instanceof +M | **switch + switch** |
| **Virtual Threads** | Không | Không | Preview | **GA** |
| **ZGC** | Không | **Yes** | Yes | Yes |
| **Khuyến nghị production** | Cũ | Trung bình | **LTS — ưu tiên** | **LTS — mới nhất** |

> **Khuyến nghị:** Dùng **Java 17** (LTS, ổn định) hoặc **Java 21** (LTS mới, Virtual Threads).

## 6. Các câu hỏi phỏng vấn thường gặp

### 6.1. Sự khác nhau giữa các phiên bản LTS?

LTS (Long-Term Support) được Oracle hỗ trợ **8 năm** với security updates. Các phiên bản non-LTS chỉ được hỗ trợ **6 tháng**.

### 6.2. Khi nào nên dùng Virtual Threads?

- **Phù hợp:** I/O-bound tasks (HTTP requests, DB queries, file operations) — hàng nghìn request đồng thời.
- **Không phù hợp:** CPU-bound tasks — vì vẫn dùng chung OS thread, không tăng throughput CPU.

### 6.3. Records vs Class?

| Tiêu chí | Class thông thường | Record |
|---|---|---|
| Mutability | Mutable hoặc immutable | **Immutable** (default) |
| Boilerplate | Nhiều | Không (tự động) |
| `equals/hashCode/toString` | Tự viết | **Tự động** |
| Constructor | Tự do | All-args auto, có compact |
| Method | Tự do | Tự do, thêm được |
| Use case | Object có hành vi phức tạp | Data carrier, DTO, Immutable value object |
