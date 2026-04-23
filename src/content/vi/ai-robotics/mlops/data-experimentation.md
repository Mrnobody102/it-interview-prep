# Data Quality, Versioning & Experimentation

## Tổng quan

Phần lớn lỗi ML bắt đầu từ trước cả model.

Nếu data contracts bất ổn, labels nhiều noise, hoặc experiments không tái lập được, kiến trúc tốt hơn cũng không cứu được hệ thống.

Mục này nói về kỷ luật vận hành cần có trước cả khi bàn tới deployment.

---

## Data Versioning và Lineage

Bạn cần biết chính xác:

- nguồn raw data nào đã được dùng
- code preprocessing nào tạo ra training set
- labels hoặc human annotations nào đã được đưa vào
- model nào được train từ version dữ liệu đó

Các pattern hữu ích:

- DVC hoặc versioning ở tầng data lake
- immutable datasets theo partition
- metadata tables cho data provenance
- run IDs nối dataset, code, config, và model artifacts

Không có lineage thì rollback và reproducibility chỉ còn là phỏng đoán.

---

## Data Validation và Contracts

Các kiểm tra quan trọng:

- schema validation
- null / range / cardinality constraints
- kiểm tra chất lượng join
- theo dõi phân phối nhãn
- freshness checks cho pipeline nhạy thời gian

Ở hệ ML trưởng thành, validation không phải tùy chọn. Pipeline nên fail sớm thay vì âm thầm train trên input lỗi.

---

## Experiment Tracking

Experiment tracking tốt phải lưu được:

- code version
- parameters và hyperparameters
- dataset version
- metrics
- artifacts như plots, checkpoints, confusion matrices

Các tool phổ biến:

- MLflow
- Weights & Biases
- TensorBoard

Điểm quan trọng không nằm ở tên tool. Điểm quan trọng là khả năng tái hiện vì sao một kết quả lại được chấp nhận.

---

## Logging cho Embodied AI

Với robotics và physical AI, experimentation không chỉ là log bảng.

Bạn thường cần:

- camera, depth, IMU, và proprioception streams được đồng bộ
- action logs và controller state
- timestamps có kỷ luật clock đáng tin cậy
- event markers cho intervention, failure, và recovery

Chất lượng đồng bộ thời gian nhiều khi còn quan trọng hơn độ phức tạp của model khi debug robot behavior.

---

## Câu hỏi Phỏng vấn

### 1) Vì sao data versioning quan trọng trong ML?

Vì hành vi model phụ thuộc vào dữ liệu nhiều không kém code. Không có data versioning thì bạn không thể tái lập hay giải thích kết quả một cách đáng tin.

### 2) Mục đích của data validation là gì?

Nó chặn input lỗi trước khi làm bẩn quá trình train hoặc inference, từ đó giảm silent failures và quyết định sai downstream.

### 3) Vì sao experiment tracking là bắt buộc?

Vì team cần một bản ghi rõ ràng về những gì đã thử, cái gì hiệu quả, và cấu hình chính xác nào tạo ra model được promote.

### 4) Vì sao logging trong robotics khó hơn?

Vì nhiều sensor streams và action streams phải được đồng bộ rất chính xác, và nhiều bug chỉ lộ ra khi tái dựng đúng quan hệ thời gian.
