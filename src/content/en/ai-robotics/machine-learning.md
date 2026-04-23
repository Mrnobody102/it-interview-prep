# Machine Learning

## Overview

Machine Learning is too broad to keep as one undifferentiated page.

In practice, strong ML understanding usually grows across four layers:

1. supervised learning and baseline models
2. tree ensembles and tabular-data strategy
3. unsupervised learning, metrics, and validation
4. uncertainty, sequential signals, and robotics-facing ML

That is why this topic is now split into focused child topics.

---

## Why This Matters for AI-Robotics

Even in a deep-learning-heavy world, classical ML still matters for:

- tabular prediction and risk scoring
- anomaly detection and weak supervision
- fast interpretable baselines
- decision support around robot telemetry and fleet operations
- uncertainty-aware reasoning before expensive end-to-end learning

Many practical systems become stronger when classical ML and deep models are used together instead of treating them as competing camps.

---

## Map of the Subtopics

### 1. Supervised Learning & Core Baselines

Focus:

- supervised vs unsupervised vs reinforcement framing
- linear and logistic regression
- SVM, KNN, and baseline selection
- when simple models are the right first move

Use this when you want the core language of ML interviews and early project baselines.

### 2. Trees, Ensembles & Tabular ML

Focus:

- decision trees and overfitting behavior
- random forest, XGBoost, and LightGBM
- feature importance and tabular-data workflows
- why tree ensembles remain strong in many production settings

Use this when the dataset is structured, heterogeneous, and not obviously suited to deep learning.

### 3. Unsupervised Learning, Metrics & Validation

Focus:

- clustering and dimensionality reduction
- feature engineering and preprocessing
- evaluation metrics for classification and regression
- cross-validation, bias-variance, and model selection

Use this when the challenge is understanding data and validating models correctly.

### 4. Uncertainty, Time-Series & ML for Robotics

Focus:

- probabilistic modeling and confidence estimation
- sequential signals and time-series forecasting
- anomaly detection on sensor and system logs
- ML workflows for physical AI and robotics telemetry

Use this when you need ML that helps real systems make safer decisions under uncertainty.

---

## Recommended Learning Order

For most engineers, the practical order is:

1. supervised basics
2. trees and ensembles
3. evaluation and unsupervised methods
4. uncertainty and robotics-facing applications

This order gives both interview readiness and a sensible path into production problem solving.

---

## Relationship to Other AI-Robotics Topics

This Machine Learning section overlaps with, but does not replace:

- **Deep Learning** for neural architectures and large-scale representation learning
- **MLOps & AI Production** for experiment tracking, deployment, and monitoring
- **Robot Perception** for sensor-specific state estimation pipelines
- **Robot Learning & Embodied AI** for policy learning and action generation

Machine learning is the decision and inference toolbox around the broader AI stack.

---

## Interview Q&A

### 1) Why split Machine Learning into smaller subtopics?

Because baseline supervised models, tabular ensembles, evaluation discipline, and uncertainty-aware robotics use cases are different skill clusters that deserve separate treatment.

### 2) Why are classical ML methods still relevant in 2026?

Because many production problems remain tabular, data-limited, or interpretation-sensitive, where simpler methods are cheaper and often stronger than deep models.

### 3) Why does uncertainty matter in robotics-related ML?

Because robot and fleet decisions often depend not only on a prediction, but also on how confident the system should be before acting.
