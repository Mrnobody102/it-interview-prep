# Policy Representations, Skills & Action Spaces

## Tổng quan

Cách policy biểu diễn action ảnh hưởng rất mạnh tới thứ nó có thể học và mức độ an toàn khi dùng.

Mục này tập trung vào:

- action parameterization
- skill abstractions
- hierarchical policies
- tradeoff về controllability

---

## Low-Level khác High-Level Policies thế nào

Low-level policies xuất ra:

- torques
- velocities
- joint commands

High-level policies xuất ra:

- waypoints
- subgoals
- skills
- action chunks

Mức abstraction cao hơn có thể giúp ổn định hơn, nhưng đôi khi giảm responsiveness hoặc expressiveness.

---

## Skills và Hierarchy

Nhiều robot-learning systems hưởng lợi từ:

- reusable skills
- options hoặc macro-actions
- hierarchical decomposition
- planner-policy hybrids

Điều này giúp giảm độ dài horizon và cải thiện data efficiency.

---

## Thiết kế Action Space

Các tradeoff quan trọng:

- continuous vs discrete action spaces
- one-step actions vs action chunks
- delta commands vs absolute targets
- open-loop vs feedback-aware outputs

Thiết kế action không chỉ là chi tiết implementation. Nó thay đổi cả bài toán learning.

---

## Câu hỏi Phỏng vấn

### 1) Vì sao action representation quan trọng đến vậy?

Vì nó quyết định policy phải dự đoán cái gì, lỗi tích lũy ra sao, và execution có thể bị ràng buộc tốt đến mức nào.

### 2) Vì sao skills hữu ích?

Vì chúng nén các hành vi dài thành đơn vị tái sử dụng được, giúp giảm planning horizon và tăng cấu trúc cho policy space.

### 3) Một tradeoff phổ biến của high-level policies là gì?

Chúng thường dễ ổn định và dễ supervision hơn, nhưng có thể mất bớt quyền kiểm soát tinh vi ở mức thấp.
