# Feature Stores, Registry & Governance

## Overview

Production ML needs a control plane for features, models, artifacts, and approvals.

Without that control plane, teams usually end up with:

- training-serving skew
- unclear ownership
- accidental model promotion
- weak auditability

This topic focuses on the operational metadata layer around ML systems.

---

## Feature Store Concepts

A feature store helps standardize feature definitions across:

- offline training
- batch inference
- online serving

Key goals:

- avoid duplicated feature logic
- improve consistency across environments
- support point-in-time correct retrieval

The most important principle is not the tool name. It is preventing mismatch between what was trained and what is served.

---

## Model Registry

A registry tracks:

- model versions
- stage transitions such as staging and production
- evaluation results
- owner, lineage, and deployment status

This supports safe promotion, rollback, and review.

For serious systems, a registry should link to:

- dataset version
- training code version
- evaluation suite
- serving image or deployment package

---

## Governance and Approval Flow

Governance matters most when model errors are expensive.

Important controls include:

- required evaluation thresholds
- human approval before promotion
- audit logs for who changed what
- policy constraints for sensitive domains
- documentation of known failure modes

For LLM-based systems, governance may also include prompt versioning, tool permissions, and approved retrieval corpora.

---

## Why This Matters in AI-Robotics

In robotics, the cost of weak governance is high because:

- hardware variants may behave differently
- calibration dependencies may change model performance
- deployment packages may include both models and control parameters
- rollback needs to be fast and trustworthy

A robot fleet should not rely on tribal knowledge to know which model is safe to deploy.

---

## Interview Q&A

### 1) What problem does a feature store solve?

It helps maintain consistent feature definitions across training and serving, reducing training-serving skew and duplicated logic.

### 2) Why is a model registry useful?

It provides a controlled lifecycle for model versions, including promotion, rollback, metadata, and auditability.

### 3) What is training-serving skew?

It is the mismatch between the features or preprocessing used during training and the ones used during inference.

### 4) Why is governance not just bureaucracy?

Because in real systems it prevents unsafe deployment, undocumented changes, and models being promoted without sufficient evidence.
