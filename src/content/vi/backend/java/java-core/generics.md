# Java Core — Generics

## 1. Tổng quan

Generics cho phép khai báo **lớp, interface, method** với kiểu dữ liệu tổng quát (parameterized type).

### 1.1. Mục đích

| Lợi ích | Mô tả |
|---|---|
| **Type safety** | Phát hiện lỗi kiểu dữ liệu ngay lúc **biên dịch**, không phải runtime |
| **Giảm casting thủ công** | Không cần `instanceof` + `(Type) cast` |
| **Code rõ ràng** | Tường minh về kiểu dữ liệu |
| **Tái sử dụng code** | Một class có thể dùng cho nhiều kiểu |

```java
// Không generics: cần cast, lỗi runtime có thể xảy ra
List list = new ArrayList();
list.add("Java");
String s = (String) list.get(0); // OK

// Có generics: type-safe, lỗi compile-time
List<String> genericList = new ArrayList<>();
genericList.add("Java");
String s2 = genericList.get(0); // không cần cast
// genericList.add(123); // COMPILE ERROR — phát hiện ngay!
```

## 2. Generic Classes

```java
// Generic class cơ bản
class Box<T> {
    private T content;

    public void set(T content) {
        this.content = content;
    }

    public T get() {
        return content;
    }
}

// Sử dụng
Box<String> stringBox = new Box<>();
stringBox.set("Hello");
String value = stringBox.get(); // không cần cast

Box<Integer> intBox = new Box<>();
intBox.set(42);
Integer num = intBox.get();
```

### 2.1. Multiple Type Parameters

```java
class Pair<K, V> {
    private K key;
    private V value;

    public Pair(K key, V value) {
        this.key = key;
        this.value = value;
    }

    public K getKey() { return key; }
    public V getValue() { return value; }
}

Pair<String, Integer> entry = new Pair<>("Java", 8);
System.out.println(entry.getKey() + " " + entry.getValue());
```

### 2.2. Generic với bound

```java
// T phải là subclass của Number
class NumberBox<T extends Number> {
    private T value;

    public double doubleValue() {
        return value.doubleValue();
    }
}

NumberBox<Integer> intBox = new NumberBox<>();
intBox.set(10);
System.out.println(intBox.doubleValue()); // 10.0

// intBox.set("text"); // COMPILE ERROR
```

## 3. Generic Methods

```java
class Utils {
    // Generic method — kiểu được suy ra từ tham số
    public static <T> void printArray(T[] array) {
        for (T element : array) {
            System.out.println(element);
        }
    }

    // Generic method với bound
    public static <T extends Comparable<T>> T findMax(T a, T b) {
        return a.compareTo(b) > 0 ? a : b;
    }

    // Generic method với nhiều type parameters
    public static <K, V> Map<K, V> createMap(K key, V value) {
        Map<K, V> map = new HashMap<>();
        map.put(key, value);
        return map;
    }
}

String[] names = {"Alice", "Bob"};
Utils.printArray(names); // tự suy ra T = String

Integer max = Utils.findMax(10, 20);
String maxStr = Utils.findMax("Apple", "Banana");
```

## 4. Wildcards (`?`)

Wildcard dùng khi **không cần biết kiểu cụ thể**:

| Wildcard | Mô tả | Ví dụ |
|---|---|---|
| `?` (Unbounded) | Chấp nhận mọi kiểu | `List<?>` |
| `? extends T` (Upper Bound) | T hoặc **con của T** (subtype) | `List<? extends Number>` |
| `? super T` (Lower Bound) | T hoặc **cha của T** (supertype) | `List<? super Integer>` |

### 4.1. PECS — Producer Extends, Consumer Super

```java
// ? extends T — dùng KHI ĐỌC (producer)
void printNumbers(List<? extends Number> list) {
    for (Number n : list) {
        System.out.println(n.doubleValue()); // Đọc OK
    }
    // list.add(1); // COMPILE ERROR — không ghi được
}

// ? super T — dùng KHI GHI (consumer)
void addNumbers(List<? super Integer> list) {
    list.add(1);    // Ghi OK
    list.add(2);
    // Integer n = list.get(0); // COMPILE ERROR — không đọc type-safe
    Object obj = list.get(0); // phải cast
}
```

### 4.2. Ví dụ minh họa

```java
// Producer: đọc từ collection
public static double sumOfList(List<? extends Number> list) {
    return list.stream().mapToDouble(Number::doubleValue).sum();
}

List<Integer> ints = List.of(1, 2, 3);
List<Double> doubles = List.of(1.1, 2.2, 3.3);
sumOfList(ints);    // OK — Integer extends Number
sumOfList(doubles); // OK — Double extends Number

// Consumer: ghi vào collection
public static void addIntegers(List<? super Integer> list) {
    list.add(1);
    list.add(2);
    list.add(3);
}

List<Number> numbers = new ArrayList<>();
List<Object> objects = new ArrayList<>();
addIntegers(numbers); // OK — Integer is super of Number
addIntegers(objects); // OK — Integer is super of Object
```

## 5. Type Erasure

Java compiler **xóa thông tin generics** khi biên dản — generics chỉ có trong source code.

```java
// Source code
class Box<T> {
    T content;
    T get() { return content; }
}

// Sau type erasure (bytecode)
class Box {
    Object content;          // T → Object
    Object get() { return content; }
}
```

### 5.1. Lưu ý với Type Erasure

```java
// Không thể dùng như thế này trong generics:
class Node<T> {
    // T newInstance(); // COMPILE ERROR
    // T[] array = new T[10]; // COMPILE ERROR
}

// Cách workaround:
class Node<T> {
    Class<T> type;

    Node(Class<T> type) {
        this.type = type;
    }

    T createInstance() throws Exception {
        return type.getDeclaredConstructor().newInstance();
    }
}
```

### 5.2. Bridge Methods

Khi class extends/generics class, compiler tự tạo bridge method:

```java
// Source
class IntBox extends Box<Integer> {
    @Override
    void set(Integer value) { /* ... */ }
}

// Sau erasure — compiler tạo bridge method:
class IntBox extends Box {
    // Bridge method do compiler tạo
    @Override
    public void set(Object value) {
        set((Integer) value); // cast và gọi method thực
    }

    void set(Integer value) { /* ... */ }
}
```

## 6. Generic Constraints

| Constraint | Ví dụ | Mô tả |
|---|---|---|
| `<T extends Number>` | `Box<T extends Number>` | T phải là subtype của Number |
| `<T extends Comparable<T>>` | `T must implement Comparable` | Đảm bảo so sánh được |
| `<T extends Serializable>` | `T must implement Serializable` | Có thể serialize |

```java
// Nhiều bound
<T extends Number & Comparable<T>>
```

## 7. Covariance, Contravariance, Invariance

| Khái niệm | Generics | Ví dụ |
|---|---|---|
| **Covariance** (Bất biến đồng) | `? extends T` | `List<Number>` ← `List<Integer>` |
| **Contravariance** (Bất biến nghịch) | `? super T` | `List<Object>` ← `List<Integer>` |
| **Invariance** (Bất biến) | Không có wildcard | `List<Integer>` ≠ `List<Number>` |

```java
// Invariance — mặc định
List<Integer> intList = new ArrayList<>();
// List<Number> numList = intList; // COMPILE ERROR

// Covariance — đọc được, không ghi được
List<? extends Number> extNumList = intList;
Number n = extNumList.get(0); // OK
// extNumList.add(3.14); // COMPILE ERROR

// Contravariance — ghi được, đọc ra Object
List<? super Integer> superIntList = new ArrayList<>();
superIntList.add(1); // OK
// Integer i = superIntList.get(0); // COMPILE ERROR
Object obj = superIntList.get(0); // OK
```

## 8. Các câu hỏi phỏng vấn thường gặp

### 8.1. Tại sao `new ArrayList<int>` không hợp lệ?

Generics chỉ hoạt động với **object types**, không dùng được với **primitive types**.

```java
// Không hợp lệ
List<int> list = new ArrayList<int>();

// Phải dùng wrapper class
List<int> list = new ArrayList<int>(); // SAI
List<Integer> list = new ArrayList<>(); // ĐÚNG
```

### 8.2. `List<Object>` vs `List<?>` vs raw `List`?

| Kiểu | Type-safe | Mục đích |
|---|---|---|
| `List<Object>` | Có | Chấp nhận mọi kiểu, nhưng khi lấy ra phải cast |
| `List<?>` | Có | Unbounded wildcard, không biết kiểu cụ thể |
| `List` (raw) | **Không** | Legacy code, tránh dùng |

```java
List<Object> objectList = new ArrayList<>();
objectList.add("String");
objectList.add(123); // OK, nhưng...

List<?> wildcardList = new ArrayList<>();
wildcardList.add("String"); // COMPILE ERROR — không ghi được
Object obj = wildcardList.get(0); // OK — đọc ra Object

// Raw type — không nên dùng
List rawList = new ArrayList(); // compiler warning
rawList.add("String");
String s = (String) rawList.get(0); // phải cast
```

### 8.3. Generic có thể có `static` field không?

**Không.** Static field thuộc về class, không thuộc instance — nên không thể tham chiếu đến kiểu generic của class.

```java
class Container<T> {
    static T value; // COMPILE ERROR
    static void print(T t) { // COMPILE ERROR
        // static method không thể dùng T
    }
}
```
