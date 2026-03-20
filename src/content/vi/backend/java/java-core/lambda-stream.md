# Java Core — Lambda & Stream API (Java 8+)

## 1. Lambda Expression

Cách viết ngắn gọn cho implementation của **functional interface** (interface chỉ có 1 abstract method).

### 1.1. Cú pháp

```java
(parameters) -> expression

(parameters) -> { statements; }
```

### 1.2. Ví dụ cơ bản

```java
// Không sử dụng từ khóa return
Addable ad1 = (a, b) -> (a + b);
System.out.println(ad1.add(10, 20)); // 30

// Có từ khóa return
Addable ad2 = (int a, int b) -> {
    return (a + b);
};

// Không có tham số
Runnable r = () -> System.out.println("Hello!");

// Một tham số (có thể bỏ ngoặc)
Consumer<String> printer = s -> System.out.println(s);
```

### 1.3. Method Reference

Cách viết rút gọn cho lambda khi chỉ gọi 1 method:

```java
// Lambda
list.forEach(s -> System.out.println(s));

// Method reference
list.forEach(System.out::println);

// Constructor reference
Supplier<ArrayList<String>> listSupplier = ArrayList::new;
```

## 2. Functional Interfaces

### 2.1. Các interface phổ biến

| Interface | Method | Mô tả |
|---|---|---|
| `Function<T,R>` | `R apply(T t)` | Nhận T, trả R |
| `Consumer<T>` | `void accept(T t)` | Nhận T, không trả |
| `Supplier<T>` | `T get()` | Không nhận, trả T |
| `Predicate<T>` | `boolean test(T t)` | Kiểm tra điều kiện |
| `UnaryOperator<T>` | `T apply(T t)` | T → T |
| `BinaryOperator<T>` | `T apply(T t1, T t2)` | (T, T) → T |

### 2.2. Ví dụ

```java
// Function<T,R>
Function<String, Integer> strToLen = String::length;
System.out.println(strToLen.apply("Java")); // 4

// Consumer<T>
Consumer<String> printer = s -> System.out.println("Print: " + s);
printer.accept("Hello"); // Print: Hello

// Supplier<T>
Supplier<Double> random = Math::random;
System.out.println(random.get()); // 0.1234...

// Predicate<T>
Predicate<Integer> isEven = n -> n % 2 == 0;
System.out.println(isEven.test(4)); // true

// Kết hợp Predicate
Predicate<Integer> isPositive = n -> n > 0;
Predicate<Integer> isOdd = n -> n % 2 != 0;
Predicate<Integer> positiveAndOdd = isPositive.and(isOdd);
System.out.println(positiveAndOdd.test(5)); // true
```

## 3. Stream API

Stream là một **pipeline xử lý dữ liệu tuần tự**, không thay đổi collection gốc.

### 3.1. Pipeline cơ bản

```
Collection → Stream → Intermediate Operations → Terminal Operation → Result
                 (filter, map...)    (collect, forEach, reduce...)
```

### 3.2. Ví dụ tổng hợp

```java
List<String> names = List.of("Alice", "Bob", "Charlie", "Diana");

// Lọc, biến đổi, thu thập
List<String> result = names.stream()
    .filter(name -> name.length() > 3)      // intermediate
    .map(String::toUpperCase)               // intermediate
    .sorted()                               // intermediate
    .collect(Collectors.toList());          // terminal

System.out.println(result); // [ALICE, BOB, CHARLIE, DIANA]
```

## 4. Intermediate Operations

### 4.1. filter()

Lọc phần tử theo điều kiện:

```java
List<Integer> numbers = List.of(1, 2, 3, 4, 5, 6);

List<Integer> evens = numbers.stream()
    .filter(n -> n % 2 == 0)
    .collect(Collectors.toList());
// [2, 4, 6]
```

### 4.2. map()

Biến đổi từng phần tử:

```java
List<String> words = List.of("hello", "world");

List<Integer> lengths = words.stream()
    .map(String::length)
    .collect(Collectors.toList());
// [5, 5]
```

### 4.3. flatMap()

Làm phẳng các collection lồng nhau:

```java
List<List<Integer>> nested = List.of(
    List.of(1, 2),
    List.of(3, 4),
    List.of(5, 6)
);

List<Integer> flat = nested.stream()
    .flatMap(Collection::stream)
    .collect(Collectors.toList());
// [1, 2, 3, 4, 5, 6]
```

### 4.4. sorted()

Sắp xếp:

```java
List<Integer> sorted = numbers.stream()
    .sorted(Comparator.comparingInt(n -> -n)) // giảm dần
    .collect(Collectors.toList());
// [6, 5, 4, 3, 2, 1]
```

### 4.5. distinct()

Loại bỏ trùng lặp:

```java
List<Integer> unique = List.of(1, 2, 2, 3, 3, 3)
    .stream()
    .distinct()
    .collect(Collectors.toList());
// [1, 2, 3]
```

### 4.6. limit() và skip()

```java
List<Integer> firstThree = numbers.stream()
    .limit(3)
    .collect(Collectors.toList());
// [1, 2, 3]

List<Integer> skipTwo = numbers.stream()
    .skip(2)
    .collect(Collectors.toList());
// [3, 4, 5, 6]
```

### 4.7. peek()

Debug intermediate steps:

```java
List<Integer> result = numbers.stream()
    .filter(n -> n > 2)
    .peek(n -> System.out.println("After filter: " + n))
    .map(n -> n * 2)
    .collect(Collectors.toList());
```

## 5. Terminal Operations

### 5.1. collect()

```java
// toList()
List<String> list = stream.collect(Collectors.toList());

// toSet()
Set<String> set = stream.collect(Collectors.toSet());

// toMap()
Map<String, Integer> map = stream.collect(Collectors.toMap(
    String::toUpperCase, // key
    String::length       // value
));

// joining()
String joined = stream.collect(Collectors.joining(", "));

// groupingBy()
Map<Integer, List<String>> grouped = stream.collect(
    Collectors.groupingBy(String::length)
);

// partitioningBy()
Map<Boolean, List<Integer>> partitioned = stream.collect(
    Collectors.partitioningBy(n -> n % 2 == 0)
);

// counting()
long count = stream.collect(Collectors.counting());

// summingInt()
int sum = stream.collect(Collectors.summingInt(Integer::intValue));

// summarizingInt()
IntSummaryStatistics stats = stream.collect(
    Collectors.summarizingInt(Integer::intValue)
);
// stats.getMax(), stats.getMin(), stats.getAverage(), stats.getSum()
```

### 5.2. reduce()

Gộp các phần tử thành 1 giá trị:

```java
// Tổng
int sum = numbers.stream()
    .reduce(0, Integer::sum);
// 0 + 1 + 2 + 3 + 4 + 5 + 6 = 21

// Tìm max
int max = numbers.stream()
    .reduce(Integer.MIN_VALUE, Integer::max);

// Nối chuỗi
String concat = List.of("A", "B", "C").stream()
    .reduce("", (a, b) -> a + b + "-");
// "A-B-C-"
```

### 5.3. forEach()

```java
stream.forEach(System.out::println);
stream.forEach(item -> System.out.println(item));
```

### 5.4. count(), anyMatch(), allMatch(), noneMatch()

```java
boolean anyEven = numbers.stream().anyMatch(n -> n % 2 == 0);  // true
boolean allPositive = numbers.stream().allMatch(n -> n > 0);   // true
boolean noneNegative = numbers.stream().noneMatch(n -> n < 0); // true
long evenCount = numbers.stream().filter(n -> n % 2 == 0).count(); // 3
```

### 5.5. findFirst() và findAny()

```java
Optional<Integer> first = numbers.stream()
    .filter(n -> n > 3)
    .findFirst();
// Optional[4]

Optional<Integer> any = numbers.stream()
    .filter(n -> n > 3)
    .findAny(); // nhanh hơn findFirst trong parallel
```

## 6. Parallel Stream

Xử lý song song trên nhiều CPU cores:

```java
// Sequential (mặc định)
list.stream().filter(...).collect(...);

// Parallel
list.parallelStream().filter(...).collect(...);

// Hoặc chuyển sequential thành parallel
list.stream()
    .parallel()
    .filter(...)
    .collect(...);

// Đổi lại sequential
list.parallelStream()
    .unordered() // tối ưu cho limit/skip
    .filter(...)
    .sequential()
    .collect(...);
```

> **Lưu ý:** Parallel stream **không** đảm bảo thứ tự. Dùng `unordered()` trước `limit()` để tối ưu.

## 7. Optional

Tránh `NullPointerException`:

```java
Optional<String> opt = Optional.ofNullable(getName());

// Kiểm tra
if (opt.isPresent()) { ... }

// Xử lý có giá trị
opt.ifPresent(name -> System.out.println(name));

// Lấy giá trị hoặc default
String result = opt.orElse("Unknown");
String result = opt.orElseGet(() -> computeDefault());
String result = opt.orElseThrow(() -> new RuntimeException("Not found"));

// Map/flatMap
Optional<Integer> len = opt.map(String::length);
Optional<String> upper = opt.flatMap(s -> Optional.of(s.toUpperCase()));

// Kết hợp
opt.filter(s -> s.length() > 3)
   .map(String::toUpperCase)
   .orElse("SHORT");
```

## 8. Default Methods trong Interface

Java 8 cho phép interface có method với implementation mặc định:

```java
interface Printable {
    void print();

    default void welcome() {
        System.out.println("Welcome!");
    }
}

interface Readable {
    void read();

    default void welcome() {
        System.out.println("Welcome to Readable!");
    }
}

// Gọi default method cụ thể
class Document implements Printable, Readable {
    @Override
    public void print() { System.out.println("Printing..."); }

    @Override
    public void welcome() {
        Readable.super.welcome(); // chọn Readable.welcome()
    }
}
```

## 9. Static Methods trong Interface

```java
interface StringUtils {
    static boolean isBlank(String s) {
        return s == null || s.trim().isEmpty();
    }
}

System.out.println(StringUtils.isBlank("  ")); // true
```
