# Serving, CI/CD & Orchestration

## Tổng quan

Đưa model vào production là bài toán engineering và operations, không chỉ là đóng gói.

Bạn phải chọn:

- serving mode
- rollout strategy
- automation pipeline
- cách rollback và recovery

Đó là chỗ serving infrastructure và CI/CD orchestration phát huy vai trò.

---

## Các mô hình Serving

Các mode phổ biến:

- **online inference** cho API độ trễ thấp
- **batch inference** cho scoring số lượng lớn theo lịch
- **stream inference** cho hệ event-driven
- **edge inference** cho robotics và thiết bị hạn chế tài nguyên

Mỗi mode làm thay đổi cách bạn nghĩ về latency, throughput, monitoring, và recovery.

---

## CI/CD cho hệ ML

Một pipeline giao hàng ML tốt thường gồm:

- unit và integration tests cho preprocessing
- data validation gates
- model evaluation thresholds
- container image build và signing
- deploy tự động lên staging
- canary hoặc shadow rollout trước khi mở rộng

Pipeline deploy phải chứng minh model mới đủ an toàn, chứ không chỉ là container build được.

---

## Các nền tảng Orchestration

Những lựa chọn điển hình:

- FastAPI hoặc lightweight model servers
- triển khai kiểu Kubernetes
- KServe, Seldon, hoặc inference platforms nội bộ
- workflow orchestrators như Kubeflow, Airflow, hoặc Argo

Bạn không cần mọi tool. Bạn cần một con đường mạch lạc từ training artifact tới serving endpoint.

---

## Rollout Strategies

Các pattern hữu ích:

- **shadow mode**: quan sát hành vi mà chưa cho tác động thật
- **canary**: gửi tỷ lệ traffic nhỏ trước
- **blue/green**: giữ stack cũ và mới song song
- **rollback**: quay lui nhanh khi metrics xấu đi

Với embodied systems, shadow mode và replay có hỗ trợ simulation đặc biệt có giá trị trước khi deploy toàn phần.

---

## Câu hỏi Phỏng vấn

### 1) Khác biệt giữa batch và online inference là gì?

Batch inference chấm điểm nhiều mẫu theo lịch, còn online inference phục vụ dự đoán độ trễ thấp cho các request sống.

### 2) Vì sao shadow deployment hữu ích?

Nó cho phép so sánh model mới trong điều kiện production mà chưa để model đó điều khiển quyết định hướng người dùng hoặc hành vi vật lý.

### 3) Vì sao CI/CD cho ML cần có model evaluation gates?

Vì pass software tests không chứng minh được model mới đủ tốt hoặc đủ an toàn trên dữ liệu liên quan.

### 4) Vì sao edge serving quan trọng trong robotics?

Vì gửi mọi quyết định perception hoặc control lên cloud có thể vi phạm latency, bandwidth, và reliability constraints.
