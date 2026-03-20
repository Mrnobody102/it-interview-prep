# Go Backend

## 20. Golang for Backend Development

### 20.1. Why Go for Backend?

| Aspect | Description |
|---|---|
| **Performance** | Compiled language with near-C performance |
| **Concurrency** | Goroutines + channels for efficient concurrent programming |
| **Simplicity** | Clean, minimal syntax — easy to read and maintain |
| **Fast compilation** | Builds in seconds, even for large projects |
| **Static binaries** | Single binary deployment — no runtime dependencies |
| **Strong standard library** | `net/http`, `encoding/json`, `database/sql`, etc. |
| **Garbage collection** | Automatic memory management |
| **Cross-compilation** | Build for any OS/architecture from any platform |

### 20.2. Goroutines

Goroutines are **lightweight threads** managed by the Go runtime. They are much cheaper than OS threads (2KB vs 1-8MB stack).

```go
package main

import (
    "fmt"
    "time"
)

func main() {
    // Launching a goroutine
    go sayHello()

    // Named goroutine with closure
    go func(name string) {
        for i := 0; i < 3; i++ {
            fmt.Printf("Hello from %s (iteration %d)\n", name, i)
            time.Sleep(100 * time.Millisecond)
        }
    }("Alice")

    // Wait for goroutines to complete
    time.Sleep(500 * time.Millisecond)
    fmt.Println("Main function done")
}

func sayHello() {
    fmt.Println("Hello from goroutine!")
}
```

### 20.3. Channels

Channels provide **communication between goroutines** and help synchronize access to shared data.

```go
package main

import "fmt"

// Unbuffered channel: sender blocks until receiver is ready
func worker(id int, jobs <-chan int, results chan<- int) {
    for job := range jobs {
        fmt.Printf("Worker %d processing job %d\n", id, job)
        results <- job * 2
    }
}

func main() {
    jobs := make(chan int, 5)
    results := make(chan int, 5)

    // Start 3 workers
    for w := 1; w <= 3; w++ {
        go worker(w, jobs, results)
    }

    // Send jobs
    for j := 1; j <= 5; j++ {
        jobs <- j
    }
    close(jobs)

    // Collect results
    for a := 1; a <= 5; a++ {
        result := <-results
        fmt.Printf("Result: %d\n", result)
    }
}
```

### 20.4. Go HTTP Server

```go
package main

import (
    "encoding/json"
    "log"
    "net/http"
    "time"
)

// HTTP Handler using the net/http standard library
func healthHandler(w http.ResponseWriter, r *http.Request) {
    json.NewEncoder(w).Encode(map[string]string{
        "status":  "healthy",
        "service": "go-backend",
    })
}

type User struct {
    ID    int    `json:"id"`
    Name  string `json:"name"`
    Email string `json:"email"`
}

func usersHandler(w http.ResponseWriter, r *http.Request) {
    switch r.Method {
    case http.MethodGet:
        users := []User{
            {ID: 1, Name: "Alice", Email: "alice@example.com"},
            {ID: 2, Name: "Bob", Email: "bob@example.com"},
        }
        w.Header().Set("Content-Type", "application/json")
        json.NewEncoder(w).Encode(users)

    case http.MethodPost:
        var user User
        if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
            http.Error(w, "Invalid request body", http.StatusBadRequest)
            return
        }
        w.Header().Set("Content-Type", "application/json")
        w.WriteHeader(http.StatusCreated)
        json.NewEncoder(w).Encode(user)

    default:
        http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
    }
}

func main() {
    // Register routes
    http.HandleFunc("/health", healthHandler)
    http.HandleFunc("/api/v1/users", usersHandler)

    // Start server with timeouts
    server := &http.Server{
        Addr:         ":8080",
        ReadTimeout:  10 * time.Second,
        WriteTimeout: 10 * time.Second,
        IdleTimeout:  120 * time.Second,
    }

    log.Println("Server starting on :8080")
    log.Fatal(server.ListenAndServe())
}
```

### 20.5. Go HTTP Router Libraries

| Library | Description | Best For |
|---|---|---|
| `net/http` (stdlib) | Built-in, minimal | Simple APIs |
| **Gin** | Fast, middleware support, RESTful | High-performance APIs |
| **Echo** | High performance, minimal | APIs and microservices |
| **Chi** | Lightweight, router only | Minimal dependencies |
| **Fiber** | Express-like, very fast | Performance-critical APIs |

### 20.6. Gin Framework Example

```go
package main

import (
    "net/http"
    "github.com/gin-gonic/gin"
)

func main() {
    r := gin.Default()

    // Global middleware
    r.Use(gin.Logger())
    r.Use(gin.Recovery())

    // Health check
    r.GET("/health", func(c *gin.Context) {
        c.JSON(http.StatusOK, gin.H{"status": "healthy"})
    })

    // Grouped routes with middleware
    api := r.Group("/api/v1")
    api.Use(AuthMiddleware())
    {
        api.GET("/users", listUsers)
        api.GET("/users/:id", getUser)
        api.POST("/users", createUser)
        api.PUT("/users/:id", updateUser)
        api.DELETE("/users/:id", deleteUser)
    }

    r.Run(":8080")
}

func AuthMiddleware() gin.HandlerFunc {
    return func(c *gin.Context) {
        token := c.GetHeader("Authorization")
        if token == "" {
            c.JSON(http.StatusUnauthorized, gin.H{"error": "Missing token"})
            c.Abort()
            return
        }
        // Validate token...
        c.Set("user_id", 1)
        c.Next()
    }
}

type User struct {
    ID    int    `json:"id" binding:"required"`
    Name  string `json:"name" binding:"min=2,max=100"`
    Email string `json:"email" binding:"required,email"`
}

func listUsers(c *gin.Context) {
    users := []User{
        {ID: 1, Name: "Alice", Email: "alice@example.com"},
        {ID: 2, Name: "Bob", Email: "bob@example.com"},
    }
    c.JSON(http.StatusOK, users)
}

func getUser(c *gin.Context) {
    id := c.Param("id")
    c.JSON(http.StatusOK, gin.H{"id": id, "name": "Alice"})
}

func createUser(c *gin.Context) {
    var user User
    if err := c.ShouldBindJSON(&user); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    c.JSON(http.StatusCreated, user)
}

func updateUser(c *gin.Context) {
    id := c.Param("id")
    var user User
    if err := c.ShouldBindJSON(&user); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    user.ID = 1
    c.JSON(http.StatusOK, user)
}

func deleteUser(c *gin.Context) {
    id := c.Param("id")
    c.JSON(http.StatusOK, gin.H{"deleted": id})
}
```

### 20.7. Database Access (sqlx)

```go
package main

import (
    "fmt"
    "github.com/jmoiron/sqlx"
    _ "github.com/lib/pq" // PostgreSQL driver
)

type User struct {
    ID    int    `db:"id"`
    Name  string `db:"name"`
    Email string `db:"email"`
}

func main() {
    db, err := sqlx.Connect("postgres", "postgres://user:pass@localhost:5432/mydb")
    if err != nil {
        panic(err)
    }
    defer db.Close()

    // Set connection pool
    db.SetMaxOpenConns(25)
    db.SetMaxIdleConns(5)

    // Query
    users := []User{}
    err = db.Select(&users, "SELECT id, name, email FROM users LIMIT 10")
    if err != nil {
        panic(err)
    }

    for _, u := range users {
        fmt.Printf("User: %s <%s>\n", u.Name, u.Email)
    }

    // Named query with struct
    newUser := User{Name: "Charlie", Email: "charlie@example.com"}
    _, err = db.NamedExec(
        "INSERT INTO users (name, email) VALUES (:name, :email)",
        newUser,
    )
    if err != nil {
        panic(err)
    }
}
```

### 20.8. Error Handling

```go
// Go's error handling: explicit and predictable
result, err := someFunction()
if err != nil {
    // Handle error
    return err
}
// Use result
```

| Error Pattern | Description |
|---|---|
| **Return error** | Standard Go pattern |
| `errors.Is()` | Check error type |
| `errors.As()` | Type assertion on error |
| `fmt.Errorf()` | Wrap errors with context |

### 20.9. Context for Cancellation

```go
func longRunningTask(ctx context.Context) error {
    select {
    case <-time.After(5 * time.Second):
        return nil
    case <-ctx.Done():
        return ctx.Err()  // Context cancelled or timed out
    }
}
```

> **Tip:** Go's simplicity is its strength. No generics (pre-1.18), no inheritance, no classes. Use **composition**, **interfaces**, and **goroutines** to build scalable systems. Go's built-in concurrency model (goroutines + channels) makes it one of the best choices for high-performance backend services and microservices.
