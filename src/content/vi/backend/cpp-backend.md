# C++ Backend

## 1. Tổng quan

`C++` là lựa chọn mạnh cho backend khi bài toán cần:

- độ trễ rất thấp
- throughput rất cao
- kiểm soát allocation và lifetime chặt
- tận dụng CPU/GPU tối đa

Trong thực tế, C++ thường xuất hiện ở:

- inference runtime
- feature extraction
- media processing
- game server
- matching engine
- native module hoặc native service cho AI stack

## 2. Khi nào nên chọn C++?

| Tình huống | Có hợp không? | Vì sao |
|---|---|---|
| CRUD REST service thông thường | Thường không | Go/Java/Python ship nhanh hơn |
| Service cần latency 1-10 ms | Hợp | Kiểm soát allocation và scheduling tốt |
| Inference runtime / feature extraction | Hợp | Tối ưu CPU/GPU tốt |
| High-throughput batching service | Hợp | Dễ zero-copy, buffer reuse |
| Python AI stack có hot path nặng | Hợp | Dùng C++ cho phần nóng |

> **Rule of thumb:** chỉ chọn C++ khi runtime efficiency ảnh hưởng rõ đến business outcome. Nếu không, chi phí kỹ thuật thường không đáng.

## 3. Khi nào không nên chọn C++?

Không nên chọn C++ nếu:

- bài toán chủ yếu là CRUD, workflow business, admin portal
- team chưa đủ mạnh về ownership, memory, concurrency
- time-to-market quan trọng hơn tối ưu cuối cùng

Trong nhiều case, giải pháp thực tế hơn là:

- app chính viết bằng Python/Go/Java
- phần nóng tách sang native module hoặc service C++

## 4. Bản đồ các chủ đề lớn

### 4.1. Core Language

Tập trung vào:

- value/reference semantics
- `const` correctness
- move semantics
- Rule of Zero / Rule of Five
- RAII
- templates

### 4.2. Memory & Performance

Tập trung vào:

- stack vs heap
- smart pointers
- cache locality
- `string_view`, `span`, zero-copy
- allocator, pool, arena

### 4.3. Concurrency & Networking

Tập trung vào:

- `thread`, `mutex`, `atomic`
- `condition_variable`
- thread pool
- coroutines
- async networking
- gRPC, REST, message queue
- backpressure

### 4.4. AI Systems

Tập trung vào:

- vì sao AI stack hay dùng C++
- bridge với Python
- ONNX Runtime, TensorRT, LibTorch
- batching, warm-up, GPU resource management

### 4.5. Build, Profiling & Production

Tập trung vào:

- CMake, Conan, vcpkg
- sanitizers
- profiling
- warning discipline
- production best practices

## 5. Lộ trình học thực tế

1. Học `Core Language` trước.
2. Học `Memory & Performance` ngay sau đó vì đây là khác biệt lớn nhất của C++.
3. Học `Concurrency & Networking` để viết service thật.
4. Nếu làm AI thì đi sâu vào `AI Systems`.
5. Kết thúc bằng `Build, Profiling & Production`.

## 6. Nếu mục tiêu là hệ thống AI

Thứ tự hợp lý thường là:

1. Core Language
2. Memory & Performance
3. Concurrency & Networking
4. AI Systems
5. Production

Vì trong AI stack, C++ thường không chỉ là "ngôn ngữ nhanh", mà là nơi gánh:

- runtime quan trọng
- buffer management
- zero-copy path
- GPU integration
- native extension cho Python

## 7. Cách dùng bộ tài liệu này

- Nếu bạn mới học C++, đừng nhảy ngay vào networking hay TensorRT. Hãy chắc fundamentals và memory trước.
- Nếu bạn đang làm backend thường nhưng muốn học C++ cho performance-critical systems, đọc từ mục 4.1 tới 4.3.
- Nếu bạn đang làm AI infra, hãy ưu tiên `Memory & Performance`, `AI Systems` và `Production`.

## 8. Câu hỏi định hướng hay gặp

### 8.1. C++ mạnh nhất ở đâu trong backend?

Mạnh nhất ở low latency, memory control, zero-copy path, CPU/GPU intensive runtime.

### 8.2. C++ khó nhất ở đâu?

Khó nhất ở ownership, lifetime, concurrency và cost of wrong abstractions.

### 8.3. C++ có luôn tốt hơn Python/Go/Java không?

Không. Nó chỉ tốt hơn khi performance và control thực sự quan trọng hơn chi phí kỹ thuật.
