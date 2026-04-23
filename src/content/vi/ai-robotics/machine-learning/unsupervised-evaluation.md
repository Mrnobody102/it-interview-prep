# Unsupervised Learning, Metrics & Validation

## Tổng quan

ML engineering tốt phụ thuộc vào kỷ luật validation nhiều không kém gì lựa chọn model.

Mục này kết hợp:

- unsupervised learning để khám phá cấu trúc
- feature engineering và preprocessing
- evaluation metrics
- model selection và tư duy bias-variance

---

## Unsupervised Learning

### Clustering

Các phương pháp clustering phổ biến:

- **K-Means** cho các cluster gần hình cầu
- **DBSCAN** cho grouping theo mật độ và xử lý noise
- **Gaussian Mixture Models** cho soft clustering

Bạn nên chọn phương pháp clustering dựa trên giả định hình học của dữ liệu chứ không chỉ vì tiện.

### Dimensionality Reduction

Các công cụ hữu ích:

- **PCA** cho linear compression và giải thích phương sai
- **t-SNE** cho visualization của local neighborhoods
- **UMAP** cho manifold-style low-dimensional views

Các công cụ này hỗ trợ khám phá tốt, nhưng chất lượng visualization không đồng nghĩa với utility cho downstream task.

---

## Feature Engineering và Preprocessing

Những lựa chọn preprocessing quan trọng gồm:

- xử lý missing values
- scaling và normalization
- categorical encoding
- interaction features
- time-window aggregation cho tín hiệu tuần tự

Nhiều hệ ML thắng không phải vì model cầu kỳ, mà vì feature và split phản ánh đúng bài toán thật.

---

## Metrics và Validation

### Classification Metrics

Bạn nên biết khi nào dùng:

- accuracy
- precision
- recall
- F1
- ROC-AUC
- PR-AUC

Với bài toán mất cân bằng lớp, accuracy thường là metric chính sai.

### Regression Metrics

Các lựa chọn quan trọng:

- MAE
- MSE / RMSE
- R-squared
- quantile loss cho rủi ro bất đối xứng

Hãy chọn metric phản ánh đúng business cost hoặc control cost, không chỉ vì nó quen tay.

---

## Cross-Validation và Bias-Variance

Cross-validation giúp ước lượng generalization, nhưng chỉ có ý nghĩa nếu split phản ánh thực tế.

Các kiểu split quan trọng:

- random stratified split
- group split
- time-series split
- leave-one-entity-out cho generalization theo hardware hoặc user

Bias-variance tradeoff quan trọng vì:

- model underfit bỏ lỡ tín hiệu
- model overfit học cả noise
- capacity phù hợp phụ thuộc vào quy mô dữ liệu, noise, và bối cảnh deploy

---

## Câu hỏi Phỏng vấn

### 1) Vì sao K-Means có thể fail mạnh?

Vì nó giả định hình học cluster có thể không khớp dữ liệu, nhạy với khởi tạo, và xử lý kém các cluster không lồi.

### 2) Vì sao accuracy là metric tệ cho bài toán classification mất cân bằng?

Vì model có thể chỉ đoán lớp đa số mà vẫn có accuracy cao trong khi hoàn toàn vô dụng với lớp hiếm bạn thực sự quan tâm.

### 3) Vì sao cross-validation phải khớp với thực tế deploy?

Vì random split có thể che leakage hoặc correlation patterns sẽ không tồn tại ở production.

### 4) Bias-variance tradeoff là gì?

Đó là sự cân bằng giữa model quá đơn giản nên bỏ lỡ tín hiệu và model quá linh hoạt nên học cả noise thay vì pattern tổng quát.
