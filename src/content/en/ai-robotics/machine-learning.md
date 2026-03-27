# Machine Learning

## Overview

Machine Learning (ML) is the field of building algorithms that learn patterns from data and make predictions or decisions without explicit rule-based programming. In interview settings, you are typically expected to understand both **theory** (why a model works) and **practice** (how to train, validate, and deploy reliably).

A production-grade ML workflow usually follows:

1. Problem framing and target definition
2. Data collection and quality checks
3. Feature engineering and preprocessing
4. Model training and validation
5. Hyperparameter tuning and model selection
6. Error analysis and robustness checks
7. Deployment and continuous monitoring

---

## Learning Paradigms: Supervised vs Unsupervised vs Reinforcement

| Paradigm | Data | Goal | Typical Algorithms | Real Examples |
|---|---|---|---|---|
| **Supervised Learning** | Labeled `(X, y)` | Predict known target | Linear/Logistic Regression, Trees, SVM | Churn prediction, fraud detection |
| **Unsupervised Learning** | Unlabeled `X` | Discover hidden structure | K-Means, DBSCAN, PCA | Customer segmentation, anomaly exploration |
| **Reinforcement Learning (RL)** | Agent-environment feedback | Maximize cumulative reward | Q-learning, DQN, PPO | Robotics control, game playing |

### Reinforcement Learning in one view

- **State (s):** current environment representation
- **Action (a):** decision made by agent
- **Reward (r):** scalar feedback signal
- **Policy `π(a|s)`:** strategy mapping states to actions
- **Objective:** maximize expected discounted return `E[Σ γ^t r_t]`

RL is generally sample-inefficient and operationally complex; for many business problems, supervised learning is still the practical default.

---

## Core Supervised Models

## Linear Regression

Used for continuous targets.

Formula:

`y = β0 + β1x1 + β2x2 + ... + βpxp + ε`

Assumptions (important in interviews):

- Linear relationship
- Independent errors
- Homoscedasticity
- No severe multicollinearity
- Approximately normal residuals (for inference)

## Logistic Regression

Used for classification. Despite the name, it is a classification model.

`P(y=1|x) = sigmoid(w^Tx + b)`

- Outputs class probability
- Decision boundary is linear in feature space
- Interpretable coefficients (odds ratios)
- Works very well as a baseline

### Example: preprocessing + classification + evaluation

```python
import numpy as np
import pandas as pd

from sklearn.model_selection import train_test_split, StratifiedKFold, GridSearchCV
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.impute import SimpleImputer

from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    classification_report,
)

# Load data
# df = pd.read_csv("customer_churn.csv")

numeric_features = ["age", "balance", "tenure", "monthly_spend"]
categorical_features = ["country", "segment", "device_type"]

numeric_transformer = Pipeline(steps=[
    ("imputer", SimpleImputer(strategy="median")),
    ("scaler", StandardScaler()),
])

categorical_transformer = Pipeline(steps=[
    ("imputer", SimpleImputer(strategy="most_frequent")),
    ("onehot", OneHotEncoder(handle_unknown="ignore")),
])

preprocessor = ColumnTransformer(
    transformers=[
        ("num", numeric_transformer, numeric_features),
        ("cat", categorical_transformer, categorical_features),
    ]
)

clf = Pipeline(steps=[
    ("preprocessor", preprocessor),
    ("model", LogisticRegression(max_iter=2000, class_weight="balanced")),
])

# X = df.drop(columns=["churn"])
# y = df["churn"]

# Example placeholders for runnable structure
X = pd.DataFrame({
    "age": np.random.randint(18, 70, 500),
    "balance": np.random.normal(1000, 300, 500),
    "tenure": np.random.randint(1, 120, 500),
    "monthly_spend": np.random.normal(80, 20, 500),
    "country": np.random.choice(["US", "UK", "VN"], 500),
    "segment": np.random.choice(["A", "B", "C"], 500),
    "device_type": np.random.choice(["web", "mobile"], 500),
})
y = (X["monthly_spend"] + X["balance"] * 0.001 + (X["segment"] == "C").astype(int) > 1.8).astype(int)

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

clf.fit(X_train, y_train)
y_pred = clf.predict(X_test)
y_prob = clf.predict_proba(X_test)[:, 1]

print("Accuracy:", accuracy_score(y_test, y_pred))
print("Precision:", precision_score(y_test, y_pred))
print("Recall:", recall_score(y_test, y_pred))
print("F1:", f1_score(y_test, y_pred))
print("AUC-ROC:", roc_auc_score(y_test, y_prob))
print(classification_report(y_test, y_pred))
```

---

## Tree-based Models

## Decision Trees

- Split recursively using impurity reduction (Gini/Entropy for classification, MSE for regression)
- Highly interpretable
- Prone to overfitting without constraints

Important hyperparameters:

- `max_depth`
- `min_samples_split`
- `min_samples_leaf`
- `max_features`

## Random Forest (Bagging)

- Ensemble of decision trees trained on bootstrap samples
- Each split uses random subset of features
- Reduces variance and improves generalization

## Gradient Boosting (Boosting)

- Builds weak learners sequentially
- Each learner corrects errors of previous learners
- Strong performance on tabular data

Popular implementations:

- **XGBoost:** regularized, robust, very popular in competitions
- **LightGBM:** fast, memory-efficient, histogram-based growth

### Ensemble strategy comparison

| Method | Family | Train Style | Strength | Risk |
|---|---|---|---|---|
| Random Forest | Bagging | Parallel trees | Stable, less tuning | Larger model size |
| XGBoost | Boosting | Sequential | High accuracy | Overfitting if aggressive |
| LightGBM | Boosting | Leaf-wise growth | Very fast on large data | Can overfit small noisy data |
| Stacking | Meta-ensemble | Multi-stage | Combines diverse models | Validation leakage risk |

---

## Distance and Margin-based Models

## SVM (Support Vector Machine)

- Finds maximum-margin separating hyperplane
- Kernel trick allows nonlinear boundaries (RBF, polynomial)
- Effective in medium-sized, high-dimensional data

Key hyperparameters: `C`, `kernel`, `gamma`

## K-Nearest Neighbors (KNN)

- Predict from neighbors in feature space
- No training phase in classic form (lazy learner)
- Sensitive to scaling and noisy irrelevant features

Key hyperparameters: `n_neighbors`, `metric`, `weights`

---

## Unsupervised Learning

## Clustering

### K-Means

- Partition-based, minimizes within-cluster variance
- Works best with roughly spherical clusters
- Requires setting `k`

### DBSCAN

- Density-based clustering
- Detects noise and arbitrary shape clusters
- Parameters: `eps`, `min_samples`

### Hierarchical Clustering

- Builds dendrogram (agglomerative/divisive)
- No strict need to predefine cluster count

## Dimensionality Reduction

### PCA

- Linear projection maximizing variance
- Useful for denoising, compression, and speed

### t-SNE

- Nonlinear technique for visualization
- Excellent for 2D/3D embedding visualization
- Not ideal for preserving global geometry

### Example: clustering + reduction

```python
import numpy as np
from sklearn.datasets import make_blobs
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans, DBSCAN, AgglomerativeClustering
from sklearn.decomposition import PCA
from sklearn.manifold import TSNE

X, _ = make_blobs(n_samples=1000, centers=4, cluster_std=1.2, random_state=42)
X = StandardScaler().fit_transform(X)

kmeans_labels = KMeans(n_clusters=4, random_state=42, n_init=10).fit_predict(X)
dbscan_labels = DBSCAN(eps=0.25, min_samples=8).fit_predict(X)
hier_labels = AgglomerativeClustering(n_clusters=4, linkage="ward").fit_predict(X)

X_pca = PCA(n_components=2, random_state=42).fit_transform(X)
X_tsne = TSNE(n_components=2, perplexity=30, learning_rate="auto", init="pca", random_state=42).fit_transform(X)

print("KMeans clusters:", np.unique(kmeans_labels))
print("DBSCAN clusters/noise labels:", np.unique(dbscan_labels))
print("Hierarchical clusters:", np.unique(hier_labels))
print("PCA shape:", X_pca.shape)
print("t-SNE shape:", X_tsne.shape)
```

---

## Feature Engineering and Data Preparation

Common high-impact practices:

- Handle missing values intentionally (median/mode/model-based)
- Encode categorical variables (one-hot, target encoding)
- Create domain features (ratios, interactions, temporal windows)
- Detect leakage features before training

### Normalization vs Standardization

| Technique | Formula | Typical Use |
|---|---|---|
| **Normalization (Min-Max)** | `(x - min) / (max - min)` | Neural nets, bounded ranges |
| **Standardization (Z-score)** | `(x - μ) / σ` | Linear models, SVM, KNN |

---

## Evaluation Metrics

## Classification

- **Accuracy:** `(TP + TN) / Total`
- **Precision:** `TP / (TP + FP)`
- **Recall:** `TP / (TP + FN)`
- **F1:** harmonic mean of precision and recall
- **AUC-ROC:** ranking quality across thresholds

## Regression

- **MSE:** mean squared error (penalizes large errors)
- **MAE:** mean absolute error (robust to outliers)
- **R²:** explained variance ratio

Metric selection should align with business cost. For example, in medical screening, recall often matters more than overall accuracy.

---

## Cross-validation and Bias-Variance Tradeoff

## Cross-validation

Use K-fold or stratified K-fold to estimate generalization and reduce split randomness.

## Bias-Variance Tradeoff

- High bias: underfitting (model too simple)
- High variance: overfitting (model too complex)
- Best model minimizes expected generalization error

---

## Overfitting, Underfitting, and Regularization

| Problem | Symptoms | Fixes |
|---|---|---|
| Underfitting | Poor train and validation performance | More expressive model, better features |
| Overfitting | Great train but weak validation performance | Regularization, early stopping, simpler model |

Regularization:

- **L1 (Lasso):** pushes some coefficients to exactly zero (feature selection effect)
- **L2 (Ridge):** shrinks coefficients smoothly
- **Elastic Net:** combines L1 + L2

---

## Model Selection and Hyperparameter Tuning

- Start with strong baseline
- Use reproducible CV setup
- Tune with Grid Search / Random Search / Bayesian optimization
- Monitor both metric mean and variance
- Balance performance with latency and interpretability

### Example: grid search with cross-validation

```python
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import GridSearchCV, StratifiedKFold

rf = RandomForestClassifier(random_state=42, n_jobs=-1)

param_grid = {
    "n_estimators": [100, 300],
    "max_depth": [None, 8, 16],
    "min_samples_split": [2, 10],
    "min_samples_leaf": [1, 4],
}

cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
search = GridSearchCV(
    estimator=rf,
    param_grid=param_grid,
    scoring="f1",
    cv=cv,
    n_jobs=-1,
    verbose=1,
)

search.fit(X_train, y_train)
print("Best params:", search.best_params_)
print("Best CV F1:", search.best_score_)
```

---

## Interview Q&A

### 1) Why can accuracy be misleading?

Accuracy fails on imbalanced datasets. If positive rate is 1%, a dumb classifier predicting all negatives gives 99% accuracy but zero recall for the minority class.

### 2) Random Forest vs Gradient Boosting: when to choose which?

Random Forest is a robust low-maintenance baseline. Gradient boosting usually yields better tabular performance after careful tuning, but is more sensitive to hyperparameters.

### 3) What is the practical difference between L1 and L2?

L1 can create sparse models by zeroing coefficients. L2 distributes shrinkage across features and is often more stable with correlated variables.

### 4) Why is feature scaling essential for SVM and KNN?

Distance and margin computations are scale-sensitive. Without scaling, high-magnitude features dominate and distort decision boundaries.

### 5) How do you avoid data leakage in model validation?

Apply all preprocessing steps (imputation, scaling, encoding, selection) **inside a pipeline** and fit them only on training folds during cross-validation.

### 6) What does a good ML baseline look like?

A reproducible pipeline with simple models, clear metrics, stratified split/CV, and a documented error analysis before moving to complex architectures.