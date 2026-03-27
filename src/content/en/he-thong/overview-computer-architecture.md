# System Design

## 7. Computer Architecture

### 7.1. Memory Hierarchy

Understanding the memory hierarchy is fundamental to designing performant systems.

| Level | Storage | Access Time | Capacity | Purpose |
|---|---|---|---|---|
| **CPU Register** | Flip-flops | 0.5 ns | ~1 KB | Fastest — direct CPU access |
| **L1 Cache** | SRAM | ~1 ns | 32–64 KB | Core-local, fastest cache |
| **L2 Cache** | SRAM | ~3–10 ns | 256 KB–2 MB | Core-local or shared |
| **L3 Cache** | SRAM | ~10–20 ns | 4–64 MB | Shared across cores |
| **RAM** | DRAM | ~100 ns | 4–256 GB | Main working memory |
| **SSD** | Flash | ~100 μs | 128 GB–8 TB | Fast persistent storage |
| **HDD** | Magnetic | ~5–10 ms | 1–20 TB | Cheap, slow persistent storage |
| **Network/Remote** | Various | ~1–100 ms | Unlimited | Distributed storage |

> **Key concept:** The CPU always checks caches first. A **cache hit** means the data was found in cache (fast). A **cache miss** means it must be fetched from the next level down.

### 7.2. Speed Comparison

```
Register (0.5 ns)  >>>  L1 Cache (1 ns)  >>>  L2 (5 ns)  >>>  L3 (10 ns)
>>>  RAM (100 ns)  >>>  SSD (100 μs)  >>>  HDD (10 ms)  >>>  Network (100 ms)
```

| From \ To | Register | L1 | L2 | L3 | RAM | SSD | HDD |
|---|---|---|---|---|---|---|---|
| **Register** | 1x | 2x | 10x | 20x | 200x | 200,000x | 20,000,000x |

### 7.3. CPU Cache Basics

#### 7.3.1. Cache Lines

Data is transferred between memory and cache in fixed-size blocks called **cache lines**, typically 64 bytes.

#### 7.3.2. Temporal vs. Spatial Locality

- **Temporal Locality:** Recently accessed data is likely to be accessed again. Cached by keeping data in L1/L2/L3.
- **Spatial Locality:** Items near recently accessed data are likely to be accessed next. Exploited by loading entire cache lines.

#### 7.3.3. Cache Eviction Policies

| Policy | Description |
|---|---|
| **LRU** | Evict least recently used |
| **LFU** | Evict least frequently used |
| **FIFO** | Evict oldest entry |
| **Random** | Evict randomly (used by some real-world CPUs) |

### 7.4. CPU Architecture

#### 7.4.1. Von Neumann vs. Harvard

| Model | Description | Use Case |
|---|---|---|
| **Von Neumann** | Shared memory for code and data | Most general-purpose CPUs |
| **Harvard** | Separate memory for code and data | Embedded, DSP, microcontrollers |

#### 7.4.2. Single-Core vs. Multi-Core

- **Single-core:** One processing unit, one execution thread
- **Multi-core:** Multiple independent cores on a single chip
- **Hyper-Threading:** Each physical core appears as 2 logical cores (Intel)
- **SIMD (SSE/AVX):** Single instruction, multiple data — vector processing

### 7.5. Important Terminology

| Term | Definition |
|---|---|
| **Clock Speed** | Frequency of CPU's internal clock (GHz). Higher = faster clock cycles |
| **IPC (Instructions Per Cycle)** | How many instructions a CPU can execute per clock cycle |
| **Throughput** | Number of tasks completed per unit of time |
| **Latency** | Time to complete a single operation |
| **Bandwidth** | Maximum data transfer rate |
| **TLB (Translation Lookaside Buffer)** | Cache for virtual-to-physical address translations |
| **Prefetching** | CPU predicts future memory access and loads data in advance |

### 7.6. Practical Implications for System Design

- **Database indexing:** Minimizes disk I/O (slow) by keeping data in RAM
- **Caching:** Redis/Memcached keep hot data in RAM, far faster than disk
- **Batch processing:** Process data in memory, then write to disk once
- **CDN:** Serve static content from edge servers close to users
- **Message queues:** Decouple producers from consumers to handle bursts

> **Tip:** In system design interviews, when discussing performance, always be aware of the memory hierarchy. The fastest solution is usually to serve data from a higher level of the hierarchy.
