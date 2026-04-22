# Python Core

## 1. Overview

This is the foundation of `Python Backend`. If this part is weak, moving up to `FastAPI`, `Django`, `Celery`, or AI serving usually leads to messy code, weak contracts, and difficult maintenance.

## 2. Type hints

### 2.1. Why do type hints matter?

Type hints do not make Python fully static, but they improve:

- API clarity
- IDE support
- code reviews
- early feedback from `mypy`
- team understanding of contracts

```python
from collections.abc import Iterable

def average(values: Iterable[float]) -> float:
    items = list(values)
    return sum(items) / len(items)
```

### 2.2. What should be typed clearly?

- request DTOs
- response DTOs
- service input/output
- repository contracts
- config objects
- async return types

### 2.3. Common mistakes

- using generic `dict` everywhere
- returning ORM objects in one place and dicts in another
- leaving complex public functions untyped

## 3. `dataclass`

### 3.1. When should you use it?

`dataclass` is a strong fit for internal data objects, especially in the service layer.

```python
from dataclasses import dataclass
from datetime import datetime

@dataclass(slots=True)
class AuditEvent:
    request_id: str
    user_id: str
    created_at: datetime
```

### 3.2. Good backend uses

- passing data between services and repositories
- modeling internal commands and queries
- simple domain objects
- trace and audit payloads

### 3.3. When should you not use it?

- when the object is already an ORM model
- when validation should live in framework schemas
- when the shape is too dynamic

## 4. Context managers

### 4.1. Why do they matter?

Context managers are important for resource lifecycle:

- files
- DB transactions
- locks
- network connections
- trace spans

```python
with open("app.log", "a", encoding="utf-8") as f:
    f.write("request completed\n")
```

### 4.2. The right mindset

Anything that looks like:

1. acquire
2. use
3. release

should make you think about a context manager.

### 4.3. Real project use cases

- transaction scopes
- tracing spans
- file and object streaming
- shared-resource locking

## 5. Generators and iterators

### 5.1. Why do they matter?

Generators help process data lazily instead of loading everything into memory.

```python
def iter_lines(path: str):
    with open(path, "r", encoding="utf-8") as f:
        for line in f:
            yield line.rstrip("\n")
```

### 5.2. Real use cases

- ETL
- large imports and exports
- log processing
- document chunking
- batch inference

### 5.3. Common mistakes

- converting generators to lists too early
- hiding side effects inside generators
- not understanding when work is actually executed

## 6. `Decimal`, `datetime`, `UUID`

### 6.1. `Decimal`

Use it for:

- money
- billing
- values that require exact arithmetic

Do not use `float` for money.

### 6.2. `datetime`

Backends almost always need:

- created/updated timestamps
- audit logs
- TTLs
- scheduling

Prefer timezone-aware datetimes.

### 6.3. `UUID`

Useful for:

- public identifiers
- distributed systems
- event IDs
- request correlation

## 7. Organizing Python backend code

A common long-lived structure is:

```text
app/
  api/
  schemas/
  services/
  repositories/
  models/
  workers/
  core/
```

The idea:

- `api`: thin handlers
- `schemas`: input/output models
- `services`: business logic
- `repositories`: DB/external access
- `workers`: background jobs
- `core`: config, logging, auth helpers

## 8. Common pitfalls

- stuffing business logic into routes
- skipping type hints
- inconsistent return objects
- scattering helper functions with no boundaries
- growing one giant utility module

## 9. Best practices

- type public APIs clearly
- keep route handlers thin
- use `dataclass` or schema objects instead of passing random dicts around
- keep timezone handling consistent
- separate internal data models from ORM models when the domain grows

## 10. Common interview questions

### 10.1. Do type hints make Python faster?

Not directly. Their main value is readability, tooling, and earlier error detection.

### 10.2. When should you use `dataclass`?

When an object mainly carries data, does not need ORM behavior, and should stay compact and easy to test.

### 10.3. How is a generator different from a list?

A generator produces values lazily, uses less memory, and fits streaming or large datasets better.
