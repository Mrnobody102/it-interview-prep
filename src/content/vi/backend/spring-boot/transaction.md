# Spring Data & Transaction

## 1. Entity Mapping

### 1.1. Các Annotation cơ bản

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

    @Transient  // Không được persist
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

| FetchType | Default cho | Hành vi |
|-----------|-----------|----------|
| **EAGER** | `@ManyToOne`, `@OneToOne` | Load ngay khi query parent |
| **LAZY** | `@OneToMany`, `@ManyToMany` | Load chỉ khi được truy cập (default) |

```java
// ⚠️ EAGER có thể gây N+1 problems
@ManyToOne(fetch = FetchType.EAGER)
private Department department;

// ✅ LAZY nhìn chung tốt hơn
@ManyToOne(fetch = FetchType.LAZY)  // Hoặc dùng default
private Department department;

// Truy cập lazy-loaded field an toàn
@Transactional(readOnly = true)
public Department getDepartment(Long userId) {
    User user = userRepository.findById(userId).orElseThrow();
    Hibernate.initialize(user.getDepartment()); // Force init
    return user.getDepartment();
}
```

### 1.4. Cascade Types

| Cascade | Hiệu ứng |
|---------|---------|
| `ALL` | Tất cả operations cascade |
| `PERSIST` | Lưu child cùng parent |
| `MERGE` | Merge child với parent |
| `REMOVE` | Xóa child cùng parent |
| `REFRESH` | Refresh child với parent |
| `DETACH` | Detach child |

```java
@OneToMany(mappedBy = "department", cascade = CascadeType.ALL)
private List<Employee> employees;
```

## 2. Bài toán N+1 Query

Khi fetch N parent entities và truy cập M child entities → tạo ra **1 + N** queries.

### 2.1. Các giải pháp

```java
// Giải pháp 1: JOIN FETCH
@Query("SELECT u FROM User u LEFT JOIN FETCH u.roles WHERE u.id = :id")
Optional<User> findByIdWithRoles(@Param("id") Long id);

// Giải pháp 2: @EntityGraph
@EntityGraph(attributePaths = {"roles", "profile"})
@Query("SELECT u FROM User u WHERE u.id = :id")
Optional<User> findByIdWithDetails(@Param("id") Long id);

// Giải pháp 3: Batch Size
@OneToMany(mappedBy = "user")
@BatchSize(size = 20)
private List<Order> orders;

// Giải pháp 4: Global batch fetch size
// spring.jpa.properties.hibernate.default_batch_fetch_size=20
```

## 3. @Transactional

### 3.1. Isolation Levels

| Level | Dirty Read | Non-repeatable Read | Phantom Read |
|-------|-----------|---------------------|--------------|
| **READ_UNCOMMITTED** | Có thể xảy ra | Có thể xảy ra | Có thể xảy ra |
| **READ_COMMITTED** | Ngăn chặn | Có thể xảy ra | Có thể xảy ra |
| **REPEATABLE_READ** | Ngăn chặn | Ngăn chặn | Có thể xảy ra |
| **SERIALIZABLE** | Ngăn chặn | Ngăn chặn | Ngăn chặn |

### 3.2. Propagation

| Propagation | Hành vi |
|------------|----------|
| **REQUIRED** | Dùng transaction hiện tại, hoặc tạo mới (default) |
| **REQUIRES_NEW** | Luôn tạo transaction mới |
| **NESTED** | Tạo nested transaction (savepoint) |
| **MANDATORY** | Phải có transaction đang tồn tại |
| **NEVER** | Không được có transaction |
| **SUPPORTS** | Dùng transaction hiện tại nếu có |

### 3.3. Rollback Rules

| Loại Exception | Hành vi mặc định |
|---------------|----------------|
| RuntimeException | **Rollback** |
| Error | **Rollback** |
| Checked Exception | **Không rollback** (commit) |

```java
@Transactional(rollbackFor = Exception.class)  // Rollback với mọi exception
public void transfer(Long fromId, Long toId, BigDecimal amount) {
    // ...
}

// Read-only optimization
@Transactional(readOnly = true)
public List<User> getAllUsers() {
    return userRepository.findAll();
}
```

### 3.4. Các lỗi thường gặp

```java
// ❌ SAI: @Transactional trên private method (không được proxy)
@Transactional
private void doSomething() { }  // Sẽ không hoạt động!

// ❌ SAI: @Transactional với self-invocation
@Service
public class UserService {
    public void transfer() {
        this.sendEmail();  // Self-call, proxy bị bypass!
    }

    @Transactional
    public void sendEmail() { }  // Sẽ không chạy trong transaction
}

// ✅ ĐÚNG: Self-invocation qua proxy
@Service
public class UserService {
    @Autowired
    private UserService self;  // Self injection

    public void transfer() {
        self.sendEmail();  // Qua proxy → @Transactional hoạt động
    }

    @Transactional
    public void sendEmail() { }
}
```

## 4. Phân trang & Sắp xếp

```java
Page<User> findByStatus(String status, Pageable pageable);

// Cách dùng phổ biến
Page<User> users = userRepository.findByStatus(
    "ACTIVE",
    PageRequest.of(0, 10, Sort.by("createdDate").descending())
);

// Các loại return type
// Page<T>: Total count, total pages, hasNext, hasPrevious
// Slice<T>: Không biết total count, chỉ có hasNext()
// List<T>: Chỉ có kết quả
```

## 5. Read Phenomena

| Hiện tượng | Mô tả |
|-----------|-----------|
| **Dirty Read** | Đọc dữ liệu chưa commit từ transaction khác |
| **Non-repeatable Read** | Đọc cùng row hai lần → giá trị khác nhau (do UPDATE) |
| **Phantom Read** | Cùng query → số rows khác nhau (do INSERT/DELETE) |
