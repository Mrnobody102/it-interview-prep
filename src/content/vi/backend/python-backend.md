# Python Backend

## 1. Tổng quan

`Python` là một trong những ngôn ngữ mạnh nhất cho backend khi bài toán cần:

- tốc độ phát triển nhanh
- ecosystem thư viện rất rộng
- tích hợp chặt với data, ML, AI
- orchestration layer, automation layer, workflow layer

Trong thực tế, Python backend thường xuất hiện ở:

- API service
- admin/backoffice
- ETL và data pipeline
- model serving
- RAG orchestration
- agent backend

## 2. Khi nào nên chọn Python?

| Tình huống | Python có hợp không? | Vì sao |
|---|---|---|
| CRUD app, admin portal | Rất hợp | Phát triển nhanh, framework mạnh |
| API tích hợp nhiều hệ thống ngoài | Rất hợp | HTTP, queue, storage, auth libraries nhiều |
| Hệ AI/ML cần orchestration | Rất hợp | Gắn chặt với PyTorch, NumPy, Transformers |
| Service latency cực thấp | Cân nhắc | Có thể cần Go/C++/Rust cho hot path |
| CPU-bound thuần Python | Không lý tưởng | Bị ảnh hưởng bởi GIL |

> **Rule of thumb:** Python rất mạnh khi business velocity và ecosystem quan trọng hơn việc tối ưu từng ms ở hot path.

## 3. Khi nào Python không phải lựa chọn tốt nhất?

Python không phải lựa chọn đẹp nhất nếu:

- service có latency target cực thấp và traffic rất cao
- compute nặng chạy thuần Python thay vì native libraries
- bài toán cần kiểm soát memory và layout dữ liệu cực sâu

Trong các case đó, mô hình phổ biến là:

- Python giữ orchestration
- phần nóng đẩy sang NumPy/PyTorch vectorized ops
- hoặc extension C++/Rust
- hoặc inference service riêng

## 4. Bản đồ các chủ đề lớn

### 4.1. Python Core

Tập trung vào:

- type hints
- `dataclass`
- context manager
- generator/iterator
- `datetime`, `Decimal`, `UUID`
- cách tổ chức code backend

### 4.2. Runtime & Concurrency

Tập trung vào:

- GIL
- `async` / `await`
- thread vs process
- concurrency limit
- timeout, cancellation, backpressure

### 4.3. Django / FastAPI

Tập trung vào:

- khi nào chọn framework nào
- ORM, validation, dependency injection
- pattern API phổ biến trong dự án thật

### 4.4. Jobs & Workflows

Tập trung vào:

- Celery
- queue, retry, idempotency
- scheduler
- background pipeline cho data và AI systems

### 4.5. AI Systems

Tập trung vào:

- model serving
- batching
- GPU process model
- RAG / vector database
- object storage
- khi nào phải đẩy phần nóng sang native code

### 4.6. Production & Best Practices

Tập trung vào:

- project structure
- config
- observability
- security
- deployment
- code style cho team scale

## 5. Lộ trình học thực tế

1. Nắm `Python Core` thật chắc.
2. Học `Runtime & Concurrency` để tránh viết service chậm hoặc block event loop.
3. Học `Django / FastAPI` theo kiểu sản phẩm mình đang làm.
4. Học `Jobs & Workflows` để xử lý pipeline dài và retryable work.
5. Nếu làm AI, đi sâu vào `AI Systems`.
6. Kết thúc bằng `Production & Best Practices`.

## 6. Nếu mục tiêu là backend cho AI

Thứ tự hợp lý thường là:

1. Python Core
2. Runtime & Concurrency
3. FastAPI
4. Jobs & Workflows
5. AI Systems
6. Production

Vì AI backend ngoài thực tế hiếm khi chỉ là "gọi model". Nó thường còn phải xử lý:

- upload file
- parse/chunk
- embedding
- indexing
- reranking
- streaming response
- trace, metrics, audit log

## 7. Cách dùng bộ tài liệu này

- Nếu bạn là người mới với backend Python, đi theo thứ tự từ mục 4.1 đến 4.6.
- Nếu bạn đã làm web app nhưng mới chuyển sang AI backend, bắt đầu từ `Runtime & Concurrency`, rồi sang `FastAPI`, `Jobs & Workflows`, `AI Systems`.
- Nếu bạn đang chuẩn bị phỏng vấn, đọc thêm phần câu hỏi ở cuối từng doc con, vì đó là nơi dễ bị hỏi nhất.

## 8. Câu hỏi phỏng vấn thường gặp

### 8.1. Python mạnh nhất ở đâu trong backend?

Mạnh nhất ở tốc độ phát triển, ecosystem, integration với data/AI stack, và orchestration.

### 8.2. Python yếu nhất ở đâu?

Yếu hơn ở hot path CPU-bound thuần Python, bài toán ultra-low latency, và nơi cần kiểm soát memory rất sâu.

### 8.3. Backend Python có phù hợp cho AI systems không?

Rất phù hợp, đặc biệt ở lớp API, workflow orchestration, RAG, feature service và model gateway.
