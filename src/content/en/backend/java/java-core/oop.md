# Java OOP

## 1. Overview

Object-Oriented Programming (OOP) is a programming paradigm built around **objects** — each object encapsulates **attributes** (data) and **behaviors** (methods).

### 1.1. The Four Pillars of OOP

| Pillar | Description | Key Benefit |
|--------|-------------|-------------|
| **Encapsulation** | Hide internal data; expose via getter/setter | Data protection, reduced coupling |
| **Inheritance** | Reuse code from a parent class | Code reuse, hierarchy modeling |
| **Polymorphism** | Same action, different implementation (overloading + overriding) | Flexibility, extensibility |
| **Abstraction** | Hide implementation details, show only essentials | Simplicity, manageability |

---

## 2. Abstract Class vs Interface

### 2.1. Abstract Class

- Can have **concrete methods** (with body) and **abstract methods** (without body)
- Has a **constructor**, can declare **instance variables**
- Supports **single inheritance** only (`extends`)
- Use when sharing **common state/logic** across subclasses

### 2.2. Interface

- Before Java 8: method bodies not allowed
- From Java 8+: supports **default methods** and **static methods**
- From Java 9+: supports **private methods**
- **No constructor**, no instance variables
- Supports **multiple inheritance** (`implements` multiple interfaces)

### 2.3. Comparison Table

| Feature | Abstract Class | Interface |
|---------|---------------|-----------|
| Methods | Concrete + abstract | Abstract, default, static, private (Java 9+) |
| Constructors | Yes | No |
| Instance variables | Yes | No (constants only: `static final`) |
| Inheritance | Single only | Multiple allowed |
| Access modifiers | Any | Default: package-private; Java 9+: private |

### 2.4. When to Use

> **Abstract Class:** Share common logic. Example — `Dog` and `Cat` both extend `Animal` with shared `eat()` and abstract `makeSound()`.

> **Interface:** Define a **behavior contract**. Example — `Runnable`, `Comparable`, `Cloneable` that unrelated classes can implement.

```java
// Abstract class example
abstract class Animal {
    String name;

    Animal(String name) {
        this.name = name;
    }

    // Common behavior
    void eat() {
        System.out.println(name + " is eating.");
    }

    // Abstract method - subclasses must implement
    abstract void makeSound();
}

class Dog extends Animal {
    Dog(String name) {
        super(name);
    }

    @Override
    void makeSound() {
        System.out.println("Woof!");
    }
}
```

```java
// Interface example
interface Flyable {
    void fly();
}

class Bird implements Flyable {
    @Override
    public void fly() {
        System.out.println("Bird is flying.");
    }
}
```

---

## 3. Overloading vs Overriding

### 3.1. Overloading (Compile-Time Polymorphism)

- Same **class**, same **method name**, different **signature** (parameter count, type, or order)
- Resolved at **compile time**

```java
class Calculator {
    int add(int a, int b) {
        return a + b;
    }

    double add(double a, double b) {
        return a + b;
    }

    int add(int a, int b, int c) {
        return a + b + c;
    }
}
```

### 3.2. Overriding (Runtime Polymorphism)

- **Subclass** redefines a **parent method** with the same signature
- Resolved at **runtime** using Virtual Method Table (VMT)
- Annotate with `@Override`

```java
class Parent {
    void greet() {
        System.out.println("Hello!");
    }
}

class Child extends Parent {
    @Override
    void greet() {
        System.out.println("Hi there!");
    }
}
```

---

## 4. Composition vs Inheritance

### 4.1. Inheritance (IS-A Relationship)

```java
class Animal {}
class Dog extends Animal {}  // Dog IS-A Animal
```

### 4.2. Composition (HAS-A Relationship)

```java
class Engine {
    void start() {
        System.out.println("Engine starting.");
    }
}

class Car {
    private Engine engine;  // Car HAS-A Engine

    Car() {
        this.engine = new Engine();
    }

    void start() {
        engine.start();
    }
}
```

> **Tip:** Prefer **Composition** over Inheritance. Composition is more flexible, reduces coupling, and is easier to test (dependency injection).

---

## 5. Multiple Inheritance via Interfaces

Java does **not** support multiple inheritance via classes (avoids the Diamond Problem). However, multiple interfaces are supported.

### 5.1. Diamond Problem

```
    Interface A
   /          \
Class B      Class C
   \          /
    Class D  (which interface to inherit from?)
```

With **classes**, if `B` and `C` both define the same method, `D` cannot resolve the ambiguity. With **interfaces** (pre-Java 8), no ambiguity since methods have no body.

### 5.2. Conflicting Default Methods (Java 8+)

If two interfaces have conflicting `default` methods, the implementing class **must override** the method.

```java
interface A {
    default void hello() {
        System.out.println("Hello from A");
    }
}

interface B {
    default void hello() {
        System.out.println("Hello from B");
    }
}

class C implements A, B {
    @Override
    public void hello() {
        A.super.hello();  // Explicitly choose A's implementation
    }
}
```

---

## 6. Overriding vs Hiding

| Aspect | Overriding | Hiding |
|--------|-----------|--------|
| **Applies to** | Instance methods | Static methods, static/final variables |
| **Resolution** | Runtime (based on actual object) | Compile time (based on declared type) |
| **Keyword** | `@Override` (recommended) | N/A |

```java
class Parent {
    static void staticMethod() {
        System.out.println("Parent static");
    }

    void instanceMethod() {
        System.out.println("Parent instance");
    }
}

class Child extends Parent {
    static void staticMethod() {        // HIDES Parent's static method
        System.out.println("Child static");
    }

    @Override
    void instanceMethod() {             // OVERRIDES Parent's instance method
        System.out.println("Child instance");
    }
}
```

---

## 7. Dynamic Dispatch (Virtual Method Table)

The JVM uses a **Virtual Method Table (VMT)** to select the correct method implementation at runtime based on the **actual object type** — not the reference type.

```java
class Animal {
    void sound() {
        System.out.println("Some sound");
    }
}

class Cat extends Animal {
    @Override
    void sound() {
        System.out.println("Meow");
    }
}

class Dog extends Animal {
    @Override
    void sound() {
        System.out.println("Woof");
    }
}

Animal a = new Cat();   // Declared type: Animal, Actual type: Cat
a.sound();              // Output: "Meow" — resolved at runtime via VMT
```

> **Note:** This is the mechanism behind **runtime polymorphism**. The JVM does not know at compile time which `sound()` to call; it looks up the correct entry in the VMT of the actual object.

## 8. Common interview questions

### 8.1. When should you prefer composition over inheritance?

Prefer composition when behavior should be assembled from smaller capabilities and you want looser coupling than a rigid class hierarchy.

### 8.2. Can static methods be overridden?

No. Static methods belong to the class, so a child class can only hide them, not override them polymorphically.

### 8.3. Why are interfaces often preferred for contracts?

Because they model capabilities without forcing inheritance from a base implementation, which keeps designs more flexible.
