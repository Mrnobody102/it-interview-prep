# Java I/O

## 1. Overview

Java provides two main I/O APIs:

| API | Package | Characteristics |
|-----|---------|----------------|
| **java.io** | `java.io.*` | Stream-based, blocking I/O, byte/character streams |
| **java.nio** | `java.nio.*` | Non-blocking I/O, buffer-oriented, optimized for large data and networking |

---

## 2. java.io — Stream-Based I/O

### 2.1. Stream Overview

Streams are **sequential** flows of data. All stream classes in `java.io` follow this model.

```
Input Stream:  Source → [Stream] → Program
Output Stream: Program → [Stream] → Destination
```

### 2.2. Byte Streams

Handle **binary data** (images, audio, files).

| Class | Description |
|-------|-------------|
| `InputStream` | Abstract class for reading byte streams |
| `OutputStream` | Abstract class for writing byte streams |
| `FileInputStream` | Read bytes from a file |
| `FileOutputStream` | Write bytes to a file |
| `BufferedInputStream` | Buffered wrapper for byte input |
| `BufferedOutputStream` | Buffered wrapper for byte output |
| `DataInputStream` | Read primitive Java data types |
| `DataOutputStream` | Write primitive Java data types |

```java
// Basic file copy using byte streams
try (FileInputStream fis = new FileInputStream("input.dat");
     FileOutputStream fos = new FileOutputStream("output.dat")) {
    int byteRead;
    while ((byteRead = fis.read()) != -1) {
        fos.write(byteRead);
    }
}

// Buffered for better performance
try (BufferedInputStream bis = new BufferedInputStream(
        new FileInputStream("large.bin"));
     BufferedOutputStream bos = new BufferedOutputStream(
        new FileOutputStream("copy.bin"))) {
    byte[] buffer = new byte[8192];
    int bytesRead;
    while ((bytesRead = bis.read(buffer)) != -1) {
        bos.write(buffer, 0, bytesRead);
    }
}
```

### 2.3. Character Streams

Handle **Unicode text** — internally uses byte streams with charset encoding.

| Class | Description |
|-------|-------------|
| `Reader` | Abstract class for reading character streams |
| `Writer` | Abstract class for writing character streams |
| `FileReader` | Read characters from a file (uses platform default charset) |
| `FileWriter` | Write characters to a file |
| `BufferedReader` | Buffered wrapper for character input (includes `readLine()`) |
| `BufferedWriter` | Buffered wrapper for character output |
| `PrintWriter` | Print formatted output (println, printf) |
| `InputStreamReader` | Bridge from byte stream to character stream (specify charset) |
| `OutputStreamWriter` | Bridge from character stream to byte stream (specify charset) |

```java
// Reading text files
try (BufferedReader reader = new BufferedReader(
        new FileReader("input.txt"))) {
    String line;
    while ((line = reader.readLine()) != null) {
        System.out.println(line);
    }
}

// Writing with PrintWriter (auto-flush)
try (PrintWriter writer = new PrintWriter(
        new BufferedWriter(new FileWriter("output.txt")))) {
    writer.println("Hello, World!");
    writer.printf("Value: %d, String: %s%n", 42, "test");
}

// Specify charset explicitly
try (BufferedReader reader = new BufferedReader(
        new InputStreamReader(
            new FileInputStream("data.txt"), StandardCharsets.UTF_8))) {
}
```

---

## 3. java.nio — Buffer-Oriented I/O

`java.nio` provides **buffer-oriented**, **channel-based** I/O with support for **non-blocking operations**.

### 3.1. Core Components

| Component | Description |
|-----------|-------------|
| **Buffer** | Container for data (read/write). Wraps a primitive array |
| **Channel** | Gateway for I/O operations (file or socket) |
| **Selector** | Enables multiplexed non-blocking I/O for multiple channels |
| **Charset** | Encodes/decodes character sets (UTF-8, ISO-8859-1, etc.) |

### 3.2. Buffers

```java
// Create a ByteBuffer
ByteBuffer buffer = ByteBuffer.allocate(1024);         // Heap buffer
ByteBuffer direct = ByteBuffer.allocateDirect(1024);    // Direct buffer (off-heap)

// Buffer operations
buffer.put((byte) 1);
buffer.putInt(42);
buffer.putChar('A');

// Switch to read mode
buffer.flip();  // limit=position, position=0

// Read from buffer
byte b = buffer.get();
int num = buffer.getInt();

// Compact (keep unread data, discard read data)
buffer.compact();

// Clear (reset for writing)
buffer.clear();
```

### 3.3. Channels

```java
// FileChannel for reading/writing files with NIO
try (FileChannel channel = FileChannel.open(
        Path.of("data.bin"),
        StandardOpenOption.READ,
        StandardOpenOption.WRITE,
        StandardOpenOption.CREATE)) {

    ByteBuffer buffer = ByteBuffer.allocate(1024);

    // Read from file
    channel.read(buffer);
    buffer.flip();
    System.out.println(Charset.defaultCharset()
        .decode(buffer).toString());
    buffer.clear();

    // Write to file
    String content = "Hello, NIO!";
    buffer.put(content.getBytes());
    buffer.flip();
    channel.write(buffer);
}
```

---

## 4. Serialization

Serialization converts an **object to a byte stream** for persistence or network transfer. Deserialization reverses the process.

### 4.1. Making a Class Serializable

```java
import java.io.Serializable;

public class Person implements Serializable {
    private static final long serialVersionUID = 1L;

    private String name;
    private int age;
    private transient String password;  // Not serialized

    public Person(String name, int age, String password) {
        this.name = name;
        this.age = age;
        this.password = password;
    }
}
```

### 4.2. Serialization Keywords

| Keyword | Effect |
|---------|--------|
| `serialVersionUID` | Version number for compatibility; must match during deserialization |
| `transient` | Field is **skipped** during serialization |
| `static` fields | Not serialized (belong to class, not instance) |

### 4.3. Serializing and Deserializing

```java
// Serialize
Person person = new Person("Alice", 30, "secret");

try (ObjectOutputStream oos = new ObjectOutputStream(
        new FileOutputStream("person.ser"))) {
    oos.writeObject(person);
}

// Deserialize
try (ObjectInputStream ois = new ObjectInputStream(
        new FileInputStream("person.ser"))) {
    Person loaded = (Person) ois.readObject();
    // password will be null (transient)
}
```

### 4.4. Custom Serialization

```java
class CustomSerialization implements Serializable {
    private String data;

    // Called during serialization
    private void writeObject(ObjectOutputStream out) throws IOException {
        out.defaultWriteObject();
        // Custom logic: encrypt data before writing
        out.writeObject(encrypt(data));
    }

    // Called during deserialization
    private void readObject(ObjectInputStream in)
            throws IOException, ClassNotFoundException {
        in.defaultReadObject();
        // Custom logic: decrypt data after reading
        data = decrypt((String) in.readObject());
    }
}
```

---

## 5. try-with-resources

The `try-with-resources` statement ensures that **resources are closed automatically** at the end of the try block, even if exceptions occur.

### 5.1. Syntax

```java
try (ResourceType resource = initialization) {
    // use resource
} catch (ExceptionType e) {
    // handle exception
}
```

> **Note:** Any object implementing `java.lang.AutoCloseable` can be used with try-with-resources. This includes streams, readers, writers, connections, channels, and more.

### 5.2. Examples

```java
// File I/O
try (BufferedReader reader = new BufferedReader(
        new FileReader("file.txt"));
     BufferedWriter writer = new BufferedWriter(
        new FileWriter("output.txt"))) {
    String line;
    while ((line = reader.readLine()) != null) {
        writer.write(line);
        writer.newLine();
    }
}  // Resources closed automatically

// Database connection
try (Connection conn = dataSource.getConnection();
     PreparedStatement stmt = conn.prepareStatement(sql)) {
    ResultSet rs = stmt.executeQuery();
    while (rs.next()) {
        process(rs);
    }
}

// Multiple resources
try (var in = new FileInputStream("in.txt");
     var out = new FileOutputStream("out.txt")) {
    in.transferTo(out);
}

// Resource with try-with-resources (Java 9+)
FileInputStream in = new FileInputStream("in.txt");
FileOutputStream out = new FileOutputStream("out.txt");
try (in; out) {  // Effectively final variables
    in.transferTo(out);
}
```

---

## 6. File Operations

### 6.1. Using java.io.File

```java
File file = new File("path/to/file.txt");

file.exists();              // Check existence
file.isFile();              // Is a file?
file.isDirectory();         // Is a directory?
file.length();              // File size in bytes
file.lastModified();        // Last modified timestamp
file.mkdir();               // Create directory
file.mkdirs();             // Create directory + parents
file.delete();              // Delete file/directory
file.renameTo(new File("new.txt"));  // Rename/move
file.listFiles();           // List files in directory
```

### 6.2. Using java.nio.file (Java 7+)

```java
Path path = Path.of("path/to/file.txt");

// Check existence
Files.exists(path);
Files.notExists(path);

// Read all lines
List<String> lines = Files.readAllLines(path);

// Read entire file as string (Java 11+)
String content = Files.readString(path);

// Write
Files.writeString(path, "Hello");
Files.write(path, bytes);

// Copy / Move
Files.copy(from, to, StandardCopyOption.REPLACE_EXISTING);
Files.move(from, to, StandardCopyOption.ATOMIC_MOVE);

// Directory operations
Files.createDirectory(path);
Files.createDirectories(path);  // Creates parent dirs
Files.walk(path)                // Walk directory tree
    .filter(p -> p.toString().endsWith(".java"))
    .forEach(System.out::println);

// BufferedReader lines (lazy)
try (Stream<String> lines = Files.lines(path)) {
    long count = lines.filter(l -> l.contains("TODO"))
                      .count();
}
```

---

## 7. Buffered I/O Performance

Always wrap streams with **buffered** versions for better performance.

| Scenario | Recommendation |
|----------|---------------|
| **Small reads/writes** | Always use buffered streams |
| **Large file copy** | Buffered byte/char streams, or `Files.copy()`, or `FileChannel.transferTo()` |
| **Random access** | Use `RandomAccessFile` or `FileChannel` |
| **Line-by-line reading** | `BufferedReader` with `readLine()` |
| **Network I/O** | Use `java.nio.channels.SocketChannel` or `java.net.http.HttpClient` |

```java
// Poor performance (unbuffered)
try (FileInputStream fis = new FileInputStream("large.txt");
     FileOutputStream fos = new FileOutputStream("copy.txt")) {
    int b;
    while ((b = fis.read()) != -1) {  // Reads ONE BYTE at a time
        fos.write(b);
    }
}

// Good performance (buffered)
try (BufferedInputStream bis = new BufferedInputStream(
        new FileInputStream("large.txt"));
     BufferedOutputStream bos = new BufferedOutputStream(
        new FileOutputStream("copy.txt"))) {
    byte[] buffer = new byte[8192];
    int n;
    while ((n = bis.read(buffer)) != -1) {  // Reads BUFFER SIZE at a time
        bos.write(buffer, 0, n);
    }
}

// Best performance (java.nio)
Files.copy(Path.of("large.txt"), Path.of("copy.txt"),
    StandardCopyOption.COPY_ATTRIBUTES,
    StandardCopyOption.REPLACE_EXISTING);
```

---

## 8. Common I/O Patterns

### 8.1. Reading User Input

```java
// Using BufferedReader (classic)
try (BufferedReader reader = new BufferedReader(
        new InputStreamReader(System.in))) {
    System.out.print("Enter your name: ");
    String name = reader.readLine();
}

// Using Scanner (convenient but slower)
Scanner scanner = new Scanner(System.in);
int num = scanner.nextInt();
String line = scanner.nextLine();

// Using java.io.Console (for password input)
Console console = System.console();
if (console != null) {
    String username = console.readLine("Username: ");
    char[] password = console.readPassword("Password: ");
}
```

### 8.2. Reading Resources from Classpath

```java
// Read a file from classpath (e.g., in a JAR)
try (InputStream is = getClass().getClassLoader()
        .getResourceAsStream("config.properties")) {
    Properties props = new Properties();
    props.load(is);
}

// Using Files (Java 9+)
Path configPath = Path.of(
    getClass().getClassLoader().getResource("config.xml").toURI());
Document doc = DocumentBuilderFactory.newInstance()
    .newDocumentBuilder().parse(configPath.toFile());
```

---

## 9. I/O vs NIO Comparison

| Aspect | java.io (Streams) | java.nio (Buffers/Channels) |
|--------|------------------|---------------------------|
| **I/O Model** | Blocking only | Blocking + Non-blocking |
| **Data Access** | Stream-oriented (sequential) | Buffer-oriented (random access) |
| **Channels** | No | Yes |
| **Selectors** | No | Yes (multiplexing) |
| **Memory** | Heap-based | Heap + Direct (off-heap) |
| **Scalability** | Poor for many connections | Excellent (selectors, multiplexing) |
| **Best for** | Simple file I/O, small data | Large files, high-throughput, networking |
| **Complexity** | Simple | More complex |
