# Machine Learning

## Tổng quan

Machine Learning quá rộng để giữ trong một trang duy nhất mà vẫn rõ cấu trúc.

Trong thực tế, hiểu ML tốt thường phát triển qua bốn lớp:

1. supervised learning và các baseline models
2. tree ensembles và chiến lược cho tabular data
3. unsupervised learning, metrics, và validation
4. uncertainty, dữ liệu tuần tự, và ML cho robotics

Đó là lý do chủ đề này được tách thành các mục con riêng.

---

## Vì sao nó quan trọng với AI-Robotics

Ngay cả trong thời đại deep learning, classical ML vẫn rất hữu ích cho:

- bài toán dự đoán trên dữ liệu bảng
- anomaly detection và weak supervision
- baseline dễ giải thích
- phân tích telemetry của robot và fleet operations
- suy luận có nhận thức về uncertainty trước khi dùng end-to-end learning

Nhiều hệ thực dụng mạnh lên rõ rệt khi classical ML và deep models được dùng bổ trợ cho nhau thay vì bị coi là hai phe đối lập.

---

## Bản đồ các mục con

### 1. Supervised Learning & Core Baselines

Trọng tâm:

- phân biệt supervised, unsupervised, và reinforcement learning
- linear và logistic regression
- SVM, KNN, và cách chọn baseline
- khi nào model đơn giản mới là bước đi đúng

Dùng mục này khi bạn muốn nắm ngôn ngữ cốt lõi của phỏng vấn ML và các baseline ban đầu trong dự án.

### 2. Trees, Ensembles & Tabular ML

Trọng tâm:

- decision trees và hành vi overfitting
- random forest, XGBoost, và LightGBM
- feature importance và workflow cho dữ liệu bảng
- vì sao tree ensembles vẫn rất mạnh trong production

Dùng mục này khi dữ liệu có cấu trúc rõ, không đồng nhất, và chưa chắc phù hợp với deep learning.

### 3. Unsupervised Learning, Metrics & Validation

Trọng tâm:

- clustering và dimensionality reduction
- feature engineering và preprocessing
- metrics cho classification và regression
- cross-validation, bias-variance, và model selection

Dùng mục này khi bài toán chính là hiểu dữ liệu và xác thực model cho đúng.

### 4. Uncertainty, Time-Series & ML for Robotics

Trọng tâm:

- probabilistic modeling và confidence estimation
- tín hiệu tuần tự và time-series forecasting
- anomaly detection trên sensor hoặc system logs
- workflow ML cho physical AI và robot telemetry

Dùng mục này khi bạn cần ML giúp hệ ra quyết định an toàn hơn dưới uncertainty.

---

## Thứ tự học gợi ý

Với đa số engineers, thứ tự thực dụng là:

1. supervised basics
2. trees và ensembles
3. evaluation và unsupervised methods
4. uncertainty và ứng dụng cho robotics

Thứ tự này cho cả nền phỏng vấn lẫn đường đi hợp lý vào các bài toán production.

---

## Liên hệ với các topic AI-Robotics khác

Phần Machine Learning này có giao nhau, nhưng không thay thế:

- **Deep Learning** cho neural architectures và representation learning quy mô lớn
- **MLOps & AI Production** cho experiment tracking, deployment, và monitoring
- **Robot Perception** cho state estimation gắn với cảm biến
- **Robot Learning & Embodied AI** cho policy learning và action generation

Machine learning là bộ công cụ suy luận và ra quyết định nằm quanh cả AI stack rộng hơn.

---

## Câu hỏi Phỏng vấn

### 1) Vì sao nên tách Machine Learning thành nhiều mục nhỏ?

Vì baseline supervised, tabular ensembles, kỷ luật evaluation, và use case robotics có uncertainty là các cụm kỹ năng khác nhau, nên tách ra sẽ dễ học và dễ tra cứu hơn.

### 2) Vì sao classical ML vẫn còn quan trọng trong 2026?

Vì nhiều bài toán production vẫn là tabular, ít dữ liệu, hoặc cần giải thích được, nơi model đơn giản thường rẻ hơn và đôi khi mạnh hơn deep model.

### 3) Vì sao uncertainty quan trọng trong ML liên quan robotics?

Vì quyết định của robot hoặc fleet không chỉ dựa vào dự đoán, mà còn dựa vào mức độ tự tin trước khi hành động.
