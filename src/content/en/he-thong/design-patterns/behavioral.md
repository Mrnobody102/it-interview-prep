# Behavioral Patterns

## 1. Observer Pattern
**Explanation:** Like the **Subscribe** button on YouTube. When a channel uploads a new video, all subscribers are notified automatically.

**Code Example:**
```java
// Subject (YouTube Channel)
public class YoutubeChannel {
    private List<Subscriber> subs = new ArrayList<>();
    
    public void upload(String video) {
        for (Subscriber s : subs) s.update(video);
    }
}

// Observer (User)
interface Subscriber { void update(String video); }

class User implements Subscriber {
    public void update(String video) { System.out.println("Watch now: " + video); }
}
```

---

## 2. Strategy Pattern
**Explanation:** Swap algorithms at runtime. Like choosing a payment method (Momo, Visa, Zalopay) during checkout.

**Code Example:**
```java
interface PaymentStrategy { void pay(int amount); }

class VisaPayment implements PaymentStrategy { 
    public void pay(int amount) { System.out.println("Paying via Visa: " + amount); } 
}

class ShoppingCart {
    private PaymentStrategy strategy;
    public void setStrategy(PaymentStrategy s) { this.strategy = s; }
    public void checkout(int amount) { strategy.pay(amount); }
}
```

---

## 3. Chain of Responsibility
**Explanation:** A request passes through a chain of handlers. Each handler either processes the request or passes it to the next one. Example: Leave request approval (Manager -> Director -> CEO).

**Real-world use:** `Filters` in Spring Security. Requests go through filters checking for Tokens, Spam, and Permissions before reaching the Controller.

---

## 4. Interview Tip

| Pattern | Summary | Common Use Case |
|:---|:---|:---|
| **Observer** | One talks, many listen | Event Listeners, Kafka, Pub/Sub |
| **Strategy** | Interchangeable tools | Payment Gateways, Sorting algorithms |
| **Chain** | Passing the baton | Spring Filters, Middleware, Exception handling |
