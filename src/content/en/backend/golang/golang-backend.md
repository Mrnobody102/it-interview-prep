# Go Backend

## 1. Go for Backend Development

### 1.1. Overview

**Go** (also known as Golang) is an open-source programming language developed by Google and released in 2009. It was designed to be simple, efficient, and particularly outstanding at concurrency. Go is well-known for:

- **Performance**: Compiles directly to machine code with no VM overhead.
- **Concurrency**: Goroutines and channels make concurrent programming straightforward and efficient.
- **Simplicity**: Clean, minimal syntax that is easy to learn and read.
- **Cross-platform**: Compiles to Windows, Linux, macOS, ARM, and more from a single codebase.

### 1.2. Go vs Other Languages

| Criteria | Go | Java/Kotlin | Node.js |
|---|---|---|---|
| **Performance** | Excellent | Good | Moderate |
| **Concurrency** | Goroutines | Threads/Fiber/Kotlin Flow | Async/Event loop |
| **Memory management** | GC (efficient) | GC (good) | GC |
| **Learning curve** | Low | Medium | Low |
| **Ecosystem** | Growing | Very large | Very large |
| **Deployment** | Single binary | JAR/Container | Node modules |
| **Type system** | Static, structural | Static, nominal | Dynamic |

---

## 2. Goroutines

### 2.1. What is a Goroutine?

A goroutine is a **lightweight thread** managed by the Go runtime. Unlike OS threads, thousands of goroutines can run concurrently on a single OS thread. Goroutines are much cheaper than OS threads (about 2KB vs 1-8MB stack).

```go
// Creating a goroutine - just add 'go'
go func() {
    fmt.Println("Running in goroutine")
}()

// Goroutine with function call
go doSomething()

// Anonymous function goroutine
go func() {
    for i := 0; i < 10; i++ {
        fmt.Println(i)
        time.Sleep(time.Millisecond * 100)
    }
}()
```

### 2.2. WaitGroup

WaitGroup is used to wait for a collection of goroutines to finish. You add a counter for each goroutine and call `Done()` when each one completes.

```go
package main

import (
    "fmt"
    "sync"
    "time"
)

func main() {
    var wg sync.WaitGroup

    // Add 3 tasks
    for i := 1; i <= 3; i++ {
        wg.Add(1) // Increment counter
        go func(id int) {
            defer wg.Done() // Decrement counter when done
            fmt.Printf("Task %d started\n", id)
            time.Sleep(time.Second * time.Duration(id))
            fmt.Printf("Task %d completed\n", id)
        }(i)
    }

    // Wait for all goroutines to finish
    wg.Wait()
    fmt.Println("All tasks completed")
}
```

### 2.3. Mutex and atomic operations

For protecting shared data access between goroutines, Go provides Mutex (mutual exclusion) and atomic operations.

```go
package main

import (
    "fmt"
    "sync"
)

// Counter with Mutex
type Counter struct {
    mu  sync.Mutex
    val int
}

func (c *Counter) Inc() {
    c.mu.Lock()
    defer c.mu.Unlock()
    c.val++
}

func (c *Counter) Value() int {
    c.mu.Lock()
    defer c.mu.Unlock()
    return c.val
}

// Atomic operations (faster than Mutex for simple operations)
import "sync/atomic"

type AtomicCounter struct {
    val int64
}

func (ac *AtomicCounter) Inc() {
    atomic.AddInt64(&ac.val, 1)
}

func (ac *AtomicCounter) Value() int64 {
    return atomic.LoadInt64(&ac.val)
}

func main() {
    counter := &Counter{}
    var wg sync.WaitGroup

    for i := 0; i < 1000; i++ {
        wg.Add(1)
        go func() {
            defer wg.Done()
            counter.Inc()
        }()
    }

    wg.Wait()
    fmt.Println("Final value:", counter.Value()) // 1000
}
```

### 2.4. Channel basics

Channels provide **communication between goroutines** and help synchronize access to shared data. An unbuffered channel blocks the sender until a receiver is ready, and vice versa.

```go
package main

import "fmt"

func main() {
    // Create channel (unbuffered)
    ch := make(chan string)

    // Send data to channel (goroutine)
    go func() {
        ch <- "Hello from goroutine"
    }()

    // Receive data from channel
    msg := <-ch
    fmt.Println(msg)

    // Buffered channel
    bufferedCh := make(chan int, 3)
    bufferedCh <- 1
    bufferedCh <- 2
    bufferedCh <- 3
    // bufferedCh <- 4 // Will block because buffer is full

    fmt.Println(<-bufferedCh) // 1
    fmt.Println(<-bufferedCh) // 2
    fmt.Println(<-bufferedCh) // 3
}
```

### 2.5. Channel directions

Go allows you to specify channel direction in function signatures to make interfaces clearer and prevent accidental misuse.

```go
package main

// sendOnly channel - can only send
func sender(ch chan<- string) {
    ch <- "message"
}

// receiveOnly channel - can only receive
func receiver(ch <-chan string) {
    msg := <-ch
    println(msg)
}

// bidirectional channel
func worker(ch chan string) {
    // Can both send and receive
    ch <- "result"
}
```

### 2.6. Select statement

The `select` statement lets a goroutine wait on multiple channel operations. It blocks until one of its cases can proceed.

```go
package main

import (
    "fmt"
    "time"
)

func main() {
    ch1 := make(chan string)
    ch2 := make(chan string)

    go func() {
        time.Sleep(2 * time.Second)
        ch1 <- "Channel 1 done"
    }()

    go func() {
        time.Sleep(1 * time.Second)
        ch2 <- "Channel 2 done"
    }()

    // Wait for whichever channel is ready first
    select {
    case msg := <-ch1:
        fmt.Println("Received:", msg)
    case msg := <-ch2:
        fmt.Println("Received:", msg)
    case <-time.After(3 * time.Second):
        fmt.Println("Timeout!")
    }

    // Select with default - non-blocking
    select {
    case msg := <-ch1:
        fmt.Println("Received:", msg)
    default:
        fmt.Println("No message available")
    }
}
```

### 2.7. Fan-out / Fan-in pattern

Fan-out distributes work across multiple workers reading from the same channel. Fan-in merges multiple channels into one.

```go
package main

import (
    "fmt"
    "sync"
)

// Fan-out: Multiple workers reading from the same channel
func fanOut() {
    jobs := make(chan int, 100)
    results := make(chan int, 100)

    // Start 3 workers
    for w := 1; w <= 3; w++ {
        go worker(w, jobs, results)
    }

    // Send jobs
    go func() {
        for j := 1; j <= 10; j++ {
            jobs <- j
        }
        close(jobs)
    }()

    // Receive results
    for a := 1; a <= 10; a++ {
        <-results
    }
}

func worker(id int, jobs <-chan int, results chan<- int) {
    for job := range jobs {
        fmt.Printf("Worker %d processing job %d\n", id, job)
        results <- job * 2
    }
}

// Fan-in: Merge multiple channels into one
func fanIn(ch1, ch2 <-chan string) <-chan string {
    merged := make(chan string)

    var wg sync.WaitGroup
    wg.Add(2)

    go func() {
        for v := range ch1 {
            merged <- v
        }
        wg.Done()
    }()

    go func() {
        for v := range ch2 {
            merged <- v
        }
        wg.Done()
    }()

    go func() {
        wg.Wait()
        close(merged)
    }()

    return merged
}
```

---

## 3. `defer`

### 3.1. `defer` basics

The `defer` keyword schedules a function call to run immediately before the surrounding function returns. Deferred calls execute in **Last-In, First-Out (LIFO)** order.

```go
package main

import "fmt"

func main() {
    // Defer executes right before the function returns
    // Order: Last-in, First-out (LIFO)

    defer fmt.Println("1 - First deferred")   // Executes last
    defer fmt.Println("2 - Second deferred")  // Executes before "1"
    defer fmt.Println("3 - Third deferred")   // Executes before "2"

    fmt.Println("4 - Normal execution")
    // Output: 4, 3, 2, 1
}
```

### 3.2. `defer` with resource cleanup

Defer is commonly used for cleanup tasks like closing files, releasing database connections, or unlocking mutexes, ensuring they run even if an error occurs.

```go
// Open file, read, close file
func readFile(filename string) error {
    file, err := os.Open(filename)
    if err != nil {
        return err
    }
    defer file.Close() // Always close file, even on error

    // Read file...
    return nil
}

// Database transaction
func processTransaction(db *sql.DB, userID int) error {
    tx, err := db.Begin()
    if err != nil {
        return err
    }
    defer func() {
        if p := recover(); p != nil {
            tx.Rollback()
            panic(p)
        }
    }()

    // Perform operations
    if err := insertData(tx); err != nil {
        tx.Rollback()
        return err
    }

    return tx.Commit()
}
```

---

## 4. Interfaces

### 4.1. Interface basics

Interfaces in Go define a set of method signatures. A type implements an interface implicitly - there is no `implements` keyword. Go uses **structural typing**.

```go
// Interface definition
type Writer interface {
    Write([]byte) (int, error)
}

// Stringer interface (fmt.Stringer)
type Stringer interface {
    String() string
}

// Go doesn't need explicit implementation
// A struct implements an interface if it has all the required methods

type ConsoleWriter struct{}

func (cw ConsoleWriter) Write(data []byte) (int, error) {
    fmt.Println(string(data))
    return len(data), nil
}

// Empty interface - accepts any type
func printAny(value interface{}) {
    fmt.Println(value)
}
```

### 4.2. Error interface

Go's built-in error interface is simple but powerful. Custom errors can wrap additional context.

```go
// Go built-in error interface
type error interface {
    Error() string
}

// Custom error
type MyError struct {
    Msg  string
    Code int
}

func (e *MyError) Error() string {
    return fmt.Sprintf("Error %d: %s", e.Code, e.Msg)
}

func doSomething() error {
    return &MyError{Msg: "Something went wrong", Code: 404}
}

// Error handling
if err := doSomething(); err != nil {
    if myErr, ok := err.(*MyError); ok {
        fmt.Printf("MyError: code=%d, msg=%s\n", myErr.Code, myErr.Msg)
    }
}
```

### 4.3. `io.Reader` / `io.Writer`

These standard interfaces are the foundation of Go's I/O ecosystem. Any type that implements them can work with the standard library's I/O utilities.

```go
import "io"

// io.Reader
type Reader interface {
    Read(p []byte) (n int, err error)
}

// io.Writer
type Writer interface {
    Write(p []byte) (n int, err error)
}

// io.Copy
func copyData(src, dst string) error {
    sourceFile, err := os.Open(src)
    if err != nil {
        return err
    }
    defer sourceFile.Close()

    destFile, err := os.Create(dst)
    if err != nil {
        return err
    }
    defer destFile.Close()

    _, err = io.Copy(destFile, sourceFile)
    return err
}

// String reader
reader := strings.NewReader("Hello, World!")
data := make([]byte, 5)
n, err := reader.Read(data)
fmt.Println(string(data[:n])) // "Hello"
```

---

## 5. HTTP server with `net/http`

### 5.1. Basic HTTP server

Go's standard library includes a capable HTTP server. For simple APIs, `net/http` is often sufficient without additional dependencies.

```go
package main

import (
    "encoding/json"
    "fmt"
    "log"
    "net/http"
)

type User struct {
    ID    int    `json:"id"`
    Name  string `json:"name"`
    Email string `json:"email"`
}

var users = []User{
    {ID: 1, Name: "Nguyen Van A", Email: "a@example.com"},
    {ID: 2, Name: "Tran Thi B", Email: "b@example.com"},
}

func homeHandler(w http.ResponseWriter, r *http.Request) {
    fmt.Fprintf(w, "Welcome to Go API!")
}

func getUsersHandler(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(users)
}

func getUserHandler(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Content-Type", "application/json")

    id := r.URL.Path[len("/api/users/"):]
    for _, user := range users {
        fmt.Sprintf("%d", user.ID) // convert int to string
        if fmt.Sprintf("%d", user.ID) == id {
            json.NewEncoder(w).Encode(user)
            return
        }
    }
    w.WriteHeader(http.StatusNotFound)
    json.NewEncoder(w).Encode(map[string]string{"error": "User not found"})
}

func main() {
    // Route handlers
    http.HandleFunc("/", homeHandler)
    http.HandleFunc("/api/users", getUsersHandler)
    http.HandleFunc("/api/users/", getUserHandler)

    fmt.Println("Server starting on :8080")
    log.Fatal(http.ListenAndServe(":8080", nil))
}
```

### 5.2. HTTP router (`go-chi`)

The `go-chi/chi` library is a lightweight, idiomatic router that builds on the standard `net/http` interface.

```go
package main

import (
    "encoding/json"
    "net/http"

    "github.com/go-chi/chi/v5"
    "github.com/go-chi/chi/v5/middleware"
)

func main() {
    r := chi.NewRouter()

    // Middleware
    r.Use(middleware.Logger)
    r.Use(middleware.Recoverer)
    r.Use(middleware.CORSWithConfig(middleware.CORSConfig{
        AllowOrigins: []string{"https://example.com"},
        AllowMethods: []string{"GET", "POST", "PUT", "DELETE"},
        AllowHeaders: []string{"Content-Type", "Authorization"},
    }))

    // Routes
    r.Route("/api", func(r chi.Router) {
        r.Route("/users", func(r chi.Router) {
            r.Get("/", listUsers)
            r.Post("/", createUser)
            r.Get("/{id}", getUser)
            r.Put("/{id}", updateUser)
            r.Delete("/{id}", deleteUser)
        })
    })

    http.ListenAndServe(":8080", r)
}

// Handlers
func listUsers(w http.ResponseWriter, r *http.Request) {
    json.NewEncoder(w).Encode([]User{
        {ID: 1, Name: "Nguyen Van A"},
        {ID: 2, Name: "Tran Thi B"},
    })
}

func getUser(w http.ResponseWriter, r *http.Request) {
    id := chi.URLParam(r, "id")
    json.NewEncoder(w).Encode(User{ID: 1, Name: "Nguyen Van A"})
    _ = id // unused for now
}

func createUser(w http.ResponseWriter, r *http.Request) {
    var user User
    json.NewDecoder(r.Body).Decode(&user)
    w.WriteHeader(http.StatusCreated)
    json.NewEncoder(w).Encode(user)
}

func updateUser(w http.ResponseWriter, r *http.Request) {
    id := chi.URLParam(r, "id")
    var user User
    json.NewDecoder(r.Body).Decode(&user)
    json.NewEncoder(w).Encode(user)
    _ = id
}

func deleteUser(w http.ResponseWriter, r *http.Request) {
    w.WriteHeader(http.StatusNoContent)
}
```

---

## 6. Gin framework

### 6.1. Gin setup

Gin is one of the most popular Go web frameworks. It is fast, has a minimalist design, and includes middleware support.

```bash
go get -u github.com/gin-gonic/gin
```

```go
package main

import (
    "net/http"
    "github.com/gin-gonic/gin"
)

func main() {
    r := gin.Default()

    // Routes
    r.GET("/ping", func(c *gin.Context) {
        c.JSON(http.StatusOK, gin.H{"message": "pong"})
    })

    // Route with parameters
    r.GET("/user/:id", func(c *gin.Context) {
        id := c.Param("id")
        c.JSON(http.StatusOK, gin.H{"id": id})
    })

    // Query parameters
    r.GET("/search", func(c *gin.Context) {
        name := c.Query("name")
        page := c.DefaultQuery("page", "1")
        c.JSON(http.StatusOK, gin.H{"name": name, "page": page})
    })

    // POST body
    r.POST("/users", func(c *gin.Context) {
        type CreateUserRequest struct {
            Name  string `json:"name" binding:"required,min=2"`
            Email string `json:"email" binding:"required,email"`
        }
        var req CreateUserRequest
        if err := c.ShouldBindJSON(&req); err != nil {
            c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
            return
        }
        c.JSON(http.StatusCreated, req)
    })

    r.Run(":8080")
}
```

### 6.2. Gin middleware

Middleware in Gin wraps request handlers to add cross-cutting concerns like logging, authentication, and CORS.

```go
package main

import (
    "net/http"
    "time"
    "github.com/gin-gonic/gin"
)

func main() {
    r := gin.New()

    // Custom logger middleware
    r.Use(gin.LoggerWithFormatter(func(param gin.LogFormatterParams) string {
        return param.TimeStamp.Format(time.RFC3339) +
            " | " + param.Method +
            " | " + param.Path +
            " | " + param.StatusCodeColor() + " " + param.ResetColor() +
            " | " + param.Latency.String() + "\n"
    }))

    // Recovery middleware
    r.Use(gin.Recovery())

    // Custom auth middleware
    r.Use(func(c *gin.Context) {
        token := c.GetHeader("Authorization")
        if token == "" {
            c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "No token"})
            return
        }
        // Validate token...
        c.Set("user_id", 1)
        c.Next()
    })

    r.GET("/protected", func(c *gin.Context) {
        userID, _ := c.Get("user_id")
        c.JSON(http.StatusOK, gin.H{"user_id": userID})
    })
}
```

### 6.3. Gin groups

Route groups allow you to share middleware and base paths across a set of routes.

```go
func main() {
    r := gin.Default()

    // API v1
    v1 := r.Group("/api/v1")
    {
        users := v1.Group("/users")
        {
            users.GET("", listUsers)
            users.POST("", createUser)
            users.GET("/:id", getUser)
            users.PUT("/:id", updateUser)
            users.DELETE("/:id", deleteUser)
        }

        products := v1.Group("/products")
        {
            products.GET("", listProducts)
            products.POST("", createProduct)
        }
    }

    // API v2
    v2 := r.Group("/api/v2")
    {
        v2.GET("/users", listUsersV2)
    }

    r.Run(":8080")
}
```

### 6.4. Gin binding and validation

Gin uses binding tags for automatic request validation. Gin integrates with the `go-playground/validator` library.

```go
package main

import (
    "net/http"
    "github.com/gin-gonic/gin"
)

type CreateUserRequest struct {
    Name     string `json:"name" binding:"required,min=2,max=100"`
    Email    string `json:"email" binding:"required,email"`
    Password string `json:"password" binding:"required,min=8"`
    Age      int    `json:"age" binding:"omitempty,min=0,max=150"`
}

type UpdateUserRequest struct {
    Name  string `json:"name" binding:"omitempty,min=2,max=100"`
    Email string `json:"email" binding:"omitempty,email"`
}

type PaginatedResponse struct {
    Items      interface{} `json:"items"`
    TotalCount int64       `json:"total_count"`
    Page       int         `json:"page"`
    PageSize   int         `json:"page_size"`
}

func createUser(c *gin.Context) {
    var req CreateUserRequest

    // Bind and validate
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{
            "error":   "Validation failed",
            "details": err.Error(),
        })
        return
    }

    c.JSON(http.StatusCreated, gin.H{
        "message": "User created",
        "user":    req,
    })
}
```

---

## 7. `context`

### 7.1. `context` basics

The `context` package provides cancellation, timeouts, and deadline propagation across API boundaries and goroutines. Always pass context as the first parameter of functions that may need cancellation.

```go
import "context"

// Context with timeout
func fetchDataWithTimeout(ctx context.Context, url string) error {
    ctx, cancel := context.WithTimeout(ctx, 5*time.Second)
    defer cancel()

    req, _ := http.NewRequestWithContext(ctx, "GET", url, nil)
    resp, err := http.DefaultClient.Do(req)

    if err != nil {
        if ctx.Err() == context.DeadlineExceeded {
            return fmt.Errorf("request timeout")
        }
        return err
    }
    defer resp.Body.Close()

    return nil
}
```

### 7.2. `context` with goroutine cancellation

Context is ideal for coordinating the shutdown of long-running goroutine operations.

```go
package main

import (
    "context"
    "fmt"
    "time"
)

func worker(ctx context.Context, id int, out chan<- string) {
    for {
        select {
        case <-ctx.Done():
            fmt.Printf("Worker %d cancelled\n", id)
            return
        default:
            out <- fmt.Sprintf("Worker %d working", id)
            time.Sleep(500 * time.Millisecond)
        }
    }
}

func main() {
    ctx, cancel := context.WithCancel(context.Background())
    out := make(chan string)

    // Start workers
    for i := 1; i <= 3; i++ {
        go worker(ctx, i, out)
    }

    // Cancel after 2 seconds
    go func() {
        time.Sleep(2 * time.Second)
        cancel()
    }()

    // Receive messages
    for msg := range out {
        fmt.Println(msg)
    }

    fmt.Println("Main done")
}

// Context values
func main() {
    ctx := context.WithValue(context.Background(), "user_id", 123)
    ctx = context.WithValue(ctx, "trace_id", "abc-123")

    process(ctx)
}

func process(ctx context.Context) {
    userID := ctx.Value("user_id")     // 123
    traceID := ctx.Value("trace_id")   // "abc-123"
    _ = userID
    _ = traceID
}
```

---

## 8. Error handling

### 8.1. Go error handling pattern

Go's approach to errors is explicit: functions return an error value that callers must check. This pattern is verbose but predictable and encourages error handling at every level.

```go
package main

import (
    "errors"
    "fmt"
)

// Custom error
var ErrNotFound = errors.New("resource not found")
var ErrUnauthorized = errors.New("unauthorized")

// Error wrapping
func doSomething() error {
    err := someOperation()
    if err != nil {
        return fmt.Errorf("doSomething: %w", err)
    }
    return nil
}

// Error checking
func checkError(err error) {
    if err != nil {
        // Check error type
        if errors.Is(err, ErrNotFound) {
            fmt.Println("Not found!")
        }

        if errors.As(err, &myCustomError) {
            fmt.Println("Custom error!")
        }

        fmt.Printf("Error: %v\n", err)
    }
}
```

### 8.2. Sentinel errors

Sentinel errors are predefined error values used to signal specific conditions that callers can check with `errors.Is()`.

```go
package main

import (
    "errors"
    "fmt"
)

// Sentinel errors - predefined errors
var (
    ErrUserNotFound     = errors.New("user not found")
    ErrInvalidPassword  = errors.New("invalid password")
    ErrEmailExists      = errors.New("email already exists")
)

func getUser(id int) error {
    if id <= 0 {
        return fmt.Errorf("getUser: %w", ErrUserNotFound)
    }
    return nil
}

func main() {
    err := getUser(0)
    if err != nil {
        if errors.Is(err, ErrUserNotFound) {
            fmt.Println("Handling user not found case")
        }
    }
}
```

---

## 9. Database operations

### 9.1. PostgreSQL with `pgx`

The `jackc/pgx` library is a Go database driver for PostgreSQL. It provides both a low-level interface and a connection pool.

```go
package main

import (
    "context"
    "fmt"
    "github.com/jackc/pgx/v5"
    "github.com/jackc/pgx/v5/pgxpool"
)

func main() {
    // Connect to database
    ctx := context.Background()
    connString := "postgres://user:password@localhost:5432/mydb"

    pool, err := pgxpool.New(ctx, connString)
    if err != nil {
        panic(err)
    }
    defer pool.Close()

    // Query
    rows, err := pool.Query(ctx, "SELECT id, name, email FROM users")
    if err != nil {
        panic(err)
    }
    defer rows.Close()

    for rows.Next() {
        var id int
        var name, email string
        err := rows.Scan(&id, &name, &email)
        if err != nil {
            panic(err)
        }
        fmt.Printf("User: %d, %s, %s\n", id, name, email)
    }

    // QuerySingle
    var count int
    err = pool.QueryRow(ctx, "SELECT COUNT(*) FROM users").Scan(&count)
    fmt.Println("Total users:", count)

    // Transaction
    tx, err := pool.Begin(ctx)
    if err != nil {
        panic(err)
    }

    _, err = tx.Exec(ctx, "INSERT INTO users (name, email) VALUES ($1, $2)", "Test", "test@example.com")
    if err != nil {
        tx.Rollback(ctx)
        panic(err)
    }

    tx.Commit(ctx)
}
```

### 9.2. GORM with PostgreSQL

GORM is a popular ORM for Go. It provides a chainable, fluent API for database operations.

```go
package main

import (
    "fmt"
    "gorm.io/driver/postgres"
    "gorm.io/gorm"
    "gorm.io/gorm/clause"
)

type User struct {
    ID        uint      `gorm:"primaryKey"`
    Name      string    `gorm:"size:100;not null"`
    Email     string    `gorm:"size:255;uniqueIndex;not null"`
    Age       int       `gorm:"default:0"`
    Active    bool      `gorm:"default:true"`
    CreatedAt time.Time
    UpdatedAt time.Time
}

type Product struct {
    ID        uint      `gorm:"primaryKey"`
    Name      string    `gorm:"size:200"`
    Price     float64   `gorm:"precision:10;scale:2"`
    UserID    uint      `gorm:"index"`
    User      User      `gorm:"foreignKey:UserID"`
    CreatedAt time.Time
}

func main() {
    dsn := "host=localhost user=postgres password=secret dbname=mydb port=5432"
    db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
    if err != nil {
        panic(err)
    }

    // Auto migrate
    db.AutoMigrate(&User{}, &Product{})

    // Create
    user := User{Name: "Nguyen Van A", Email: "a@example.com"}
    result := db.Create(&user)
    fmt.Printf("Created: ID=%d\n", user.ID)

    // Batch create
    users := []User{
        {Name: "User 1", Email: "user1@example.com"},
        {Name: "User 2", Email: "user2@example.com"},
    }
    db.CreateInBatches(users, 100)

    // Read
    var fetchedUser User
    db.First(&fetchedUser, 1) // Find by primary key
    db.First(&fetchedUser, "email = ?", "a@example.com")

    // Update
    db.Model(&fetchedUser).Update("Name", "Updated Name")
    db.Model(&fetchedUser).Updates(User{Name: "New Name", Age: 30})

    // Delete
    db.Delete(&fetchedUser)

    // Query with conditions
    var activeUsers []User
    db.Where("active = ? AND age > ?", true, 18).Find(&activeUsers)

    // Named parameters
    db.Where("name = @name AND age > @age", sql.Named("name", "Nguyen"), sql.Named("age", 20)).Find(&activeUsers)

    // Preload (eager loading)
    var products []Product
    db.Preload(clause.Associations).Find(&products)

    // Transaction
    tx := db.Begin()
    user := User{Name: "Tx User", Email: "tx@example.com"}
    if err := tx.Create(&user).Error; err != nil {
        tx.Rollback()
    }
    tx.Commit()
}
```

---

## 10. REST API example

### 10.1. Complete user API with Gin and GORM

```go
package main

import (
    "net/http"
    "strconv"
    "time"

    "github.com/gin-gonic/gin"
    "gorm.io/driver/postgres"
    "gorm.io/gorm"
)

// Models
type User struct {
    ID        uint      `gorm:"primaryKey" json:"id"`
    Name      string    `gorm:"size:100;not null" json:"name"`
    Email     string    `gorm:"size:255;uniqueIndex" json:"email"`
    CreatedAt time.Time `json:"created_at"`
    UpdatedAt time.Time `json:"updated_at"`
}

type CreateUserRequest struct {
    Name  string `json:"name" binding:"required,min=2"`
    Email string `json:"email" binding:"required,email"`
}

type UpdateUserRequest struct {
    Name string `json:"name" binding:"omitempty,min=2"`
}

type UserResponse struct {
    ID        uint      `json:"id"`
    Name      string    `json:"name"`
    Email     string    `json:"email"`
    CreatedAt time.Time `json:"created_at"`
}

type PaginatedResponse struct {
    Items      interface{} `json:"items"`
    TotalCount int64       `json:"total_count"`
    Page       int         `json:"page"`
    PageSize   int         `json:"page_size"`
}

// Handlers
type UserHandler struct {
    db *gorm.DB
}

func NewUserHandler(db *gorm.DB) *UserHandler {
    return &UserHandler{db: db}
}

func (h *UserHandler) ListUsers(c *gin.Context) {
    page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
    pageSize, _ := strconv.Atoi(c.DefaultQuery("page_size", "20"))
    search := c.Query("search")

    if page < 1 {
        page = 1
    }
    if pageSize < 1 || pageSize > 100 {
        pageSize = 20
    }

    offset := (page - 1) * pageSize

    var users []User
    var total int64

    query := h.db.Model(&User{})
    if search != "" {
        query = query.Where("name ILIKE ? OR email ILIKE ?", "%"+search+"%", "%"+search+"%")
    }

    query.Count(&total)
    query.Offset(offset).Limit(pageSize).Order("id DESC").Find(&users)

    c.JSON(http.StatusOK, PaginatedResponse{
        Items:      users,
        TotalCount: total,
        Page:       page,
        PageSize:   pageSize,
    })
}

func (h *UserHandler) GetUser(c *gin.Context) {
    id, err := strconv.ParseUint(c.Param("id"), 10, 32)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
        return
    }

    var user User
    if err := h.db.First(&user, id).Error; err != nil {
        if err == gorm.ErrRecordNotFound {
            c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
            return
        }
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
        return
    }

    c.JSON(http.StatusOK, user)
}

func (h *UserHandler) CreateUser(c *gin.Context) {
    var req CreateUserRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    user := User{Name: req.Name, Email: req.Email}
    if err := h.db.Create(&user).Error; err != nil {
        c.JSON(http.StatusConflict, gin.H{"error": "Email already exists"})
        return
    }

    c.JSON(http.StatusCreated, user)
}

func (h *UserHandler) UpdateUser(c *gin.Context) {
    id, err := strconv.ParseUint(c.Param("id"), 10, 32)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
        return
    }

    var user User
    if err := h.db.First(&user, id).Error; err != nil {
        if err == gorm.ErrRecordNotFound {
            c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
            return
        }
    }

    var req UpdateUserRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    updates := map[string]interface{}{}
    if req.Name != "" {
        updates["name"] = req.Name
    }

    h.db.Model(&user).Updates(updates)
    c.JSON(http.StatusOK, user)
}

func (h *UserHandler) DeleteUser(c *gin.Context) {
    id, err := strconv.ParseUint(c.Param("id"), 10, 32)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
        return
    }

    result := h.db.Delete(&User{}, id)
    if result.RowsAffected == 0 {
        c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
        return
    }

    c.Status(http.StatusNoContent)
}

// Server setup
func main() {
    dsn := "host=localhost user=postgres password=secret dbname=mydb port=5432"
    db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
    if err != nil {
        panic(err)
    }

    db.AutoMigrate(&User{})

    r := gin.Default()

    userHandler := NewUserHandler(db)

    r.GET("/api/users", userHandler.ListUsers)
    r.GET("/api/users/:id", userHandler.GetUser)
    r.POST("/api/users", userHandler.CreateUser)
    r.PUT("/api/users/:id", userHandler.UpdateUser)
    r.DELETE("/api/users/:id", userHandler.DeleteUser)

    r.Run(":8080")
}
```

---

## 11. Best practices

### 11.1. Go best practices

| Practice | Description |
|---|---|
| **Return errors, don't panic** | Use error returns, avoid panic for recoverable errors |
| **Defer for cleanup** | Always use defer to release resources |
| **Check errors early** | Handle errors as soon as they occur |
| **Context for cancellation** | Pass context through API boundaries |
| **Pre-allocate slices and maps** | Use `make()` with capacity when size is known |
| **Avoid global state** | Use dependency injection |
| **Write tests** | Use `go test`, prefer table-driven tests |
| **Benchmark** | Use `testing.B` for performance testing |

### 11.2. Project structure

```
myapp/
├── cmd/
│   └── server/
│       └── main.go           # Entry point
├── internal/
│   ├── api/
│   │   ├── handlers/
│   │   │   └── user_handler.go
│   │   ├── middleware/
│   │   │   └── auth.go
│   │   └── routes.go
│   ├── models/
│   │   └── user.go
│   ├── repository/
│   │   └── user_repository.go
│   └── service/
│       └── user_service.go
├── pkg/
│   ├── database/
│   │   └── postgres.go
│   └── config/
│       └── config.go
├── migrations/
├── go.mod
└── go.sum
```

### 11.3. Testing

```go
package service

import (
    "testing"
    "context"
)

func TestGetUser(t *testing.T) {
    // Setup
    db := setupTestDB(t)
    repo := NewUserRepository(db)
    service := NewUserService(repo)

    // Test cases (table-driven)
    tests := []struct {
        name    string
        userID  int
        wantErr bool
    }{
        {
            name:    "existing user",
            userID:  1,
            wantErr: false,
        },
        {
            name:    "non-existing user",
            userID:  999,
            wantErr: true,
        },
    }

    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            user, err := service.GetUser(context.Background(), tt.userID)
            if (err != nil) != tt.wantErr {
                t.Errorf("GetUser() error = %v, wantErr %v", err, tt.wantErr)
                return
            }
            if !tt.wantErr && user == nil {
                t.Error("GetUser() returned nil for non-error case")
            }
        })
    }
}

// Benchmark
func BenchmarkGetUsers(b *testing.B) {
    db := setupTestDB(b)
    repo := NewUserRepository(db)
    service := NewUserService(repo)

    b.ResetTimer()
    for i := 0; i < b.N; i++ {
        service.GetUsers(context.Background(), 1, 20)
    }
}
```

---

## 12. Concurrency patterns

### 12.1. Pipeline pattern

Pipelines chain goroutines together where each stage processes data and passes it to the next. This pattern is composable and efficient.

```go
package main

import "fmt"

func generate(nums ...int) <-chan int {
    out := make(chan int)
    go func() {
        for _, n := range nums {
            out <- n
        }
        close(out)
    }()
    return out
}

func square(in <-chan int) <-chan int {
    out := make(chan int)
    go func() {
        for n := range in {
            out <- n * n
        }
        close(out)
    }()
    return out
}

func main() {
    // Pipeline: generate -> square -> square -> print
    pipeline := square(square(generate(2, 3, 4, 5)))

    for n := range pipeline {
        fmt.Println(n)
    }
    // Output: 16, 81, 256, 625
}
```

### 12.2. Worker pool pattern

A worker pool limits the number of concurrent workers processing jobs, preventing resource exhaustion while maximizing throughput.

```go
package main

import (
    "fmt"
    "sync"
)

func workerPool(numWorkers int, jobs <-chan int, results chan<- int) {
    var wg sync.WaitGroup

    for i := 0; i < numWorkers; i++ {
        wg.Add(1)
        go func(workerID int) {
            defer wg.Done()
            for job := range jobs {
                result := job * job // Process job
                results <- result
            }
        }(i)
    }

    wg.Wait()
    close(results)
}

func main() {
    jobs := make(chan int, 100)
    results := make(chan int, 100)

    // Start worker pool with 3 workers
    go workerPool(3, jobs, results)

    // Send jobs
    go func() {
        for i := 1; i <= 10; i++ {
            jobs <- i
        }
        close(jobs)
    }()

    // Receive results
    for result := range results {
        fmt.Println("Result:", result)
    }
}
```

---

## 13. Common interview questions

### 13.1. What is the difference between goroutines and threads?

OS threads are managed by the operating system kernel and have a fixed stack size of 1-8MB. Goroutines are managed entirely by the Go runtime and start with a stack of only 2KB, growing dynamically up to 1GB. Thousands of goroutines can multiplex onto a small number of OS threads via the Go scheduler. Goroutines are created with a single keyword (`go`), while threads require more boilerplate. Goroutines have faster creation, switching, and communication compared to OS threads.

### 13.2. What is a channel in Go? What are buffered vs unbuffered channels?

A channel is a typed conduit for communicating between goroutines. Unbuffered channels block the sender until a receiver is ready and vice versa, providing built-in synchronization. Buffered channels have a capacity and only block when the buffer is full (on send) or empty (on receive). Use unbuffered channels when you need direct synchronization between goroutines. Use buffered channels when you want to decouple senders and receivers for better throughput.

### 13.3. How does Go's `select` statement work?

The `select` statement allows a goroutine to wait on multiple channel operations simultaneously. It blocks until one of its cases can proceed, then executes that case. If multiple cases are ready at the same time, `select` picks one randomly. The optional `default` case executes immediately if no other case is ready (non-blocking).

### 13.4. What is the purpose of the `context` package?

The `context` package provides a way to carry request-scoped values, cancellation signals, and deadlines across API boundaries. It is used to:
- Cancel long-running operations when a client disconnects or a timeout expires
- Propagate deadlines and timeouts across function calls
- Pass request-specific data (like user ID, trace ID) through middleware and handlers

Always pass context as the first parameter of functions that may need cancellation.

### 13.5. How does Go handle errors differently from other languages?

Go uses explicit error handling via return values rather than exceptions. Functions return an `error` type, and callers must check it explicitly. This makes error handling visible at every call site, reducing the risk of unhandled errors. Go also supports error wrapping with `fmt.Errorf` and `errors.Wrap` to preserve the error chain. For truly unrecoverable situations (like out-of-memory), Go uses `panic` and `recover`, but these are reserved for truly exceptional cases.

### 13.6. What is the purpose of `defer` in Go?

The `defer` keyword schedules a function call to run when the surrounding function exits, regardless of whether it returns normally or via panic. Deferred functions execute in LIFO (last-in, first-out) order. `defer` is commonly used for cleanup tasks like closing files, releasing locks, and rolling back transactions. It ensures resources are always released, even when functions have multiple return points or panic.

### 13.7. Explain Go's interface model.

Go uses implicit interface implementation - a type implements an interface automatically by implementing all its methods. There is no `implements` keyword. Interfaces are defined by their behavior (methods), not by the types that implement them. Empty interfaces (`interface{}` or `any` in Go 1.18+) can hold any value. The zero value of an interface is `nil`. Go favors small, focused interfaces (the `io.Reader`, `io.Writer` pattern) over large ones.

### 13.8. What is the Go scheduler and how does it work?

The Go scheduler multiplexes goroutines onto OS threads. It uses three entities: G (goroutine), M (machine/thread), and P (processor). Each P has a run queue of goroutines and runs on an M. The scheduler handles goroutine creation, switching, and blocking. When a goroutine blocks on a system call, its M is released to run other goroutines. This allows Go to handle millions of concurrent connections with a small number of OS threads.

### 13.9. How do you prevent race conditions in Go?

Go provides the `go test -race` flag to detect race conditions during testing. For shared data access, use `sync.Mutex` or `sync.RWMutex` for mutual exclusion, or `sync/atomic` for simple atomic operations. Alternatively, use channels to communicate ownership of data, following the motto: "Don't communicate by sharing memory; share memory by communicating."

### 13.10. What is the difference between `errors.Is()` and `errors.As()`?

`errors.Is()` checks whether an error matches a specific error value in its chain of wrapped errors. Use it for sentinel errors or specific error types. `errors.As()` finds the first error in the chain that matches a target type and, if found, sets it to that value. Use it when you need to extract structured error information from a custom error type.

> **Tip:** Go's simplicity is its strength. No generics (pre-1.18), no inheritance, no classes. Use **composition**, **interfaces**, and **goroutines** to build scalable systems. Go's built-in concurrency model (goroutines + channels) makes it one of the best choices for high-performance backend services and microservices.
