# Maps, Scene Representation & Navigation Perception

## Overview

Navigation depends on a usable world representation, not on raw sensor output alone.

This topic focuses on how perception is converted into representations that planners can consume safely and efficiently.

---

## Common Map Types

Important representations include:

- occupancy grids
- costmaps
- voxel maps
- point-cloud maps
- TSDF / ESDF
- semantic maps

Each representation trades off:

- geometric fidelity
- memory
- update speed
- planner compatibility
- debugging complexity

---

## Why Simpler Maps Persist

Production robots often keep simpler map representations because they are:

- easier to inspect
- easier to maintain
- easier to connect to planning logic
- more predictable under failure

Richer 3D maps are powerful, but system reliability can drop if the representation is too hard to keep consistent.

---

## Navigation Perception Pipeline

Navigation-facing perception often needs to:

- identify free space
- detect static and dynamic obstacles
- update local and global costmaps
- track traversability
- handle map freshness and dynamic scenes

The planner only behaves well if these perception outputs are stable enough to avoid oscillation and false obstacles.

---

## Dynamic Environments

Robots in real spaces must reason about:

- moving people
- temporary obstacles
- partial occlusion
- stale map regions

This is why map maintenance matters as much as initial map construction.

Navigation perception should support:

- local reactivity
- global consistency
- uncertainty-aware obstacle handling

---

## Interview Q&A

### 1) Why are costmaps useful?

Because they convert perception into planner-friendly spatial cost information rather than raw geometry alone.

### 2) Why do simple occupancy grids remain common?

Because they are interpretable, lightweight, and often sufficient for reliable navigation systems.

### 3) What is traversability estimation?

It is the process of estimating whether terrain or space can be safely crossed by the robot, not just whether something is visually present.

### 4) Why can a better map still hurt the system?

Because richer maps increase complexity, update cost, and debugging difficulty if the rest of the stack is not designed to use them well.
