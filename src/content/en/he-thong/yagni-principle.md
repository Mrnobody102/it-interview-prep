# Design Principles

## 5. YAGNI — You Aren't Gonna Need It

### 5.1. Core Concept

> Do not implement features, abstractions, or flexibility that you do not need right now.

YAGNI is an extreme programming (XP) principle that advises against speculative design. Only build what is required by the current requirements, not what you anticipate might be needed in the future.

### 5.2. Purpose

- **Avoid wasted effort:** Do not spend time coding features that will never be used
- **Smaller, cleaner codebase:** Less code means fewer bugs and easier maintenance
- **Faster delivery:** Ship value to users sooner
- **Reduced complexity:** No unnecessary abstractions cluttering the design

### 5.3. YAGNI in Practice

#### 5.3.1. What NOT to Do

```typescript
// Bad: Adding "flexibility" for imagined future needs
class UserRepository {
  // Using a complex abstraction "just in case" we switch databases
  save(user: User, databaseType: 'postgres' | 'mongodb' | 'redis') {
    // 500 lines of database-agnostic code
  }
}

// Bad: Building admin panels, roles, permissions "for future use"
class User {
  // Comment: "Will add role-based access control later"
  permissions: string[] = [];
}
```

#### 5.3.2. What TO Do Instead

```typescript
// Good: Simple and direct — solves the current problem
class UserRepository {
  private db: PostgresDatabase;

  async save(user: User): Promise<void> {
    await this.db.query(
      'INSERT INTO users (id, name, email) VALUES ($1, $2, $3)',
      [user.id, user.name, user.email]
    );
  }
}
```

### 5.4. YAGNI vs. SOLID Principles

YAGNI does not mean writing messy, non-extensible code. It means:

| Principle | YAGNI Says | SOLID Says |
|---|---|---|
| **Abstraction** | Do not add "just in case" abstraction | Make the right abstractions |
| **Open/Closed** | Do not over-engineer for extensibility | Open for extension, closed for modification |
| **Dependency Inversion** | Do not add interfaces "for future mocking" | Depend on abstractions |

> **Tip:** The key is **timing**. SOLID principles help when you need to extend existing code. YAGNI says: wait until you actually need to extend it. Premature abstraction is just as harmful as premature optimization.

### 5.5. Recognizing YAGNI Violations

Watch out for these red flags:

- **"Just in case" comments:** `// Might need this later`
- **Unused parameters:** `calculateArea(width, height, unusedParam)`
- **Commented-out code:** Old code kept "just in case"
- **Feature flags for undecided features:** Over-configured systems
- **Excessive interfaces:** One interface per class, even for small internal services

### 5.6. When YAGNI Might Be Over-Applied

- When it leads to **duplicated code** that is clearly meant to be shared
- When the codebase becomes **hard to test** due to tight coupling
- When **obvious architectural needs** (e.g., database layer) are ignored

### 5.7. Practical Rule of Thumb

| Question | YAGNI Verdict |
|---|---|
| Is this feature requested by the user or stakeholder? | Build it |
| Is this for "potential future" use? | Do not build it |
| Is this to avoid a clear code smell? | Fix the smell |
| Is this because "we might need it"? | Do not add it |

> **Summary:** YAGNI and DRY complement each other. YAGNI prevents building things that will not be used. DRY prevents repeating things that will be used. Together they help keep the codebase lean and relevant.
