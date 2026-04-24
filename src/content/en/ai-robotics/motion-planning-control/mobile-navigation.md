# Mobile Navigation & Trajectory Planning

## Overview

Navigation planning asks how a robot should move through space while respecting geometry, dynamics, and uncertainty.

This usually involves both:

- global planning over a map
- local planning under changing conditions

---

## Global vs Local Planning

Global planners:

- reason over the broader map
- produce route-level structure
- often use graph search such as A* or related methods

Local planners:

- react to nearby obstacles
- smooth or adjust trajectories
- manage dynamic situations

Strong navigation stacks combine both rather than choosing one.

---

## Dynamic Obstacles and Replanning

Real navigation must handle:

- moving people
- occlusion
- stale map assumptions
- narrow spaces and deadlock

This is why replanning and local robustness matter more than static shortest-path logic alone.

---

## Trajectory Quality

A usable trajectory should be:

- collision free
- smooth enough to track
- dynamically reasonable
- stable under perception noise

Too much planner jitter can create oscillation and unsafe behavior even when each step is technically valid.

---

## Interview Q&A

### 1) Why are global and local planners both needed?

Because global planning gives route structure while local planning reacts to immediate obstacles and runtime changes.

### 2) Why is shortest path not always the best path?

Because it may ignore smoothness, dynamics, safety margins, and uncertainty in execution.

### 3) Why is replanning important?

Because real environments change, and a path that was valid a moment ago may no longer be safe.
