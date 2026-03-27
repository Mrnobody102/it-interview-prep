# Golang Backend

## Overview

Go (Golang) is a language developed by Google, famous for excellent concurrency, fast compilation, and simplicity. Widely used in microservices, cloud-native, CLI tools, and web services.

### Key Features

| Feature | Description |
|---------|-------------|
| **Goroutines** | Lightweight threads, cheap to create |
| **Channels** | CSP-style communication between goroutines |
| **Garbage Collection** | Low-latency GC |
| **Static typing** | Compile-time safety |
| **Simplicity** | Minimal syntax, easy to learn |

## Goroutines & Concurrency

### Creating Goroutines

```go
// Simple goroutine
go func() {
    fmt.Println("Running in goroutine")
}()

// Named function
go sendEmail(user)

// With sync
var wg sync.WaitGroup
wg.Add(1)
go func() {
    defer wg.Done()
    doWork()
}()
wg.Wait()
```

### Channels

```go
ch := make(chan string)
ch := make(chan int, 10) // buffered

ch <- "hello" // send
msg := <-ch    // receive

close(ch)

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
```

## HTTP Server & Router

### Using Gin Framework

```go
func main() {
    r := gin.Default()

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

    r.Run(":8080")
}
```

### Using Echo Framework

```go
func main() {
    e := echo.New()
    e.GET("/health", func(c echo.Context) error {
        return c.JSON(200, map[string]string{"status": "ok"})
    })
    e.Start(":8080")
}
```

## Database Integration

### PostgreSQL with pgx

```go
connStr := "postgres://user:pass@localhost:5432/db"
pool, err := pgxpool.New(context.Background(), connStr)
defer pool.Close()

var name string
err = pool.QueryRow(context.Background(),
    "SELECT name FROM users WHERE id = $1", 1).Scan(&name)

rows, _ := pool.Query(context.Background(), "SELECT id, name FROM users")
defer rows.Close()
for rows.Next() {
    var id int
    var name string
    rows.Scan(&id, &name)
}

tx, _ := pool.Begin(context.Background())
tx.Exec(context.Background(), "INSERT INTO logs VALUES ($1)", "action")
tx.Commit(context.Background())
```

### Redis with go-redis

```go
rdb := redis.NewClient(&redis.Options{Addr: "localhost:6379"})
ctx := context.Background()

rdb.Set(ctx, "key", "value", time.Hour)
val, _ := rdb.Get(ctx, "key").Result()

user := User{ID: 1, Name: "Alice"}
data, _ := json.Marshal(user)
rdb.Set(ctx, "user:1", data, 0)
```

## Testing

```go
func TestAdd(t *testing.T) {
    result := Add(2, 3)
    if result != 5 {
        t.Errorf("Add(2, 3) = %d; want 5", result)
    }
}

func TestUserRepository(t *testing.T) {
    db, teardown := setupTestDB(t)
    defer teardown()
    repo := NewUserRepository(db)

    t.Run("create user", func(t *testing.T) {
        user := &User{Name: "Alice"}
        if err := repo.Create(user); err != nil {
            t.Fatalf("Create() error = %v", err)
        }
    })
}
```

## Best Practices

- **Error handling**: always check and propagate errors
- **Context**: use context.Context for cancellation and timeout
- **Concurrency**: prefer channels, avoid shared memory
- **JSON**: use struct tags for marshaling
- **Graceful shutdown**: handle SIGTERM properly
- **Structured logging**: use slog or zerolog

## Common Interview Questions

### 1. How are goroutines different from OS threads?

Goroutines are managed by Go runtime, not OS. ~2KB stack vs ~1MB for OS threads. Thousands can be created. Go scheduler multiplexes goroutines onto OS threads (M:N model).

### 2. When does channel deadlock occur?

Deadlock when no goroutine can proceed — all goroutines are blocked on channels. Use select with default case to avoid permanent blocking.

### 3. How to handle race conditions in Go?

Use `go run -race` to detect. Use `sync.Mutex`, `sync.RWMutex`, or atomic operations to protect shared state. Or communicate by sharing memory instead of sharing to communicate.

### 4. What is Context used for?

Context carries cancellation signals and deadlines between goroutines. Used in HTTP requests, database queries, long-running operations. When parent cancels, all children are notified.
