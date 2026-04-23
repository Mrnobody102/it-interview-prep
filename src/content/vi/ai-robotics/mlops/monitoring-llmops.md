# Monitoring, LLMOps & Fleet Learning

## Tổng quan

Thách thức vận hành thật sự bắt đầu sau khi deploy.

Bạn cần biết:

- chất lượng model có đang drift không
- latency hoặc cost có đang vượt ngưỡng không
- prompts và retrieval quality của hệ LLM có đi xuống không
- robots ngoài hiện trường có đang tạo ra failure patterns mới không

Đó là phạm vi của monitoring và vận hành AI hiện đại.

---

## Monitoring cho ML cổ điển

Các tín hiệu quan trọng gồm:

- input data drift
- concept drift
- performance tracking có tính tới label delay
- calibration và confidence shifts
- service latency và error rate

Một dashboard production chỉ có CPU và memory thì chưa phải hệ ML monitoring.

---

## LLMOps và GenAI Evaluation

Hệ chạy LLM thêm nhiều chiều quan sát mới:

- prompt versioning
- retrieval quality
- hallucination rate
- structured-output validity
- token cost và context efficiency
- pattern thành công hoặc lỗi khi tool-call

Evaluation thường phải kết hợp scoring tự động với review có chủ đích bởi nhiều failure mang tính ngữ nghĩa hơn là cú pháp.

---

## Fleet Learning và Feedback Loops

Trong robotics hoặc embodied AI, dữ liệu sau deploy trở thành một phần của vòng đời sản phẩm.

Team thường thu:

- failure replays
- near-miss events
- intervention examples
- edge cases theo từng môi trường

Dữ liệu đó có thể nuôi cho:

- retraining
- cải thiện simulator
- tinh chỉnh safety rules
- policy adaptation theo từng loại phần cứng

Nó đôi khi được gọi là data flywheel, nhưng chỉ hiệu quả khi khâu thu thập và triage đủ kỷ luật.

---

## Safety Gates và Simulation-Backed Evaluation

Trước khi promote rộng, các hệ rủi ro cao thường cần:

- replay trên historical logs
- simulation scenarios cho rare failures
- policy hoặc guardrail checks
- staged rollout với stop conditions rõ ràng

Với physical AI, monitoring tốt gắn chặt với hạ tầng evaluation tốt.

---

## Câu hỏi Phỏng vấn

### 1) Data drift là gì?

Đó là sự thay đổi phân phối input ở production so với dữ liệu đã dùng lúc training.

### 2) Vì sao monitoring cho LLM khác monitoring ML cổ điển?

Vì bạn phải quan sát prompt behavior, retrieval quality, output formatting, hallucination patterns, và token economics ngoài các service metrics thông thường.

### 3) Fleet learning là gì?

Đó là quá trình dùng dữ liệu thu từ các thiết bị hoặc robot đã deploy để cải thiện models và policies cho các bản sau.

### 4) Vì sao simulation-backed evaluation hữu ích trước rollout?

Vì những failure hiếm hoặc safety-critical có thể không lộ ra trong canary nhỏ, nhưng vẫn có thể được kiểm tra bằng replay và simulation có chủ đích.
