# Memory, Context & Agent Evaluation

## Tổng quan

Agents cần nhiều hơn một context window dài.

Chúng cần cách xử lý có kỷ luật cho:

- short-term context
- state hoặc memory dài hơi hơn
- retrieval refresh
- evaluation sát thực tế

---

## Memory khác Context thế nào

Phân biệt quan trọng:

- **context window** là phần model nhìn thấy ngay lúc này
- **memory** là state mà hệ chủ động duy trì qua nhiều turn hoặc task

Memory có thể là:

- state tạm của task
- summarized history
- retrieved prior interactions
- user hoặc environment state được lưu bền hơn

---

## Evaluation trong thực tế

Agent evaluation nên test:

- task completion
- tool-call correctness
- groundedness
- cost và latency
- độ robust khi context thiếu hoặc nhiễu

Benchmark bỏ qua workflow failure sẽ làm agent yếu trông mạnh hơn thực tế.

---

## Vì sao nó quan trọng trong robotics

Embodied systems thường cần:

- memory về các goal trước đó
- tham chiếu object đã nhắc trước
- awareness về việc môi trường đã thay đổi
- phân biệt state còn mới hay đã stale

Trong robotics, stale memory có thể nguy hiểm về mặt vật lý nếu thế giới thật đã thay đổi.

---

## Câu hỏi Phỏng vấn

### 1) Vì sao memory không giống long context?

Vì memory là system state được duy trì có chọn lọc, còn long context chỉ là số tokens hiện đang bị nhét vào prompt.

### 2) Vì sao agent evaluation khó?

Vì hệ có thể fail ở retrieval, planning, tool use, memory, hoặc orchestration dù câu trả lời cuối vẫn nghe rất hợp lý.

### 3) Vì sao stale context nguy hiểm trong robotics?

Vì model có thể suy luận từ world state đã lỗi thời và đề xuất hành động không còn phù hợp với môi trường thật.
