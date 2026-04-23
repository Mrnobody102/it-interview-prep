# Kinematics, ros2_control & Integration

## Tổng quan

Cuối cùng thì robot software phải phát lệnh chuyển động thật.

Điều đó đòi hỏi nhiều hơn planning algorithms. Nó cần:

- kinematic models đúng
- control boundaries rõ
- hardware abstraction
- tích hợp đáng tin với phần còn lại của stack

---

## Các khái niệm Kinematics

Các khái niệm cốt lõi:

- forward kinematics
- inverse kinematics
- Jacobians
- singularities
- joint và workspace limits

Vì sao chúng quan trọng:

- manipulator cần end-effector motion khả thi
- mobile manipulator phải gánh cả base lẫn arm constraints
- legged systems phụ thuộc mạnh vào body và limb geometry

Ngay cả khi thư viện giải hộ phương trình, engineers vẫn phải hiểu failure modes.

---

## Dynamics và ranh giới Control

Các phân biệt quan trọng:

- kinematics mô tả quan hệ hình học của chuyển động
- dynamics thêm forces, torques, inertia, và acceleration
- low-level control giữ actuator ổn định
- higher-level planning tạo targets hoặc trajectories

Trộn lẫn các trách nhiệm này một cách cẩu thả dễ dẫn tới hành vi bất ổn.

---

## ros2_control

`ros2_control` quan trọng vì nó chuẩn hóa:

- hardware interfaces
- controller management
- command và state interfaces
- controller switching

Điều này cho phép team tích hợp planners và behaviors với hardware thật mà không phải viết lại mọi thứ cho từng robot.

Nó cũng làm rõ nơi:

- safety limits
- actuator state reporting
- quyền sở hữu control loop

nên được đặt.

---

## Tích hợp với Nav2, MoveIt, và Controllers

Hệ thật thường kết hợp:

- **Nav2** cho mobile navigation
- **MoveIt 2** cho manipulation planning
- robot-specific controllers cho execution

Một mindset tích hợp tốt luôn hỏi:

- ai sở hữu control loop?
- target đang được biểu diễn trong frame nào?
- giới hạn được enforce ở đâu?
- chuyện gì xảy ra khi execution lệch khỏi plan?

---

## Câu hỏi Phỏng vấn

### 1) Khác biệt giữa forward và inverse kinematics là gì?

Forward kinematics ánh xạ joint values sang pose, còn inverse kinematics giải bộ joint values để đạt một pose mong muốn.

### 2) Vì sao singularities quan trọng?

Vì gần cấu hình singular, những chuyển động Cartesian nhỏ có thể đòi hỏi joint motion rất lớn hoặc tạo ra nghiệm không ổn định.

### 3) Vì sao ros2_control hữu ích?

Vì nó cung cấp giao diện chuẩn giữa phần mềm robot cấp cao và hardware controllers, giảm gánh nặng tích hợp tùy biến.

### 4) Vì sao quyền sở hữu control phải rõ ràng?

Vì nhiều module cùng phát lệnh chồng chéo mà không có ranh giới sẽ dễ tạo ra hành vi robot bất ổn hoặc không an toàn.
