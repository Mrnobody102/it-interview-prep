# Robot Perception, Localization & SLAM

## Overview

Robotics perception is not just computer vision on a robot. It is the full problem of turning noisy, delayed sensor streams into a stable estimate of:

- where the robot is
- what the environment looks like
- what objects and obstacles exist
- what can be acted on safely

This topic sits between raw sensing and planning.

---

## Sensor Modalities

Common sensors in modern systems:

| Sensor | Strengths | Weaknesses |
|---|---|---|
| **RGB camera** | semantics, cheap, rich texture | lighting sensitivity, no direct depth |
| **Stereo / RGB-D** | geometry + semantics | limited range, reflective surfaces |
| **LiDAR** | accurate distance, robust geometry | lower semantics, cost |
| **IMU** | fast motion estimate | drift over time |
| **Wheel odometry** | cheap local motion signal | slip and cumulative drift |
| **Force/torque** | contact understanding | local and task-specific |

Good robot perception is usually multimodal, not single-sensor.

---

## Sensor Fusion

Fusion matters because no sensor is enough on its own.

Common combinations:

- camera + IMU for visual-inertial odometry
- LiDAR + IMU for robust localization
- wheel odometry + IMU + map matching for mobile robots
- camera + depth + force sensing for manipulation

Core concerns:

- calibration
- timestamp alignment
- frame consistency
- latency compensation
- outlier handling

Many robotics bugs that look like "bad AI" are really fusion or calibration bugs.

---

## Localization vs Mapping vs SLAM

These terms are related but different:

| Problem | Meaning |
|---|---|
| **Localization** | estimate robot pose in a known map |
| **Mapping** | build a map of the environment |
| **SLAM** | localize while building the map at the same time |

In practice:

- AMCL-style localization is common for known indoor maps
- visual SLAM and LiDAR SLAM are common when the map is unknown or evolving
- factor-graph methods dominate many higher-accuracy pipelines

---

## State Estimation

State estimation sits underneath localization and control.

Important concepts:

- Extended Kalman Filter (EKF)
- Unscented Kalman Filter (UKF)
- particle filters
- factor graphs
- smoothing vs filtering

The right choice depends on:

- system nonlinearity
- sensor quality
- compute budget
- real-time constraints

---

## Maps and Scene Representations

Robots can reason over different world models:

- occupancy grids
- costmaps
- point clouds
- voxel maps
- TSDF / ESDF
- semantic maps
- object-centric scene graphs

In 2026, richer 3D scene representations are more common, but simpler maps still dominate reliable deployed navigation because they are easier to debug and maintain.

---

## Navigation Perception

For mobile robots, perception must feed navigation cleanly:

- detect static obstacles
- identify dynamic obstacles
- maintain local and global costmaps
- distinguish traversable from non-traversable space
- update the map without destabilizing the planner

This is why perception and navigation should be designed together, not as isolated modules.

---

## Manipulation Perception

Manipulation requires a different emphasis:

- hand-eye calibration
- object detection and tracking
- pose estimation
- grasp affordance estimation
- contact and force feedback

A mobile robot can often tolerate a small localization error. A manipulator trying to insert, grasp, or align parts often cannot.

---

## Where Foundation Models Help

Modern perception stacks increasingly use:

- vision-language models for scene understanding
- foundation models for segmentation and grounding
- learned 3D representations for pose or affordance prediction

But the deployment question is still practical:

- latency
- robustness to lighting and clutter
- calibration drift
- fallback behavior

Learned perception adds power, but deployed robots still need deterministic scaffolding around it.

---

## Interview Q&A

### 1. What is the difference between odometry and localization?

Odometry estimates motion incrementally and accumulates drift. Localization estimates pose relative to a known world or map.

### 2. Why is calibration so important in robotics perception?

Because the robot acts in physical space. Even a strong detector is not useful if its outputs are misaligned with the robot's real frames.

### 3. Why do many production robots still use simple maps?

Because simpler representations are easier to debug, cheaper to maintain, and often sufficient for reliable operation.
