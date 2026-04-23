# Motion Planning, Manipulation & Control

## Overview

Robots need more than perception. They must choose feasible actions that respect:

- kinematic constraints
- dynamics
- collisions
- environment structure
- timing and safety limits

This is the domain of planning and control.

---

## Kinematics First

Planning starts with geometry:

- forward kinematics
- inverse kinematics
- workspace limits
- singularities
- joint constraints

For manipulators, inverse kinematics is often the first hard constraint between "desired task" and "actually reachable pose".

---

## Planning Layers

A useful mental model is:

| Layer | Goal |
|---|---|
| **Task planning** | choose what to do |
| **Motion planning** | compute collision-free motion |
| **Trajectory generation** | assign time, velocity, acceleration |
| **Control** | track the motion on real hardware |

Confusing these layers leads to bad system design.

---

## Mobile Robot Planning

For navigation, the stack usually includes:

- global planning on a map
- local planning / local control
- obstacle avoidance
- recovery behaviors
- behavior-tree or task-level orchestration

Good navigation is not just shortest-path search. It is stable behavior under noisy sensing, dynamic obstacles, and imperfect localization.

That is why modern navigation stacks such as **Nav2** emphasize behavior trees, planner/controller separation, costmaps, recovery actions, and lifecycle-aware servers.

---

## Manipulation Planning

Manipulation planning adds:

- collision checking in high-dimensional joint space
- reachability analysis
- grasp generation
- approach and retreat paths
- constraints on orientation and contact

This is why MoveIt 2 and planning-scene reasoning matter so much in modern robotics stacks.

In practice, **MoveIt 2** is the most important manipulation framework to know in the ROS 2 world because it combines planning pipelines, constraints, collision checking, and trajectory generation around a maintained plugin architecture.

---

## Control Strategies

Important control families:

| Controller | Best for | Tradeoff |
|---|---|---|
| **PID** | simple setpoint control | limited for complex dynamics |
| **Feedforward + PID** | practical tracking | still model-limited |
| **MPC** | constrained optimization and preview | heavier compute |
| **Impedance / admittance** | contact-rich interaction | tuning complexity |
| **Whole-body control** | legged and humanoid systems | system complexity |

In many real robots, the control stack is layered. High-level planners do not run at the same rate as low-level controllers.

---

## Real-Time Thinking

Planning and control are constrained by:

- control loop frequency
- actuator bandwidth
- network delay
- compute jitter
- safety supervisors

An elegant planner that misses deadlines can be worse than a simpler planner that is stable and predictable.

---

## Learned Policies vs Classical Planning

By 2026, many teams combine both:

- classical planners for constraints and safety envelopes
- learned components for perception, grasping, or skill priors
- model predictive or reactive control beneath policy outputs

This hybrid approach is usually stronger than trying to replace the whole stack with one learned policy.

That hybrid idea also shows up in **MoveIt hybrid planning** and in navigation stacks that mix global planners with reactive or model-predictive local control.

---

## What to Learn Deeply

Prioritize:

1. frames and transforms
2. kinematics and Jacobians
3. collision checking and motion planning
4. trajectory generation
5. PID, MPC, impedance ideas
6. how controllers map to actual hardware loops

These are transferable across arms, mobile robots, legged robots, and humanoids.

---

## Interview Q&A

### 1. What is the difference between motion planning and control?

Motion planning decides a feasible path or trajectory. Control makes the real robot follow that trajectory under physical disturbances.

### 2. Why is inverse kinematics not the same as planning?

Inverse kinematics finds joint configurations for a target pose. Planning also needs collision avoidance, continuity, constraints, and time feasibility.

### 3. Why are hybrid stacks common in 2026 robotics?

Because classical planning gives structure and safety, while learned components improve perception and skill generalization.
