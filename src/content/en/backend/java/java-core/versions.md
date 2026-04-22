# Java Versions

Java now follows a predictable release cadence, but interview preparation usually focuses on the major LTS milestones: Java 8, Java 11, Java 17, and Java 21.

## 1. Java 8

Released in **March 2014**, Java 8 changed how Java code is written in real projects.

| Feature | Why It Matters |
|---|---|
| Lambda expressions | Enables functional-style APIs |
| Method references | Cleaner lambda syntax |
| Stream API | Declarative collection processing |
| Optional | Better null-handling semantics |
| `java.time` API | Modern replacement for `Date` and `Calendar` |
| Default methods | Lets interfaces evolve safely |
| CompletableFuture | Better asynchronous programming |

Java 8 still appears everywhere in interviews because it introduced the baseline of "modern Java". Even if a codebase now runs Java 17 or 21, the shift toward lambdas, streams, Optional, and immutable-style APIs started here.

### 1.1. Example of Major Features

```java
List<String> names = List.of("Alice", "Bob", "Charlie");

names.stream()
    .filter(name -> name.length() > 3)
    .map(String::toUpperCase)
    .forEach(System.out::println);

Optional<String> nick = Optional.ofNullable(findNickname());
String result = nick.orElse("Unknown");

LocalDate today = LocalDate.now();
```

In backend code, the most commonly used Java 8 additions are usually:

- Stream pipelines for collection transformations
- `Optional` at API boundaries
- `CompletableFuture` for async composition
- `java.time` everywhere dates or timestamps matter

## 2. Java 11 (LTS)

Released in **September 2018**, Java 11 became a long-lived enterprise baseline for many backend systems.

| Feature | Description |
|---|---|
| `var` in lambda parameters | Cleaner functional syntax when annotations are needed |
| New `String` methods | `isBlank()`, `strip()`, `lines()`, `repeat()` |
| `Files.readString()` / `writeString()` | Simpler file handling |
| HTTP Client | Modern replacement for `HttpURLConnection` |
| Run source directly | `java Hello.java` |
| ZGC introduction | Low-latency GC option |

Java 11 was also operationally important because it became the next major LTS after Java 8, giving many enterprises a realistic migration target without forcing them onto preview-heavy language features.

For many teams, Java 11 was the upgrade that unlocked a cleaner operational baseline without requiring major application redesign.

It was often the first realistic step out of long-lived Java 8 estates.

In practice, Java 11 migrations also forced teams to revisit old assumptions around:

- container memory tuning
- removed or deprecated JDK modules
- TLS and HTTP client behavior
- framework compatibility with newer bytecode baselines

That is why "upgrading to Java 11" was often partly a platform modernization project, not just a compiler version bump.

## 3. Java 17 (LTS)

Released in **September 2021**, Java 17 is still one of the safest default choices for enterprise applications.

Java 17 is where the language starts to feel significantly more expressive without becoming risky for mainstream production adoption.

That balance is why it remains such a common recommendation for stable greenfield services.

It gives teams meaningful language improvements without pushing them onto the bleeding edge.

### 3.1. Sealed Classes

Sealed classes restrict who can extend or implement a type.

```java
public sealed interface Shape permits Circle, Rectangle {
}
```

This is useful when a domain has a closed set of variants, such as command types, payment results, or AST nodes.

### 3.2. Pattern Matching for instanceof

Java can combine type checking and casting in a single expression.

```java
if (obj instanceof String s) {
    System.out.println(s.toUpperCase());
}
```

This reduces boilerplate and makes branching logic safer because the compiler understands the narrowed type within the guarded block.

### 3.3. Records

Records are compact immutable data carriers.

```java
public record UserDto(Long id, String name) {
}
```

Records are especially useful for:

- DTOs
- API responses
- value objects
- query result projections

They are less suitable when a type needs rich mutable lifecycle behavior, ORM-style proxying, or inheritance-heavy modeling.

That distinction is useful in interviews because it shows you understand records as a modeling tool, not just a syntax shortcut.

### 3.4. Text Blocks

Text blocks simplify long multiline strings such as JSON, SQL, or HTML fragments.

```java
String json = """
    {
      "name": "Alice"
    }
    """;
```

This is a small feature with a large ergonomics payoff in tests, templates, and embedded SQL.

### 3.5. Switch Expressions

Switch can now return values directly and supports a cleaner arrow syntax.

```java
String type = switch (day) {
    case "SAT", "SUN" -> "weekend";
    default -> "weekday";
};
```

That makes `switch` more useful in expression-oriented code where mapping input to output cleanly matters.

## 4. Java 21 (LTS)

Released in **September 2023**, Java 21 is the latest LTS and the main target for modern backend platforms moving forward.

Java 21 matters most because it changes concurrency strategy in a practical way. Virtual threads allow many systems to keep a familiar blocking style while handling far more concurrent I/O.

This is a major architectural shift because it changes what "simple and scalable" can look like in Java backend design.

That is why Java 21 discussions are often really concurrency discussions.

### 4.1. Virtual Threads (Project Loom)

Virtual threads drastically reduce the cost of thread-per-task programming, which is especially useful for I/O-heavy services.

```java
try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
    executor.submit(() -> fetchUser());
}
```

They are most valuable when the bottleneck is waiting, not computation. If a workload is CPU-bound, virtual threads improve structure more than throughput.

Two important caveats:

- blocking is cheaper, but not free if downstream systems are overloaded
- older `ThreadLocal` assumptions and thread pinning need review in heavily virtual-threaded designs

The interview-safe framing is: virtual threads simplify I/O concurrency, but they do not remove the need for backpressure, timeouts, and downstream protection.

### 4.2. Pattern Matching for switch

Switch now supports richer pattern matching with type cases and guards.

```java
String result = switch (obj) {
    case String s when s.length() > 5 -> "long string";
    case Integer i -> "int " + i;
    default -> "other";
};
```

This feature pairs especially well with sealed hierarchies because the compiler can help enforce exhaustiveness.

### 4.3. Sequenced Collections (Java 21)

Java now exposes first/last operations consistently across ordered collections and maps.

```java
SequencedMap<String, Integer> map = new LinkedHashMap<>();
map.putFirst("a", 1);
map.putLast("b", 2);
```

It is not as headline-grabbing as virtual threads, but it improves consistency in APIs that already rely on encounter order.

### 4.4. String Templates (Preview, Java 21)

String templates provide a safer and more expressive alternative to manual concatenation.

```java
String name = "Alice";
String greeting = STR."Hello, \{name}";
```

Because this was still preview territory, the interview-safe answer is to treat it as interesting but not yet a universal production baseline.

### 4.5. Unnamed Patterns and Variables (Java 21)

The `_` placeholder is useful when a value is required syntactically but not semantically important.

### 4.6. Foreign Function & Memory API (Java 21)

This API reduces JNI complexity when interoperating with native libraries and off-heap memory.

For most backend developers, this matters less day to day than virtual threads, but it is strategically important for performance-sensitive integrations and systems programming edges.

### 4.7. Structured Concurrency (Java 21, Preview)

Structured concurrency makes related concurrent tasks easier to coordinate, cancel, and observe as a unit.

This is especially useful for request-scoped fan-out work, where several child operations belong to one logical parent request.

### 4.8. Scoped Values (Java 21, Preview)

Scoped values offer a safer alternative to some `ThreadLocal` use cases, especially with virtual threads.

That is important because blindly carrying older `ThreadLocal` habits into a virtual-thread-heavy design can become messy.

## 5. Version Comparison

| Version | Release | LTS | Typical Reason to Use |
|---|---|---|---|
| Java 8 | March 2014 | Yes | Legacy systems, older frameworks, broad compatibility |
| Java 11 | September 2018 | Yes | Stable enterprise baseline |
| Java 17 | September 2021 | Yes | Strong default for mature production systems |
| Java 21 | September 2023 | Yes | Modern systems, virtual threads, newest LTS |

If you need one practical interview summary:

- Java 8 established modern Java style
- Java 11 became the stable enterprise bridge
- Java 17 is the conservative modern default
- Java 21 is the forward-looking LTS

Another practical migration framing is:

- Java 8 to 11: platform cleanup and operational modernization
- Java 11 to 17: language ergonomics with low production risk
- Java 17 to 21: concurrency strategy becomes a first-class design choice

That framing is usually more useful than reciting every feature in chronological order.

Interviewers usually care more about engineering judgment than release-note memorization.

## 6. Common Interview Questions

### 6.1. What Is the Difference Between LTS Versions?

The biggest difference is not just syntax. Each LTS line shifts what is practical in production: Java 8 introduced functional programming primitives, Java 11 stabilized the post-Java-8 platform, Java 17 matured language ergonomics, and Java 21 changes concurrency strategy with virtual threads.

The best answer is usually about operational impact, not just listing language features.

Support policy, framework compatibility, and concurrency model usually matter more than syntax trivia alone.

### 6.2. When Should I Use Virtual Threads?

Use virtual threads when the workload is dominated by blocking I/O such as HTTP calls, database calls, or RPC coordination. They are not a magic fix for CPU-bound work.

They are particularly attractive in services that previously relied on reactive programming mainly to survive thread-count limitations.

### 6.3. Records vs Regular Classes?

Use records when the main purpose of the type is to carry immutable data. Use a regular class when you need mutable state, inheritance flexibility, or complex lifecycle behavior.

If behavior and lifecycle dominate, use a class. If data shape dominates, a record is often cleaner.
