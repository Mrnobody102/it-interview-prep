# Java Core — I/O

## 1. Tổng quan

| Package | Mô tả | Blocking? | Buffered? |
|---|---|---|---|
| **java.io** | Stream-based (byte & character), file, console | **Có** | Thủ công |
| **java.nio** | Buffer-oriented, channel, selector | **Không** | Tự nhiên |

> **Tip:** `java.io` phù hợp cho app đơn giản. `java.nio` phù hợp cho ứng dụng mạng và xử lý dữ liệu lớn.

## 2. java.io — Stream Types

### 2.1. Phân loại Stream

| Loại | Class | Mô tả |
|---|---|---|
| **Byte Input** | `InputStream`, `FileInputStream`, `ByteArrayInputStream` | Đọc nhị phân (byte) |
| **Byte Output** | `OutputStream`, `FileOutputStream`, `ByteArrayOutputStream` | Ghi nhị phân |
| **Character Input** | `Reader`, `FileReader`, `BufferedReader`, `InputStreamReader` | Đọc ký tự Unicode |
| **Character Output** | `Writer`, `FileWriter`, `BufferedWriter`, `OutputStreamWriter` | Ghi ký tự |
| **Buffered** | `BufferedInputStream`, `BufferedReader`, `BufferedWriter` | Tăng hiệu suất (buffer) |
| **Data** | `DataInputStream`, `DataOutputStream` | Đọc/ghi primitive types |
| **Object** | `ObjectInputStream`, `ObjectOutputStream` | Đọc/ghi object (serialization) |

### 2.2. Byte Streams vs Character Streams

```java
// Byte Stream — đọc nhị phân
try (FileInputStream fis = new FileInputStream("data.bin");
     FileOutputStream fos = new FileOutputStream("output.bin")) {

    int data;
    while ((data = fis.read()) != -1) {
        fos.write(data);
    }
}

// Byte Stream — đọc theo buffer (hiệu quả hơn)
try (FileInputStream fis = new FileInputStream("data.bin");
     FileOutputStream fos = new FileOutputStream("output.bin")) {
    byte[] buffer = new byte[8192];
    int bytesRead;
    while ((bytesRead = fis.read(buffer)) != -1) {
        fos.write(buffer, 0, bytesRead);
    }
}

// Character Stream — đọc text
try (FileReader fr = new FileReader("text.txt");
     BufferedReader br = new BufferedReader(fr)) {

    String line;
    while ((line = br.readLine()) != null) {
        System.out.println(line);
    }
}

// Character Stream — ghi text
try (FileWriter fw = new FileWriter("output.txt");
     BufferedWriter bw = new BufferedWriter(fw)) {

    bw.write("Hello, ");
    bw.newLine();
    bw.write("Java!");
}
```

### 2.3. Buffered Streams

Buffer giảm số lần gọi I/O hệ thống — tăng hiệu suất đáng kể:

```java
// Không buffer — mỗi write() là 1 system call
try (FileWriter fw = new FileWriter("slow.txt")) {
    for (int i = 0; i < 10000; i++) {
        fw.write("data\n"); // 10000 system calls
    }
}

// Có buffer — gom dữ liệu, ghi 1 lần (hoặc khi buffer đầy)
try (BufferedWriter bw = new BufferedWriter(new FileWriter("fast.txt"))) {
    for (int i = 0; i < 10000; i++) {
        bw.write("data\n"); // chỉ ~10 system calls
    }
}

// BufferedReader với readLine()
try (BufferedReader br = new BufferedReader(new FileReader("data.csv"))) {
    br.lines()  // Stream<String>
        .skip(1) // bỏ header
        .map(line -> line.split(","))
        .forEach(cols -> System.out.println(cols[0]));
}
```

## 3. java.nio — Non-Blocking I/O

### 3.1. Core Components

| Thành phần | Mô tả |
|---|---|
| **Buffer** | Container cho dữ liệu (read/write) |
| **Channel** | Conduit mở kết nối I/O (file/socket) |
| **Charset** | Mã hóa/giải mã ký tự |
| **Selector** | 1 thread xử lý nhiều channel (multiplexing) |

### 3.2. Buffer

```java
// ByteBuffer — các loại
ByteBuffer buffer = ByteBuffer.allocate(1024);    // Heap buffer
ByteBuffer direct = ByteBuffer.allocateDirect(1024); // Off-heap, OS-level

// Buffer operations
ByteBuffer buf = ByteBuffer.allocate(10);
buf.put((byte) 1);
buf.put((byte) 2);
buf.put((byte) 3);

// Flip — chuyển từ write mode sang read mode
buf.flip();

// Read
while (buf.hasRemaining()) {
    System.out.println(buf.get());
}

// Compact — giữ lại dữ liệu chưa đọc, xóa phần đã đọc
buf.compact();

// Clear — xóa buffer, quay lại write mode
buf.clear();
```

### 3.3. Channel — File

```java
// Đọc file với FileChannel
try (FileInputStream fis = new FileInputStream("data.txt");
     FileChannel channel = fis.getChannel()) {

    ByteBuffer buf = ByteBuffer.allocate(1024);
    channel.read(buf);
    buf.flip();
    String content = StandardCharsets.UTF_8.decode(buf).toString();
    System.out.println(content);
}

// Ghi file với FileChannel
try (FileOutputStream fos = new FileOutputStream("output.txt");
     FileChannel channel = fos.getChannel()) {

    ByteBuffer buf = StandardCharsets.UTF_8.encode("Hello, NIO!");
    channel.write(buf);
}

// Copy file với Channel
try (FileInputStream fis = new FileInputStream("source.txt");
     FileOutputStream fos = new FileOutputStream("dest.txt")) {

    FileChannel in = fis.getChannel();
    FileChannel out = fos.getChannel();
    in.transferTo(0, in.size(), out); // efficient OS-level transfer
}
```

### 3.4. Path, Files

```java
import java.nio.file.*;

// Path — đại diện đường dẫn
Path path = Path.of("src/main/java/App.java");
Path absolute = path.toAbsolutePath();
Path normalized = path.normalize();

// Files — utility cho file operations
Path file = Path.of("test.txt");

// Đọc/ghi
String content = Files.readString(file);
Files.writeString(file, "Hello, Java!");

// Duyệt thư mục
try (DirectoryStream<Path> stream = Files.newDirectoryStream(Path.of("src"))) {
    for (Path entry : stream) {
        System.out.println(entry.getFileName());
    }
}

// Walk file tree
Files.walk(Path.of("."))
    .filter(p -> p.toString().endsWith(".java"))
    .forEach(System.out::println);

// Tạo temp file/directory
Path tempFile = Files.createTempFile("prefix", ".tmp");
Path tempDir = Files.createTempDirectory("dir");
```

### 3.5. Selector và Non-Blocking Network I/O

Khi cần một thread xử lý nhiều kết nối socket cùng lúc, `Selector` cho phép theo dõi nhiều `Channel` ở chế độ non-blocking thay vì chặn trên từng kết nối.

```java
Selector selector = Selector.open();
ServerSocketChannel server = ServerSocketChannel.open();
server.configureBlocking(false);
server.bind(new InetSocketAddress(8080));
server.register(selector, SelectionKey.OP_ACCEPT);
```

## 4. Serialization

Biến **object Java thành dãy byte** để lưu vào file hoặc truyền qua mạng.

### 4.1. Serialization cơ bản

```java
import java.io.*;

class Person implements Serializable {
    private static final long serialVersionUID = 1L;

    private String name;
    private int age;
    // transient — không serialize
    private transient String password;

    public Person(String name, int age, String password) {
        this.name = name;
        this.age = age;
        this.password = password;
    }

    @Override
    public String toString() {
        return "Person{name='" + name + "', age=" + age + "}";
    }
}

// Serialize (object → byte[])
try (ObjectOutputStream oos = new ObjectOutputStream(
        new FileOutputStream("person.ser"))) {
    Person person = new Person("Alice", 25, "secret");
    oos.writeObject(person);
}

// Deserialize (byte[] → object)
try (ObjectInputStream ois = new ObjectInputStream(
        new FileInputStream("person.ser"))) {
    Person p = (Person) ois.readObject();
    // p.password == null vì transient
    System.out.println(p);
}
```

### 4.2. Custom Serialization

```java
class User implements Serializable {
    private static final long serialVersionUID = 1L;
    private String username;
    private String password; // mã hóa trước khi serialize

    private void writeObject(ObjectOutputStream out) throws IOException {
        out.defaultWriteObject();
        // Mã hóa password khi ghi
        String encoded = Base64.getEncoder().encodeToString(
            password.getBytes(StandardCharsets.UTF_8));
        out.writeObject(encoded);
    }

    private void readObject(ObjectInputStream in)
            throws IOException, ClassNotFoundException {
        in.defaultReadObject();
        // Giải mã password khi đọc
        String encoded = (String) in.readObject();
        password = new String(Base64.getDecoder().decode(encoded));
    }
}
```

### 4.3. Lưu ý quan trọng

| Keyword | Mục đích |
|---|---|
| `serialVersionUID` | Nên định nghĩa — tránh lỗi khi thay đổi class |
| `transient` | Bỏ qua field khi serialize |
| `static` | Không serialize (thuộc về class, không phải instance) |

> **Lưu ý:** Serialization trong Java có nhiều vấn đề bảo mật. Java 17+ khuyến nghị dùng **JSON** (Jackson/Gson) hoặc **Protobuf** thay vì serialization truyền thống.

## 5. try-with-resources

Tự động đóng tài nguyên (`Closeable`/`AutoCloseable`) khi thoát khỏi block — không cần `finally`.

### 5.1. Cú pháp

```java
// Cú pháp cơ bản
try (ResourceType resource = new ResourceType()) {
    // sử dụng resource
} // tự động resource.close()

// Nhiều resources
try (FileInputStream fis = new FileInputStream("a.txt");
     FileOutputStream fos = new FileOutputStream("b.txt")) {
    // sử dụng cả 2
} // cả 2 đều được đóng

// Dùng với Buffered
try (BufferedReader br = new BufferedReader(
        new FileReader("file.txt"));
     BufferedWriter bw = new BufferedWriter(
        new FileWriter("output.txt"))) {
    String line;
    while ((line = br.readLine()) != null) {
        bw.write(line);
        bw.newLine();
    }
} // cả BufferedReader và BufferedWriter đều đóng
```

### 5.2. So sánh với try-finally

```java
// try-finally — verbose, dễ lỗi
FileInputStream fis = null;
try {
    fis = new FileInputStream("file.txt");
    // xử lý
} finally {
    if (fis != null) {
        try { fis.close(); } catch (IOException e) { }
    }
}

// try-with-resources — ngắn gọn, đảm bảo close()
try (FileInputStream fis = new FileInputStream("file.txt")) {
    // xử lý
} // tự động close(), cả exception đọc và close đều được xử lý
```

### 5.3. Ví dụ thực tế

`try-with-resources` rất hay gặp trong code backend thực tế: đọc file cấu hình, làm việc với JDBC, thao tác socket, hoặc stream response từ dịch vụ khác.

```java
try (Connection conn = dataSource.getConnection();
     PreparedStatement stmt = conn.prepareStatement(
         "select id, name from users where active = ?")) {
    stmt.setBoolean(1, true);
    ResultSet rs = stmt.executeQuery();
    while (rs.next()) {
        System.out.println(rs.getLong("id"));
    }
}
```

## 6. File Operations

### 6.1. Dùng `java.io.File`

```java
File file = new File("path/to/file.txt");

file.exists();              // Kiểm tra tồn tại
file.isFile();              // Có phải file?
file.isDirectory();         // Có phải thư mục?
file.length();              // Kích thước theo byte
file.lastModified();        // Thời gian sửa gần nhất
file.mkdir();               // Tạo thư mục
file.mkdirs();              // Tạo thư mục + parent directories
file.delete();              // Xóa file/thư mục
file.renameTo(new File("new.txt"));  // Đổi tên / move
file.listFiles();           // Liệt kê file trong thư mục
```

### 6.2. Dùng `java.nio.file`

```java
Path path = Path.of("path/to/file.txt");

Files.exists(path);
Files.notExists(path);

List<String> lines = Files.readAllLines(path);
String content = Files.readString(path); // Java 11+

Files.writeString(path, "Hello");
Files.write(path, bytes);

Files.copy(from, to, StandardCopyOption.REPLACE_EXISTING);
Files.move(from, to, StandardCopyOption.ATOMIC_MOVE);

Files.createDirectory(path);
Files.createDirectories(path);

Files.walk(path)
    .filter(p -> p.toString().endsWith(".java"))
    .forEach(System.out::println);

try (Stream<String> linesStream = Files.lines(path)) {
    long count = linesStream.filter(line -> line.contains("TODO")).count();
}
```

Trong code backend hiện đại, `Path`/`Files` thường được ưu tiên hơn `File` vì API giàu hơn, rõ ràng hơn, và hợp với NIO.

## 7. Buffered I/O Performance

Luôn ưu tiên buffered I/O khi đọc/ghi nhiều dữ liệu nhỏ lặp lại, vì giảm số lần system call đáng kể.

| Tình huống | Khuyến nghị |
|---|---|
| Đọc/ghi nhỏ, lặp lại | Dùng `BufferedInputStream`, `BufferedReader`, `BufferedWriter` |
| Copy file lớn | Dùng buffer lớn, `Files.copy()`, hoặc `FileChannel.transferTo()` |
| Đọc từng dòng text | `BufferedReader.readLine()` |
| Truy cập ngẫu nhiên | `RandomAccessFile` hoặc `FileChannel` |
| Networking throughput cao | `SocketChannel`, `Selector`, hoặc framework NIO-based |

```java
// Unbuffered — chậm, đọc từng byte
try (FileInputStream fis = new FileInputStream("large.txt");
     FileOutputStream fos = new FileOutputStream("copy.txt")) {
    int b;
    while ((b = fis.read()) != -1) {
        fos.write(b);
    }
}

// Buffered — nhanh hơn đáng kể
try (BufferedInputStream bis = new BufferedInputStream(
        new FileInputStream("large.txt"));
     BufferedOutputStream bos = new BufferedOutputStream(
        new FileOutputStream("copy.txt"))) {
    byte[] buffer = new byte[8192];
    int n;
    while ((n = bis.read(buffer)) != -1) {
        bos.write(buffer, 0, n);
    }
}

// NIO copy
Files.copy(Path.of("large.txt"), Path.of("copy.txt"),
    StandardCopyOption.COPY_ATTRIBUTES,
    StandardCopyOption.REPLACE_EXISTING);
```

## 8. Common I/O Patterns

### 8.1. Đọc input từ người dùng

```java
try (BufferedReader reader = new BufferedReader(
        new InputStreamReader(System.in))) {
    System.out.print("Enter your name: ");
    String name = reader.readLine();
}

Scanner scanner = new Scanner(System.in);
int num = scanner.nextInt();
String line = scanner.nextLine();

Console console = System.console();
if (console != null) {
    String username = console.readLine("Username: ");
    char[] password = console.readPassword("Password: ");
}
```

### 8.2. Đọc tài nguyên từ classpath

```java
try (InputStream is = getClass().getClassLoader()
        .getResourceAsStream("config.properties")) {
    Properties props = new Properties();
    props.load(is);
}

Path configPath = Path.of(
    getClass().getClassLoader().getResource("config.xml").toURI());
Document doc = DocumentBuilderFactory.newInstance()
    .newDocumentBuilder().parse(configPath.toFile());
```

Các pattern này xuất hiện nhiều trong backend thực tế: đọc config, stream dữ liệu lớn, load template/resource trong JAR, hoặc xử lý import/export file.

## 9. I/O vs NIO Comparison

| Tiêu chí | `java.io` | `java.nio` |
|---|---|---|
| Mô hình I/O | Blocking | Blocking + Non-blocking |
| Cách truy cập dữ liệu | Stream tuần tự | Buffer / channel |
| Channel | Không | Có |
| Selector | Không | Có |
| Bộ nhớ | Chủ yếu heap | Heap + direct buffer |
| Khả năng scale nhiều kết nối | Kém hơn | Tốt hơn |
| Dùng tốt cho | File nhỏ, code đơn giản | Networking, file lớn, throughput cao |
| Độ phức tạp | Thấp | Cao hơn |

Tóm ngắn gọn:

- `java.io` dễ học, hợp cho tác vụ đơn giản
- `java.nio` mạnh hơn khi cần hiệu năng, networking, hoặc non-blocking I/O
- trong backend hiện đại, hiểu cả hai là cần thiết vì framework và thư viện có thể dùng cả hai kiểu API

## 10. Câu hỏi phỏng vấn thường gặp

### 10.1. `InputStream` khác `Reader` như thế nào?

`InputStream` xử lý byte thô, còn `Reader` xử lý ký tự nên phụ thuộc vào text encoding.

### 10.2. Khi nào nên dùng `FileChannel` thay vì stream truyền thống?

Dùng `FileChannel` khi cần throughput cao hơn, đọc ghi theo vị trí, memory-mapped file, hoặc tích hợp với các API NIO khác.

### 10.3. Khi nào selector thực sự hữu ích?

Selector hữu ích khi một thread phải quản lý rất nhiều kết nối mạng mà không muốn block riêng trên từng kết nối.
