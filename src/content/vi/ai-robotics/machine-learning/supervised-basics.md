# Supervised Learning & Core Baselines

## Tổng quan

Phần lớn dự án ML nên bắt đầu từ họ model đơn giản nhất có thể giải bài toán đủ tốt.

Mục này bao phủ bộ công cụ supervised cốt lõi xuất hiện liên tục trong phỏng vấn và dự án thật:

- phân biệt supervised, unsupervised, và reinforcement learning
- linear và logistic baselines
- margin và distance methods
- quy trình dựng baseline có kỷ luật

---

## Chọn đúng Learning Paradigm

Trước tiên bạn phải phân loại đúng bài toán:

| Paradigm | Input | Mục tiêu đầu ra | Use case điển hình |
|---|---|---|---|
| **Supervised** | dữ liệu có nhãn | dự đoán target đã biết | churn, fraud, quality scoring |
| **Unsupervised** | dữ liệu không nhãn | khám phá cấu trúc | clustering, anomaly exploration |
| **Reinforcement** | phản hồi agent-môi trường | tối đa hóa reward theo thời gian | robotics control, online decision making |

Nhiều team làm khó chính mình ở giai đoạn đầu khi nhảy quá sớm vào RL hoặc deep learning trong khi supervised baseline đã đủ.

---

## Linear và Logistic Regression

### Linear Regression

Linear regression vẫn hữu ích khi:

- target là giá trị liên tục
- tính diễn giải quan trọng
- quan hệ gần tuyến tính sau feature transformation

Các ý quan trọng trong phỏng vấn:

- residual analysis
- multicollinearity
- homoscedasticity
- regularization với Ridge hoặc Lasso

### Logistic Regression

Logistic regression vẫn là một trong những baseline mạnh nhất cho classification vì nó:

- đơn giản
- dễ giải thích
- dễ calibrate
- train và deploy nhanh

Nó thường rất hiệu quả khi feature space được chuẩn bị tốt và decision boundary không quá phức tạp.

---

## SVM và KNN

### SVM

Support Vector Machines phù hợp khi:

- kích thước dữ liệu vừa phải
- chất lượng margin quan trọng
- feature dimension tương đối cao

Các cần gạt chính:

- `C` điều khiển regularization
- kernel quyết định độ linh hoạt của boundary
- `gamma` rất quan trọng với RBF kernel

### KNN

KNN đơn giản nhưng dạy rất rõ nhiều bài học:

- distance metric quan trọng
- scaling quan trọng
- feature rác gây hại mạnh
- lazy learner có thể đắt ở thời điểm inference

Nó hiếm khi là model cuối cùng ở quy mô lớn, nhưng là một baseline khái niệm tốt.

---

## Quy trình dựng Baseline trong thực tế

Một workflow supervised-learning tốt thường là:

1. định nghĩa rõ target và ranh giới leakage
2. dựng preprocessing pipeline
3. train một baseline đơn giản trước
4. xem confusion matrix hoặc regression residuals
5. chỉ so với model phức tạp hơn sau khi baseline đã đáng tin

Các lỗi hay gặp:

- target leakage qua future features
- thiết kế train/validation split sai
- tối ưu một metric mà không gắn với cost thực tế
- bỏ qua probability calibration trong hệ ra quyết định

---

## Câu hỏi Phỏng vấn

### 1) Vì sao logistic regression vẫn là baseline mạnh?

Vì nó train nhanh, dễ giải thích, thường mạnh hơn kỳ vọng, và tạo ra một mốc tham chiếu sạch trước khi thử model phức tạp hơn.

### 2) Khi nào SVM là lựa chọn hợp lý?

Khi dataset không quá lớn, feature dimension có ý nghĩa, và bạn muốn một classifier dựa trên margin với độ phức tạp có thể kiểm soát.

### 3) Vì sao KNN dễ hoạt động tệ trên dữ liệu thật?

Vì nó nhạy với scaling, feature nhiễu, biến không liên quan, và chi phí tính khoảng cách cao ở inference time.

### 4) Target leakage là gì?

Đó là việc vô tình dùng thông tin trong lúc train mà ở thời điểm dự đoán thực sự sẽ không có, làm validation đẹp giả tạo.
