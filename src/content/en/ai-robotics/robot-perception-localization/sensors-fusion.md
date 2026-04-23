# Sensors, Calibration & Sensor Fusion

## Overview

Robot perception begins with sensor trustworthiness.

A strong system must understand:

- what each sensor is good at
- where each sensor fails
- how time and frame alignment affect data
- how to fuse complementary signals

---

## Common Sensor Modalities

| Sensor | Strengths | Weaknesses |
|---|---|---|
| **RGB camera** | semantics, low cost, rich texture | poor direct depth, lighting sensitivity |
| **RGB-D / stereo** | geometry plus semantics | reflective surfaces, range limits |
| **LiDAR** | accurate geometry, robust ranging | lower semantics, cost, sparsity tradeoffs |
| **IMU** | fast motion signal | bias and drift |
| **Wheel odometry** | cheap local motion estimate | slip and cumulative error |
| **Force / tactile** | contact awareness | local and task-specific |

No single modality is enough for most serious robot systems.

---

## Time Alignment and Calibration

Two failure sources appear constantly:

- bad extrinsic calibration
- bad timestamp discipline

If sensors are individually good but misaligned in space or time, fusion degrades quickly.

Critical concerns:

- synchronized clocks
- rolling-shutter effects
- sensor latency
- frame naming and ownership
- recalibration after hardware changes

---

## Sensor Fusion Strategies

Common combinations:

- camera + IMU for visual-inertial odometry
- LiDAR + IMU for robust localization
- wheel odometry + IMU + map matching for mobile robots
- vision + depth + force for manipulation

Fusion is useful because one sensor can stabilize another:

- IMU helps fast motion
- LiDAR helps geometry in weak texture
- vision helps semantics
- force helps contact interpretation

---

## Failure Modes

Sensor fusion can still fail because of:

- wrong noise assumptions
- unmodeled latency
- drift in extrinsics
- dropped messages
- inconsistent frame trees

A fusion stack should be observable enough that engineers can tell whether the problem is the sensor, the timing, or the estimator.

---

## Interview Q&A

### 1) Why is multimodal fusion so common in robotics?

Because different sensors complement each other, and no single modality is robust across all environments and failure conditions.

### 2) Why are timestamps so important?

Because robot estimation depends on ordering and alignment in time, and even small timing errors can create major spatial inconsistency.

### 3) What is an extrinsic calibration?

It specifies the relative pose between sensors or between a sensor and the robot frame.

### 4) Why do fusion bugs often get mistaken for AI bugs?

Because the downstream model or planner only sees inconsistent inputs, so the system failure appears higher up than its real cause.
