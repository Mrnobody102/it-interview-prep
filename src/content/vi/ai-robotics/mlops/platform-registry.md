# Feature Stores, Registry & Governance

## Tổng quan

ML production cần một control plane cho features, models, artifacts, và approvals.

Nếu không có lớp điều phối này, team thường rơi vào:

- training-serving skew
- ownership mơ hồ
- model promotion nhầm lẫn
- auditability yếu

Mục này tập trung vào lớp metadata vận hành xung quanh hệ ML.

---

## Khái niệm Feature Store

A feature store giúp chuẩn hóa định nghĩa feature giữa:

- offline training
- batch inference
- online serving

Mục tiêu chính:

- tránh lặp logic feature ở nhiều nơi
- tăng tính nhất quán giữa các môi trường
- hỗ trợ point-in-time correct retrieval

Nguyên tắc quan trọng nhất không phải tên tool, mà là tránh mismatch giữa cái được train và cái được serve.

---

## Model Registry

Registry theo dõi:

- model versions
- stage transitions như staging và production
- evaluation results
- owner, lineage, và deployment status

Điều này hỗ trợ promote, rollback, và review an toàn hơn.

Với hệ nghiêm túc, registry nên nối được tới:

- dataset version
- training code version
- evaluation suite
- serving image hoặc deployment package

---

## Governance và Approval Flow

Governance quan trọng nhất khi lỗi model có giá cao.

Các control quan trọng gồm:

- ngưỡng evaluation bắt buộc
- human approval trước khi promote
- audit logs cho việc ai đã thay đổi gì
- policy constraints cho domain nhạy cảm
- tài liệu về known failure modes

Với hệ LLM, governance còn có thể bao gồm prompt versioning, tool permissions, và tập retrieval corpus được phê duyệt.

---

## Vì sao phần này quan trọng trong AI-Robotics

Trong robotics, cái giá của governance yếu rất cao vì:

- hardware variants có thể hành xử khác nhau
- calibration dependencies có thể làm đổi hiệu năng model
- gói deploy có thể chứa cả models lẫn control parameters
- rollback cần nhanh và đáng tin

Một robot fleet không thể sống dựa vào truyền miệng để biết model nào an toàn để deploy.

---

## Câu hỏi Phỏng vấn

### 1) Feature store giải quyết bài toán gì?

Nó giúp duy trì định nghĩa feature nhất quán giữa training và serving, từ đó giảm training-serving skew và tránh lặp logic.

### 2) Vì sao model registry hữu ích?

Vì nó cung cấp vòng đời có kiểm soát cho model versions, bao gồm promotion, rollback, metadata, và auditability.

### 3) Training-serving skew là gì?

Đó là sự lệch giữa features hoặc preprocessing dùng lúc training và những gì được dùng lúc inference.

### 4) Vì sao governance không chỉ là thủ tục hành chính?

Vì trong hệ thật nó ngăn deploy không an toàn, thay đổi không được ghi nhận, và việc promote model khi chưa có đủ bằng chứng.
