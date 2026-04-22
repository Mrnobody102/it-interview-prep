# AI Systems

## 1. Overview

`Python` is close to the default language for the orchestration layer in AI systems:

- model serving
- embedding pipelines
- RAG
- agent backends
- evaluation pipelines

Python is strong because of its ecosystem, but production quality requires architecture, not just model calls.

## 2. Common Python roles in AI backends

| Role | How strong is Python here? |
|---|---|
| Training pipeline | Very strong |
| Data preprocessing | Very strong |
| Inference API | Strong |
| RAG orchestration | Very strong |
| Workflow orchestration | Very strong |
| Ultra-low latency native core | Usually delegated to C++/Rust |

## 3. Model loading

### 3.1. Basic rules

Models should not be loaded per request.

- load once at startup
- warm up immediately
- make readiness checks reflect real model readiness
- keep model config out of route handlers

### 3.2. Common mistakes

- creating tokenizers or sessions per request
- having readiness checks that only prove the process is alive
- loading the same model across too many uncontrolled workers

## 4. Batching

### 4.1. Why does batching matter?

Batching is critical for:

- embedding services
- LLM inference
- vision inference

### 4.2. Trade-offs

- larger batches improve throughput
- overly large batches hurt latency

In real systems, batching usually needs a short deadline to balance throughput and p95 latency.

## 5. GPU process model

### 5.1. Things to watch carefully

- number of worker processes
- CUDA contexts
- VRAM fragmentation
- forking after CUDA initialization

### 5.2. Common pattern

- one process owns the model and GPU
- the API layer routes requests into that process
- or a separate model worker/service owns the GPU

## 6. RAG and vector databases

Python backends often sit at the orchestration layer:

1. receive the query
2. call the embedding model
3. search top-k in the vector DB
4. fetch metadata and chunks
5. rerank
6. call the LLM
7. stream the response

Common technologies:

- `pgvector`
- `Qdrant`
- `Milvus`
- `Weaviate`
- `OpenSearch` / `Elasticsearch`

## 7. File and object storage

AI systems almost always need object storage for:

- raw documents
- images, videos, audio
- model artifacts
- versioned prompt or config assets

Common choices:

- S3
- GCS
- Azure Blob

## 8. Common bottlenecks

- tokenization or preprocessing in pure Python
- huge JSON payloads
- blocked event loops
- model loading in the wrong place
- sync model execution inside unbounded request threads
- repeated tensor and buffer copies

## 9. When should hot code move to native runtimes?

When:

- latency targets are very strict
- CPU cost is too high
- preprocessing is too heavy
- SIMD, GPU, or custom operators are needed

Teams usually respond with:

- vectorized NumPy or PyTorch ops
- C++ or Rust extensions
- dedicated native inference services

## 10. Best practices

- separate online inference from offline pipelines
- version models, prompts, and embedding configs clearly
- warm up models before serving traffic
- log and trace thoroughly without leaking sensitive data
- limit concurrency around important downstreams

## 11. Common interview questions

### 11.1. Is Python suitable for AI serving?

Yes, especially at the API and orchestration layers. But the hottest path may need a native runtime.

### 11.2. Why is model warm-up important?

It avoids abnormal first-request latency caused by loading weights, creating contexts, or compiling graphs.

### 11.3. Is batching always good?

No. It improves throughput but can hurt latency if the batch waits too long or grows too large.
