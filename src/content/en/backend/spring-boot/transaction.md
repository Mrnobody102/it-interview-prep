# Spring Data & Transaction

## 1. Entity Mapping

### 1.1. Basic Annotations

```java
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Transient  // Not persisted
    private String temporaryData;
}
```

### 1.2. Relationships

```java
// OneToOne — User ↔ Profile
@OneToOne(mappedBy = "user")
private Profile profile;

// OneToMany — Department → Employees
@OneToMany(mappedBy = "department", cascade = CascadeType.ALL)
private List<Employee> employees;

// ManyToOne — Employee → Department
@ManyToOne
@JoinColumn(name = "department_id")
private Department department;

// ManyToMany — Students ↔ Courses
@ManyToMany
@JoinTable(
    name = "enrollment",
    joinColumns = @JoinColumn(name = "student_id"),
    inverseJoinColumns = @JoinColumn(name = "course_id")
)
private Set<Course> courses;
```

### 1.3. FetchType

| FetchType | Default for | Behavior |
|-----------|-----------|----------|
| **EAGER** | `@ManyToOne`, `@OneToOne` | Load immediately when querying parent |
| **LAZY** | `@OneToMany`, `@ManyToMany` | Load only when accessed (default) |

```java
// ⚠️ EAGER can cause N+1 problems
@ManyToOne(fetch = FetchType.EAGER)
private Department department;

// ✅ LAZY is generally better
@ManyToOne(fetch = FetchType.LAZY)  // Or just rely on default
private Department department;

// Access lazy-loaded field safely
@Transactional(readOnly = true)
public Department getDepartment(Long userId) {
    User user = userRepository.findById(userId).orElseThrow();
    Hibernate.initialize(user.getDepartment()); // Force init
    return user.getDepartment();
}
```

### 1.4. Cascade Types

| Cascade | Effect |
|---------|--------|
| `ALL` | All operations cascade |
| `PERSIST` | Save child with parent |
| `MERGE` | Merge child with parent |
| `REMOVE` | Delete child with parent |
| `REFRESH` | Refresh child with parent |
| `DETACH` | Detach child with parent |

```java
@OneToMany(mappedBy = "department", cascade = CascadeType.ALL)
private List<Employee> employees;
```

## 2. N+1 Query Problem

When fetching N parent entities and accessing M child entities → generates **1 + N** queries.

### 2.1. Solutions

```java
// Solution 1: JOIN FETCH
@Query("SELECT u FROM User u LEFT JOIN FETCH u.roles WHERE u.id = :id")
Optional<User> findByIdWithRoles(@Param("id") Long id);

// Solution 2: @EntityGraph
@EntityGraph(attributePaths = {"roles", "profile"})
@Query("SELECT u FROM User u WHERE u.id = :id")
Optional<User> findByIdWithDetails(@Param("id") Long id);

// Solution 3: Batch Size
@OneToMany(mappedBy = "user")
@BatchSize(size = 20)
private List<Order> orders;

// Solution 4: Global batch fetch size
// spring.jpa.properties.hibernate.default_batch_fetch_size=20
```

## 3. @Transactional

### 3.1. Isolation Levels

| Level | Dirty Read | Non-repeatable Read | Phantom Read |
|-------|-----------|---------------------|--------------|
| **READ_UNCOMMITTED** | May occur | May occur | May occur |
| **READ_COMMITTED** | Prevented | May occur | May occur |
| **REPEATABLE_READ** | Prevented | Prevented | May occur |
| **SERIALIZABLE** | Prevented | Prevented | Prevented |

### 3.2. Propagation

| Propagation | Behavior |
|------------|----------|
| **REQUIRED** | Use current transaction, or create new (default) |
| **REQUIRES_NEW** | Always create a new transaction |
| **NESTED** | Create nested transaction (savepoint) |
| **MANDATORY** | Must have existing transaction |
| **NEVER** | Must NOT have transaction |
| **SUPPORTS** | Use current transaction if exists |

### 3.3. Rollback Rules

| Exception Type | Default Behavior |
|---------------|----------------|
| RuntimeException | **Rollback** |
| Error | **Rollback** |
| Checked Exception | **No rollback** (commit) |

```java
@Transactional(rollbackFor = Exception.class)  // Rollback on any exception
public void transfer(Long fromId, Long toId, BigDecimal amount) {
    // ...
}

// Read-only optimization
@Transactional(readOnly = true)
public List<User> getAllUsers() {
    return userRepository.findAll();
}
```

### 3.4. Common Pitfalls

```java
// ❌ WRONG: @Transactional on private method (not proxied)
@Transactional
private void doSomething() { }  // Won't work!

// ❌ WRONG: @Transactional on self-invocation
@Service
public class UserService {
    public void transfer() {
        this.sendEmail();  // Self-call, proxy bypassed!
    }

    @Transactional
    public void sendEmail() { }  // Won't run in transaction
}

// ✅ CORRECT: Self-invocation via proxy
@Service
public class UserService {
    @Autowired
    private UserService self;  // Self injection

    public void transfer() {
        self.sendEmail();  // Goes through proxy → @Transactional works
    }

    @Transactional
    public void sendEmail() { }
}
```

## 4. Pagination & Sorting

```java
Page<User> findByStatus(String status, Pageable pageable);

// Common usage
Page<User> users = userRepository.findByStatus(
    "ACTIVE",
    PageRequest.of(0, 10, Sort.by("createdDate").descending())
);

// Return types
// Page<T>: Total count, total pages, hasNext, hasPrevious
// Slice<T>: Total count unknown, just hasNext()
// List<T>: Just results
```

## 5. Read Phenomena

| Phenomenon | Description |
|-----------|-------------|
| **Dirty Read** | Read uncommitted data from another transaction |
| **Non-repeatable Read** | Same row read twice → different values (due to UPDATE) |
| **Phantom Read** | Same query → different rows (due to INSERT/DELETE) |
