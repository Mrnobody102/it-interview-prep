# Java Lambda & Stream API (Java 8+)

## 1. Lambda Expressions

Lambda expressions provide a **concise syntax** for implementing **functional interfaces** (interfaces with a single abstract method).

### 1.1. Syntax

```java
(parameters) -> expression
(parameters) -> { statements; }
() -> expression
param -> expression        // Single param, parentheses optional
```

### 1.2. Examples

```java
// No parameters
Runnable r = () -> System.out.println("Running...");

// Single parameter (parentheses optional)
Consumer<String> c = s -> System.out.println(s);

// Multiple parameters
BiFunction<Integer, Integer, Integer> add = (a, b) -> a + b;

// Block body
Comparator<String> comp = (s1, s2) -> {
    int cmp = s1.length() - s2.length();
    return cmp == 0 ? s1.compareTo(s2) : cmp;
};
```

### 1.3. Key Functional Interfaces

| Interface | Method | Description |
|-----------|--------|-------------|
| `Runnable` | `void run()` | No input, no output |
| `Supplier<T>` | `T get()` | No input, returns T |
| `Consumer<T>` | `void accept(T t)` | Takes T, returns nothing |
| `BiConsumer<T,U>` | `void accept(T t, U u)` | Takes two inputs |
| `Function<T,R>` | `R apply(T t)` | Takes T, returns R |
| `BiFunction<T,U,R>` | `R apply(T t, U u)` | Takes two inputs, returns R |
| `Predicate<T>` | `boolean test(T t)` | Takes T, returns boolean |
| `UnaryOperator<T>` | `T apply(T t)` | Takes T, returns T |
| `BinaryOperator<T>` | `T apply(T t1, T t2)` | Takes two T, returns T |

---

## 2. Method Reference

A **shorthand** for lambdas that call an existing method.

```java
// Constructor reference
List<String> names = Arrays.asList("Alice", "Bob");
Stream<Person> stream = names.stream().map(Person::new);

// Instance method reference
List<String> list = Arrays.asList("hello", "world");
list.forEach(System.out::println);  // equivalent to s -> System.out.println(s)

// Static method reference
Function<Double, Long> f = Math::round;  // x -> Math.round(x)

// Bound instance method
String prefix = "Hello, ";
Function<String, String> greet = prefix::concat;  // s -> prefix.concat(s)
```

---

## 3. Stream API

A **Stream** is a sequence of elements that supports **functional-style operations** (filter, map, reduce) to process data. Streams do **not** store data — they operate on source data (collections, arrays, I/O).

### 3.1. Stream Lifecycle

```
Source (Collection, Array, File, etc.)
    ↓
Intermediate Operations (lazy) — filter, map, flatMap, distinct, sorted, limit, skip
    ↓
Terminal Operation (eager) — collect, forEach, reduce, count, min, max, sum, anyMatch, allMatch, noneMatch, toArray
```

> **Key concept:** Intermediate operations are **lazy** — they are not executed until a terminal operation is invoked. This enables **optimization** (e.g., short-circuiting with `findFirst`, `limit`).

### 3.2. Creating Streams

```java
// From collection
List<String> list = Arrays.asList("A", "B", "C");
Stream<String> s1 = list.stream();    // sequential
Stream<String> s2 = list.parallelStream();  // parallel

// From array
IntStream s3 = Arrays.stream(new int[]{1, 2, 3});

// From values
Stream<String> s4 = Stream.of("X", "Y", "Z");

// Infinite streams
Stream<Integer> naturals = Stream.iterate(0, n -> n + 1);
Stream<Double> randoms = Stream.generate(Math::random);

// From file
Stream<String> lines = Files.lines(Path.of("file.txt"));

// Empty stream
Stream<String> empty = Stream.empty();
```

---

## 4. Intermediate Operations

### 4.1. filter(Predicate<T>)

Keep elements that match the predicate.

```java
List<Integer> nums = Arrays.asList(1, 2, 3, 4, 5, 6);
List<Integer> evens = nums.stream()
    .filter(n -> n % 2 == 0)
    .collect(Collectors.toList());  // [2, 4, 6]
```

### 4.2. map(Function<T,R>)

Transform each element.

```java
List<String> names = Arrays.asList("alice", "bob", "charlie");
List<String> upper = names.stream()
    .map(String::toUpperCase)
    .collect(Collectors.toList());  // [ALICE, BOB, CHARLIE]

List<Integer> lengths = names.stream()
    .map(String::length)
    .collect(Collectors.toList());  // [5, 3, 7]
```

### 4.3. flatMap(Function<T, Stream<R>>)

Flatten nested structures (one-to-many mapping).

```java
List<List<Integer>> nested = Arrays.asList(
    Arrays.asList(1, 2),
    Arrays.asList(3, 4),
    Arrays.asList(5)
);
List<Integer> flat = nested.stream()
    .flatMap(Collection::stream)
    .collect(Collectors.toList());  // [1, 2, 3, 4, 5]
```

### 4.4. distinct()

Remove duplicates (uses `equals()`).

```java
List<String> unique = Stream.of("A", "B", "A", "C", "B")
    .distinct()
    .collect(Collectors.toList());  // [A, B, C]
```

### 4.5. sorted()

Sort elements.

```java
List<Integer> sorted = Stream.of(3, 1, 4, 1, 5)
    .sorted()
    .collect(Collectors.toList());  // [1, 1, 3, 4, 5]

List<String> desc = Stream.of("apple", "fig", "banana")
    .sorted(Comparator.comparingInt(String::length).reversed())
    .collect(Collectors.toList());  // [banana, apple, fig]
```

### 4.6. limit(n) / skip(n)

```java
Stream<Integer> naturals = Stream.iterate(0, n -> n + 1);

List<Integer> first5 = naturals
    .limit(5)
    .collect(Collectors.toList());  // [0, 1, 2, 3, 4]

List<Integer> skipFirst3 = Stream.of(1, 2, 3, 4, 5)
    .skip(3)
    .collect(Collectors.toList());  // [4, 5]
```

### 4.7. peek(Consumer<T>)

Debug intermediate results without consuming the stream.

```java
List<Integer> result = Stream.of(1, 2, 3, 4, 5)
    .filter(n -> n > 2)
    .peek(n -> System.out.println("Filtered: " + n))
    .map(n -> n * 2)
    .collect(Collectors.toList());
```

---

## 5. Terminal Operations

### 5.1. collect(Collector<T,A,R>)

Accumulate elements into a collection or other result.

```java
// To List / Set
List<String> list = stream.collect(Collectors.toList());
Set<String> set = stream.collect(Collectors.toSet());

// To specific collection
TreeSet<String> treeSet = stream.collect(Collectors.toCollection(TreeSet::new));

// Joining strings
String joined = stream.collect(Collectors.joining(", "));

// Partitioning (Predicate -> Map<Boolean, List<T>>)
Map<Boolean, List<Integer>> partitioned = nums.stream()
    .collect(Collectors.partitioningBy(n -> n % 2 == 0));

// Grouping
Map<String, List<Person>> byDept = people.stream()
    .collect(Collectors.groupingBy(Person::getDepartment));

// Counting
Map<String, Long> countByDept = people.stream()
    .collect(Collectors.groupingBy(Person::getDepartment, Collectors.counting()));

// Summarizing
IntSummaryStatistics stats = nums.stream()
    .collect(Collectors.summarizingInt(Integer::intValue));
stats.getSum(); stats.getAverage(); stats.getMin(); stats.getMax();

// toMap
Map<String, Integer> map = stream.collect(Collectors.toMap(Person::getName, Person::getAge));
```

### 5.2. reduce(BinaryOperator<T>)

Combine elements into a single result.

```java
// Sum
int sum = Stream.of(1, 2, 3, 4, 5)
    .reduce(0, Integer::sum);  // 15

// Max
Optional<Integer> max = Stream.of(3, 1, 4, 1, 5)
    .reduce(Integer::max);  // Optional[5]

// String concatenation
String concat = Stream.of("A", "B", "C")
    .reduce("", (a, b) -> a + b);  // "ABC"

// Without identity (returns Optional)
Optional<String> longest = Stream.of("apple", "fig", "banana")
    .reduce((a, b) -> a.length() > b.length() ? a : b);  // Optional[banana]
```

### 5.3. forEach vs forEachOrdered

```java
// forEach - no guaranteed order for parallel streams
stream.forEach(System.out::println);

// forEachOrdered - guarantees encounter order
parallelStream.forEachOrdered(System.out::println);
```

### 5.4. Short-Circuiting Terminal Operations

| Operation | Description |
|-----------|-------------|
| `anyMatch(Predicate)` | Returns `true` if any element matches |
| `allMatch(Predicate)` | Returns `true` if all elements match |
| `noneMatch(Predicate)` | Returns `true` if no element matches |
| `findFirst()` | Returns first element (Optional) |
| `findAny()` | Returns any element (Optional, faster in parallel) |

```java
boolean hasEven = numbers.stream().anyMatch(n -> n % 2 == 0);
boolean allPositive = numbers.stream().allMatch(n -> n > 0);
boolean noneNegative = numbers.stream().noneMatch(n -> n < 0);

Optional<Integer> first = numbers.stream().filter(n -> n > 10).findFirst();
```

---

## 6. Primitive Streams

Specialized streams for `int`, `long`, and `double` to avoid autoboxing overhead.

| Interface | Range |
|-----------|-------|
| `IntStream` | `int`, `short`, `byte`, `char` |
| `LongStream` | `long` |
| `DoubleStream` | `double`, `float` |

```java
// IntStream range
IntStream.range(1, 10).sum();   // 45 (1 to 9)
IntStream.rangeClosed(1, 10).sum();  // 55 (1 to 10)

// Mapping
Stream.of("a", "bb", "ccc")
    .mapToInt(String::length)
    .max();  // OptionalInt[3]

// Boxed (convert back to Stream<T>)
IntStream.range(1, 5)
    .boxed()
    .collect(Collectors.toList());  // [1, 2, 3, 4]
```

---

## 7. Common Patterns

### 7.1. Group, Filter, Transform

```java
// Get top-scorer per department
Map<String, Optional<Person>> topByDept = people.stream()
    .collect(Collectors.groupingBy(
        Person::getDepartment,
        Collectors.maxBy(Comparator.comparingInt(Person::getScore))
    ));
```

### 7.2. Chunking (Partitioning into Batches)

```java
// Using Guava's Streams or custom wrapper
// Example: partition into sublists of size 3
List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5, 6, 7);
List<List<Integer>> chunks = IntStream.range(0, (numbers.size() + 2) / 3)
    .mapToObj(i -> numbers.subList(i * 3, Math.min((i + 1) * 3, numbers.size())))
    .collect(Collectors.toList());  // [[1,2,3], [4,5,6], [7]]
```

### 7.3. Parallel Streams

```java
// Enable parallel processing
long count = largeList.parallelStream()
    .filter(n -> n > 100)
    .count();

// Performance considerations:
// - Good for CPU-intensive, stateless, associative operations
// - Avoid: Stateful operations, I/O-bound tasks, small datasets
// - Ordered streams: use forEachOrdered() if needed
```

---

## 8. Optional

`Optional<T>` is a container that may or may not hold a non-null value — eliminates `NullPointerException` and signals optionality explicitly.

```java
Optional<String> opt = Optional.ofNullable(getName());

// Common methods
opt.isPresent();                          // boolean
opt.get();                                // T (throws if empty)
opt.orElse("default");                    // T with fallback
opt.orElseGet(() -> computeDefault());    // Lazy fallback
opt.orElseThrow(() -> new RuntimeException("Missing"));
opt.ifPresent(s -> System.out.println(s));
opt.map(String::toUpperCase);
opt.filter(s -> s.length() > 3);
opt.flatMap(s -> Optional.ofNullable(parse(s)));
```

---

## 9. Built-in Collectors

| Collector | Description |
|-----------|-------------|
| `toList()` | Collect to `List` |
| `toSet()` | Collect to `Set` |
| `toMap(kFn, vFn)` | Collect to `Map` |
| `toCollection(Supplier)` | Collect to specific collection type |
| `joining(separator)` | Join strings |
| `counting()` | Count elements |
| `summingInt(dFn)` | Sum of int values |
| `averagingDouble(dFn)` | Average of double values |
| `summarizingInt(dFn)` | IntSummaryStatistics |
| `maxBy(Comparator)` | Maximum element |
| `minBy(Comparator)` | Minimum element |
| `groupingBy(classifier)` | Group into `Map<K, List<T>>` |
| `partitioningBy(predicate)` | Group into `Map<Boolean, List<T>>` |
| `mapping(mapper, downstream)` | Transform before collecting |

```java
// Complete example
String result = people.stream()
    .filter(p -> p.getAge() > 21)
    .sorted(Comparator.comparing(Person::getName))
    .map(Person::getName)
    .collect(Collectors.joining(", ", "[", "]"));
// Output: "[Alice, Bob, Charlie]"
```
