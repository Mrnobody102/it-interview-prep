# Supervised Learning & Core Baselines

## Overview

Most ML projects should start with the simplest model family that can answer the problem well enough.

This topic covers the core supervised toolkit that appears constantly in interviews and real projects:

- supervised vs unsupervised vs reinforcement framing
- linear and logistic baselines
- margin and distance methods
- disciplined baseline-building workflow

---

## Choosing the Learning Paradigm

You should first classify the problem correctly:

| Paradigm | Input | Output goal | Typical use |
|---|---|---|---|
| **Supervised** | labeled examples | predict known target | churn, fraud, quality scoring |
| **Unsupervised** | unlabeled data | discover structure | clustering, anomaly exploration |
| **Reinforcement** | agent-environment feedback | maximize reward over time | robotics control, online decision making |

Many teams overcomplicate early modeling by jumping toward RL or deep learning when a supervised baseline is enough.

---

## Linear and Logistic Regression

### Linear Regression

Linear regression is still useful when:

- the target is continuous
- interpretability matters
- the relationship is roughly linear after feature transformation

Important interview ideas:

- residual analysis
- multicollinearity
- homoscedasticity
- regularization with Ridge or Lasso

### Logistic Regression

Logistic regression remains one of the strongest first baselines for classification because it is:

- simple
- interpretable
- easy to calibrate
- fast to train and deploy

It often wins when the feature space is engineered well and the decision boundary is not too complex.

---

## SVM and KNN

### SVM

Support Vector Machines are useful when:

- data size is moderate
- margin quality matters
- feature dimension is relatively high

Key levers:

- `C` controls regularization
- kernel choice controls boundary flexibility
- `gamma` matters strongly for RBF kernels

### KNN

KNN is simple but teaches important lessons:

- distance metrics matter
- scaling matters
- irrelevant features hurt badly
- lazy learners can be expensive at inference time

It is rarely the final production model at scale, but it is a useful conceptual baseline.

---

## Baseline Workflow in Practice

A strong supervised-learning workflow usually looks like this:

1. define target and leakage boundaries clearly
2. build a preprocessing pipeline
3. train a simple baseline first
4. inspect confusion matrix or regression residuals
5. compare against more complex models only after the baseline is trustworthy

Common mistakes:

- target leakage through future features
- bad train/validation split design
- optimizing only one metric without cost context
- skipping probability calibration for decision-making systems

---

## Interview Q&A

### 1) Why is logistic regression still a strong baseline?

Because it trains quickly, is interpretable, often performs surprisingly well, and gives a clean reference point before trying more complex models.

### 2) When is SVM a reasonable choice?

When the dataset is not huge, feature dimension is meaningful, and you want a strong margin-based classifier with controllable complexity.

### 3) Why can KNN perform badly on real datasets?

Because it is sensitive to feature scaling, noisy dimensions, irrelevant variables, and expensive distance computation at inference time.

### 4) What is target leakage?

It is the accidental use of information during training that would not truly be available at prediction time, causing misleadingly high validation performance.
