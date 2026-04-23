# Transformers, LLMs & Context Windows

## Tổng quan

NLP hiện đại bị chi phối bởi transformer-based models vì chúng học contextual representations rất mạnh và scale tốt theo data lẫn compute.

Để dùng tốt chúng, bạn nên hiểu:

- attention hoạt động thế nào
- sự khác biệt giữa encoder, decoder, và encoder-decoder families
- context length, KV cache, và inference throughput tác động lẫn nhau ra sao

---

## Ý tưởng cốt lõi của Transformer

Transformer block thường kết hợp:

- self-attention
- feed-forward network
- residual paths
- normalization
- positional information

Self-attention giúp mỗi token tích hợp thông tin từ các vị trí liên quan khác mà không cần dựa vào state hồi tiếp như RNN.

### Các family model phổ biến

| Family | Tác vụ điển hình |
|---|---|
| **Encoder-only** | classification, retrieval, NER |
| **Decoder-only** | generation, chat, code |
| **Encoder-decoder** | translation, summarization, structured generation |

Mỗi family phản ánh một tradeoff khác nhau giữa understanding và generation.

---

## BERT, GPT, và hành vi của LLM hiện đại

### BERT-style Models

Chúng tối ưu cho hiểu ngữ cảnh và trích xuất biểu diễn. Vẫn rất mạnh khi bạn cần:

- embeddings chất lượng cao
- retrieval encoders
- classification với compute vừa phải
- token-level prediction

### GPT-style Models

Chúng tối ưu cho sinh chuỗi tự hồi quy. Điểm mạnh gồm:

- open-ended text generation
- in-context learning
- instruction following
- tool-calling interfaces

Các hệ LLM hiện đại ngày càng thêm routing, structured outputs, và external retrieval quanh base model.

---

## Context Windows và Inference Scaling

Context window lớn rất hữu ích, nhưng kéo theo thay đổi trong thiết kế hệ.

Các ràng buộc chính:

- memory usage do KV cache
- latency từ prompt quá dài
- chất lượng giảm khi văn bản không liên quan chiếm ưu thế
- batching khó hơn khi request chênh lệch lớn về độ dài

Đó là lý do hệ thật thường kết hợp:

- prompt compression
- retrieval
- chunking và reranking
- model routing giữa bản nhỏ và bản lớn

---

## Vì sao phần này quan trọng vượt khỏi text

Ý tưởng transformer giờ đang đứng sau:

- multimodal LLMs
- document intelligence systems
- VLMs với vision tokens
- embodied models với action tokens

Nên hiểu transformers không còn chỉ là kỹ năng NLP, mà là một phần của kiến thức nền về AI systems.

---

## Câu hỏi Phỏng vấn

### 1) Vì sao transformers tốt hơn RNN cổ điển ở NLP quy mô lớn?

Vì chúng mô hình hóa quan hệ xa trực tiếp hơn và train hiệu quả hơn nhờ tính song song trên phần cứng hiện đại.

### 2) Khác biệt thực tế giữa BERT và GPT là gì?

BERT chủ yếu dùng cho understanding tasks, còn GPT-style models chủ yếu dùng cho generation và instruction following.

### 3) Vì sao context window không phải yếu tố duy nhất quan trọng?

Vì prompt dài hơn làm compute và memory cost tăng, trong khi quá nhiều context không liên quan vẫn có thể làm câu trả lời kém đi.

### 4) KV cache là gì và vì sao nó quan trọng?

Nó lưu các trạng thái attention trung gian trong quá trình decode tự hồi quy, giúp giảm tính toán lặp lại nhưng làm tăng áp lực bộ nhớ cho sequence dài.
