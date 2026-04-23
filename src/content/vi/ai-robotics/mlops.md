# MLOps & AI Production

## Tổng quan

MLOps giờ không còn chỉ là train một model rồi expose một API.

Đến tháng 4 năm 2026, nó bao trùm ít nhất bốn mảng gắn chặt với nhau:

1. data quality, lineage, và experimentation
2. feature stores, model registry, và governance
3. serving, CI/CD, orchestration, và deployment
4. monitoring, LLMOps, và fleet learning cho hệ AI

Đó là lý do chủ đề này được tách thành các mục con thay vì giữ như một trang khổng lồ.

---

## Vì sao nó quan trọng với AI-Robotics

Hệ AI fail ở production vì lý do vận hành cũng thường xuyên như vì lý do mô hình.

Nguồn lỗi phổ biến:

- schema drift
- features cũ hoặc data joins sai
- rollout strategy kém
- monitoring yếu hoặc thiếu ngưỡng cảnh báo
- evaluation bỏ qua safety và rare failure cases

Với robotics và physical AI, ngưỡng yêu cầu còn cao hơn vì lỗi production có thể tác động trực tiếp lên phần cứng và môi trường thật.

---

## Bản đồ các mục con

### 1. Data Quality, Versioning & Experimentation

Trọng tâm:

- data lineage và reproducibility
- validation, label quality, và dataset contracts
- experiment tracking và offline evaluation
- log đồng bộ cho embodied systems

Dùng mục này khi câu hỏi là làm sao để ML chạy lặp lại được thay vì phụ thuộc may mắn.

### 2. Feature Stores, Registry & Governance

Trọng tâm:

- định nghĩa features và tính nhất quán online/offline
- model registry và artifact promotion
- approval flows, metadata, và lineage
- governance cho các triển khai AI rủi ro cao

Dùng mục này khi bạn cần kiểm soát rõ thứ gì được deploy và vì sao.

### 3. Serving, CI/CD & Orchestration

Trọng tâm:

- online, batch, và streaming inference
- containerization và triển khai kiểu Kubernetes
- canary, shadow, rollback, và automation
- edge deployment và hybrid-cloud patterns

Dùng mục này khi bạn quan tâm tới delivery và rollout đáng tin cậy.

### 4. Monitoring, LLMOps & Fleet Learning

Trọng tâm:

- drift detection và production metrics
- prompt, retrieval, và đánh giá cho hệ LLM
- observability về cost, latency, và reliability
- feedback loops cho robot fleets và embodied systems

Dùng mục này khi vấn đề thật sự bắt đầu sau lúc deploy.

---

## Thứ tự học gợi ý

Với đa số engineers, thứ tự thực dụng là:

1. data quality và experimentation
2. registry, feature platform, và governance
3. serving và deployment orchestration
4. monitoring, LLMOps, và fleet learning

Đây cũng là con đường từ reproducible development tới production systems chạy bền và an toàn.

---

## Liên hệ với các topic AI-Robotics khác

Phần MLOps này có giao nhau, nhưng không thay thế:

- **Machine Learning** và **Deep Learning** cho phần xây mô hình
- **AI Agents, RAG & Tool Use** cho thiết kế hành vi ứng dụng
- **Simulation, Sim2Real & Synthetic Data** cho evaluation loop trong embodied systems
- **Robot Systems, Safety & Deployment** cho các ràng buộc vận hành trên phần cứng thật

MLOps là lớp giữ cho hệ AI còn dùng được sau giai đoạn notebook.

---

## Câu hỏi Phỏng vấn

### 1) Vì sao nên tách MLOps thành nhiều mục nhỏ?

Vì data, governance, deployment, và monitoring đều là các mảng vận hành lớn với công cụ, rủi ro, và cách ra quyết định rất khác nhau.

### 2) Vì sao MLOps đặc biệt quan trọng với hệ AI hiện đại?

Vì hệ AI hiện đại phụ thuộc vào vòng lặp model iteration nhanh, evaluation tái lập được, rollout an toàn, và observability cho cả ML cổ điển lẫn ứng dụng LLM.

### 3) Vì sao MLOps còn khó hơn trong robotics?

Vì logs là đa cảm biến, failure ảnh hưởng tới thế giới vật lý, và evaluation thường cần synchronized replay, simulation, và safety gates thay vì chỉ vài API checks.
