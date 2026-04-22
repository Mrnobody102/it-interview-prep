# AI Systems

## 1. Overview

In modern AI systems, `Python` usually handles orchestration, while `C++` often owns the critical runtime pieces:

- model runtimes
- tensor kernels
- media preprocessing
- vector search cores
- GPU integration

## 2. Why do AI stacks use C++?

Because C++ gives you:

- strong memory control
- low latency
- easier zero-copy paths
- direct access to SIMD, GPU, and native libraries

## 3. Common use cases

| Use case | Why C++ fits |
|---|---|
| Inference runtime | low latency, tight memory control |
| Embedding generation | strong CPU/GPU utilization |
| Vision pipeline | strong OpenCV/FFmpeg/TensorRT ecosystem |
| Custom operators | native performance |
| Vector DB core | strong data-structure and SIMD control |

## 4. Integration with Python

### 4.1. Common approaches

- `pybind11`
- `Cython`
- the Python C API
- a separate C++ service over gRPC or HTTP

```cpp
#include <pybind11/pybind11.h>
#include <pybind11/stl.h>

std::vector<float> l2_normalize(const std::vector<float>& x) {
    float sum = 0.0f;
    for (float v : x) sum += v * v;
    float norm = std::sqrt(sum);

    std::vector<float> out;
    out.reserve(x.size());
    for (float v : x) out.push_back(v / norm);
    return out;
}

PYBIND11_MODULE(ai_native, m) {
    m.def("l2_normalize", &l2_normalize);
}
```

### 4.2. When should you split it into a separate service?

- native crashes must not take down the main app
- scaling must be independent
- GPU ownership must be isolated
- multiple languages must call the same runtime

## 5. Common runtimes

- ONNX Runtime
- TensorRT
- OpenVINO
- LibTorch
- XGBoost C++ predictor

## 6. Inference service pattern

A common flow:

1. receive request
2. parse and validate
3. preprocess
4. batch
5. run the model
6. postprocess
7. emit metrics and traces
8. return the response

## 7. What usually needs optimization?

- model warm-up
- pre-allocated buffers
- dynamic batching
- thread pinning when justified
- fewer copies across Python, C++, and GPU
- reusable execution contexts

## 8. GPU resource management

Things to watch:

- stream and context count
- pinned memory
- batch size vs VRAM
- fragmentation during repeated load and unload

## 9. Best practices

- native paths need observability too
- do not optimize blindly; profile first
- isolate the parts most likely to crash or leak
- buffer and tensor ownership must be explicit

## 10. Common interview questions

### 10.1. Why do AI systems use C++ when orchestration is written in Python?

Because runtime, kernels, heavy preprocessing, and GPU integration need stronger performance and control.

### 10.2. When should you use `pybind11` instead of a separate service?

When you need direct in-process calls from Python and the boundary is simple. If you need isolation, independent scaling, or cleaner GPU ownership, a separate service is often better.

### 10.3. Why is warm-up important in inference systems?

It avoids abnormal first-request latency caused by model loading, context creation, or graph compilation.
