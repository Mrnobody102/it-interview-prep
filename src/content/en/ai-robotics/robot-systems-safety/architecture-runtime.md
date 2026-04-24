# Production Architecture & Runtime Boundaries

## Overview

Robot safety begins with architecture, not just with emergency stop logic.

This topic focuses on:

- process boundaries
- ownership of execution
- edge vs cloud split
- failure containment

---

## Runtime Boundaries

Important questions:

- what runs onboard?
- what can tolerate cloud latency?
- which module owns final actuation?
- how are failures isolated?

Good boundaries reduce the blast radius of mistakes.

---

## Edge vs Cloud

Generally, low-latency and safety-critical functions belong closer to the robot.

Cloud or remote systems may support:

- analytics
- heavy planning
- fleet coordination
- long-horizon optimization

But a robot should not depend on remote systems for every critical reflex.

---

## Failure Containment

Useful architectural principles:

- explicit ownership
- watchdog processes
- degraded modes
- dependency minimization in safety-critical loops

Production robots should fail predictably, not creatively.

---

## Interview Q&A

### 1) Why do runtime boundaries matter?

Because they define which failures can propagate and which modules are allowed to influence safety-critical behavior.

### 2) Why should edge compute handle critical functions?

Because network delay or outages can make remote dependence too risky for real-time control and safety.

### 3) What is failure containment?

It is designing the system so that one bad component does not automatically destabilize the whole robot.
