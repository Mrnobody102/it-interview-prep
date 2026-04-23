# ROS 2 Communication, QoS & Lifecycle

## Overview

ROS 2 is primarily valuable as a distributed systems framework for robots.

To use it well, you need to understand:

- node interaction patterns
- QoS semantics
- lifecycle-managed behavior
- launch and replay tooling

---

## Core ROS 2 Communication Primitives

Main primitives:

- **topics** for pub/sub data streams
- **services** for request-response interactions
- **actions** for long-running goal-oriented tasks
- **parameters** for configurable runtime behavior

Choosing the wrong primitive leads to brittle APIs and awkward runtime behavior.

Examples:

- camera frames belong on topics
- configuration or one-shot queries often fit services
- navigation goals usually fit actions

---

## QoS Is Operationally Important

Quality of Service settings affect message delivery and timing behavior.

Important knobs:

- reliability
- durability
- history depth
- deadline
- liveliness

These are not academic details. They determine how the system behaves with lossy networks, delayed subscribers, or bursty sensors.

---

## Lifecycle Nodes and Launch

Lifecycle nodes make it easier to manage startup, shutdown, and recovery behavior.

Useful states include:

- unconfigured
- inactive
- active
- finalized

This helps when a robot must coordinate:

- hardware initialization
- map loading
- planner bring-up
- safe restart after failure

Launch files and parameterization also matter because robot systems are rarely started by hand one command at a time.

---

## Tooling That Matters

Practical ROS 2 tooling knowledge should include:

- topic and service introspection
- `rosbag` recording and replay
- parameter inspection
- TF inspection
- launch debugging

Replayable logs are especially valuable because many robotics issues are intermittent and timing-dependent.

---

## Interview Q&A

### 1) When should you use an action instead of a service?

When the task is long-running, needs feedback, or may be canceled, such as navigation or manipulation goals.

### 2) Why does QoS matter so much in robotics?

Because robot systems depend on predictable message delivery and timing under real-world network and compute conditions.

### 3) What is the benefit of lifecycle nodes?

They provide explicit runtime state management, making bring-up, shutdown, validation, and recovery more reliable.

### 4) Why is rosbag replay so useful?

Because it lets you reproduce timing-dependent failures and debug perception or coordination issues without recreating the exact physical scenario every time.
