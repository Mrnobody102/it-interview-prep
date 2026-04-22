# Chủ đề Go Backend

## 1. Tổng quan

### 1.1. Go (Golang) là gì?

**Go** là ngôn ngữ lập trình mã nguồn mở do Google phát triển, ra đời năm 2009. Go được thiết kế để đơn giản, hiệu quả, và đặc biệt xuất sắc trong concurrency. Go nổi tiếng với:
- **Performance**: Biên dịch trực tiếp thành machine code, không có VM.
- **Concurrency**: Goroutines và channels cho concurrent programming dễ dàng.
- **Simplicity**: Syntax đơn giản, dễ học, dễ đọc.
- **Cross-platform**: Biên dịch cho Windows, Linux, macOS, ARM.

### 1.2. So sánh Go với các ngôn ngữ khác

| Tiêu chí | Go | Java/Kotlin | Node.js |
|---|---|---|---|
| **Performance** | Xuất sắc | Tốt | Khá |
| **Concurrency** | Goroutines | Threads/Fiber/Kotlin Flow | Async/Event loop |
| **Memory management** | GC (hiệu quả) | GC (tốt) | GC |
| **Learning curve** | Thấp | Trung bình | Thấp |
| **Ecosystem** | Growing | Rất lớn | Rất lớn |
| **Deployment** | Single binary | JAR/Container | Node modules |
| **Type system** | Static, structural | Static, nominal | Dynamic |

---

## 2. Goroutines

### 2.1. Goroutine là gì?

Goroutine là lightweight thread được quản lý bởi Go runtime. Khác với OS threads, hàng ngàn goroutines có thể chạy đồng thời trên một OS thread.

```go
// Tạo goroutine - đơn giản thêm 'go'
go func() {
    fmt.Println("Running in goroutine")
}()

// Goroutine với function call
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

```go
package main

import (
    "fmt"
    "sync"
    "time"
)

func main() {
    var wg sync.WaitGroup

    // Thêm 3 tasks
    for i := 1; i <= 3; i++ {
        wg.Add(1) // Tăng counter
        go func(id int) {
            defer wg.Done() // Giảm counter khi hoàn thành
            fmt.Printf("Task %d started\n", id)
            time.Sleep(time.Second * time.Duration(id))
            fmt.Printf("Task %d completed\n", id)
        }(i)
    }

    // Đợi tất cả goroutines hoàn thành
    wg.Wait()
    fmt.Println("All tasks completed")
}
```

### 2.3. Mutex và Atomic

```go
package main

import (
    "fmt"
    "sync"
)

// Counter với Mutex
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

// Atomic operations (nhanh hơn Mutex cho operations đơn giản)
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

### 2.4. Channel Basics

```go
package main

import "fmt"

func main() {
    // Tạo channel (unbuffered)
    ch := make(chan string)

    // Gửi dữ liệu vào channel (goroutine)
    go func() {
        ch <- "Hello from goroutine"
    }()

    // Nhận dữ liệu từ channel
    msg := <-ch
    fmt.Println(msg)

    // Buffered channel
    bufferedCh := make(chan int, 3)
    bufferedCh <- 1
    bufferedCh <- 2
    bufferedCh <- 3
    // bufferedCh <- 4 // Sẽ block vì buffer đầy

    fmt.Println(<-bufferedCh) // 1
    fmt.Println(<-bufferedCh) // 2
    fmt.Println(<-bufferedCh) // 3
}
```

### 2.5. Channel Directions

```go
package main

// sendOnly channel - chỉ gửi
func sender(ch chan<- string) {
    ch <- "message"
}

// receiveOnly channel - chỉ nhận
func receiver(ch <-chan string) {
    msg := <-ch
    println(msg)
}

// bidirectional channel
func worker(ch chan string) {
    // Có thể gửi và nhận
    ch <- "result"
}
```

### 2.6. Select Statement

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

    // Đợi channel nào ready trước
    select {
    case msg := <-ch1:
        fmt.Println("Received:", msg)
    case msg := <-ch2:
        fmt.Println("Received:", msg)
    case <-time.After(3 * time.Second):
        fmt.Println("Timeout!")
    }

    // Select với default - non-blocking
    select {
    case msg := <-ch1:
        fmt.Println("Received:", msg)
    default:
        fmt.Println("No message available")
    }
}
```

### 2.7. Fan-out / Fan-in Pattern

```go
package main

import (
    "fmt"
    "sync"
)

// Fan-out: Nhiều workers nhận từ cùng channel
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

// Fan-in: Gộp nhiều channels thành một
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

## 3. Defer

### 3.1. Defer Basics

```go
package main

import "fmt"

func main() {
    // Defer thực thi ngay trước khi function return
    // Thứ tự: Last-in, First-out (LIFO)

    defer fmt.Println("1 - First deferred")   // Thực thi cuối cùng
    defer fmt.Println("2 - Second deferred")  // Thực thi trước "1"
    defer fmt.Println("3 - Third deferred")  // Thực thi trước "2"

    fmt.Println("4 - Normal execution")
    // Output: 4, 3, 2, 1
}
```

### 3.2. Defer với Resource Cleanup

```go
// Mở file, đọc, đóng file
func readFile(filename string) error {
    file, err := os.Open(filename)
    if err != nil {
        return err
    }
    defer file.Close() // Luôn đóng file, kể cả khi có lỗi

    // Đọc file...
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

    // Thực hiện operations
    if err := insertData(tx); err != nil {
        tx.Rollback()
        return err
    }

    return tx.Commit()
}
```

---

## 4. Interfaces

### 4.1. Interface Basics

```go
// Interface definition
type Writer interface {
    Write([]byte) (int, error)
}

// Stringer interface (fmt.Stringer)
type Stringer interface {
    String() string
}

// Go không cần explicit implementation
// Struct implements interface nếu có tất cả methods

type ConsoleWriter struct{}

func (cw ConsoleWriter) Write(data []byte) (int, error) {
    fmt.Println(string(data))
    return len(data), nil
}

// Empty interface - accept any type
func printAny(value interface{}) {
    fmt.Println(value)
}
```

### 4.2. Error Interface

```go
// Go built-in error interface
type error interface {
    Error() string
}

// Custom error
type MyError struct {
    Msg    string
    Code   int
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

### 4.3. io.Reader / io.Writer

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

## 5. HTTP Server với net/http

### 5.1. Basic HTTP Server

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

### 5.2. HTTP Router (go-chi)

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

## 6. Gin Framework

### 6.1. Gin Setup

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

### 6.2. Gin Middleware

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

### 6.3. Gin Groups

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

### 6.4. Gin Binding và Validation

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
    TotalCount int64      `json:"total_count"`
    Page       int        `json:"page"`
    PageSize   int        `json:"page_size"`
}

func createUser(c *gin.Context) {
    var req CreateUserRequest

    // Bind và validate
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

## 7. Context

### 7.1. Context Basics

```go
import "context"

// Context với timeout
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

### 7.2. Context với Goroutine Cancellation

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

    // Cancel sau 2 giây
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
    userID := ctx.Value("user_id") // 123
    traceID := ctx.Value("trace_id") // "abc-123"
    _ = userID
    _ = traceID
}
```

---

## 8. Error Handling

### 8.1. Go Error Handling Pattern

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
        // Kiểm tra loại error
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

### 8.2. Sentinel Errors

```go
package main

import (
    "errors"
    "fmt"
)

// Sentinel errors - predefined errors
var (
    ErrUserNotFound    = errors.New("user not found")
    ErrInvalidPassword = errors.New("invalid password")
    ErrEmailExists     = errors.New("email already exists")
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

## 9. Database Operations

### 9.1. PostgreSQL với pgx

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

### 9.2. GORM với PostgreSQL

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

## 10. REST API Example

### 10.1. Complete User API với Gin và GORM

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

## 11. Best Practices

### 11.1. Go Best Practices

| Practice | Mô tả |
|---|---|
| **Return errors, don't panic** | Dùng error returns, tránh panic cho errors |
| **Defer for cleanup** | Luôn dùng defer để cleanup resources |
| **Check errors early** | Handle errors ngay khi có thể |
| **Context for cancellation** | Truyền context qua API boundaries |
| ** slices và maps** | Dùng make() để khởi tạo với capacity nếu biết trước |
| **Avoid global state** | Dùng dependency injection |
| **Write tests** | go test, table-driven tests |
| **Benchmark** | Dùng testing.B cho performance tests |

### 11.2. Project Structure

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

## 12. Concurrency Patterns

### 12.1. Pipeline Pattern

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
    // Pipeline: generate -> square -> print
    pipeline := square(square(generate(2, 3, 4, 5)))

    for n := range pipeline {
        fmt.Println(n)
    }
    // Output: 16, 81, 256, 625
}
```

### 12.2. Worker Pool Pattern

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

## 13. Câu hỏi phỏng vấn thường gặp

### 13.1. Sự khác biệt giữa goroutine và thread là gì?

OS thread được quản lý bởi kernel của hệ điều hành và thường có stack cố định cỡ 1-8MB. Goroutine được Go runtime quản lý hoàn toàn, bắt đầu với stack rất nhỏ khoảng 2KB và tăng động khi cần. Hàng nghìn goroutine có thể được multiplex lên một số ít OS thread thông qua Go scheduler. Goroutine được tạo rất nhẹ với từ khóa `go`, trong khi thread có chi phí tạo, switch ngữ cảnh và đồng bộ lớn hơn.

### 13.2. Channel trong Go là gì? Buffered và unbuffered channel khác nhau thế nào?

Channel là một kênh typed để các goroutine giao tiếp với nhau. Unbuffered channel sẽ block phía gửi cho tới khi có phía nhận sẵn sàng, đồng thời block phía nhận khi chưa có dữ liệu, nên nó tạo ra cơ chế đồng bộ tự nhiên. Buffered channel có capacity, cho phép gửi nhiều giá trị trước khi block. Dùng unbuffered khi cần đồng bộ trực tiếp; dùng buffered khi muốn tách nhịp giữa producer và consumer để tăng throughput.

### 13.3. `select` trong Go hoạt động như thế nào?

`select` cho phép một goroutine chờ trên nhiều thao tác channel cùng lúc. Nó sẽ block tới khi có ít nhất một case có thể chạy. Nếu nhiều case cùng sẵn sàng, Go sẽ chọn ngẫu nhiên một case. `default` là nhánh tùy chọn để thực thi ngay nếu chưa có channel nào sẵn sàng, giúp tạo non-blocking operation.

### 13.4. Package `context` dùng để làm gì?

`context` được dùng để truyền cancellation signal, deadline, timeout và các giá trị gắn với request qua nhiều tầng hàm. Nó rất quan trọng trong backend để:

- hủy tác vụ dài khi client đã disconnect
- truyền timeout xuống DB, HTTP client, worker
- mang theo metadata như `trace_id`, `request_id`, `user_id`

Thông thường `context.Context` nên là tham số đầu tiên trong các hàm cần hỗ trợ cancellation.

### 13.5. Go xử lý lỗi khác gì so với các ngôn ngữ dùng exception?

Go dùng explicit error handling qua giá trị trả về thay vì exception. Hàm thường trả về `error`, và caller phải kiểm tra lỗi ngay tại call site. Cách này làm luồng xử lý lỗi rõ ràng hơn, giảm nguy cơ bỏ sót exception. Ngoài ra Go hỗ trợ wrapping error bằng `fmt.Errorf(... %w ...)`, `errors.Is()` và `errors.As()` để giữ được error chain. `panic` và `recover` chỉ nên dùng cho tình huống thật sự bất thường.

### 13.6. `defer` dùng để làm gì?

`defer` dùng để lên lịch chạy một hàm khi hàm hiện tại kết thúc, bất kể return bình thường hay bị `panic`. Các deferred call chạy theo thứ tự LIFO. Đây là cách rất phù hợp để cleanup tài nguyên như đóng file, unlock mutex, rollback transaction, close response body hoặc cleanup tạm sau khi xử lý request.

### 13.7. Hãy giải thích mô hình interface của Go.

Go dùng implicit interface implementation. Một type được xem là implement interface nếu nó có đủ method cần thiết, không cần từ khóa `implements`. Interface trong Go mô tả behavior, không mô tả cây kế thừa. Go khuyến khích dùng interface nhỏ, tập trung, như `io.Reader`, `io.Writer`, thay vì interface lớn ôm quá nhiều trách nhiệm.

### 13.8. Go scheduler là gì và hoạt động ra sao?

Go scheduler chịu trách nhiệm mapping goroutine lên OS thread. Nó dựa trên mô hình `G-M-P`: `G` là goroutine, `M` là machine/thread, `P` là processor đại diện cho resource logic của scheduler. Mỗi `P` có run queue riêng. Khi một goroutine bị block do syscall hoặc I/O, runtime có thể giải phóng thread để tiếp tục chạy goroutine khác. Cơ chế này giúp Go xử lý lượng kết nối đồng thời rất lớn với số lượng OS thread tương đối nhỏ.

### 13.9. Làm sao để tránh race condition trong Go?

Go có `go test -race` để phát hiện race condition trong quá trình test. Khi nhiều goroutine cùng truy cập shared state, có thể dùng `sync.Mutex`, `sync.RWMutex`, hoặc `sync/atomic` cho các thao tác đơn giản. Một hướng khác là tránh chia sẻ state trực tiếp, thay vào đó truyền dữ liệu qua channel, đúng theo triết lý: "Don't communicate by sharing memory; share memory by communicating."

### 13.10. `errors.Is()` và `errors.As()` khác nhau thế nào?

`errors.Is()` dùng để kiểm tra xem một lỗi trong error chain có khớp với một sentinel error cụ thể hay không. `errors.As()` dùng để tìm lỗi đầu tiên trong chain khớp với một kiểu lỗi cụ thể và ép nó ra target để đọc thêm metadata. Dùng `Is` khi so sánh theo giá trị lỗi, dùng `As` khi cần lấy structured error type.

> **Tip:** Điểm mạnh của Go là sự đơn giản. Hãy ưu tiên **composition**, **interface nhỏ**, và **goroutine + channel** để xây dựng backend service dễ scale, dễ maintain và dễ debug.
