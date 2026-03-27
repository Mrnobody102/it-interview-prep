# Design Patterns

## Structural Patterns — Các mẫu cấu trúc

Structural patterns tập trung vào cách **kết hợp các class và object** để tạo cấu trúc lớn hơn. Chúng giúp đảm bảo rằng khi thay đổi một phần của hệ thống, không cần thay đổi quá nhiều phần khác.

---

## 1. Adapter Pattern

### Mục đích

Chuyển đổi **interface của một class** thành interface mà client mong muốn. Cho phép các class có interface không tương thích làm việc cùng nhau.

### Cấu trúc

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   Client    │ ───► │   Adapter   │ ───► │  Adaptee    │
│  (expects   │      │ (converts   │      │  (has the   │
│   Target)   │      │  requests)  │      │   data)     │
└─────────────┘      └─────────────┘      └─────────────┘
```

### Ví dụ Java

```java
// Adaptee — class có dữ liệu nhưng interface không tương thích
public class XMLParser {
    public String parseToXML(String data) {
        return "<data>" + data + "</data>";
    }
}

// Target interface — interface mà client mong đợi
public interface JsonParser {
    String parseToJson(String data);
}

// Adapter — kết nối Adaptee với Target
public class XMLToJSONAdapter implements JsonParser {
    private final XMLParser xmlParser;

    public XMLToJSONAdapter(XMLParser xmlParser) {
        this.xmlParser = xmlParser;
    }

    @Override
    public String parseToJson(String data) {
        String xml = xmlParser.parseToXML(data);
        return "{ \"data\": \"" + data + "\" }";
    }
}
```

### Khi nào dùng

- Khi cần tích hợp class có interface không tương thích
- Khi muốn sử dụng lại class hiện có mà không thay đổi source code
- Khi cần chuyển đổi giữa các format dữ liệu (XML ↔ JSON, CSV ↔ Object)

---

## 2. Bridge Pattern

### Mục đích

**Tách rời abstraction khỏi implementation** để cả hai có thể thay đổi độc lập. Tránh việc class hierarchy phình to ra theo hai chiều.

### Ví dụ Java

```java
// Implementor
public interface Device {
    boolean isEnabled();
    void enable();
    void disable();
    int getVolume();
    void setVolume(int percent);
}

// Concrete Implementor
public class TV implements Device {
    private boolean on = false;
    private int volume = 30;

    public boolean isEnabled() { return on; }
    public void enable() { on = true; }
    public void disable() { on = false; }
    public int getVolume() { return volume; }
    public void setVolume(int v) { this.volume = Math.max(0, Math.min(100, v)); }
}

// Abstraction
public class RemoteControl {
    protected Device device;

    public RemoteControl(Device device) { this.device = device; }

    public void togglePower() {
        if (device.isEnabled()) device.disable();
        else device.enable();
    }
}

// Refined Abstraction
public class AdvancedRemote extends RemoteControl {
    public AdvancedRemote(Device device) { super(device); }
    public void mute() { device.setVolume(0); }
}
```

---

## 3. Composite Pattern

### Mục đích

Compose objects thành **cấu trúc cây (tree structure)** để thể hiện part-whole hierarchy. Composite cho phép client xử lý **đơn lẻ và nhóm object** theo cùng một cách.

### Ví dụ Java

```java
public interface FileComponent {
    String getName();
    long getSize();
    default void print(String indent) {
        System.out.println(indent + getName() + " (" + getSize() + " KB)");
    }
}

public class File implements FileComponent {
    private String name;
    private long size;

    public File(String name, long size) { this.name = name; this.size = size; }
    public String getName() { return name; }
    public long getSize() { return size; }
}

public class Folder implements FileComponent {
    private String name;
    private List<FileComponent> children = new ArrayList<>();

    public Folder(String name) { this.name = name; }
    public void add(FileComponent component) { children.add(component); }
    public String getName() { return name; }
    public long getSize() {
        return children.stream().mapToLong(FileComponent::getSize).sum();
    }

    @Override
    public void print(String indent) {
        System.out.println(indent + "+ " + getName() + " (" + getSize() + " KB)");
        for (FileComponent child : children) {
            child.print(indent + "  ");
        }
    }
}
```

---

## 4. Decorator Pattern

### Mục đích

**Thêm chức năng cho object một cách linh hoạt** mà không thay đổi cấu trúc class gốc. Các decorators có thể được xếp chồng (stack) để tổ hợp nhiều behaviors.

### Ví dụ Java

```java
// Component
public interface DataSource {
    void write(String data);
    String read();
}

// Concrete Component
public class FileDataSource implements DataSource {
    private String data = "";
    public void write(String data) { this.data = data; }
    public String read() { return data; }
}

// Base Decorator
public class DataSourceDecorator implements DataSource {
    protected DataSource wrapped;
    public DataSourceDecorator(DataSource wrapped) { this.wrapped = wrapped; }
    public void write(String data) { wrapped.write(data); }
    public String read() { return wrapped.read(); }
}

// Concrete Decorators
public class EncryptionDecorator extends DataSourceDecorator {
    public EncryptionDecorator(DataSource wrapped) { super(wrapped); }
    public void write(String data) { super.write(encrypt(data)); }
    public String read() { return decrypt(super.read()); }
    private String encrypt(String data) {
        return Base64.getEncoder().encodeToString(data.getBytes());
    }
    private String decrypt(String data) {
        return new String(Base64.getDecoder().decode(data));
    }
}

public class CompressionDecorator extends DataSourceDecorator {
    public CompressionDecorator(DataSource wrapped) { super(wrapped); }
    public void write(String data) { super.write("[COMPRESSED]" + data); }
    public String read() { return super.read().replace("[COMPRESSED]", ""); }
}

// Stackable decorators
DataSource source = new FileDataSource("data.txt");
DataSource decorated = new EncryptionDecorator(
    new CompressionDecorator(source)
);
decorated.write("Secret data");
```

> **Java I/O Streams sử dụng Decorator Pattern:** `BufferedInputStream` wraps `FileInputStream`.

---

## 5. Facade Pattern

### Mục đích

Cung cấp một **interface đơn giản, thống nhất** cho một subsystem phức tạp. Che giấu sự phức tạp bên trong.

### Ví dụ Java

```java
// Complex subsystem
public class CPU {
    public void freeze() { System.out.println("CPU: Freezing..."); }
    public void jump(long address) { System.out.println("CPU: Jumping..."); }
    public void execute() { System.out.println("CPU: Executing..."); }
}

public class Memory {
    public void load(long pos, byte[] data) {
        System.out.println("Memory: Loading...");
    }
}

public class HardDrive {
    public byte[] read(long lba, int size) {
        System.out.println("HardDrive: Reading...");
        return new byte[size];
    }
}

// Facade — đơn giản hóa
public class ComputerFacade {
    private CPU cpu = new CPU();
    private Memory memory = new Memory();
    private HardDrive hardDrive = new HardDrive();

    public void start() {
        cpu.freeze();
        memory.load(0, hardDrive.read(0, 1024));
        cpu.jump(0);
        cpu.execute();
    }
}

// Client — chỉ cần gọi một dòng
new ComputerFacade().start();
```

---

## 6. Flyweight Pattern

### Mục đích

**Chia sẻ các object nhỏ, thường gặp (intrinsic)** để tiết kiệm memory khi có nhiều instances cùng loại.

### Ví dụ Java

```java
// Flyweight — intrinsic state (shared, immutable)
public class TreeType {
    private final String name, color, texture;

    public TreeType(String name, String color, String texture) {
        this.name = name; this.color = color; this.texture = texture;
    }

    public void draw(int x, int y) {
        System.out.println("Drawing " + color + " " + name + " at (" + x + "," + y + ")");
    }
}

// Flyweight Factory
public class TreeFactory {
    private static Map<String, TreeType> pool = new HashMap<>();

    public static TreeType get(String name, String color, String texture) {
        String key = name + "_" + color + "_" + texture;
        return pool.computeIfAbsent(key, k -> new TreeType(name, color, texture));
    }
}

// Context — extrinsic state
public class Tree {
    private int x, y;
    private TreeType type;

    public Tree(int x, int y, TreeType type) {
        this.x = x; this.y = y; this.type = type;
    }

    public void draw() { type.draw(x, y); }
}

// Client — hàng triệu cây nhưng chỉ vài loại
// 1 triệu cây Oak nhưng chỉ tạo 1 TreeType object
TreeType oakType = TreeFactory.get("Oak", "Green", "oak.png");
for (int i = 0; i < 1_000_000; i++) {
    new Tree(i, i, oakType).draw();
}
```

---

## 7. Proxy Pattern

### Mục đích

Cung cấp một **surrogate hoặc placeholder** để kiểm soát truy cập, thêm chức năng trước/sau khi object thực sự được gọi.

### Các loại Proxy

| Loại | Mục đích |
|---|---|
| **Virtual Proxy** | Lazy initialization — tạo object khi thực sự cần |
| **Protection Proxy** | Kiểm soát quyền truy cập |
| **Remote Proxy** | Đại diện cho object ở địa chỉ khác |
| **Smart Reference** | Thêm logic khi object được truy cập |

### Ví dụ Java

```java
public interface Image { void display(); }

public class RealImage implements Image {
    private String filename;
    public RealImage(String filename) {
        this.filename = filename;
        System.out.println("Loading: " + filename);
    }
    public void display() { System.out.println("Displaying: " + filename); }
}

// Virtual Proxy — lazy loading
public class ImageProxy implements Image {
    private String filename;
    private RealImage realImage;

    public ImageProxy(String filename) { this.filename = filename; }

    public void display() {
        if (realImage == null) realImage = new RealImage(filename);
        realImage.display();
    }
}

// Protection Proxy
public class SecuredImage implements Image {
    private Image realImage;
    private String userRole;

    public SecuredImage(Image realImage, String userRole) {
        this.realImage = realImage; this.userRole = userRole;
    }

    public void display() {
        if (!"ADMIN".equals(userRole)) {
            System.out.println("Access denied.");
            return;
        }
        realImage.display();
    }
}
```

> **Spring AOP sử dụng Proxy Pattern:** `@Transactional`, `@Cacheable` dùng proxies để thêm behavior.

---

## 8. So sánh tổng hợp

| Pattern | Mục đích chính | Khi nào dùng |
|---|---|---|
| **Adapter** | Chuyển đổi interface không tương thích | Tích hợp code có sẵn |
| **Bridge** | Tách abstraction khỏi implementation | Tránh class explosion |
| **Composite** | Tree structure, part-whole | UI components, file systems |
| **Decorator** | Thêm behavior linh hoạt, stackable | Java I/O, wrapping features |
| **Facade** | Interface đơn giản cho subsystem phức tạp | API wrapper |
| **Flyweight** | Chia sẻ object nhỏ, tiết kiệm memory | Nhiều instances |
| **Proxy** | Surrogate kiểm soát truy cập | Lazy loading, access control |
