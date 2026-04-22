# Memory & Performance

## 1. Tổng quan

Đây là phần làm nên khác biệt lớn nhất của `C++` so với nhiều backend language khác. Với service throughput cao hoặc AI inference, chỉ cần quản lý memory tệ là tail latency sẽ tăng rõ.

## 2. Stack vs Heap

| Vùng nhớ | Đặc điểm | Dùng khi nào |
|---|---|---|
| Stack | rất nhanh, tự cleanup | object local nhỏ |
| Heap | lifetime linh hoạt | buffer lớn, shared state |

Không phải cái gì cũng nên đẩy lên heap.

## 3. Smart pointers

```cpp
auto model = std::make_unique<Model>();
auto cache = std::make_shared<Cache>();
std::weak_ptr<Cache> cache_ref = cache;
```

### 3.1. Quy tắc thực dụng

- mặc định dùng `unique_ptr`
- chỉ dùng `shared_ptr` khi thực sự có shared ownership
- dùng `weak_ptr` để phá cycle

### 3.2. Sai lầm phổ biến

Ở hot path, lạm dụng `shared_ptr` thường làm ownership mờ đi và thêm overhead không cần thiết.

## 4. Cache locality

```cpp
struct Bad {
    std::vector<std::vector<float>> rows;
};

struct Good {
    std::vector<float> flat;
    size_t rows;
    size_t cols;
};
```

Data layout tốt sẽ giảm:

- pointer chasing
- cache miss
- fragmentation

Điểm này đặc biệt quan trọng với:

- inference
- vector search
- preprocessing batch lớn

## 5. `string_view`, `span`, zero-copy

```cpp
void parse_header(std::string_view raw);
void process(std::span<const float> values);
```

Rất hữu ích khi muốn:

- parse mà không copy string
- truyền view vào buffer
- xử lý tensor slice mà không đổi ownership

## 6. Allocator, pool, arena

Các service hiệu năng cao thường dùng:

- arena allocator cho memory theo request
- object pool cho object reuse
- buffer reuse cho inference batch
- pre-allocation cho queue và scratch buffer

Mục tiêu là giảm allocation churn.

## 7. Lỗi memory hay gặp

- dangling reference
- use-after-free
- double free
- iterator invalidation
- false sharing

Nên luôn biết dùng:

- AddressSanitizer
- UndefinedBehaviorSanitizer
- ThreadSanitizer

## 8. Liên hệ với AI systems

Trong hệ AI, phần memory/performance thường quyết định:

- p95 latency
- batch throughput
- khả năng tận dụng CPU cache
- số request chạy đồng thời mà không nổ RAM/VRAM

## 9. Best practices

- data layout phải tối ưu cho access pattern thật
- hạn chế allocation trong hot path
- prefer contiguous buffer khi hợp lý
- đo bằng profiler, đừng đoán

## 10. Câu hỏi phỏng vấn hay gặp

### 10.1. `unique_ptr` và `shared_ptr` khác nhau thế nào?

`unique_ptr` có một owner và nên là default. `shared_ptr` có ref-count overhead và chỉ nên dùng khi thật sự có shared ownership.

### 10.2. Vì sao cache locality quan trọng?

Vì CPU hiện đại nhanh hơn RAM rất nhiều. Data layout tốt giúp giảm cache miss và tăng throughput đáng kể.

### 10.3. `string_view` dùng để làm gì?

Để truyền read-only view vào string/buffer mà không cần copy ownership.
