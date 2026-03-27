# C++ Backend

## Overview

C++ is a powerful language for backend systems requiring high performance. Widely used in game servers, high-frequency trading, embedded systems, and real-time systems.

## Key Features

| Feature | Description |
|-----------|--------|
| **Ultra-high Performance** | Zero-cost abstraction, compile-time polymorphism |
| **Memory Control** | Manual memory management, RAII pattern |
| **Static Typing** | Type safety at compile time |
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

// Automatically releases when going out of scope
void process() {
    DatabaseConnection db("mysql://localhost/db");
    auto result = db.execute("SELECT * FROM users");
    // connection automatically disconnects when function ends
}
```

### Smart Pointers (C++11 and later)

```cpp
#include <memory>

// unique_ptr - single owner of the resource
unique_ptr<Database> db = make_unique<Database>("connection_string");

// shared_ptr - shared ownership
shared_ptr<Cache> globalCache = make_shared<Cache>(1024);

// weak_ptr - non-owning reference
weak_ptr<Cache> cacheRef = globalCache;
if (auto cache = cacheRef.lock()) {
    cache->get("key");
}

// avoid raw pointers when possible
void badPractice(Database* db);    // ❌
void goodPractice(unique_ptr<Database> db); // ✅
void alsoGood(const shared_ptr<Database>& db); // ✅
```

## Multi-threading

### Basic Threading

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
        // process order...
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
    // do other work while data is being fetched
    string data = dataFuture.get(); // blocks if not ready
}
```

## Networking

### Asynchronous I/O with Boost.Asio

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

### libcurl Integration

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

| Framework | Features | Use Case |
|-----------|-----------|---------|
| **Drogon** | C++17, async, high-performance | REST API |
| **Crow** | Header-only, lightweight | Small services |
| **CppCMS** | Full-stack, high-performance | Web applications |
| **oatpp** | Pure C++, zero-dependency | Microservices |

### Example: Drogon

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

- **RAII for resource management** — never let resources leak
- **Prefer value semantics** — use `vector<T>` instead of `vector<T*>`
- **Use smart pointers** — avoid direct `new/delete`
- **Avoid exceptions in hot paths** — exceptions have overhead
- **Profile before optimizing** — do not guess, measure
- **Zero-cost abstractions** — use `auto`, lambda, ranges

## Common Interview Questions

### 1. What is the difference between `unique_ptr` and `shared_ptr`?

`unique_ptr` has a single owner, automatically releases when going out of scope — no reference counting overhead. `shared_ptr` allows multiple owners, uses atomic reference counting — has memory and CPU overhead.

### 2. When should you use `volatile`?

`volatile` in C++ tells the compiler not to optimize reads/writes — use for memory-mapped hardware registers. Do not use for concurrency (use `atomic` or `mutex` instead).

### 3. How do you implement a thread pool?

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

### 4. What are memory barriers and the memory model in C++11?

C++11 defines memory ordering: `memory_order_relaxed`, `memory_order_acquire`, `memory_order_release`, `memory_order_acq_rel`, `memory_order_seq_cst`. Use `atomic` with appropriate `memory_order` to control visibility between threads.
