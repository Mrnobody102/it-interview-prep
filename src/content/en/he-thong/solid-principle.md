# SOLID Principles

## Overview
**SOLID** isn't just for interviews. It's a set of rules to keep your code from turning into "Spaghetti code" after 6 months of development.

---

## 1. S - Single Responsibility Principle (SRP)
> A class should have **only one reason to change**.

**❌ Wrong:** A `ReportManager` class that calculates salary, generates PDF, and sends Email.
```java
public class ReportManager {
    public void calculateSalary() { ... }
    public void generatePdf() { ... }
    public void sendEmail() { ... }
}
```

**✅ Right:** Split them into separate classes.
```java
class SalaryCalculator { ... }
class PdfGenerator { ... }
class EmailSender { ... }
```
👉 **Benefit:** If you want to switch from Email to Telegram, you only modify `EmailSender` without touching the salary logic.

---

## 2. O - Open/Closed Principle (OCP)
> Software entities should be **open for extension**, but **closed for modification**.

**❌ Wrong:** Using `if-else` to check payment types. Adding a new type requires modifying the existing `process` method.
```java
public void processPayment(String type) {
    if (type.equals("VISA")) { ... }
    else if (type.equals("MOMO")) { ... }
}
```

**✅ Right:** Use Interfaces or Abstract Classes.
```java
interface Payment { void pay(); }

class VisaPayment implements Payment { public void pay() { ... } }
class MomoPayment implements Payment { public void pay() { ... } }

// Adding ZaloPay? Just create a new class without modifying old code.
```

---

## 3. L - Liskov Substitution Principle (LSP)
> Subclasses must be substitutable for their base classes.

**The Penguin Example:**
If `Bird` has a `fly()` method and `Penguin` inherits from `Bird`, you'll have to throw an Exception in `fly()`. This violates LSP because code expecting a flying `Bird` will crash when it receives a `Penguin`.

**✅ Solution:** Move `fly()` out of the base class. Use an `IFlyable` interface instead.

---

## 4. I - Interface Segregation Principle (ISP)
> Clients should not be forced to depend on methods they do not use.

**❌ Wrong:** An `Worker` interface with `work()` and `eat()`. A `RobotWorker` is forced to implement `eat()`, which it doesn't do.

**✅ Right:** Split into `IWorkable` and `IEatable`. The Robot only implements `IWorkable`.

---

## 5. D - Dependency Inversion Principle (DIP)
> Depend on **Abstractions (Interfaces)**, not on concretions.

**❌ Wrong:** `UserPage` directly instantiates `MySQLDatabase`.
```java
public class UserPage {
    private MySQLDatabase db = new MySQLDatabase(); // Tight Coupling
}
```

**✅ Right:** Use Dependency Injection.
```java
public class UserPage {
    private Database db;
    public UserPage(Database db) { this.db = db; } // Accepts any Database via Interface
}
```

---

## 6. Interview Tip

> **Q: "When should we NOT apply SOLID?"**
>
> **A:** "SOLID is great, but it increases the number of classes and interfaces. For very small projects or one-time prototypes, applying SOLID strictly can lead to **Over-engineering**, slowing down development without providing long-term maintenance value."
