# DRY Principle

## 

### Core Concept

> Every piece of logic should exist in exactly one, authoritative place in the system.

The DRY principle states that duplicates of logic — whether in code, data, or documentation — create maintenance nightmares and increase the likelihood of bugs.

### Purpose

- **Reduce bugs:** Fix logic in one place, not N places
- **Improve maintainability:** Changes propagate consistently across the codebase
- **Increase clarity:** Single source of truth makes code easier to understand
- **Better reusability:** Shared logic can be tested once and reused everywhere

### How to Apply DRY

#### Extract Reusable Functions / Methods

Instead of duplicating logic:

```javascript
// Bad: Repeated calculation
const area1 = width1 * height1;
const area2 = width2 * height2;

// Good: Single reusable function
function calculateArea(width, height) {
  return width * height;
}
```

#### Use Inheritance or Composition

```typescript
// Composition over inheritance
class UserService {
  constructor(private logger: Logger) {}
}

// Inheritance for shared behavior
class Animal {
  eat() { /* shared */ }
}
class Dog extends Animal {
  bark() { /* specific */ }
}
```

#### Centralize Constants and Configuration

```typescript
// Bad: Magic numbers scattered across code
if (user.age > 18) { ... }

// Good: Named constant
const MINIMUM_AGE = 18;
if (user.age > MINIMUM_AGE) { ... }
```

```typescript
// Centralize API endpoints
export const API_ENDPOINTS = {
  USERS: '/api/v1/users',
  PRODUCTS: '/api/v1/products',
} as const;
```

#### Extract Shared Utilities

```typescript
// utils/validation.ts
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
```

### DRY vs. WET

| Aspect | DRY | WET (Write Every Time) |
|---|---|---|
| **Code duplication** | Minimized | Allowed |
| **Maintainability** | High | Low |
| **Readability** | Can be abstract | More explicit |
| **Risk of over-abstraction** | Yes | No |

### When NOT to Apply DRY

> **Important:** DRY is a guideline, not an absolute rule. Over-applying DRY leads to over-engineering.

- **When abstractions are wrong:** Creating a shared base class for two things that happen to look similar today but will diverge in the future is worse than duplication
- **When simplicity is preferred:** Duplicating a simple SQL query in two places may be clearer than creating a complex abstraction layer
- **When coupling is a concern:** Forcing shared logic between unrelated modules can create unwanted coupling

> **Tip:** Duplicate code that evolves together is a smell. Duplicate code that changes for different reasons is sometimes fine. Ask: "Will these two pieces of code change for the same reasons?"
