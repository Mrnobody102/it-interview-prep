# Robot Learning & Embodied AI

## Tổng quan

Robot learning rộng hơn nhiều so với reinforcement learning hoặc các demo policy bắt mắt.

Trong thực tế, không gian này dễ hiểu hơn khi chia thành bốn lớp:

1. robot learning paradigms và policy learning
2. policy representations, skills, và action spaces
3. VLA models, world models, và embodied foundation models
4. data scaling, evaluation, và real-world constraints

Đó là lý do chủ đề này được tách thành các mục con riêng.

---

## Vì sao nó quan trọng

Embodied AI cố nối:

- perception
- memory
- task understanding
- planning
- action

Nhưng nút thắt thật sự hiếm khi chỉ là model size. Thường đó là data quality, evaluation design, và khoảng cách giữa demo với deployment thật.

---

## Bản đồ các mục con

### 1. Robot Learning Paradigms & Policy Learning

Trọng tâm:

- imitation learning, reinforcement learning, và offline RL
- các nguyên lý tối ưu policy
- mỗi paradigm hợp ở đâu trong robotics
- vì sao sample efficiency là nút thắt lớn

### 2. Policy Representations, Skills & Action Spaces

Trọng tâm:

- low-level vs high-level policies
- action parameterization và skill abstraction
- hierarchical policies và options
- tradeoff giữa expressiveness và controllability

### 3. VLA Models, World Models & Embodied FMs

Trọng tâm:

- vision-language-action models
- action-token prediction và chunking
- world models và latent planning
- điều gì đã thay đổi trong 2025-2026 với embodied systems

### 4. Data Scaling, Evaluation & Real-World Constraints

Trọng tâm:

- demonstration quality và coverage
- recovery data và failure mining
- offline vs online evaluation
- vì sao robot thật vẫn khó hơn benchmark videos rất nhiều

---

## Thứ tự học gợi ý

Một thứ tự thực dụng là:

1. learning paradigms
2. policy representation và skills
3. VLA và world-model families
4. data scaling và evaluation

Thứ tự này giúp tách rõ ý tưởng về learning, cấu trúc action, xu hướng foundation models, và thực tế deployment.

---

## Liên hệ với các topic AI-Robotics khác

Phần này có giao nhau, nhưng không thay thế:

- **Deep Learning** cho nền tảng xây model
- **Motion Planning, Manipulation & Control** cho action generation theo hướng cổ điển
- **Simulation, Sim2Real & Synthetic Data** cho tạo dữ liệu và thử nghiệm an toàn
- **Robot Systems, Safety & Deployment** cho những gì xảy ra khi learned policies gặp hardware thật

Robot learning là một con đường tạo hành vi, không phải con đường duy nhất.

---

## Câu hỏi Phỏng vấn

### 1) Vì sao nên tách Robot Learning thành nhiều mục nhỏ?

Vì learning paradigms, policy design, embodied foundation models, và kỷ luật evaluation là các câu hỏi kỹ thuật khác nhau.

### 2) Vì sao data thường là bottleneck lớn hơn model design?

Vì robot learning cần dữ liệu đa dạng, đồng bộ, giàu failure cases, rất đắt để thu thập và khó gán nhãn tốt.

### 3) Vì sao classical robotics methods vẫn quan trọng trong embodied AI?

Vì learned policies thường vẫn cần guardrails, controllers, planners, và geometric constraints bao quanh.
