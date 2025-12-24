export interface Topic {
  id: string;
  name: { vi: string; en: string };
  subtopics?: Topic[];
  content?: { vi: string; en: string };
}

export interface Category {
  id: string;
  name: { vi: string; en: string };
  description: { vi: string; en: string };
  icon: string;
  topics: Topic[];
}

export const categories: Category[] = [
  {
    id: "fundamentals",
    name: { vi: "Fundamentals", en: "Fundamentals" },
    description: {
      vi: "Nền tảng chung – ai cũng phải biết",
      en: "Core foundations – everyone must know",
    },
    icon: "🎯",
    topics: [
      {
        id: "oop",
        name: { vi: "OOP", en: "OOP" },
        content: {
          vi: `# Lập trình Hướng đối tượng (OOP)

## Các khái niệm cốt lõi

### 1. Encapsulation (Đóng gói)
- Che giấu chi tiết triển khai, chỉ công khai interface cần thiết
- Sử dụng access modifiers: private, public, protected
- Bảo vệ dữ liệu khỏi truy cập trực tiếp

### 2. Inheritance (Kế thừa)
- Class con kế thừa properties và methods từ class cha
- Tái sử dụng code hiệu quả
- Tạo quan hệ "is-a"

### 3. Polymorphism (Đa hình)
- Overriding: Method cùng tên, khác implementation
- Overloading: Method cùng tên, khác parameters
- Interface implementation

### 4. Abstraction (Trừu tượng)
- Ẩn complexity, chỉ hiển thị essential features
- Abstract classes và interfaces
- Focus vào "what" thay vì "how"

## Câu hỏi phỏng vấn thường gặp

**Q: Sự khác biệt giữa Abstract Class và Interface?**
- Abstract class: có thể có implementation, constructor, fields
- Interface: chỉ định nghĩa contract, không có implementation (Java 8+ có default methods)
- Class có thể implement nhiều interfaces nhưng chỉ extend một abstract class

**Q: Composition vs Inheritance?**
- Composition: "has-a" relationship, linh hoạt hơn
- Inheritance: "is-a" relationship, coupling chặt hơn
- Prefer composition over inheritance (Design principle)`,
          en: `# Object-Oriented Programming (OOP)

## Core Concepts

### 1. Encapsulation
- Hide implementation details, expose only necessary interface
- Use access modifiers: private, public, protected
- Protect data from direct access

### 2. Inheritance
- Child class inherits properties and methods from parent
- Effective code reuse
- Creates "is-a" relationship

### 3. Polymorphism
- Overriding: Same method name, different implementation
- Overloading: Same method name, different parameters
- Interface implementation

### 4. Abstraction
- Hide complexity, show only essential features
- Abstract classes and interfaces
- Focus on "what" instead of "how"

## Common Interview Questions

**Q: Difference between Abstract Class and Interface?**
- Abstract class: can have implementation, constructor, fields
- Interface: only defines contract, no implementation (Java 8+ has default methods)
- Class can implement multiple interfaces but extend only one abstract class

**Q: Composition vs Inheritance?**
- Composition: "has-a" relationship, more flexible
- Inheritance: "is-a" relationship, tighter coupling
- Prefer composition over inheritance (Design principle)`,
        },
      },
      {
        id: "solid",
        name: { vi: "SOLID", en: "SOLID" },
        content: {
          vi: `# Nguyên tắc SOLID

## S - Single Responsibility Principle
Một class chỉ nên có một lý do để thay đổi. Mỗi class chỉ đảm nhiệm một nhiệm vụ duy nhất.

**Ví dụ:** Class User không nên vừa quản lý user data, vừa gửi email, vừa log. Nên tách thành User, EmailService, Logger.

## O - Open/Closed Principle
Class nên mở cho extension nhưng đóng cho modification. Khi thêm tính năng mới, không sửa code cũ mà extend.

**Ví dụ:** Dùng interface/abstract class để extend behavior thay vì sửa code.

## L - Liskov Substitution Principle
Subclass phải có thể thay thế parent class mà không làm hỏng chương trình.

**Ví dụ:** Nếu Bird có method fly(), thì Penguin extend Bird sẽ vi phạm vì chim cánh cụt không bay.

## I - Interface Segregation Principle
Client không nên bị ép phụ thuộc vào interface mà nó không dùng. Tách interface lớn thành nhiều interface nhỏ.

**Ví dụ:** Thay vì Worker interface có work(), eat(), sleep(), tách thành Workable, Eatable, Sleepable.

## D - Dependency Inversion Principle
- High-level modules không nên phụ thuộc low-level modules. Cả hai nên phụ thuộc abstraction.
- Abstraction không nên phụ thuộc details. Details nên phụ thuộc abstraction.

**Ví dụ:** Service nên depend vào interface Repository, không phải MySQLRepository cụ thể.`,
          en: `# SOLID Principles

## S - Single Responsibility Principle
A class should have only one reason to change. Each class should handle only one responsibility.

**Example:** User class shouldn't manage user data, send emails, and log. Split into User, EmailService, Logger.

## O - Open/Closed Principle
Classes should be open for extension but closed for modification. When adding features, extend instead of modifying.

**Example:** Use interface/abstract class to extend behavior instead of modifying code.

## L - Liskov Substitution Principle
Subclasses must be substitutable for their parent classes without breaking the program.

**Example:** If Bird has fly() method, Penguin extending Bird violates this since penguins can't fly.

## I - Interface Segregation Principle
Clients shouldn't be forced to depend on interfaces they don't use. Split large interfaces into smaller ones.

**Example:** Instead of Worker interface with work(), eat(), sleep(), split into Workable, Eatable, Sleepable.

## D - Dependency Inversion Principle
- High-level modules shouldn't depend on low-level modules. Both should depend on abstractions.
- Abstractions shouldn't depend on details. Details should depend on abstractions.

**Example:** Service should depend on Repository interface, not concrete MySQLRepository.`,
        },
      },
      {
        id: "design-patterns",
        name: { vi: "Design Patterns", en: "Design Patterns" },
        content: {
          vi: `# Design Patterns

## Creational Patterns (Khởi tạo)

### Singleton
Đảm bảo class chỉ có duy nhất một instance.
- **Use case:** Database connection, Logger, Configuration
- **Cẩn thận:** Thread safety, lazy initialization

### Factory Pattern
Tạo object mà không expose logic khởi tạo.
- **Use case:** Tạo different types of objects dựa vào input

### Builder Pattern
Xây dựng complex object từng bước.
- **Use case:** Object có nhiều optional parameters

## Structural Patterns (Cấu trúc)

### Adapter Pattern
Chuyển đổi interface của class sang interface khác mà client mong đợi.

### Decorator Pattern
Thêm behavior mới cho object mà không thay đổi structure.

### Facade Pattern
Cung cấp interface đơn giản cho subsystem phức tạp.

## Behavioral Patterns (Hành vi)

### Observer Pattern
Khi object thay đổi state, tất cả dependents được notify.
- **Use case:** Event handling, MVC

### Strategy Pattern
Define family of algorithms, đóng gói từng cái, làm chúng interchangeable.

### Template Method
Định nghĩa skeleton của algorithm, subclass override specific steps.`,
          en: `# Design Patterns

## Creational Patterns

### Singleton
Ensures a class has only one instance.
- **Use case:** Database connection, Logger, Configuration
- **Watch out:** Thread safety, lazy initialization

### Factory Pattern
Creates objects without exposing creation logic.
- **Use case:** Creating different types of objects based on input

### Builder Pattern
Constructs complex objects step by step.
- **Use case:** Objects with many optional parameters

## Structural Patterns

### Adapter Pattern
Converts interface of a class to another interface clients expect.

### Decorator Pattern
Adds new behavior to objects without altering structure.

### Facade Pattern
Provides simple interface to complex subsystem.

## Behavioral Patterns

### Observer Pattern
When object changes state, all dependents are notified.
- **Use case:** Event handling, MVC

### Strategy Pattern
Defines family of algorithms, encapsulates each one, makes them interchangeable.

### Template Method
Defines skeleton of algorithm, subclasses override specific steps.`,
        },
      },
      {
        id: "data-structures",
        name: { vi: "Data Structures", en: "Data Structures" },
        content: {
          vi: `# Cấu trúc dữ liệu

## Array & ArrayList
- **Access:** O(1)
- **Insert/Delete:** O(n)
- **Use case:** Random access, fixed/dynamic size

## Linked List
- **Access:** O(n)
- **Insert/Delete:** O(1) if have pointer
- **Use case:** Frequent insertion/deletion

## Stack & Queue
- **Stack:** LIFO - push/pop O(1)
- **Queue:** FIFO - enqueue/dequeue O(1)
- **Use case:** DFS, BFS, undo/redo

## Hash Table / HashMap
- **Average:** O(1) for insert, delete, search
- **Worst:** O(n) if many collisions
- **Use case:** Fast lookup, caching

## Tree
### Binary Search Tree
- **Average:** O(log n)
- **Worst:** O(n) if unbalanced

### Balanced Trees (AVL, Red-Black)
- **Guaranteed:** O(log n)

### Heap
- **Insert:** O(log n)
- **Get min/max:** O(1)
- **Use case:** Priority queue

## Graph
- **Representation:** Adjacency matrix O(V²), Adjacency list O(V+E)
- **Algorithms:** DFS, BFS, Dijkstra, Kruskal, Prim`,
          en: `# Data Structures

## Array & ArrayList
- **Access:** O(1)
- **Insert/Delete:** O(n)
- **Use case:** Random access, fixed/dynamic size

## Linked List
- **Access:** O(n)
- **Insert/Delete:** O(1) if have pointer
- **Use case:** Frequent insertion/deletion

## Stack & Queue
- **Stack:** LIFO - push/pop O(1)
- **Queue:** FIFO - enqueue/dequeue O(1)
- **Use case:** DFS, BFS, undo/redo

## Hash Table / HashMap
- **Average:** O(1) for insert, delete, search
- **Worst:** O(n) if many collisions
- **Use case:** Fast lookup, caching

## Tree
### Binary Search Tree
- **Average:** O(log n)
- **Worst:** O(n) if unbalanced

### Balanced Trees (AVL, Red-Black)
- **Guaranteed:** O(log n)

### Heap
- **Insert:** O(log n)
- **Get min/max:** O(1)
- **Use case:** Priority queue

## Graph
- **Representation:** Adjacency matrix O(V²), Adjacency list O(V+E)
- **Algorithms:** DFS, BFS, Dijkstra, Kruskal, Prim`,
        },
      },
      {
        id: "algorithms",
        name: { vi: "Algorithms & Big-O", en: "Algorithms & Big-O" },
        content: {
          vi: `# Algorithms & Big-O Notation

## Big-O Complexity

### O(1) - Constant
Access array by index, hash table lookup

### O(log n) - Logarithmic
Binary search, balanced tree operations

### O(n) - Linear
Linear search, iterate array

### O(n log n) - Linearithmic
Merge sort, quick sort (average), heap sort

### O(n²) - Quadratic
Bubble sort, nested loops

### O(2ⁿ) - Exponential
Recursive fibonacci (naive)

## Sorting Algorithms

| Algorithm | Average | Worst | Space | Stable |
|-----------|---------|-------|-------|--------|
| Quick Sort | O(n log n) | O(n²) | O(log n) | No |
| Merge Sort | O(n log n) | O(n log n) | O(n) | Yes |
| Heap Sort | O(n log n) | O(n log n) | O(1) | No |
| Bubble Sort | O(n²) | O(n²) | O(1) | Yes |

## Search Algorithms

### Binary Search
- **Requirement:** Sorted array
- **Complexity:** O(log n)

### DFS vs BFS
- **DFS:** Stack, go deep first, O(V+E)
- **BFS:** Queue, go wide first, O(V+E), shortest path

## Dynamic Programming
- Overlapping subproblems + Optimal substructure
- Memoization (top-down) vs Tabulation (bottom-up)
- Examples: Fibonacci, Knapsack, Longest Common Subsequence`,
          en: `# Algorithms & Big-O Notation

## Big-O Complexity

### O(1) - Constant
Access array by index, hash table lookup

### O(log n) - Logarithmic
Binary search, balanced tree operations

### O(n) - Linear
Linear search, iterate array

### O(n log n) - Linearithmic
Merge sort, quick sort (average), heap sort

### O(n²) - Quadratic
Bubble sort, nested loops

### O(2ⁿ) - Exponential
Recursive fibonacci (naive)

## Sorting Algorithms

| Algorithm | Average | Worst | Space | Stable |
|-----------|---------|-------|-------|--------|
| Quick Sort | O(n log n) | O(n²) | O(log n) | No |
| Merge Sort | O(n log n) | O(n log n) | O(n) | Yes |
| Heap Sort | O(n log n) | O(n log n) | O(1) | No |
| Bubble Sort | O(n²) | O(n²) | O(1) | Yes |

## Search Algorithms

### Binary Search
- **Requirement:** Sorted array
- **Complexity:** O(log n)

### DFS vs BFS
- **DFS:** Stack, go deep first, O(V+E)
- **BFS:** Queue, go wide first, O(V+E), shortest path

## Dynamic Programming
- Overlapping subproblems + Optimal substructure
- Memoization (top-down) vs Tabulation (bottom-up)
- Examples: Fibonacci, Knapsack, Longest Common Subsequence`,
        },
      },
      {
        id: "concurrency",
        name: {
          vi: "Concurrency / Multithreading",
          en: "Concurrency / Multithreading",
        },
        content: {
          vi: `# Concurrency & Multithreading

## Khái niệm cơ bản

### Process vs Thread
- **Process:** Độc lập, có memory riêng, heavyweight
- **Thread:** Share memory với threads khác trong process, lightweight

### Concurrency vs Parallelism
- **Concurrency:** Multiple tasks progress (có thể không cùng lúc)
- **Parallelism:** Multiple tasks execute simultaneously

## Vấn đề thường gặp

### Race Condition
Nhiều threads access shared data, kết quả phụ thuộc vào timing.

### Deadlock
Hai threads chờ nhau release resources.
- **4 điều kiện:** Mutual exclusion, Hold and wait, No preemption, Circular wait

### Starvation
Thread không bao giờ được access resource.

## Giải pháp đồng bộ

### Mutex / Lock
Chỉ một thread được access critical section.

### Semaphore
Counter cho phép N threads access.

### Monitor
High-level abstraction, tự động acquire/release lock.

## Thread-safe Techniques
- Immutable objects
- Thread-local storage
- Atomic operations
- Synchronized methods/blocks`,
          en: `# Concurrency & Multithreading

## Basic Concepts

### Process vs Thread
- **Process:** Independent, separate memory, heavyweight
- **Thread:** Shares memory with other threads in process, lightweight

### Concurrency vs Parallelism
- **Concurrency:** Multiple tasks progress (may not be simultaneous)
- **Parallelism:** Multiple tasks execute simultaneously

## Common Issues

### Race Condition
Multiple threads access shared data, result depends on timing.

### Deadlock
Two threads wait for each other to release resources.
- **4 conditions:** Mutual exclusion, Hold and wait, No preemption, Circular wait

### Starvation
Thread never gets access to resources.

## Synchronization Solutions

### Mutex / Lock
Only one thread can access critical section.

### Semaphore
Counter allowing N threads to access.

### Monitor
High-level abstraction, automatically acquire/release lock.

## Thread-safe Techniques
- Immutable objects
- Thread-local storage
- Atomic operations
- Synchronized methods/blocks`,
        },
      },
      {
        id: "memory",
        name: { vi: "Memory Management", en: "Memory Management" },
        content: {
          vi: `# Quản lý bộ nhớ

## Stack vs Heap

### Stack
- **Đặc điểm:** LIFO, tự động quản lý, nhanh
- **Chứa:** Local variables, function calls, primitive types
- **Size:** Nhỏ, fixed
- **Lỗi:** Stack overflow

### Heap
- **Đặc điểm:** Dynamic allocation, developer quản lý
- **Chứa:** Objects, dynamic data
- **Size:** Lớn hơn stack
- **Lỗi:** Memory leak, heap overflow

## Garbage Collection

### Generational GC
- **Young Generation:** Objects mới tạo, frequent GC
- **Old Generation:** Objects sống lâu, infrequent GC
- **Permanent/Metaspace:** Class metadata

### GC Algorithms
- **Mark and Sweep:** Đánh dấu object đang dùng, xóa còn lại
- **Reference Counting:** Đếm số reference, = 0 thì xóa
- **Copying:** Copy live objects sang vùng mới

## Memory Leaks

### Nguyên nhân
- Forget to close resources (files, connections)
- Static collections grow forever
- Event listeners không remove
- Inner class giữ reference đến outer class

### Cách phát hiện
- Profiler tools
- Heap dump analysis
- Monitor memory usage trends`,
          en: `# Memory Management

## Stack vs Heap

### Stack
- **Characteristics:** LIFO, automatically managed, fast
- **Contains:** Local variables, function calls, primitive types
- **Size:** Small, fixed
- **Error:** Stack overflow

### Heap
- **Characteristics:** Dynamic allocation, developer managed
- **Contains:** Objects, dynamic data
- **Size:** Larger than stack
- **Error:** Memory leak, heap overflow

## Garbage Collection

### Generational GC
- **Young Generation:** Newly created objects, frequent GC
- **Old Generation:** Long-lived objects, infrequent GC
- **Permanent/Metaspace:** Class metadata

### GC Algorithms
- **Mark and Sweep:** Mark live objects, delete rest
- **Reference Counting:** Count references, delete when = 0
- **Copying:** Copy live objects to new region

## Memory Leaks

### Causes
- Forget to close resources (files, connections)
- Static collections grow forever
- Event listeners not removed
- Inner class holds reference to outer class

### Detection
- Profiler tools
- Heap dump analysis
- Monitor memory usage trends`,
        },
      },
    ],
  },
  {
    id: "backend",
    name: { vi: "Backend", en: "Backend" },
    description: {
      vi: "Chia theo tech stack cụ thể",
      en: "Divided by specific tech stack",
    },
    icon: "⚙️",
    topics: [
      {
        id: "java-backend",
        name: { vi: "Java Backend", en: "Java Backend" },
        subtopics: [
          {
            id: "spring-boot",
            name: { vi: "Spring / Spring Boot", en: "Spring / Spring Boot" },
            content: {
              vi: `# Spring / Spring Boot

## Dependency Injection & IoC

### IoC Container
Spring quản lý lifecycle và dependencies của beans.

### Types of Injection
- **Constructor Injection:** Recommended, immutable
- **Setter Injection:** Optional dependencies
- **Field Injection:** Not recommended (hard to test)

### Bean Scopes
- **Singleton:** Default, one instance per container
- **Prototype:** New instance mỗi lần request
- **Request, Session, Application:** Web scopes

## Spring Boot Auto-configuration

### @SpringBootApplication
Bao gồm @Configuration, @EnableAutoConfiguration, @ComponentScan

### Starter Dependencies
spring-boot-starter-web, starter-data-jpa, starter-security...

## Common Annotations

- **@Component, @Service, @Repository:** Bean registration
- **@Autowired:** Dependency injection
- **@Value:** Inject properties
- **@Configuration:** Java-based configuration
- **@Bean:** Declare bean method

## Application Properties
application.properties / application.yml cho configuration`,
              en: `# Spring / Spring Boot

## Dependency Injection & IoC

### IoC Container
Spring manages lifecycle and dependencies of beans.

### Types of Injection
- **Constructor Injection:** Recommended, immutable
- **Setter Injection:** Optional dependencies
- **Field Injection:** Not recommended (hard to test)

### Bean Scopes
- **Singleton:** Default, one instance per container
- **Prototype:** New instance per request
- **Request, Session, Application:** Web scopes

## Spring Boot Auto-configuration

### @SpringBootApplication
Includes @Configuration, @EnableAutoConfiguration, @ComponentScan

### Starter Dependencies
spring-boot-starter-web, starter-data-jpa, starter-security...

## Common Annotations

- **@Component, @Service, @Repository:** Bean registration
- **@Autowired:** Dependency injection
- **@Value:** Inject properties
- **@Configuration:** Java-based configuration
- **@Bean:** Declare bean method

## Application Properties
application.properties / application.yml for configuration`,
            },
          },
          {
            id: "rest-api",
            name: { vi: "REST API Design", en: "REST API Design" },
            content: {
              vi: `# REST API Design

## REST Principles

### Stateless
Server không lưu client state giữa các requests.

### Resource-based
URL represent resources, không phải actions.

### HTTP Methods
- **GET:** Retrieve resources
- **POST:** Create new resource
- **PUT:** Update entire resource
- **PATCH:** Partial update
- **DELETE:** Remove resource

## URL Design Best Practices

✅ Good:
- GET /api/users
- POST /api/users
- GET /api/users/{id}
- PUT /api/users/{id}
- GET /api/users/{id}/orders

❌ Bad:
- /api/getUsers
- /api/createUser
- /api/user-list

## Status Codes

- **200 OK:** Success
- **201 Created:** Resource created
- **204 No Content:** Success, no response body
- **400 Bad Request:** Invalid input
- **401 Unauthorized:** Not authenticated
- **403 Forbidden:** No permission
- **404 Not Found:** Resource not found
- **500 Internal Server Error:** Server error

## Versioning

- URL versioning: /api/v1/users
- Header versioning: Accept: application/vnd.api.v1+json
- Query parameter: /api/users?version=1`,
              en: `# REST API Design

## REST Principles

### Stateless
Server doesn't store client state between requests.

### Resource-based
URLs represent resources, not actions.

### HTTP Methods
- **GET:** Retrieve resources
- **POST:** Create new resource
- **PUT:** Update entire resource
- **PATCH:** Partial update
- **DELETE:** Remove resource

## URL Design Best Practices

✅ Good:
- GET /api/users
- POST /api/users
- GET /api/users/{id}
- PUT /api/users/{id}
- GET /api/users/{id}/orders

❌ Bad:
- /api/getUsers
- /api/createUser
- /api/user-list

## Status Codes

- **200 OK:** Success
- **201 Created:** Resource created
- **204 No Content:** Success, no response body
- **400 Bad Request:** Invalid input
- **401 Unauthorized:** Not authenticated
- **403 Forbidden:** No permission
- **404 Not Found:** Resource not found
- **500 Internal Server Error:** Server error

## Versioning

- URL versioning: /api/v1/users
- Header versioning: Accept: application/vnd.api.v1+json
- Query parameter: /api/users?version=1`,
            },
          },
          {
            id: "jpa-hibernate",
            name: { vi: "JPA / Hibernate", en: "JPA / Hibernate" },
            content: {
              vi: `# JPA / Hibernate

## Entity Mapping

### @Entity & @Table
\`\`\`java
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
}
\`\`\`

## Relationships

- **@OneToOne:** User ↔ Profile
- **@OneToMany / @ManyToOne:** Department ↔ Employees
- **@ManyToMany:** Students ↔ Courses

### Fetch Types
- **EAGER:** Load immediately (default for @ManyToOne, @OneToOne)
- **LAZY:** Load on access (default for @OneToMany, @ManyToMany)

### Cascade Types
- **ALL, PERSIST, MERGE, REMOVE, REFRESH, DETACH**

## N+1 Query Problem

### Problem
Query 1 để lấy list, query N để lấy relationships.

### Solutions
- **JOIN FETCH:** Eager load in one query
- **@EntityGraph:** Specify fetch plan
- **Batch fetching:** @BatchSize`,
              en: `# JPA / Hibernate

## Entity Mapping

### @Entity & @Table
\`\`\`java
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
}
\`\`\`

## Relationships

- **@OneToOne:** User ↔ Profile
- **@OneToMany / @ManyToOne:** Department ↔ Employees
- **@ManyToMany:** Students ↔ Courses

### Fetch Types
- **EAGER:** Load immediately (default for @ManyToOne, @OneToOne)
- **LAZY:** Load on access (default for @OneToMany, @ManyToMany)

### Cascade Types
- **ALL, PERSIST, MERGE, REMOVE, REFRESH, DETACH**

## N+1 Query Problem

### Problem
1 query for list, N queries for relationships.

### Solutions
- **JOIN FETCH:** Eager load in one query
- **@EntityGraph:** Specify fetch plan
- **Batch fetching:** @BatchSize`,
            },
          },
          {
            id: "transaction",
            name: { vi: "Transaction & ACID", en: "Transaction & ACID" },
            content: {
              vi: `# Transaction & ACID

## ACID Properties

### Atomicity (Nguyên tử)
All or nothing. Transaction hoàn thành hoàn toàn hoặc rollback hoàn toàn.

### Consistency (Nhất quán)
Database chuyển từ valid state này sang valid state khác.

### Isolation (Cô lập)
Concurrent transactions không ảnh hưởng lẫn nhau.

### Durability (Bền vững)
Committed transaction persist ngay cả khi system crash.

## Isolation Levels

### READ UNCOMMITTED
Đọc được uncommitted data. **Problem:** Dirty read

### READ COMMITTED
Chỉ đọc committed data. **Problem:** Non-repeatable read

### REPEATABLE READ
Same query returns same result. **Problem:** Phantom read

### SERIALIZABLE
Highest isolation, như thể transactions chạy tuần tự. **Problem:** Performance

## Spring @Transactional

\`\`\`java
@Transactional(
    isolation = Isolation.READ_COMMITTED,
    propagation = Propagation.REQUIRED,
    timeout = 30,
    rollbackFor = Exception.class
)
public void transferMoney() { }
\`\`\`

### Propagation
- **REQUIRED:** Join existing hoặc tạo mới
- **REQUIRES_NEW:** Luôn tạo transaction mới
- **NESTED:** Nested transaction`,
              en: `# Transaction & ACID

## ACID Properties

### Atomicity
All or nothing. Transaction completes fully or rolls back completely.

### Consistency
Database moves from one valid state to another.

### Isolation
Concurrent transactions don't affect each other.

### Durability
Committed transaction persists even if system crashes.

## Isolation Levels

### READ UNCOMMITTED
Can read uncommitted data. **Problem:** Dirty read

### READ COMMITTED
Only read committed data. **Problem:** Non-repeatable read

### REPEATABLE READ
Same query returns same result. **Problem:** Phantom read

### SERIALIZABLE
Highest isolation, as if transactions run sequentially. **Problem:** Performance

## Spring @Transactional

\`\`\`java
@Transactional(
    isolation = Isolation.READ_COMMITTED,
    propagation = Propagation.REQUIRED,
    timeout = 30,
    rollbackFor = Exception.class
)
public void transferMoney() { }
\`\`\`

### Propagation
- **REQUIRED:** Join existing or create new
- **REQUIRES_NEW:** Always create new transaction
- **NESTED:** Nested transaction`,
            },
          },
          {
            id: "security",
            name: {
              vi: "Security (Spring Security, JWT)",
              en: "Security (Spring Security, JWT)",
            },
            content: {
              vi: `# Spring Security & JWT

## Authentication vs Authorization

### Authentication
Xác định "bạn là ai?" - Login process

### Authorization
Xác định "bạn có quyền gì?" - Access control

## Spring Security Architecture

### SecurityContext
Chứa thông tin authentication của user hiện tại.

### UserDetailsService
Load user details từ database.

### PasswordEncoder
Encode password (BCrypt recommended).

## JWT (JSON Web Token)

### Structure
**Header.Payload.Signature**

### Flow
1. User login → Server verify → Return JWT
2. Client gửi JWT trong header: Authorization: Bearer <token>
3. Server verify signature → Extract user info

### Best Practices
- Short expiration time
- Refresh token mechanism
- Store secret key securely
- HTTPS only

## Common Configurations

\`\`\`java
http
    .csrf().disable()
    .authorizeRequests()
    .antMatchers("/api/public/**").permitAll()
    .antMatchers("/api/admin/**").hasRole("ADMIN")
    .anyRequest().authenticated()
    .and()
    .sessionManagement()
    .sessionCreationPolicy(STATELESS)
\`\`\``,
              en: `# Spring Security & JWT

## Authentication vs Authorization

### Authentication
Determines "who you are?" - Login process

### Authorization
Determines "what can you do?" - Access control

## Spring Security Architecture

### SecurityContext
Contains authentication information of current user.

### UserDetailsService
Loads user details from database.

### PasswordEncoder
Encodes password (BCrypt recommended).

## JWT (JSON Web Token)

### Structure
**Header.Payload.Signature**

### Flow
1. User login → Server verifies → Returns JWT
2. Client sends JWT in header: Authorization: Bearer <token>
3. Server verifies signature → Extracts user info

### Best Practices
- Short expiration time
- Refresh token mechanism
- Store secret key securely
- HTTPS only

## Common Configurations

\`\`\`java
http
    .csrf().disable()
    .authorizeRequests()
    .antMatchers("/api/public/**").permitAll()
    .antMatchers("/api/admin/**").hasRole("ADMIN")
    .anyRequest().authenticated()
    .and()
    .sessionManagement()
    .sessionCreationPolicy(STATELESS)
\`\`\``,
            },
          },
          {
            id: "async",
            name: { vi: "Async / Scheduler", en: "Async / Scheduler" },
            content: {
              vi: `# Async & Scheduler trong Spring

## @Async

### Enable
\`\`\`java
@Configuration
@EnableAsync
public class AsyncConfig { }
\`\`\`

### Usage
\`\`\`java
@Async
public CompletableFuture<String> process() {
    // Long running task
    return CompletableFuture.completedFuture("Done");
}
\`\`\`

### Thread Pool Configuration
Custom Executor để control thread pool size.

## @Scheduled

### Enable
\`\`\`java
@Configuration
@EnableScheduling
public class SchedulerConfig { }
\`\`\`

### Fixed Rate
\`\`\`java
@Scheduled(fixedRate = 5000) // Every 5 seconds
public void task() { }
\`\`\`

### Cron Expression
\`\`\`java
@Scheduled(cron = "0 0 2 * * ?") // 2 AM daily
public void cleanupTask() { }
\`\`\`

## Use Cases
- Email sending
- Report generation
- Batch processing
- Cache refresh
- Cleanup tasks`,
              en: `# Async & Scheduler in Spring

## @Async

### Enable
\`\`\`java
@Configuration
@EnableAsync
public class AsyncConfig { }
\`\`\`

### Usage
\`\`\`java
@Async
public CompletableFuture<String> process() {
    // Long running task
    return CompletableFuture.completedFuture("Done");
}
\`\`\`

### Thread Pool Configuration
Custom Executor to control thread pool size.

## @Scheduled

### Enable
\`\`\`java
@Configuration
@EnableScheduling
public class SchedulerConfig { }
\`\`\`

### Fixed Rate
\`\`\`java
@Scheduled(fixedRate = 5000) // Every 5 seconds
public void task() { }
\`\`\`

### Cron Expression
\`\`\`java
@Scheduled(cron = "0 0 2 * * ?") // 2 AM daily
public void cleanupTask() { }
\`\`\`

## Use Cases
- Email sending
- Report generation
- Batch processing
- Cache refresh
- Cleanup tasks`,
            },
          },
          {
            id: "testing",
            name: { vi: "Testing", en: "Testing" },
            content: {
              vi: `# Testing trong Java/Spring

## JUnit 5

### Basic Test
\`\`\`java
@Test
void shouldAddNumbers() {
    assertEquals(5, calculator.add(2, 3));
}
\`\`\`

### Lifecycle
- **@BeforeAll:** Once before all tests
- **@BeforeEach:** Before each test
- **@AfterEach:** After each test
- **@AfterAll:** Once after all tests

## Mockito

### Mock Dependencies
\`\`\`java
@Mock
private UserRepository userRepository;

@InjectMocks
private UserService userService;
\`\`\`

### Stubbing
\`\`\`java
when(userRepository.findById(1L))
    .thenReturn(Optional.of(user));
\`\`\`

### Verification
\`\`\`java
verify(userRepository, times(1)).save(any(User.class));
\`\`\`

## Spring Boot Test

### Integration Test
\`\`\`java
@SpringBootTest
@AutoConfigureMockMvc
class UserControllerTest {
    @Autowired
    private MockMvc mockMvc;
}
\`\`\`

### Test Slices
- **@WebMvcTest:** Controller layer only
- **@DataJpaTest:** JPA repositories
- **@RestClientTest:** REST clients`,
              en: `# Testing in Java/Spring

## JUnit 5

### Basic Test
\`\`\`java
@Test
void shouldAddNumbers() {
    assertEquals(5, calculator.add(2, 3));
}
\`\`\`

### Lifecycle
- **@BeforeAll:** Once before all tests
- **@BeforeEach:** Before each test
- **@AfterEach:** After each test
- **@AfterAll:** Once after all tests

## Mockito

### Mock Dependencies
\`\`\`java
@Mock
private UserRepository userRepository;

@InjectMocks
private UserService userService;
\`\`\`

### Stubbing
\`\`\`java
when(userRepository.findById(1L))
    .thenReturn(Optional.of(user));
\`\`\`

### Verification
\`\`\`java
verify(userRepository, times(1)).save(any(User.class));
\`\`\`

## Spring Boot Test

### Integration Test
\`\`\`java
@SpringBootTest
@AutoConfigureMockMvc
class UserControllerTest {
    @Autowired
    private MockMvc mockMvc;
}
\`\`\`

### Test Slices
- **@WebMvcTest:** Controller layer only
- **@DataJpaTest:** JPA repositories
- **@RestClientTest:** REST clients`,
            },
          },
        ],
      },
      {
        id: "python-backend",
        name: { vi: "Python Backend", en: "Python Backend" },
        subtopics: [
          {
            id: "django-fastapi",
            name: { vi: "Django / FastAPI", en: "Django / FastAPI" },
            content: {
              vi: `# Django / FastAPI

## Django

### MVT Pattern
- **Model:** Database layer
- **View:** Business logic
- **Template:** Presentation layer

### ORM
\`\`\`python
class User(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
\`\`\`

### Admin Panel
Built-in admin interface for CRUD operations

## FastAPI

### Modern Python Framework
- Type hints
- Auto documentation (Swagger/OpenAPI)
- High performance (async support)

### Example
\`\`\`python
from fastapi import FastAPI

app = FastAPI()

@app.get("/users/{user_id}")
async def get_user(user_id: int):
    return {"user_id": user_id}
\`\`\`

### Pydantic Models
Data validation using Python type hints

### Dependency Injection
Similar to Spring, clean and testable

## Django vs FastAPI
- **Django:** Full-featured, batteries included
- **FastAPI:** Modern, async, API-focused`,
              en: `# Django / FastAPI

## Django

### MVT Pattern
- **Model:** Database layer
- **View:** Business logic
- **Template:** Presentation layer

### ORM
\`\`\`python
class User(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
\`\`\`

### Admin Panel
Built-in admin interface for CRUD operations

## FastAPI

### Modern Python Framework
- Type hints
- Auto documentation (Swagger/OpenAPI)
- High performance (async support)

### Example
\`\`\`python
from fastapi import FastAPI

app = FastAPI()

@app.get("/users/{user_id}")
async def get_user(user_id: int):
    return {"user_id": user_id}
\`\`\`

### Pydantic Models
Data validation using Python type hints

### Dependency Injection
Similar to Spring, clean and testable

## Django vs FastAPI
- **Django:** Full-featured, batteries included
- **FastAPI:** Modern, async, API-focused`,
            },
          },
        ],
      },
      {
        id: "nodejs-backend",
        name: { vi: "Node.js Backend", en: "Node.js Backend" },
        subtopics: [
          {
            id: "express-nestjs",
            name: { vi: "Express / NestJS", en: "Express / NestJS" },
            content: {
              vi: `# Express / NestJS

## Express.js

### Minimal & Flexible
\`\`\`javascript
const express = require('express');
const app = express();

app.get('/users/:id', (req, res) => {
  res.json({ userId: req.params.id });
});
\`\`\`

### Middleware
\`\`\`javascript
app.use(express.json());
app.use(cors());
app.use(authMiddleware);
\`\`\`

## NestJS

### Enterprise Framework
- TypeScript-first
- Angular-like architecture
- Dependency Injection
- Decorator-based

### Example
\`\`\`typescript
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }
}
\`\`\`

### Modules
Organize code into cohesive blocks

### Guards, Interceptors, Pipes
Built-in request lifecycle hooks`,
              en: `# Express / NestJS

## Express.js

### Minimal & Flexible
\`\`\`javascript
const express = require('express');
const app = express();

app.get('/users/:id', (req, res) => {
  res.json({ userId: req.params.id });
});
\`\`\`

### Middleware
\`\`\`javascript
app.use(express.json());
app.use(cors());
app.use(authMiddleware);
\`\`\`

## NestJS

### Enterprise Framework
- TypeScript-first
- Angular-like architecture
- Dependency Injection
- Decorator-based

### Example
\`\`\`typescript
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }
}
\`\`\`

### Modules
Organize code into cohesive blocks

### Guards, Interceptors, Pipes
Built-in request lifecycle hooks`,
            },
          },
          {
            id: "event-loop",
            name: { vi: "Event Loop", en: "Event Loop" },
            content: {
              vi: `# Node.js Event Loop

## Single-threaded, Non-blocking

Node.js chạy trên single thread nhưng có thể handle nhiều concurrent operations nhờ event loop.

## Event Loop Phases

1. **Timers:** Execute setTimeout, setInterval callbacks
2. **Pending Callbacks:** I/O callbacks deferred to next iteration
3. **Idle, Prepare:** Internal use
4. **Poll:** Retrieve new I/O events
5. **Check:** Execute setImmediate callbacks
6. **Close Callbacks:** socket.on('close', ...)

## Microtasks vs Macrotasks

### Microtasks (Higher priority)
- process.nextTick()
- Promise callbacks

### Macrotasks
- setTimeout, setInterval
- setImmediate
- I/O operations

## Common Pitfalls

### Blocking the Event Loop
Avoid CPU-intensive tasks on main thread
→ Use Worker Threads

### Memory Leaks
Không cleanup event listeners, timers`,
              en: `# Node.js Event Loop

## Single-threaded, Non-blocking

Node.js runs on single thread but can handle multiple concurrent operations thanks to event loop.

## Event Loop Phases

1. **Timers:** Execute setTimeout, setInterval callbacks
2. **Pending Callbacks:** I/O callbacks deferred to next iteration
3. **Idle, Prepare:** Internal use
4. **Poll:** Retrieve new I/O events
5. **Check:** Execute setImmediate callbacks
6. **Close Callbacks:** socket.on('close', ...)

## Microtasks vs Macrotasks

### Microtasks (Higher priority)
- process.nextTick()
- Promise callbacks

### Macrotasks
- setTimeout, setInterval
- setImmediate
- I/O operations

## Common Pitfalls

### Blocking the Event Loop
Avoid CPU-intensive tasks on main thread
→ Use Worker Threads

### Memory Leaks
Not cleaning up event listeners, timers`,
            },
          },
        ],
      },
      {
        id: "dotnet-backend",
        name: { vi: ".NET Backend", en: ".NET Backend" },
        content: {
          vi: `# .NET Backend

## ASP.NET Core

### Cross-platform
Chạy trên Windows, Linux, macOS

### High Performance
One of the fastest web frameworks

### Built-in DI
\`\`\`csharp
services.AddScoped<IUserService, UserService>();
\`\`\`

## MVC Pattern

### Controller
\`\`\`csharp
[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    [HttpGet("{id}")]
    public ActionResult<User> GetUser(int id)
    {
        return Ok(user);
    }
}
\`\`\`

## Entity Framework Core

### Code-First Approach
Define models in C#, generate database

### Migrations
Track database schema changes

## Middleware Pipeline
Configure request processing pipeline`,
          en: `# .NET Backend

## ASP.NET Core

### Cross-platform
Runs on Windows, Linux, macOS

### High Performance
One of the fastest web frameworks

### Built-in DI
\`\`\`csharp
services.AddScoped<IUserService, UserService>();
\`\`\`

## MVC Pattern

### Controller
\`\`\`csharp
[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    [HttpGet("{id}")]
    public ActionResult<User> GetUser(int id)
    {
        return Ok(user);
    }
}
\`\`\`

## Entity Framework Core

### Code-First Approach
Define models in C#, generate database

### Migrations
Track database schema changes

## Middleware Pipeline
Configure request processing pipeline`,
        },
      },
      {
        id: "golang-backend",
        name: { vi: "Golang Backend", en: "Golang Backend" },
        content: {
          vi: `# Golang Backend

## Why Go for Backend?

### Performance
Compiled language, fast execution

### Concurrency
Goroutines & channels for concurrent tasks

### Simple & Productive
Clean syntax, fast compilation

## Goroutines

\`\`\`go
go func() {
    // Runs concurrently
}()
\`\`\`

Lightweight threads managed by Go runtime

## Channels

\`\`\`go
ch := make(chan int)
go func() { ch <- 42 }()
value := <-ch
\`\`\`

Communication between goroutines

## Popular Frameworks

### Gin
Fast HTTP framework

### Echo
Minimalist, high performance

### Fiber
Express-like API

## Standard Library
Rich standard library for web development`,
          en: `# Golang Backend

## Why Go for Backend?

### Performance
Compiled language, fast execution

### Concurrency
Goroutines & channels for concurrent tasks

### Simple & Productive
Clean syntax, fast compilation

## Goroutines

\`\`\`go
go func() {
    // Runs concurrently
}()
\`\`\`

Lightweight threads managed by Go runtime

## Channels

\`\`\`go
ch := make(chan int)
go func() { ch <- 42 }()
value := <-ch
\`\`\`

Communication between goroutines

## Popular Frameworks

### Gin
Fast HTTP framework

### Echo
Minimalist, high performance

### Fiber
Express-like API

## Standard Library
Rich standard library for web development`,
        },
      },
    ],
  },
  {
    id: "frontend",
    name: { vi: "Frontend", en: "Frontend" },
    description: {
      vi: "Dành cho frontend dev & full-stack",
      en: "For frontend dev & full-stack",
    },
    icon: "🎨",
    topics: [
      {
        id: "html-css-js",
        name: {
          vi: "HTML / CSS / JavaScript core",
          en: "HTML / CSS / JavaScript core",
        },
        content: {
          vi: `# HTML / CSS / JavaScript Core

## HTML5 Semantic Elements
- **header, nav, main, article, section, aside, footer**
- Better SEO và accessibility

## CSS

### Box Model
Content → Padding → Border → Margin

### Flexbox
One-dimensional layout (row hoặc column)

### Grid
Two-dimensional layout

### CSS Specificity
Inline > ID > Class > Element

## JavaScript ES6+

### let / const
Block-scoped variables

### Arrow Functions
\`\`\`javascript
const add = (a, b) => a + b;
\`\`\`

### Destructuring
\`\`\`javascript
const { name, age } = user;
const [first, second] = array;
\`\`\`

### Spread / Rest
\`\`\`javascript
const newArray = [...oldArray, newItem];
const sum = (...numbers) => numbers.reduce((a, b) => a + b);
\`\`\`

### Template Literals
\`\`\`javascript
const message = \`Hello, \${name}!\`;
\`\`\`

### Modules
\`\`\`javascript
export const value = 42;
import { value } from './module';
\`\`\``,
          en: `# HTML / CSS / JavaScript Core

## HTML5 Semantic Elements
- **header, nav, main, article, section, aside, footer**
- Better SEO and accessibility

## CSS

### Box Model
Content → Padding → Border → Margin

### Flexbox
One-dimensional layout (row or column)

### Grid
Two-dimensional layout

### CSS Specificity
Inline > ID > Class > Element

## JavaScript ES6+

### let / const
Block-scoped variables

### Arrow Functions
\`\`\`javascript
const add = (a, b) => a + b;
\`\`\`

### Destructuring
\`\`\`javascript
const { name, age } = user;
const [first, second] = array;
\`\`\`

### Spread / Rest
\`\`\`javascript
const newArray = [...oldArray, newItem];
const sum = (...numbers) => numbers.reduce((a, b) => a + b);
\`\`\`

### Template Literals
\`\`\`javascript
const message = \`Hello, \${name}!\`;
\`\`\`

### Modules
\`\`\`javascript
export const value = 42;
import { value } from './module';
\`\`\``,
        },
      },
      {
        id: "async-js",
        name: {
          vi: "Async JS (Promise, async/await)",
          en: "Async JS (Promise, async/await)",
        },
        content: {
          vi: `# Async JavaScript

## Callbacks

\`\`\`javascript
getData(function(error, data) {
  if (error) handle(error);
  else process(data);
});
\`\`\`

**Problem:** Callback hell

## Promises

\`\`\`javascript
fetch('/api/users')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error));
\`\`\`

**States:** Pending → Fulfilled / Rejected

## Async / Await

\`\`\`javascript
async function getUsers() {
  try {
    const response = await fetch('/api/users');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}
\`\`\`

Cleaner syntax cho Promises

## Promise.all / Promise.race

\`\`\`javascript
// Wait for all
const results = await Promise.all([promise1, promise2]);

// First to complete
const winner = await Promise.race([promise1, promise2]);
\`\`\`

## Error Handling
Always use try/catch với async/await`,
          en: `# Async JavaScript

## Callbacks

\`\`\`javascript
getData(function(error, data) {
  if (error) handle(error);
  else process(data);
});
\`\`\`

**Problem:** Callback hell

## Promises

\`\`\`javascript
fetch('/api/users')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error));
\`\`\`

**States:** Pending → Fulfilled / Rejected

## Async / Await

\`\`\`javascript
async function getUsers() {
  try {
    const response = await fetch('/api/users');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}
\`\`\`

Cleaner syntax for Promises

## Promise.all / Promise.race

\`\`\`javascript
// Wait for all
const results = await Promise.all([promise1, promise2]);

// First to complete
const winner = await Promise.race([promise1, promise2]);
\`\`\`

## Error Handling
Always use try/catch with async/await`,
        },
      },
      {
        id: "react",
        name: { vi: "React", en: "React" },
        content: {
          vi: `# React

## Components

### Functional Components
\`\`\`jsx
function Welcome({ name }) {
  return <h1>Hello, {name}</h1>;
}
\`\`\`

## Hooks

### useState
\`\`\`jsx
const [count, setCount] = useState(0);
\`\`\`

### useEffect
\`\`\`jsx
useEffect(() => {
  // Side effect
  return () => {
    // Cleanup
  };
}, [dependencies]);
\`\`\`

### useContext
Share data without prop drilling

### useRef
Access DOM or persist values without re-render

### useMemo / useCallback
Performance optimization

## Virtual DOM
React updates real DOM efficiently by comparing virtual DOM

## JSX
JavaScript XML syntax

## Props vs State
- **Props:** Read-only, passed from parent
- **State:** Mutable, managed within component

## Lifecycle (với hooks)
- **Mount:** useEffect(() => {}, [])
- **Update:** useEffect(() => {})
- **Unmount:** useEffect cleanup`,
          en: `# React

## Components

### Functional Components
\`\`\`jsx
function Welcome({ name }) {
  return <h1>Hello, {name}</h1>;
}
\`\`\`

## Hooks

### useState
\`\`\`jsx
const [count, setCount] = useState(0);
\`\`\`

### useEffect
\`\`\`jsx
useEffect(() => {
  // Side effect
  return () => {
    // Cleanup
  };
}, [dependencies]);
\`\`\`

### useContext
Share data without prop drilling

### useRef
Access DOM or persist values without re-render

### useMemo / useCallback
Performance optimization

## Virtual DOM
React updates real DOM efficiently by comparing virtual DOM

## JSX
JavaScript XML syntax

## Props vs State
- **Props:** Read-only, passed from parent
- **State:** Mutable, managed within component

## Lifecycle (with hooks)
- **Mount:** useEffect(() => {}, [])
- **Update:** useEffect(() => {})
- **Unmount:** useEffect cleanup`,
        },
      },
      {
        id: "angular",
        name: { vi: "Angular", en: "Angular" },
        content: {
          vi: `# Angular

## TypeScript-based
Full-featured framework từ Google

## Components

\`\`\`typescript
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent {
  name = 'John';
}
\`\`\`

## Two-way Data Binding
\`\`\`html
<input [(ngModel)]="name">
\`\`\`

## Dependency Injection
\`\`\`typescript
constructor(private userService: UserService) {}
\`\`\`

## Directives
- **ngIf:** Conditional rendering
- **ngFor:** Loop
- **ngClass, ngStyle:** Dynamic classes/styles

## Services
Singleton classes cho business logic, API calls

## RxJS
Reactive programming với Observables

## Modules
Organize code into NgModules`,
          en: `# Angular

## TypeScript-based
Full-featured framework from Google

## Components

\`\`\`typescript
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent {
  name = 'John';
}
\`\`\`

## Two-way Data Binding
\`\`\`html
<input [(ngModel)]="name">
\`\`\`

## Dependency Injection
\`\`\`typescript
constructor(private userService: UserService) {}
\`\`\`

## Directives
- **ngIf:** Conditional rendering
- **ngFor:** Loop
- **ngClass, ngStyle:** Dynamic classes/styles

## Services
Singleton classes for business logic, API calls

## RxJS
Reactive programming with Observables

## Modules
Organize code into NgModules`,
        },
      },
      {
        id: "vue",
        name: { vi: "Vue", en: "Vue" },
        content: {
          vi: `# Vue.js

## Progressive Framework
Có thể dùng từng phần hoặc full SPA

## Components

\`\`\`vue
<template>
  <div>{{ message }}</div>
</template>

<script>
export default {
  data() {
    return {
      message: 'Hello Vue!'
    }
  }
}
</script>
\`\`\`

## Reactivity System
Tự động track dependencies và update DOM

## Directives
- **v-if, v-else:** Conditional
- **v-for:** Loop
- **v-model:** Two-way binding
- **v-on (@):** Event handling
- **v-bind (:):** Attribute binding

## Computed Properties
\`\`\`javascript
computed: {
  fullName() {
    return this.firstName + ' ' + this.lastName;
  }
}
\`\`\`

## Composition API (Vue 3)
\`\`\`javascript
import { ref, computed } from 'vue';

setup() {
  const count = ref(0);
  const doubled = computed(() => count.value * 2);
  return { count, doubled };
}
\`\`\``,
          en: `# Vue.js

## Progressive Framework
Can use partially or full SPA

## Components

\`\`\`vue
<template>
  <div>{{ message }}</div>
</template>

<script>
export default {
  data() {
    return {
      message: 'Hello Vue!'
    }
  }
}
</script>
\`\`\`

## Reactivity System
Automatically tracks dependencies and updates DOM

## Directives
- **v-if, v-else:** Conditional
- **v-for:** Loop
- **v-model:** Two-way binding
- **v-on (@):** Event handling
- **v-bind (:):** Attribute binding

## Computed Properties
\`\`\`javascript
computed: {
  fullName() {
    return this.firstName + ' ' + this.lastName;
  }
}
\`\`\`

## Composition API (Vue 3)
\`\`\`javascript
import { ref, computed } from 'vue';

setup() {
  const count = ref(0);
  const doubled = computed(() => count.value * 2);
  return { count, doubled };
}
\`\`\``,
        },
      },
      {
        id: "state-management",
        name: { vi: "State Management", en: "State Management" },
        content: {
          vi: `# State Management

## Why State Management?

### Problems
- Prop drilling
- Shared state across components
- Complex state logic

## Redux (React)

### Principles
- Single source of truth (Store)
- State is read-only
- Changes via pure functions (Reducers)

### Flow
Action → Reducer → Store → View

### Redux Toolkit
Modern Redux với less boilerplate

## Context API (React)
Built-in React, lightweight alternative to Redux

## Vuex (Vue)
Similar to Redux, tailored for Vue

## Zustand / Jotai (React)
Simpler alternatives, less boilerplate

## When to use?
- Large app with complex state
- State shared across many components
- Time-travel debugging needed`,
          en: `# State Management

## Why State Management?

### Problems
- Prop drilling
- Shared state across components
- Complex state logic

## Redux (React)

### Principles
- Single source of truth (Store)
- State is read-only
- Changes via pure functions (Reducers)

### Flow
Action → Reducer → Store → View

### Redux Toolkit
Modern Redux with less boilerplate

## Context API (React)
Built-in React, lightweight alternative to Redux

## Vuex (Vue)
Similar to Redux, tailored for Vue

## Zustand / Jotai (React)
Simpler alternatives, less boilerplate

## When to use?
- Large app with complex state
- State shared across many components
- Time-travel debugging needed`,
        },
      },
    ],
  },
  {
    id: "database",
    name: { vi: "Database", en: "Database" },
    description: {
      vi: 'Chủ đề "đào sâu" trong phỏng vấn',
      en: "Deep dive topic in interviews",
    },
    icon: "💾",
    topics: [
      {
        id: "sql-nosql",
        name: { vi: "SQL vs NoSQL", en: "SQL vs NoSQL" },
        content: {
          vi: `# SQL vs NoSQL

## SQL (Relational)

### Characteristics
- Structured data
- Fixed schema
- ACID transactions
- Relationships via JOIN

### Examples
MySQL, PostgreSQL, Oracle, SQL Server

### Use Cases
- Financial systems
- E-commerce
- Data consistency critical

## NoSQL

### Types

#### Document (MongoDB)
- Flexible schema
- JSON-like documents

#### Key-Value (Redis)
- Simple key-value pairs
- Fast caching

#### Column-family (Cassandra)
- Wide-column store
- High scalability

#### Graph (Neo4j)
- Relationship-focused
- Social networks

### Use Cases
- Big data
- Real-time web apps
- Flexible schema needed

## SQL vs NoSQL

| Aspect | SQL | NoSQL |
|--------|-----|-------|
| Schema | Fixed | Flexible |
| Scaling | Vertical | Horizontal |
| Consistency | Strong | Eventual (usually) |
| Query | SQL | Varies |`,
          en: `# SQL vs NoSQL

## SQL (Relational)

### Characteristics
- Structured data
- Fixed schema
- ACID transactions
- Relationships via JOIN

### Examples
MySQL, PostgreSQL, Oracle, SQL Server

### Use Cases
- Financial systems
- E-commerce
- Data consistency critical

## NoSQL

### Types

#### Document (MongoDB)
- Flexible schema
- JSON-like documents

#### Key-Value (Redis)
- Simple key-value pairs
- Fast caching

#### Column-family (Cassandra)
- Wide-column store
- High scalability

#### Graph (Neo4j)
- Relationship-focused
- Social networks

### Use Cases
- Big data
- Real-time web apps
- Flexible schema needed

## SQL vs NoSQL

| Aspect | SQL | NoSQL |
|--------|-----|-------|
| Schema | Fixed | Flexible |
| Scaling | Vertical | Horizontal |
| Consistency | Strong | Eventual (usually) |
| Query | SQL | Varies |`,
        },
      },
      {
        id: "indexing",
        name: { vi: "Indexing", en: "Indexing" },
        content: {
          vi: `# Database Indexing

## What is Index?
Data structure giúp tìm kiếm nhanh hơn, giống như index trong sách.

## Types of Index

### B-Tree Index
- Default trong most databases
- Good for range queries
- O(log n) search

### Hash Index
- Fast equality search O(1)
- Not good for range queries

### Full-text Index
- For text search
- Support LIKE, MATCH queries

### Composite Index
Index trên multiple columns

## Creating Index

\`\`\`sql
CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_name_age ON users(name, age);
\`\`\`

## Pros & Cons

### Pros
- Faster SELECT queries
- Faster WHERE, ORDER BY

### Cons
- Slower INSERT, UPDATE, DELETE
- Extra storage space
- Maintenance overhead

## Best Practices
- Index foreign keys
- Index columns used in WHERE, JOIN
- Don't over-index
- Monitor query performance`,
          en: `# Database Indexing

## What is Index?
Data structure that speeds up searches, like index in a book.

## Types of Index

### B-Tree Index
- Default in most databases
- Good for range queries
- O(log n) search

### Hash Index
- Fast equality search O(1)
- Not good for range queries

### Full-text Index
- For text search
- Support LIKE, MATCH queries

### Composite Index
Index on multiple columns

## Creating Index

\`\`\`sql
CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_name_age ON users(name, age);
\`\`\`

## Pros & Cons

### Pros
- Faster SELECT queries
- Faster WHERE, ORDER BY

### Cons
- Slower INSERT, UPDATE, DELETE
- Extra storage space
- Maintenance overhead

## Best Practices
- Index foreign keys
- Index columns used in WHERE, JOIN
- Don't over-index
- Monitor query performance`,
        },
      },
      {
        id: "normalization",
        name: { vi: "Normalization", en: "Normalization" },
        content: {
          vi: `# Database Normalization

## Mục đích
- Reduce data redundancy
- Improve data integrity
- Organize data efficiently

## Normal Forms

### 1NF (First Normal Form)
- Atomic values (không có multi-value fields)
- Each row unique
- No repeating groups

### 2NF (Second Normal Form)
- 1NF +
- No partial dependency (non-key attributes depend on whole primary key)

### 3NF (Third Normal Form)
- 2NF +
- No transitive dependency (non-key attributes depend only on primary key)

### BCNF (Boyce-Codd)
- Stricter version of 3NF

## Example

### Unnormalized
| OrderID | Customer | Product1 | Product2 |
|---------|----------|----------|----------|

### Normalized
**Orders:** OrderID, CustomerID
**OrderItems:** OrderItemID, OrderID, ProductID
**Customers:** CustomerID, Name
**Products:** ProductID, Name

## Denormalization
Sometimes intentionally denormalize for performance (read-heavy systems)`,
          en: `# Database Normalization

## Purpose
- Reduce data redundancy
- Improve data integrity
- Organize data efficiently

## Normal Forms

### 1NF (First Normal Form)
- Atomic values (no multi-value fields)
- Each row unique
- No repeating groups

### 2NF (Second Normal Form)
- 1NF +
- No partial dependency (non-key attributes depend on whole primary key)

### 3NF (Third Normal Form)
- 2NF +
- No transitive dependency (non-key attributes depend only on primary key)

### BCNF (Boyce-Codd)
- Stricter version of 3NF

## Example

### Unnormalized
| OrderID | Customer | Product1 | Product2 |
|---------|----------|----------|----------|

### Normalized
**Orders:** OrderID, CustomerID
**OrderItems:** OrderItemID, OrderID, ProductID
**Customers:** CustomerID, Name
**Products:** ProductID, Name

## Denormalization
Sometimes intentionally denormalize for performance (read-heavy systems)`,
        },
      },
      {
        id: "transaction-isolation",
        name: { vi: "Transaction Isolation", en: "Transaction Isolation" },
        content: {
          vi: `# Transaction Isolation Levels

Xem thêm tại mục Backend > Java > Transaction & ACID

## Read Phenomena

### Dirty Read
Read uncommitted changes từ transaction khác

### Non-repeatable Read
Same query returns different data trong cùng transaction (do UPDATE)

### Phantom Read
Same query returns different rows (do INSERT/DELETE)

## Isolation Levels

### READ UNCOMMITTED
- Lowest isolation
- Allows: Dirty read, Non-repeatable read, Phantom read
- Fastest

### READ COMMITTED
- Prevents: Dirty read
- Allows: Non-repeatable read, Phantom read
- Default in many databases

### REPEATABLE READ
- Prevents: Dirty read, Non-repeatable read
- Allows: Phantom read
- MySQL InnoDB default

### SERIALIZABLE
- Highest isolation
- Prevents: All phenomena
- Slowest

## Trade-off
Higher isolation = More consistency, Less concurrency`,
          en: `# Transaction Isolation Levels

See also Backend > Java > Transaction & ACID

## Read Phenomena

### Dirty Read
Read uncommitted changes from other transaction

### Non-repeatable Read
Same query returns different data in same transaction (due to UPDATE)

### Phantom Read
Same query returns different rows (due to INSERT/DELETE)

## Isolation Levels

### READ UNCOMMITTED
- Lowest isolation
- Allows: Dirty read, Non-repeatable read, Phantom read
- Fastest

### READ COMMITTED
- Prevents: Dirty read
- Allows: Non-repeatable read, Phantom read
- Default in many databases

### REPEATABLE READ
- Prevents: Dirty read, Non-repeatable read
- Allows: Phantom read
- MySQL InnoDB default

### SERIALIZABLE
- Highest isolation
- Prevents: All phenomena
- Slowest

## Trade-off
Higher isolation = More consistency, Less concurrency`,
        },
      },
    ],
  },
  {
    id: "system-design",
    name: { vi: "Thiết kế hệ thống", en: "System Design" },
    description: {
      vi: "Chủ đề mid → senior → lead",
      en: "Topic for mid → senior → lead",
    },
    icon: "🏗️",
    topics: [
      {
        id: "scalability",
        name: { vi: "Scalability", en: "Scalability" },
        content: {
          vi: `# Scalability

## Vertical Scaling (Scale Up)
Tăng resources của một server (CPU, RAM, Disk)

### Pros
- Simple
- No code changes

### Cons
- Hardware limits
- Single point of failure
- Expensive

## Horizontal Scaling (Scale Out)
Thêm nhiều servers

### Pros
- Unlimited scaling
- No single point of failure
- Cost effective

### Cons
- Complexity increases
- Need load balancer
- Data consistency challenges

## Strategies

### Stateless Applications
Store state externally (database, cache)

### Database Scaling
- Read replicas
- Sharding
- Partitioning

### Caching
Reduce database load

### Async Processing
Queue systems for heavy tasks

### CDN
Static content delivery`,
          en: `# Scalability

## Vertical Scaling (Scale Up)
Increase resources of one server (CPU, RAM, Disk)

### Pros
- Simple
- No code changes

### Cons
- Hardware limits
- Single point of failure
- Expensive

## Horizontal Scaling (Scale Out)
Add more servers

### Pros
- Unlimited scaling
- No single point of failure
- Cost effective

### Cons
- Complexity increases
- Need load balancer
- Data consistency challenges

## Strategies

### Stateless Applications
Store state externally (database, cache)

### Database Scaling
- Read replicas
- Sharding
- Partitioning

### Caching
Reduce database load

### Async Processing
Queue systems for heavy tasks

### CDN
Static content delivery`,
        },
      },
      {
        id: "load-balancer",
        name: { vi: "Load Balancer", en: "Load Balancer" },
        content: {
          vi: `# Load Balancer

## What is Load Balancer?
Distribute traffic across multiple servers

## Algorithms

### Round Robin
Distribute equally in sequence

### Least Connections
Send to server with fewest active connections

### IP Hash
Same client always goes to same server

### Weighted Round Robin
Servers with higher capacity get more requests

## Types

### Layer 4 (Transport Layer)
- Route based on IP, Port
- Fast, simple
- No content inspection

### Layer 7 (Application Layer)
- Route based on content (URL, headers)
- More flexible
- SSL termination

## Health Checks
Monitor server health, remove unhealthy servers

## Examples
- Nginx
- HAProxy
- AWS ELB/ALB
- Cloud Load Balancers`,
          en: `# Load Balancer

## What is Load Balancer?
Distribute traffic across multiple servers

## Algorithms

### Round Robin
Distribute equally in sequence

### Least Connections
Send to server with fewest active connections

### IP Hash
Same client always goes to same server

### Weighted Round Robin
Servers with higher capacity get more requests

## Types

### Layer 4 (Transport Layer)
- Route based on IP, Port
- Fast, simple
- No content inspection

### Layer 7 (Application Layer)
- Route based on content (URL, headers)
- More flexible
- SSL termination

## Health Checks
Monitor server health, remove unhealthy servers

## Examples
- Nginx
- HAProxy
- AWS ELB/ALB
- Cloud Load Balancers`,
        },
      },
      {
        id: "microservices",
        name: {
          vi: "Monolith vs Microservices",
          en: "Monolith vs Microservices",
        },
        content: {
          vi: `# Monolith vs Microservices

## Monolithic Architecture

### Characteristics
- Single codebase
- Single deployment unit
- Shared database

### Pros
- Simple to develop initially
- Easy to test
- Easy to deploy

### Cons
- Hard to scale parts independently
- Tight coupling
- Long deployment cycles
- Technology stack locked

## Microservices Architecture

### Characteristics
- Multiple small services
- Independent deployment
- Separate databases (usually)
- API communication

### Pros
- Independent scaling
- Technology diversity
- Fault isolation
- Faster deployment

### Cons
- Complex infrastructure
- Network latency
- Data consistency challenges
- Testing complexity

## When to use?

### Monolith
- Small teams
- Simple domain
- MVP/Prototype

### Microservices
- Large teams
- Complex domain
- Need independent scaling`,
          en: `# Monolith vs Microservices

## Monolithic Architecture

### Characteristics
- Single codebase
- Single deployment unit
- Shared database

### Pros
- Simple to develop initially
- Easy to test
- Easy to deploy

### Cons
- Hard to scale parts independently
- Tight coupling
- Long deployment cycles
- Technology stack locked

## Microservices Architecture

### Characteristics
- Multiple small services
- Independent deployment
- Separate databases (usually)
- API communication

### Pros
- Independent scaling
- Technology diversity
- Fault isolation
- Faster deployment

### Cons
- Complex infrastructure
- Network latency
- Data consistency challenges
- Testing complexity

## When to use?

### Monolith
- Small teams
- Simple domain
- MVP/Prototype

### Microservices
- Large teams
- Complex domain
- Need independent scaling`,
        },
      },
      {
        id: "cap-theorem",
        name: { vi: "CAP Theorem", en: "CAP Theorem" },
        content: {
          vi: `# CAP Theorem

## Ba thuộc tính

### Consistency (Nhất quán)
Mọi read đều nhận được latest write hoặc error

### Availability (Khả dụng)
Mọi request đều nhận được response (không đảm bảo latest data)

### Partition Tolerance (Chịu phân mảnh)
System hoạt động dù có network partition

## CAP Theorem
**Chỉ có thể đạt được 2 trong 3 thuộc tính**

## Combinations

### CP (Consistency + Partition Tolerance)
- Sacrifice availability
- Examples: MongoDB, HBase, Redis
- Banking systems

### AP (Availability + Partition Tolerance)
- Sacrifice consistency (eventual consistency)
- Examples: Cassandra, DynamoDB, CouchDB
- Social media feeds

### CA (Consistency + Availability)
- Không có partition tolerance
- Không thực tế trong distributed systems
- Single-server databases

## In Practice
Most systems choose AP và implement eventual consistency`,
          en: `# CAP Theorem

## Three Properties

### Consistency
Every read receives the most recent write or an error

### Availability
Every request receives a response (not guaranteed to be latest)

### Partition Tolerance
System operates despite network partitions

## CAP Theorem
**Can only achieve 2 out of 3 properties**

## Combinations

### CP (Consistency + Partition Tolerance)
- Sacrifice availability
- Examples: MongoDB, HBase, Redis
- Banking systems

### AP (Availability + Partition Tolerance)
- Sacrifice consistency (eventual consistency)
- Examples: Cassandra, DynamoDB, CouchDB
- Social media feeds

### CA (Consistency + Availability)
- No partition tolerance
- Not realistic in distributed systems
- Single-server databases

## In Practice
Most systems choose AP and implement eventual consistency`,
        },
      },
      {
        id: "caching",
        name: { vi: "Caching Strategy", en: "Caching Strategy" },
        content: {
          vi: `# Caching Strategy

## Cache Patterns

### Cache-Aside (Lazy Loading)
1. Check cache
2. If miss, load from DB
3. Store in cache
4. Return data

**Pros:** Only cache what's needed
**Cons:** Cache miss penalty

### Read-Through
Cache sits between app and DB, auto-loads on miss

### Write-Through
Write to cache and DB simultaneously

**Pros:** Cache always fresh
**Cons:** Write latency

### Write-Behind (Write-Back)
Write to cache first, async write to DB

**Pros:** Fast writes
**Cons:** Risk of data loss

### Refresh-Ahead
Proactively refresh cache before expiration

## Cache Eviction Policies

- **LRU (Least Recently Used):** Most common
- **LFU (Least Frequently Used):** Track frequency
- **FIFO:** First in, first out
- **TTL:** Time-based expiration

## Common Tools
- Redis
- Memcached
- CDN (for static content)`,
          en: `# Caching Strategy

## Cache Patterns

### Cache-Aside (Lazy Loading)
1. Check cache
2. If miss, load from DB
3. Store in cache
4. Return data

**Pros:** Only cache what's needed
**Cons:** Cache miss penalty

### Read-Through
Cache sits between app and DB, auto-loads on miss

### Write-Through
Write to cache and DB simultaneously

**Pros:** Cache always fresh
**Cons:** Write latency

### Write-Behind (Write-Back)
Write to cache first, async write to DB

**Pros:** Fast writes
**Cons:** Risk of data loss

### Refresh-Ahead
Proactively refresh cache before expiration

## Cache Eviction Policies

- **LRU (Least Recently Used):** Most common
- **LFU (Least Frequently Used):** Track frequency
- **FIFO:** First in, first out
- **TTL:** Time-based expiration

## Common Tools
- Redis
- Memcached
- CDN (for static content)`,
        },
      },
    ],
  },
  {
    id: "devops",
    name: { vi: "DevOps & Cloud", en: "DevOps & Cloud" },
    description: {
      vi: "Backend hiện đại gần như bắt buộc",
      en: "Almost mandatory for modern backend",
    },
    icon: "☁️",
    topics: [
      {
        id: "linux",
        name: { vi: "Linux", en: "Linux" },
        content: {
          vi: `# Linux Basics

## Essential Commands

### File Operations
\`\`\`bash
ls -la          # List files
cd /path        # Change directory
cp src dest     # Copy
mv src dest     # Move/Rename
rm file         # Remove
mkdir dir       # Create directory
\`\`\`

### File Viewing
\`\`\`bash
cat file        # Display content
less file       # Page through
head -n 10 file # First 10 lines
tail -f file    # Follow file (logs)
\`\`\`

### Search & Filter
\`\`\`bash
grep "pattern" file
find /path -name "*.log"
\`\`\`

### Process Management
\`\`\`bash
ps aux          # List processes
top/htop        # Monitor processes
kill PID        # Kill process
\`\`\`

### Permissions
\`\`\`bash
chmod 755 file  # Change permissions
chown user:group file
\`\`\`

### Networking
\`\`\`bash
curl URL
wget URL
netstat -tulpn
\`\`\``,
          en: `# Linux Basics

## Essential Commands

### File Operations
\`\`\`bash
ls -la          # List files
cd /path        # Change directory
cp src dest     # Copy
mv src dest     # Move/Rename
rm file         # Remove
mkdir dir       # Create directory
\`\`\`

### File Viewing
\`\`\`bash
cat file        # Display content
less file       # Page through
head -n 10 file # First 10 lines
tail -f file    # Follow file (logs)
\`\`\`

### Search & Filter
\`\`\`bash
grep "pattern" file
find /path -name "*.log"
\`\`\`

### Process Management
\`\`\`bash
ps aux          # List processes
top/htop        # Monitor processes
kill PID        # Kill process
\`\`\`

### Permissions
\`\`\`bash
chmod 755 file  # Change permissions
chown user:group file
\`\`\`

### Networking
\`\`\`bash
curl URL
wget URL
netstat -tulpn
\`\`\``,
        },
      },
      {
        id: "docker",
        name: { vi: "Docker", en: "Docker" },
        content: {
          vi: `# Docker

## What is Docker?
Platform để package applications vào containers

## Containers vs VMs

### Containers
- Lightweight
- Share host OS kernel
- Seconds to start
- Less resource usage

### VMs
- Heavy
- Full OS per VM
- Minutes to start
- More resource usage

## Docker Components

### Image
Template to create containers

### Container
Running instance of image

### Dockerfile
Script to build image

### Docker Hub
Registry for images

## Basic Commands

\`\`\`bash
docker build -t myapp .
docker run -p 8080:80 myapp
docker ps               # List running containers
docker stop <id>
docker logs <id>
docker exec -it <id> bash
\`\`\`

## Dockerfile Example

\`\`\`dockerfile
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
\`\`\``,
          en: `# Docker

## What is Docker?
Platform to package applications into containers

## Containers vs VMs

### Containers
- Lightweight
- Share host OS kernel
- Seconds to start
- Less resource usage

### VMs
- Heavy
- Full OS per VM
- Minutes to start
- More resource usage

## Docker Components

### Image
Template to create containers

### Container
Running instance of image

### Dockerfile
Script to build image

### Docker Hub
Registry for images

## Basic Commands

\`\`\`bash
docker build -t myapp .
docker run -p 8080:80 myapp
docker ps               # List running containers
docker stop <id>
docker logs <id>
docker exec -it <id> bash
\`\`\`

## Dockerfile Example

\`\`\`dockerfile
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
\`\`\``,
        },
      },
      {
        id: "kubernetes",
        name: { vi: "Kubernetes", en: "Kubernetes" },
        content: {
          vi: `# Kubernetes (K8s)

## What is Kubernetes?
Container orchestration platform - quản lý deploy, scale, và manage containerized applications

## Key Concepts

### Pod
Smallest deployable unit, chứa 1+ containers

### Deployment
Manage desired state of Pods

### Service
Expose Pods to network

### Namespace
Virtual clusters trong cluster

### ConfigMap & Secret
Configuration và sensitive data

### Ingress
HTTP/HTTPS routing to services

## Why Kubernetes?

- Auto-scaling
- Self-healing (restart failed containers)
- Load balancing
- Rolling updates
- Service discovery

## Basic Commands

\`\`\`bash
kubectl get pods
kubectl get services
kubectl apply -f deployment.yaml
kubectl scale deployment myapp --replicas=5
kubectl logs <pod-name>
\`\`\`

## Popular Managed K8s
- AWS EKS
- Google GKE
- Azure AKS`,
          en: `# Kubernetes (K8s)

## What is Kubernetes?
Container orchestration platform - manages deploy, scale, and manage containerized applications

## Key Concepts

### Pod
Smallest deployable unit, contains 1+ containers

### Deployment
Manages desired state of Pods

### Service
Exposes Pods to network

### Namespace
Virtual clusters within cluster

### ConfigMap & Secret
Configuration and sensitive data

### Ingress
HTTP/HTTPS routing to services

## Why Kubernetes?

- Auto-scaling
- Self-healing (restart failed containers)
- Load balancing
- Rolling updates
- Service discovery

## Basic Commands

\`\`\`bash
kubectl get pods
kubectl get services
kubectl apply -f deployment.yaml
kubectl scale deployment myapp --replicas=5
kubectl logs <pod-name>
\`\`\`

## Popular Managed K8s
- AWS EKS
- Google GKE
- Azure AKS`,
        },
      },
      {
        id: "cicd",
        name: { vi: "CI/CD", en: "CI/CD" },
        content: {
          vi: `# CI/CD

## Continuous Integration (CI)

### What?
Automatically build và test code mỗi khi commit

### Benefits
- Early bug detection
- Reduce integration issues
- Faster feedback

### Tools
- Jenkins
- GitLab CI
- GitHub Actions
- CircleCI

## Continuous Deployment/Delivery (CD)

### Continuous Delivery
Code luôn sẵn sàng deploy (manual trigger)

### Continuous Deployment
Tự động deploy to production sau khi pass tests

### Benefits
- Faster releases
- Smaller, safer changes
- Automated rollback

## Typical Pipeline

1. **Commit** → Push code
2. **Build** → Compile, bundle
3. **Test** → Unit, integration tests
4. **Deploy to Staging** → Test environment
5. **Deploy to Production** → Live environment

## Best Practices
- Keep builds fast
- Test early and often
- Automate everything
- Monitor deployments`,
          en: `# CI/CD

## Continuous Integration (CI)

### What?
Automatically build and test code on every commit

### Benefits
- Early bug detection
- Reduce integration issues
- Faster feedback

### Tools
- Jenkins
- GitLab CI
- GitHub Actions
- CircleCI

## Continuous Deployment/Delivery (CD)

### Continuous Delivery
Code always ready to deploy (manual trigger)

### Continuous Deployment
Automatically deploy to production after passing tests

### Benefits
- Faster releases
- Smaller, safer changes
- Automated rollback

## Typical Pipeline

1. **Commit** → Push code
2. **Build** → Compile, bundle
3. **Test** → Unit, integration tests
4. **Deploy to Staging** → Test environment
5. **Deploy to Production** → Live environment

## Best Practices
- Keep builds fast
- Test early and often
- Automate everything
- Monitor deployments`,
        },
      },
      {
        id: "cloud",
        name: {
          vi: "Cloud (AWS / GCP / Azure)",
          en: "Cloud (AWS / GCP / Azure)",
        },
        content: {
          vi: `# Cloud Computing

## Service Models

### IaaS (Infrastructure as a Service)
- Virtual machines, storage, networks
- Examples: AWS EC2, Google Compute Engine

### PaaS (Platform as a Service)
- Platform để run applications
- Examples: AWS Elastic Beanstalk, Google App Engine, Heroku

### SaaS (Software as a Service)
- Ready-to-use applications
- Examples: Gmail, Salesforce

## AWS Common Services

### Compute
- **EC2:** Virtual servers
- **Lambda:** Serverless functions
- **ECS/EKS:** Container orchestration

### Storage
- **S3:** Object storage
- **EBS:** Block storage for EC2

### Database
- **RDS:** Relational databases
- **DynamoDB:** NoSQL

### Networking
- **VPC:** Virtual network
- **CloudFront:** CDN
- **Route 53:** DNS

## Benefits
- Scalability
- Pay-as-you-go
- Global reach
- Managed services`,
          en: `# Cloud Computing

## Service Models

### IaaS (Infrastructure as a Service)
- Virtual machines, storage, networks
- Examples: AWS EC2, Google Compute Engine

### PaaS (Platform as a Service)
- Platform to run applications
- Examples: AWS Elastic Beanstalk, Google App Engine, Heroku

### SaaS (Software as a Service)
- Ready-to-use applications
- Examples: Gmail, Salesforce

## AWS Common Services

### Compute
- **EC2:** Virtual servers
- **Lambda:** Serverless functions
- **ECS/EKS:** Container orchestration

### Storage
- **S3:** Object storage
- **EBS:** Block storage for EC2

### Database
- **RDS:** Relational databases
- **DynamoDB:** NoSQL

### Networking
- **VPC:** Virtual network
- **CloudFront:** CDN
- **Route 53:** DNS

## Benefits
- Scalability
- Pay-as-you-go
- Global reach
- Managed services`,
        },
      },
    ],
  },
  {
    id: "other-skills",
    name: { vi: "Kĩ năng khác", en: "Other Skills" },
    description: {
      vi: 'Phân biệt dev "code được" và "làm được việc"',
      en: 'Differentiates "can code" vs "can work"',
    },
    icon: "🛡️",
    topics: [
      {
        id: "testing",
        name: {
          vi: "Unit / Integration / E2E Testing",
          en: "Unit / Integration / E2E Testing",
        },
        content: {
          vi: `# Testing Levels

## Unit Testing

### What?
Test individual units/components in isolation

### Characteristics
- Fast
- Isolated (use mocks)
- Many tests

### Example
Test a single function/method

### Tools
JUnit, pytest, Jest, Mocha

## Integration Testing

### What?
Test interaction between components

### Characteristics
- Slower than unit tests
- Test real integrations
- Database, API calls

### Example
Test service + repository + database

## E2E (End-to-End) Testing

### What?
Test entire application flow from user perspective

### Characteristics
- Slowest
- Most realistic
- Cover complete scenarios

### Example
User login → browse products → checkout

### Tools
Selenium, Cypress, Playwright

## Test Pyramid

**E2E (Few)**  
↑  
**Integration (Some)**  
↑  
**Unit (Many)**

More unit tests, fewer E2E tests`,
          en: `# Testing Levels

## Unit Testing

### What?
Test individual units/components in isolation

### Characteristics
- Fast
- Isolated (use mocks)
- Many tests

### Example
Test a single function/method

### Tools
JUnit, pytest, Jest, Mocha

## Integration Testing

### What?
Test interaction between components

### Characteristics
- Slower than unit tests
- Test real integrations
- Database, API calls

### Example
Test service + repository + database

## E2E (End-to-End) Testing

### What?
Test entire application flow from user perspective

### Characteristics
- Slowest
- Most realistic
- Cover complete scenarios

### Example
User login → browse products → checkout

### Tools
Selenium, Cypress, Playwright

## Test Pyramid

**E2E (Few)**  
↑  
**Integration (Some)**  
↑  
**Unit (Many)**

More unit tests, fewer E2E tests`,
        },
      },
      {
        id: "tdd-bdd",
        name: { vi: "TDD / BDD", en: "TDD / BDD" },
        content: {
          vi: `# TDD / BDD

## TDD (Test-Driven Development)

### Process
1. **Red:** Write failing test
2. **Green:** Write minimal code to pass
3. **Refactor:** Improve code

### Benefits
- Better design
- High test coverage
- Confidence in changes

### Challenges
- Time investment
- Learning curve

## BDD (Behavior-Driven Development)

### What?
Extension of TDD, focus on business behavior

### Gherkin Syntax
\`\`\`gherkin
Feature: User Login
  Scenario: Successful login
    Given user is on login page
    When user enters valid credentials
    Then user should see dashboard
\`\`\`

### Tools
Cucumber, SpecFlow, Behave

### Benefits
- Collaboration với non-technical stakeholders
- Executable specifications
- Living documentation

## TDD vs BDD
- TDD: Technical, unit level
- BDD: Business, feature level`,
          en: `# TDD / BDD

## TDD (Test-Driven Development)

### Process
1. **Red:** Write failing test
2. **Green:** Write minimal code to pass
3. **Refactor:** Improve code

### Benefits
- Better design
- High test coverage
- Confidence in changes

### Challenges
- Time investment
- Learning curve

## BDD (Behavior-Driven Development)

### What?
Extension of TDD, focuses on business behavior

### Gherkin Syntax
\`\`\`gherkin
Feature: User Login
  Scenario: Successful login
    Given user is on login page
    When user enters valid credentials
    Then user should see dashboard
\`\`\`

### Tools
Cucumber, SpecFlow, Behave

### Benefits
- Collaboration with non-technical stakeholders
- Executable specifications
- Living documentation

## TDD vs BDD
- TDD: Technical, unit level
- BDD: Business, feature level`,
        },
      },
      {
        id: "code-review",
        name: { vi: "Code Review", en: "Code Review" },
        content: {
          vi: `# Code Review

## Benefits

### Quality
- Catch bugs early
- Ensure standards
- Share knowledge

### Collaboration
- Team learning
- Better communication
- Consistent code style

## Best Practices

### For Author
- Keep changes small
- Write clear description
- Self-review first
- Respond constructively

### For Reviewer
- Be respectful và constructive
- Look for logic, not style (use linter)
- Ask questions
- Approve promptly

## What to Review?

### Functionality
- Logic correctness
- Edge cases handled
- Requirements met

### Code Quality
- Readability
- Maintainability
- Performance

### Security
- Input validation
- Authentication/Authorization
- Sensitive data handling

### Tests
- Adequate coverage
- Test quality

## Tools
GitHub PR, GitLab MR, Bitbucket, Gerrit`,
          en: `# Code Review

## Benefits

### Quality
- Catch bugs early
- Ensure standards
- Share knowledge

### Collaboration
- Team learning
- Better communication
- Consistent code style

## Best Practices

### For Author
- Keep changes small
- Write clear description
- Self-review first
- Respond constructively

### For Reviewer
- Be respectful and constructive
- Look for logic, not style (use linter)
- Ask questions
- Approve promptly

## What to Review?

### Functionality
- Logic correctness
- Edge cases handled
- Requirements met

### Code Quality
- Readability
- Maintainability
- Performance

### Security
- Input validation
- Authentication/Authorization
- Sensitive data handling

### Tests
- Adequate coverage
- Test quality

## Tools
GitHub PR, GitLab MR, Bitbucket, Gerrit`,
        },
      },
      {
        id: "owasp",
        name: { vi: "OWASP Top 10", en: "OWASP Top 10" },
        content: {
          vi: `# OWASP Top 10

## Top Security Risks

### 1. Broken Access Control
Users truy cập resources mà không có quyền

**Prevention:** Enforce access controls, deny by default

### 2. Cryptographic Failures
Weak encryption, plain text passwords

**Prevention:** Use strong algorithms, HTTPS, encrypt sensitive data

### 3. Injection
SQL, NoSQL, Command injection

**Prevention:** Parameterized queries, input validation

### 4. Insecure Design
Thiếu security controls từ đầu

**Prevention:** Threat modeling, secure design patterns

### 5. Security Misconfiguration
Default configs, verbose errors, unnecessary features

**Prevention:** Hardening, remove defaults, minimal permissions

### 6. Vulnerable Components
Using libraries với known vulnerabilities

**Prevention:** Keep dependencies updated, monitor CVEs

### 7. Authentication Failures
Weak passwords, no MFA, session issues

**Prevention:** Strong password policy, MFA, secure session management

### 8. Data Integrity Failures
Không verify data integrity

**Prevention:** Digital signatures, integrity checks

### 9. Logging Failures
Insufficient logging, monitoring

**Prevention:** Log security events, monitor, alert

### 10. Server-Side Request Forgery (SSRF)
Server fetches remote resource mà không validate

**Prevention:** Validate URLs, whitelist, network segmentation`,
          en: `# OWASP Top 10

## Top Security Risks

### 1. Broken Access Control
Users access resources without permission

**Prevention:** Enforce access controls, deny by default

### 2. Cryptographic Failures
Weak encryption, plain text passwords

**Prevention:** Use strong algorithms, HTTPS, encrypt sensitive data

### 3. Injection
SQL, NoSQL, Command injection

**Prevention:** Parameterized queries, input validation

### 4. Insecure Design
Lack of security controls from the start

**Prevention:** Threat modeling, secure design patterns

### 5. Security Misconfiguration
Default configs, verbose errors, unnecessary features

**Prevention:** Hardening, remove defaults, minimal permissions

### 6. Vulnerable Components
Using libraries with known vulnerabilities

**Prevention:** Keep dependencies updated, monitor CVEs

### 7. Authentication Failures
Weak passwords, no MFA, session issues

**Prevention:** Strong password policy, MFA, secure session management

### 8. Data Integrity Failures
Not verifying data integrity

**Prevention:** Digital signatures, integrity checks

### 9. Logging Failures
Insufficient logging, monitoring

**Prevention:** Log security events, monitor, alert

### 10. Server-Side Request Forgery (SSRF)
Server fetches remote resource without validation

**Prevention:** Validate URLs, whitelist, network segmentation`,
        },
      },
      {
        id: "agile",
        name: { vi: "Agile / Scrum", en: "Agile / Scrum" },
        content: {
          vi: `# Agile / Scrum

## Agile Manifesto

- Individuals > Processes
- Working software > Documentation
- Customer collaboration > Contract negotiation
- Responding to change > Following plan

## Scrum Framework

### Roles

**Product Owner:** Define features, prioritize backlog

**Scrum Master:** Facilitate, remove impediments

**Development Team:** Self-organizing, cross-functional

### Artifacts

**Product Backlog:** Prioritized list of features

**Sprint Backlog:** Tasks for current sprint

**Increment:** Working product at end of sprint

### Events

**Sprint:** 1-4 weeks iteration

**Sprint Planning:** Plan sprint work

**Daily Standup:** 15-min sync (Yesterday, Today, Blockers)

**Sprint Review:** Demo to stakeholders

**Sprint Retrospective:** Team improvement discussion

## Benefits
- Flexibility
- Fast feedback
- Continuous improvement
- Higher quality`,
          en: `# Agile / Scrum

## Agile Manifesto

- Individuals > Processes
- Working software > Documentation
- Customer collaboration > Contract negotiation
- Responding to change > Following plan

## Scrum Framework

### Roles

**Product Owner:** Define features, prioritize backlog

**Scrum Master:** Facilitate, remove impediments

**Development Team:** Self-organizing, cross-functional

### Artifacts

**Product Backlog:** Prioritized list of features

**Sprint Backlog:** Tasks for current sprint

**Increment:** Working product at end of sprint

### Events

**Sprint:** 1-4 weeks iteration

**Sprint Planning:** Plan sprint work

**Daily Standup:** 15-min sync (Yesterday, Today, Blockers)

**Sprint Review:** Demo to stakeholders

**Sprint Retrospective:** Team improvement discussion

## Benefits
- Flexibility
- Fast feedback
- Continuous improvement
- Higher quality`,
        },
      },
    ],
  },
];
