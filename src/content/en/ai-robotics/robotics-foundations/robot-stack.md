# Robot Stack Architecture & Middleware

## Overview

A useful robotics engineer sees a robot as a layered distributed system, not as one giant executable.

Typical layers include:

1. sensors and actuators
2. device drivers and hardware interfaces
3. middleware and messaging
4. state estimation and perception
5. planning and control
6. behavior orchestration
7. safety and supervision

---

## Why Middleware Exists

Middleware solves repeated robotics problems:

- communication between processes
- serialization and transport
- discovery of distributed components
- separation of concerns between modules
- replay and debugging support

Without middleware, every robot stack reinvents fragile integration logic.

---

## Distributed Architecture in Practice

Real robots often run many cooperating processes:

- camera drivers
- localization nodes
- planners
- controllers
- logging and diagnostics services

This matters because failure is rarely local. A timing issue in one module can destabilize the rest of the stack.

Good architecture therefore emphasizes:

- clear contracts between modules
- bounded latency expectations
- fallback behavior
- observability of state and health

---

## Behavior Orchestration

Robots usually need explicit coordination logic above low-level modules.

Common orchestration patterns:

- behavior trees
- finite-state machines
- task graphs
- supervisor nodes with recovery policies

This layer decides what the robot should do when:

- a goal fails
- a sensor disappears
- localization confidence drops
- a human operator intervenes

---

## Interview Q&A

### 1) Why is robotics software usually distributed instead of monolithic?

Because sensing, planning, control, and monitoring have different timing, ownership, and failure patterns, and modularity makes integration and debugging manageable.

### 2) What does middleware provide in robotics?

It provides standardized communication, discovery, transport abstraction, and tooling so modules can interact without hard-wired custom integration.

### 3) Why is orchestration a separate concern from control?

Because orchestration decides task-level behavior and recovery flow, while control focuses on low-level actuation and stabilization.

### 4) What makes robot architecture hard?

Because modules are tightly coupled through timing, transforms, sensor quality, and safety constraints even when the code is modular.
