# RAG, Agents & Tool Use

## Tổng quan

Đến tháng 4/2026, thiết kế ứng dụng AI không còn là kiểu "chọn một model rồi thêm prompt". Hệ thống thực tế thường là tổ hợp của:

- base model hoặc multimodal model
- retrieval trên tri thức riêng
- tool calling tới API, database, workflow
- lớp orchestration cho tác vụ nhiều bước
- evaluation, guardrails và observability

Chủ đề này quan trọng vì phần lớn sản phẩm AI hiện đại không được train end-to-end từ đầu. Chúng được ghép thành hệ thống.

---

## Retrieval vs Tool Use vs Agents

Ba khái niệm này liên quan với nhau nhưng không giống nhau:

| Pattern | Ý tưởng chính | Hợp với | Failure mode chính |
|---|---|---|---|
| **RAG** | retrieve context trước khi sinh | grounding knowledge, enterprise Q&A | chunking kém, retrieval yếu |
| **Tool use** | model gọi hàm hoặc API bên ngoài | hành động có cấu trúc, calculator, database | schema drift, chọn sai tool |
| **Agentic workflow** | hệ thống tự plan và chạy nhiều bước | automation, workflow dài, research | lặp vô hạn, stop condition yếu |

Quy tắc thực dụng:

- dùng prompting thường cho bài toán đơn giản
- thêm RAG khi vấn đề là tri thức mới hoặc private knowledge
- thêm tool use khi câu trả lời cần hành động hoặc dữ liệu authoritative
- chỉ thêm agent khi tác vụ thực sự cần multi-step planning

---

## RAG Stack hiện đại

Pipeline RAG trong production thường gồm:

1. Ingest tài liệu
2. Parse và làm sạch
3. Chunking
4. Sinh embedding
5. Index vào vector search hoặc hybrid search
6. Retrieval và reranking
7. Ghép context
8. Generation
9. Offline và online evaluation

### Chunking vẫn cực kỳ quan trọng

Dù model long-context mạnh hơn, chunking vẫn là bài toán hệ thống:

- chunk quá nhỏ thì mất ngữ nghĩa
- chunk quá to thì retrieval kém chính xác
- metadata kém sẽ làm filter rất yếu
- bảng, code, diagram, PDF thường cần parser riêng

### Các chiến lược retrieval

Thường gặp:

- dense retrieval cho semantic similarity
- sparse retrieval cho keyword exact match
- hybrid retrieval cho enterprise search
- reranker để cải thiện top-k trước khi generate

Stage retrieval rất hay quyết định chất lượng nhiều hơn cả việc model to hơn một chút.

---

## Tool Calling Patterns

Tool use giờ là primitive cốt lõi của ứng dụng AI.

Các loại tool hay gặp:

- query SQL hoặc analytics
- web search
- action vào CRM hoặc ticketing
- filesystem và code tools
- robotics APIs và control endpoints

Nguyên tắc thiết kế:

- giữ schema của tool rõ ràng và hẹp
- validate input trước khi execute
- trả về output có cấu trúc, không phải text mơ hồ
- tách reasoning khỏi execution
- log mọi tool call để replay và debug

Nếu model được gọi tool có side effect trực tiếp thì phải nghĩ thêm về approval gate, idempotency và rollback.

---

## Kiến trúc agent

Các pattern phổ biến:

| Pattern | Mô tả | Hợp khi nào |
|---|---|---|
| **Router** | điều phối task tới tool/model phù hợp | task class rõ ràng |
| **Planner + Executor** | một lớp tách bước, lớp kia thực thi | task nhiều bước với tool ổn định |
| **State machine / graph** | node, transition, retry rõ ràng | production workflow |
| **Multi-agent** | nhiều agent theo vai trò phối hợp | subtasks độc lập, dễ kiểm tra |

Trong năm 2026, team mạnh thường thích workflow graph explicit hơn là loop "tự động hoàn toàn" kiểu black box.

Reliability thường tốt hơn khi:

- state được externalize
- retry logic tường minh
- termination condition deterministic
- con người xem được intermediate output

---

## Memory và context management

"Memory" có thể là nhiều thứ:

- lịch sử hội thoại
- long-term facts được retrieve
- user profile và preference
- workflow state
- tri thức từ nguồn dữ liệu bên ngoài

Không nên nhét tất cả vào prompt.

Nên tách lớp:

- short-term context cho task hiện tại
- retrieval cho tri thức lâu dài
- structured state cho tiến độ workflow
- external source of truth cho business data

---

## Evaluation trong 2026

Eval cho hệ AI hiện đại thường nhiều lớp:

- task success rate
- retrieval precision và recall
- tool-call accuracy
- latency và cost
- hallucination rate
- policy/safety violation
- human review hoặc preference outcome

Với agentic system, "exact match" thường không đủ. Metric tốt hơn là:

- có chọn đúng tool không
- final state có đúng không
- có dừng đúng lúc không
- có recover được lỗi trung gian không

---

## Liên hệ với robotics

RAG và agents ngày càng liên quan tới robotics vì robot đang dần language-conditioned và multimodal hơn:

- hiểu chỉ dẫn bằng ngôn ngữ
- plan dựa trên knowledge và affordance
- grounding câu lệnh thành action
- kết hợp tool/symbolic layer với learned policy
- human-in-the-loop supervision

Trong embodied system, language không thay thế control. Nó phải phối hợp perception, planning và policy execution.

---

## Câu hỏi Phỏng vấn

### 1. RAG giải quyết bài toán nào tốt hơn fine-tuning?

RAG thường tốt hơn khi vấn đề là private knowledge, freshness hoặc provenance, thay vì thay đổi hành vi cốt lõi của model.

### 2. Khi nào agents là ý tưởng tệ?

Khi task ngắn, deterministic, và giải được bằng một prompt hoặc một bước workflow cố định.

### 3. Rủi ro production lớn nhất của agentic systems là gì?

Execution không bị chặn đúng lúc cùng hidden state khó kiểm soát. Vì vậy workflow explicit, logging tốt và tool constraints rất quan trọng.
