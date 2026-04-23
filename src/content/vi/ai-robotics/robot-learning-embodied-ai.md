# Robot Learning & Embodied AI

## Tổng quan

Embodied AI nghiên cứu các agent có thể cảm nhận, suy luận và hành động trong thế giới vật lý. Trong robotics, điều đó có nghĩa là biến dữ liệu thành policy ánh xạ observation thành action.

Đến tháng 4/2026, mảng này được định hình bởi sự kết hợp của:

- imitation learning
- reinforcement learning
- offline và hybrid policy learning
- vision-language-action (VLA) models
- robot foundation models

Lĩnh vực này đi rất nhanh, nhưng các bài toán khó vẫn là bài toán vật lý:

- chất lượng dữ liệu
- latency
- safety
- action grounding
- distribution shift

---

## Các hướng học chính trong robotics

| Hướng | Ý tưởng chính | Điểm mạnh | Điểm yếu |
|---|---|---|---|
| **Behavior cloning** | bắt chước demo trực tiếp | đơn giản, mạnh nếu data tốt | dễ lệch khi ra khỏi phân phối |
| **Imitation learning có correction** | học từ demo cộng intervention | robust hơn | tốn nhiều thời gian con người |
| **Reinforcement learning** | tối ưu reward qua tương tác | có thể tìm chiến lược mới | sample inefficiency |
| **Offline RL / hybrid methods** | học từ log có sẵn | an toàn và rẻ hơn online RL | nhạy với chất lượng dữ liệu |

Trong robotics deploy thực tế, pure online RL vẫn hiếm hơn cảm giác khi chỉ đọc paper.

---

## Policy representation

Policy hiện đại có thể output:

- low-level joint command
- end-effector action
- base velocity command
- skill token hoặc subgoal
- language-conditioned action

Chọn action space không phải chi tiết nhỏ. Nó ảnh hưởng trực tiếp tới:

- sample efficiency
- safety envelope
- khả năng chuyển qua robot khác
- mức độ dễ can thiệp bởi con người

---

## Vision-Language-Action models

VLA model quan trọng vì nó thống nhất:

- input hình ảnh
- instruction ngôn ngữ
- dự đoán action

Chúng hứa hẹn tăng khả năng generalization:

- "pick up the red mug"
- "open the drawer and place the object inside"
- "move to the charging dock"

Nhưng hệ thống thật vẫn cần:

- safety wrapper
- action filtering
- recovery ở mức task
- fallback behavior

Generalization trong demo không tự động đồng nghĩa với deploy-ready.

Các hệ đại diện của làn sóng 2025-2026 gồm:

- **Gemini Robotics / Gemini Robotics-ER / ER-1.6**
- **NVIDIA Isaac GR00T N1 và N1.5**
- **LeRobot policies và các VLA cộng đồng như SmolVLA**

---

## Dịch chuyển 2025-2026

Các tiến bộ gần đây nhấn mạnh:

- dataset cross-robot lớn hơn
- open training stack cho robot policy
- policy nhỏ hơn, hiệu quả hơn để deploy ở edge
- pipeline simulation-to-real mạnh hơn
- foundation model kết hợp language, vision và action

Đó là lý do "robot learning" không còn là nhánh riêng tách biệt khỏi systems engineering nữa.

Open tooling cũng đã tiến bộ rõ:

- LeRobot mở rộng support cho hardware và policy
- VLA nhỏ hơn trở nên thực tế hơn trên phần cứng phổ thông
- pipeline dữ liệu và evaluation dễ tái lập hơn trước

---

## Data mới là bottleneck thật

Chất lượng robot learning phụ thuộc mạnh vào:

- chất lượng demo
- sensor synchronization
- độ đúng của action label
- đa dạng reset
- coverage của failure case
- mức nhất quán giữa các embodiment

Trong thực tế, nhiều robotics team dần trở thành data-engineering team.

Đó cũng là lý do open dataset và tooling ngày càng quan trọng.

---

## Khi nào classical robotics vẫn thắng

Learned policy rất mạnh, nhưng phương pháp cổ điển vẫn thắng khi cần:

- safety guarantee cứng
- xử lý constraint chính xác
- interpretability cao
- thiết lập với ít data
- hành vi dễ dự đoán kiểu certification

Hệ thống mạnh nhất thường là hybrid:

- classical planning cho cấu trúc
- learned policy cho skill prior hoặc perception
- supervisor và controller cho safety

---

## Nên học theo thứ tự nào

Thứ tự hợp lý:

1. imitation learning cơ bản
2. policy evaluation và failure analysis
3. offline RL và hybrid approach
4. kiến trúc VLA
5. dataset curation và robot telemetry
6. deploy có ràng buộc safety

Nếu bỏ qua evaluation và safety thì thực ra chưa hiểu robot learning.

---

## Câu hỏi Phỏng vấn

### 1. Vì sao behavior cloning vẫn rất quan trọng trong robotics?

Vì demo tốt có thể tạo ra policy hữu ích với độ phức tạp kỹ thuật thấp hơn nhiều so với full online RL.

### 2. Giá trị chính của VLA model là gì?

Nó cố gắng tăng instruction-following và skill transfer bằng cách học biểu diễn chung trên language, perception và action.

### 3. Vì sao hybrid robot stack vẫn chiếm ưu thế?

Vì learning tăng độ linh hoạt, còn classical robotics vẫn cung cấp cấu trúc, constraint và execution boundary an toàn hơn.
