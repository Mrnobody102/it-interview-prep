# Behavioral Patterns

## 1. Observer Pattern (The Subscriber)
**Analogy:** A YouTube Channel.
- **Subject:** The Channel.
- **Observer:** You (The Subscriber).
When a new video is uploaded, everyone is notified automatically. You don't have to check the channel every day.

---

## 2. Strategy Pattern (The Interchangeable Tool)
**Analogy:** Choosing how to get to work.
- Sunny? **Motorbike strategy.**
- Rainy? **Taxi strategy.**
The destination is the same, but you swap the "how" at runtime. Great for swapping Payment methods (Momo vs. Visa).

---

## 3. Chain of Responsibility (The Approval Pipeline)
**Analogy:** A Leave Request.
- 1 day? **Direct Manager** approves.
- 5 days? Manager signs -> **Department Head** approves.
The request moves along a chain until someone has the authority to handle it.

---

## Summary for Interviews
| Pattern | Summary | Use Case |
|---|---|---|
| **Observer** | One talks, many listen. | Notifications, Event Listeners. |
| **Strategy** | Swap algorithms at runtime. | Payment methods, Sorting. |
| **Chain of Resp.** | Pass request along a chain. | Middleware, Filters. |
