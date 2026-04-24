# Motion Planning, Manipulation & Control

## Tổng quan

Robot motion quá rộng để gói trong một trang duy nhất.

Trong thực tế, chủ đề này tách thành bốn lớp kết nối:

1. kinematics, feasibility, và planning hierarchy
2. mobile navigation và trajectory planning
3. manipulation planning và contact-aware trajectories
4. control, real-time execution, và tracking

Đó là lý do chủ đề này được tách thành các mục con rõ ràng.

---

## Vì sao nó quan trọng

Robot không chỉ cần một đường đi đẹp trên giấy. Nó cần chuyển động:

- khả thi
- ổn định
- an toàn
- nhất quán theo thời gian
- chịu được sai số khi execution

Đó là lý do planning và control nên được học cùng nhau thay vì tách rời như hai chương độc lập.

---

## Bản đồ các mục con

### 1. Kinematics, Feasibility & Planning Layers

Trọng tâm:

- ràng buộc kinematic và reachability
- planning hierarchy từ task tới trajectory
- kiểm tra feasibility trước tối ưu
- planners suy nghĩ trên state và action spaces ra sao

### 2. Mobile Navigation & Trajectory Planning

Trọng tâm:

- global và local planning
- graph search và trajectory smoothing
- dynamic obstacles và replanning
- navigation stacks dưới uncertainty

### 3. Manipulation Planning & Trajectory Generation

Trọng tâm:

- grasp sequencing và pick-place logic
- collision-aware planning
- motion constraints cho arms và end effectors
- contact-rich tasks và độ nhạy khi execution

### 4. Control, Real-Time Systems & Execution

Trọng tâm:

- PID, MPC, tracking control, và execution loops
- latency, update frequency, và stability
- execution monitoring và recovery
- planned motion biến thành actuator behavior thật ra sao

---

## Thứ tự học gợi ý

Một thứ tự thực dụng là:

1. kinematics và planning hierarchy
2. mobile navigation
3. manipulation planning
4. control và execution

Thứ tự này thường cho trực giác hệ thống tốt hơn là lao thẳng vào controller nâng cao.

---

## Liên hệ với các topic AI-Robotics khác

Phần này có giao nhau, nhưng không thay thế:

- **Robotics Foundations & ROS 2** cho middleware và hardware integration
- **Robot Perception** cho world state mà planning phụ thuộc vào
- **Robot Learning & Embodied AI** cho learned policy alternatives
- **Robot Systems, Safety & Deployment** cho runtime constraints và supervision

Motion planning là cây cầu từ perceived world state sang robot action có thể thực thi.

---

## Câu hỏi Phỏng vấn

### 1) Vì sao nên tách motion planning và control thành nhiều mục nhỏ?

Vì feasibility reasoning, navigation, manipulation, và closed-loop execution là các miền kỹ thuật liên quan nhưng khác nhau.

### 2) Vì sao planning một mình là chưa đủ?

Vì path được planner sinh ra chỉ có ích nếu robot track được nó một cách robust dưới ràng buộc timing, sensing, và actuator thật.

### 3) Vì sao manipulation và mobile navigation thường được tách riêng?

Vì chúng có hình học, ràng buộc, contact patterns, và execution risks khác nhau dù cùng là bài toán motion.
