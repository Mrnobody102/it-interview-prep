# Database -> Transaction, Isolation & Locking

## 1. Transaction

### 1.1. Concept

A **transaction** is a sequence of database operations treated as a single logical unit of work. All operations within a transaction either succeed together or fail together -- there is no partial state.

- **COMMIT**: Persists all changes to the database permanently.
- **ROLLBACK**: Discards all changes, reverting the database to its state before the transaction began.

### 1.2. Example: Money Transfer

```sql
BEGIN TRANSACTION;

  UPDATE accounts SET balance = balance - 100 WHERE id = 1;  -- Deduct from A
  UPDATE accounts SET balance = balance + 100 WHERE id = 2;  -- Credit to B

COMMIT;
```

| Property | Result |
|----------|--------|
| **Atomicity** | Crash mid-transaction -> rollback, no one loses money |
| **Consistency** | Total balance of A+B stays the same |
| **Durability** | After COMMIT -> permanently persisted |

---

## 2. ACID

| Letter | Property | Description |
|--------|---------|-------------|
| **A -- Atomicity** | Atomicity | All or nothing -- the transaction executes completely or not at all |
| **C -- Consistency** | Consistency | After a transaction, the database is always in a valid state, never violating constraints (primary key, foreign key, NOT NULL, CHECK, etc.) |
| **I -- Isolation** | Isolation | Concurrent transactions do not interfere with each other -- the effect is as if they ran sequentially |
| **D -- Durability** | Durability | Committed results are permanently stored and survive any system failure (crash, restart, power outage) |

### Why does Consistency matter?

Consistency is the **responsibility of the application developer**, not the database engine. The DBMS enforces **integrity constraints**, but it is up to your transaction logic to ensure the data makes business sense. For example, if your business rule says "an account balance can never go negative," the database might enforce a CHECK constraint, but your transaction must correctly implement the withdrawal logic.

### Isolation: The most misunderstood property

Isolation determines how concurrent transactions interact. The **ISO SQL standard** defines four isolation levels, but each database implements them differently. Higher isolation means fewer anomalies but worse performance due to more locking.

> **Note**: Not all databases fully support ACID. **MongoDB** (pre-v4.0) and many **NoSQL** databases support **BASE** (Basically Available, Soft state, Eventual consistency) instead. Redis with AOF persistence also provides strong durability but relaxed consistency.

---

## 3. Isolation Levels

### 3.1. Overview

| Level | Dirty Read | Non-repeatable Read | Phantom Read |
|-------|------------|---------------------|--------------|
| **Read Uncommitted** | Possible | Possible | Possible |
| **Read Committed** | Not possible | Possible | Possible |
| **Repeatable Read** | Not possible | Not possible | Possible |
| **Serializable** | Not possible | Not possible | Not possible |

> **Defaults by popular databases**: PostgreSQL, Oracle, SQL Server = **Read Committed** | MySQL (InnoDB) = **Repeatable Read**

---

### 3.2. Read Uncommitted

- A transaction can read data that **another transaction has modified but not yet committed**.
- This is the weakest isolation level -- it carries the highest risk of reading data that never actually existed in the database (if the other transaction rolls back).
- Rarely used in production because the risk of dirty reads is unacceptable for most business scenarios.

```sql
-- Session A: Begin transaction, update but do not commit
BEGIN;
UPDATE accounts SET balance = 0 WHERE id = 1;

-- Session B: Can read balance = 0 (uncommitted data!)
SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;
SELECT balance FROM accounts WHERE id = 1;  -- Reads uncommitted value
```

**When might you use it?** Performance benchmarking, or read-heavy analytics where slightly stale data is acceptable and you want maximum throughput.

---

### 3.3. Read Committed *(Default: PostgreSQL, Oracle, SQL Server)*

- A transaction can only read data that **has been committed** by other transactions.
- Still vulnerable to **non-repeatable reads**: reading the same row twice within a single transaction may return different values if another transaction modifies and commits that row between the two reads.

```sql
-- Session A: Read balance = 1000
SELECT balance FROM accounts WHERE id = 1;  -- 1000

-- Session B: Commit a change to balance = 2000
UPDATE accounts SET balance = 2000 WHERE id = 1; COMMIT;

-- Session A: Re-read -> 2000 (different from first read!)
SELECT balance FROM accounts WHERE id = 1;  -- 2000
```

**Most production systems use Read Committed** because it strikes a reasonable balance between correctness and performance.

---

### 3.4. Repeatable Read *(Default: MySQL InnoDB)*

- Within a single transaction, **all reads see a consistent snapshot** as it existed at the start of the transaction.
- Once you read a row, that row's data will never change for the duration of your transaction -- even if another transaction updates and commits it.
- **Phantom reads can still occur**: new rows matching your WHERE clause may be inserted by other transactions, so a second SELECT with the same conditions may return more rows.

Most databases add **gap locking** to reduce phantom reads at this level, but it is not fully eliminated unless you use Serializable.

---

### 3.5. Serializable

- The **strictest** isolation level -- transactions execute as if they ran one after another, with no overlap.
- The database effectively serializes all write operations, preventing every anomaly.
- **Downside**: worst performance. Transactions may wait for each other, and deadlocks become more frequent.
- **Use only when correctness absolutely cannot be compromised** -- e.g., financial ledger calculations.

---

## 4. Concurrency Anomalies

| Anomaly | Description | Occurs at |
|---------|-------------|-----------|
| **Dirty Read** | Reading data modified by an uncommitted transaction -- if that transaction rolls back, you read data that never existed | Read Uncommitted |
| **Non-repeatable Read** | Reading the same row twice in one transaction yields different values because another transaction modified and committed it | Read Uncommitted, Read Committed |
| **Phantom Read** | A second execution of the same range query returns more (or fewer) rows because another transaction inserted or deleted rows in that range | Read Uncommitted, Read Committed, Repeatable Read |
| **Lost Update** | Two transactions both read and modify the same data; one write overwrites the other, losing the first update entirely | Any level (without proper locking) |

---

## 5. Locking

### 5.1. Shared vs Exclusive Locks

| Lock Type | Symbol | Behavior |
|-----------|--------|----------|
| **Shared Lock (S)** | S | Multiple transactions can hold a shared lock on the same row simultaneously for reading. Blocks any exclusive lock. |
| **Exclusive Lock (X)** | X | Only one transaction can hold an exclusive lock on a row. Blocks any other lock (shared or exclusive). |

```
S + S = Compatible (both can read)
S + X = Incompatible (X waits for S)
X + X = Incompatible (X waits for X)
```

### 5.2. Pessimistic Locking

**Acquire locks at read time** -- you assume conflict is likely and prevent it by locking rows upfront.

```java
// Spring Data JPA -- pessimistic write lock
@Lock(LockModeType.PESSIMISTIC_WRITE)
@Query("SELECT u FROM User u WHERE u.id = :id")
Optional<User> findByIdWithLock(@Param("id") Long id);
```

```sql
-- Lock a specific row (SELECT FOR UPDATE)
SELECT * FROM accounts WHERE id = 1 FOR UPDATE;
-- Exclusive Lock: only one transaction can read or write this row

-- Shared lock (PostgreSQL)
SELECT * FROM accounts WHERE id = 1 FOR SHARE;
-- Multiple transactions can read, but none can write
```

**When to use pessimistic locking?** When multiple transactions frequently write to the same rows, and the cost of a conflict is high (e.g., payment processing, seat booking, inventory management). It guarantees no lost updates but can cause contention and deadlocks.

---

### 5.3. Optimistic Locking

**Do not lock at read time** -- allow concurrent reads and detect conflicts at write time by checking a version number or timestamp.

```java
// JPA entity with version field
@Entity
public class Account {
    @Id
    private Long id;

    @Version
    private Long version;

    private BigDecimal balance;
}
```

```sql
-- When updating, the database checks the version
UPDATE accounts
SET balance = 2000, version = version + 1
WHERE id = 1 AND version = 5;

-- If version != 5 -> 0 rows affected -> OptimisticLockException
```

| Criterion | Pessimistic | Optimistic |
|-----------|-------------|------------|
| **Mechanism** | Lock on read | Check version on write |
| **Conflict handling** | Prevented upfront | Detected and resolved after |
| **Performance** | Slower (locks block others) | Faster (no blocking) |
| **Best for** | Write-heavy, frequent conflicts | Read-heavy, rare conflicts |
| **Conflict resolution** | Wait for lock release | Retry logic on exception |

---

### 5.4. Code Comparison

```java
// Pessimistic Locking -- prevents conflicts by locking
@Transactional
public void transferPessimistic(Long fromId, Long toId, BigDecimal amount) {
    Account from = repo.findByIdWithLock(fromId);  // SELECT FOR UPDATE
    Account to = repo.findByIdWithLock(toId);      // Row locked here
    from.setBalance(from.getBalance().subtract(amount));
    to.setBalance(to.getBalance().add(amount));
    repo.saveAll(List.of(from, to));
}

// Optimistic Locking -- detects conflicts and retries
@Transactional
public void transferOptimistic(Long fromId, Long toId, BigDecimal amount) {
    int retries = 3;
    while (retries > 0) {
        Account from = repo.findById(fromId);  // No lock acquired
        Account to = repo.findById(toId);
        from.setBalance(from.getBalance().subtract(amount));
        to.setBalance(to.getBalance().add(amount));
        try {
            repo.saveAll(List.of(from, to));
            break;  // Success -> exit loop
        } catch (OptimisticLockException e) {
            retries--;
            if (retries == 0) throw e;
            // Detach and re-fetch to get the latest version
            entityManager.detach(from);
            entityManager.detach(to);
        }
    }
}
```

---

## 6. Deadlock

### 6.1. Concept

A **deadlock** occurs when two or more transactions each hold a lock that the other needs, and neither can proceed without the other releasing its lock.

### 6.2. Example

```
Transaction A: Lock(Rec1) -> Waiting for Lock(Rec2)...
Transaction B: Lock(Rec2) -> Waiting for Lock(Rec1)...
-> DEADLOCK (neither can continue)
```

### 6.3. Prevention and Resolution

| Strategy | Description |
|----------|-------------|
| **Database-level detection** | PostgreSQL and MySQL automatically detect deadlocks and roll back one transaction (usually the one with fewer locks) |
| **Consistent lock ordering** | Always access tables/rows in the same order (A -> B -> C) across all transactions |
| **Keep transactions short** | Hold locks for the minimum time -- commit or rollback as soon as possible |
| **Granular locking** | Lock only the specific rows needed, not entire tables |
| **Retry logic** | Catch `DeadlockLoserDataAccessException` and retry with exponential backoff |

```java
// Spring's DataAccessException hierarchy includes deadlock exceptions
// Spring's default transaction manager automatically retries deadlock transactions
@Transactional
public void updateOrder(Long id, String status) {
    // ...
}
```

---

## 7. Two-Phase Locking (2PL)

### 7.1. Concept

**Two-Phase Locking** is a protocol that guarantees serializability:

1. **Growing Phase**: Transaction can **acquire** locks but **cannot release** any.
2. **Shrinking Phase**: Transaction can **release** locks but **cannot acquire** any new ones.

### 7.2. Variants

| Type | Description |
|------|-------------|
| **Strict 2PL** | Holds exclusive locks until COMMIT/ROLLBACK (most common) |
| **Conservative 2PL** | Acquires all locks upfront before starting (rarely used) |

Strict 2PL is the most widely implemented variant. It prevents dirty writes (writing uncommitted data) but still allows certain anomalies at lower isolation levels.

---

## 8. Spring @Transactional Configuration

### 8.1. Isolation Levels

```java
// Set isolation for a specific method
@Transactional(isolation = Isolation.READ_COMMITTED)
public void updateOrder(Long id, String status) {
    // ...
}

// Common isolation levels
// Isolation.READ_UNCOMMITTED
// Isolation.READ_COMMITTED      (PostgreSQL, Oracle, SQL Server default)
// Isolation.REPEATABLE_READ     (MySQL InnoDB default)
// Isolation.SERIALIZABLE
// Isolation.DEFAULT             (uses database default)
```

### 8.2. Propagation Behaviors

| Propagation | Behavior |
|-------------|----------|
| **REQUIRED** (default) | Join the existing transaction, or create a new one if none exists |
| **REQUIRES_NEW** | Always create a new transaction, suspending the current one if needed |
| **NESTED** | Create a nested transaction using savepoints (MySQL/InnoDB supports this) |
| **MANDATORY** | Must run within an existing transaction; throws exception otherwise |
| **NEVER** | Must NOT run within a transaction; throws exception if one exists |
| **NOT_SUPPORTED** | Execute without a transaction; suspend existing transaction if present |
| **SUPPORTS** | Run with a transaction if one exists, or without one if not |

```java
@Transactional(propagation = Propagation.REQUIRES_NEW)
public void sendNotification(Long userId, String message) {
    // Always runs in its own transaction -- independent of the outer one
}
```

### 8.3. Rollback Rules

**Critical pitfall**: Spring's default rollback behavior only rolls back on **unchecked exceptions** (RuntimeException and its subclasses, plus Error).

```java
// Default behavior: rolls back on RuntimeException
@Transactional
public void processOrder(Long orderId) {
    throw new RuntimeException("Validation failed");  // -> Rollback
}

// Does NOT rollback by default on checked exceptions
@Transactional
public void processOrder(Long orderId) throws Exception {
    throw new IOException("Network error");  // -> Commits! (data is saved -- dangerous)
}

// Explicitly declare which exceptions trigger rollback
@Transactional(rollbackFor = IOException.class)
public void processOrder(Long orderId) throws Exception {
    throw new IOException("Network error");  // -> Rollback
}

// Or noRollbackFor to prevent rollback on specific exceptions
@Transactional(noRollbackFor = EmailDeliveryException.class)
public void confirmOrder(Long orderId) {
    // Even if email fails, the order is still committed
}
```

### 8.4. Self-Invocation Trap

**This is one of the most common Spring transaction pitfalls.** A `@Transactional` method calling another `@Transactional` method within the **same class** does NOT start a new transaction. Spring's proxy-based AOP only intercepts calls that go **through the proxy**.

```java
@Service
public class OrderService {

    // This works -- called from outside the class (through the proxy)
    public void placeOrder(Order order) {
        // Spring proxy handles this
        updateInventory(order);
        chargePayment(order);
        sendConfirmation(order);  // Does NOT run in the same transaction!
    }

    // This method has NO transaction -- inner call bypasses the proxy
    private void sendConfirmation(Order order) {
        // self-invocation: no proxy, no transaction
        emailService.sendEmail(order.getUserEmail());
    }
}
```

**Fix**: Either call through the proxy (inject self or use `AopContext.currentProxy()`), or refactor into a separate bean.

### 8.5. Configuration

```properties
# Default isolation level
spring.datasource.hikari.transaction-isolation=TRANSACTION_READ_COMMITTED

# Lock timeout (ms) -- prevents indefinite waiting
spring.jpa.properties.jakarta.persistence.lock.timeout=3000
```

---

## 9. Interview Questions

> **Q: What is the difference between Pessimistic and Optimistic Locking?**

Pessimistic locking acquires a lock at read time (e.g., `SELECT FOR UPDATE`) and holds it until the transaction commits. This prevents conflicts entirely but blocks other transactions from accessing the locked rows, which can hurt performance under high contention. Optimistic locking does not lock on read -- instead, it checks a version or timestamp at write time. If the version has changed, the update fails and you must retry. Optimistic locking performs better when conflicts are rare but requires retry logic.

> **Q: Why is Serializable rarely used in production?**

Serializable creates locks on entire ranges of data, causing severe contention. Each transaction must wait for the previous one to complete before proceeding. Under high concurrency (e.g., 1000 concurrent users), the system can grind to a halt. Most applications use Read Committed with optimistic locking instead, which provides a good balance of correctness and performance.

> **Q: What is MVCC and how does it relate to Isolation Levels?**

**MVCC (Multi-Version Concurrency Control)** allows multiple transactions to read different versions (snapshots) of the same data simultaneously without blocking each other. PostgreSQL uses MVCC with Read Committed -- each SELECT statement sees a snapshot as of the moment that statement began. MySQL's InnoDB also uses MVCC with Repeatable Read, where the snapshot is taken at the start of the entire transaction. MVCC is what enables read-heavy workloads to scale without excessive locking.

> **Q: How does a Lost Update happen, and how do you prevent it?**

T1 reads balance = 1000. T2 reads balance = 1000. T1 writes balance = 1500 (1000 + 500). T2 writes balance = 1300 (1000 + 300). T1's update is lost because T2 overwrote it. Solutions: use `SELECT FOR UPDATE` (pessimistic) to lock the row during the read-modify-write cycle, or use `@Version` (optimistic) so that T2's write fails when the version has changed.

> **Q: What happens if a checked exception is thrown inside @Transactional?**

By default, Spring **does NOT roll back** for checked exceptions. The transaction commits anyway, potentially leaving the database in an inconsistent state. Always use `rollbackFor = YourCheckedException.class` for business exceptions that should trigger rollback.

> **Q: Can you name all four ACID properties and explain each in one sentence?**

Atomicity ensures all operations succeed or all fail together -- there is no partial state. Consistency guarantees the database moves from one valid state to another, respecting all constraints. Isolation makes concurrent transactions appear to run sequentially, preventing interference. Durability ensures committed data survives any system failure.
