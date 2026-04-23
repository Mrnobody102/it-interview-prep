# Applications, Prompting & Production NLP

## Tổng quan

Ship một NLP system dùng được đòi hỏi nhiều hơn một base model mạnh.

Bạn vẫn phải thiết kế:

- task interface
- prompt format hoặc structured output schema
- fallback và validation rules
- cách hệ được deploy và monitor

Đó là khác biệt giữa demo model và hệ NLP production.

---

## Các ứng dụng NLP phổ biến

Những task cổ điển nhưng vẫn rất quan trọng:

- classification
- named entity recognition
- information extraction
- summarization
- machine translation
- semantic search và retrieval

Các workflow LLM hiện đại bổ sung:

- prompt-based generation
- tool use với structured arguments
- document Q&A
- workflow automation trên dữ liệu văn bản doanh nghiệp

Giải pháp đúng phụ thuộc vào việc bạn cần tính xác định hay cần độ linh hoạt.

---

## Prompting và Structured Outputs

Prompting giờ là một phần của thiết kế ứng dụng, không phải chi tiết trang trí.

Prompt tốt phải định nghĩa rõ:

- vai trò hoặc task frame
- output schema bắt buộc
- kỳ vọng khi gặp failure
- tools hoặc ranh giới context được phép dùng

Trong production, team thường ưu tiên:

- JSON hoặc schema-constrained outputs
- post-validation
- retry logic
- tool-routing thay cho free-form text nếu có thể

Như vậy downstream systems sẽ đáng tin cậy hơn nhiều.

---

## Các mối quan tâm ở production

Các concern quan trọng gồm:

- latency
- token cost
- prompt injection hoặc xử lý ngữ cảnh không đáng tin
- hành vi đa ngôn ngữ
- tính nhất quán thuật ngữ chuyên ngành
- retrieval handoff khi context vượt ngân sách prompt

Dù model mạnh, ứng dụng vẫn có thể fail vì orchestration yếu hoặc thiếu validation.

---

## NLP cho giao diện AI-Robotics

Trong robotics, ngôn ngữ thường được dùng cho:

- giao lệnh tác vụ
- semantic scene querying
- báo cáo trạng thái hệ
- human override hoặc supervision

Vì thế output thường cần:

- grounded vào object hoặc action thật
- bị ràng buộc vào tập lệnh hợp lệ
- có thể audit
- đi kèm confidence hoặc fallback behavior

Natural language rất hữu ích, nhưng không nên điều khiển trực tiếp hệ vật lý theo kiểu free-form nếu không có safeguard.

---

## Câu hỏi Phỏng vấn

### 1) Vì sao structured outputs có giá trị trong production NLP?

Vì chúng giảm ambiguity, dễ validate, và tích hợp an toàn hơn nhiều với downstream services so với free-form text.

### 2) Khi nào NLP cổ điển vẫn tốt hơn workflow dựa trên LLM?

Khi task hẹp, cần tính xác định cao, độ trễ thấp, và có thể được giải quyết tốt bằng model nhẹ hoặc rule-based extraction.

### 3) Vì sao prompt design là một bài toán engineering?

Vì prompt định nghĩa interface contract thực tế giữa ứng dụng và model, bao gồm format, phạm vi, và kỳ vọng fallback.

### 4) Vì sao language safety đặc biệt quan trọng trong robotics?

Vì chỉ dẫn ngôn ngữ có thể mơ hồ, thiếu ràng buộc, hoặc không an toàn nếu chuyển xuống embodied system mà không có grounding và control constraints.
