# Concurrency & Networking

## 1. Overview

Real C++ services require more than syntax. You need to understand:

- data synchronization
- work queues
- networking models
- backpressure

Without that, a system can look fast in a small benchmark and still behave badly in production.

## 2. `thread`, `mutex`, `lock_guard`

```cpp
std::mutex mtx;
int counter = 0;

void inc() {
    std::lock_guard<std::mutex> lock(mtx);
    ++counter;
}
```

### 2.1. Important points

- keep lock scope short
- do not hold locks around I/O or slow work
- deadlock prevention is a design responsibility

## 3. `atomic`

```cpp
std::atomic<uint64_t> request_id{0};
auto id = request_id.fetch_add(1, std::memory_order_relaxed);
```

Good for:

- metrics counters
- request IDs
- simple flags

It does not replace mutexes when logic needs multi-step invariants.

## 4. `condition_variable` and queues

`condition_variable` appears frequently in worker queues, producer-consumer setups, and background flushing.

Important concerns:

- correct shutdown
- clear wake-up conditions
- bounded queues

## 5. Thread pools

Thread pools are a very common backend pattern for:

- CPU-heavy preprocessing
- background tasks
- bounded work queues
- internal request fan-out

A production thread pool should define:

- queue capacity
- rejection policy
- graceful shutdown
- queue depth metrics

## 6. Coroutines and async networking

C++20 coroutines are useful for:

- async I/O
- streaming pipelines
- multi-stage inference flows

But they still need a good runtime and executor model, not just syntax.

Common libraries:

- Boost.Asio
- Drogon
- oatpp
- gRPC C++

## 7. REST, gRPC, and message queues

| Communication style | Good fit |
|---|---|
| REST/JSON | edge APIs, easy integrations |
| gRPC | low-latency internal services |
| Kafka/RabbitMQ | async workflows |

In AI systems:

- REST often sits at the edge
- gRPC often connects orchestrators to model workers
- MQ often drives offline pipelines

## 8. Backpressure

If requests arrive faster than the system can process them, you need:

- bounded queues
- early rejection
- degradation strategies
- batch control

Without backpressure, tail latency and memory usage rise very quickly.

## 9. Common pitfalls

- unbounded queues
- too many threads
- heavy lock contention
- no I/O timeouts
- not measuring queue depth and p99 latency

## 10. Best practices

- bounded queues should be the default
- all I/O should have timeouts
- do not use thread count as your only performance knob
- measure contention, queue depth, and p99 instead of only average latency

## 11. Common interview questions

### 11.1. Can `atomic` replace `mutex`?

No. It fits simple state or single operations, but not multi-step logic with invariants.

### 11.2. Why is backpressure important?

Because if incoming traffic exceeds processing capacity and there is no bounded queue or rejection policy, latency and memory usage will explode.

### 11.3. What does a good thread pool need?

Queue capacity, rejection policy, graceful shutdown, and metrics.
