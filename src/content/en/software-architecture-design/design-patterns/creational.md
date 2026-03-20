# Creational Design Patterns

Creational patterns solve the problem of **object creation** flexibly and efficiently.

## Singleton

### Concept

Ensures a class has **only one instance** throughout the entire application.

### In Spring Boot

By default, every Spring Bean is a **singleton** — only one instance is created and shared.

```java
@Configuration
public class AppConfig {
    @Bean
    public MyService myService() {
        return new MyService(); // singleton by default
    }
}
```

### Manual Implementation

```java
public class Singleton {
    private static final Singleton INSTANCE = new Singleton();
    private Singleton() {}
    public static Singleton getInstance() { return INSTANCE; }
}
```

## Builder

### Concept

Create complex objects **step by step**, avoiding constructors with many parameters.

### Example

```java
// Lombok
@Data @Builder
class User {
    private String name;
    private int age;
    private String email;
}

User user = User.builder()
    .name("John")
    .age(25)
    .email("john@example.com")
    .build();
```

### Compared to Factory Method

| Builder | Factory Method |
|---------|---------------|
| Build complex objects step-by-step | Create objects via inheritance |
| Fluent interface | One-time creation |
| Mutable/Immutable both possible | Usually for immutable objects |

## Factory Method

### Concept

**Subclasses** decide which object to create, increasing flexibility.

```java
interface DocumentFactory {
    Document createDocument();
}

class PdfFactory implements DocumentFactory {
    public Document createDocument() { return new PdfDocument(); }
}

class WordFactory implements DocumentFactory {
    public Document createDocument() { return new WordDocument(); }
}
```

## Abstract Factory

### Concept

Create **groups of related objects** without specifying concrete classes.

### Example

```java
interface GUIFactory {
    Button createButton();
    Checkbox createCheckbox();
}

class WindowsFactory implements GUIFactory {
    public Button createButton() { return new WindowsButton(); }
    public Checkbox createCheckbox() { return new WindowsCheckbox(); }
}

class MacFactory implements GUIFactory {
    public Button createButton() { return new MacButton(); }
    public Checkbox createCheckbox() { return new MacCheckbox(); }
}
```

## Prototype

### Concept

Create new objects by **cloning** from a prototype.

### In Java

```java
class Shape implements Cloneable {
    public Shape clone() {
        try { return (Shape) super.clone(); }
        catch (CloneNotSupportedException e) { return null; }
    }
}
```

### In Spring

```java
@Component
@Scope("prototype")
public class BeanScopePrototype {
    // New instance created each time getBean() is called
}
```

## Comparison

| Pattern | Purpose | When to Use |
|---------|---------|-------------|
| Singleton | One instance only | Config, Logger, Connection pool |
| Builder | Build complex objects step-by-step | Objects with many optional parameters |
| Factory Method | Delegate creation to subclass | Need flexibility about concrete class |
| Abstract Factory | Create families of related objects | System working with multiple platforms/themes |
| Prototype | Clone instead of create new | Creating objects is expensive, or to avoid subclass explosion |
