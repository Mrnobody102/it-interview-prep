# Proxy Server (Forward vs. Reverse)

## Overview
A **Proxy Server** is an intermediate server that acts as a "middleman" between a client and another server. There are two main types: **Forward Proxy** and **Reverse Proxy**.

---

## 1. Forward Proxy (The Client's Friend)
A Forward Proxy sits in front of the **Client**.

**Analogy:** You want to buy bubble tea but you're too lazy. You ask your **Friend (Proxy)** to go buy it for you.
- The shop sees your Friend, but they don't know *you* are the one who actually wanted the tea.
- **Use case:** Bypassing firewalls (VPN), hiding your IP, or filtering what employees can browse at work.

---

## 2. Reverse Proxy (The Server's Guard)
A Reverse Proxy sits in front of the **Server**.

**Analogy:** You call a **Call Center**.
- You dial one number, but you talk to an **Operator (Reverse Proxy)**. The operator decides which specific staff member (Server) should handle your call.
- You don't know which staff member you're talking to; you just see the Call Center.
- **Use case:** Load balancing, Caching, SSL Termination (handling HTTPS), and protecting your backend servers.

---

## 3. Comparison Table

| Feature | Forward Proxy | Reverse Proxy |
|---|---|---|
| **Who it protects** | The Client | The Server |
| **Privacy** | Hides Client's IP | Hides Server's IP |
| **Main Use Case** | VPN, Web Filtering | Load Balancing, Security |
| **Location** | Client's Network | Server's Network |

---

## 4. Why use a Reverse Proxy? (Interview Answer)

In production, we **never** expose our backend servers (like Node.js or Java) directly to the internet. We always put a Reverse Proxy (like **Nginx** or **Apache**) in front because:
1. **Security:** It's a shield against DDoS attacks.
2. **Caching:** Nginx can cache images so the backend doesn't have to work.
3. **SSL Termination:** It handles the heavy encryption work so your app can focus on logic.
4. **Load Balancing:** It distributes traffic to multiple backend servers.

---

## 5. Summary

- **Forward Proxy =** Client's representative.
- **Reverse Proxy =** Server's gateway.
- **Keywords to remember:** Nginx, Hiding IP, Load Balancing.
