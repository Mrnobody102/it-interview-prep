# Localization, State Estimation & SLAM

## Tổng quan

Robot cần một ước lượng ổn định về vị trí của chính nó và cách ước lượng đó tiến triển theo thời gian.

Mục này bao phủ lớp estimation cốt lõi nằm sau:

- odometry
- localization
- mapping
- SLAM

---

## Localization khác Mapping và SLAM thế nào

Các phân biệt quan trọng:

- **odometry** ước lượng chuyển động tương đối và tích lũy drift
- **localization** ước lượng pose trong một map đã biết
- **mapping** xây biểu diễn của thế giới
- **SLAM** giải localization và mapping đồng thời

Các thuật ngữ này rất hay bị dùng lẫn, nhưng chúng kéo theo giả định hệ thống khác nhau.

---

## Các phương pháp Estimation

Các cách tiếp cận phổ biến:

- Extended Kalman Filter
- Unscented Kalman Filter
- particle filters
- factor graphs
- smoothing-based optimization

Lựa chọn đúng phụ thuộc vào:

- độ phi tuyến
- modality của sensor
- compute budget
- ràng buộc real-time
- khả năng chấp nhận tối ưu trễ

---

## Các family SLAM trong thực tế

Những family điển hình:

- visual SLAM
- LiDAR SLAM
- visual-inertial odometry
- LiDAR-inertial odometry

Các ý chính:

- loop closure giúp giảm drift dài hạn
- pose graph optimization cải thiện global consistency
- front-end robust quan trọng không kém back-end optimization

---

## Các concern khi deploy

Localization stack thật sẽ fail khi:

- ánh sáng thay đổi làm hỏng features
- hình học quá lặp lại
- vật thể động chiếm ưu thế
- map bị stale
- calibration hoặc timing xuống cấp

Vì thế localization systems cần:

- confidence measures
- hành vi relocalization
- chiến lược update map
- fallback modes khi độ chắc của pose tụt

---

## Câu hỏi Phỏng vấn

### 1) Khác biệt giữa odometry và localization là gì?

Odometry theo dõi chuyển động tương đối nên drift theo thời gian, còn localization ước lượng pose tương đối với map hoặc world frame đã biết.

### 2) Vì sao factor graphs phổ biến trong SLAM?

Vì chúng mô hình hóa các ràng buộc giữa nhiều poses và measurements một cách sạch sẽ, giúp tối ưu linh hoạt trên cả trajectory hoặc map.

### 3) Vì sao loop closure quan trọng?

Vì nó cho hệ nhận ra nơi đã từng đi qua và sửa drift tích lũy.

### 4) Vì sao một thuật toán SLAM mạnh vẫn có thể fail ở production?

Vì deployment thật phụ thuộc vào điều kiện sensing, calibration, chất lượng map, và độ robust runtime chứ không chỉ ở vẻ đẹp thuật toán.
