# Behavioral Design Patterns

Behavioral patterns solve problems of **communication and responsibility distribution** between objects.

## Observer Pattern

### Concept

Allows an object (**Subject**) to notify multiple **Observers** of changes when an event occurs.

### Example

When you subscribe to notifications on Facebook: whenever there's a new post, all followers receive the notification.

### In Spring

```java
// Subject
@Service
public class OrderService {
    @Autowired private ApplicationEventPublisher publisher;

    public void placeOrder(Order order) {
        // process order
        publisher.publishEvent(new OrderPlacedEvent(this, order));
    }
}

// Observer
@Component
public class EmailNotificationListener {
    @EventListener
    public void onOrderPlaced(OrderPlacedEvent event) {
        // send confirmation email
    }
}
```

## Strategy Pattern

### Concept

Allows changing algorithms/behaviors at **runtime** without modifying the object's source code.

### Example

Choosing different payment methods (credit card, bank transfer, e-wallet) without changing the order code.

```java
interface PaymentStrategy {
    void pay(double amount);
}

class CreditCardPayment implements PaymentStrategy { /* ... */ }
class PayPalPayment implements PaymentStrategy { /* ... */ }

class ShoppingCart {
    private PaymentStrategy strategy;
    void checkout() { strategy.pay(total); }
}
```

## Template Method Pattern

### Concept

Defines the **skeleton** of an algorithm, allowing subclasses to override specific steps without changing the overall structure.

### Example

Beverage preparation process: boil water → brew → pour → add toppings. Different beverages change at the "brew" step.

```java
abstract class BeverageTemplate {
    final void prepare() {
        boilWater();
        brew();           // subclass override
        pourInCup();
        addCondiments();  // subclass override
    }
    abstract void brew();
    abstract void addCondiments();
}
```

## Chain of Responsibility Pattern

### Concept

Passes a request along a **chain of handlers**. Each handler decides to handle or forward.

### Examples

- Approval chain: employee → manager → director.
- Servlet Filters in Java Web.
- **Spring Security Filter Chain**.

```java
interface Handler {
    Handler setNext(Handler next);
    void handle(Request request);
}

class AuthHandler implements Handler {
    public void handle(Request request) {
        if (!authenticate(request)) return; // pass to next
        next.handle(request);
    }
}
```

## Command Pattern

### Concept

Encapsulates a request as an **object**. Allows queuing, logging, undo/redo.

### Examples

- Undo/Redo operations in editors.
- Task scheduling.

```java
interface Command {
    void execute();
    void undo();
}

class AddCommand implements Command {
    public void execute() { list.add(item); }
    public void undo() { list.remove(item); }
}
```

## State Pattern

### Concept

An object changes behavior when its **internal state** changes.

### Example

Order states: New → Processing → Shipped → Delivered.

```java
interface OrderState {
    void next(OrderContext context);
    String getStatus();
}

class NewOrderState implements OrderState { /* ... */ }
class ShippedOrderState implements OrderState { /* ... */ }
```

## Mediator Pattern

### Concept

Defines an object that encapsulates how multiple objects communicate, **reducing coupling** between objects.

### Examples

- Controller in MVC mediates between Model and View.
- UI Dialog mediates between Button, TextField components.

## Quick Comparison

| Pattern | Purpose | Use case |
|---------|---------|----------|
| Observer | Notify changes | Event listener, subscribe |
| Strategy | Change algorithms | Payment, sorting |
| Template Method | Algorithm skeleton | Data processing pipeline |
| Chain of Responsibility | Pass request along chain | Filters, handlers |
| Command | Encapsulate request | Undo, queue, scheduler |
| State | Behavior changes with state | State machine |
| Mediator | Communication mediator | UI dialog, Controller |
