# Java Generics

## 1. Overview

Generics let Java code work with types safely at compile time while reducing casts and improving reusable API design.

### 1.1. Purpose

Without generics, APIs fall back to `Object`, which weakens type safety and pushes errors to runtime. With generics, the compiler can catch those mistakes earlier.

That is why generics matter so much in backend code. Collections, repositories, DTO mappers, cache layers, event wrappers, and result containers all become safer and clearer when the type contract is explicit.

```java
List raw = new ArrayList();
raw.add("Alice");
raw.add(123);

String name = (String) raw.get(1); // ClassCastException at runtime
```

## 2. Generic Classes

Generic classes define type parameters at the class level.

```java
public class Box<T> {
    private T value;

    public void set(T value) {
        this.value = value;
    }

    public T get() {
        return value;
    }
}
```

This pattern is common anywhere a container, wrapper, or reusable infrastructure type should stay independent of one concrete domain class.

### 2.1. Multiple Type Parameters

```java
public class Pair<K, V> {
    private final K key;
    private final V value;

    public Pair(K key, V value) {
        this.key = key;
        this.value = value;
    }
}
```

Real-world examples include:

- `Map<K, V>`
- `ResponseEntity<T>`
- tuple or result wrappers
- event messages carrying metadata and payload separately

### 2.2. Bounded Type Parameters

Bounds restrict what types are valid for a parameter.

```java
public class NumberBox<T extends Number> {
    private final T value;

    public NumberBox(T value) {
        this.value = value;
    }
}
```

Bounds are important because they let generic code call known methods safely.

```java
public static <T extends Comparable<T>> T max(T left, T right) {
    return left.compareTo(right) >= 0 ? left : right;
}
```

## 3. Generic Methods

Methods can declare their own type parameters independent of the enclosing class.

```java
public static <T> T first(List<T> items) {
    return items.get(0);
}
```

This is especially useful for utility methods, factory methods, converters, and helper APIs where creating a whole generic class would be unnecessary.

## 4. Wildcards (`?`)

Wildcards help APIs express flexible read/write intent.

They are one of the most important interview topics because many developers understand generic classes but misuse wildcards in API design.

### 4.1. PECS: Producer Extends, Consumer Super

- Use `? extends T` when the source produces `T`
- Use `? super T` when the destination consumes `T`

```java
public void copy(List<? extends Number> source, List<? super Number> target) {
    for (Number n : source) {
        target.add(n);
    }
}
```

The core question is always: is this parameter mainly producing values, consuming values, or both?

### 4.2. Example

```java
List<Integer> ints = List.of(1, 2, 3);
List<? extends Number> numbers = ints;

Number n = numbers.get(0); // allowed
// numbers.add(4);         // not allowed
```

That restriction exists because the compiler does not know whether the underlying list is really `List<Integer>`, `List<Double>`, or something else extending `Number`.

## 5. Type Erasure

Java generics are implemented with type erasure, so generic type information is mostly removed at runtime.

```java
List<String> strings = new ArrayList<>();
List<Integer> ints = new ArrayList<>();

System.out.println(strings.getClass() == ints.getClass()); // true
```

This design preserved backward compatibility with pre-generics Java, but it also explains many limitations that surprise people.

### 5.1. Notes on Type Erasure

Because of type erasure:

- You cannot create `new T()`
- You cannot check `obj instanceof List<String>`
- Generic array creation is restricted

It also means reflective code often needs an explicit `Class<T>` token or some other metadata if it wants to retain type information at runtime.

### 5.2. Bridge Methods

The compiler may generate synthetic bridge methods so overriding still works correctly after erasure.

This usually matters in interviews more than in day-to-day coding, but it explains some surprising bytecode and stack traces.

You may see bridge methods appear when a subclass narrows a return type or specializes a generic parent signature.

## 6. Generic Constraints

Common constraints and limitations include:

- Primitive types such as `int` cannot be used directly as type arguments
- Static members cannot depend on the class type parameter
- Generic classes cannot extend `Throwable`
- Arrays and generics do not mix cleanly because arrays are reified but generics are erased

Examples:

```java
class Box<T> {
    // private static T value; // invalid
}

class MyException<T> extends Exception {
    // invalid generic exception type
}
```

## 7. Covariance, Contravariance, Invariance

Java generic types are invariant by default.

```java
List<Integer> ints = new ArrayList<>();
// List<Number> nums = ints; // not allowed

List<? extends Number> readable = ints;
List<? super Integer> writable = new ArrayList<Number>();
```

This is why wildcards exist: they model safe variance rules explicitly.

The short version:

- invariance keeps assignments safe by default
- covariance is good for reading
- contravariance is good for writing

## 8. Common Interview Questions

### 8.1. Why Is `new ArrayList<int>()` Invalid?

Generics only work with reference types. Use wrapper types such as `Integer`, `Long`, and `Double`.

Java relies on boxing and unboxing to bridge primitive usage with generic collections.

### 8.2. `List<Object>` vs `List<?>` vs Raw `List`?

`List<Object>` is a list that can store objects of any reference type. `List<?>` is a list of some unknown specific type. Raw `List` turns off generic safety and should be avoided in modern code.

That difference is subtle but important:

- `List<Object>` is writable with any object
- `List<?>` is mostly read-only from the caller perspective
- raw `List` throws away compiler guarantees

### 8.3. Can a Generic Type Have a Static Field That Uses `T`?

No. Static members belong to the class, not to a specific instantiation like `Box<String>` or `Box<Integer>`, so `T` is not valid there.

This is another consequence of type erasure: there is only one runtime `Box` class, not separate runtime classes for each type argument.
