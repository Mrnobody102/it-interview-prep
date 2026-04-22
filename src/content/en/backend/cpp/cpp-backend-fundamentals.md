# Core Language

## 1. Overview

If you want to use `C++` for backend or AI systems, you need to be very solid on the language core. This is where you decide:

- ownership
- lifetime
- copy vs move behavior
- whether APIs are safe

## 2. Value semantics vs reference semantics

### 2.1. Concept

```cpp
struct Embedding {
    std::vector<float> values;
};

void normalize(Embedding e);          // copy
void normalize_inplace(Embedding& e); // mutate original
void print(const Embedding& e);       // read-only, no copy
```

You need to distinguish clearly between:

- `T`: copy by value
- `T&`: mutable reference
- `const T&`: read-only reference
- `T&&`: rvalue reference for move

### 2.2. Why does it matter in backend systems?

If API ownership is unclear, then:

- extra copies appear silently
- lifetime becomes hard to reason about
- dangling references become easier to create

## 3. `const` correctness

### 3.1. Why does it matter?

`const` is not decoration. It improves:

- API clarity
- protection against accidental mutation
- compiler reasoning

```cpp
class ModelConfig {
public:
    const std::string& name() const { return name_; }

private:
    std::string name_;
};
```

### 3.2. Common mistakes

- not marking read-only methods as `const`
- passing large objects by value instead of `const T&`
- inconsistent `const` use in public APIs

## 4. Move semantics

### 4.1. Why is it important?

This is one of the main reasons C++ stays strong for large objects such as:

- `std::vector`
- `std::string`
- tensor buffers
- serialized payloads

```cpp
std::vector<float> load_embedding() {
    std::vector<float> v(768);
    return v;
}
```

### 4.2. Real effect

Without move semantics, it is easy to write code that:

- copies too much
- increases latency
- reduces throughput
- makes ownership unclear

## 5. Rule of Zero / Rule of Five

### 5.1. Rule of Zero

Prefer standard types and RAII wrappers so you do not need to manage special member functions manually.

### 5.2. Rule of Five

If you manually manage a resource, think about:

- destructor
- copy constructor
- copy assignment
- move constructor
- move assignment

### 5.3. Practical view

In production code, `Rule of Zero` is usually the safer direction.

## 6. RAII

### 6.1. Concept

RAII is the foundation of C++ backend code.

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

### 6.2. Where do you use RAII?

- files
- sockets
- mutex locks
- mapped memory
- GPU handles

## 7. Templates and compile-time polymorphism

### 7.1. Main value

Templates let you write generic code with little or no runtime overhead.

```cpp
template <typename T>
T clamp_value(T x, T low, T high) {
    return std::min(std::max(x, low), high);
}
```

### 7.2. Use in AI systems

- tensor dtypes
- math kernels
- generic serialization

## 8. Common pitfalls

- passing large objects by value unintentionally
- holding references after the source object died
- unclear ownership in APIs
- custom resource types with broken copy or move behavior

## 9. Best practices

- express ownership in type signatures
- prefer `Rule of Zero`
- use `const` seriously
- avoid custom resource management when standard wrappers already solve it

## 10. Common interview questions

### 10.1. What is the difference between `T`, `T&`, `const T&`, and `T&&`?

They differ in ownership, mutability, copy cost, and move behavior.

### 10.2. What problem do move semantics solve?

They reduce unnecessary copies for large objects such as vectors, strings, and tensor buffers.

### 10.3. Why is RAII important?

Because it makes resource acquisition and release follow object lifetime safely, reducing leaks and cleanup bugs.
