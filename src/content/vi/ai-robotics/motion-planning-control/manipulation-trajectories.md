# Manipulation Planning & Trajectory Generation

## Tổng quan

Manipulation planning thường khó hơn navigation thuần vì nó kết hợp:

- arm geometry
- collision reasoning
- object constraints
- execution nhạy với contact

---

## Các bài toán Manipulation Planning điển hình

Các tác vụ phổ biến:

- pick and place
- grasp sequencing
- insertion và alignment
- constrained motion trong clutter

Những tác vụ này phụ thuộc mạnh vào cả perception quality lẫn motion feasibility.

---

## Collision và Constraint Reasoning

Manipulation planning phải suy nghĩ về:

- self-collision
- environment collision
- end-effector orientation constraints
- object-relative motion constraints

Sai số planning nhỏ có thể biến thành task failure rất lớn khi tolerance chặt.

---

## Trajectory Generation

Trajectory generation biến motion đã plan thành time-parameterized commands.

Các concern quan trọng:

- giới hạn velocity và acceleration
- smoothness
- khả năng controller track được
- độ nhạy với execution drift

Hệ không chỉ cần tìm path, mà còn phải tìm path mà controller thật có thể thực thi đáng tin.

---

## Câu hỏi Phỏng vấn

### 1) Vì sao manipulation planning thường khó hơn navigation planning?

Vì nó đòi hỏi độ chính xác không gian cao hơn, ràng buộc chặt hơn, và nhạy với contact lẫn collision hơn.

### 2) Vì sao orientation constraints quan trọng trong manipulation?

Vì nhiều task không chỉ cần đến đúng vị trí mà còn phải đến với tool hoặc gripper orientation đúng về mặt vật lý.

### 3) Vì sao trajectory generation là bước riêng với path planning?

Vì path hình học vẫn cần quyết định timing và smoothness trước khi controller có thể thực thi an toàn.
