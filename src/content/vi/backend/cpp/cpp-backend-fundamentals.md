# Core Language

## 1. Tổng quan

Muốn dùng `C++` cho backend hoặc AI systems thì phải rất chắc phần core language. Đây là nơi quyết định:

- ownership
- lifetime
- copy hay move
- API có an toàn hay không

## 2. Value semantics vs reference semantics

### 2.1. Khái niệm

```cpp
struct Embedding {
    std::vector<float> values;
};

void normalize(Embedding e);          // copy
void normalize_inplace(Embedding& e); // sửa object gốc
void print(const Embedding& e);       // đọc, không copy
```

Phải phân biệt rõ:

- `T`: copy by value
- `T&`: mutable reference
- `const T&`: read-only reference
- `T&&`: rvalue reference để move

### 2.2. Ý nghĩa trong backend

Nếu API ownership không rõ thì:

- dễ copy thừa
- khó reasoning lifetime
- dễ tạo dangling reference

## 3. `const` correctness

### 3.1. Vì sao quan trọng?

`const` không phải trang trí. Nó giúp:

- API rõ hơn
- tránh mutate nhầm
- compiler reasoning tốt hơn

```cpp
class ModelConfig {
public:
    const std::string& name() const { return name_; }

private:
    std::string name_;
};
```

### 3.2. Sai lầm phổ biến

- không đánh dấu method read-only là `const`
- truyền object lớn bằng value thay vì `const T&`
- dùng `const` không nhất quán trong API public

## 4. Move semantics

### 4.1. Vì sao quan trọng?

Đây là lý do C++ vẫn rất mạnh với object lớn như:

- `std::vector`
- `std::string`
- tensor buffer
- serialized payload

```cpp
std::vector<float> load_embedding() {
    std::vector<float> v(768);
    return v;
}
```

### 4.2. Ý nghĩa thực tế

Nếu không hiểu move semantics thì rất dễ viết code:

- copy quá nhiều
- latency tăng
- throughput tụt
- ownership khó hiểu

## 5. Rule of Zero / Rule of Five

### 5.1. Rule of Zero

Ưu tiên dùng standard types và RAII wrapper để không cần tự quản lý special member functions.

### 5.2. Rule of Five

Nếu đã tự quản lý resource thì phải nghĩ đến:

- destructor
- copy constructor
- copy assignment
- move constructor
- move assignment

### 5.3. Tư duy thực dụng

Trong production, `Rule of Zero` gần như luôn là hướng an toàn hơn.

## 6. RAII

### 6.1. Khái niệm

RAII là nền móng của C++ backend.

```cpp
class FileHandle {
public:
    explicit FileHandle(const std::string& path) {
        file_ = std::fopen(path.c_str(), "rb");
        if (!file_) throw std::runtime_error("cannot open file");
    }

    ~FileHandle() {
        if (file_) std::fclose(file_);
    }

private:
    FILE* file_{nullptr};
};
```

### 6.2. Dùng RAII cho gì?

- file
- socket
- mutex lock
- mapped memory
- GPU handle

## 7. Templates và compile-time polymorphism

### 7.1. Giá trị chính

Templates giúp viết generic code gần như không tốn runtime overhead.

```cpp
template <typename T>
T clamp_value(T x, T low, T high) {
    return std::min(std::max(x, low), high);
}
```

### 7.2. Ứng dụng trong AI systems

- tensor dtype
- math kernels
- serialization generic

## 8. Common pitfalls

- truyền object lớn bằng value vô tình
- giữ reference tới object đã hết lifetime
- API ownership không rõ
- custom resource type không copy/move đúng

## 9. Best practices

- ownership phải thể hiện ngay trong type signature
- ưu tiên `Rule of Zero`
- dùng `const` nghiêm túc
- tránh custom resource management nếu standard wrapper làm được

## 10. Câu hỏi phỏng vấn hay gặp

### 10.1. `T`, `T&`, `const T&`, `T&&` khác nhau thế nào?

Chúng khác nhau ở ownership, khả năng mutate, cost of copy và khả năng move.

### 10.2. Move semantics giải quyết vấn đề gì?

Giảm copy không cần thiết cho object lớn như vector, string và tensor buffer.

### 10.3. Vì sao RAII quan trọng?

Vì nó giúp resource được acquire/release an toàn theo lifetime của object, giảm leak và cleanup lỗi.
