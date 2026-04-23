# TF2, URDF, Frames & Calibration

## Tổng quan

Robot chỉ có thể hành động tốt nếu nó có mô hình không gian nhất quán về chính nó và thế giới xung quanh.

Điều này đòi hỏi ba thứ phải chạy ăn khớp:

- robot description
- frame transforms
- calibration

Nếu một trong ba sai, trí tuệ ở tầng trên sẽ trở nên sai hướng.

---

## URDF và Xacro

URDF mô tả:

- links
- joints
- inertial properties
- visual và collision geometry
- cấu trúc gắn sensor

Xacro thường được dùng để giữ robot description có tính mô-đun và tham số hóa.

Robot description tốt quan trọng vì nó nuôi:

- simulation
- visualization
- kinematics libraries
- planning scenes

---

## TF2 và Frame Trees

TF2 biểu diễn đồ thị transform giữa các coordinate frames.

Các frame điển hình:

- `base_link`
- `odom`
- `map`
- camera frames
- end-effector frames

Các thuộc tính quan trọng:

- cây phải nhất quán về logic
- timestamps phải hợp lý
- frame naming phải có kỷ luật

Nhiều perception bugs thực chất là TF bugs đội lốt một tên khác.

---

## Calibration

Calibration gồm:

- camera intrinsics
- camera extrinsics
- hand-eye calibration
- LiDAR-camera alignment
- IMU alignment và biases

Calibration drift quan trọng vì:

- localization xuống chất lượng
- object pose estimates trở nên không đáng tin
- planner có thể bắn vào điểm không gian sai

Calibration không phải nghi thức làm một lần rồi xong. Nó là một phần của health lâu dài của hệ.

---

## Debug các vấn đề không gian

Các thói quen debug hữu ích:

- inspect frame tree bằng trực quan
- replay logs và kiểm tra timestamps
- so vị trí object dự đoán với đo đạc vật lý
- cô lập xem lỗi đến từ detection, TF, hay calibration

Spatial debugging thường cần bóc vấn đề từng ranh giới transform một.

---

## Câu hỏi Phỏng vấn

### 1) Vì sao TF2 quan trọng đến vậy trong robotics?

Vì nó định nghĩa các quan hệ không gian mà perception, localization, planning, và control đều dựa vào.

### 2) Khác biệt giữa intrinsics và extrinsics là gì?

Intrinsics mô tả mô hình chiếu bên trong của sensor, còn extrinsics mô tả vị trí và hướng của sensor so với các frame khác.

### 3) Vì sao calibration errors có thể trông như model errors?

Vì model có thể đúng về mặt semantics nhưng bị ánh xạ sang vị trí vật lý sai.

### 4) Vì sao nên theo dõi calibration theo thời gian?

Vì mount có thể lệch, phần cứng lão hóa, và tác động môi trường có thể làm các tham số không gian từng tốt trở nên không còn đúng.
