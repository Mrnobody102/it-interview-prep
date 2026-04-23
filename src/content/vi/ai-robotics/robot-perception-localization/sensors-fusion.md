# Sensors, Calibration & Sensor Fusion

## Tổng quan

Robot perception bắt đầu từ độ tin cậy của sensor.

Một hệ mạnh phải hiểu:

- từng sensor giỏi ở đâu
- từng sensor hỏng kiểu gì
- time và frame alignment ảnh hưởng dữ liệu ra sao
- cách fuse các tín hiệu bổ trợ nhau

---

## Các sensor modality phổ biến

| Sensor | Điểm mạnh | Điểm yếu |
|---|---|---|
| **RGB camera** | semantics, rẻ, texture phong phú | không có depth trực tiếp, nhạy ánh sáng |
| **RGB-D / stereo** | geometry cộng semantics | bề mặt phản xạ, giới hạn tầm |
| **LiDAR** | geometry chính xác, đo khoảng cách tốt | semantics yếu hơn, chi phí, sparsity tradeoffs |
| **IMU** | tín hiệu chuyển động nhanh | bias và drift |
| **Wheel odometry** | ước lượng chuyển động cục bộ rẻ | trượt bánh và lỗi tích lũy |
| **Force / tactile** | nhận biết contact | cục bộ và task-specific |

Không một modality đơn lẻ nào đủ cho đa số robot systems nghiêm túc.

---

## Time Alignment và Calibration

Hai nguồn lỗi lặp đi lặp lại là:

- extrinsic calibration sai
- timestamp discipline kém

Nếu từng sensor riêng lẻ tốt nhưng lệch nhau về không gian hoặc thời gian, fusion sẽ xuống cấp rất nhanh.

Các concern quan trọng:

- clocks được đồng bộ
- rolling-shutter effects
- sensor latency
- frame naming và ownership
- recalibration sau khi đổi hardware

---

## Các chiến lược Sensor Fusion

Những tổ hợp phổ biến:

- camera + IMU cho visual-inertial odometry
- LiDAR + IMU cho localization vững hơn
- wheel odometry + IMU + map matching cho mobile robots
- vision + depth + force cho manipulation

Fusion hữu ích vì sensor này có thể ổn định sensor kia:

- IMU giúp lúc chuyển động nhanh
- LiDAR giúp geometry khi texture yếu
- vision giúp semantics
- force giúp hiểu contact

---

## Failure Modes

Sensor fusion vẫn có thể fail vì:

- noise assumptions sai
- latency không được mô hình hóa
- drift ở extrinsics
- dropped messages
- frame tree không nhất quán

Một fusion stack tốt phải đủ observable để engineer biết lỗi nằm ở sensor, timing, hay estimator.

---

## Câu hỏi Phỏng vấn

### 1) Vì sao multimodal fusion phổ biến trong robotics?

Vì các sensor bổ trợ cho nhau và không có modality đơn nào đủ robust trước mọi môi trường và failure conditions.

### 2) Vì sao timestamps quan trọng?

Vì estimation của robot phụ thuộc vào thứ tự và alignment theo thời gian, và chỉ một sai lệch nhỏ về timing cũng có thể gây bất nhất không gian lớn.

### 3) Extrinsic calibration là gì?

Nó xác định relative pose giữa các sensors hoặc giữa sensor và robot frame.

### 4) Vì sao fusion bugs thường bị nhầm là AI bugs?

Vì model hoặc planner phía sau chỉ nhìn thấy input bất nhất, nên lỗi trông như nằm ở tầng cao hơn nguyên nhân thật.
