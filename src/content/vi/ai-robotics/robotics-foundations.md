# Robotics Foundations & ROS 2

## Tổng quan

Robotics hiện đại vẫn được xây trên các nền móng hệ thống cổ điển.

Trong thực tế, cụm kiến thức này tách tự nhiên thành bốn lớp:

1. kiến trúc robot stack và ranh giới middleware
2. ROS 2 communication, QoS, và lifecycle behavior
3. frames, robot description, và calibration
4. kinematics, control interfaces, và system integration

Đó là lý do chủ đề này được tách thành các mục con thay vì giữ trong một trang nén.

---

## Vì sao phần này quan trọng trước cả Embodied AI

Robot foundation models và learned policies không loại bỏ nhu cầu hiểu:

- distributed software architecture
- timing và message semantics
- transform correctness
- ranh giới giữa software và hardware control
- recovery và orchestration

Thiếu các lớp này, ngay cả perception hay policy model mạnh cũng khó tin cậy và khó debug.

---

## Bản đồ các mục con

### 1. Robot Stack Architecture & Middleware

Trọng tâm:

- các lớp của phần mềm robotics hiện đại
- middleware đứng ở đâu trong stack
- sensing, planning, control, và safety nối với nhau thế nào
- vì sao orchestration quan trọng hơn một monolith khổng lồ

Dùng mục này khi bạn muốn một mental model ở cấp hệ thống cho robot software.

### 2. ROS 2 Communication, QoS & Lifecycle

Trọng tâm:

- nodes, topics, services, và actions
- QoS policies và hành vi khi có lỗi
- lifecycle nodes và launch orchestration
- hình dạng thực tế của distributed robot software

Dùng mục này khi câu hỏi chính là ROS 2 chạy ra sao dưới điều kiện runtime thật.

### 3. TF2, URDF, Frames & Calibration

Trọng tâm:

- robot description và frame trees
- intrinsics, extrinsics, và calibration drift
- TF2 correctness và cách debug
- vì sao lỗi frame lan sang hầu hết tầng phía trên

Dùng mục này khi perception và motion phải khớp với hình học thật.

### 4. Kinematics, ros2_control & Integration

Trọng tâm:

- forward và inverse kinematics
- Jacobians, singularities, và limits
- ros2_control và hardware abstraction
- tích hợp với navigation, manipulation, và controllers

Dùng mục này khi software phải thực sự làm robot di chuyển an toàn và có thể dự đoán được.

---

## Thứ tự học gợi ý

Một lộ trình thực dụng là:

1. robot stack và middleware basics
2. ROS 2 communication và QoS
3. frames, URDF, và calibration
4. kinematics và control integration

Thứ tự này thường xây trực giác tốt hơn nhiều so với bắt đầu từ các lệnh ROS rời rạc.

---

## Liên hệ với các topic AI-Robotics khác

Phần Robotics Foundations này có giao nhau, nhưng không thay thế:

- **Robot Perception, Localization & SLAM** cho state estimation và mapping
- **Motion Planning, Manipulation & Control** cho planning và control sâu hơn
- **Robot Systems, Safety & Deployment** cho vận hành trên phần cứng thật
- **Robot Learning & Embodied AI** cho các learned policies chạy phía trên lớp nền này

Robotics foundations là lớp substrate vận hành nằm dưới phần còn lại của stack.

---

## Câu hỏi Phỏng vấn

### 1) Vì sao nên tách Robotics Foundations thành nhiều mục nhỏ?

Vì architecture, hành vi runtime của ROS 2, transforms, và control integration là các miền liên quan nhưng khác nhau, với failure modes riêng.

### 2) Vì sao ROS 2 vẫn còn đáng học trong 2026?

Vì nhiều robot thực tế vẫn dùng ROS 2 làm lớp tích hợp giữa perception, planning, control, và tooling.

### 3) Vì sao robotics team vẫn tốn rất nhiều thời gian cho transforms và calibration?

Vì sai lệch không gian sẽ phá hỏng gần như mọi năng lực phía trên, từ localization tới grasping và safe motion execution.
