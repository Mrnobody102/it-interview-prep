# Runtime & Concurrency

## 1. Overview

To write good Python backend systems, you need to understand the runtime model:

- GIL
- async I/O
- threads
- processes
- concurrency limits
- timeout and cancellation

Many slow services are slow not because the framework is weak, but because the execution model was chosen poorly.

## 2. What is the GIL?

### 2.1. The core idea

The `GIL` is the `Global Interpreter Lock`. In CPython, only one thread can execute Python bytecode at a time inside a process.

### 2.2. Practical effects

- I/O-bound work still does well with threads or async
- CPU-bound pure Python does not scale well with threads
- native libraries such as NumPy or PyTorch can still be fast because the hot code is not Python bytecode

### 2.3. Common misunderstanding

- hearing "Python has threads" and assuming CPU-bound scaling will be good
- not distinguishing Python-level compute from native-runtime compute

## 3. Threads vs async vs multiprocessing

| Situation | Better choice | Why |
|---|---|---|
| DB, HTTP, Redis calls | `async` | I/O-bound, high concurrency |
| Sync SDK integration | `thread` | easier to integrate |
| CPU-bound pure Python | `multiprocessing` | bypasses the GIL |
| Long retryable work | queue + worker | more robust than request threads |

## 4. `async` / `await`

### 4.1. When does it fit?

`async` is a strong fit for backends with many concurrent I/O operations:

- DB queries
- downstream HTTP calls
- object storage
- message brokers

```python
import httpx

async def fetch_profile(user_id: str) -> dict:
    async with httpx.AsyncClient(timeout=5.0) as client:
        response = await client.get(f"https://api.example.com/users/{user_id}")
        response.raise_for_status()
        return response.json()
```

### 4.2. Common mistakes

- running heavy sync code inside async routes
- using sync SDKs on the event loop
- spawning too many concurrent tasks without limits

### 4.3. Signs that async is going wrong

- p95 grows sharply under load
- event loop latency rises
- downstream slowdowns create timeout cascades

## 5. Semaphore, timeout, and backpressure

### 5.1. Concurrency limits

Production services need to stop unbounded fan-out.

```python
import asyncio

downstream_limit = asyncio.Semaphore(20)

async def call_embedding_api(payload: dict) -> dict:
    async with downstream_limit:
        ...
```

### 5.2. Why does it matter?

Without limits:

- the event loop stays alive while downstreams fail
- queues grow silently
- tail latency explodes

### 5.3. Timeout and cancellation

Good concurrency without timeouts is still dangerous.

Always think about:

- request timeouts
- downstream timeouts
- task cancellation
- bounded retries

## 6. Multiprocessing

### 6.1. When does it fit?

- CPU-heavy preprocessing
- heavy document parsing
- file, video, or audio conversion
- code that does not benefit enough from native vectorized libraries

### 6.2. What does it cost?

- memory copying between processes
- startup overhead
- IPC overhead
- harder debugging than thread or async setups

## 7. Common real-world patterns

### 7.1. Async API service

- FastAPI
- async DB drivers
- async HTTP clients
- explicit timeout and retry policies

### 7.2. Separate worker process

- Celery workers
- dedicated CPU-heavy workers
- dedicated model/GPU processes

### 7.3. Hybrid architecture

- API layer receives requests
- long work goes through queues
- results return through polling, webhooks, or streaming

## 8. Common pitfalls

- blocking the event loop with pandas, heavy regex, or file parsing
- no downstream timeouts
- too many open clients or connections
- no concurrency limits
- using threads for CPU-bound Python and assuming it will scale

## 9. Best practices

- distinguish I/O-bound from CPU-bound work
- put timeouts on every external call
- bound queues and concurrency
- do not run long pipelines in request handlers
- measure p50/p95/p99 and queue depth

## 10. Common interview questions

### 10.1. How does the GIL affect backend systems?

It makes CPU-bound Python code scale poorly with threads in one process, while I/O-bound services still perform well with async or threads.

### 10.2. Is `async` always faster than threads?

No. It fits I/O-bound workloads and async-friendly ecosystems better.

### 10.3. When should you use multiprocessing?

When the workload is CPU-bound pure Python or heavy preprocessing that does not benefit enough from async or threads.
