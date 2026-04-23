# Simulation, Sim2Real & Synthetic Data

## Tổng quan

Simulation giờ là trụ cột của phát triển robotics chứ không còn chỉ là công cụ phụ trợ.

Nó được dùng cho:

- phát triển controller
- test navigation
- train policy
- debug perception
- kiểm tra safety
- sinh synthetic data

Tính đến tháng 4/2026, embodied AI nghiêm túc gần như luôn phụ thuộc vào một simulation stack.

---

## Vì sao simulation quan trọng

Simulation có giá trị vì robot thật:

- đắt
- reset chậm
- dễ hỏng
- nguy hiểm nếu chạy sai
- rất khó parallelize

Simulation cho phép scale mà hardware thật thường không làm được.

---

## Các mục đích chính của simulation

| Use case | Vì sao simulation hữu ích |
|---|---|
| **Algorithm prototyping** | iterate nhanh hơn hardware thật |
| **Regression testing** | kịch bản deterministic, replay được |
| **RL / policy learning** | rollout song song quy mô lớn |
| **Synthetic data** | dữ liệu có nhãn rẻ cho perception |
| **Safety checks** | test các failure case hiếm |

Mỗi team robotics sẽ quan tâm những hàng khác nhau, nhưng ai cũng hưởng lợi từ môi trường có thể replay.

---

## Physics và độ trung thực của thế giới

Không có simulator nào hoàn hảo.

Bạn luôn phải trade giữa:

- độ trung thực vật lý
- chất lượng render
- độ thực của sensor
- tốc độ
- mức dễ tích hợp

Các khái niệm quan trọng:

- contact realism
- actuator modeling
- friction và compliance
- sensor noise model
- timing fidelity

Nếu simulator nhanh nhưng sai đúng chỗ bạn cần quan tâm thì transfer sẽ hỏng.

Hệ sinh thái hiện tại thường phối hợp:

- **Isaac Lab / Isaac Sim** cho GPU simulation quy mô lớn và policy training
- **MuJoCo** cho thí nghiệm control và learning nhanh
- **Gazebo / Webots** cho tích hợp kiểu ROS và system prototyping

---

## Các chiến lược sim2real

Bộ công cụ cổ điển vẫn còn nguyên giá trị:

- system identification
- domain randomization
- curriculum learning
- privileged information trong giai đoạn train
- deploy thật với safety limit
- calibration liên tục sau khi transfer

Không có cái gọi là "bật công tắc sim2real". Transfer là kỷ luật của cả pipeline.

---

## Synthetic data

Synthetic data ngày càng quan trọng cho:

- segmentation
- detection
- pose estimation
- coverage các tình huống hiếm
- domain adaptation

Nó phát huy nhất khi:

- label ngoài đời đắt
- long-tail scene quan trọng
- có thể kiểm soát scene generation chặt chẽ

Nó phát huy kém nếu bỏ qua visual domain gap.

---

## Evaluation ladder

Một lộ trình đánh giá hợp lý:

1. unit tests
2. simulator scenario tests
3. batch offline evaluation
4. hardware-in-the-loop hoặc shadow evaluation
5. rollout thật có guard

Team mạnh không nhảy từ notebook sang full real-robot deployment ngay.

---

## Hệ sinh thái đang đi về đâu

Xu hướng 2025-2026 khá rõ:

- batched simulation lớn hơn để train policy
- tích hợp chặt hơn giữa sim và learning pipeline
- workflow synthetic data tốt hơn
- digital-twin-style operational testing phổ biến hơn
- hỗ trợ tốt hơn cho mobile manipulation và humanoid task

Simulation đang dần trở thành một phần của product lifecycle, không chỉ của research loop.

Một ví dụ cụ thể là **Isaac Lab 3.0**, nơi năm 2026 chuyển sang hướng multi-backend architecture và tiếp tục đẩy mạnh manager-based environment, batched simulation và tích hợp chặt hơn với learning pipeline.

---

## Câu hỏi Phỏng vấn

### 1. Vì sao sim2real vẫn khó dù physics engine đã tốt hơn?

Vì transfer không chỉ phụ thuộc rigid-body physics mà còn phụ thuộc sensing, actuation delay, contact detail, calibration và distribution shift ngoài đời thực.

### 2. Domain randomization dùng để làm gì?

Nó cố tình thay đổi điều kiện trong simulation để policy học được không overfit vào một thế giới ảo quá hẹp.

### 3. Vì sao synthetic data hữu ích cho robotics perception?

Vì nó tạo được dataset lớn có nhãn với chi phí thấp và phủ được nhiều tình huống hiếm hoặc khó thu thập ngoài đời.
