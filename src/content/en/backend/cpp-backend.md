# C++ Backend

## 1. Overview

`C++` is a strong choice for backend systems when the problem needs:

- very low latency
- very high throughput
- tight control over allocation and lifetime
- strong CPU/GPU utilization

In practice, C++ often appears in:

- inference runtimes
- feature extraction
- media processing
- game servers
- matching engines
- native modules or native services inside AI stacks

## 2. When should you choose C++?

| Scenario | Good fit? | Why |
|---|---|---|
| Typical CRUD REST service | Usually no | Go/Java/Python ship faster |
| 1-10 ms latency service | Yes | Better control of allocations and scheduling |
| Inference runtime / feature extraction | Yes | Strong CPU/GPU optimization |
| High-throughput batching service | Yes | Easier zero-copy and buffer reuse |
| Python AI stack with a heavy hot path | Yes | Use C++ for the hot path |

> **Rule of thumb:** choose C++ when runtime efficiency clearly affects the business outcome. Otherwise the engineering cost is often too high.

## 3. When is C++ not the right choice?

C++ is often not the right fit when:

- the problem is mostly CRUD, business workflows, or admin portals
- the team is not yet strong in ownership, memory, and concurrency
- time-to-market matters more than the last layer of optimization

In many cases, the more practical architecture is:

- main application in Python/Go/Java
- hot path extracted into a C++ module or service

## 4. Map of the large topics

### 4.1. Core Language

Focus areas:

- value and reference semantics
- `const` correctness
- move semantics
- Rule of Zero / Rule of Five
- RAII
- templates

### 4.2. Memory & Performance

Focus areas:

- stack vs heap
- smart pointers
- cache locality
- `string_view`, `span`, zero-copy
- allocators, pools, arenas

### 4.3. Concurrency & Networking

Focus areas:

- `thread`, `mutex`, `atomic`
- `condition_variable`
- thread pools
- coroutines
- async networking
- gRPC, REST, message queues
- backpressure

### 4.4. AI Systems

Focus areas:

- why AI stacks use C++
- bridges to Python
- ONNX Runtime, TensorRT, LibTorch
- batching, warm-up, GPU resource management

### 4.5. Build, Profiling & Production

Focus areas:

- CMake, Conan, vcpkg
- sanitizers
- profiling
- warning discipline
- production best practices

## 5. Practical learning path

1. Learn `Core Language` first.
2. Learn `Memory & Performance` right after it because this is the biggest C++ differentiator.
3. Learn `Concurrency & Networking` to build real services.
4. If your target is AI infrastructure, go deeper into `AI Systems`.
5. Finish with `Build, Profiling & Production`.

## 6. If your goal is AI systems

A practical order is:

1. Core Language
2. Memory & Performance
3. Concurrency & Networking
4. AI Systems
5. Production

Because in AI stacks, C++ is usually not just "the fast language". It often owns:

- critical runtimes
- buffer management
- zero-copy paths
- GPU integration
- native extensions called from Python

## 7. How to use this document set

- If you are new to C++, do not jump straight into networking or TensorRT. Be solid on fundamentals and memory first.
- If you already work in backend and want C++ for performance-critical systems, read from section 4.1 through 4.3.
- If you are building AI infrastructure, prioritize `Memory & Performance`, `AI Systems`, and `Production`.

## 8. Common interview questions

### 8.1. Where is C++ strongest in backend systems?

It is strongest in low-latency paths, memory control, zero-copy pipelines, and CPU/GPU intensive runtimes.

### 8.2. What is hardest about C++?

Ownership, lifetime, concurrency, and the cost of choosing the wrong abstraction.

### 8.3. Is C++ always better than Python/Go/Java?

No. It is only better when performance and control matter more than engineering cost.
