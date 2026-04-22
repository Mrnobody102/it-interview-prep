# Build, Profiling & Production

## 1. Overview

Production `C++` is not only about code that works. It is also about:

- reproducible builds
- correct profiling
- clean warnings
- regular sanitizer usage

## 2. Recommended tooling

- CMake
- Conan or vcpkg
- clang-tidy / cppcheck
- GoogleTest / Catch2
- Google Benchmark

## 3. Sanitizers

The three most important ones:

```bash
-fsanitize=address
-fsanitize=undefined
-fsanitize=thread
```

If you build concurrent services or native AI runtimes without sanitizers, important bugs are likely being missed.

## 4. Profiling

Common tools:

- `perf`
- `valgrind`
- `heaptrack`
- flamegraphs
- NVIDIA Nsight

The most important rule: profile first, optimize second.

## 5. Production best practices

- prefer Rule of Zero
- avoid raw `new/delete`
- make ownership explicit in APIs
- keep queues bounded
- put timeouts on all I/O
- do not spread `shared_ptr` everywhere
- measure p50/p95/p99 latency, queue depth, and memory usage

## 6. Common pitfalls

- non-reproducible builds between dev machines and CI
- optimizing before profiling
- letting warnings accumulate
- skipping sanitizers in the test pipeline
- no metrics for queue, memory, or latency

## 7. Best practices

- keep compile warnings strict from the start
- benchmarks should reflect real workloads
- production metrics should be exposed early
- the more critical the native service, the more important canary and rollback strategy become

## 8. Common interview questions

### 8.1. Should `volatile` be used for multithreading?

No. It does not solve data races. Use atomics or mutexes.

### 8.2. Why are sanitizers important?

Because many memory and concurrency bugs in C++ are difficult to catch with visual inspection or ordinary unit tests.

### 8.3. Why should you profile before optimizing?

Because C++ makes it easy to optimize the wrong thing. Without a profiler, effort is often spent away from the real bottleneck.
