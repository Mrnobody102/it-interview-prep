# Creational Patterns

## 1. Singleton (The One and Only)
**Analogy:** The President of a country.
There is only one at a time. Everyone who needs a signature goes to that same person. 
**Interview Tip:** In Spring Boot, most Beans (`@Service`, `@Component`) are **Singletons** by default.

---

## 2. Builder (The Boba Shop)
**Analogy:** Ordering Bubble Tea.
You don't just buy "Tea." You build it: Oolong tea + 50% ice + Add Pearls + Add Cheese Foam -> `build()`.
Great for objects with many optional parameters.

---

## 3. Factory Method (The Car Factory)
**Analogy:** A car factory. 
You tell the factory: "I want an SUV." You don't care how they weld the steel or paint the doors. You just get the SUV back.

---

## Summary for Interviews
| Pattern | Summary | Use Case |
|---|---|---|
| **Singleton** | Only one instance ever. | DB Pool, Config. |
| **Builder** | Step-by-step construction. | Complex Objects (Lombok). |
| **Factory** | Delegate creation to a "factory." | Hiding complex setup. |
