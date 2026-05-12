# SOLID Principles (The 5 Golden Rules)

## Overview
**SOLID** is a set of 5 design principles for object-oriented programming. Mastering these won't just get you through an interview; it will help you write code that is **Readable, Maintainable, and Scalable.**

Think of SOLID as the **Traffic Laws** of coding. You can ignore them and the car will still move, but eventually, you'll cause a massive crash!

| Letter | Principle | Casual Meaning |
|-----|-----------|---------|
| **S** | Single Responsibility | 🔪 **The Chef's Knife:** Use it for cutting, not for opening cans or tightening screws. One class = One job. |
| **O** | Open/Closed | 🧩 **Lego Bricks:** Want to add a roof? Just snap on new bricks (Extension), don't melt the whole house down to rebuild (Modification). |
| **L** | Liskov Substitution | 🐧 **The Penguin:** If a subclass (Penguin) replaces a parent class (Bird), it shouldn't break the app (A Penguin that can't fly shouldn't be forced to!). |
| **I** | Interface Segregation | 🖨️ **The Printer:** Don't force a simple printer to have a "FAX" button if it doesn't know how to fax. |
| **D** | Dependency Inversion | 🔌 **The Wall Socket:** Plug your phone into the socket (Interface), don't hardwire your phone's circuit directly to the city's power grid (Concrete Class). |

---

## 1. S - Single Responsibility Principle (SRP)
> A class should have **only one reason** to change.

**❌ Wrong:** A `UserManager` class that saves to DB, validates emails, and sends welcome emails. If the email provider changes, you shouldn't have to touch the User Management logic!
**✅ Right:** Split it into `UserRepository`, `UserValidator`, and `EmailService`. Each does one thing and does it well.

---

## 2. O - Open/Closed Principle (OCP)
> Software entities should be **open for extension**, but **closed for modification**.

**❌ Wrong:** A `PaymentProcessor` with a giant `if (type == "VISA") ... else if (type == "PAYPAL")`. Every time you add a new payment method, you have to modify this existing (and working) code, risking new bugs.
**✅ Right:** Use an Interface `IPaymentMethod`. To add "Momo," just create a new class `MomoPayment`. You never touch the original `PaymentProcessor`.

---

## 3. L - Liskov Substitution Principle (LSP)
> Subclasses must be substitutable for their base classes.

**❌ Wrong (The Classic Penguin):** You have a `Bird` class with a `fly()` method. You create a `Penguin` subclass. Since penguins can't fly, you throw an `Error` in `fly()`. Now, any code that expects a `Bird` and calls `fly()` will crash if it receives a `Penguin`.
**✅ Right:** Don't put `fly()` in the base `Bird` class if not all birds fly. Put it in an `IFlyingBird` interface.

---

## 4. I - Interface Segregation Principle (ISP)
> Don't force a class to implement methods it doesn't use.

**❌ Wrong:** A giant `IMachine` interface with `print()`, `scan()`, and `fax()`. A cheap printer is forced to implement `fax()` even if it can't do it.
**✅ Right:** Split into small interfaces: `IPrinter`, `IScanner`, `IFaxer`.

---

## 5. D - Dependency Inversion Principle (DIP)
> Depend on **Abstractions (Interfaces)**, not on Concretions (Real Classes).

**❌ Wrong:** `OrderService` creates a `new MySQLDatabase()` inside its constructor. Now `OrderService` is "married" to MySQL. Switching to MongoDB would be a nightmare.
**✅ Right:** `OrderService` asks for an `IDatabase` in its constructor. It doesn't care if it's MySQL or MongoDB. This is the core of **Dependency Injection (DI)**.

---

## 6. Interview Tip

> **Q: "Does violating SOLID kill a project?"**
>
> **A:** "For a small script, no. But for a massive system, failing to follow SOLID is like building a house of cards. Fixing a bug in one place will cause three more bugs elsewhere because everything is too 'tangled' together. SOLID is the vaccine against 'code rot'."
