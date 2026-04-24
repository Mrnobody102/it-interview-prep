# Kinematics, Feasibility & Planning Layers

## Overview

Motion planning starts before optimization. It starts with asking whether the motion is even feasible.

This topic focuses on:

- reachability
- kinematic constraints
- planning hierarchy
- search space definition

---

## Planning Hierarchy

A practical hierarchy often looks like:

1. task planning
2. motion planning
3. trajectory generation
4. control execution

Blurring these layers makes debugging much harder.

---

## Feasibility Before Optimality

Important feasibility checks include:

- joint and workspace limits
- collision constraints
- dynamic feasibility
- contact or support constraints

An elegant optimizer is useless if the problem formulation itself is infeasible.

---

## Kinematic Reasoning

Key ideas:

- inverse kinematics may have many solutions or none
- singularities create unstable local behavior
- redundancy can help avoid obstacles or improve posture

Planning quality depends on understanding these structural properties.

---

## Interview Q&A

### 1) Why is feasibility more important than optimality at first?

Because a solution that looks mathematically optimal but cannot actually be executed is worthless.

### 2) Why do planners need a hierarchy?

Because task choice, geometric feasibility, trajectory timing, and control execution are different problems with different assumptions.

### 3) Why do singularities matter to planning?

Because they can make nearby motions unstable, numerically sensitive, or physically difficult to execute.
