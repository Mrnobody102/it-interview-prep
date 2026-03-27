# C++ Backend

## Tổng quan

C++ la ngon ngu manh me cho backend systems doi hoi hieu nang cao. Duoc dung rong rai trong game servers, high-frequency trading, embedded systems, va cac he thong real-time.

## Cac dat diem cot loi

| Dat diem | Mo ta |
|-----------|--------|
| **Hieu nang cuc cao** | Zero-cost abstraction, compile-time polymorphism |
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

// Tu dong giai phong khi ra khoi scope
void process() {
    DatabaseConnection db("mysql://localhost/db");
    auto result = db.execute("SELECT * FROM users");
    // connection tu dong disconnect khi ham ket thuc
}
```

### Smart Pointers (C++11 tro len)

```cpp
#include <memory>

// unique_ptr - duy nhat so huu resource
unique_ptr<Database> db = make_unique<Database>("connection_string");

// shared_ptr - chia se ownership
shared_ptr<Cache> globalCache = make_shared<Cache>(1024);

// weak_ptr - tham chieu khong so huu
weak_ptr<Cache> cacheRef = globalCache;
if (auto cache = cacheRef.lock()) {
    cache->get("key");
}

// tran raw pointer khi co the
void badPractice(Database* db);    // ❌
void goodPractice(unique_ptr<Database> db); // ✅
void alsoGood(const shared_ptr<Database>& db); // ✅
```

## Multi-threading

### Thread co ban

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
        // xu ly order...
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
    // lam viec khac trong khi data dang fetch
    string data = dataFuture.get(); // blocking neu chua xong
}
```

## Networking

### Asynchronous I/O voi Boost.Asio

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

| Framework | Dac diem | Use Case |
|-----------|-----------|---------|
| **Drogon** | C++17, async, high-performance | REST API |
| **Crow** | Header-only, lightweight | Small services |
| **CppCMS** | Full-stack, high-performance | Web applications |
| **oatpp** | Pure C++, zero-dependency | Microservices |

### Vi du: Drogon

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

- **RAII cho resource management** — khong bao gio de resource leak
- **Prefer value semantics** — dung `vector<T>` thay vi `vector<T*>`
- **Use smart pointers** — tran `new/delete` truc tiep
- **Avoid exceptions in hot paths** — exceptions co overhead
- **Profile before optimizing** — dung guess, hay measure
- **Zero-cost abstractions** — dung `auto`, lambda, ranges

## Cac cau hoi phong van thuong gap

### 1. Su khac nhau giua `unique_ptr` va `shared_ptr`?

`unique_ptr` chi co mot owner duy nhat, tu dong giai phong khi ra khoi scope — khong co overhead cho reference counting. `shared_ptr` cho phep nhieu owner, dung atomic reference counting — co overhead ve memory va CPU.

### 2. Khi nao nen dung `volatile`?

`volatile` trong C++ chi bao cho compiler khong toi uu hoa read/write — dung cho memory-mapped hardware registers. Khong dung cho concurrency (dung `atomic` hoac `mutex`).

### 3. Thread pool implement nhu the nao?

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

### 4. Memory barrier va memory model trong C++11?

C++11 dinh nghia memory ordering: `memory_order_relaxed`, `memory_order_acquire`, `memory_order_release`, `memory_order_acq_rel`, `memory_order_seq_cst`. Dung `atomic` voi `memory_order` phu hop de kiem soat visibility giua threads.
