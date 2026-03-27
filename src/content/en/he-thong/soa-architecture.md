# SOA - Service-Oriented Architecture

## Overview

SOA (Service-Oriented Architecture) organizes a system into **reusable services**, which communicate with each other through an **ESB (Enterprise Service Bus)**.

## Key Characteristics

### ESB (Enterprise Service Bus)

- The **central communication hub** between services.
- Responsible for routing, transformation, and protocol mediation.
- **Examples**: MuleSoft, IBM Integration Bus, WSO2.

### Service Registry

- Stores metadata of services.
- Helps with dynamic service discovery and binding.

### Other Characteristics

- **Loose coupling**: Services communicate via ESB, not directly.
- **Reusability**: Services are designed to be reused by multiple applications.
- **Business alignment**: Services are organized by business capability.
- **Enterprise focus**: Commonly used in large enterprises with many legacy systems.

## SOA vs Microservices Comparison

| Criteria | SOA | Microservices |
|----------|-----|---------------|
| Communication | ESB (centralized) | API/direct communication (decentralized) |
| Service size | Large, business services | Small, single responsibility |
| Data | Shared database (usually) | Each service has its own database |
| Protocol | SOAP, WS-* | REST, gRPC, Message Queue |
| Deployment | Relatively independent | Fully independent |
| Governance | Centralized (enterprise) | Decentralized (team-driven) |
| Coupling | Medium | Very low |
| Complexity | High | High (different type) |

## Advantages of SOA

- **High reusability**: Services can be used by many applications.
- **Interoperability**: Supports many protocols (SOAP, REST, JMS...).
- **Business agility**: Easy to change business processes through service recombination.
- **Legacy system integration**: SOA is often used to connect legacy systems with new ones.

## Disadvantages of SOA

- **ESB is a single point of failure**: If ESB goes down, the entire system is affected.
- **ESB becomes complex**: Becomes a "god component" — too much logic concentrated in one place.
- **Overhead**: SOAP/WS-* has significant overhead compared to REST/gRPC.
- **Performance**: ESB transformation can introduce latency.

## When to Use?

- Large enterprise systems needing to integrate many legacy systems.
- When communication across many different protocols is needed.
- When centralized governance is required.
