# Java Core — OOP

## 1. Tổng quan

Mô hình lập trình dựa trên **object** và **class**, mỗi object là một thực thể gồm các thuộc tính (attributes) và hành vi (methods).

## 2. Bốn đặc điểm chính của OOP

### 2.1. Encapsulation, Inheritance, Polymorphism, Abstraction

| Đặc điểm | Mô tả | Ví dụ |
|---|---|---|
| **Encapsulation** | Che giấu dữ liệu, chỉ truy cập qua getter/setter | `private` field + public getter/setter |
| **Inheritance** | Tái sử dụng code từ class cha | `class Dog extends Animal` |
| **Polymorphism** | Hành động giống nhau nhưng cách thực hiện khác nhau | Overloading, Overriding |
| **Abstraction** | Ẩn chi tiết cài đặt, chỉ hiển thị interface | Abstract class, Interface |

## 3. Abstract Class vs Interface

### 3.1. So sánh

| Tiêu chí | Abstract Class | Interface |
|---|---|---|
| **Method có thân** | Cho phép (kể cả non-abstract) | Chỉ có `default` và `static` (Java 8+) |
| **Constructor** | Có | Không |
| **Biến instance** | Có | Chỉ `public static final` |
| **Kế thừa** | Đơn kế thừa (`extends` 1 class) | Đa kế thừa (implement nhiều interface) |
| **Access modifier** | Mọi loại | Method mặc định `public` |

### 3.2. Khi nào nên dùng?

> **Abstract Class:** Khi cần chia sẻ logic code chung giữa các class có quan hệ "is-a" chặt chẽ.

```java
abstract class Animal {
    void eat() {
        System.out.println("Animal is eating");
    }
    abstract void makeSound(); // subclass phải override
}

class Dog extends Animal {
    @Override
    void makeSound() {
        System.out.println("Woof woof!");
    }
}
```

> **Interface:** Khi cần định nghĩa "hợp đồng" hành vi, các class không liên quan vẫn có thể implement cùng interface.

```java
interface Flyable {
    void fly();
}

class Bird implements Flyable {
    @Override
    public void fly() {
        System.out.println("Bird is flying");
    }
}

class Airplane implements Flyable {
    @Override
    public void fly() {
        System.out.println("Airplane is flying");
    }
}
```

## 4. Overloading vs Overriding

### 4.1. So sánh

| Tiêu chí | Overloading | Overriding |
|---|---|---|
| **Vị trí** | Cùng class hoặc subclass | Giữa class cha và class con |
| **Signature** | Khác tham số (cùng tên, khác param) | Giống y hệt class cha |
| **Loại đa hình** | Compile-time (static binding) | Runtime (dynamic binding) |
| **Từ khóa** | Không cần | `@Override` |

### 4.2. Ví dụ Overloading

```java
class Calculator {
    // Overloading: cùng tên, khác tham số
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

Calculator calc = new Calculator();
calc.add(1, 2);       // gọi add(int, int)
calc.add(1.5, 2.5);   // gọi add(double, double)
```

### 4.3. Ví dụ Overriding

```java
class Parent {
    void display() {
        System.out.println("Parent display");
    }
}

class Child extends Parent {
    @Override
    void display() {
        System.out.println("Child display");
    }
}

Parent obj = new Child();
obj.display(); // "Child display" — runtime polymorphism
```

## 5. Composition vs Inheritance

| Tiêu chí | Inheritance (IS-A) | Composition (HAS-A) |
|---|---|---|
| **Quan hệ** | Cat **is an** Animal | Car **has an** Engine |
| **Từ khóa** | `extends` | Object reference field |
| **Tính linh hoạt** | Cố định, khó thay đổi | Linh hoạt, dễ thay đổi |

### 5.1. Ví dụ Composition

```java
class Engine {
    void start() {
        System.out.println("Engine started");
    }
}

class Car {
    private Engine engine; // Composition: Car HAS-A Engine

    Car(Engine engine) {
        this.engine = engine;
    }

    void drive() {
        engine.start();
        System.out.println("Car is driving");
    }
}
```

### 5.2. Tại sao ưu tiên Composition?

- **Linh hoạt hơn** — có thể chứa nhiều thành phần, giải quyết vấn đề đa kế thừa.
- **Giảm coupling** — không bị ràng buộc bởi mối quan hệ cha con cứng nhắc.
- **Dễ kiểm thử** — có thể mock dependency khi unit test.

## 6. Multiple Inheritance qua Interface & Diamond Problem

Java **không hỗ trợ** multiple inheritance qua class, nhưng **hỗ trợ** qua interface.

### 6.1. Diamond Problem

Khi 2 interface có `default` method trùng tên, class implements phải override để giải quyết xung đột:

```java
interface A {
    default void greet() {
        System.out.println("Hello from A");
    }
}

interface B {
    default void greet() {
        System.out.println("Hello from B");
    }
}

class C implements A, B {
    @Override
    public void greet() {
        // Chọn gọi method của interface A
        A.super.greet();
        // Hoặc B.super.greet();
        // Hoặc viết logic hoàn toàn mới
    }
}
```

### 6.2. Cách xử lý `default` method bị xung đột

> **Tip:** Nếu chỉ một interface có `default` method trùng tên và interface kia không có, Java tự động ưu tiên method đó — không cần override.

## 7. Dynamic Dispatch (Virtual Method Table)

JVM dùng **Virtual Method Table (VMT)** để chọn implementation đúng ở runtime dựa trên **kiểu thực tế của object**, không phải kiểu khai báo của biến tham chiếu.

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

Animal a = new Cat();
a.sound(); // "Meow"
```

### 7.1. Runtime Polymorphism

> **Note:** Đây là cơ chế đứng sau runtime polymorphism trong Java.

## 8. Các câu hỏi phỏng vấn thường gặp

### 8.1. Khi nào dùng `final` với class?

```java
public final class String {
    // Không class nào được extends String
}
```

Dùng `final` khi class không cần subclass — đảm bảo tính **bất biến** và **bảo mật**.

### 8.2. Static method có overriding được không?

**Không.** Static method thuộc về class, không phải object. Nếu subclass khai báo method cùng signature, đó là **method hiding**, không phải overriding.

### 8.3. Constructor có phải là method không?

**Không.** Constructor có các đặc điểm riêng:

| Đặc điểm | Constructor | Method |
|---|---|---|
| Tên | Trùng tên class | Tự đặt |
| Return type | Không có | Có hoặc không |
| Overloading | Được | Được |
| Override | Không | Được |
| `static` | Không | Có |
