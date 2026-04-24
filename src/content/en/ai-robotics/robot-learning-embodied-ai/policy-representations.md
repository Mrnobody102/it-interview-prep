# Policy Representations, Skills & Action Spaces

## Overview

How a policy represents action strongly affects what it can learn and how safely it can be used.

This topic focuses on:

- action parameterization
- skill abstractions
- hierarchical policies
- controllability tradeoffs

---

## Low-Level vs High-Level Policies

Low-level policies output:

- torques
- velocities
- joint commands

High-level policies output:

- waypoints
- subgoals
- skills
- action chunks

Higher abstraction can improve stability, but may reduce responsiveness or expressiveness.

---

## Skills and Hierarchy

Many robot-learning systems benefit from:

- reusable skills
- options or macro-actions
- hierarchical decomposition
- planner-policy hybrids

This reduces horizon complexity and can improve data efficiency.

---

## Action Space Design

Important tradeoffs:

- continuous vs discrete action spaces
- one-step actions vs action chunks
- delta commands vs absolute targets
- open-loop vs feedback-aware outputs

Action design is not just an implementation detail. It changes the whole learning problem.

---

## Interview Q&A

### 1) Why does action representation matter so much?

Because it determines what the policy must predict, how errors accumulate, and how well execution can be constrained.

### 2) Why are skills useful?

Because they compress longer behaviors into reusable units, reducing planning horizon and improving structure in the policy space.

### 3) What is a common tradeoff in high-level policies?

They are often easier to stabilize and supervise, but may lose fine-grained control authority.
