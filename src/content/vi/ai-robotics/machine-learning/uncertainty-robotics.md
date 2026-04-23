# Uncertainty, Time-Series & ML for Robotics

## Tổng quan

Khi ML ảnh hưởng tới quyết định vận hành, uncertainty trở thành vấn đề hạng nhất.

Điều này đặc biệt đúng trong robotics, fleet operations, và physical AI, nơi hệ thường phải quyết định:

- prediction này có đáng tin không
- có cần thêm sensing hay không
- có nên fallback sang chế độ an toàn hơn không

---

## Tư duy xác suất và Uncertainty

Các ý quan trọng:

- calibrated probabilities
- predictive uncertainty
- aleatoric vs epistemic uncertainty
- confidence thresholds để gate hành động

Một model có thể chính xác trung bình cao nhưng vẫn nguy hiểm nếu nó overconfident ở các failure hiếm.

Các công cụ hữu ích:

- temperature scaling
- conformal prediction
- Bayesian approximations
- ensemble disagreement

---

## Time-Series và Sequential Signals

Rất nhiều production signals là dữ liệu tuần tự:

- robot telemetry
- xu hướng sức khỏe sensor
- hành vi pin và actuator
- event streams từ người dùng hoặc môi trường

Các tác vụ thường gặp:

- forecasting
- anomaly detection
- changepoint detection
- sequence classification

Các vấn đề quan trọng:

- time-aware splits
- concept drift
- delayed labels
- phân biệt causality với leakage trong aggregated features

---

## Anomaly Detection cho Physical Systems

Anomaly detection thường thực tế hơn full supervision trong hệ vật lý vì failure labels hiếm.

Các pattern hữu ích:

- reconstruction error từ autoencoders
- isolation forest
- one-class SVM
- hybrid alerts kết hợp rules và model score

Nhưng hệ anomaly cũng fail khi:

- normal behavior vốn đã quá đa dạng
- sensors drift
- thresholds không thích nghi theo operating regime

---

## ML cho Robotics và Physical AI

Classical ML có thể hỗ trợ robotics ở nhiều chỗ:

- dự đoán failure từ logs
- dự báo bảo trì
- dự đoán task success
- theo dõi sức khỏe calibration
- phân loại môi trường hoặc terrain

Các model này thường sống cạnh perception hoặc policy stacks lớn hơn và đóng vai trò decision support, ranking, hoặc safety gating.

---

## Câu hỏi Phỏng vấn

### 1) Vì sao uncertainty estimation quan trọng?

Vì hệ thật cần biết khi nào nên tin, nên review, hoặc nên từ chối một prediction thay vì đối xử mọi score như nhau.

### 2) Khác biệt giữa aleatoric và epistemic uncertainty là gì?

Aleatoric uncertainty đến từ noise vốn có của quan sát, còn epistemic uncertainty đến từ thiếu hiểu biết hoặc thiếu coverage của model.

### 3) Vì sao random train/test splits nguy hiểm với time-series?

Vì chúng có thể làm lộ thông tin tương lai vào training và khiến model trông tốt hơn rất nhiều so với lúc chạy trên dữ liệu tương lai thật.

### 4) Classical ML có thể giúp robotics thế nào dù không điều khiển end-to-end?

Nó có thể dự đoán failure, phát hiện bất thường, xếp hạng rủi ro, và hỗ trợ orchestration an toàn hơn quanh perception và control systems.
