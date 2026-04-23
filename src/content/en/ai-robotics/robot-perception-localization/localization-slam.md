# Localization, State Estimation & SLAM

## Overview

A robot needs a stable estimate of where it is and how that estimate should evolve over time.

This topic covers the core estimation layer behind:

- odometry
- localization
- mapping
- SLAM

---

## Localization vs Mapping vs SLAM

Important distinctions:

- **odometry** estimates incremental motion and accumulates drift
- **localization** estimates pose in a known map
- **mapping** builds a world representation
- **SLAM** solves localization and mapping jointly

These terms are often mixed casually, but they imply different system assumptions.

---

## Estimation Methods

Common approaches:

- Extended Kalman Filter
- Unscented Kalman Filter
- particle filters
- factor graphs
- smoothing-based optimization

The right choice depends on:

- nonlinearity
- sensor modality
- compute budget
- real-time constraints
- tolerance for delayed optimization

---

## Practical SLAM Families

Typical families include:

- visual SLAM
- LiDAR SLAM
- visual-inertial odometry
- LiDAR-inertial odometry

Key ideas:

- loop closure reduces long-term drift
- pose graph optimization improves global consistency
- front-end robustness matters as much as back-end optimization

---

## Deployment Concerns

Real localization stacks fail when:

- lighting changes break features
- geometry is repetitive
- dynamic objects dominate the scene
- the map is stale
- calibration or timing degrades

That is why localization systems need:

- confidence measures
- relocalization behavior
- map update strategy
- fallback modes when pose certainty drops

---

## Interview Q&A

### 1) What is the difference between odometry and localization?

Odometry tracks relative motion and drifts over time, while localization estimates pose relative to a map or known world frame.

### 2) Why are factor graphs popular in SLAM?

Because they model constraints cleanly across many poses and measurements, enabling flexible optimization over a full trajectory or map.

### 3) Why is loop closure important?

Because it lets the system recognize previously seen places and correct accumulated drift.

### 4) Why can a strong SLAM algorithm still fail in production?

Because real deployment depends on sensing conditions, calibration, map quality, and runtime robustness, not only algorithmic elegance.
