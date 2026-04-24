# Robot Learning Paradigms & Policy Learning

## Overview

Robot learning includes several different paradigms, each with its own data assumptions and operational cost.

Important families:

- imitation learning
- reinforcement learning
- offline RL
- hybrid learning from demos plus interaction

---

## Imitation vs Reinforcement

Imitation learning is attractive when:

- expert demonstrations exist
- exploration on hardware is risky
- the task is well represented by observed behavior

Reinforcement learning is useful when:

- reward shaping is possible
- exploration is feasible in simulation or safe settings
- the task requires discovering behavior beyond demonstrations

---

## Offline RL and Dataset Reuse

Offline RL tries to learn policies from logged data without large online exploration.

This is appealing in robotics because:

- hardware time is expensive
- unsafe exploration is unacceptable
- logged operational data may already exist

But it is brittle when the data coverage is weak.

---

## Policy Learning Concerns

Important concerns:

- reward design
- distribution shift
- exploration safety
- sample efficiency

These issues are why many real robot systems still use learning selectively rather than everywhere.

---

## Interview Q&A

### 1) Why is imitation learning attractive in robotics?

Because it can learn from demonstrations without requiring unsafe exploration directly on hardware.

### 2) What is the challenge of reinforcement learning in robotics?

Sample efficiency and safe exploration are major bottlenecks, especially on real robots.

### 3) Why can offline RL fail?

Because the policy may need to act outside the support of the logged dataset, where learned value estimates become unreliable.
