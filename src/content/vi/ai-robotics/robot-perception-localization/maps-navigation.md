# Maps, Scene Representation & Navigation Perception

## Tổng quan

Navigation phụ thuộc vào một world representation dùng được, chứ không phải raw sensor output đơn thuần.

Mục này tập trung vào cách perception được chuyển thành các biểu diễn mà planner có thể tiêu thụ an toàn và hiệu quả.

---

## Các loại map phổ biến

Những representation quan trọng gồm:

- occupancy grids
- costmaps
- voxel maps
- point-cloud maps
- TSDF / ESDF
- semantic maps

Mỗi representation đánh đổi giữa:

- độ trung thực hình học
- bộ nhớ
- tốc độ cập nhật
- khả năng tương thích với planner
- độ khó khi debug

---

## Vì sao map đơn giản vẫn tồn tại bền bỉ

Production robots thường giữ representation đơn giản hơn vì chúng:

- dễ inspect
- dễ maintain
- dễ nối với planning logic
- dự đoán được hơn khi có lỗi

Map 3D giàu thông tin rất mạnh, nhưng độ tin cậy của cả hệ có thể giảm nếu representation quá khó giữ nhất quán.

---

## Navigation Perception Pipeline

Perception phục vụ navigation thường phải:

- xác định free space
- phát hiện static và dynamic obstacles
- cập nhật local và global costmaps
- theo dõi traversability
- xử lý freshness của map trong scene động

Planner chỉ hành xử tốt nếu các output perception này đủ ổn định để tránh oscillation và false obstacles.

---

## Môi trường động

Robot trong không gian thật phải suy nghĩ về:

- người đang di chuyển
- chướng ngại tạm thời
- occlusion một phần
- các vùng map đã cũ

Đó là lý do map maintenance quan trọng không kém initial map construction.

Navigation perception nên hỗ trợ:

- local reactivity
- global consistency
- xử lý obstacles theo uncertainty

---

## Câu hỏi Phỏng vấn

### 1) Vì sao costmaps hữu ích?

Vì chúng biến perception thành thông tin cost theo không gian mà planner dễ dùng hơn so với raw geometry đơn thuần.

### 2) Vì sao occupancy grids đơn giản vẫn phổ biến?

Vì chúng dễ hiểu, nhẹ, và thường đã đủ cho các hệ navigation đáng tin.

### 3) Traversability estimation là gì?

Đó là quá trình ước lượng xem terrain hoặc không gian có thể được robot đi qua an toàn hay không, chứ không chỉ là có vật thể hay không.

### 4) Vì sao map tốt hơn chưa chắc làm hệ tốt hơn?

Vì map giàu hơn làm tăng độ phức tạp, chi phí cập nhật, và độ khó debug nếu phần còn lại của stack không được thiết kế để tận dụng đúng cách.
