# Concurrency & Networking

## 1. Tổng quan

Service C++ thực chiến không thể chỉ biết syntax. Phải hiểu:

- đồng bộ dữ liệu
- work queue
- networking model
- backpressure

Nếu không, hệ thống có thể rất nhanh ở benchmark nhỏ nhưng rất tệ trong production.

## 2. `thread`, `mutex`, `lock_guard`

```cpp
std::mutex mtx;
int counter = 0;

void inc() {
    std::lock_guard<std::mutex> lock(mtx);
    ++counter;
}
```

### 2.1. Điều quan trọng

- lock scope phải ngắn
- đừng giữ lock khi gọi I/O hoặc code chậm
- deadlock prevention là trách nhiệm thiết kế

## 3. `atomic`

```cpp
std::atomic<uint64_t> request_id{0};
auto id = request_id.fetch_add(1, std::memory_order_relaxed);
```

Hợp cho:

- metrics counter
- request id
- simple flag

Không thay thế mutex nếu logic cần invariant nhiều bước.

## 4. `condition_variable` và queue

`condition_variable` rất hay xuất hiện trong worker queue, producer-consumer, background flushing.

Điểm cần quan tâm:

- shutdown đúng
- wake-up condition rõ
- queue có giới hạn

## 5. Thread pool

Thread pool là pattern backend cực hay dùng cho:

- CPU-heavy preprocessing
- background tasks
- bounded work queue
- request fan-out nội bộ

Một thread pool production nên có:

- queue capacity
- rejection policy
- graceful shutdown
- metrics queue depth

## 6. Coroutines và async networking

C++20 coroutines hữu ích cho:

- async I/O
- streaming pipeline
- nhiều stage inference flow

Nhưng phải có runtime/executor tử tế, chứ không chỉ có syntax.

Các thư viện hay gặp:

- Boost.Asio
- Drogon
- oatpp
- gRPC C++

## 7. REST, gRPC, message queue

| Kiểu giao tiếp | Phù hợp |
|---|---|
| REST/JSON | edge API, dễ tích hợp |
| gRPC | internal service latency thấp |
| Kafka/RabbitMQ | workflow async |

Trong AI systems:

- REST thường ở edge
- gRPC thường giữa orchestrator và model worker
- MQ thường cho offline pipeline

## 8. Backpressure

Nếu request vào nhanh hơn khả năng xử lý thì phải có:

- bounded queue
- reject sớm
- degrade strategy
- batch control

Không có backpressure thì tail latency và memory usage sẽ tăng rất nhanh.

## 9. Common pitfalls

- queue vô hạn
- mở quá nhiều thread
- lock contention quá nặng
- không có timeout cho I/O
- không đo queue depth và p99

## 10. Best practices

- bounded queue là mặc định
- mọi I/O đều cần timeout
- đừng dùng thread count như núm vặn hiệu năng duy nhất
- đo contention, queue depth, p99 thay vì chỉ nhìn average latency

## 11. Câu hỏi phỏng vấn hay gặp

### 11.1. `atomic` có thay thế được mutex không?

Không. Nó chỉ phù hợp cho state đơn giản hoặc operation đơn lẻ, không thay thế logic nhiều bước cần invariant.

### 11.2. Vì sao backpressure quan trọng?

Vì nếu traffic vào lớn hơn khả năng xử lý mà không có bounded queue/reject policy thì latency và memory usage sẽ nổ.

### 11.3. Thread pool tốt cần gì?

Cần queue capacity, rejection policy, graceful shutdown và metrics.
