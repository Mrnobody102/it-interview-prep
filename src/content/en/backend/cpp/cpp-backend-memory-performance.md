# Memory & Performance

## 1. Overview

This is the area where `C++` differs most from many backend languages. In high-throughput services or AI inference paths, weak memory discipline shows up quickly in tail latency.

## 2. Stack vs heap

| Memory region | Characteristics | Typical use |
|---|---|---|
| Stack | very fast, automatic cleanup | small local objects |
| Heap | flexible lifetime | large buffers, shared state |

Not everything should go on the heap.

## 3. Smart pointers

```cpp
auto model = std::make_unique<Model>();
auto cache = std::make_shared<Cache>();
std::weak_ptr<Cache> cache_ref = cache;
```

### 3.1. Practical rules

- default to `unique_ptr`
- use `shared_ptr` only for real shared ownership
- use `weak_ptr` to break cycles

### 3.2. Common mistake

In hot paths, overusing `shared_ptr` often makes ownership blurry and adds overhead.

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

Better data layout reduces:

- pointer chasing
- cache misses
- fragmentation

This matters especially for:

- inference
- vector search
- large-batch preprocessing

## 5. `string_view`, `span`, zero-copy

```cpp
void parse_header(std::string_view raw);
void process(std::span<const float> values);
```

Very useful when you want to:

- parse without copying strings
- pass a view into a buffer
- work with tensor slices without changing ownership

## 6. Allocators, pools, arenas

High-performance services often use:

- arena allocators for request-scoped memory
- object pools for reuse
- buffer reuse for inference batches
- pre-allocation for queues and scratch buffers

The goal is to reduce allocation churn.

## 7. Common memory bugs

- dangling references
- use-after-free
- double free
- iterator invalidation
- false sharing

You should know how to use:

- AddressSanitizer
- UndefinedBehaviorSanitizer
- ThreadSanitizer

## 8. Connection to AI systems

In AI systems, memory and performance discipline often decides:

- p95 latency
- batch throughput
- CPU cache efficiency
- how many concurrent requests fit without blowing up RAM or VRAM

## 9. Best practices

- shape data layout around the real access pattern
- limit allocations in hot paths
- prefer contiguous buffers when reasonable
- use profilers instead of guessing

## 10. Common interview questions

### 10.1. What is the difference between `unique_ptr` and `shared_ptr`?

`unique_ptr` has one owner and should be the default. `shared_ptr` adds reference-count overhead and should be used only for real shared ownership.

### 10.2. Why does cache locality matter?

Because modern CPUs are much faster than RAM. Better data layout reduces cache misses and improves throughput significantly.

### 10.3. What is `string_view` for?

It is for passing a read-only view into a string or buffer without copying ownership.
