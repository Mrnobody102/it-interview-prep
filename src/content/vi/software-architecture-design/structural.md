# Design Patterns

## Structural Patterns — Các mẫu cấu trúc

Structural patterns tập trung vào cách **kết hợp các class và object** để tạo cấu trúc lớn hơn. Chúng giúp đảm bảo rằng khi thay đổi một phần của hệ thống, không cần thay đổi quá nhiều phần khác.

---

## 1. Adapter Pattern

### 1.1. Mục đích

Chuyển đổi **interface của một class** thành interface mà client mong muốn. Cho phép các class có interface không tương thích làm việc cùng nhau.

### 1.2. Cấu trúc

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   Client    │ ───► │   Adapter   │ ───► │  Adaptee    │
│  (expects   │      │ (converts   │      │  (has the   │
│   Target)   │      │  requests)  │      │   data)     │
└─────────────┘      └─────────────┘      └─────────────┘
```

### 1.3. Ví dụ Java

```java
// Adaptee — class có dữ liệu nhưng interface không tương thích
public class XMLParser {
    public String parseToXML(String data) {
        // Parse and return XML string
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
        // Convert XML to JSON...
        return "{ \"data\": \"" + data + "\" }";
    }
}

// Client code
public class Client {
    public void process(JsonParser parser) {
        String result = parser.parseToJson("hello");
        System.out.println(result); // { "data": "hello" }
    }
}
```

### 1.4. Khi nào dùng

- Khi cần tích hợp class có interface không tương thích
- Khi muốn sử dụng lại class hiện có mà không thay đổi source code
- Khi cần chuyển đổi giữa các format dữ liệu khác nhau (XML ↔ JSON, CSV ↔ Object)

---

## 2. Bridge Pattern

### 2.1. Mục đích

**Tách rời abstraction khỏi implementation** để cả hai có thể thay đổi độc lập. Tránh việc class hierarchy phình to ra theo hai chiều.

### 2.2. Vấn đề không có Bridge

```
Device (class)
├── Radio
├── TV
│   ├── SmartTV
│   └── OldTV
│       ├── ColorOldTV
│       └── BWOldTV
```

→ 10 devices × 5 remote types = 50 classes!

### 2.3. Cấu trúc

```
┌──────────────────┐        ┌─────────────────────┐
│    Abstraction   │───────►│   Implementor        │
│  (RemoteControl) │        │  (DeviceInterface)   │
└────────┬─────────┘        └─────────────────────┘
         │                           │
         │ implements                 │ implements
         ▼                           ▼
┌──────────────────┐        ┌─────────────────────┐
│ RefinedAbstraction│       │  ConcreteImplementor │
│ (AdvancedRemote) │        │ (TV, Radio, etc.)   │
└──────────────────┘        └─────────────────────┘
```

### 2.4. Ví dụ Java

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

public class Radio implements Device {
    // Similar implementation
}

// Abstraction
public class RemoteControl {
    protected Device device;

    public RemoteControl(Device device) { this.device = device; }

    public void togglePower() {
        if (device.isEnabled()) device.disable();
        else device.enable();
    }

    public void volumeUp() { device.setVolume(device.getVolume() + 10); }
}

// Refined Abstraction
public class AdvancedRemote extends RemoteControl {
    public AdvancedRemote(Device device) { super(device); }

    public void mute() { device.setVolume(0); }
}
```

---

## 3. Composite Pattern

### 3.1. Mục đích

Compose objects thành **cấu trúc cây (tree structure)** để thể hiện part-whole hierarchy. Composite cho phép client xử lý **đơn lẻ và nhóm object** theo cùng một cách.

### 3.2. Cấu trúc

```
         ┌─────────────┐
         │  Component │  (Leaf & Composite implement)
         │ (interface)│
         └──────┬──────┘
                │
       ┌────────┴────────┐
       ▼                 ▼
┌─────────────┐   ┌─────────────┐
│    Leaf     │   │  Composite  │
│  (Primitive)│   │  (Group)    │
│             │   │ has children│
└─────────────┘   └─────────────┘
```

### 3.3. Ví dụ Java

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
    public void remove(FileComponent component) { children.remove(component); }

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

// Usage
Folder root = new Folder("root");
Folder docs = new Folder("documents");
docs.add(new File("resume.pdf", 150));
docs.add(new File("report.docx", 250));
root.add(docs);
root.add(new File("photo.jpg", 2048));
root.print("");
```

---

## 4. Decorator Pattern

### 4.1. Mục đích

**Thêm chức năng cho object một cách linh hoạt** mà không thay đổi cấu trúc class gốc. Các decorators có thể được xếp chồng (stack) để tổ hợp nhiều behaviors.

### 4.2. Cấu trúc

```
      ┌─────────────┐
      │  Component │ (interface)
      └──────┬──────┘
             │
    ┌────────┴────────┐
    ▼                 ▼
┌─────────┐    ┌──────────┐
│  Leaf   │    │ Decorator │ (wraps Component)
└─────────┘    └────┬─────┘
                    │ has-a Component
                    ▼
              ┌──────────┐
              │ConcreteA │
              └──────────┘
```

### 4.3. Ví dụ Java

```java
// Component
public interface DataSource {
    void write(String data);
    String read();
}

// Concrete Component
public class FileDataSource implements DataSource {
    private String filename;
    private String data = "";

    public FileDataSource(String filename) { this.filename = filename; }

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

    public void write(String data) {
        super.write(encrypt(data)); // Simple XOR encryption
    }

    public String read() {
        return decrypt(super.read());
    }

    private String encrypt(String data) {
        return Base64.getEncoder().encodeToString(data.getBytes());
    }

    private String decrypt(String data) {
        return new String(Base64.getDecoder().decode(data));
    }
}

public class CompressionDecorator extends DataSourceDecorator {
    public CompressionDecorator(DataSource wrapped) { super(wrapped); }

    public void write(String data) {
        super.write(compress(data));
    }

    public String read() {
        return decompress(super.read());
    }

    private String compress(String data) { return "[COMPRESSED]" + data; }
    private String decompress(String data) { return data.replace("[COMPRESSED]", ""); }
}

// Usage — stackable decorators
DataSource source = new FileDataSource("data.txt");
DataSource decorated = new EncryptionDecorator(
    new CompressionDecorator(source)
);
decorated.write("Secret data"); // Compressed then encrypted
```

> **Java I/O Streams sử dụng Decorator Pattern:** `BufferedInputStream` wraps `FileInputStream`, `DataInputStream` wraps `BufferedInputStream`.

---

## 5. Facade Pattern

### 5.1. Mục đích

Cung cấp một **interface đơn giản, thống nhất** cho một subsystem phức tạp. Che giấu sự phức tạp bên trong và cung cấp một điểm vào duy nhất.

### 5.2. Cấu trúc

```
┌──────────────────────────────────────────────┐
│                  Client                      │
│            (uses just Facade)                │
└────────────────────┬─────────────────────────┘
                     │
              ┌──────▼──────┐
              │   Facade    │ (simple interface)
              └──────┬──────┘
                     │
    ┌────────────────┼────────────────┐
    ▼                ▼                ▼
┌────────┐    ┌──────────┐    ┌──────────┐
│Class A │    │ Class B  │    │ Class C  │
│complex │    │ complex  │    │ complex  │
└────────┘    └──────────┘    └──────────┘
```

### 5.3. Ví dụ Java

```java
// Complex subsystem classes
public class CPU {
    public void freeze() { System.out.println("CPU: Freezing..."); }
    public void jump(long address) { System.out.println("CPU: Jumping to " + address); }
    public void execute() { System.out.println("CPU: Executing..."); }
}

public class Memory {
    public void load(long position, byte[] data) {
        System.out.println("Memory: Loading at " + position);
    }
}

public class HardDrive {
    public byte[] read(long lba, int size) {
        System.out.println("HardDrive: Reading " + size + " bytes from sector " + lba);
        return new byte[size];
    }
}

// Facade
public class ComputerFacade {
    private final CPU cpu;
    private final Memory memory;
    private final HardDrive hardDrive;

    public ComputerFacade() {
        this.cpu = new CPU();
        this.memory = new Memory();
        this.hardDrive = new HardDrive();
    }

    public void start() {
        cpu.freeze();
        memory.load(0, hardDrive.read(0, 1024));
        cpu.jump(0);
        cpu.execute();
    }

    public void shutdown() {
        System.out.println("Computer shutting down safely...");
    }
}

// Client — đơn giản hóa
public class Client {
    public static void main(String[] args) {
        ComputerFacade computer = new ComputerFacade();
        computer.start();  // ONE line instead of many complex calls
    }
}
```

### 5.4. Khi nào dùng

- Khi cần cung cấp interface đơn giản cho một hệ thống phức tạp
- Khi có nhiều dependencies giữa client và các implementation classes
- Khi muốn layer subsystem thành các layers có cấp độ trừu tượng khác nhau

---

## 6. Flyweight Pattern

### 6.1. Mục đích

**Chia sẻ các object nhỏ, thường gặp (intrinsic)** để tiết kiệm memory khi có nhiều instances cùng loại. Các phần có thể chia sẻ (intrinsic) được tách riêng khỏi các phần khác biệt (extrinsic).

### 6.2. Cấu trúc

```
Flyweight Factory ──────► maintains pool of shared objects
                              │
                              ▼
                           ┌────────┐
                           │Intrinsic│ (shared, immutable)
                           │ State  │
                           └────────┘
                              ▲
                              │ passed in
┌──────────────┐              │
│Client Code   │──────────────┘
│(extrinsic)  │──────────────►
└──────────────┘
```

### 6.3. Ví dụ Java

```java
// Flyweight — intrinsic state (shared, immutable)
public class TreeType {
    private final String name;    // intrinsic
    private final String color;   // intrinsic
    private final String texture; // intrinsic

    public TreeType(String name, String color, String texture) {
        this.name = name;
        this.color = color;
        this.texture = texture;
    }

    public void draw(Graphics g, int x, int y) {
        // Draw using intrinsic state + extrinsic (x, y)
        System.out.println("Drawing " + color + " " + name + " tree at (" + x + "," + y + ")");
    }
}

// Flyweight Factory — quản lý shared instances
public class TreeFactory {
    private static Map<String, TreeType> treeTypes = new HashMap<>();

    public static TreeType getTreeType(String name, String color, String texture) {
        String key = name + "_" + color + "_" + texture;
        return treeTypes.computeIfAbsent(key,
            k -> new TreeType(name, color, texture)
        );
    }

    public static int getTypeCount() { return treeTypes.size(); }
}

// Context — extrinsic state (unique per instance)
public class Tree {
    private int x, y;                    // extrinsic (unique)
    private TreeType type;               // intrinsic (shared)

    public Tree(int x, int y, TreeType type) {
        this.x = x;
        this.y = y;
        this.type = type;
    }

    public void draw() {
        type.draw(null, x, y); // Pass extrinsic state to flyweight
    }
}

// Client — hàng triệu cây nhưng chỉ vài loại tree type
public class Forest {
    private List<Tree> trees = new ArrayList<>();

    public void plantTree(int x, int y, String name, String color, String texture) {
        TreeType type = TreeFactory.getTreeType(name, color, texture);
        Tree tree = new Tree(x, y, type);
        trees.add(tree);
    }

    public void draw() {
        for (Tree tree : trees) {
            tree.draw();
        }
    }

    public static void main(String[] args) {
        Forest forest = new Forest();
        // 1 triệu cây nhưng chỉ tạo ~5 TreeType objects
        for (int i = 0; i < 1_000_000; i++) {
            forest.plantTree(i, i, "Oak", "Green", "oak.png");
        }
        System.out.println("Tree types created: " + TreeFactory.getTypeCount()); // ~5
    }
}
```

---

## 7. Proxy Pattern

### 7.1. Mục đích

Cung cấp một **surrogate hoặc placeholder** cho một object khác để kiểm soát truy cập, thêm chức năng trước/sau khi object thực sự được gọi.

### 7.2. Các loại Proxy

| Loại | Mục đích |
|---|---|
| **Virtual Proxy** | Lazy initialization — tạo object khi thực sự cần |
| **Protection Proxy** | Kiểm soát quyền truy cập |
| **Remote Proxy** | Đại diện cho object ở địa chỉ khác (network) |
| **Smart Reference** | Thêm logic khi object được truy cập (caching, logging) |
| **Logging Proxy** | Ghi log mỗi lần method được gọi |

### 7.3. Ví dụ Java

```java
// Subject
public interface Image {
    void display();
}

// Real Subject
public class RealImage implements Image {
    private String filename;

    public RealImage(String filename) {
        this.filename = filename;
        loadFromDisk(); // Giả lập heavy loading
    }

    private void loadFromDisk() {
        System.out.println("Loading high-resolution image: " + filename);
    }

    public void display() {
        System.out.println("Displaying: " + filename);
    }
}

// Virtual Proxy — lazy loading
public class ImageProxy implements Image {
    private String filename;
    private RealImage realImage;

    public ImageProxy(String filename) {
        this.filename = filename;
    }

    public void display() {
        // Lazy initialization — chỉ tạo RealImage khi thực sự cần hiển thị
        if (realImage == null) {
            realImage = new RealImage(filename);
        }
        realImage.display();
    }
}

// Protection Proxy — access control
public class SecuredImage implements Image {
    private Image realImage;
    private String userRole;

    public SecuredImage(Image realImage, String userRole) {
        this.realImage = realImage;
        this.userRole = userRole;
    }

    public void display() {
        if (!"ADMIN".equals(userRole)) {
            System.out.println("Access denied. Admin role required.");
            return;
        }
        realImage.display();
    }
}

// Usage
public class Client {
    public static void main(String[] args) {
        // Virtual Proxy — không load ảnh cho đến khi cần
        Image image1 = new ImageProxy("photo1.jpg");
        Image image2 = new ImageProxy("photo2.jpg");

        // Image chưa được load — chỉ proxy được tạo
        System.out.println("Proxy created, image not loaded yet...");

        // Load khi thực sự display
        image1.display(); // Lúc này mới load
        image2.display();

        // Protection Proxy
        Image adminImage = new SecuredImage(new RealImage("secret.jpg"), "ADMIN");
        Image userImage = new SecuredImage(new RealImage("secret.jpg"), "USER");

        adminImage.display(); // OK
        userImage.display();  // Access denied
    }
}
```

> **Spring AOP sử dụng Proxy Pattern:** `@Transactional`, `@Cacheable`, `@Async` sử dụng proxies để thêm behavior mà không cần modify code gốc.

---

## 8. So sánh tổng hợp

| Pattern | Mục đích chính | Khi nào dùng |
|---|---|---|
| **Adapter** | Chuyển đổi interface không tương thích | Tích hợp code có sẵn |
| **Bridge** | Tách abstraction khỏi implementation | Tránh class explosion |
| **Composite** | Tree structure, part-whole | UI components, file systems |
| **Decorator** | Thêm behavior linh hoạt, stackable | Java I/O, wrapping features |
| **Facade** | Interface đơn giản cho subsystem phức tạp | API wrapper, simplification |
| **Flyweight** | Chia sẻ object nhỏ, tiết kiệm memory | Nhiều instances, memory critical |
| **Proxy** | Surrogate kiểm soát truy cập | Lazy loading, access control, remote calls |
