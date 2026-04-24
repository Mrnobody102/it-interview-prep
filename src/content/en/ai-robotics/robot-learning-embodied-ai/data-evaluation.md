# Data Scaling, Evaluation & Real-World Constraints

## Overview

Embodied AI progress depends heavily on data and evaluation discipline.

This topic focuses on:

- dataset quality
- failure coverage
- evaluation realism
- deployment constraints

---

## Data Is the Bottleneck

Robotics data is hard because it must often be:

- synchronized across sensors
- labeled with task outcome or failure context
- diverse across environments
- rich in recovery behavior

A large model cannot recover information the dataset never captured well.

---

## Evaluation Beyond Demos

Useful evaluation should include:

- task success rate
- recovery behavior
- robustness to perturbation
- latency and throughput
- safety-relevant failure analysis

Short demo clips are not enough evidence for deployment readiness.

---

## Real-World Constraints

Embodied models must respect:

- limited onboard compute
- imperfect sensing
- changing environments
- maintenance and recalibration needs

These constraints often dominate architectural choices.

---

## Interview Q&A

### 1) Why is dataset quality more important than model size in many robot-learning setups?

Because missing failure cases, weak synchronization, and poor coverage limit what the model can learn no matter how large it is.

### 2) Why are demos weak evidence?

Because they often show best-case behavior and hide failure frequency, recovery quality, and operating constraints.

### 3) Why is evaluation harder in robotics than in pure software?

Because performance depends on physical execution, environment variability, and safety, not just on output quality in isolation.
