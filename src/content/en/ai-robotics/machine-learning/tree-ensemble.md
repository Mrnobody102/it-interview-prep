# Trees, Ensembles & Tabular ML

## Overview

Tree-based methods remain some of the strongest tools for structured and tabular data.

They are popular because they:

- capture non-linear relationships
- handle mixed feature types well
- require less feature scaling discipline
- often outperform deep models on medium-sized tabular datasets

---

## Decision Trees

A decision tree recursively splits the feature space to reduce impurity or error.

Why people like them:

- easy to explain
- can model interactions naturally
- support both classification and regression

Why people fear them:

- they overfit easily
- they are unstable under small data changes
- deep trees memorize noise

Important controls:

- max depth
- minimum samples per split
- minimum samples per leaf
- pruning or regularization choices

---

## Random Forest

Random Forest improves single trees by using:

- bootstrap sampling
- random feature subsets
- aggregation across many trees

This reduces variance and usually improves generalization.

It is a strong default when:

- the dataset is structured
- interpretability can be approximate rather than exact
- you want a strong out-of-the-box model with modest tuning

---

## Gradient Boosting

Boosting trains learners sequentially, where each new learner tries to fix previous residual errors.

Common families:

- XGBoost
- LightGBM
- CatBoost

Why boosting works well:

- it captures hard decision boundaries
- it handles heterogeneous tabular patterns well
- it usually gives excellent performance with careful tuning

But it also brings risks:

- overfitting noisy features
- leakage amplified by strong function approximation
- heavy sensitivity to validation quality

---

## Tabular ML Best Practices

Important habits for tabular work:

- build leak-free preprocessing
- encode categorical variables thoughtfully
- watch class imbalance
- evaluate on time-aware or group-aware splits when needed
- interpret feature importance carefully

Feature importance itself is tricky:

- impurity importance can be biased
- permutation importance is often more reliable
- SHAP can help, but should not replace domain reasoning

The model may rank a feature highly because the data pipeline itself is encoding shortcuts.

---

## Interview Q&A

### 1) Why do tree ensembles often beat deep learning on tabular data?

Because they handle heterogeneous, non-linear, medium-sized structured data extremely well without needing large-scale representation learning.

### 2) What is the difference between bagging and boosting?

Bagging reduces variance by training models in parallel on resampled data, while boosting reduces error sequentially by focusing on previous mistakes.

### 3) Why can feature importance be misleading?

Because importance scores can reflect data leakage, correlated features, or the scoring method itself rather than true causal relevance.

### 4) When would you choose Random Forest over XGBoost?

When you want a strong, stable baseline with less tuning sensitivity and are willing to trade some peak accuracy for simplicity.
