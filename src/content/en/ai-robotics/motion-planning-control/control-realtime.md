# Control, Real-Time Systems & Execution

## Overview

Planned motion becomes real motion only through closed-loop execution.

This topic focuses on:

- control laws
- timing constraints
- execution monitoring
- real-time behavior

---

## Control Strategies

Important families include:

- PID
- feedforward plus feedback control
- model predictive control
- tracking controllers for trajectories

The right controller depends on robot dynamics, latency tolerance, and task precision.

---

## Real-Time Constraints

Control loops are sensitive to:

- update frequency
- sensor latency
- actuator delay
- jitter in computation

A beautiful planner can still fail if timing is unstable.

---

## Execution Monitoring

Useful runtime checks include:

- tracking error thresholds
- unexpected contact or force events
- divergence from expected trajectory
- controller saturation

Execution monitoring is the bridge between planning optimism and physical reality.

---

## Interview Q&A

### 1) Why is control different from planning?

Because planning proposes desired motion, while control continuously corrects execution using feedback from the real system.

### 2) Why does timing matter so much in control?

Because delayed or jittery feedback can destabilize the loop and degrade tracking quality.

### 3) What is a benefit of MPC?

It can optimize future control actions under constraints, which is useful when the robot must balance dynamics and limits explicitly.
