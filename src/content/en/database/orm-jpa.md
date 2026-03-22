# Database - ORM, JPA, Spring Data JPA

## 1. ORM (Object-Relational Mapping)

### 1.1. What is ORM?

ORM is a technique that maps object-oriented code to relational database tables. Instead of writing raw SQL, you work with objects in your programming language, and the ORM framework translates those operations into database queries behind the scenes.

```
Application Code (OOP)
+-----------------------------+
|  User user = new User();    |
|  user.setName("John Doe");  |
|  user.setEmail("j@d.com");   |
+-------------+---------------+
              | ORM
              v
+-----------------------------+
|  INSERT INTO users          |
|  (name, email) VALUES       |
|  ('John Doe', 'j@d.com')    |
+-------------+---------------+
              |
              v
       Database (Relational)
```

### 1.2. Benefits of ORM

| Benefit | Description |
|---|---|
| **Less SQL boilerplate** | No manual CRUD SQL writing |
| **Database independence** | Switch databases easily (MySQL to PostgreSQL) |
| **Abstraction** | Focus on business logic |
| **Security** | Automatic parameterized queries, preventing SQL injection |
| **Productivity** | Faster development cycles |
| **Maintainability** | Consistent, readable code |

### 1.3. ORM vs Pure JDBC

| Criteria | ORM (JPA/Hibernate) | Pure JDBC |
|---|---|---|
| **Lines of code** | Much less boilerplate | Verbose |
| **Performance** | Slight overhead, but optimizable | Best raw performance |
| **Control** | Has abstraction layer | Full control |
| **Learning curve** | Steeper (must understand ORM concepts) | Easier to start |
| **Complex queries** | Limited with JPA, flexible with Hibernate | Fully flexible |
| **Database portability** | High | Low |

---

## 2. JPA vs Hibernate

This is one of the most common interview questions on the topic.

**JPA (Java Persistence API)** is a specification (a set of interfaces and rules) defined in JSR 338. It describes *how* object-relational mapping should work in Java, but does not provide an implementation.

**Hibernate** is the most widely used implementation of the JPA specification. Other implementations include EclipseLink, OpenJPA, and DataNucleus.

Think of it this way: JPA is the interface, and Hibernate is the implementation.

```java
// JPA defines these interfaces
public interface EntityManager { ... }
public interface EntityManagerFactory { ... }
public interface Query { ... }

// Hibernate provides the implementation
// org.hibernate.jpa.HibernatePersistenceProvider
```

Because Hibernate implements JPA, you can switch to a different JPA implementation without changing your entity classes or repository code. The `javax.persistence` annotations you use are all part of the JPA specification, so they work with any compliant provider.

---

## 3. Basic JPA Annotations

### 3.1. @Entity and @Table

```java
@Entity
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

### 3.2. @Column

```java
@Entity
@Table(name = "users")
public class User {
    @Id
    private Long id;

    @Column(name = "full_name", nullable = false, length = 100)
    private String name;

    @Column(unique = true, length = 255)
    private String email;

    @Column(name = "balance", precision = 15, scale = 2)
    private BigDecimal balance;

    @Column(name = "bio", columnDefinition = "TEXT")
    private String bio;

    @Lob
    @Column(name = "avatar")
    private byte[] avatar;

    @Enumerated(EnumType.STRING)
    @Column(name = "role")
    private UserRole role;

    @Temporal(TemporalType.DATE)
    @Column(name = "birth_date")
    private Date birthDate;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    // Not persisted to the database
    @Transient
    private int computedAge;

    @Column(name = "created_by", insertable = true, updatable = false)
    private String createdBy;
}
```

### 3.3. @Id and @GeneratedValue

```java
@Entity
@Table(name = "users")
public class User {

    // IDENTITY: Auto-increment (MySQL, PostgreSQL SERIAL)
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idAuto;

    // SEQUENCE: Database sequence (PostgreSQL, Oracle)
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @SequenceGenerator(name = "user_seq", sequenceName = "user_sequence", allocationSize = 1)
    private Long idSeq;

    // TABLE: Uses a helper table (portable across databases)
    @Id
    @GeneratedValue(strategy = GenerationType.TABLE)
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

    // UUID with Hibernate
    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    // Composite key with @EmbeddedId
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

## 4. Entity Relationships

### 4.1. @ManyToOne (N-1)

Multiple orders can belong to one user. This is the most common relationship.

```java
@Entity
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "status_id")
    private OrderStatus status;
}
```

### 4.2. @OneToMany (1-N)

One user can have multiple orders. The `mappedBy` attribute always goes on the non-owning side.

```java
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToMany(
        mappedBy = "user",
        cascade = CascadeType.ALL,
        orphanRemoval = true,
        fetch = FetchType.LAZY
    )
    private List<Order> orders = new ArrayList<>();

    // Use Set to avoid duplicates
    @OneToMany(
        mappedBy = "user",
        cascade = CascadeType.ALL,
        orphanRemoval = true
    )
    private Set<Order> orderSet = new HashSet<>();

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

### 4.3. @OneToOne

One user has one profile. The owning side has `@JoinColumn`, while the inverse side uses `mappedBy`.

```java
@Entity
@Table(name = "user_profiles")
public class UserProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;

    private String bio;
    private String phone;
}
```

### 4.4. @ManyToMany

Multiple students can enroll in multiple courses. A join table is required.

```java
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

    @ManyToMany(mappedBy = "courses")
    private Set<Student> students = new HashSet<>();

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

### 4.5. Cascade Types

```java
@OneToMany(cascade = CascadeType.ALL, ...)
    // ALL: All cascade operations
    // PERSIST: Persist parent -> auto persist child
    // MERGE: Merge parent -> auto merge child
    // REMOVE: Delete parent -> auto delete child
    // REFRESH: Refresh parent -> auto refresh child
    // DETACH: Detach parent -> auto detach child

// orphanRemoval = true:
// Child removed from collection -> automatically DELETE from DB
```

---

## 5. EntityManager Operations

### 5.1. CRUD Operations

```java
@PersistenceContext
private EntityManager em;

@Repository
@Transactional
public class UserDao {

    public User create(User user) {
        em.persist(user);
        return user;
    }

    public User findById(Long id) {
        return em.find(User.class, id);
    }

    public User update(User user) {
        return em.merge(user);
    }

    public void delete(Long id) {
        User user = em.find(User.class, id);
        if (user != null) {
            em.remove(user);
        }
    }

    public int deleteInactiveUsers(LocalDateTime cutoff) {
        return em.createQuery(
            "DELETE FROM User u WHERE u.lastLogin < :cutoffDate"
        ).setParameter("cutoffDate", cutoff)
         .executeUpdate();
    }
}
```

### 5.2. Entity Lifecycle States

```
         NEW (Transient)
         new User() - no ID, not in DB
              | persist()
              v
         MANAGED (Persistent)
         Managed by EntityManager
         Changes auto-sync with DB
              | remove()
              v
         REMOVED (Removed)
         Marked for deletion, DELETE on flush/commit
              | commit()/flush()
              v
         DELETED

  DETACHED:
  Entity is no longer managed by EntityManager.
  Changes are not auto-synced.
  To update: call merge()
```

### 5.3. Merge vs Persist

```java
// persist(): Adds a NEW entity to the persistence context
// Use for entities that do not yet exist in the DB
User newUser = new User();
newUser.setName("New User");
em.persist(newUser);
// newUser now has an ID
// newUser remains MANAGED

// merge(): Updates an EXISTING entity in the DB
// If the entity is detached, creates a copy and merges it
// If the entity is already managed, does nothing
User detachedUser = new User();
detachedUser.setId(1L);
detachedUser.setName("Updated Name");
User managedUser = em.merge(detachedUser);
// managedUser is the managed entity
// detachedUser is still detached
// Always work with the returned object
```

### 5.4. Flush Modes

```java
// Flush: Sync persistence context with DB
// FlushMode.AUTO (default): Sync before query execution
em.setFlushMode(FlushModeType.AUTO);

// FlushMode.COMMIT: Only sync at commit time
em.setFlushMode(FlushModeType.COMMIT);

// Manual flush
em.flush();       // Force immediate sync
em.clear();       // Clear entire persistence context, detach all
em.detach(entity); // Detach specific entity
em.refresh(entity); // Reload entity from DB, discard local changes
```

---

## 6. Spring Data JPA Repository

### 6.1. JpaRepository Interface

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
    void deleteInBatch(Iterable<T> entities);
    void deleteAllInBatch();
}
```

### 6.2. Method Name Queries

Spring Data JPA automatically generates queries from method names:

| Keyword | Sample | Generated SQL |
|---|---|---|
| `findBy` | `findByName(String name)` | `WHERE name = ?` |
| `findByNameIs` | `findByNameIs(String name)` | `WHERE name = ?` |
| `findByNameIsNot` | `findByNameIsNot(String name)` | `WHERE name <> ?` |
| `findByAgeGreaterThan` | `findByAgeGreaterThan(int age)` | `WHERE age > ?` |
| `findByAgeBetween` | `findByAgeBetween(int a, int b)` | `WHERE age BETWEEN ? AND ?` |
| `findByNameLike` | `findByNameLike(String name)` | `WHERE name LIKE ?` |
| `findByNameContaining` | `findByNameContaining(String s)` | `WHERE name LIKE %?%` |
| `findByNameStartingWith` | `findByNameStartingWith(String s)` | `WHERE name LIKE ?%` |
| `findByNameEndingWith` | `findByNameEndingWith(String s)` | `WHERE name LIKE %?` |
| `findByNameIn` | `findByNameIn(List<String> names)` | `WHERE name IN (?)` |
| `findByActiveTrue` | `findByActiveTrue()` | `WHERE active = true` |
| `findByActiveFalse` | `findByActiveFalse()` | `WHERE active = false` |
| `findByNameIsNull` | `findByNameIsNull()` | `WHERE name IS NULL` |
| `findByNameOrderByAgeDesc` | `findByNameOrderByAgeDesc(String name)` | `WHERE name = ? ORDER BY age DESC` |

### 6.3. @Query (JPQL and Native)

```java
public interface UserRepository extends JpaRepository<User, Long> {

    // JPQL query
    @Query("SELECT u FROM User u WHERE u.email = :email")
    Optional<User> findByEmail(@Param("email") String email);

    // JPQL with JOIN FETCH to avoid N+1
    @Query("SELECT u FROM User u LEFT JOIN FETCH u.orders WHERE u.id = :id")
    Optional<User> findByIdWithOrders(@Param("id") Long id);

    // Native SQL query
    @Query(value = "SELECT * FROM users WHERE email = :email", nativeQuery = true)
    Optional<User> findByEmailNative(@Param("email") String email);

    // JPQL UPDATE with @Modifying
    @Modifying
    @Query("UPDATE User u SET u.active = :active WHERE u.lastLogin < :cutoff")
    int updateActiveStatus(
        @Param("active") boolean active,
        @Param("cutoff") LocalDateTime cutoff
    );
}
```

### 6.4. Pagination and Sorting

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

@Service
public class OrderService {
    public Page<Order> getOrders(Long userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size,
            Sort.by("createdAt").descending()
                .and(Sort.by("id").ascending())
        );
        return orderRepository.findByUserId(userId, pageable);
    }

    // Custom Pageable for native query
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

### 6.5. Custom Repository

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
}
```

---

## 7. Fetch Strategies

### 7.1. Lazy vs Eager

```java
@Entity
public class Order {
    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)  // Default for @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(fetch = FetchType.EAGER)  // Default for @OneToMany - BE CAREFUL
    private List<OrderItem> items;
}
```

**Lazy** fetching loads associated entities only when explicitly accessed. **Eager** fetching loads them immediately along with the parent entity.

Eager fetching is risky because it can cause N+1 query problems, load unnecessary data, and create Cartesian products in JOINs. Always prefer lazy fetching and use explicit JOIN FETCH when you need associated data.

### 7.2. Entity Graphs

Entity graphs let you control exactly which associations are loaded in a single query.

```java
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

// Using @EntityGraph annotation
@EntityGraph(value = "Order.withUserAndItems", type = EntityGraph.EntityGraphType.FETCH)
Optional<Order> findById(Long id);

// Using attribute paths directly
@EntityGraph(attributePaths = {"user", "items"})
Optional<Order> findById(Long id);

// Programmatic EntityGraph
EntityGraph<Order> graph = em.createEntityGraph(Order.class);
graph.addAttributeNodes("user", "items");
graph.addSubgraph("items").addAttributeNode("product");

Map hints = Collections.singletonMap("jakarta.persistence.fetchgraph", graph);
Order order = em.find(Order.class, 1L, hints);
```

### 7.3. Batch Fetching

```java
@Entity
@BatchSize(size = 100)
public class OrderItem {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;
}
```

When accessing `orderItem.getProduct()` inside a loop, Hibernate batch-fetches products using `WHERE id IN (?, ?, ?, ...)`. Instead of N individual queries, it fires one batch query. This is a practical solution for N+1 problems when you cannot use JOIN FETCH.

---

## 8. Lifecycle Callbacks

### 8.1. @PrePersist and @PostPersist

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
        // Send notification, audit logging
        auditLog.info("User created: {}", id);
    }
}
```

### 8.2. @PreUpdate and @PostUpdate

```java
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime updatedAt;

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    @PostUpdate
    protected void onPostUpdate() {
        // Cache invalidation
        // Event publishing
        applicationEventPublisher.publishEvent(new UserUpdatedEvent(this));
    }
}
```

### 8.3. @PreRemove, @PostRemove, and @PostLoad

```java
@Entity
public class User {
    @Id
    private Long id;

    @PostRemove
    protected void onDelete() {
        // Cleanup related resources
        // File deletion, notifications
    }

    @Transient
    private String displayName;

    @PostLoad
    protected void onLoad() {
        // Compute transient fields
        this.displayName = name.toUpperCase();
    }
}
```

---

## 9. @Transactional

### 9.1. Key Attributes

```java
@Service
public class UserService {

    @Transactional(isolation = Isolation.READ_COMMITTED)
    public void transferMoney(Long fromId, Long toId, BigDecimal amount) {
        Account from = accountRepository.findById(fromId).orElseThrow();
        Account to = accountRepository.findById(toId).orElseThrow();
        from.withdraw(amount);
        to.deposit(amount);
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void sendNotification(Long userId, String message) {
        // Runs in its own transaction, independent of the calling transaction
    }

    @Transactional(propagation = Propagation.SUPPORTS)
    public User getUser(Long id) {
        // Uses existing transaction if present, or runs without transaction
        return userRepository.findById(id).orElseThrow();
    }
}
```

**Isolation levels** control how transactions interact:
- `READ_UNCOMMITTED` - Dirty reads possible
- `READ_COMMITTED` - Prevents dirty reads
- `REPEATABLE_READ` - Prevents non-repeatable reads
- `SERIALIZABLE` - Full isolation, slowest

**Propagation** defines how the method participates in an existing transaction:
- `REQUIRED` (default) - Join existing or create new
- `REQUIRES_NEW` - Always create new, suspend existing
- `SUPPORTS` - Join if present, otherwise non-transactional
- `MANDATORY` - Must have existing transaction
- `NEVER` - Must NOT have transaction

### 9.2. Rollback Rules

```java
@Transactional
public void processOrder(Long orderId) {
    // Default: Rolls back on unchecked exceptions (RuntimeException, Error)
    // Default: Does NOT roll back on checked exceptions
    throw new RuntimeException("Payment failed"); // Triggers rollback

    // Custom rollback behavior
    @Transactional(rollbackFor = IOException.class)
    public void importData() throws IOException {
        // Now rolls back on IOException (checked exception)
    }

    // Never rollback
    @Transactional(noRollbackFor = DataAccessException.class)
    public void logFailedAttempt() {
        // Exception logged but transaction still commits
    }
}
```

---

## 10. N+1 Query Problem and Solutions

The N+1 problem occurs when loading a list of entities triggers one additional query for each entity's associated data.

```java
// BAD: N+1 problem
List<User> users = userRepository.findByActiveTrue();
for (User user : users) {
    List<Order> orders = user.getOrders(); // New query for each user!
}
// If there are 100 users -> 1 query + 100 queries = 101 queries
```

**Solutions:**

```java
// Solution 1: JOIN FETCH in JPQL
@Query("SELECT DISTINCT u FROM User u LEFT JOIN FETCH u.orders WHERE u.active = true")
List<User> findActiveWithOrders();

// Solution 2: Entity Graph
@EntityGraph(attributePaths = {"orders"})
@Query("SELECT u FROM User u WHERE u.active = true")
List<User> findActiveWithOrders();

// Solution 3: Batch Fetching (configured on the entity)
@OneToMany(fetch = FetchType.LAZY)
@BatchSize(size = 50)
private List<Order> orders;
```

---

## 11. Batch Insert and Update

### 11.1. saveAll() with Batch

```java
// application.properties
spring.jpa.properties.hibernate.jdbc.batch_size=50
spring.jpa.properties.hibernate.order_inserts=true
spring.jpa.properties.hibernate.order_updates=true
spring.jpa.properties.hibernate.batch_versioned_data=true
```

```java
@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public void importUsers(List<User> users) {
        // Spring Data JPA's saveAll() uses batching
        userRepository.saveAll(users);
    }
}
```

### 11.2. EntityManager Batch Operations

```java
@Service
public class BatchService {
    @PersistenceContext
    private EntityManager em;

    public void batchInsert(List<Product> products) {
        int batchSize = 50;
        for (int i = 0; i < products.size(); i++) {
            em.persist(products.get(i));
            if (i > 0 && i % batchSize == 0) {
                em.flush();
                em.clear();
            }
        }
        em.flush();
        em.clear();
    }
}
```

---

## 12. DTO Projection

Loading entire entities when you only need a few fields is wasteful. DTO projections solve this.

```java
// DTO class
public class UserSummaryDTO {
    private final Long id;
    private final String name;
    private final String email;

    public UserSummaryDTO(Long id, String name, String email) {
        this.id = id;
        this.name = name;
        this.email = email;
    }
}

// Interface projection (Spring Data JPA)
public interface UserSummary {
    Long getId();
    String getName();
    String getEmail();
}

public interface UserRepository extends JpaRepository<User, Long> {
    // Returns an interface-backed projection
    List<UserSummary> findByActiveTrue();

    // Returns a DTO class with constructor expression
    @Query("SELECT new com.example.dto.UserStatsDTO(u.id, u.name, COUNT(o.id)) " +
           "FROM User u LEFT JOIN u.orders o GROUP BY u.id, u.name")
    List<UserStatsDTO> findUserStats();
}
```

---

## 13. Auditing

### 13.1. JPA Auditing with Spring Data

```java
// Enable auditing
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

// Base entity with auditing
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

// Entity extends BaseEntity
@Entity
@Table(name = "users")
public class User extends BaseEntity {
    private String name;
    private String email;
}
```

---

## 14. Common Interview Questions

**Q: What is the difference between JPA and Hibernate?**
A: JPA is the specification (interfaces and contracts), while Hibernate is the most popular implementation. JPA defines what should be done; Hibernate defines how it is done.

**Q: What is the N+1 problem?**
A: It occurs when loading N entities triggers N additional queries to fetch associated data. Solutions include JOIN FETCH, Entity Graphs, and Batch Fetching.

**Q: What is the difference between @PrePersist and @PostPersist?**
A: @PrePersist runs before the INSERT statement, while @PostPersist runs after the entity is saved to the database.

**Q: What is the difference between merge() and persist()?**
A: persist() adds a new entity to the persistence context. merge() copies the state of a detached entity onto a managed entity and returns the managed copy.

**Q: What is the owning side in a relationship?**
A: The owning side is the entity that has the @JoinColumn annotation. Changes to the owning side are persisted to the database. The inverse side uses mappedBy and does not manage the relationship.

**Q: What is optimistic locking?**
A: Optimistic locking uses a @Version field. When two transactions read the same entity, the first to commit wins. The second to commit gets an OptimisticLockException because the version has changed. It avoids database-level locks and is suitable for low-contention scenarios.

**Q: What is the default fetch type for @OneToMany?**
A: LAZY. For @ManyToOne it is also LAZY. For @OneToOne the default is EAGER. For @ManyToMany the default is LAZY. Watch out for @OneToOne EAGER as it can cause performance issues.

**Q: What is the difference between @Transactional on an interface vs. a class?**
A: Spring Data JPA proxies repository interfaces. @Transactional on the service class works with Spring's proxy-based AOP. Placing it on an interface method (in an interface-based repository) does not work because Spring Data JPA creates proxies differently. Always put @Transactional on the service layer.
