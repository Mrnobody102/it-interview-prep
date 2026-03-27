# Modular Monolith

## Overview

A Modular Monolith is a **monolithic** architecture but **divided into independent modules** logically. Each module has a clear boundary and can be developed independently by different teams.

## Key Characteristics

### Like a Monolith

- **Single artifact**: Build and deploy as one unit.
- **Shared database**: All modules share one database (usually schema divided by module).
- **Synchronous communication**: Modules call each other directly (in-process call).

### Like Microservices

- **Clear module boundaries**: Each module has its own namespace and package.
- **Low coupling**: Modules only communicate through internal interfaces/APIs.
- **Independent deployability** (in some implementations): Can deploy modules independently if needed.

## Comparison

| Criteria | Monolith | Modular Monolith | Microservices |
|----------|----------|-----------------|---------------|
| Deployment | Entire application | Entire application (or module) | Each service |
| Database | Shared | Shared (schema divided by module) | Each service has own DB |
| Team ownership | Shared | Module ownership | Service ownership |
| Coupling | High (usually) | Low (clear boundaries) | Low |
| Communication | In-process | In-process | IPC |
| Complexity | Low | Medium | High |

## Example Structure

```
src/
├── module-order/          # Order module
│   ├── domain/
│   │   ├── Order.java
│   │   └── OrderItem.java
│   ├── repository/
│   │   └── OrderRepository.java
│   └── service/
│       └── OrderService.java
├── module-user/          # User module
│   ├── domain/
│   ├── repository/
│   └── service/
├── module-payment/       # Payment module
│   ├── domain/
│   ├── repository/
│   └── service/
└── shared/               # Shared utilities
```

## When to Use?

- **Small/medium-sized projects initially**: Simple, fast to develop and deploy.
- **When clear module boundaries are needed**: Easy to migrate to microservices later if needed.
- **Small teams**: Not enough resources to operate multiple services.
- **When the system isn't large enough yet**: Microservices overhead not yet justified.

> **Note**: Modular Monolith is a good starting point. As the system grows, individual modules can be extracted into separate microservices in a planned way.
