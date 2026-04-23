# Trees, Ensembles & Tabular ML

## Tổng quan

Các phương pháp dựa trên cây vẫn là một trong những công cụ mạnh nhất cho dữ liệu có cấu trúc và tabular data.

Chúng phổ biến vì:

- bắt được quan hệ phi tuyến
- xử lý tốt feature types pha trộn
- ít phụ thuộc vào scaling
- thường thắng deep models trên dataset tabular cỡ vừa

---

## Decision Trees

Decision tree chia không gian feature theo cách đệ quy để giảm impurity hoặc error.

Lý do người ta thích:

- dễ giải thích
- mô hình hóa interaction tự nhiên
- dùng được cho cả classification lẫn regression

Lý do người ta ngại:

- rất dễ overfit
- không ổn định khi dữ liệu thay đổi nhẹ
- cây sâu dễ học cả noise

Các control quan trọng:

- max depth
- minimum samples per split
- minimum samples per leaf
- pruning hoặc regularization

---

## Random Forest

Random Forest cải thiện một cây đơn bằng cách dùng:

- bootstrap sampling
- random feature subsets
- gộp kết quả từ nhiều cây

Điều này làm giảm variance và thường tăng generalization.

Nó là lựa chọn mặc định tốt khi:

- dữ liệu có cấu trúc rõ
- có thể chấp nhận interpretability xấp xỉ
- muốn một model mạnh, ít phải tuning quá gắt

---

## Gradient Boosting

Boosting train các learner theo chuỗi, trong đó learner sau cố sửa residual errors của learner trước.

Các family phổ biến:

- XGBoost
- LightGBM
- CatBoost

Vì sao boosting mạnh:

- bắt được decision boundary khó
- xử lý tốt các pattern tabular không đồng nhất
- thường cho performance rất cao khi tuning cẩn thận

Nhưng rủi ro cũng lớn:

- overfit các feature nhiễu
- khuếch đại leakage nếu pipeline sai
- nhạy mạnh với chất lượng validation

---

## Best Practices cho Tabular ML

Các thói quen quan trọng:

- dựng preprocessing không bị leakage
- encode categorical variables hợp lý
- theo dõi class imbalance
- dùng time-aware hoặc group-aware splits khi cần
- diễn giải feature importance một cách thận trọng

Feature importance bản thân nó cũng có bẫy:

- impurity importance có thể biased
- permutation importance thường đáng tin hơn
- SHAP hữu ích nhưng không thay thế được tư duy domain

Model có thể xếp feature rất cao chỉ vì pipeline đang encode shortcut.

---

## Câu hỏi Phỏng vấn

### 1) Vì sao tree ensembles thường thắng deep learning trên tabular data?

Vì chúng xử lý rất tốt dữ liệu có cấu trúc, phi tuyến, dị thể, cỡ vừa mà không cần representation learning quy mô lớn.

### 2) Khác biệt giữa bagging và boosting là gì?

Bagging giảm variance bằng cách train song song trên dữ liệu lấy mẫu lại, còn boosting giảm error bằng cách train tuần tự để sửa lỗi trước đó.

### 3) Vì sao feature importance có thể gây hiểu nhầm?

Vì điểm importance có thể phản ánh leakage, correlated features, hoặc chính phương pháp scoring thay vì tầm quan trọng nhân quả thật sự.

### 4) Khi nào nên chọn Random Forest thay vì XGBoost?

Khi bạn muốn một baseline mạnh, ổn định, ít nhạy với tuning, và chấp nhận đổi một ít peak accuracy lấy sự đơn giản.
