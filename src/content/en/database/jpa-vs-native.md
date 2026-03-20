# Database Scenario → JPA vs Native Query

## JPA

- Abstracts SQL, portable across DBs, supports entity mapping, transactions, caching, pagination.

## Native Query

- Raw SQL leveraging DB-specific features, best for complex/optimized cases.

## Practice

- Favor JPA/JPQL for CRUD and common queries.
- Use native for complex/specialized or performance-critical queries.