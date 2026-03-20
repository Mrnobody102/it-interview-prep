# System Design

## 7. Kiến trúc máy tính

### 7.1. Memory Hierarchy

Hiểu memory hierarchy là nền tảng để thiết kế các hệ thống high-performance.

| Level | Storage | Access Time | Capacity | Purpose |
|---|---|---|---|---|
| **CPU Register** | Flip-flops | 0.5 ns | ~1 KB | Nhanh nhất — truy cập trực tiếp từ CPU |
| **L1 Cache** | SRAM | ~1 ns | 32–64 KB | Core-local, cache nhanh nhất |
| **L2 Cache** | SRAM | ~3–10 ns | 256 KB–2 MB | Core-local hoặc shared |
| **L3 Cache** | SRAM | ~10–20 ns | 4–64 MB | Shared across cores |
| **RAM** | DRAM | ~100 ns | 4–256 GB | Main working memory |
| **SSD** | Flash | ~100 μs | 128 GB–8 TB | Fast persistent storage |
| **HDD** | Magnetic | ~5–10 ms | 1–20 TB | Cheap, slow persistent storage |
| **Network/Remote** | Various | ~1–100 ms | Unlimited | Distributed storage |

> **Khái niệm quan trọng:** CPU luôn check caches trước. **Cache hit** có nghĩa là data được tìm thấy trong cache (nhanh). **Cache miss** có nghĩa là phải fetch từ tầng thấp hơn.

### 7.2. So sánh tốc độ

```
Register (0.5 ns)  >>>  L1 Cache (1 ns)  >>>  L2 (5 ns)  >>>  L3 (10 ns)
>>>  RAM (100 ns)  >>>  SSD (100 μs)  >>>  HDD (10 ms)  >>>  Network (100 ms)
```

### 7.3. CPU Cache Basics

#### 7.3.1. Cache Lines

Data được transfer giữa memory và cache theo các blocks cố định gọi là **cache lines**, thường là 64 bytes.

#### 7.3.2. Temporal vs. Spatial Locality

- **Temporal Locality:** Data được truy cập gần đây có khả năng được truy cập lại. Được cache bằng cách giữ data trong L1/L2/L3.
- **Spatial Locality:** Các items gần data được truy cập gần đây có khả năng được truy cập tiếp. Khai thác bằng cách load toàn bộ cache lines.

### 7.4. CPU Architecture

#### 7.4.1. Von Neumann vs. Harvard

| Model | Mô tả | Use Case |
|---|---|---|
| **Von Neumann** | Shared memory cho code và data | Hầu hết general-purpose CPUs |
| **Harvard** | Separate memory cho code và data | Embedded, DSP, microcontrollers |

#### 7.4.2. Single-Core vs. Multi-Core

- **Single-core:** Một processing unit, một execution thread
- **Multi-core:** Nhiều independent cores trên một chip
- **Hyper-Threading:** Mỗi physical core xuất hiện như 2 logical cores (Intel)
- **SIMD (SSE/AVX):** Single instruction, multiple data — vector processing

### 7.5. Thuật ngữ quan trọng

| Thuật ngữ | Định nghĩa |
|---|---|
| **Clock Speed** | Tần số của CPU's internal clock (GHz). Cao hơn = nhanh hơn |
| **IPC (Instructions Per Cycle)** | CPU có thể execute bao nhiêu instructions mỗi clock cycle |
| **Throughput** | Số tasks hoàn thành trên đơn vị thời gian |
| **Latency** | Thời gian hoàn thành một operation đơn lẻ |
| **Bandwidth** | Tốc độ transfer data tối đa |
| **TLB (Translation Lookaside Buffer)** | Cache cho virtual-to-physical address translations |
| **Prefetching** | CPU dự đoán future memory access và load data trước |

### 7.6. Implications thực tế cho System Design

- **Database indexing:** Giảm thiểu disk I/O (chậm) bằng cách giữ data trong RAM
- **Caching:** Redis/Memcached giữ hot data trong RAM, nhanh hơn disk rất nhiều
- **Batch processing:** Xử lý data trong memory, rồi write vào disk một lần
- **CDN:** Phục vụ static content từ edge servers gần users
- **Message queues:** Decouple producers từ consumers để xử lý bursts

> **Tip:** Trong phỏng vấn system design, khi thảo luận về performance, luôn nhận thức về memory hierarchy. Giải pháp nhanh nhất thường là phục vụ data từ tầng cao hơn của hierarchy.
