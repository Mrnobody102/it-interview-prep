# Data Quality, Versioning & Experimentation

## Overview

Most ML failures begin upstream of the model.

If your data contracts are unstable, your labels are noisy, or your experiments are not reproducible, better architectures will not fix the system.

This topic covers the operational discipline required before deployment even starts.

---

## Data Versioning and Lineage

You need to know exactly:

- which raw data source was used
- which preprocessing code generated the training set
- which labels or human annotations were included
- which model was trained from that dataset version

Useful tooling patterns:

- DVC or lake-based versioning
- partitioned immutable datasets
- metadata tables for data provenance
- run IDs linking dataset, code, config, and model artifacts

Without lineage, rollback and reproducibility become guesswork.

---

## Data Validation and Contracts

Important checks:

- schema validation
- null / range / cardinality constraints
- join-quality checks
- label-distribution monitoring
- freshness checks for time-sensitive pipelines

In mature ML systems, validation is not optional. A pipeline should fail early rather than silently train on broken inputs.

---

## Experiment Tracking

Good experiment tracking records:

- code version
- parameters and hyperparameters
- dataset version
- metrics
- artifacts such as plots, checkpoints, and confusion matrices

Common tools:

- MLflow
- Weights & Biases
- TensorBoard

What matters is not the brand of tool. What matters is being able to reproduce why a result was accepted.

---

## Embodied AI Logging

For robotics and physical AI, experimentation requires more than tabular logs.

You often need:

- synchronized camera, depth, IMU, and proprioception streams
- action logs and controller state
- timestamps with reliable clock discipline
- event markers for interventions, failure, and recovery

Time alignment quality can matter more than model complexity when debugging robot behavior.

---

## Interview Q&A

### 1) Why is data versioning important in ML?

Because model behavior depends on data as much as code. Without data versioning, you cannot reproduce or explain results reliably.

### 2) What is the purpose of data validation?

It catches broken inputs before they poison training or inference, reducing silent failures and bad downstream decisions.

### 3) Why is experiment tracking essential?

Because teams need a reliable record of what was tried, what worked, and which exact configuration produced a promoted model.

### 4) Why is logging harder in robotics?

Because multiple sensors and action streams must be synchronized precisely, and many bugs only appear when timing relationships are reconstructed correctly.
