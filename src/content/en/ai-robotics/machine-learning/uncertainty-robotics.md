# Uncertainty, Time-Series & ML for Robotics

## Overview

Once ML affects operational decisions, uncertainty becomes first-class.

This is especially true in robotics, fleet operations, and physical AI, where the system often needs to decide:

- whether a prediction is trustworthy
- whether more sensing is needed
- whether to fall back to a safer mode

---

## Probabilistic Thinking

Important ideas:

- calibrated probabilities
- predictive uncertainty
- aleatoric vs epistemic uncertainty
- confidence thresholds for action gating

A model can be accurate on average but dangerous if it is overconfident on rare failures.

Useful tools:

- temperature scaling
- conformal prediction
- Bayesian approximations
- ensemble disagreement

---

## Time-Series and Sequential Signals

Many production signals are sequential:

- robot telemetry
- sensor health trends
- battery and actuator behavior
- user or environment event streams

Common tasks:

- forecasting
- anomaly detection
- changepoint detection
- sequence classification

Important issues:

- time-aware splits
- concept drift
- delayed labels
- causality vs leakage in aggregated features

---

## Anomaly Detection for Physical Systems

Anomaly detection is often more realistic than full supervision in physical systems because labeled failures are scarce.

Useful patterns:

- reconstruction error from autoencoders
- isolation forest
- one-class SVM
- rules plus model-score hybrid alerts

But anomaly systems fail when:

- normal behavior itself is too diverse
- sensors drift
- thresholds are not adapted by operating regime

---

## ML for Robotics and Physical AI

Classical ML can support robotics in many places:

- failure prediction from logs
- maintenance forecasting
- task success prediction
- calibration health monitoring
- environment or terrain classification

These models often live beside larger perception or policy stacks and provide decision support, ranking, or safety gating.

---

## Interview Q&A

### 1) Why is uncertainty estimation important?

Because real systems need to know when a prediction should be trusted, reviewed, or rejected rather than acting on every score equally.

### 2) What is the difference between aleatoric and epistemic uncertainty?

Aleatoric uncertainty comes from inherent noise in observations, while epistemic uncertainty comes from limited knowledge or insufficient coverage in the model.

### 3) Why are random train/test splits dangerous for time-series?

Because they can leak future information into training and make the model look much better than it will perform on real future data.

### 4) How can classical ML help robotics even without end-to-end control?

It can predict failures, detect anomalies, rank risks, and support safer orchestration around perception and control systems.
