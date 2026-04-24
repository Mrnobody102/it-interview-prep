# Safety Layers, Guardrails & Supervision

## Overview

Learned or planned behavior should not be trusted without supervision.

This topic focuses on:

- layered safety
- runtime checks
- fallback logic
- supervisor design

---

## Safety Layers

Common layers include:

- hard physical stop conditions
- controller-level limits
- motion guards
- perception confidence thresholds
- high-level task supervision

Safety should not depend on one mechanism alone.

---

## Runtime Guardrails

Useful runtime checks:

- collision proximity thresholds
- force or torque anomalies
- localization confidence loss
- planner divergence
- watchdog heartbeat failure

Guardrails are only useful if they can intervene fast enough.

---

## Fallback and Recovery

A well-designed system should know:

- when to slow down
- when to stop
- when to request help
- when to switch to a degraded mode

Recovery is part of safety, not a separate afterthought.

---

## Interview Q&A

### 1) Why is layered safety important?

Because any single safeguard can fail, and different failure modes appear at different layers of the system.

### 2) What is a runtime guardrail?

It is a condition or mechanism that monitors live behavior and intervenes when safety or validity constraints are violated.

### 3) Why is fallback behavior part of safety?

Because a system that cannot degrade safely often turns minor faults into unsafe outcomes.
