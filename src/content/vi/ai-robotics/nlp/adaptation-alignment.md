# Fine-tuning, Alignment & Model Adaptation

## Tổng quan

Một language model pretrained chỉ là điểm khởi đầu.

Để biến nó thành thứ hữu ích cho sản phẩm, bạn thường cần:

- domain adaptation
- instruction following tốt hơn
- hành vi an toàn hơn
- evaluation theo đúng failure modes của task

Đó là chỗ fine-tuning và alignment phát huy vai trò.

---

## Các chiến lược Fine-tuning

### Full Fine-tuning

Cập nhật toàn bộ model khi:

- model đủ nhỏ
- domain shift mạnh
- bạn chịu được chi phí training

### Parameter-Efficient Adaptation

Các lựa chọn phổ biến:

- LoRA
- QLoRA
- adapters
- prompt tuning

Những cách này giảm chi phí và giúp hỗ trợ nhiều domain variant trên cùng một backbone dễ hơn.

---

## Instruction Tuning và Alignment

Instruction tuning dạy model tuân theo prompt theo kiểu task đáng tin cậy hơn.

Sau đó, alignment cố gắng cải thiện:

- helpfulness
- harmlessness
- tính nhất quán về format
- mức độ khớp với preference hoặc policy mong muốn

Các kỹ thuật thường gặp:

- supervised fine-tuning
- reward-model-based RLHF
- direct preference optimization
- rejection sampling và curated preference datasets

Điểm quan trọng là alignment thay đổi hành vi model, không chỉ thay đổi benchmark score.

---

## Rủi ro của Domain Adaptation

Các failure mode hay gặp:

- catastrophic forgetting của năng lực tổng quát
- overfitting vào một kiểu tài liệu hẹp
- hành vi giòn ngoài distribution đã fine-tune
- tự tin giả với jargon chuyên ngành

Pipeline adaptation tốt phải có held-out domain tests và evaluation kiểu red-team, thay vì chỉ nhìn loss trung bình.

---

## Evaluation cho model đã được adapt

Các chiều đánh giá hữu ích:

- task success rate
- hallucination hoặc unsupported-claim rate
- độ hợp lệ của format
- latency và cost
- tuân thủ safety hoặc policy

Với ứng dụng enterprise hoặc robotics-adjacent, evaluation phải bao gồm cả impact của failure chứ không chỉ accuracy.

---

## Câu hỏi Phỏng vấn

### 1) Khi nào nên chọn LoRA thay vì full fine-tuning?

Khi base model lớn, budget train hạn chế, và bạn chủ yếu cần chuyên biệt hóa hiệu quả.

### 2) Khác biệt giữa fine-tuning và alignment là gì?

Fine-tuning thích nghi model với dữ liệu hoặc task, còn alignment cố định hình hành vi để output hợp hơn với preference của con người hoặc policy.

### 3) Catastrophic forgetting là gì?

Đó là hiện tượng model mất đi năng lực tổng quát đã học trước đó khi bị adapt quá mạnh vào một dataset hẹp hơn.

### 4) Vì sao evaluation sau fine-tuning rất quan trọng?

Vì loss hoặc benchmark score tốt hơn không đảm bảo factuality, safety, hoặc usefulness trong workflow thật.
