# DRY (Don't Repeat Yourself)

## Core Concept
Every piece of logic must have a single, unambiguous source of truth.

**Real-world Analogy:** Your company's **Hotline number**.
Don't type the number manually on 100 different pages. Save it in one variable: `COMPANY_HOTLINE`. 
Why? Because if the company changes its phone number, you update it in **one place** instead of hunting through 100 files (and missing some).

---

## The "Rule of Three"
1. The first time you do something, you just do it.
2. The second time you do something similar, you might feel a bit of pain, but you do it anyway.
3. The **third time** you do something, you **Refactor** (Apply DRY). 

---

## When NOT to DRY?
Sometimes, two pieces of code look the same but change for different reasons. 
*Example:* The calculation for `Manager Salary` and `Security Guard Salary` might coincidentally be the same today. But they are different business concepts. If you merge them into one function, you'll have a nightmare when the Manager's bonus rules change next month. 
**Don't over-DRY!**

---

## Summary for Interviews
| Principle | Summary | Question |
|---|---|---|
| **DRY** | Don't copy-paste logic. | *"Have I written this logic elsewhere?"* |
