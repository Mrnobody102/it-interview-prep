# Machine Learning

## Tổng quan

Machine Learning (ML) là lĩnh vực xây dựng các thuật toán học từ dữ liệu để đưa ra dự đoán hoặc quyết định mà không cần lập trình tường minh theo luật cố định. Trong môi trường phỏng vấn, bạn thường được kỳ vọng hiểu cả **lý thuyết** (tại sao một mô hình hoạt động) và **thực hành** (cách huấn luyện, xác thực và triển khai một cách đáng tin cậy).

Một workflow ML sản xuất thường theo các bước:

1. Xác định bài toán và mục tiêu
2. Thu thập dữ liệu và kiểm tra chất lượng
3. Feature engineering và tiền xử lý
4. Huấn luyện và xác thực mô hình
5. Tinh chỉnh siêu tham số và lựa chọn mô hình
6. Phân tích lỗi và kiểm tra độ bền
7. Triển khai và giám sát liên tục

---

## Các Paradigm Học: Supervised vs Unsupervised vs Reinforcement

| Paradigm | Dữ liệu | Mục tiêu | Thuật toán tiêu biểu | Ví dụ thực tế |
|---|---|---|---|---|
| **Supervised Learning** | Có nhãn `(X, y)` | Dự đoán nhãn đã biết | Linear/Logistic Regression, Trees, SVM | Dự đoán churn, phát hiện gian lận |
| **Unsupervised Learning** | Không nhãn `X` | Khám phá cấu trúc ẩn | K-Means, DBSCAN, PCA | Phân khúc khách hàng, tìm bất thường |
| **Reinforcement Learning (RL)** | Phản hồi từ môi trường Agent | Tối đa hóa phần thưởng tích lũy | Q-learning, DQN, PPO | Điều khiển robot, chơi game |

### Reinforcement Learning nhìn một góc

- **State (s):** biểu diễn trạng thái hiện tại của môi trường
- **Action (a):** quyết định của agent
- **Reward (r):** tín hiệu phản hồi vô hướng
- **Policy `π(a|s)`:** chiến lược ánh xạ trạng thái sang hành động
- **Mục tiêu:** tối đa hóa expected discounted return `E[Σ γ^t r_t]`

RL thường không hiệu quả về mẫu và phức tạp về vận hành; với nhiều bài toán kinh doanh, supervised learning vẫn là lựa chọn thực tế mặc định.

---

## Các Mô hình Supervised Cốt lõi

## Linear Regression

Dùng cho biến mục tiêu liên tục.

Công thức:

`y = β0 + β1x1 + β2x2 + ... + βpxp + ε`

Các giả định (quan trọng trong phỏng vấn):

- Quan hệ tuyến tính
- Sai số độc lập
- Phương sai đồng nhất (homoscedasticity)
- Không đa cộng tuyến nghiêm trọng
- Phần dư xấp xỉ phân phối chuẩn (để suy luận thống kê)

## Logistic Regression

Dùng cho bài toán phân loại. Dù tên gọi là "regression", đây thực chất là mô hình phân loại.

`P(y=1|x) = sigmoid(w^Tx + b)`

- Đầu ra là xác suất thuộc lớp
- Ranh giới quyết định tuyến tính trong không gian đặc trưng
- Hệ số có thể diễn giải (odds ratios)
- Hoạt động rất tốt như baseline

### Ví dụ: tiền xử lý + phân loại + đánh giá

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

# Tải dữ liệu
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

# Ví dụ placeholder để code chạy được
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

## Các Mô hình Tree-based

## Decision Trees

- Chia đệ quy dựa trên giảm impurity (Gini/Entropy cho phân loại, MSE cho hồi quy)
- Dễ diễn giải
- Dễ overfitting nếu không ràng buộc

Các siêu tham số quan trọng:

- `max_depth`
- `min_samples_split`
- `min_samples_leaf`
- `max_features`

## Random Forest (Bagging)

- Tập hợp các decision trees huấn luyện trên bootstrap samples
- Mỗi lần split dùng random subset của features
- Giảm variance và cải thiện generalization

## Gradient Boosting (Boosting)

- Xây dựng các weak learners tuần tự
- Mỗi learner sửa lỗi của các learners trước đó
- Hiệu suất mạnh trên dữ liệu dạng bảng (tabular)

Các implementation phổ biến:

- **XGBoost:** có regularization, mạnh mẽ, rất phổ biến trong competitions
- **LightGBM:** nhanh, tiết kiệm bộ nhớ, histogram-based growth

### So sánh chiến lược ensemble

| Phương pháp | Family | Train Style | Điểm mạnh | Rủi ro |
|---|---|---|---|---|
| Random Forest | Bagging | Các tree song song | Ổn định, ít cần tune | Kích thước lớn |
| XGBoost | Boosting | Tuần tự | Độ chính xác cao | Overfitting nếu quá aggressive |
| LightGBM | Boosting | Leaf-wise growth | Rất nhanh trên dữ liệu lớn | Có thể overfit dữ liệu nhỏ, nhiễu |
| Stacking | Meta-ensemble | Đa tầng | Kết hợp các mô hình đa dạng | Rủi ro validation leakage |

---

## Các Mô hình Dựa trên Khoảng cách và Margin

## SVM (Support Vector Machine)

- Tìm hyperplane phân cách với margin tối đa
- Kernel trick cho phép ranh giới phi tuyến (RBF, polynomial)
- Hiệu quả với dữ liệu kích thước trung bình, chiều cao

Siêu tham số quan trọng: `C`, `kernel`, `gamma`

## K-Nearest Neighbors (KNN)

- Dự đoán từ các neighbors trong không gian đặc trưng
- Không có giai đoạn huấn luyện thực sự (lazy learner)
- Nhạy cảm với scaling và các đặc trưng nhiễu không liên quan

Siêu tham số quan trọng: `n_neighbors`, `metric`, `weights`

---

## Unsupervised Learning

## Clustering

### K-Means

- Phân cụm dựa trên phân vùng, tối thiểu hóa within-cluster variance
- Hoạt động tốt nhất với các cụm hình cầu
- Cần đặt trước `k`

### DBSCAN

- Clustering dựa trên mật độ
- Phát hiện noise và các cụm có hình dạng tùy ý
- Tham số: `eps`, `min_samples`

### Hierarchical Clustering

- Xây dựng dendrogram (agglomerative/divisive)
- Không cần xác định trước số cụm

## Giảm Chiều Dữ liệu

### PCA

- Chiếu tuyến tính tối đa hóa phương sai
- Hữu ích cho denoising, nén, và tăng tốc

### t-SNE

- Kỹ thuật phi tuyến cho trực quan hóa
- Tuyệt vời cho embedding 2D/3D
- Không lý tưởng để bảo toàn cấu trúc toàn cục

### Ví dụ: clustering + giảm chiều

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

## Feature Engineering và Chuẩn bị Dữ liệu

Các thực hành có tác động cao:

- Xử lý missing values có chủ đích (median/mode/model-based)
- Encode các biến categorical (one-hot, target encoding)
- Tạo các đặc trưng theo domain (tỷ lệ, tương tác, cửa sổ thời gian)
- Phát hiện leakage features trước khi huấn luyện

### Normalization vs Standardization

| Kỹ thuật | Công thức | Sử dụng phổ biến |
|---|---|---|
| **Normalization (Min-Max)** | `(x - min) / (max - min)` | Neural nets, bounded ranges |
| **Standardization (Z-score)** | `(x - μ) / σ` | Linear models, SVM, KNN |

---

## Các Metrics Đánh giá

## Phân loại

- **Accuracy:** `(TP + TN) / Total`
- **Precision:** `TP / (TP + FP)`
- **Recall:** `TP / (TP + FN)`
- **F1:** trung bình điều hòa của precision và recall
- **AUC-ROC:** chất lượng xếp hạng qua các ngưỡng

## Hồi quy

- **MSE:** mean squared error (phạt nặng lỗi lớn)
- **MAE:** mean absolute error (ổn định với outliers)
- **R²:** tỷ lệ phương sai được giải thích

Lựa chọn metric cần phù hợp với chi phí kinh doanh. Ví dụ, trong sàng lọc y tế, recall thường quan trọng hơn accuracy tổng thể.

---

## Cross-validation và Bias-Variance Tradeoff

## Cross-validation

Dùng K-fold hoặc stratified K-fold để ước lượng khả năng tổng quát hóa và giảm tính ngẫu nhiên của việc chia dữ liệu.

## Bias-Variance Tradeoff

- High bias: underfitting (mô hình quá đơn giản)
- High variance: overfitting (mô hình quá phức tạp)
- Mô hình tốt nhất tối thiểu hóa expected generalization error

---

## Overfitting, Underfitting, và Regularization

| Vấn đề | Triệu chứng | Cách xử lý |
|---|---|---|
| Underfitting | Cả train và validation đều kém | Mô hình biểu hiện hơn, features tốt hơn |
| Overfitting | Train tốt nhưng validation yếu | Regularization, early stopping, mô hình đơn giản hơn |

Regularization:

- **L1 (Lasso):** đẩy một số hệ số về đúng 0 (tác dụng chọn đặc trưng)
- **L2 (Ridge):** thu nhỏ các hệ số một cách mượt mà
- **Elastic Net:** kết hợp L1 + L2

---

## Model Selection và Hyperparameter Tuning

- Bắt đầu với baseline mạnh
- Sử dụng setup CV có thể reproduce
- Tune bằng Grid Search / Random Search / Bayesian optimization
- Theo dõi cả mean và variance của metric
- Cân bằng hiệu suất với độ trễ và khả năng diễn giải

### Ví dụ: grid search với cross-validation

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

## Probabilistic ML và Uncertainty

Trong physical AI systems, confidence gần như quan trọng ngang với chất lượng dự đoán.

Các ý tưởng uncertainty quan trọng:

- **Aleatoric uncertainty:** nhiễu vốn có của dữ liệu hoặc sensor
- **Epistemic uncertainty:** bất định vì model chưa thấy đủ dữ liệu phù hợp
- **Calibration:** xác suất dự đoán có khớp với tần suất thật ngoài đời không

Vì sao nó quan trọng trong robotics:

- output từ perception có thể nhiễu hoặc bị che khuất
- planner phải phản ứng khác nhau với detection confidence thấp
- safety system cần threshold gắn với confidence thật, không chỉ raw score

Các công cụ hay gặp:

- probabilistic classifier
- ensemble
- Monte Carlo dropout
- conformal prediction
- Bayesian filtering đặt trên learned output

Nếu robot policy hoặc detector quá tự tin trong tình huống lạ, failure handling sẽ khó hơn rất nhiều.

---

## Time-Series, Sequential Data và Decision Signals

Rất nhiều dữ liệu AI thực tế không phải dữ liệu i.i.d. dạng bảng. Nó là dữ liệu chuỗi:

- sensor streams
- telemetry
- trajectories
- user sessions
- logs theo thời gian

Điều đó làm bài toán ML thay đổi khá mạnh.

Các vấn đề thường gặp:

- temporal leakage
- delayed labels
- non-stationarity
- autocorrelation
- distribution shift theo môi trường hoặc task

Với robotics và embodied systems, feature thường đến từ:

- lịch sử velocity và acceleration
- force trace hoặc contact trace
- controller state
- pin, nhiệt độ và trạng thái phần cứng
- thứ tự sự kiện và chuỗi failure

Đó là lý do ML engineer tốt không thể chỉ biết mỗi random train/test split.

---

## ML cho Robotics và Physical AI

Classical ML vẫn xuất hiện nhiều trong robotics dù deep learning được chú ý hơn.

Ví dụ:

- anomaly detection trên telemetry
- predictive maintenance
- failure classification
- trajectory clustering
- mode detection và behavior segmentation
- learned cost hoặc heuristic estimation

Trong nhiều sản phẩm robotics, một gradient boosting model đơn giản trên feature vận hành tốt có thể tạo giá trị thực tế hơn một end-to-end model đắt đỏ.

Bài học thực dụng là:

- dùng deep learning khi representation learning là bottleneck
- dùng classical ML khi tín hiệu đã có cấu trúc và hệ thống cần tốc độ, interpretability hoặc retraining dễ hơn

---

## Câu hỏi Phỏng vấn

### 1) Tại sao accuracy có thể gây hiểu nhầm?

Accuracy thất bại trên các dataset mất cân bằng. Nếu tỷ lệ positive là 1%, một classifier "ngu" luôn dự đoán negative sẽ cho 99% accuracy nhưng recall bằng 0 cho minority class.

### 2) Random Forest vs Gradient Boosting: khi nào chọn cái nào?

Random Forest là baseline mạnh mẽ, ít cần bảo trì. Gradient boosting thường cho kết quả tốt hơn trên dữ liệu dạng bảng sau khi tinh chỉnh cẩn thận, nhưng nhạy cảm hơn với hyperparameters.

### 3) Khác biệt thực tế giữa L1 và L2 là gì?

L1 có thể tạo mô hình thưa bằng cách đưa hệ số về 0. L2 phân bổ sự thu nhỏ đều qua các đặc trưng và thường ổn định hơn với các biến tương quan.

### 4) Tại sao feature scaling cần thiết cho SVM và KNN?

Các phép tính khoảng cách và margin nhạy cảm với scale. Nếu không scale, các đặc trưng có giá trị lớn sẽ chi phối và làm sai lệch ranh giới quyết định.

### 5) Làm sao tránh data leakage trong model validation?

Áp dụng tất cả các bước tiền xử lý (imputation, scaling, encoding, selection) **bên trong một pipeline** và chỉ fit chúng trên các training folds trong cross-validation.

### 6) Một ML baseline tốt trông như thế nào?

Một pipeline có thể reproduce với các mô hình đơn giản, metrics rõ ràng, stratified split/CV, và phân tích lỗi có tài liệu trước khi chuyển sang các kiến trúc phức tạp.

### 7) Vì sao uncertainty estimation quan trọng hơn trong robotics so với nhiều web ML task?

Vì hệ thống hành động trong thế giới vật lý. Một dự đoán sai nhưng confidence thấp cần được downstream layer hiểu đúng để tránh planner hoặc controller đưa ra quyết định không an toàn.

### 8) Vì sao random shuffle thường sai với dữ liệu chuỗi?

Vì nó có thể làm lộ thông tin tương lai vào training và khiến evaluation lạc quan giả tạo. Với dữ liệu theo thời gian, cần time-aware split.
