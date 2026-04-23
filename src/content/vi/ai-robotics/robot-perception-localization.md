# Robot Perception, Localization & SLAM

## Tổng quan

Perception trong robotics không chỉ là computer vision chạy trên robot. Đó là toàn bộ bài toán biến các luồng sensor nhiễu, có delay thành ước lượng ổn định về:

- robot đang ở đâu
- môi trường trông như thế nào
- có object và obstacle gì
- cái gì có thể tác động vào một cách an toàn

Chủ đề này nằm giữa sensing thô và planning.

---

## Các loại sensor

Các sensor phổ biến:

| Sensor | Điểm mạnh | Điểm yếu |
|---|---|---|
| **RGB camera** | semantics, rẻ, giàu texture | nhạy sáng, không có depth trực tiếp |
| **Stereo / RGB-D** | có geometry lẫn semantics | tầm hoạt động hạn chế, kém với bề mặt phản chiếu |
| **LiDAR** | khoảng cách chính xác, hình học mạnh | semantics kém hơn, chi phí cao |
| **IMU** | motion estimate nhanh | drift theo thời gian |
| **Wheel odometry** | rẻ, có tín hiệu chuyển động local | trượt bánh và drift tích lũy |
| **Force/torque** | hiểu contact | cục bộ, phụ thuộc task |

Perception tốt thường là multimodal chứ không dựa vào một sensor.

---

## Sensor fusion

Fusion quan trọng vì từng sensor riêng lẻ đều có giới hạn.

Các tổ hợp hay gặp:

- camera + IMU cho visual-inertial odometry
- LiDAR + IMU cho localization ổn định
- wheel odometry + IMU + map matching cho mobile robot
- camera + depth + force sensing cho manipulation

Các vấn đề cốt lõi:

- calibration
- timestamp alignment
- frame consistency
- latency compensation
- xử lý outlier

Rất nhiều bug nhìn như "AI kém" thực ra là bug của calibration hoặc fusion.

---

## Localization vs Mapping vs SLAM

Ba khái niệm liên quan nhưng khác nhau:

| Bài toán | Ý nghĩa |
|---|---|
| **Localization** | ước lượng pose trong map đã biết |
| **Mapping** | xây dựng map môi trường |
| **SLAM** | vừa localize vừa build map cùng lúc |

Trong thực tế:

- kiểu AMCL rất hay dùng khi indoor map đã biết
- visual SLAM và LiDAR SLAM hợp khi map chưa có hoặc thay đổi
- factor-graph method xuất hiện nhiều trong pipeline độ chính xác cao

---

## State estimation

State estimation là lớp nền dưới localization và control.

Các khái niệm quan trọng:

- Extended Kalman Filter (EKF)
- Unscented Kalman Filter (UKF)
- particle filters
- factor graphs
- smoothing vs filtering

Chọn gì phụ thuộc vào:

- độ phi tuyến của hệ
- chất lượng sensor
- budget compute
- ràng buộc real-time

---

## Map và scene representation

Robot có thể reason trên nhiều dạng world model:

- occupancy grid
- costmap
- point cloud
- voxel map
- TSDF / ESDF
- semantic map
- object-centric scene graph

Năm 2026, các biểu diễn 3D phong phú hơn đã phổ biến hơn, nhưng map đơn giản vẫn thống trị ở hệ navigation deploy thực tế vì chúng dễ debug và dễ bảo trì hơn.

---

## Navigation perception

Với mobile robot, perception phải cấp dữ liệu sạch cho navigation:

- phát hiện obstacle tĩnh
- nhận biết obstacle động
- duy trì local và global costmap
- phân biệt vùng đi được và không đi được
- update map mà không làm planner bất ổn

Đó là lý do perception và navigation nên được thiết kế cùng nhau, không nên tách hoàn toàn.

---

## Manipulation perception

Manipulation nhấn mạnh các bài toán khác:

- hand-eye calibration
- object detection và tracking
- pose estimation
- grasp affordance estimation
- contact và force feedback

Mobile robot thường chịu được một chút lỗi localization. Nhưng arm robot đang gắp, cắm, lắp hoặc align vật thể thì thường không chịu được.

---

## Foundation model giúp ở đâu

Perception stack hiện đại ngày càng dùng:

- vision-language model cho scene understanding
- foundation model cho segmentation và grounding
- learned 3D representation cho pose hoặc affordance prediction

Nhưng câu hỏi deploy vẫn rất thực tế:

- latency
- độ bền dưới thay đổi ánh sáng và clutter
- calibration drift
- fallback behavior

Learned perception cho nhiều sức mạnh hơn, nhưng robot deploy vẫn cần lớp deterministic bọc bên ngoài.

---

## Câu hỏi Phỏng vấn

### 1. Odometry khác localization như thế nào?

Odometry ước lượng chuyển động theo kiểu incremental và tích lũy drift. Localization ước lượng pose so với world hoặc map đã biết.

### 2. Vì sao calibration quan trọng trong robotics perception?

Vì robot hành động trong không gian vật lý. Detector mạnh vẫn vô dụng nếu output của nó lệch so với frame thật của robot.

### 3. Vì sao nhiều robot production vẫn dùng map đơn giản?

Vì biểu diễn đơn giản dễ debug hơn, rẻ hơn khi vận hành và thường đã đủ cho độ tin cậy cần thiết.
