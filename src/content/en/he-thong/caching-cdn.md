# Caching & CDN

## Overview
**Caching** is the art of storing frequently used data in a fast-access location (RAM) so we don't have to fetch it from the slow location (Database/Disk) every time.

---

## 1. Caching Analogy
Imagine you are a **Bubble Tea Cashier**.
- **Without Cache:** Every time a customer asks for a "Signature Milk Tea," you have to walk back to the kitchen, find the recipe book, read it, and come back.
- **With Cache:** You write the "Signature Milk Tea" recipe on a **sticky note** and stick it right on the cash register. Much faster!

---

## 2. CDN (Content Delivery Network)
A CDN is a "Cache" for your static files (Images, CSS, JS) distributed all over the world.

**Analogy:** You are selling a famous book in Vietnam, but a customer in New York wants to buy it.
- **Without CDN:** You ship the book from Vietnam (High latency).
- **With CDN:** You place a copy of the book in a **warehouse in New York**. The customer gets it in an hour!

---

## 3. Cache Eviction & Invalidation
The sticky note (Cache) has limited space. When it's full, what do you do?
- **LRU (Least Recently Used):** Throw away the sticky note you haven't looked at in a long time.
- **Cache Invalidation:** If the kitchen changes the recipe (Database update), you must **tear up the old sticky note** and write a new one. Otherwise, you'll serve the wrong tea!

---

## 4. Common Caching Strategies

| Strategy | How it works | Analogy |
|---|---|---|
| **Cache Aside** | Check cache first. If missing, get from DB and update cache. | Checking your sticky note first. |
| **Write Through** | Write to cache and DB at the same time. | Updating your note and the recipe book simultaneously. |
| **Write Back** | Write to cache only. Update DB later. | Updating your note now, and fixing the book at the end of the day. |

---

## 5. Interview Questions (The Tricky Parts)

> **Q: What is "Cache Stampede"?**
> **A:** When a very popular cache key expires, and **thousands of requests** hit the Database at the same time to refresh it, potentially crashing the DB.
> **Solution:** Use locking or extend the TTL randomly.

> **Q: What is "Cache Penetration"?**
> **A:** When a user requests data that exists neither in the Cache nor in the DB (like a random ID). The request keeps hitting the DB.
> **Solution:** Cache the "null" result or use a **Bloom Filter**.

---

## 6. Summary

- **Why Cache?** Speed up reads, save the Database.
- **Why CDN?** Reduce latency for global users.
- **Rule of thumb:** "There are only two hard things in Computer Science: cache invalidation and naming things." — Phil Karlton.
