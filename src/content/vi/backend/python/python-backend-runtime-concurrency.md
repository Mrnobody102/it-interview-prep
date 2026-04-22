# Runtime & Concurrency

## 1. Tổng quan

Muốn viết Python backend tốt thì phải hiểu `runtime model`, đặc biệt là:

- GIL
- async I/O
- thread
- process
- concurrency limit
- timeout và cancellation

Rất nhiều service chậm không phải vì framework dở, mà vì chọn sai mô hình chạy.

## 2. GIL là gì?

### 2.1. Bản chất

`GIL` là `Global Interpreter Lock`. Trong CPython, cùng một lúc chỉ có một thread thực thi Python bytecode trong một process.

### 2.2. Hệ quả thực tế

- I/O-bound vẫn ổn với thread hoặc async
- CPU-bound thuần Python không scale tốt bằng thread
- native libraries như NumPy/PyTorch có thể chạy nhanh vì phần nóng không nằm ở Python bytecode

### 2.3. Sai lầm phổ biến

- nghe "Python có thread" rồi tưởng CPU-bound sẽ scale đẹp
- không phân biệt compute nằm ở Python hay ở native runtime

## 3. Chọn thread, async hay multiprocessing?

| Tình huống | Nên chọn gì | Lý do |
|---|---|---|
| Gọi DB, HTTP, Redis | `async` | I/O-bound, cần concurrency cao |
| Dùng SDK sync | `thread` | Tích hợp dễ hơn |
| CPU-bound thuần Python | `multiprocessing` | Né GIL |
| Long-running work cần retry | queue + worker | bền hơn request thread |

## 4. `async` / `await`

### 4.1. Khi nào hợp?

`async` hợp với backend có nhiều I/O đồng thời:

- DB query
- HTTP downstream
- object storage
- message broker

```python
import httpx

async def fetch_profile(user_id: str) -> dict:
    async with httpx.AsyncClient(timeout=5.0) as client:
        response = await client.get(f"https://api.example.com/users/{user_id}")
        response.raise_for_status()
        return response.json()
```

### 4.2. Sai lầm phổ biến

- gọi code sync nặng trong async route
- dùng SDK sync trong event loop
- tạo quá nhiều concurrent task không giới hạn

### 4.3. Dấu hiệu code async đang có vấn đề

- p95 tăng mạnh khi traffic tăng
- event loop latency cao
- timeout dây chuyền khi downstream chậm

## 5. Semaphore, timeout và backpressure

### 5.1. Giới hạn concurrency

Service production luôn cần chặn việc fan-out vô hạn.

```python
import asyncio

downstream_limit = asyncio.Semaphore(20)

async def call_embedding_api(payload: dict) -> dict:
    async with downstream_limit:
        ...
```

### 5.2. Vì sao quan trọng?

Nếu không giới hạn:

- event loop vẫn sống nhưng downstream chết
- queue âm thầm phình ra
- tail latency nổ

### 5.3. Timeout và cancellation

Concurrency tốt mà không có timeout thì vẫn là setup nguy hiểm.

Nên luôn nghĩ đến:

- request timeout
- downstream timeout
- task cancellation
- retry có giới hạn

## 6. Multiprocessing

### 6.1. Hợp khi nào?

- preprocessing CPU-bound
- parse tài liệu nặng
- convert file/video/audio
- code không tận dụng native vectorized libs đủ tốt

### 6.2. Giá phải trả

- memory copy giữa process
- startup cost
- IPC overhead
- khó debug hơn thread/async

## 7. Các pattern hay dùng trong dự án thật

### 7.1. Async API service

- FastAPI
- async DB driver
- async HTTP client
- timeout và retry rõ ràng

### 7.2. Worker process riêng

- Celery worker
- process riêng cho CPU-heavy job
- process riêng giữ model/GPU

### 7.3. Hybrid architecture

- API layer nhận request
- job dài đẩy sang queue
- kết quả trả qua polling, webhook hoặc streaming

## 8. Common pitfalls

- block event loop bằng pandas, regex nặng, parse file nặng
- không đặt timeout cho downstream
- mở quá nhiều client/connections
- không có concurrency limit
- dùng thread để giải quyết CPU-bound Python code rồi tưởng là scale

## 9. Best practices

- phân biệt rõ I/O-bound và CPU-bound
- mọi external call đều có timeout
- queue và concurrency phải có giới hạn
- không chạy pipeline dài trong request handler
- đo p50/p95/p99 và queue depth

## 10. Câu hỏi phỏng vấn hay gặp

### 10.1. GIL ảnh hưởng backend thế nào?

Nó làm CPU-bound Python code không scale tốt bằng thread trong cùng process. Nhưng I/O-bound service vẫn chạy tốt với async hoặc thread.

### 10.2. `async` có luôn nhanh hơn thread không?

Không. Nó phù hợp hơn với I/O-bound workload và ecosystem hỗ trợ async tốt.

### 10.3. Khi nào nên dùng multiprocessing?

Khi workload CPU-bound thuần Python hoặc preprocessing nặng không hưởng lợi đủ từ async/thread.
