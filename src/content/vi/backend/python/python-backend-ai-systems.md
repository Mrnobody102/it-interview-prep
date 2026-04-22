# AI Systems

## 1. Tổng quan

`Python` là ngôn ngữ gần như mặc định cho lớp orchestration trong hệ thống AI:

- model serving
- embedding pipeline
- RAG
- agent backend
- evaluation pipeline

Python mạnh vì ecosystem thư viện, nhưng muốn production tốt thì phải hiểu kiến trúc chứ không chỉ biết gọi model.

## 2. Vai trò phổ biến của Python trong AI backend

| Vai trò | Python mạnh ở mức nào? |
|---|---|
| Training pipeline | Rất mạnh |
| Data preprocessing | Rất mạnh |
| Inference API | Mạnh |
| RAG orchestration | Rất mạnh |
| Workflow orchestration | Rất mạnh |
| Ultra-low latency native core | Thường nhường cho C++/Rust |

## 3. Model loading

### 3.1. Nguyên tắc cơ bản

Model không nên load lại theo từng request.

- load một lần lúc startup
- warm-up ngay sau khi load
- readiness check phải phản ánh model đã sẵn sàng
- config model không được nằm rải rác trong route handler

### 3.2. Lỗi hay gặp

- mỗi request mới tạo tokenizer/model session
- readiness chỉ check process sống chứ không check model ready
- load model ở nhiều worker process không kiểm soát

## 4. Batching

### 4.1. Vì sao batching quan trọng?

Batching rất quan trọng với:

- embedding service
- LLM inference
- vision inference

### 4.2. Trade-off

- batch lớn hơn -> throughput cao hơn
- batch quá lớn -> latency xấu hơn

Trong dự án thật, batching thường cần deadline ngắn để cân bằng throughput và p95 latency.

## 5. GPU process model

### 5.1. Những thứ cần cẩn thận

- số worker process
- CUDA context
- VRAM fragmentation
- fork sau khi init CUDA

### 5.2. Pattern phổ biến

- một process giữ model/GPU
- API layer route request đến process đó
- hoặc tách hẳn model worker/service riêng

## 6. RAG và vector database

Python backend thường đứng ở lớp orchestration:

1. nhận query
2. query embedding model
3. tìm top-k trong vector DB
4. fetch metadata/chunks
5. rerank
6. gọi LLM
7. stream response

Những công nghệ hay gặp:

- `pgvector`
- `Qdrant`
- `Milvus`
- `Weaviate`
- `OpenSearch` / `Elasticsearch`

## 7. File và object storage

Hệ AI gần như luôn cần object storage để lưu:

- raw documents
- image/video/audio
- model artifact
- prompt/versioned config

Thường dùng:

- S3
- GCS
- Azure Blob

## 8. Những chỗ hay chậm

- tokenize hoặc preprocess bằng Python thuần
- serialize JSON quá lớn
- block event loop
- load model sai chỗ
- gọi model sync trong thread request không giới hạn
- copy tensor/buffer nhiều lần

## 9. Khi nào cần đẩy phần nóng sang native code?

Khi:

- latency target quá gắt
- CPU usage quá cao
- preprocessing quá nặng
- cần SIMD/GPU/custom operator

Lúc đó thường chọn:

- vectorized ops qua NumPy/PyTorch
- extension C++/Rust
- native inference service riêng

## 10. Best practices

- tách online inference và offline pipeline
- version model, prompt, embedding config rõ ràng
- warm-up model trước khi nhận traffic
- log và trace đầy đủ nhưng không leak dữ liệu nhạy cảm
- limit concurrency ở mọi downstream quan trọng

## 11. Câu hỏi phỏng vấn hay gặp

### 11.1. Python có phù hợp cho AI serving không?

Có, đặc biệt ở lớp API và orchestration. Nhưng hot path siêu nặng có thể phải chuyển sang native runtime.

### 11.2. Vì sao phải warm-up model?

Để tránh request đầu tiên chịu latency bất thường do load weights, tạo context hoặc compile graph.

### 11.3. Batching có phải lúc nào cũng tốt?

Không. Nó tăng throughput nhưng có thể làm latency xấu nếu batch chờ quá lâu hoặc quá lớn.
