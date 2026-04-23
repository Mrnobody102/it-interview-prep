# Unsupervised Learning, Metrics & Validation

## Overview

Good ML engineering depends as much on validation discipline as on model choice.

This topic combines:

- unsupervised learning for structure discovery
- feature engineering and preprocessing
- evaluation metrics
- model selection and bias-variance reasoning

---

## Unsupervised Learning

### Clustering

Common clustering methods:

- **K-Means** for roughly spherical clusters
- **DBSCAN** for density-based grouping and noise handling
- **Gaussian Mixture Models** for soft clustering

You should choose clustering methods based on geometry assumptions, not only convenience.

### Dimensionality Reduction

Useful methods:

- **PCA** for linear compression and variance explanation
- **t-SNE** for local-neighborhood visualization
- **UMAP** for manifold-style low-dimensional views

These tools help exploration, but visualization quality should not be mistaken for downstream predictive utility.

---

## Feature Engineering and Preprocessing

Important preprocessing choices include:

- missing-value handling
- scaling and normalization
- categorical encoding
- interaction features
- time-window aggregation for sequential signals

Many ML systems win not because of a fancy model, but because the features and splits match the real task.

---

## Metrics and Validation

### Classification Metrics

You should know when to use:

- accuracy
- precision
- recall
- F1
- ROC-AUC
- PR-AUC

For imbalanced problems, accuracy is often the wrong main metric.

### Regression Metrics

Important options:

- MAE
- MSE / RMSE
- R-squared
- quantile loss for asymmetric risk

Pick the metric that reflects actual business or control cost, not just mathematical convenience.

---

## Cross-Validation and Bias-Variance

Cross-validation helps estimate generalization, but only if the split reflects reality.

Important split styles:

- random stratified split
- group split
- time-series split
- leave-one-entity-out for hardware or user generalization

Bias-variance tradeoff matters because:

- underfit models miss useful structure
- overfit models memorize noise
- the right capacity depends on data scale, noise, and deployment setting

---

## Interview Q&A

### 1) Why can K-Means fail badly?

Because it assumes cluster geometry that may not fit the data, is sensitive to initialization, and handles non-convex clusters poorly.

### 2) Why is accuracy a bad metric for imbalanced classification?

Because a model can predict the majority class most of the time and still look accurate while being useless on the rare class you actually care about.

### 3) Why does cross-validation need to match deployment reality?

Because a random split can hide leakage or correlation patterns that will not exist in production.

### 4) What is the bias-variance tradeoff?

It is the balance between models that are too simple to capture signal and models that are so flexible they fit noise instead of general patterns.
