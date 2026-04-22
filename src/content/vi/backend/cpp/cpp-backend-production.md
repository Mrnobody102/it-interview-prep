# Build, Profiling & Production

## 1. Tổng quan

`C++` production không chỉ là code chạy đúng. Nó còn là:

- build reproducible
- profiling đúng
- warning sạch
- sanitizer chạy thường xuyên

## 2. Tooling nên có

- CMake
- Conan hoặc vcpkg
- clang-tidy / cppcheck
- GoogleTest / Catch2
- Google Benchmark

## 3. Sanitizers

Ba loại quan trọng nhất:

```bash
-fsanitize=address
-fsanitize=undefined
-fsanitize=thread
```

Nếu làm service concurrency hoặc native AI runtime mà không dùng sanitizer, rất dễ để lọt lỗi khó bắt.

## 4. Profiling

Các tool thường dùng:

- `perf`
- `valgrind`
- `heaptrack`
- flamegraph
- NVIDIA Nsight

Nguyên tắc quan trọng nhất: profile trước, tối ưu sau.

## 5. Production best practices

- ưu tiên Rule of Zero
- tránh raw `new/delete`
- ownership phải rõ trong API
- queue phải bounded
- timeout cho mọi I/O
- đừng rải `shared_ptr` khắp nơi
- đo p50/p95/p99 latency, queue depth, memory usage

## 6. Common pitfalls

- build không reproducible giữa máy dev và CI
- optimize trước khi profile
- warning bị bỏ qua quá lâu
- thiếu sanitizer trong test pipeline
- không có metrics cho queue/memory/latency

## 7. Best practices

- compile warning nên nghiêm túc ngay từ đầu
- benchmark phải phản ánh workload thật
- production metrics phải được expose từ đầu
- native service càng quan trọng càng phải có canary/rollback strategy

## 8. Câu hỏi phỏng vấn hay gặp

### 8.1. `volatile` có dùng cho multithreading không?

Không. Nó không giải quyết data race. Hãy dùng atomic hoặc mutex.

### 8.2. Vì sao sanitizer quan trọng?

Vì nhiều lỗi memory và concurrency trong C++ rất khó bắt bằng mắt hoặc bằng unit test thông thường.

### 8.3. Vì sao phải profile trước khi tối ưu?

Vì C++ rất dễ tối ưu nhầm chỗ. Nếu không đo bằng profiler, bạn dễ tốn effort vào phần không phải bottleneck.
