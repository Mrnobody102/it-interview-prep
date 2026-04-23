# Motion Planning, Manipulation & Control

## Tổng quan

Robot không chỉ cần nhìn thấy thế giới. Nó còn phải chọn được hành động khả thi dưới các ràng buộc:

- kinematic constraints
- dynamics
- va chạm
- cấu trúc môi trường
- timing và giới hạn an toàn

Đó là vùng của planning và control.

---

## Bắt đầu từ kinematics

Planning thường bắt đầu từ hình học:

- forward kinematics
- inverse kinematics
- workspace limits
- singularities
- joint constraints

Với manipulator, inverse kinematics thường là ràng buộc khó đầu tiên giữa "pose mong muốn" và "pose thực sự với tới được".

---

## Các lớp planning

Một mental model hữu ích là:

| Lớp | Mục tiêu |
|---|---|
| **Task planning** | quyết định làm gì |
| **Motion planning** | tìm chuyển động không va chạm |
| **Trajectory generation** | gán thời gian, vận tốc, gia tốc |
| **Control** | bám chuyển động trên robot thật |

Nhầm lẫn giữa các lớp này sẽ dẫn tới thiết kế hệ thống rất yếu.

---

## Mobile robot planning

Trong navigation, stack thường có:

- global planning trên map
- local planning / local control
- obstacle avoidance
- recovery behaviors
- behavior-tree hoặc orchestration ở mức task

Navigation tốt không chỉ là tìm đường ngắn nhất. Nó là hành vi ổn định dưới sensor nhiễu, obstacle động và localization không hoàn hảo.

Đó là lý do các stack hiện đại như **Nav2** nhấn mạnh behavior tree, tách planner/controller, costmap, recovery action và server có lifecycle rõ ràng.

---

## Manipulation planning

Manipulation planning thêm các vấn đề:

- collision checking trong không gian joint nhiều chiều
- reachability analysis
- grasp generation
- approach và retreat path
- orientation constraint và contact constraint

Đó là lý do MoveIt 2 và planning scene reasoning quan trọng trong stack robotics hiện đại.

Trong thực tế, **MoveIt 2** là framework manipulation quan trọng nhất cần nắm trong hệ ROS 2 vì nó gom planning pipeline, constraint, collision checking và trajectory generation vào một kiến trúc plugin còn được duy trì tốt.

---

## Các chiến lược control

Các họ controller quan trọng:

| Controller | Hợp với | Tradeoff |
|---|---|---|
| **PID** | setpoint control đơn giản | yếu với dynamics phức tạp |
| **Feedforward + PID** | tracking thực dụng | vẫn bị giới hạn bởi model |
| **MPC** | constrained optimization và preview | compute nặng hơn |
| **Impedance / admittance** | contact-rich interaction | khó tuning |
| **Whole-body control** | legged robot và humanoid | rất phức tạp hệ thống |

Trong nhiều robot thực tế, stack control là nhiều lớp. Planner mức cao không chạy cùng tần số với controller mức thấp.

---

## Tư duy real-time

Planning và control luôn bị giới hạn bởi:

- control loop frequency
- actuator bandwidth
- network delay
- compute jitter
- safety supervisor

Một planner rất đẹp nhưng trễ deadline có thể còn tệ hơn planner đơn giản nhưng ổn định và dễ dự đoán.

---

## Learned policy vs classical planning

Đến năm 2026, rất nhiều team kết hợp cả hai:

- classical planner để giữ constraint và safety envelope
- learned component cho perception, grasping hoặc skill prior
- model predictive hoặc reactive control ở bên dưới output của policy

Cách hybrid này thường mạnh hơn nhiều so với cố thay toàn bộ stack bằng một learned policy duy nhất.

Ý tưởng hybrid này cũng xuất hiện trong **MoveIt hybrid planning** và trong navigation stack kiểu kết hợp global planner với local controller phản ứng nhanh hoặc model-predictive.

---

## Nên học sâu cái gì

Nên ưu tiên:

1. frames và transforms
2. kinematics và Jacobian
3. collision checking và motion planning
4. trajectory generation
5. ý tưởng PID, MPC, impedance
6. cách controller map xuống hardware loop thật

Đây là kiến thức chuyển được giữa arm, mobile robot, legged robot và humanoid.

---

## Câu hỏi Phỏng vấn

### 1. Motion planning khác control như thế nào?

Motion planning quyết định path hoặc trajectory khả thi. Control làm cho robot thật bám theo trajectory đó dưới nhiễu và sai số vật lý.

### 2. Vì sao inverse kinematics không phải là planning?

Inverse kinematics chỉ tìm joint configuration cho một pose mục tiêu. Planning còn cần tránh va chạm, đảm bảo liên tục, constraint và tính khả thi theo thời gian.

### 3. Vì sao hybrid stack phổ biến trong robotics 2026?

Vì classical planning cho cấu trúc và safety, còn learned component tăng độ linh hoạt ở perception và skill generalization.
