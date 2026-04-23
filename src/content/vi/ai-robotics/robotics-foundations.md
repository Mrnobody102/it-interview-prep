# Robotics Foundations & ROS 2

## Tổng quan

Stack robotics hiện đại dù có thêm rất nhiều AI vẫn đứng trên các nền tảng cổ điển:

- frame và transform
- kinematics và dynamics
- state estimation
- planning và control
- hardware interface
- middleware đáng tin cậy

Tính đến tháng 4/2026, muốn học AI-robotics nghiêm túc thì vẫn nên nắm các lớp này trước khi lao thẳng vào robot foundation model hay embodied agent.

---

## Stack robotics hiện đại

Có thể nhìn một robot stack theo các lớp:

1. Sensor và actuator
2. Real-time control và hardware interface
3. Middleware và messaging
4. Robot description và transforms
5. Perception và state estimation
6. Planning và behavior orchestration
7. Learned policy hoặc foundation model
8. Safety, supervision và deployment

Càng thêm learned component thì hệ thống càng khó, chứ không hề đơn giản hơn.

---

## Vì sao ROS 2 vẫn quan trọng

ROS 2 vẫn là lớp tích hợp mặc định cho rất nhiều hệ robotics:

- giao tiếp pub/sub
- services và actions
- lifecycle-managed nodes
- launch orchestration
- tầng transport dựa trên DDS
- tích hợp mạnh với navigation, manipulation và control

Điểm quan trọng trong phỏng vấn hay dự án thực tế không phải là nhớ command ROS 2, mà là hiểu kiến trúc phần mềm phân tán cho robot.

Đến tháng 4/2026, có thể hình dung khá thực dụng như sau:

- **Kilted Kaiju** là bản ROS 2 phát hành mới nhất
- **Jazzy Jalisco** là target rất quan trọng cho production dài hạn
- **Lyrical Luth** là nhánh release/development kế tiếp đang tiến tới mốc tháng 5/2026

### Nên nắm những gì

- nodes, topics, services, actions
- QoS settings
- TF2 transform tree
- launch files
- parameters và lifecycle nodes
- rosbag để record và replay

---

## QoS không phải kiến thức phụ

Quality of Service ảnh hưởng trực tiếp tới việc hệ robot có hoạt động đúng với mạng, sensor và timing thực tế hay không.

Các chiều quan trọng:

- reliability
- durability
- history depth
- deadline
- liveliness

Nếu xem QoS là chi tiết nhỏ, perception pipeline và control pipeline phân tán sẽ rất dễ gãy.

---

## TF, URDF và robot description

Ba ý tưởng xuất hiện gần như mọi nơi:

- **URDF / Xacro** mô tả links, joints, sensors và geometry
- **TF2** theo dõi transform giữa các coordinate frames
- **Calibration** giúp các frame đó đúng trong đời thực

Nếu transform sai thì gần như mọi thứ phía trên đều sai:

- localization lệch
- perception bị misaligned
- grasp target sai
- planner va chạm bất ngờ

---

## ros2_control và hardware interfaces

Trong robotics nghiêm túc, cần ranh giới rõ giữa phần mềm mức cao và lớp điều khiển phần cứng.

`ros2_control` quan trọng vì nó chuẩn hóa:

- hardware interfaces
- controller manager
- command/state interfaces
- controller switching

Nhờ đó planner và behavior có thể nối xuống actuator thật mà không phải viết lại toàn bộ control layer cho từng robot.

Trong một stack ROS 2 hiện đại, các mảnh ghép thường khớp với nhau như sau:

- **ros2_control** cho hardware abstraction và control loop
- **Nav2** cho navigation behavior, costmap, planner và recovery
- **MoveIt 2** cho manipulation, planning scene, kinematics và motion planning

---

## Kinematics và dynamics

Không cần ngày nào cũng suy lại công thức, nhưng phải hiểu các khái niệm:

- forward kinematics
- inverse kinematics
- Jacobian
- singularity
- joint limits
- rigid-body dynamics
- torque, force và acceleration constraints

Những khái niệm này đi thẳng vào bài toán:

- arm manipulator
- mobile manipulator
- legged robot
- humanoid

---

## Behavior orchestration

Robot hiếm khi chạy như một model duy nhất.

Hệ thống thật thường phối hợp:

- perception nodes
- navigation hoặc manipulation servers
- behavior trees hoặc task graphs
- recovery actions
- đường override cho operator

Đó là lý do orchestration tường minh vẫn rất quan trọng kể cả trong thời đại foundation model.

---

## Nên học theo thứ tự nào

Nếu mới vào AI-robotics, thứ tự học hợp lý là:

1. Linux, Python/C++, Git, debugging
2. ROS 2 cơ bản
3. Frames, URDF, TF2, sensor pipeline
4. State estimation và localization
5. Planning và control
6. Simulation
7. Robot learning và embodied AI

Bỏ qua các lớp ở giữa thường dẫn tới hiểu biết rất nông về sau.

---

## Câu hỏi Phỏng vấn

### 1. Vì sao ROS 2 hữu ích hơn việc tự viết robot software từ đầu?

Vì nó cung cấp communication, tooling, lifecycle management và integration pattern dùng lại được, giúp tiết kiệm rất nhiều thời gian kỹ thuật.

### 2. Vì sao TF2 thường là nguồn bug rất hay gặp?

Vì transform tree chính là "sự thật hình học" của robot. Sai frame nhỏ có thể lan ra perception, navigation và manipulation.

### 3. Trước khi học robot foundation model thì nên nắm gì?

Nên nắm sensing, transforms, control boundary và cách phần mềm robot vận hành dưới timing cùng hardware constraint thật.
