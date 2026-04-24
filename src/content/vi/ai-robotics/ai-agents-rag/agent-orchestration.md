# Agent Orchestration & Multi-Step Systems

## Tổng quan

Phần lớn agent hữu ích không phải hệ prompt-response một phát là xong.

Chúng là những workflow được điều phối, kết hợp:

- planning
- retrieval
- tool use
- state tracking
- decision checkpoints

---

## Các pattern Orchestration

Các pattern phổ biến:

- plan rồi execute
- react loops với tool feedback
- supervisor cộng worker decomposition
- routing giữa specialist tools hoặc models

Trong thực tế, chất lượng orchestration nhiều khi quan trọng hơn kích thước model khi base model đã đủ khá.

---

## State và Control Flow

Hệ nhiều bước cần xử lý tường minh:

- objective hiện tại
- các action đã hoàn thành
- subgoals còn lại
- tool outputs
- failure hoặc retry conditions

Thiếu kỷ luật về state, agent sẽ lặp việc hoặc trôi vào vòng lặp vô nghĩa.

---

## Agent hay hỏng ở đâu

Agent thường fail vì:

- task decomposition kém
- stopping criteria yếu
- nhét quá nhiều hidden state vào prompt
- tool contracts yếu
- không tách planning ra khỏi acting

Một agent system tốt thường explicit hơn mọi người tưởng.

---

## Câu hỏi Phỏng vấn

### 1) Vì sao orchestration quan trọng trong agent systems?

Vì các tác vụ nhiều bước cần control flow, memory về tiến độ, và phối hợp tool, chứ không chỉ cần token prediction mạnh.

### 2) Một agent anti-pattern phổ biến là gì?

Là để một prompt ngầm xử lý luôn planning, execution, và recovery mà không có cấu trúc hay validation rõ ràng.

### 3) Vì sao agent systems cần stopping criteria?

Vì nếu không có điều kiện hoàn thành hoặc thất bại rõ, chúng dễ loop, tốn cost, hoặc thực hiện hành động không an toàn.
