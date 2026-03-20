# Java Generics

## 1. Overview

Generics enable **type safety**, **code reusability**, and **eliminate casting** at compile time. They were introduced in Java 5.

### 1.1. Motivation

```java
// Without generics - requires casting, unsafe
List list = new ArrayList();
list.add("Hello");
String s = (String) list.get(0);  // Cast required

// With generics - type-safe, no casting needed
List<String> list2 = new ArrayList<>();
list2.add("Hello");
String s2 = list2.get(0);  // No cast needed
```

### 1.2. Benefits

| Benefit | Description |
|---------|-------------|
| **Compile-time type checking** | Catch type errors early, before runtime |
| **Eliminate casts** | No manual casting from `Object` |
| **Code reuse** | One class/method works for multiple types |
| **Type safety** | Compiler enforces correct type usage |

---

## 2. Generic Classes

```java
// Class-level generic type
class Box<T> {
    private T content;

    Box(T content) {
        this.content = content;
    }

    T get() {
        return content;
    }

    void set(T content) {
        this.content = content;
    }
}

// Usage
Box<Integer> intBox = new Box<>(42);
Box<String> strBox = new Box<>("Hello");
Integer num = intBox.get();  // No cast
```

### 2.1. Multiple Type Parameters

```java
class Pair<K, V> {
    private K key;
    private V value;

    Pair(K key, V value) {
        this.key = key;
        this.value = value;
    }

    K getKey() { return key; }
    V getValue() { return value; }
}

Pair<String, Integer> entry = new Pair<>("Age", 25);
```

### 2.2. Bounded Type Parameters

Restrict the types that can be used as type arguments.

```java
// T must be a subtype of Number
class NumberBox<T extends Number> {
    private T value;

    NumberBox(T value) {
        this.value = value;
    }

    double toDouble() {
        return value.doubleValue();
    }
}

NumberBox<Integer> nb = new NumberBox<>(10);
NumberBox<Double> nd = new NumberBox<>(3.14);
// NumberBox<String> ns = new NumberBox<>("x");  // ERROR: String not a subtype of Number

// Multiple bounds: T must extend both A and B
class <T extends Comparable<T> & Serializable> {}
```

---

## 3. Generic Methods

Generic methods can be declared in **regular** (non-generic) classes.

```java
class Utils {
    // Static generic method
    public static <T> void printArray(T[] array) {
        for (T element : array) {
            System.out.println(element);
        }
    }

    // Generic method with bounded type
    public static <T extends Comparable<T>> T findMax(T a, T b) {
        return a.compareTo(b) >= 0 ? a : b;
    }

    // Generic method with wildcards
    public static void printList(List<?> list) {
        for (Object o : list) {
            System.out.println(o);
        }
    }
}

// Usage
Integer[] ints = {1, 2, 3};
Utils.printArray(ints);  // Type inferred: <Integer>

String max = Utils.findMax("apple", "banana");  // "banana"
```

---

## 4. Wildcards

Wildcards represent **unknown types**. They are useful for **flexibility** when you only need to read from or write to a collection.

### 4.1. Unbounded Wildcard `?`

Accepts **any type**. Use when you only need to read (no assumptions about type).

```java
void printList(List<?> list) {
    for (Object o : list) {
        System.out.println(o);
    }
}

printList(Arrays.asList(1, 2, 3));  // Works
printList(Arrays.asList("a", "b"));  // Works
```

### 4.2. Upper Bounded Wildcard `? extends T`

Accepts **T or any subtype** of T. Use when you only need to **read** from a collection (Producer).

```java
// Can read as T, but CANNOT write to (except null)
double sumOfList(List<? extends Number> list) {
    double sum = 0;
    for (Number n : list) {  // Reading: OK
        sum += n.doubleValue();
    }
    // list.add(1);  // ERROR: Can't write
    return sum;
}

List<Integer> ints = Arrays.asList(1, 2, 3);
sumOfList(ints);  // OK: Integer extends Number
```

### 4.3. Lower Bounded Wildcard `? super T`

Accepts **T or any supertype** of T. Use when you only need to **write** to a collection (Consumer).

```java
// Can write T (or subtype), can read as Object
void addNumbers(List<? super Integer> list) {
    list.add(1);    // Writing Integer: OK
    list.add(2);    // Writing Integer: OK
    // Integer n = list.get(0);  // ERROR: can only read as Object
    Object o = list.get(0);  // OK: reading as Object
}

List<Number> numbers = new ArrayList<>();
addNumbers(numbers);  // OK: Integer's supertype is Number
addNumbers(new ArrayList<Object>());  // OK: Object is a supertype of Integer
```

### 4.4. Wildcard Summary — PECS (Producer Extends, Consumer Super)

> **Tip:** Use **PECS** — **Producer Extends, Consumer Super**.
>
> - If you only **read** from a collection -> use `? extends T`
> - If you only **write** to a collection -> use `? super T`
> - If you both read and write -> use exact type `T`

```java
// Producer: reading from the collection
public double total(List<? extends Number> numbers) {
    double sum = 0;
    for (Number n : numbers) {  // Reading
        sum += n.doubleValue();
    }
    return sum;
}

// Consumer: writing to the collection
public void addIntegers(List<? super Integer> integers) {
    integers.add(1);   // Writing
    integers.add(2);
}
```

---

## 5. Type Erasure

Java generics are implemented via **type erasure** — generic type information is removed at compile time and replaced with casts or bounded type checks.

| Generic Type | Erasure |
|-------------|---------|
| `<T>` | Replaced with `Object` |
| `<T extends UpperBound>` | Replaced with `UpperBound` |
| `<T, U>` | Each replaced accordingly |

```java
// Source code
class Box<T> {
    T content;
    T get() { return content; }
}

// After type erasure (compiled bytecode)
class Box {
    Object content;
    Object get() { return content; }  // cast inserted by compiler
}

// With bounded type
class NumberBox<T extends Number> {
    T value;
    T get() { return value; }
}

// After type erasure
class NumberBox {
    Number value;  // T replaced with UpperBound
    Number get() { return value; }
}
```

### 5.1. Implications of Type Erasure

| Issue | Description |
|-------|-------------|
| **Cannot instantiate `T`** | `new T()` is illegal — use reflection or factory |
| **Cannot create generic arrays** | `new T[size]` is illegal — use `Object[]` and cast |
| **Cannot use primitive types** | Use wrapper classes: `List<int>` invalid, use `List<Integer>` |
| **Runtime type check fails** | `instanceof T` is illegal |
| **Overloading method signatures** | Cannot overload `void f(List<String>)` and `void f(List<Integer>)` — same after erasure |

```java
// Cannot do this:
class Container<T> {
    T item = new T();  // ERROR: Cannot instantiate type T
}

// Workaround with reflection:
class Container<T> {
    private final Class<T> type;
    Container(Class<T> type) { this.type = type; }

    T create() throws Exception {
        return type.getDeclaredConstructor().newInstance();
    }
}
```

---

## 6. Diamond Operator (`<>`)

Java 7+ allows omitting type arguments when the compiler can infer them.

```java
// Java 7+ — diamond operator
List<String> list = new ArrayList<>();  // Type inferred
Map<String, List<Integer>> map = new HashMap<>();  // Nested types inferred

// Java 10+ — local variable type inference
var list2 = new ArrayList<String>();  // Compiler infers ArrayList<String>
```

---

## 7. Generic Constraints and Edge Cases

### 7.1. Generic Classes Cannot Extend Throwable

```java
// ERROR: Generic class may not extend Throwable
class MyException<T> extends Exception {}  // Compile error
```

### 7.2. Static Context and Generics

Static fields and methods cannot reference class-level type parameters.

```java
class Container<T> {
    // static T value;  // ERROR: static cannot reference type parameter
    // static T get() {}  // ERROR

    static <T> T staticMethod(T input) {  // OK: method-level generic
        return input;
    }
}
```

### 7.3. Arrays of Generic Types

Arrays cannot be created with generic types at runtime due to type erasure.

```java
// List<String>[] arr = new List<String>[10];  // ERROR: generic array creation
List<String>[] arr = (List<String>[]) new ArrayList[10];  // Unchecked cast warning
```

---

## 8. Generic Interfaces

```java
// Comparable is a generic interface
interface Comparable<T> {
    int compareTo(T o);
}

// Repository pattern with generics
interface Repository<T, ID> {
    T findById(ID id);
    List<T> findAll();
    T save(T entity);
    void delete(T entity);
}

class UserRepository implements Repository<User, Long> {
    @Override
    public User findById(Long id) {
        // implementation
        return null;
    }

    @Override
    public List<User> findAll() {
        return null;
    }

    @Override
    public User save(User entity) {
        return null;
    }

    @Override
    public void delete(User entity) {}
}
```
