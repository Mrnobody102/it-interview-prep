# Mobile Navigation & Trajectory Planning

## Tổng quan

Navigation planning hỏi cách robot nên di chuyển trong không gian trong khi vẫn tôn trọng hình học, dynamics, và uncertainty.

Điều này thường cần cả:

- global planning trên map
- local planning dưới điều kiện thay đổi

---

## Global khác Local Planning thế nào

Global planners:

- suy nghĩ trên map rộng hơn
- tạo cấu trúc route ở mức cao
- thường dùng graph search như A* hoặc các biến thể liên quan

Local planners:

- phản ứng với vật cản gần
- làm mượt hoặc chỉnh trajectories
- xử lý tình huống động

Navigation stack mạnh thường kết hợp cả hai.

---

## Dynamic Obstacles và Replanning

Navigation thật phải xử lý:

- người đang di chuyển
- occlusion
- giả định map đã cũ
- lối hẹp và deadlock

Đó là lý do replanning và local robustness quan trọng hơn logic shortest path tĩnh đơn thuần.

---

## Chất lượng Trajectory

Trajectory dùng được phải:

- collision free
- đủ mượt để track
- hợp lý về dynamics
- ổn định dưới perception noise

Planner rung giật quá mức có thể gây oscillation và hành vi không an toàn dù từng bước đều "hợp lệ".

---

## Câu hỏi Phỏng vấn

### 1) Vì sao cần cả global và local planners?

Vì global planning cho cấu trúc route, còn local planning phản ứng với vật cản gần và thay đổi runtime.

### 2) Vì sao shortest path chưa chắc là best path?

Vì nó có thể bỏ qua smoothness, dynamics, safety margins, và uncertainty khi execution.

### 3) Vì sao replanning quan trọng?

Vì môi trường thật luôn thay đổi, và một path vừa hợp lệ cách đây một lúc có thể không còn an toàn nữa.
