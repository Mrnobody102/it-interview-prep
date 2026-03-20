# Database → Transaction, Isolation, Locking

## ACID

- **Atomicity:** All or nothing.
- **Consistency:** Data consistent after transaction.
- **Isolation:** Transactions are independent.
- **Durability:** Results are permanently stored.

## Isolation Levels

- Read Uncommitted, Read Committed, Repeatable Read, Serializable.

## Phenomena

- Dirty Read, Non-repeatable Read, Phantom Read.

## Locking

- Shared vs Exclusive; avoid deadlock with short transactions and consistent lock ordering.