# SOLID Principles

## Overview

SOLID is a set of 5 design principles that help code be **maintainable**, **extensible**, and **less error-prone**.

## S - Single Responsibility Principle (SRP)

> A class should have **only one reason to change**.

```java
// ❌ Violates SRP - class does too many things
class UserManager {
    void saveUser(User user) { /* save to DB */ }
    void sendEmail(User user) { /* send email */ }
    void generateReport(User user) { /* generate report */ }
}

// ✅ Follows SRP - each class has one responsibility
class UserRepository { void saveUser(User user) { /* save to DB */ } }
class EmailService { void sendEmail(User user) { /* send email */ } }
class ReportGenerator { void generateReport(User user) { /* generate report */ } }
```

## O - Open/Closed Principle (OCP)

> Open for extension, closed for modification.
> Extend functionality **without modifying** existing code.

```java
// ✅ Use interface/abstract for extension
interface PaymentMethod {
    void pay(double amount);
}

class CreditCardPayment implements PaymentMethod { /* ... */ }
class PayPalPayment implements PaymentMethod { /* ... */ }
// Add new PaymentMethod → no need to modify existing code
```

## L - Liskov Substitution Principle (LSP)

> Subclasses must be **replaceable** for their superclasses without breaking the program.

```java
// ❌ Violates LSP - Bird has fly() but Penguin can't fly
class Bird { void fly(); }
class Penguin extends Bird { void fly() { throw new Exception(); } }

// ✅ Follows LSP - split into appropriate interfaces
interface FlyingBird { void fly(); }
class Eagle implements FlyingBird { void fly() { /* ... */ } }
// Penguin doesn't implement FlyingBird
```

## I - Interface Segregation Principle (ISP)

> Don't force a class to implement interfaces with methods **it doesn't use**.
> Split large interfaces into smaller, specific ones.

```java
// ❌ Violates ISP - MultifunctionPrinter must implement everything
interface Machine {
    void print();
    void scan();
    void fax();
}

// ✅ Follows ISP - split into smaller interfaces
interface Printer { void print(); }
interface Scanner { void scan(); }
class SimplePrinter implements Printer { /* ... */ }
```

## D - Dependency Inversion Principle (DIP)

> **High-level modules** should not depend on **low-level modules**.
> Both should depend on **abstractions**.

```java
// ❌ Violates DIP - Service depends directly on concrete class
class OrderService {
    private MySQLRepository repo = new MySQLRepository();
}

// ✅ Follows DIP - depends on interface
class OrderService {
    private OrderRepository repo; // interface
    OrderService(OrderRepository repo) { this.repo = repo; }
}

interface OrderRepository { void save(Order order); }
class MySQLRepository implements OrderRepository { /* ... */ }
class MongoDBRepository implements OrderRepository { /* ... */ }
```

## Summary

| Letter | Principle | Core Idea |
|--------|-----------|-----------|
| **S** | Single Responsibility | One class, one responsibility |
| **O** | Open/Closed | Extend without modifying existing code |
| **L** | Liskov Substitution | Replaceable without breaking |
| **I** | Interface Segregation | Small, specific interfaces |
| **D** | Dependency Inversion | Depend on abstractions |
