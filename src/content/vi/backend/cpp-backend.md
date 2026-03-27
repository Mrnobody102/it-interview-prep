# C++ Backend

## Tổng quan

C++ là ngôn ngữ mạnh mẽ cho backend systems đòi hỏi hiệu năng cao. Được dùng rộng rãi trong game servers, high-frequency trading, embedded systems, và các hệ thống real-time.

### Các đặc điểm cốt lõi

| Đặc điểm | Mô tả |
|-----------|--------|
| **Hiệu năng cực cao** | Zero-cost abstraction, compile-time polymorphism |
| **Memory control** | Manual memory management, RAII pattern |
| **Static typing** | Type safety at compile time |
| **Cross-platform** | Linux, Windows, embedded systems |

## Memory Management

### RAII (Resource Acquisition Is Initialization)

```cpp
class DatabaseConnection {
private:
    Connection* conn;
public:
    DatabaseConnection(const string& url) {
        conn = connect(url);
    }

    ~DatabaseConnection() {
        if (conn) disconnect(conn);
    }

    QueryResult execute(const string& sql) {
        return conn->query(sql);
    }
};

// Tự động giải phóng khi ra khỏi scope
void process() {
    DatabaseConnection db("mysql://localhost/db");
    auto result = db.execute("SELECT * FROM users");
    // connection tự động disconnect khi hàm kết thúc
}
```

### Smart Pointers (C++11 trở lên)

```cpp
#include <memory>

// unique_ptr - duy nhất sở hữu resource
unique_ptr<Database> db = make_unique<Database>("connection_string");

// shared_ptr - chia sẻ ownership
shared_ptr<Cache> globalCache = make_shared<Cache>(1024);

// weak_ptr - tham chiếu không sở hữu
weak_ptr<Cache> cacheRef = globalCache;
if (auto cache = cacheRef.lock()) {
    cache->get("key");
}

// tránh raw pointer khi có thể
void badPractice(Database* db);    // ❌
void goodPractice(unique_ptr<Database> db); // ✅
void alsoGood(const shared_ptr<Database>& db); // ✅
```

## Multi-threading

### Thread cơ bản

```cpp
#include <thread>
#include <mutex>
#include <atomic>

class OrderProcessor {
private:
    mutex mtx;
    atomic<int> processedCount{0};
    vector<thread> workers;

public:
    void processOrders(const vector<Order>& orders) {
        for (const auto& order : orders) {
            workers.emplace_back([this, order]() {
                processOrder(order);
            });
        }

        for (auto& w : workers) {
            w.join();
        }
    }

    void processOrder(const Order& order) {
        lock_guard<mutex> lock(mtx);
        ++processedCount;
        // xử lý order...
    }
};
```

### Promise & Future

```cpp
#include <future>

future<string> fetchUserData(int userId) {
    return async(launch::async, [userId]() {
        this_thread::sleep_for(100ms);
        return "User_" + to_string(userId) + "_data";
    });
}

void handleRequest(int userId) {
    auto dataFuture = fetchUserData(userId);
    // làm việc khác trong khi data đang fetch
    string data = dataFuture.get(); // blocking nếu chưa xong
}
```

## Networking

### Asynchronous I/O với Boost.Asio

```cpp
#include <boost/asio.hpp>
using namespace boost::asio;

class HttpServer {
private:
    io_context io;
    ip::tcp::acceptor acceptor;

public:
    HttpServer() : acceptor(io, ip::tcp::endpoint(ip::tcp::v4(), 8080)) {
        startAccept();
    }

    void startAccept() {
        auto socket = make_shared<ip::tcp::socket>(io);
        acceptor.async_accept(*socket, [this, socket](const error_code& ec) {
            if (!ec) {
                handleRequest(socket);
            }
            startAccept();
        });
    }

    void handleRequest(shared_ptr<ip::tcp::socket> socket) {
        streambuf buffer;
        read_until(*socket, buffer, "\r\n\r\n");
        streambuf response;
        ostream(&response) << "HTTP/1.1 200 OK\r\n"
                           << "Content-Length: 13\r\n\r\n"
                           << "Hello, World!";
        write(*socket, response);
    }

    void run() { io.run(); }
};
```

### libcurl integration

```cpp
#include <curl/curl.h>

size_t writeCallback(void* contents, size_t size, size_t nmemb, string* userp) {
    size_t totalSize = size * nmemb;
    userp->append((char*)contents, totalSize);
    return totalSize;
}

string httpGet(const string& url) {
    CURL* curl = curl_easy_init();
    string response;

    curl_easy_setopt(curl, CURLOPT_URL, url.c_str());
    curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, writeCallback);
    curl_easy_setopt(curl, CURLOPT_WRITEDATA, &response);
    curl_easy_setopt(curl, CURLOPT_TIMEOUT, 10L);

    curl_easy_perform(curl);
    curl_easy_cleanup(curl);

    return response;
}
```

## C++ Backend Frameworks

| Framework | Đặc điểm | Use Case |
|-----------|-----------|---------|
| **Drogon** | C++17, async, high-performance | REST API |
| **Crow** | Header-only, lightweight | Small services |
| **CppCMS** | Full-stack, high-performance | Web applications |
| **oatpp** | Pure C++, zero-dependency | Microservices |

### Ví dụ: Drogon

```cpp
#include <drogon/drogon.h>

int main() {
    app().registerHandler("/api/users/{id}",
        [](const HttpRequestPtr& req, function<void(const HttpResponsePtr&)>&& callback,
           int id) {
            auto resp = HttpResponse::newHttpJsonResponse(
                Json::Value({{"id", id}, {"name", "User"}}));
            callback(resp);
        },
        {Get});

    app().setThreadNum(4).addListener("0.0.0.0", 8080).run();
}
```

## Best Practices

- **RAII cho resource management** — không bao giờ để resource leak
- **Prefer value semantics** — dùng `vector<T>` thay vì `vector<T*>`
- **Use smart pointers** — tránh `new/delete` trực tiếp
- **Avoid exceptions in hot paths** — exceptions có overhead
- **Profile before optimizing** — đừng guess, hãy measure
- **Zero-cost abstractions** — dùng `auto`, lambda, ranges

## Các câu hỏi phỏng vấn thường gặp

### 1. Sự khác nhau giữa `unique_ptr` và `shared_ptr`?

`unique_ptr` chỉ có một owner duy nhất, tự động giải phóng khi ra khỏi scope — không có overhead cho reference counting. `shared_ptr` cho phép nhiều owner, dùng atomic reference counting — có overhead về memory và CPU.

### 2. Khi nào nên dùng `volatile`?

`volatile` trong C++ chỉ báo cho compiler không tối ưu hóa read/write — dùng cho memory-mapped hardware registers. Không dùng cho concurrency (dùng `atomic` hoặc `mutex`).

### 3. Thread pool implement như thế nào?

```cpp
class ThreadPool {
private:
    vector<thread> workers;
    queue<function<void()>> tasks;
    mutex queueMutex;
    condition_variable condition;
    bool stop{false};

public:
    explicit ThreadPool(size_t threads) {
        for (size_t i = 0; i < threads; ++i) {
            workers.emplace_back([this] {
                while (true) {
                    function<void()> task;
                    {
                        unique_lock<mutex> lock(queueMutex);
                        condition.wait(lock, [this] { return stop || !tasks.empty(); });
                        if (stop && tasks.empty()) return;
                        task = move(tasks.front());
                        tasks.pop();
                    }
                    task();
                }
            });
        }
    }

    template<typename F>
    void enqueue(F&& f) {
        {
            lock_guard<mutex> lock(queueMutex);
            tasks.emplace(forward<F>(f));
        }
        condition.notify_one();
    }

    ~ThreadPool() {
        stop = true;
        condition.notify_all();
        for (auto& w : workers) w.join();
    }
};
```

### 4. Memory barrier và memory model trong C++11?

C++11 định nghĩa memory ordering: `memory_order_relaxed`, `memory_order_acquire`, `memory_order_release`, `memory_order_acq_rel`, `memory_order_seq_cst`. Dùng `atomic` với `memory_order` phù hợp để kiểm soát visibility giữa threads.
