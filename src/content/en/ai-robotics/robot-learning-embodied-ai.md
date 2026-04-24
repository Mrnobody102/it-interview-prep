# Robot Learning & Embodied AI

## Overview

Robot learning is broader than reinforcement learning or flashy demo policies.

In practice, the space is easier to understand through four connected layers:

1. robot learning paradigms and policy learning
2. policy representations, skills, and action spaces
3. VLA models, world models, and embodied foundation models
4. data scaling, evaluation, and real-world constraints

That is why this topic is now split into child topics.

---

## Why This Matters

Embodied AI tries to connect:

- perception
- memory
- task understanding
- planning
- action

But the limiting factors are rarely only model size. They are often data quality, evaluation design, and the gap between demos and real deployment.

---

## Map of the Subtopics

### 1. Robot Learning Paradigms & Policy Learning

Focus:

- imitation learning, reinforcement learning, and offline RL
- policy optimization basics
- where each paradigm fits in robotics
- why sample efficiency is such a bottleneck

### 2. Policy Representations, Skills & Action Spaces

Focus:

- low-level vs high-level policies
- action parameterization and skill abstraction
- hierarchical policies and options
- the tradeoff between expressiveness and controllability

### 3. VLA Models, World Models & Embodied FMs

Focus:

- vision-language-action models
- action-token prediction and chunking
- world models and latent planning
- what changed in 2025-2026 for embodied systems

### 4. Data Scaling, Evaluation & Real-World Constraints

Focus:

- demonstration quality and coverage
- recovery data and failure mining
- offline vs online evaluation
- why real robots remain much harder than benchmark videos

---

## Recommended Learning Order

A practical order is:

1. learning paradigms
2. policy representation and skills
3. VLA and world-model families
4. data scaling and evaluation

This order separates the ideas of learning, action structure, foundation-model trends, and deployment reality.

---

## Relationship to Other AI-Robotics Topics

This section overlaps with, but does not replace:

- **Deep Learning** for model-building fundamentals
- **Motion Planning, Manipulation & Control** for classical action generation
- **Simulation, Sim2Real & Synthetic Data** for data generation and safe experimentation
- **Robot Systems, Safety & Deployment** for what happens when learned policies meet hardware

Robot learning is one route to behavior, not the only route.

---

## Interview Q&A

### 1) Why split Robot Learning into smaller subtopics?

Because learning paradigms, policy design, embodied foundation models, and evaluation discipline are separate engineering questions.

### 2) Why is data often a bigger bottleneck than model design?

Because robot learning depends on diverse, synchronized, failure-rich data that is expensive to collect and hard to label well.

### 3) Why do classical robotics methods still matter in embodied AI?

Because learned policies often still need guardrails, controllers, planners, and geometric constraints around them.
