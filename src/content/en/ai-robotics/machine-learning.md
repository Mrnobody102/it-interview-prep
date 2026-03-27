# Machine Learning

## Overview

Machine Learning is a subset of AI that enables systems to learn from data rather than being explicitly programmed.

## Types of Machine Learning

| Type | Description | Examples |
|------|-------------|----------|
| **Supervised Learning** | Learning from labeled data | Classification, Regression |
| **Unsupervised Learning** | Learning from unlabeled data | Clustering, Dimensionality Reduction |
| **Reinforcement Learning** | Learning through environment interaction | Game AI, Robotics |
| **Semi-supervised** | Combination of labeled and unlabeled | Self-training |

## Supervised Learning

### Classification

```python
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report

# Prepare data
X_train, X_test, y_train, y_test = train_test_split(
    features, labels, test_size=0.2, random_state=42
)

# Train
clf = RandomForestClassifier(n_estimators=100, max_depth=10)
clf.fit(X_train, y_train)

# Evaluate
y_pred = clf.predict(X_test)
print(accuracy_score(y_test, y_pred))
print(classification_report(y_test, y_pred))
```

### Regression

```python
from sklearn.linear_model import LinearRegression, Ridge
from sklearn.preprocessing import StandardScaler

# Scale data
scaler = StandardScaler()
X_scaled = scaler.fit_transform(features)

# Ridge Regression (regularization)
model = Ridge(alpha=1.0)
model.fit(X_train, y_train)

# Predict
predictions = model.predict(X_test)
```

## Unsupervised Learning

### K-Means Clustering

```python
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler

# Normalize
scaler = StandardScaler()
X_scaled = scaler.fit_transform(data)

# Find optimal k using Elbow method
inertias = [KMeans(n_clusters=k).fit(X_scaled).inertia_
            for k in range(1, 11)]

# Cluster with k=3
kmeans = KMeans(n_clusters=3, random_state=42)
labels = kmeans.fit_predict(X_scaled)
```

### PCA (Dimensionality Reduction)

```python
from sklearn.decomposition import PCA

pca = PCA(n_components=0.95)  # Retain 95% variance
X_reduced = pca.fit_transform(X)
print(f"Number of dimensions: {pca.n_components_}")
```

## Model Evaluation

### Cross-Validation

```python
from sklearn.model_selection import cross_val_score, KFold

kfold = KFold(n_splits=5, shuffle=True, random_state=42)
scores = cross_val_score(clf, X, y, cv=kfold, scoring='f1')
print(f"Mean F1: {scores.mean():.3f} (+/- {scores.std()*2:.3f})")
```

### Metrics

| Metric | Use Case |
|--------|----------|
| **Accuracy** | Balanced classes |
| **Precision** | Minimize false positives |
| **Recall** | Minimize false negatives |
| **F1-Score** | Harmonic mean of precision and recall |
| **AUC-ROC** | Model discrimination |

## Feature Engineering

```python
import pandas as pd
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer

# Handle numeric features
numeric_features = ['age', 'salary', 'experience']
numeric_transformer = StandardScaler()

# Handle categorical features
categorical_features = ['department', 'city']
categorical_transformer = OneHotEncoder(drop='first')

# Combine
preprocessor = ColumnTransformer(
    transformers=[
        ('num', numeric_transformer, numeric_features),
        ('cat', categorical_transformer, categorical_features)
    ])

X_processed = preprocessor.fit_transform(df)
```

## Overfitting vs Underfitting

```python
# Overfitting: model too complex, fits noise
# Solutions: regularization, cross-validation, dropout

# Underfitting: model too simple
# Solutions: increase model complexity, add features

from sklearn.model_selection import validation_curve
import numpy as np

# Example with regularization
alphas = np.logspace(-4, 1, 50)
train_scores, val_scores = validation_curve(
    Ridge(), X, y, param_name='alpha',
    param_range=alphas, cv=5
)
```

## Interview Questions

### 1. What is the difference between Bias and Variance?

**Bias** is error from an overly simple model — underfitting. **Variance** is error from an overly complex model — overfitting. The goal is to find a sweet spot between the two (bias-variance tradeoff).

### 2. When to use Random Forest vs Gradient Boosting?

Random Forest: parallel, less overfitting, less hyperparameter tuning. Gradient Boosting: sequential, higher accuracy, more prone to overfitting, needs careful tuning. Gradient Boosting usually performs better with structured data.

### 3. How does Regularization work?

L1 (Lasso) and L2 (Ridge) add a penalty term to the loss function. L1 encourages sparsity (automatic feature selection). L2 shrinks weights toward 0 but not exactly to 0.

### 4. Why is Cross-validation important?

Random data splitting may not be representative. K-fold CV ensures every sample is validated exactly once, providing a more reliable generalization accuracy estimate.
