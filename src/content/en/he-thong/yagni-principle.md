# YAGNI (You Aren't Gonna Need It)

## Core Concept
Don't build features or "flexibility" for future needs that haven't happened yet.

**Real-world Analogy:** Selling T-shirts in your neighborhood.
- **You think:** *"I should build a multi-language system and Bitcoin payment for when we go global!"*
- **The Reality:** You waste 2 months building things that **nobody ever uses**. 

---

## Red Flags
- **Commented-out code:** "Just in case we need this old logic back." (Use Git for that!)
- **Ghost Parameters:** Functions with parameters that aren't used yet.
- **Over-abstraction:** Interfaces for classes that only have one implementation.

---

## SOLID vs. YAGNI?
- **YAGNI:** Don't create an Interface *now* if you only have one payment method.
- **SOLID:** When the boss actually asks for a second payment method *later*, that's when you refactor and add the Interface.

---

## Summary for Interviews
| Principle | Summary | Question |
|---|---|---|
| **YAGNI** | Don't build for "What if?" | *"Did the boss ask for this today?"* |
