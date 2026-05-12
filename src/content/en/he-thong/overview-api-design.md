# API Design (REST, GraphQL, gRPC)

## Overview
Designing an API is like **writing a Menu for a Restaurant**. You need to define what the customer (Client) can order, how much it costs, and what they will get back.

---

## 1. REST (The Classic Buffet)
REST uses standard HTTP methods (GET, POST, PUT, DELETE) to manage resources.

**Analogy:** A Buffet. Everything is laid out clearly. You want fish? Go to the fish station. You want salad? Go to the salad station.
- **Pros:** Standardized, easy to use, works everywhere.
- **Cons:** **Over-fetching** (You want only one grape, but you have to take the whole fruit basket).

---

## 2. GraphQL (The Custom Order)
GraphQL allows the client to ask for **exactly** what they need—nothing more, nothing less.

**Analogy:** A Custom Sandwich shop. Instead of a pre-made combo, you say: *"I want bread, two slices of ham, and extra cheese."* You get exactly that.
- **Pros:** No over-fetching, perfect for Mobile apps with limited bandwidth.
- **Cons:** Complexity on the server-side, harder to cache.

---

## 3. gRPC (The Internal Secret Radio)
gRPC uses Protocol Buffers (binary data) instead of JSON (text). It's incredibly fast.

**Analogy:** A secret internal radio used by a special ops team. It's not for the public (Browsers); it's for fast, encrypted communication between team members (Microservices).
- **Pros:** Blazing fast, low latency, strongly typed.
- **Cons:** Hard to debug (binary is unreadable by humans), limited browser support.

---

## 4. Best Practices (Interview Checklist)

1. **Versioning:** Always use `/v1/`, `/v2/` in the URL.
2. **Naming:** Use nouns, not verbs. `GET /users` is good; `GET /getAllUsers` is bad.
3. **Status Codes:** Use them correctly!
    - `200 OK`: Success.
    - `201 Created`: Successfully created something.
    - `400 Bad Request`: Client made a mistake.
    - `401 Unauthorized`: Who are you? (Need login).
    - `403 Forbidden`: I know you, but you're not allowed here.
    - `404 Not Found`: Doesn't exist.
    - `500 Internal Server Error`: Server crashed.
4. **Idempotency:** Making the same request multiple times should have the same result (e.g., `PUT` or `DELETE`).

---

## 5. Comparison Table

| Feature | REST | GraphQL | gRPC |
|---|---|---|---|
| **Format** | JSON | JSON | Binary (Protobuf) |
| **Protocol** | HTTP 1.1/2 | HTTP 1.1/2 | HTTP 2 |
| **Data fetching** | Fixed (Endpoint) | Flexible (Query) | Fixed (RPC) |
| **Best for** | Public APIs | Mobile/Frontend | Microservices (Internal) |
