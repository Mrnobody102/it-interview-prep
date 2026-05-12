# Creational Patterns

## 1. Singleton
**Explanation:** Ensures a class has only **one instance** throughout the application's lifecycle.

**Code Example (Thread-safe):**
```java
public class DatabaseConnection {
    private static DatabaseConnection instance;
    private DatabaseConnection() {} // Prevent 'new' from outside
    
    public static synchronized DatabaseConnection getInstance() {
        if (instance == null) instance = new DatabaseConnection();
        return instance;
    }
}
```
**Use Case:** Database connections, Configuration managers, Spring Beans (Singleton by default).

---

## 2. Builder
**Explanation:** Used to construct complex objects with many optional parameters. Like ordering Bubble Tea: Add pearls, less sugar, more ice...

**Code Example (using Lombok):**
```java
@Builder
public class BubbleTea {
    private String type;
    private int sugarLevel;
    private boolean pearl;
}

// Usage
BubbleTea myTea = BubbleTea.builder()
    .type("Oolong")
    .sugarLevel(50)
    .pearl(true)
    .build();
```

---

## 3. Factory Method
**Explanation:** You throw a request at the "factory," and it knows how to build and return the product. You don't care about the internal assembly.

**Code Example:**
```java
public class AnimalFactory {
    public Animal createAnimal(String type) {
        if (type.equals("DOG")) return new Dog();
        if (type.equals("CAT")) return new Cat();
        return null;
    }
}
```

---

## 4. Interview Tip

> **Q: "How does Spring Framework use Singleton?"**
>
> **A:** "By default, Spring Beans (@Service, @Component) are Singletons. The Spring Container creates them once at startup and stores them in memory to be shared, which significantly saves memory resources."
