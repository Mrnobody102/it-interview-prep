# Simulation, Sim2Real & Synthetic Data

## Tổng quan

Simulation giờ không còn chỉ là công cụ tiện lợi cho robotics.

Trong thực tế, chủ đề này tách thành bốn mảng kết nối:

1. simulation foundations và physics fidelity
2. domain randomization và chuyển giao Sim2Real
3. synthetic data generation và scenario design
4. evaluation ladders, replay, và benchmarking

Đó là lý do chủ đề này được tách thành các mục con riêng.

---

## Vì sao nó quan trọng

Simulation hỗ trợ robotics team bằng cách làm rẻ hơn:

- prototype behaviors
- test các rare failures
- train policies an toàn hơn
- tạo perception data
- so sánh các version hệ trước khi rollout lên hardware

Nhưng simulation chỉ hữu ích nếu bạn hiểu lúc nào fidelity quan trọng và lúc nào không.

---

## Bản đồ các mục con

### 1. Simulation Foundations & Physics Fidelity

Trọng tâm:

- simulation tốt cho việc gì
- physics engines và contact realism
- tradeoff khi mô hình hóa thế giới
- khi nào high fidelity đáng giá và khi nào chỉ tốn chi phí

### 2. Domain Randomization & Sim2Real Strategies

Trọng tâm:

- randomization của texture, lighting, và dynamics
- system identification và adaptation
- policy transfer dưới model mismatch
- giảm overfitting vào simulator

### 3. Synthetic Data, Rendering & Scenario Generation

Trọng tâm:

- synthetic perception datasets
- độ đa dạng của scenario và labeling
- rendering pipelines và domain coverage
- synthetic data giúp mạnh nhất ở đâu trong AI systems

### 4. Evaluation Ladders, Replay & Benchmarking

Trọng tâm:

- staged evaluation trước khi deploy thật
- log replay và regression testing
- benchmark design và scenario suites
- cách nối simulator với bằng chứng từ thế giới thật

---

## Thứ tự học gợi ý

Một thứ tự thực dụng là:

1. simulation foundations
2. sim2real strategies
3. synthetic data generation
4. evaluation ladders và replay

Thứ tự này giúp bạn nhìn simulation như một phần của systems engineering thay vì một tool đứng riêng.

---

## Liên hệ với các topic AI-Robotics khác

Phần này có giao nhau, nhưng không thay thế:

- **Robot Learning & Embodied AI** cho train learned policies
- **Computer Vision** cho synthetic perception data
- **Robot Systems, Safety & Deployment** cho kỷ luật rollout
- **MLOps & AI Production** cho reproducibility và evaluation pipelines

Simulation chỉ là force multiplier khi nó được nối chặt với bằng chứng deployment thật.

---

## Câu hỏi Phỏng vấn

### 1) Vì sao nên tách simulation và sim2real thành nhiều mục nhỏ?

Vì simulator fidelity, transfer strategy, synthetic data, và evaluation là các concern kỹ thuật riêng dù có liên quan chặt chẽ.

### 2) Vì sao high-fidelity simulation không phải lúc nào cũng là đáp án?

Vì nó đắt, chậm iterate, và đôi khi kém hữu ích hơn randomization có mục tiêu khi mục tiêu sau cùng là transfer robust.

### 3) Vì sao replay quan trọng trước deployment?

Vì nó cho team so sánh thay đổi của hệ trên các scenario thực tế mà chưa phải đánh đổi bằng failure mới trên hardware.
