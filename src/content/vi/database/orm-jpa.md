# Chủ đề ORM và JPA

## 1. ORM (Object-Relational Mapping)

### 1.1. ORM là gì?

ORM là kỹ thuật ánh xạ objects trong code (OOP) với tables trong database (RDBMS). ORM framework đóng vai trò trung gian, cho phép developer làm việc với objects thay vì viết SQL trực tiếp.

```
Application Code (OOP)
┌─────────────────────────────┐
│  User user = new User();    │
│  user.setName("Nguyen Van A");│
│  user.setEmail("a@b.com");   │
└────────────┬────────────────┘
             │ ORM
             ▼
┌─────────────────────────────┐
│  INSERT INTO users           │
│  (name, email) VALUES        │
│  ('Nguyen Van A', 'a@b.com') │
└────────────┬────────────────┘
             │
             ▼
    Database (Relational)
```

### 1.2. Lợi ích của ORM

| Lợi ích | Mô tả |
|---|---|
| **Giảm boilerplate SQL** | Không cần viết CRUD SQL thủ công |
| **Database independence** | Đổi database dễ dàng (MySQL → PostgreSQL) |
| **Abstraction** | Tập trung vào business logic |
| **Security** | Tự động parameterized queries, tránh SQL injection |
| **Productivity** | Tăng tốc development |
| **Maintainability** | Code nhất quán, dễ đọc |

### 1.3. ORM vs Pure JDBC

| Tiêu chí | ORM (JPA/Hibernate) | Pure JDBC |
|---|---|---|
| **Lines of code** | Ít hơn nhiều | Nhiều boilerplate |
| **Performance** | Overhead nhỏ, nhưng có optimization | Tốt nhất |
| **Control** | Có abstraction layer | Toàn quyền kiểm soát |
| **Learning curve** | Steeper (phải hiểu ORM concepts) | Dễ hơn |
| **Complex queries** | Hạn chế với JPA, linh hoạt với Hibernate | Linh hoạt |
| **Database portability** | Cao | Thấp |

---

## 2. JPA Annotations cơ bản

### 2.1. @Entity và @Table

```java
// @Entity: Đánh dấu class là một JPA entity
@Entity
// @Table: Chỉ định tên table tương ứng trong database
@Table(
    name = "users",
    schema = "public",
    indexes = {
        @Index(name = "idx_users_email", columnList = "email"),
        @Index(name = "idx_users_status", columnList = "status")
    },
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uk_users_email",
            columnNames = {"email"}
        )
    }
)
public class User {
    // entity fields
}
```

### 2.2. @Column

```java
@Entity
@Table(name = "users")
public class User {
    @Id
    private Long id;

    // Basic column mapping
    @Column(name = "full_name", nullable = false, length = 100)
    private String name;

    @Column(unique = true, length = 255)
    private String email;

    // Column với precision cho numeric
    @Column(name = "balance", precision = 15, scale = 2)
    private BigDecimal balance;

    // Boolean mapping options
    @Column(name = "is_active")
    private Boolean active;

    // Text fields
    @Column(name = "bio", columnDefinition = "TEXT")
    private String bio;

    // Large object
    @Lob
    @Column(name = "avatar")
    private byte[] avatar;

    // Enum mapping
    @Enumerated(EnumType.STRING)
    @Column(name = "role")
    private UserRole role;

    // Temporal types
    @Temporal(TemporalType.DATE)
    @Column(name = "birth_date")
    private Date birthDate;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    // Transient - không map vào column
    @Transient
    private int computedAge;

    // Column insertable/updatable
    @Column(name = "created_by", insertable = true, updatable = false)
    private String createdBy;
}
```

### 2.3. @Id và @GeneratedValue

```java
@Entity
@Table(name = "users")
public class User {
    @Id
    @Column(name = "user_id")
    private Long id;

    // Các chiến lược GeneratedValue
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    // MySQL: AUTO_INCREMENT
    // PostgreSQL: SERIAL
    private Long idAuto;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    // PostgreSQL, Oracle: SEQUENCE
    @SequenceGenerator(name = "user_seq", sequenceName = "user_sequence", allocationSize = 1)
    private Long idSeq;

    @Id
    @GeneratedValue(strategy = GenerationType.TABLE)
    // Table generator - portable across databases
    @TableGenerator(
        name = "user_table_gen",
        table = "id_generator",
        pkColumnName = "gen_name",
        valueColumnName = "gen_value",
        pkColumnValue = "user",
        initialValue = 0,
        allocationSize = 50
    )
    private Long idTable;

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    // Hibernate tự chọn strategy phù hợp với database
    private Long idAuto;

    // UUID với Hibernate
    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    // Composite key với @EmbeddedId
    @EmbeddedId
    private UserOrderId userOrderId;
}
```

```java
// Composite key class
@Embeddable
public class UserOrderId implements Serializable {
    @Column(name = "user_id")
    private Long userId;

    @Column(name = "order_id")
    private Long orderId;

    // equals() và hashCode() bắt buộc
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        UserOrderId that = (UserOrderId) o;
        return Objects.equals(userId, that.userId) &&
               Objects.equals(orderId, that.orderId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(userId, orderId);
    }
}
```

---

## 3. Entity Relationships

### 3.1. @ManyToOne (N-1)

```java
// Nhiều Orders thuộc về 1 User
@Entity
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Eager fetching - chỉ dùng khi chắc chắn cần
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "status_id")
    private OrderStatus status;
}
```

### 3.2. @OneToMany (1-N)

```java
// 1 User có nhiều Orders
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // OneToMany - mappedBy luôn ở non-owning side
    // owning side = ManyToOne trong class Order
    @OneToMany(
        mappedBy = "user",
        cascade = CascadeType.ALL,
        orphanRemoval = true,
        fetch = FetchType.LAZY
    )
    private List<Order> orders = new ArrayList<>();

    // Với Set để tránh duplicate
    @OneToMany(
        mappedBy = "user",
        cascade = CascadeType.ALL,
        orphanRemoval = true
    )
    private Set<Order> orderSet = new HashSet<>();

    // Thêm helper methods
    public void addOrder(Order order) {
        orders.add(order);
        order.setUser(this);
    }

    public void removeOrder(Order order) {
        orders.remove(order);
        order.setUser(null);
    }
}
```

### 3.3. @OneToOne

```java
// 1 User có 1 Profile
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(
        mappedBy = "user",
        cascade = CascadeType.ALL,
        orphanRemoval = true,
        fetch = FetchType.LAZY
    )
    private UserProfile profile;

    // Owning side - có @JoinColumn
    @OneToOne
    @JoinColumn(name = "profile_id")
    private UserProfile profile;
}

@Entity
@Table(name = "user_profiles")
public class UserProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId  // Dùng cùng ID với User (shared primary key)
    @JoinColumn(name = "user_id")
    private User user;

    private String bio;
    private String phone;
}
```

### 3.4. @ManyToMany

```java
// Nhiều Students tham gia nhiều Courses
@Entity
@Table(name = "students")
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToMany
    @JoinTable(
        name = "student_courses",
        joinColumns = @JoinColumn(name = "student_id"),
        inverseJoinColumns = @JoinColumn(name = "course_id")
    )
    private Set<Course> courses = new HashSet<>();
}

@Entity
@Table(name = "courses")
public class Course {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Inverse side
    @ManyToMany(mappedBy = "courses")
    private Set<Student> students = new HashSet<>();

    // Thêm helper methods
    public void addStudent(Student student) {
        this.students.add(student);
        student.getCourses().add(this);
    }

    public void removeStudent(Student student) {
        this.students.remove(student);
        student.getCourses().remove(this);
    }
}
```

### 3.5. Cascade Types

```java
@OneToMany(cascade = CascadeType.ALL, ...)
    // ALL: Tất cả cascade operations
    // PERSIST: Khi persist parent -> auto persist child
    // MERGE: Khi merge parent -> auto merge child
    // REMOVE: Khi xoá parent -> auto xoá child
    // REFRESH: Khi refresh parent -> auto refresh child
    // DETACH: Khi detach parent -> auto detach child

// orphanRemoval = true:
// Child bị xoá khỏi collection -> tự động DELETE trong DB
```

---

## 4. EntityManager Operations

### 4.1. CRUD Operations

```java
@PersistenceContext
private EntityManager em;

@Repository
@Transactional
public class UserDao {

    // CREATE
    public User create(User user) {
        em.persist(user);  // INSERT, entity sẽ được flush khi transaction commit
        return user;
    }

    // READ by ID
    public User findById(Long id) {
        return em.find(User.class, id);  // First-level cache check
    }

    // UPDATE
    public User update(User user) {
        return em.merge(user);  // UPDATE nếu entity đã tồn tại
    }

    // DELETE
    public void delete(Long id) {
        User user = em.find(User.class, id);
        if (user != null) {
            em.remove(user);
        }
    }

    // Bulk delete
    public int deleteInactiveUsers(LocalDateTime cutoff) {
        return em.createQuery(
            "DELETE FROM User u WHERE u.lastLogin < :cutoffDate"
        ).setParameter("cutoffDate", cutoff)
         .executeUpdate();
    }

    // Bulk update
    public int markExpiredOrders() {
        return em.createQuery(
            "UPDATE Order o SET o.status = 'EXPIRED' " +
            "WHERE o.status = 'PENDING' AND o.createdAt < :cutoff"
        ).setParameter("cutoff", LocalDateTime.now().minusDays(30))
         .executeUpdate();
    }
}
```

### 4.2. Entity Lifecycle States

```
          ┌──────────────┐
          │   NEW        │  (Transient)
          │ (Transient)  │  new User() - chưa có ID, chưa trong DB
          └──────┬───────┘
                 │ persist()
                 ▼
          ┌──────────────┐
          │  MANAGED     │  (Persistent)
          │  (Managed)   │  Được quản lý bởi EntityManager
          │              │  Thay đổi sẽ tự động sync với DB
          └──────┬───────┘
                 │ remove()
                 ▼
          ┌──────────────┐
          │  REMOVED     │  (Removed)
          │  (Removed)   │  Đánh dấu xoá, sẽ DELETE khi flush/commit
          └──────┬───────┘
                 │ commit()/flush()
                 ▼
          ┌──────────────┐
          │   DELETED    │  (Deleted)
          │  (Deleted)   │  Đã xoá khỏi DB
          └──────────────┘

    DETACHED:
    Entity bị tách khỏi EntityManager
    Thay đổi không được sync tự động
    -> Muốn update: gọi merge()
```

### 4.3. Merge vs Persist

```java
// persist(): Thêm entity MỚI vào persistence context
// Chỉ dùng cho entity chưa có ID hoặc ID chưa tồn tại trong DB
User newUser = new User();
newUser.setName("New User");
em.persist(newUser);
// newUser đã có ID sau persist()
// newUser vẫn MANAGED

// merge(): Cập nhật entity đã TỒN TẠI trong DB
// Nếu entity đã detached, tạo copy mới và merge
// Nếu entity đã managed, không làm gì
User detachedUser = new User();
detachedUser.setId(1L);
detachedUser.setName("Updated Name");
User managedUser = em.merge(detachedUser);
// managedUser là entity đang được managed
// detachedUser vẫn detached
// => Luôn làm việc với returned object
```

### 4.4. Flush Modes

```java
// Flush: Sync persistence context với DB
// FlushMode.AUTO (mặc định): Sync trước query execute
em.setFlushMode(FlushModeType.AUTO);

// FlushMode.COMMIT: Chỉ sync khi commit
em.setFlushMode(FlushModeType.COMMIT);

// Manual flush
em.flush();  // Force sync immediately
em.clear();  // Clear entire persistence context, detach all
em.detach(entity);  // Detach specific entity
em.refresh(entity); // Reload entity from DB, overwrite local changes
```

---

## 5. Spring Data JPA Repository

### 5.1. JpaRepository Interface

```java
// JpaRepository<T, ID> extends PagingAndSortingRepository<T, ID>
// JpaRepository extends CrudRepository
public interface JpaRepository<T, ID> extends PagingAndSortingRepository<T, ID>, QueryByExampleExecutor<T> {
    List<T> findAll();
    List<T> findAll(Sort sort);
    Page<T> findAll(Pageable pageable);
    List<T> saveAll(Iterable<T> entities);
    void flush();
    T saveAndFlush(T entity);
    void deleteInBatch(Iterable<T> entities);  // Bulk delete
    void deleteAllInBatch();  // Delete all
}
```

### 5.2. Paging và Sorting

```java
public interface OrderRepository extends JpaRepository<Order, Long> {
    Page<Order> findByUserId(Long userId, Pageable pageable);

    List<Order> findByStatus(String status, Sort sort);

    Page<Order> findByCreatedAtBetween(
        LocalDateTime start,
        LocalDateTime end,
        Pageable pageable
    );
}

// Sử dụng
@Service
public class OrderService {
    public Page<Order> getOrders(Long userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size,
            Sort.by("createdAt").descending()
                .and(Sort.by("id").ascending())
        );
        return orderRepository.findByUserId(userId, pageable);
    }

    // Custom Pageable cho native query
    @Query(
        value = "SELECT * FROM orders WHERE user_id = :userId",
        countQuery = "SELECT COUNT(*) FROM orders WHERE user_id = :userId",
        nativeQuery = true
    )
    Page<Order> findByUserIdNative(
        @Param("userId") Long userId,
        Pageable pageable
    );
}
```

### 5.3. Custom Repository

```java
// Custom repository interface
public interface UserRepositoryCustom {
    List<User> findTopActiveUsersByRegion(String region, int limit);
    int bulkUpdateStatus(List<Long> userIds, UserStatus newStatus);
}

// Implementation
public class UserRepositoryImpl implements UserRepositoryCustom {
    @PersistenceContext
    private EntityManager em;

    @Override
    public List<User> findTopActiveUsersByRegion(String region, int limit) {
        TypedQuery<User> query = em.createQuery(
            "SELECT u FROM User u JOIN u.profile p " +
            "WHERE u.active = true AND p.region = :region " +
            "ORDER BY u.lastLogin DESC",
            User.class
        );
        query.setParameter("region", region);
        query.setMaxResults(limit);
        return query.getResultList();
    }

    @Override
    public int bulkUpdateStatus(List<Long> userIds, UserStatus newStatus) {
        return em.createQuery(
            "UPDATE User u SET u.status = :status WHERE u.id IN :ids"
        ).setParameter("status", newStatus)
         .setParameter("ids", userIds)
         .executeUpdate();
    }
}

// Combine interfaces
public interface UserRepository extends
    JpaRepository<User, Long>,
    UserRepositoryCustom {
    // Spring auto-combines JpaRepository + UserRepositoryCustom
}
```

---

## 6. Fetch Strategies

### 6.1. Lazy vs Eager

```java
@Entity
public class Order {
    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)  // Default cho @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(fetch = FetchType.EAGER)  // Default cho @OneToMany
    private List<OrderItem> items;
}

// Lazy: Load khi được truy cập (default cho @ManyToOne)
// Eager: Load ngay khi entity được load (default cho @OneToMany)

// WARNING: Eager fetching có thể gây:
// - N+1 queries
// - Load data không cần thiết
// - Cartesian product trong JOIN
```

### 6.2. Entity Graphs

```java
// Entity graph để control fetching
@Entity
@NamedEntityGraph(
    name = "Order.withUserAndItems",
    attributeNodes = {
        @NamedAttributeNode("user"),
        @NamedAttributeNode("items")
    }
)
public class Order {
    // fields...
}

// Cách 1: @EntityGraph annotation
@EntityGraph(value = "Order.withUserAndItems", type = EntityGraph.EntityGraphType.FETCH)
Optional<Order> findById(Long id);

// Cách 2: Attribute paths
@EntityGraph(attributePaths = {"user", "items"})
Optional<Order> findById(Long id);

// Cách 3: JPA Specification
Specification<Order> spec = Specification.where(hasStatus("COMPLETED"));
List<Order> orders = orderRepository.findAll(spec,
    EntityGraph.EntityGraphType.FETCH, "Order.withUserAndItems");

// Cách 4: Programmatic EntityGraph
EntityGraph<Order> graph = em.createEntityGraph(Order.class);
graph.addAttributeNodes("user", "items");
graph.addSubgraph("items").addAttributeNode("product");

Map hints = Collections.singletonMap(
    "jakarta.persistence.fetchgraph", graph
);
Order order = em.find(Order.class, 1L, hints);
```

### 6.3. Batch Fetching

```java
@Entity
@BatchSize(size = 100)  // Batch load 100 entities cùng lúc
public class OrderItem {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;
}

// Khi truy cập orderItem.getProduct() trong loop:
// Hibernate batch fetch: SELECT * FROM products WHERE id IN (?, ?, ?, ...)
// Thay vì N queries riêng lẻ
```

---

## 7. JPA Query Methods

### 7.1. JPQL (Java Persistence Query Language)

```java
// JPQL: Object-oriented query
@Query("SELECT u FROM User u WHERE u.email = :email")
Optional<User> findByEmail(@Param("email") String email);

// JPQL với constructor expression (DTO)
@Query("""
    SELECT new com.example.dto.UserStatsDTO(
        u.id, u.name, u.email, COUNT(o.id)
    )
    FROM User u LEFT JOIN u.orders o
    GROUP BY u.id, u.name, u.email
    """)
List<UserStatsDTO> findUserStats();

// JPQL với JOIN FETCH (tránh N+1)
@Query("""
    SELECT u FROM User u
    LEFT JOIN FETCH u.orders
    WHERE u.id = :id
    """)
Optional<User> findByIdWithOrders(@Param("id") Long id);

// JPQL với DISTINCT
@Query("SELECT DISTINCT u FROM User u JOIN u.roles r WHERE r.name = :role")
List<User> findByRoleName(@Param("role") String role);

// JPQL UPDATE
@Modifying
@Query("UPDATE User u SET u.active = :active WHERE u.lastLogin < :cutoff")
int updateActiveStatus(
    @Param("active") boolean active,
    @Param("cutoff") LocalDateTime cutoff
);

// JPQL DELETE
@Modifying
@Query("DELETE FROM User u WHERE u.id = :id AND u.active = false")
int deleteInactiveUser(@Param("id") Long id);
```

### 7.2. Criteria API

```java
// Criteria API: Type-safe query building
@Service
public class UserSearchService {
    @PersistenceContext
    private EntityManager em;

    public List<User> searchUsers(String name, String email, UserStatus status) {
        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<User> cq = cb.createQuery(User.class);
        Root<User> user = cq.from(User.class);

        Predicate predicate = cb.conjunction();

        if (name != null && !name.isBlank()) {
            predicate = cb.and(predicate,
                cb.like(cb.lower(user.get("name")), "%" + name.toLowerCase() + "%"));
        }
        if (email != null && !email.isBlank()) {
            predicate = cb.and(predicate,
                cb.equal(user.get("email"), email));
        }
        if (status != null) {
            predicate = cb.and(predicate,
                cb.equal(user.get("status"), status));
        }

        cq.where(predicate);
        cq.orderBy(cb.asc(user.get("name")));

        return em.createQuery(cq).getResultList();
    }
}
```

### 7.3. JPA Specifications (Spring Data JPA)

```java
// Specification class
public class UserSpecifications {
    public static Specification<User> hasName(String name) {
        return (root, query, cb) -> {
            if (name == null) return null;
            return cb.like(cb.lower(root.get("name")), "%" + name.toLowerCase() + "%");
        };
    }

    public static Specification<User> hasEmail(String email) {
        return (root, query, cb) -> {
            if (email == null) return null;
            return cb.equal(root.get("email"), email);
        };
    }

    public static Specification<User> hasStatus(UserStatus status) {
        return (root, query, cb) -> {
            if (status == null) return null;
            return cb.equal(root.get("status"), status);
        };
    }

    public static Specification<User> createdAfter(LocalDateTime date) {
        return (root, query, cb) -> {
            if (date == null) return null;
            return cb.greaterThan(root.get("createdAt"), date);
        };
    }
}

// Sử dụng với JpaSpecificationExecutor
public interface UserRepository extends
    JpaRepository<User, Long>,
    JpaSpecificationExecutor<User> {
}

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public List<User> searchUsers(String name, String email, UserStatus status) {
        return userRepository.findAll(
            Specification.where(UserSpecifications.hasName(name))
                         .and(UserSpecifications.hasEmail(email))
                         .and(UserSpecifications.hasStatus(status))
        );
    }
}
```

---

## 8. Lifecycle Callbacks

### 8.1. @PrePersist, @PostPersist

```java
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String createdBy;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (createdBy == null) {
            createdBy = SecurityContextHolder.getContext()
                .getAuthentication().getName();
        }
    }

    @PostPersist
    protected void onPostCreate() {
        // Gửi notification sau khi lưu thành công
        // Audit logging
        auditLog.info("User created: {}", id);
    }
}
```

### 8.2. @PreUpdate, @PostUpdate

```java
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime updatedAt;
    private String updatedBy;

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
        updatedBy = SecurityContextHolder.getContext()
            .getAuthentication().getName();
    }

    @PostUpdate
    protected void onPostUpdate() {
        // Cache invalidation
        // Event publishing
        applicationEventPublisher.publishEvent(
            new UserUpdatedEvent(this)
        );
    }
}
```

### 8.3. @PreRemove, @PostRemove

```java
@Entity
public class User {
    @Id
    private Long id;

    @PostRemove
    protected void onDelete() {
        // Cleanup related resources
        // File deletion
        // Notification
    }
}
```

### 8.4. @PostLoad

```java
@Entity
public class User {
    @Id
    private Long id;

    private String name;

    @Transient
    private String displayName;

    @PostLoad
    protected void onLoad() {
        // Compute transient fields
        this.displayName = name.toUpperCase();
        // Load data from external source
        // Decrypt sensitive fields
    }
}
```

---

## 9. Inheritance Mapping

### 9.1. Single Table (TPH - Table Per Hierarchy)

```java
// Tất cả subclasses trong 1 table, dùng discriminator column
@Entity
@Table(name = "payment_methods")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "payment_type", discriminatorType = DiscriminatorType.STRING)
@DiscriminatorValue("PAYMENT")
public abstract class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private BigDecimal amount;
    private LocalDateTime createdAt;
}

@Entity
@DiscriminatorValue("CARD")
public class CardPayment extends Payment {
    private String cardNumber;
    private String cardHolder;
}

@Entity
@DiscriminatorValue("WALLET")
public class WalletPayment extends Payment {
    private String walletType;
    private String walletId;
}
```

```sql
-- Generated table:
CREATE TABLE payment_methods (
    id BIGSERIAL PRIMARY KEY,
    payment_type VARCHAR(50),  -- Discriminator
    amount DECIMAL(15,2),
    created_at TIMESTAMP,
    card_number VARCHAR(255),  -- NULL for non-card payments
    card_holder VARCHAR(255),
    wallet_type VARCHAR(50),
    wallet_id VARCHAR(50)
);
```

### 9.2. Joined Table (TPT - Table Per Class)

```java
@Entity
@Table(name = "payments")
@Inheritance(strategy = InheritanceType.JOINED)
@DiscriminatorColumn(name = "payment_type")
public abstract class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private BigDecimal amount;
}

@Entity
@Table(name = "card_payments")
@PrimaryKeyJoinColumn(name = "payment_id")
public class CardPayment extends Payment {
    private String cardNumber;
    private String cardHolder;
}
```

### 9.3. Table Per Class

```java
// Mỗi entity có bảng riêng, bao gồm cả inherited fields
@Entity
@Table(name = "payments")
@Inheritance(strategy = InheritanceType.TABLE_PER_CLASS)
public abstract class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private BigDecimal amount;
}
```

---

## 10. Embeddable Objects

### 10.1. @Embeddable và @Embedded

```java
// Embeddable: Value object, không có identity
@Embeddable
public class Address {
    @Column(name = "street", length = 255)
    private String street;

    @Column(name = "city", length = 100)
    private String city;

    @Column(name = "country", length = 100)
    private String country;

    @Column(name = "postal_code", length = 20)
    private String postalCode;

    // No @Id - không có identity
}

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    // Embed Address vào User
    @Embedded
    @AttributeOverrides({
        @AttributeOverride(name = "street",
            column = @Column(name = "home_street")),
        @AttributeOverride(name = "city",
            column = @Column(name = "home_city"))
    })
    private Address homeAddress;

    @Embedded
    private Address workAddress;

    // Có thể embed same class 2 lần với @AttributeOverride
}
```

### 10.2. ElementCollection

```java
// @ElementCollection: Collection của Embeddable hoặc Basic types
@Entity
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Collection của basic types
    @ElementCollection
    @CollectionTable(name = "user_phone_numbers",
        joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "phone_number")
    private Set<String> phoneNumbers = new HashSet<>();

    // Collection của Embeddable
    @ElementCollection
    @CollectionTable(name = "user_addresses",
        joinColumns = @JoinColumn(name = "user_id"))
    @AttributeOverrides({
        @AttributeOverride(name = "city",
            column = @Column(name = "city")),
        @AttributeOverride(name = "country",
            column = @Column(name = "country"))
    })
    private List<Address> addresses = new ArrayList<>();
}
```

---

## 11. Auditing

### 11.1. JPA Auditing với Spring Data

```java
// Bật JPA Auditing
@Configuration
@EnableJpaAuditing
public class JpaConfig {
    @Bean
    public AuditorAware<String> auditorProvider() {
        return () -> Optional.ofNullable(
            SecurityContextHolder.getContext()
                .getAuthentication()
                .getName()
        );
    }
}

// Base entity với auditing
@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
public abstract class BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "created_at", nullable = false, updatable = false)
    @CreatedDate
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    @LastModifiedDate
    private LocalDateTime updatedAt;

    @Column(name = "created_by")
    @CreatedBy
    private String createdBy;

    @Column(name = "updated_by")
    @LastModifiedBy
    private String updatedBy;
}

// Entity extend BaseEntity
@Entity
@Table(name = "users")
public class User extends BaseEntity {
    private String name;
    private String email;
}
```

---

## 12. Common Pitfalls và Best Practices

### 12.1. N+1 Query Problem

```java
// BAD: Lazy loading trong loop
List<User> users = userRepository.findByActiveTrue();
for (User user : users) {
    List<Order> orders = user.getOrders(); // Trigger query cho mỗi user!
}

// GOOD: Fetch join
@Query("SELECT DISTINCT u FROM User u LEFT JOIN FETCH u.orders WHERE u.active = true")
List<User> findActiveWithOrders();

// GOOD: Entity graph
@EntityGraph(attributePaths = {"orders"})
@Query("SELECT u FROM User u WHERE u.active = true")
List<User> findActiveWithOrders();
```

### 12.2. Equals và HashCode

> **Quan trọng:** Entity class phải override equals() và hashCode() đúng cách khi dùng trong Set hoặc làm key trong Map.

```java
@Entity
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String email;

    // Dùng business key cho equals, ID cho hashCode (hoặc không dùng ID)
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        User user = (User) o;
        return Objects.equals(id, user.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);  // ID-based hashCode
    }
}
```

### 12.3. Best Practices Tổng hợp

| Best Practice | Mô tả |
|---|---|
| **Dùng @Transactional cho writes** | Mọi persist/merge/remove cần transaction |
| **Avoid Eager fetching** | Prefer LAZY, dùng JOIN FETCH khi cần |
| **Prefer DTO/Projection cho reads** | Không load full entity khi chỉ cần vài fields |
| **Batch operations** | Dùng saveAll() hoặc entityManager.setProperty |
| **Entity immutability** | Dùng @Immutable cho entities không thay đổi |
| **Proper equals/hashCode** | Dùng ID hoặc business key |
| **Use optimistic locking** | @Version để tránh lost updates |
| **Avoid cross-entity transactions** | Giữ transaction scope nhỏ nhất có thể |
| **Test with real database** | H2 in-memory có thể khác production DB |

### 12.4. Optimistic Locking

```java
@Entity
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private Integer stock;

    @Version  // Optimistic lock
    private Long version;

    // Khi update đồng thời:
    // Thread 1: Read product (version=1)
    // Thread 2: Read product (version=1)
    // Thread 1: Update -> version=2, OK
    // Thread 2: Update -> version=1 (stale) -> OptimisticLockException!
}
```

---

## 13. Query Methods Keywords

Spring Data JPA tự động parse method names thành queries:

| Keyword | Sample | Generated SQL |
|---|---|---|
| `findBy` | `findByName(String name)` | `WHERE name = ?` |
| `findByNameIs` | `findByNameIs(String name)` | `WHERE name = ?` |
| `findByNameEquals` | `findByNameEquals(String name)` | `WHERE name = ?` |
| `findByNameIsNot` | `findByNameIsNot(String name)` | `WHERE name <> ?` |
| `findByAgeGreaterThan` | `findByAgeGreaterThan(int age)` | `WHERE age > ?` |
| `findByAgeGreaterThanEqual` | `findByAgeGreaterThanEqual(int age)` | `WHERE age >= ?` |
| `findByAgeLessThan` | `findByAgeLessThan(int age)` | `WHERE age < ?` |
| `findByAgeBetween` | `findByAgeBetween(int a, int b)` | `WHERE age BETWEEN ? AND ?` |
| `findByNameLike` | `findByNameLike(String name)` | `WHERE name LIKE ?` |
| `findByNameContaining` | `findByNameContaining(String s)` | `WHERE name LIKE %?%` |
| `findByNameStartingWith` | `findByNameStartingWith(String s)` | `WHERE name LIKE ?%` |
| `findByNameEndingWith` | `findByNameEndingWith(String s)` | `WHERE name LIKE %?` |
| `findByNameIn` | `findByNameIn(List<String> names)` | `WHERE name IN (?)` |
| `findByNameNotIn` | `findByNameNotIn(List<String> names)` | `WHERE name NOT IN (?)` |
| `findByActiveTrue` | `findByActiveTrue()` | `WHERE active = true` |
| `findByActiveFalse` | `findByActiveFalse()` | `WHERE active = false` |
| `findByNameIsNull` | `findByNameIsNull()` | `WHERE name IS NULL` |
| `findByNameIsNotNull` | `findByNameIsNotNull()` | `WHERE name IS NOT NULL` |
| `findByNameOrderByAgeDesc` | `findByNameOrderByAgeDesc(String name)` | `WHERE name = ? ORDER BY age DESC` |
