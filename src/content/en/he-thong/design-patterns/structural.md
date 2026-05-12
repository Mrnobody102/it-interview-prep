# Structural Patterns

## 1. Adapter
**Explanation:** Like a power adapter that converts a 3-pin plug to a 2-pin socket. It allows two incompatible interfaces to work together.

**Code Example:**
```java
// Old system only accepts 2-pin plugs
interface TwoPinPlug { void connect(); }

// New device has a 3-pin plug
class ThreePinDevice { void plugIn() { ... } }

// Adapter makes the 3-pin device work with the 2-pin socket
class SocketAdapter implements TwoPinPlug {
    private ThreePinDevice device;
    public void connect() { device.plugIn(); }
}
```

---

## 2. Decorator
**Explanation:** Adds new functionality to an object without altering its structure. Like wrapping a gift.

**Classic Example:** Java I/O streams.
```java
InputStream is = new FileInputStream("file.txt");
// Wrap it with buffering capability for better performance
BufferedInputStream bis = new BufferedInputStream(is);
```

---

## 3. Facade
**Explanation:** Provides a simple interface to a complex subsystem. Like pressing a "Start" button on a car instead of manually handling fuel injection, ignition, and gears.

---

## 4. Proxy
**Explanation:** Acts as a placeholder or representative for another object to control access. Like a Secretary representing a CEO.

**Use Case:** `@Transactional` in Spring Boot. Spring creates a Proxy around your class to automatically open and close transactions.

---

## 5. Interview Tip

| Pattern | Summary | Common Use Case |
|:---|:---|:---|
| **Adapter** | Converts interfaces | 3rd-party library integration |
| **Decorator** | Wraps for more features | Java I/O, `@Cacheable` |
| **Facade** | One button for many features | API Gateway, Service Facade |
| **Proxy** | Interceptor/Gatekeeper | Spring AOP, Security, Lazy Loading |
