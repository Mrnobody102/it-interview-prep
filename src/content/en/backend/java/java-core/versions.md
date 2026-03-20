# Java Key Versions

## 1. Java Release Cadence

| Period | Cadence |
|--------|---------|
| Java 8 - Java 10 | New release every 6 months |
| Java 11 - Java 16 | New release every 6 months |
| Java 17+ (LTS) | New LTS release every 2 years |

> **Note:** As of Java 17, LTS (Long-Term Support) versions are released every 2 years. The current LTS versions are **Java 17** and **Java 21**.

---

## 2. Java 8 (March 2014)

Java 8 was a landmark release introducing **functional programming** features.

### 2.1. Lambda Expressions & Method References

```java
// Lambda expression
Comparator<String> comp = (a, b) -> a.length() - b.length();

// Method reference
List<String> names = Arrays.asList("Alice", "Bob");
names.forEach(System.out::println);
```

### 2.2. Functional Interfaces

| Interface | Method | Description |
|-----------|--------|-------------|
| `Function<T,R>` | `R apply(T t)` | Transform T to R |
| `Predicate<T>` | `boolean test(T t)` | Test a condition |
| `Consumer<T>` | `void accept(T t)` | Process T, no return |
| `Supplier<T>` | `T get()` | Produce T |

### 2.3. Stream API

```java
List<Integer> evens = numbers.stream()
    .filter(n -> n % 2 == 0)
    .collect(Collectors.toList());
```

### 2.4. Default Methods in Interfaces

```java
interface Printable {
    void print();

    default void welcome() {
        System.out.println("Welcome!");
    }
}
```

### 2.5. New Date/Time API (`java.time`)

```java
LocalDate today = LocalDate.now();
LocalDateTime now = LocalDateTime.now();
Duration duration = Duration.between(start, end);
Period period = Period.between(date1, date2);
```

### 2.6. Other Notable Features

- `Optional<T>` — eliminates null checks
- `Base64` encoding/decoding
- `Collectors` utility class
- `java.time` (new Date/Time API)
- Parallel array sorting (`Arrays.parallelSort`)
- Nashorn JavaScript engine

---

## 3. Java 11 (September 2018)

First **LTS** release after Java 8. Major changes.

### 3.1. String Improvements

```java
// New String methods
"  hello  ".isBlank();           // true
"hello".repeat(3);               // "hellohellohello"
"hello\nworld".lines();           // Stream<String>
```

### 3.2. File Methods

```java
// Read file to String (Java 11)
String content = Files.readString(Path.of("file.txt"));

// Write String to file (Java 11)
Files.writeString(Path.of("file.txt"), "content");
```

### 3.3. Collection to Array

```java
// toArray with generator (Java 11)
String[] arr = list.toArray(String[]::new);
```

### 3.4. HTTP Client (Incubator in Java 9, Standard in Java 11)

```java
HttpClient client = HttpClient.newHttpClient();
HttpRequest request = HttpRequest.newBuilder()
    .uri(URI.create("https://api.example.com/data"))
    .GET()
    .build();

HttpResponse<String> response = client.send(request,
    HttpResponse.BodyHandlers.ofString());
```

### 3.5. Other Notable Features

- **Local-Variable Syntax for Lambda** (`var` in lambdas)
- `Optional.isEmpty()` (Java 11)
- `Predicate.not()` (Java 11)
- Run source file directly: `java File.java`
- Flight Recorder (open-sourced)
- ZGC Garbage Collector (experimental)
- Remove Java EE and CORBA modules

---

## 4. Java 17 (September 2021) — LTS

### 4.1. Sealed Classes

Restrict which classes can extend or implement a given class/interface.

```java
public sealed class Shape permits Circle, Rectangle, Triangle {
}

final class Circle extends Shape { }
sealed class Rectangle extends Shape { }
non-sealed class Triangle extends Shape { }
```

### 4.2. Pattern Matching for instanceof

```java
// Before Java 16
if (obj instanceof String) {
    String s = (String) obj;
    System.out.println(s.length());
}

// Java 16+ (pattern variable)
if (obj instanceof String s) {
    System.out.println(s.length());  // s is in scope
}
```

### 4.3. Records (Java 16 — Preview in 14/15)

Immutable data carrier classes with automatic `equals`, `hashCode`, `toString`, and constructor.

```java
record Point(int x, int y) {
    // Compact constructor for validation
    public Point {
        if (x < 0 || y < 0) {
            throw new IllegalArgumentException("Coordinates must be non-negative");
        }
    }
}

// Auto-generated: constructor, getters (x(), y()),
//                 equals(), hashCode(), toString()
Point p = new Point(10, 20);
int x = p.x();  // accessor method
```

### 4.4. Text Blocks

Multi-line string literals without escape characters.

```java
String json = """
    {
        "name": "Alice",
        "age": 30
    }
    """;

String html = """
    <html>
        <body>
            <p>Hello, %s</p>
        </body>
    </html>
    """.formatted("World");
```

### 4.5. Other Notable Features

- **New Random Number Generators** (`RandomGenerator` interface)
- **Strong encapsulation of JDK internals**
- **Enhanced Pseudo-Random Number Generators**
- **Foreign Function & Memory API (Preview)**
- **Pattern Matching for switch (Preview in 17)**
- **Sealed Classes (Final)**

---

## 5. Java 21 (September 2023) — LTS

### 5.1. Virtual Threads (Project Loom) — Production Ready

Lightweight threads managed by the JVM, not the OS. Designed to handle millions of concurrent connections with minimal cost.

```java
// Create a virtual thread
Thread vt = Thread.ofVirtual().start(() -> {
    System.out.println("Running in a virtual thread");
});

// Using ExecutorService
try (ExecutorService executor = Executors.newVirtualThreadPerTaskExecutor()) {
    Future<String> future = executor.submit(() -> "Hello");
    String result = future.get();
}
```

> **Tip:** Virtual threads are ideal for **I/O-bound** tasks (HTTP calls, database queries). For **CPU-bound** tasks, platform threads are still appropriate.

### 5.2. Pattern Matching for switch (Final)

```java
// Traditional switch
String description;
switch (obj) {
    case Integer i -> description = "Integer: " + i;
    case String s -> description = "String: " + s;
    case null, default -> description = "Other";
}

// With guards
switch (obj) {
    case Integer i when i > 0 -> description = "Positive int: " + i;
    case Integer i -> description = "Non-positive int: " + i;
    default -> description = "Unknown";
}
```

### 5.3. Record Patterns (Final)

Decompose records in pattern matching.

```java
record Point(int x, int y) {}
record Line(Point start, Point end) {}

// Pattern matching with records
void printLine(Line line) {
    switch (line) {
        case Line(Point(int x1, int y1), Point(int x2, int y2)) -> {
            System.out.println("Line from (" + x1 + "," + y1 + ") to (" + x2 + "," + y2 + ")");
        }
        case null -> System.out.println("Null line");
    }
}
```

### 5.4. String Templates (Preview in 21, Second Preview in 22)

```java
String name = "Alice";
int age = 30;
String message = STR."Hello, \{name}! You are \{age} years old.";
// "Hello, Alice! You are 30 years old."
```

### 5.5. Foreign Function & Memory API

Work with native memory and native code without JNI complexity.

```java
MemorySegment segment = MemorySegment.ofArray(new byte[]{1, 2, 3});
```

### 5.6. Other Notable Features

| Feature | Description |
|---------|-------------|
| **Unnamed Patterns and Variables** (`_`) | Disallow specific pattern variables |
| **Unnamed Classes and Instance Main Methods** | Simplified main method |
| **Sequenced Collections** | New interface for collections with defined encounter order |
| **Scoped Values (Preview)** | Share immutable data between threads efficiently |
| **Foreign Function & Memory API** | Replace JNI with safer, more performant API |
| **Region-Based Memory Management (Preview)** | Memory regions for safer native memory access |

---

## 6. Version Quick Reference

| Version | Release Date | LTS | Key Features |
|---------|-------------|-----|-------------|
| Java 8 | Mar 2014 | Yes | Lambda, Stream, Optional, `java.time` |
| Java 11 | Sep 2018 | Yes | HTTP Client, String improvements, `var` in lambdas, ZGC |
| Java 17 | Sep 2021 | Yes | Sealed Classes, Records, Pattern Matching `instanceof`, Text Blocks |
| Java 21 | Sep 2023 | Yes | Virtual Threads, Pattern Matching `switch`, Record Patterns |

---

## 7. Should I Use the Newest Java?

| Project Type | Recommendation |
|-------------|----------------|
| **New projects** | Use the latest LTS (Java 21) — Virtual Threads are production-ready |
| **Enterprise/Microservices** | Java 17 LTS — stable, widely supported |
| **Legacy systems** | Stay on Java 11 or 17 until upgrade is planned |
| **Learning** | Use the latest LTS to learn modern features |
