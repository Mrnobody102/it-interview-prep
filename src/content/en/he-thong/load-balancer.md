# Load Balancer (The Traffic Cop)

## Overview
A **Load Balancer (LB)** sits in front of your servers and distributes incoming traffic across multiple servers to ensure no single server is overwhelmed.

---

## 1. Real-world Analogy
Imagine a very popular **Restaurant Receptionist**.
- If there's no receptionist, 50 customers might all try to sit at Table 1 while Table 2 is empty.
- The **Receptionist (LB)** checks which table is free and tells the customer: *"Please go to Table 2."* If Table 2 is broken (Server down), the receptionist won't send anyone there (**Health Check**).

---

## 2. Key Functions of a Load Balancer

- **High Availability:** If one server dies, the LB sends traffic to the others.
- **Scalability:** You can add 10 more servers, and the LB will automatically start giving them work.
- **Security:** It hides your server's real IP addresses from the internet.

---

## 3. Common Algorithms (How it decides)

| Algorithm | How it works | Analogy |
|---|---|---|
| **Round Robin** | Server 1, then 2, then 3... | Dealing cards in a circle. |
| **Least Connections** | Send to the server with the fewest active users. | Sending a customer to the cashier with the shortest line. |
| **IP Hash** | The same user always goes to the same server. | A regular customer always wants the same waiter (**Sticky Session**). |

---

## 4. Layer 4 vs. Layer 7 LB

- **Layer 4 (Transport):** Fast, but "blind." It only looks at IP and Port.
- **Layer 7 (Application):** Slower, but "smart." It can read the URL or Cookies.
  - *Example:* Send `/images` requests to the Image Server and `/api` requests to the API Server.

---

## 5. Interview Pro-Tips

> **Q: What happens if the Load Balancer itself dies?**
>
> **A:** That’s a **Single Point of Failure (SPOF)**. In production, we use **High Availability (HA)** for the LB itself—having a "Standby" LB ready to take over if the main one fails.

---

## 6. Summary

- **Load Balancer =** Reliability + Scalability.
- **Health Checks =** Making sure we don't send people to a "dead" server.
- **Sticky Sessions =** Keeping a user on the same server (needed for some legacy apps).
