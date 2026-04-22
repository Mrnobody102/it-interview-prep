# AI Systems

## 1. Tổng quan

Trong hệ AI hiện đại, `Python` thường orchestration, còn `C++` thường gánh những phần runtime quan trọng:

- model runtime
- tensor kernels
- media preprocessing
- vector search core
- GPU integration

## 2. Vì sao AI stack hay dùng C++?

Vì C++ cho phép:

- kiểm soát memory tốt
- latency thấp
- dễ zero-copy
- tận dụng SIMD/GPU/native libraries

## 3. Use case phổ biến

| Use case | Vì sao C++ hợp |
|---|---|
| Inference runtime | latency thấp, memory control tốt |
| Embedding generation | CPU/GPU utilization tốt |
| Vision pipeline | ecosystem OpenCV/FFmpeg/TensorRT mạnh |
| Custom operator | native performance |
| Vector DB core | data structure + SIMD mạnh |

## 4. Tích hợp với Python

### 4.1. Các cách phổ biến

- `pybind11`
- `Cython`
- Python C API
- tách service riêng qua gRPC/HTTP

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

### 4.2. Khi nào nên tách service riêng?

- native crash không được kéo sập app chính
- cần scale độc lập
- cần isolate GPU ownership
- nhiều ngôn ngữ cùng gọi runtime

## 5. Runtime hay gặp

- ONNX Runtime
- TensorRT
- OpenVINO
- LibTorch
- XGBoost C++ predictor

## 6. Inference service pattern

Flow phổ biến:

1. nhận request
2. parse/validate
3. preprocess
4. batch
5. run model
6. postprocess
7. emit metrics/traces
8. trả response

## 7. Những chỗ cần tối ưu

- warm-up model
- pre-allocated buffers
- dynamic batching
- thread pinning khi thật cần
- giảm copy giữa Python, C++, GPU
- tái sử dụng execution context

## 8. GPU resource management

Cần để ý:

- stream/context count
- pinned memory
- batch size vs VRAM
- fragmentation khi load/unload nhiều lần

## 9. Best practices

- native path phải có observability
- đừng tối ưu mù, phải profile
- isolate phần dễ crash hoặc leak
- ownership của buffer và tensor phải cực rõ

## 10. Câu hỏi phỏng vấn hay gặp

### 10.1. Vì sao AI systems hay dùng C++ dù orchestration viết bằng Python?

Vì phần runtime, kernel, preprocessing nặng và GPU integration cần performance và control tốt hơn.

### 10.2. Khi nào nên dùng `pybind11` thay vì service riêng?

Khi cần gọi trực tiếp trong process Python và boundary đơn giản. Nếu cần isolation, scale riêng hoặc GPU ownership rõ hơn thì service riêng thường tốt hơn.

### 10.3. Vì sao warm-up quan trọng trong inference?

Để tránh request đầu tiên bị chịu cost load model, init context hoặc compile path.
