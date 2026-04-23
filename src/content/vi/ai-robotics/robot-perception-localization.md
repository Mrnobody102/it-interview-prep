# Robot Perception, Localization & SLAM

## Tổng quan

Robot perception rộng hơn nhiều so với camera models hay thư viện SLAM đơn lẻ.

Trong thực tế, chủ đề này dễ học hơn nếu chia thành bốn lớp kết nối với nhau:

1. sensors, calibration, và fusion
2. localization, state estimation, và SLAM
3. maps và world models phục vụ navigation
4. manipulation perception và semantic grounding

Đó là lý do chủ đề này được tách thành các mục con riêng.

---

## Vì sao nó quan trọng với Physical AI

Robot phải biến sensor streams nhiễu thành một niềm tin về thế giới đủ ổn định để hành động.

Điều đó có nghĩa perception phải chịu trách nhiệm cho:

- tính nhất quán không gian
- tính nhất quán theo thời gian
- confidence dưới uncertainty
- khả năng nối được với planner và controller
- degraded mode khi sensor lỗi hoặc drift

Đó là lý do perception cho robot là một bài toán hệ thống, không chỉ là bài toán model.

---

## Bản đồ các mục con

### 1. Sensors, Calibration & Sensor Fusion

Trọng tâm:

- RGB, depth, LiDAR, IMU, odometry, và force sensing
- điểm mạnh và failure modes của từng sensor
- timestamp alignment và extrinsic calibration
- vì sao multi-sensor fusion thường mạnh hơn một modality đơn lẻ

Dùng mục này khi thách thức chính là tạo đầu vào perception đáng tin.

### 2. Localization, State Estimation & SLAM

Trọng tâm:

- localization khác mapping và SLAM thế nào
- EKF, UKF, particle filters, và factor graphs
- visual, LiDAR, và visual-inertial odometry
- tradeoff giữa filtering, smoothing, và mapping pipelines

Dùng mục này khi hệ cần pose estimate ổn định trong thế giới thay đổi.

### 3. Maps, Scene Representation & Navigation Perception

Trọng tâm:

- occupancy grids, costmaps, voxel maps, và semantic maps
- xử lý dynamic obstacles
- world representation phục vụ navigation
- vì sao map đơn giản vẫn rất quan trọng trong production

Dùng mục này khi perception phải nuôi motion planning và traversability decisions.

### 4. Manipulation Perception & Semantic Grounding

Trọng tâm:

- hand-eye calibration và object pose estimation
- grasp affordances và contact-aware perception
- semantic grounding cho object-centric action
- foundation models giúp ở đâu và deterministic scaffolding vẫn cần ở đâu

Dùng mục này khi perception phải hỗ trợ tương tác chính xác, không chỉ navigation.

---

## Thứ tự học gợi ý

Một thứ tự thực dụng là:

1. sensors và fusion
2. localization và SLAM
3. maps và navigation perception
4. manipulation perception và semantic grounding

Thứ tự này thường phản ánh cách robot thật được xây và debug.

---

## Liên hệ với các topic AI-Robotics khác

Phần Robot Perception này có giao nhau, nhưng không thay thế:

- **Computer Vision** cho các phương pháp perception rộng hơn
- **Robotics Foundations & ROS 2** cho middleware, transforms, và hardware integration
- **Motion Planning, Manipulation & Control** cho phần action phía sau perception
- **Simulation, Sim2Real & Synthetic Data** cho evaluation và data generation

Perception là cầu nối từ sensing sang action, không phải toàn bộ robot stack.

---

## Câu hỏi Phỏng vấn

### 1) Vì sao nên tách Robot Perception thành nhiều mục nhỏ?

Vì sensing, state estimation, mapping, và manipulation perception là các concern kỹ thuật riêng với công cụ và failure patterns khác nhau.

### 2) Vì sao calibration luôn là điểm đau lặp đi lặp lại?

Vì robot hành động trong tọa độ vật lý thật, nên model tốt cũng vô dụng nếu sensor frames và timestamps bị sai.

### 3) Vì sao map đơn giản vẫn còn phổ biến trong production robots?

Vì chúng dễ debug, dễ maintain, và thường đã đủ cho navigation ổn định.
