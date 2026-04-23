# TF2, URDF, Frames & Calibration

## Overview

A robot can only act well if it has a coherent spatial model of itself and the world.

This requires three things to work together:

- robot description
- frame transforms
- calibration

If any of those are wrong, higher-level intelligence becomes misleading.

---

## URDF and Xacro

URDF describes:

- links
- joints
- inertial properties
- visual and collision geometry
- sensor mounting structure

Xacro is often used to keep robot descriptions modular and parameterized.

Good robot descriptions matter because they feed:

- simulation
- visualization
- kinematics libraries
- planning scenes

---

## TF2 and Frame Trees

TF2 represents the transform graph between coordinate frames.

Typical frames include:

- `base_link`
- `odom`
- `map`
- camera frames
- end-effector frames

Important properties:

- the tree should be logically consistent
- timestamps must make sense
- frame naming should be disciplined

Many perception bugs are actually TF bugs wearing a different label.

---

## Calibration

Calibration includes:

- camera intrinsics
- camera extrinsics
- hand-eye calibration
- LiDAR-camera alignment
- IMU alignment and biases

Calibration drift matters because:

- localization degrades
- object pose estimates become unreliable
- planning can target the wrong spatial point

Calibration is not a one-time ceremony. It is part of long-term system health.

---

## Debugging Spatial Problems

Useful debugging habits:

- inspect the frame tree visually
- replay logs and verify timestamps
- compare predicted object position against physical measurements
- isolate whether the error comes from detection, TF, or calibration

Spatial debugging often requires narrowing the problem one transform boundary at a time.

---

## Interview Q&A

### 1) Why is TF2 so important in robotics?

Because it defines the spatial relationships that perception, localization, planning, and control all rely on.

### 2) What is the difference between intrinsics and extrinsics?

Intrinsics describe a sensor's internal projection model, while extrinsics describe its position and orientation relative to other frames.

### 3) Why can calibration errors look like model errors?

Because the model output may be semantically correct but mapped to the wrong physical location.

### 4) Why should calibration be monitored over time?

Because mounts shift, hardware ages, and environmental stress can gradually invalidate previously good spatial parameters.
