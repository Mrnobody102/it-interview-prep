# Manipulation Planning & Trajectory Generation

## Overview

Manipulation planning is usually harder than pure navigation because it combines:

- arm geometry
- collision reasoning
- object constraints
- contact-sensitive execution

---

## Typical Manipulation Planning Problems

Common tasks:

- pick and place
- grasp sequencing
- insertion and alignment
- constrained motion around clutter

These tasks depend on both perception quality and motion feasibility.

---

## Collision and Constraint Reasoning

Manipulation planning must reason about:

- self-collision
- environment collision
- end-effector orientation constraints
- object-relative motion constraints

Small planning errors can become large task failures when tolerance is tight.

---

## Trajectory Generation

Trajectory generation translates planned motion into time-parameterized commands.

Important concerns:

- velocity and acceleration limits
- smoothness
- tracking compatibility
- sensitivity to execution drift

The system should not only find a path, but find one the controller can execute reliably.

---

## Interview Q&A

### 1) Why is manipulation planning often harder than navigation planning?

Because it requires higher spatial precision, tighter constraints, and more sensitivity to contact and collision.

### 2) Why do orientation constraints matter in manipulation?

Because many tasks depend not only on reaching a point, but on arriving with a physically valid tool or gripper orientation.

### 3) Why is trajectory generation separate from path planning?

Because a geometric path still needs timing and smoothness decisions before a controller can execute it safely.
