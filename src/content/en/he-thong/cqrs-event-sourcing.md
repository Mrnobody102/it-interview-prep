# CQRS & Event Sourcing

## Overview
**CQRS** (Command Query Responsibility Segregation) and **Event Sourcing** are the ultimate duo for massive distributed systems. They solve the problem: **When data is huge, how do we read fast while keeping writes safe?**

---

## 1. CQRS (Separate Read & Write)

### The Problem with CRUD
Normally, we use **one database** and **one model** for both Writing (INSERT) and Reading (SELECT).
But in reality: **Reads happen 100x more than Writes.**
- If your Database is busy calculating complex taxes (Write), and someone tries to search for a product (Read), the whole system slows down.

### The CQRS Solution
Split the system into two independent sides:
- **Write Side (Command):** Only handles Inserts/Updates. Usually uses a SQL Database for consistency.
- **Read Side (Query):** Only handles Selects. Data is synced from the Write side to a specialized Read DB (like Elasticsearch or MongoDB) for lightning-fast searches.

**Analogy:** A **Newspaper Publisher**.
- **Write Side:** Journalists write, edit, and proofread in a strict internal system (Command).
- **Read Side:** Once a story is published, it’s pushed to a static website for millions of readers (Query). The readers never touch the internal writing system!

---

## 2. Event Sourcing (The Source of Truth)

### The Problem with State-based Storage
Normally, we only store the **Current State**.
*Example:* Order ORD-123 has `status = "CANCELLED"`.
But we don't know: *"What was it before? Who cancelled it? When?"* The history is lost!

### The Event Sourcing Solution
Instead of storing the final state, we store the **history of all actions (Events)**. We can "replay" these events to find out the current state.

**Analogy:** A **Bank Ledger**.
A bank NEVER just stores: "Account A has $1,000."
They store every transaction:
1. Deposit $500.
2. Transfer $100 to B.
3. Receive salary $600.
-> To know the current balance, the system calculates: `500 - 100 + 600 = 1000`.

### Huge Benefits:
- **Audit Trail:** 100% proof of what happened. Great for Finance or Healthcare.
- **Time Travel:** Need a report for "Yesterday at 3 PM"? Just replay the events until that timestamp.
- **Fixing Bugs:** If a bug messed up your data for a month, you can fix the code and "Replay" all events from the start of the month to get the correct numbers!

---

## 3. Interview "Hard" Question

> **Q: What is the biggest drawback of CQRS/ES?**
> **A:** **Eventual Consistency**. Since the Read and Write DBs are separate, there’s a small delay (lag) for syncing. If a user changes their Avatar and hits refresh immediately, they might still see the old one for a second. The system must be designed to handle this "lag."

---

## 4. Summary
- **CQRS =** Scale reads and writes independently.
- **Event Sourcing =** Never lose history, replay for truth.
- **Avoid if:** You are building a simple CRUD app. It adds 10x more complexity!
