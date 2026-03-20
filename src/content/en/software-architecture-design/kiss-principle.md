# KISS Principle

## Keep It Simple, Stupid

> Design as simply as possible. Complex code is not always better.

## Core Principles

- **Prioritize clarity**: Code that's easy to read and understand beats "clever" code.
- **Avoid over-engineering**: Don't solve a general problem when a specific solution will do.
- **Break down problems**: Divide large problems into smaller, simpler parts.

## Examples

### ❌ Over-complicated

```java
public String processPayment(Order order,
    Map<String, Object> config, boolean isPriority,
    List<PaymentMethod> methods, String currency) {
    // 200 lines handling everything
    // Too many parameters, messy logic
}
```

### ✅ Simple & Clear

```java
public PaymentResult processStandardPayment(Order order) {
    // Only handles the most common case
    // Clear, easy to test
}

public PaymentResult processExpressPayment(Order order) {
    // Separated for express
}
```

## When to Keep It Simple?

| Do | Don't |
|----|-------|
| Solve the problem first, optimize later | Premature optimization |
| Clear variable and function names | Write cryptic, short code |
| Split into small functions, each doing one thing | Put multiple logics into one long function |
| Comment when necessary | Too many or no comments |

## Note

> "Simple" doesn't mean "primitive". A simple solution can be very sophisticated architecturally, yet still easy to understand and maintain.
