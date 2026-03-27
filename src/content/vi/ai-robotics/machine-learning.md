# Machine Learning

## Tổng quan

Machine Learning là tập con của AI cho phép hệ thống tự học từ dữ liệu thay vì được lập trình tường minh.

## Các loại Machine Learning

| Loại | Mô tả | Ví dụ |
|------|-------|-------|
| **Supervised Learning** | Học từ dữ liệu có label | Classification, Regression |
| **Unsupervised Learning** | Học từ dữ liệu không label | Clustering, Dimensionality Reduction |
| **Reinforcement Learning** | Học qua tương tác với môi trường | Game AI, Robotics |
| **Semi-supervised** | Kết hợp labeled và unlabeled | Self-training |

## Supervised Learning

### Classification

```python
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report

# Chuẩn bị dữ liệu
X_train, X_test, y_train, y_test = train_test_split(
    features, labels, test_size=0.2, random_state=42
)

# Huấn luyện
clf = RandomForestClassifier(n_estimators=100, max_depth=10)
clf.fit(X_train, y_train)

# Đánh giá
y_pred = clf.predict(X_test)
print(accuracy_score(y_test, y_pred))
print(classification_report(y_test, y_pred))
```

### Regression

```python
from sklearn.linear_model import LinearRegression, Ridge
from sklearn.preprocessing import StandardScaler

# Scale dữ liệu
scaler = StandardScaler()
X_scaled = scaler.fit_transform(features)

# Ridge Regression (regularization)
model = Ridge(alpha=1.0)
model.fit(X_train, y_train)

# Dự đoán
predictions = model.predict(X_test)
```

## Unsupervised Learning

### K-Means Clustering

```python
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler

# Chuẩn hóa
scaler = StandardScaler()
X_scaled = scaler.fit_transform(data)

# Tìm optimal k bằng Elbow method
inertias = [KMeans(n_clusters=k).fit(X_scaled).inertia_
            for k in range(1, 11)]

# Cluster với k=3
kmeans = KMeans(n_clusters=3, random_state=42)
labels = kmeans.fit_predict(X_scaled)
```

### PCA (Dimensionality Reduction)

```python
from sklearn.decomposition import PCA

pca = PCA(n_components=0.95)  # Giữ lại 95% variance
X_reduced = pca.fit_transform(X)
print(f"Số chiều: {pca.n_components_}")
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
| **F1-Score** | Harmonic mean của precision và recall |
| **AUC-ROC** | Model discrimination |

## Feature Engineering

```python
import pandas as pd
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer

# Xử lý numeric features
numeric_features = ['age', 'salary', 'experience']
numeric_transformer = StandardScaler()

# Xử lý categorical features
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
# Overfitting: model quá phức tạp, fit noise
# Giải pháp: regularization, cross-validation, dropout

# Underfitting: model quá đơn giản
# Giải pháp: tăng model complexity, thêm features

from sklearn.model_selection import validation_curve
import numpy as np

# Ví dụ với regularization
alphas = np.logspace(-4, 1, 50)
train_scores, val_scores = validation_curve(
    Ridge(), X, y, param_name='alpha',
    param_range=alphas, cv=5
)
```

## Câu hỏi phỏng vấn

### 1. Sự khác nhau giữa Bias và Variance?

**Bias** là lỗi từ model quá đơn giản — underfitting. **Variance** là lỗi từ model quá phức tạp — overfitting. Mục tiêu là tìm sweet spot giữa hai cái (bias-variance tradeoff).

### 2. Khi nào dùng Random Forest vs Gradient Boosting?

Random Forest: parallel, ít overfitting, ít hyperparameter tuning. Gradient Boosting: sequential, cao hơn accuracy, dễ overfitting, cần careful tuning. Gradient Boosting thường tốt hơn với structured data.

### 3. Regularization hoạt động như thế nào?

L1 (Lasso) và L2 (Ridge) thêm penalty term vào loss function. L1 khuyến khích sparsity (feature selection tự động). L2 giảm weights về gần 0 nhưng không bằng 0.

### 4. Cross-validation tại sao quan trọng?

Data splitting ngẫu nhiên có thể không đại diện. K-fold CV đảm bảo mỗi sample được validate đúng 1 lần, cho ước lượng generalization accuracy đáng tin cậy hơn.
