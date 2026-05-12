# Structural Patterns

## 1. Adapter (The Power Plug)
**Analogy:** A travel adapter.
Your hairdryer has a 3-pin plug (UK), but the wall only has 2-pin holes (EU). You use an **Adapter** to bridge the gap. 
**Use Case:** Integrating a 3rd-party library that doesn't match your system's interface.

---

## 2. Decorator (The Wrapper)
**Analogy:** A cup of tea.
The base is tea. You wrap it in a "pearls" decorator, then wrap it again in a "cheese foam" decorator. It's still tea, but with more features.
**Example:** Java I/O (`new BufferedReader(new FileReader("...") )`).

---

## 3. Facade (The Dashboard)
**Analogy:** A car dashboard.
Behind the dashboard, there are thousands of wires and mechanical parts. You only see one button: "Start." 
**Use Case:** Hiding a complex library or microservice cluster behind one simple class.

---

## 4. Proxy (The Secretary)
**Analogy:** A Secretary.
You want to see the Boss? You talk to the Secretary first. The secretary checks your ID (Security) and your appointment (Validation). 
**Example:** Spring's `@Transactional` uses a Proxy to open/close DB connections automatically.

---

## Summary for Interviews
| Pattern | Summary | Use Case |
|---|---|---|
| **Adapter** | Converts interfaces. | Library integration. |
| **Decorator** | Adds features by wrapping. | Java I/O. |
| **Facade** | Simple interface for complex system. | API Wrappers. |
| **Proxy** | Interceptor/Gatekeeper. | Security, Logging, AOP. |
