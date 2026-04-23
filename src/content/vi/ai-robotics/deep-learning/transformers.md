# Transformers, Foundation Models & Fine-tuning

## Tổng quan

Transformers trở thành kiến trúc thống trị vì self-attention scale tốt hơn recurrence khi cần mô hình hóa phụ thuộc dài và pretraining trên corpora lớn.

Nhưng để trả lời tốt trong phỏng vấn hoặc thiết kế hệ thống thật, bạn cần hiểu nhiều hơn công thức attention:

- các biến thể kiến trúc
- pretraining objectives
- chiến lược fine-tuning
- cost inference và tradeoff triển khai

---

## Self-Attention và cấu trúc Transformer

Self-attention cho phép mỗi token nhìn vào những token liên quan khác trong context:

`Attention(Q, K, V) = softmax(QK^T / sqrt(d_k)) V`

Một block tiêu chuẩn thường gồm:

- multi-head attention
- feed-forward network
- residual connections
- normalization
- thông tin vị trí

Các family model khác nhau ở cách dùng masking, cross-attention, và cách decode.

### Các family transformer phổ biến

| Family | Hợp cho |
|---|---|
| **Encoder-only** | classification, retrieval, token labeling |
| **Decoder-only** | generation, chat, code completion |
| **Encoder-decoder** | translation, summarization, structured seq2seq |

---

## Pretraining Objectives và Foundation Models

Ví dụ điển hình:

- **BERT-style MLM** học biểu diễn ngữ cảnh rất tốt cho understanding
- **GPT-style next-token prediction** scale tốt cho generation và in-context learning
- **T5-style text-to-text** gom nhiều task về một giao diện
- **multimodal pretraining** căn chỉnh image, text, audio, hoặc action tokens

Các pretrained model lớn hiệu quả vì chúng nén cấu trúc thống kê rộng của dữ liệu trước khi fine-tuning cho task cụ thể.

---

## Fine-tuning và Adaptation

### Full Fine-tuning

Cập nhật toàn bộ tham số model. Hợp khi:

- bạn có đủ data và compute
- domain shift lớn
- model chưa quá to với hạ tầng hiện có

### Parameter-Efficient Fine-tuning

Các kỹ thuật phổ biến:

- **LoRA**
- **QLoRA**
- adapters
- prompt hoặc prefix tuning

Các cách này hữu ích khi backbone rất lớn và bạn muốn chuyên biệt hóa với chi phí thấp hơn.

### Các điểm cần để ý

- catastrophic forgetting
- overfitting trên tập instruction quá hẹp
- evaluation leakage từ benchmark prompts
- latency xấu đi sau quantization hoặc adapter stacking

---

## Long Context, Retrieval, và chi phí inference

Context window dài hơn rất hữu ích, nhưng không miễn phí.

Tradeoff gồm:

- attention cost tăng mạnh với nhiều kiến trúc
- KV-cache tốn bộ nhớ hơn
- tín hiệu dễ loãng nếu nhét quá nhiều context không liên quan

Vì thế hệ production thường kết hợp:

- context window vừa phải
- retrieval
- summarization hoặc memory compression
- routing giữa model nhỏ và model lớn

Hiểu kiến trúc là cần thiết vì năng lực model và chi phí phục vụ gắn chặt với nhau.

---

## Vì sao phần này quan trọng trong AI-Robotics

Transformers giờ không chỉ dùng cho ngôn ngữ:

- vision transformers
- vision-language models
- policy transformers với action chunking
- fusion time-series giữa camera, force, proprioception, và commands

Nhưng robotics thêm các ràng buộc:

- latency bị chặn theo control cycle
- yêu cầu safety khi generation thiếu chắc chắn
- đồng bộ nhiều sensor streams

Do đó, dùng transformer trong robotics luôn là câu hỏi hệ thống chứ không chỉ là câu hỏi mô hình.

---

## Câu hỏi Phỏng vấn

### 1) Vì sao transformers vượt qua recurrent models?

Vì self-attention nắm bắt phụ thuộc xa trực tiếp hơn và cho phép train song song tốt hơn trên phần cứng hiện đại.

### 2) Khi nào LoRA hợp hơn full fine-tuning?

Khi pretrained model lớn, compute hạn chế, và bạn chủ yếu cần domain adaptation hiệu quả thay vì tái huấn luyện toàn bộ model.

### 3) Vì sao context window dài hơn chưa chắc đã đủ?

Vì nhiều tokens hơn làm tăng compute và memory cost, trong khi context không liên quan vẫn có thể làm chất lượng suy luận kém đi. Retrieval và compression vẫn thường cần thiết.

### 4) Vì sao transformers lại quan trọng trong robotics?

Vì chúng cung cấp giao diện token hóa linh hoạt cho multimodal fusion, planning, và action prediction trong embodied AI.
