# Golang Backend

## Tổng quan

Go (Golang) là ngôn ngữ được Google phát triển, nổi tiếng về concurrency xuất sắc, compilation nhanh, và simplicity. Được dùng rộng rãi trong microservices, cloud-native, CLI tools, và web services.

### Đặc điểm cốt lõi

| Đặc điểm | Mô tả |
|-----------|--------|
| **Goroutines** | Lightweight threads, cheap to create |
| **Channels** | CSP-style communication giữa goroutines |
| **Garbage Collection** | Low-latency GC |
| **Static typing** | Compile-time safety |
| **Simplicity** | Minimal syntax, easy to learn |

## Goroutines & Concurrency

### Tạo Goroutine

```go
// Goroutine đơn giản
go func() {
    // chạy concurrent
    fmt.Println("Running in goroutine")
}()

// Named function
go sendEmail(user)

// Với sync
var wg sync.WaitGroup
wg.Add(1)
go func() {
    defer wg.Done()
    doWork()
}()
wg.Wait() // đợi tất cả goroutines xong
```

### Channels

```go
// Tạo channel
ch := make(chan string)
ch := make(chan int, 10) // buffered

// Gửi/nhận
ch <- "hello" // gửi
msg := <-ch    // nhận

// Close channel
close(ch)

// Select - đợi nhiều channels
select {
case msg := <-ch1:
    fmt.Println(msg)
case msg := <-ch2:
    fmt.Println(msg)
case <-time.After(time.Second):
    fmt.Println("timeout")
}
```

### Worker Pool Pattern

```go
func workerPool(jobs <-chan int, results chan<- int, numWorkers int) {
    var wg sync.WaitGroup
    for i := 0; i < numWorkers; i++ {
        wg.Add(1)
        go func() {
            defer wg.Done()
            for job := range jobs {
                results <- process(job)
            }
        }()
    }
    wg.Wait()
    close(results)
}

// Usage
jobs := make(chan int, 100)
results := make(chan int, 100)

go workerPool(jobs, results, 5)

for i := 0; i < 100; i++ {
    jobs <- i
}
close(jobs)
```

## HTTP Server & Router

### Chi tiết sử dụng Gin framework

```go
package main

import (
    "github.com/gin-gonic/gin"
)

func main() {
    r := gin.Default()

    // Middleware
    r.Use(logger.Default())
    r.Use(cors.Default())

    // Routes
    r.GET("/health", func(c *gin.Context) {
        c.JSON(200, gin.H{"status": "ok"})
    })

    r.GET("/users/:id", func(c *gin.Context) {
        id := c.Param("id")
        c.JSON(200, gin.H{"id": id, "name": "Alice"})
    })

    r.POST("/users", func(c *gin.Context) {
        var user User
        if err := c.ShouldBindJSON(&user); err != nil {
            c.JSON(400, gin.H{"error": err.Error()})
            return
        }
        c.JSON(201, user)
    })

    // Group routes
    api := r.Group("/api/v1")
    {
        api.GET("/posts", listPosts)
        api.POST("/posts", createPost)
    }

    r.Run(":8080")
}
```

### Chi tiết sử dụng Echo framework

```go
package main

import (
    "github.com/labstack/echo/v4"
    "github.com/labstack/echo/v4/middleware"
)

func main() {
    e := echo.New()

    e.Use(middleware.Logger())
    e.Use(middleware.Recover())
    e.Use(middleware.CORS())

    e.GET("/health", func(c echo.Context) error {
        return c.JSON(200, map[string]string{"status": "ok"})
    })

    e.GET("/users/:id", getUser)
    e.POST("/users", createUser)

    e.Start(":8080")
}

type User struct {
    ID   int    `json:"id"`
    Name string `json:"name"`
}
```

## Database Integration

### PostgreSQL với pgx

```go
import (
    "github.com/jackc/pgx/v5/pgxpool"
)

func main() {
    connStr := "postgres://user:pass@localhost:5432/db"
    pool, err := pgxpool.New(context.Background(), connStr)
    defer pool.Close()

    // Query
    var name string
    err = pool.QueryRow(context.Background(),
        "SELECT name FROM users WHERE id = $1", 1).Scan(&name)

    // Query many rows
    rows, err := pool.Query(context.Background(), "SELECT id, name FROM users")
    defer rows.Close()

    for rows.Next() {
        var id int
        var name string
        rows.Scan(&id, &name)
        fmt.Println(id, name)
    }

    // Transaction
    tx, err := pool.Begin(context.Background())
    _, err = tx.Exec(context.Background(), "INSERT INTO logs VALUES ($1)", "action")
    tx.Commit(context.Background())
}
```

### Redis với go-redis

```go
import "github.com/redis/go-redis/v9"

func main() {
    rdb := redis.NewClient(&redis.Options{
        Addr: "localhost:6379",
    })

    ctx := context.Background()

    // String operations
    rdb.Set(ctx, "key", "value", time.Hour)
    val, _ := rdb.Get(ctx, "key").Result()

    // JSON with Redis
    user := User{ID: 1, Name: "Alice"}
    data, _ := json.Marshal(user)
    rdb.Set(ctx, "user:1", data, 0)

    // Pub/Sub
    pubsub := rdb.Subscribe(ctx, "events")
    defer pubsub.Close()

    // Cache pattern
    func getUser(id int) (*User, error) {
        cached, err := rdb.Get(ctx, fmt.Sprintf("user:%d", id)).Result()
        if err == nil {
            var u User
            json.Unmarshal([]byte(cached), &u)
            return &u, nil
        }
        // fetch from DB...
    }
}
```

## Testing

```go
import "testing"

func TestAdd(t *testing.T) {
    result := Add(2, 3)
    if result != 5 {
        t.Errorf("Add(2, 3) = %d; want 5", result)
    }
}

func TestUserRepository(t *testing.T) {
    // Setup test database
    db, teardown := setupTestDB(t)
    defer teardown()

    repo := NewUserRepository(db)

    t.Run("create user", func(t *testing.T) {
        user := &User{Name: "Alice"}
        err := repo.Create(user)
        if err != nil {
            t.Fatalf("Create() error = %v", err)
        }
        if user.ID == 0 {
            t.Error("user.ID should be set after Create()")
        }
    })

    t.Run("get user", func(t *testing.T) {
        created, _ := repo.Create(&User{Name: "Bob"})
        found, err := repo.GetByID(created.ID)
        if err != nil {
            t.Fatalf("GetByID() error = %v", err)
        }
        if found.Name != "Bob" {
            t.Errorf("Name = %s; want Bob", found.Name)
        }
    })
}
```

## Best Practices

- **Error handling**: luôn check và propagate errors
- **Context**: dùng context.Context cho cancellation và timeout
- **Concurrency**: ưu tiên channels, tránh shared memory
- **JSON**: dùng struct tags cho marshaling
- **Graceful shutdown**: handle SIGTERM đúng cách
- **Structured logging**: dùng slog hoặc zerolog

## Câu hỏi phỏng vấn

### 1. Goroutine khác thread thông thường thế nào?

Goroutines do Go runtime quản lý, không phải OS. 1 goroutine chỉ ~2KB stack, có thể tạo hàng ngàn. OS threads có stack ~1MB. Goroutines được multiplexed lên OS threads bởi Go scheduler (M:N model).

### 2. Channel deadlock xảy ra khi nào?

Deadlock khi không có goroutine nào có thể proceed — tất cả goroutines đều blocked trên channel. Dùng select với default case để tránh blocking vĩnh viễn.

### 3. Race condition trong Go?

Dùng `go run -race` để detect. Dùng `sync.Mutex`, `sync.RWMutex`, hoặc atomic operations để bảo vệ shared state. Hoặc dùng channels để communicate thay vì share memory.

### 4. Context trong Go dùng để làm gì?

Context mang cancellation signals và deadline giữa goroutines. Dùng trong HTTP requests, database queries, long-running operations. Khi parent cancel, tất cả children được notified.
