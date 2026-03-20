# Chủ đề JPA vs Native SQL

## 1. Tổng quan

### 1.1. JPA là gì?

**JPA (Java Persistence API)** là specification (interface) trong Java EE/Jakarta EE, định nghĩa cách map objects (POJO) với database tables. JPA là một phần của Java ecosystem.

**Các implementations phổ biến:**

| Implementation | Provider | Đặc điểm |
|---|---|---|
| **Hibernate** | Red Hat | Phổ biến nhất, feature-rich |
| **EclipseLink** | Eclipse Foundation | JPA reference implementation |
| **OpenJPA** | Apache | Former reference implementation |
| **DataNucleus** | DataNucleus | Hỗ trợ nhiều datastore |

### 1.2. Native SQL là gì?

Native SQL là câu lệnh SQL thuần túy, được viết trực tiếp cho database cụ thể, sử dụng `EntityManager.createNativeQuery()` hoặc JDBC.

```java
// Native SQL example
String sql = "SELECT * FROM users WHERE email = ? AND status = 'active'";
Query query = entityManager.createNativeQuery(sql, User.class);
query.setParameter(1, email);
List<User> users = query.getResultList();
```

---

## 2. So sánh chi tiết

### 2.1. Portability (Tính di động)

| Tiêu chí | JPA / JPQL | Native SQL |
|---|---|---|
| **Database independence** | Cao | Thấp |
| **Portability** | Chuyển đổi database dễ dàng | Phải viết lại SQL |
| **Database-specific features** | Hạn chế | Tận dụng 100% |
| **Query dialect** | JPQL/HQL chuẩn hoá | SQL tuỳ database |

```java
// JPA: Database-independent
@Query("SELECT u FROM User u WHERE u.email = :email AND u.active = true")
User findByEmail(@Param("email") String email);

// Native: MySQL-specific
@Query(value = "SELECT * FROM users WHERE email = ? AND status = 'active'",
       nativeQuery = true)
User findByEmailNative(@Param("email") String email);

// Native: PostgreSQL-specific
@Query(value = "SELECT * FROM users WHERE email = $1 AND active = true",
       nativeQuery = true)
User findByEmailPg(@Param("email") String email);
```

### 2.2. Performance

| Tiêu chí | JPA / JPQL | Native SQL |
|---|---|---|
| **Query parsing** | Thêm overhead parsing | Không overhead |
| **Batch operations** | Cần cấu hình đặc biệt | Tự nhiên |
| **Fetch strategy** | Lazy/Eager configurable | Tuỳ developer |
| **Complex aggregations** | Có thể khó | Dễ dàng |
| **Native query hint** | Có thể gọi stored proc | Tự nhiên |

```java
// JPA: Batch insert (cần cấu hình)
@PersistenceContext
private EntityManager em;

public void batchInsert(List<User> users) {
    int batchSize = 50;
    for (int i = 0; i < users.size(); i++) {
        em.persist(users.get(i));
        if (i % batchSize == 0) {
            em.flush();
            em.clear();
        }
    }
    em.flush();
    em.clear();
}
```

```sql
-- Native SQL: Batch insert (đơn giản hơn)
INSERT INTO users (name, email, created_at) VALUES
    ('User 1', 'user1@example.com', NOW()),
    ('User 2', 'user2@example.com', NOW()),
    ('User 3', 'user3@example.com', NOW());
```

### 2.3. Type Safety

| Tiêu chí | JPA / JPQL | Native SQL |
|---|---|---|
| **Compile-time checking** | Có (với Criteria API) | Không |
| **Entity mapping** | Tự động | Phải tự map |
| **Null safety** | Hỗ trợ null fields | Phải handle null |
| **Generic result** | Type-safe entities | Object[] hoặc scalar |

```java
// JPA: Type-safe với @Query
@Query("SELECT u FROM User u WHERE u.id = :id")
Optional<User> findById(@Param("id") Long id);  // Type-safe return

// Native SQL: Result mapping phức tạp
@Query(value = """
    SELECT u.id, u.name, COUNT(o.id) as order_count
    FROM users u
    LEFT JOIN orders o ON u.id = o.user_id
    WHERE u.active = true
    GROUP BY u.id, u.name
    """, nativeQuery = true)
List<Object[]> findUserOrderCounts();

// Phải map thủ công
List<Object[]> results = findUserOrderCounts();
for (Object[] row : results) {
    Long id = ((Number) row[0]).longValue();
    String name = (String) row[1];
    Long orderCount = ((Number) row[2]).longValue();
}
```

---

## 3. Khi nào dùng JPA / JPQL?

### 3.1. CRUD Operations

JPA là lựa chọn tuyệt vời cho CRUD operations thông thường.

```java
// Spring Data JPA Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    List<User> findByActiveTrue();
    List<User> findByRoleAndStatus(String role, UserStatus status);
    Page<User> findByCreatedAtAfter(LocalDateTime date, Pageable pageable);
    boolean existsByEmail(String email);
    void deleteById(Long id);
}

// Sử dụng trong Service
@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public User createUser(CreateUserRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException(request.getEmail());
        }
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setStatus(UserStatus.ACTIVE);
        user.setCreatedAt(LocalDateTime.now());
        return userRepository.save(user);
    }

    public Page<User> getActiveUsers(int page, int size) {
        return userRepository.findByActiveTrue(PageRequest.of(page, size));
    }
}
```

### 3.2. Entity Relationships

```java
// JPA tự động handle relationships
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(unique = true)
    private String email;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Order> orders;

    // getters, setters
}

// Fetch orders - JPA tự động join
User user = userRepository.findById(1L);
// user.getOrders() trigger lazy load hoặc use fetch join
```

### 3.3. JPQL Queries cho Business Logic

```java
@Query("""
    SELECT u FROM User u
    JOIN u.orders o
    WHERE u.active = true
      AND o.status = 'COMPLETED'
      AND o.createdAt >= :startDate
    GROUP BY u
    HAVING COUNT(o) > :minOrders
    ORDER BY u.name ASC
    """)
List<User> findActiveUsersWithMinOrders(
    @Param("startDate") LocalDateTime startDate,
    @Param("minOrders") int minOrders
);

// Update/Delete với JPQL
@Modifying
@Query("UPDATE User u SET u.status = :status WHERE u.lastLogin < :cutoffDate")
int deactivateInactiveUsers(
    @Param("status") UserStatus status,
    @Param("cutoffDate") LocalDateTime cutoffDate
);
```

### 3.4. Dynamic Queries với Criteria API

```java
// Criteria API cho dynamic queries (type-safe, không string concatenation)
@Service
public class UserSearchService {
    @PersistenceContext
    private EntityManager em;

    public List<User> searchUsers(UserSearchCriteria criteria) {
        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<User> query = cb.createQuery(User.class);
        Root<User> user = query.from(User.class);

        Predicate predicate = cb.conjunction();

        if (criteria.getName() != null) {
            predicate = cb.and(predicate,
                cb.like(user.get("name"), "%" + criteria.getName() + "%"));
        }
        if (criteria.getEmail() != null) {
            predicate = cb.and(predicate,
                cb.equal(user.get("email"), criteria.getEmail()));
        }
        if (criteria.getStatus() != null) {
            predicate = cb.and(predicate,
                cb.equal(user.get("status"), criteria.getStatus()));
        }
        if (criteria.getMinAge() != null) {
            predicate = cb.and(predicate,
                cb.greaterThanOrEqualTo(user.get("age"), criteria.getMinAge()));
        }

        query.where(predicate);
        query.orderBy(cb.asc(user.get("name")));

        return em.createQuery(query).getResultList();
    }
}
```

---

## 4. Khi nào dùng Native SQL?

### 4.1. Database-Specific Features

```java
// PostgreSQL: FULL TEXT SEARCH
@Query(value = """
    SELECT * FROM products
    WHERE to_tsvector('english', name || ' ' || description)
          @@ plainto_tsquery('english', :keyword)
    ORDER BY ts_rank(
        to_tsvector('english', name || ' ' || description),
        plainto_tsquery('english', :keyword)
    ) DESC
    LIMIT 20
    """, nativeQuery = true)
List<Product> fullTextSearch(@Param("keyword") String keyword);

// PostgreSQL: Recursive CTE
@Query(value = """
    WITH RECURSIVE category_tree AS (
        SELECT id, name, parent_id, 0 AS depth
        FROM categories WHERE id = :rootId
        UNION ALL
        SELECT c.id, c.name, c.parent_id, ct.depth + 1
        FROM categories c
        JOIN category_tree ct ON c.parent_id = ct.id
    )
    SELECT * FROM category_tree ORDER BY depth
    """, nativeQuery = true)
List<Category> getCategoryTree(@Param("rootId") Long rootId);

// MySQL: GROUP_CONCAT
@Query(value = """
    SELECT u.id, u.name,
           GROUP_CONCAT(DISTINCT o.id ORDER BY o.created_at SEPARATOR ',') AS order_ids
    FROM users u
    LEFT JOIN orders o ON u.id = o.user_id
    WHERE u.active = true
    GROUP BY u.id, u.name
    """, nativeQuery = true)
List<Object[]> findUsersWithOrderIds();

// MySQL: Window Functions
@Query(value = """
    SELECT user_id, product_id, quantity,
           ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at DESC) AS rn
    FROM order_items
    """, nativeQuery = true)
List<Object[]> getLatestOrderItems();
```

### 4.2. Complex Aggregations và Reporting

```java
// Complex PIVOT query (MySQL)
@Query(value = """
    SELECT
        DATE(created_at) AS order_date,
        SUM(CASE WHEN status = 'PENDING' THEN total ELSE 0 END) AS pending_total,
        SUM(CASE WHEN status = 'COMPLETED' THEN total ELSE 0 END) AS completed_total,
        SUM(CASE WHEN status = 'CANCELLED' THEN total ELSE 0 END) AS cancelled_total,
        COUNT(*) AS total_orders,
        AVG(total) AS avg_order_value
    FROM orders
    WHERE created_at BETWEEN :startDate AND :endDate
    GROUP BY DATE(created_at)
    ORDER BY order_date
    """, nativeQuery = true)
List<Object[]> getDailyOrderSummary(
    @Param("startDate") LocalDateTime startDate,
    @Param("endDate") LocalDateTime endDate
);
```

### 4.3. Stored Procedures và Functions

```java
// Gọi Stored Procedure
@Query(value = "CALL calculate_monthly_revenue(:year, :month)", nativeQuery = true)
BigDecimal getMonthlyRevenue(
    @Param("year") int year,
    @Param("month") int month
);

// PostgreSQL Function với multiple OUT parameters
@Query(value = """
    SELECT * FROM calculate_user_stats(:userId)
    """, nativeQuery = true)
Object[] getUserStats(@Param("userId") Long userId);
```

### 4.4. Bulk Operations và ETL

```java
// Bulk UPDATE với subquery phức tạp
@Modifying
@Query(value = """
    UPDATE orders o
    SET status = 'EXPIRED',
        updated_at = NOW()
    WHERE status = 'PENDING'
      AND created_at < NOW() - INTERVAL '30 days'
      AND user_id IN (
          SELECT id FROM users WHERE subscription_type = 'FREE'
      )
    """, nativeQuery = true)
int expireOldPendingOrdersForFreeUsers();

// Bulk INSERT
@Modifying
@Query(value = """
    INSERT INTO order_audit (order_id, action, old_status, new_status, created_at)
    SELECT id, 'STATUS_CHANGE', 'OLD', status, NOW()
    FROM orders
    WHERE status_changed = true AND audit_created = false
    """, nativeQuery = true)
int createAuditEntries();
```

---

## 5. DTO Mapping

### 5.1. JPA Constructor Expression

```java
// Constructor expression trong JPQL - map trực tiếp vào DTO
@Query("""
    SELECT new com.example.dto.UserSummaryDTO(
        u.id, u.name, u.email, COUNT(o.id)
    )
    FROM User u
    LEFT JOIN u.orders o
    GROUP BY u.id, u.name, u.email
    """)
List<UserSummaryDTO> findUserSummaries();

// DTO class phải có constructor matching
public class UserSummaryDTO {
    private final Long id;
    private final String name;
    private final String email;
    private final Long orderCount;

    public UserSummaryDTO(Long id, String name, String email, Long orderCount) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.orderCount = orderCount;
    }
}
```

### 5.2. ResultTransformer

```java
// ResultTransformer để map native query result
Query query = entityManager.createNativeQuery("""
    SELECT u.id, u.name, u.email,
           COUNT(o.id) as order_count,
           COALESCE(SUM(o.total), 0) as total_spent
    FROM users u
    LEFT JOIN orders o ON u.id = o.user_id
    GROUP BY u.id, u.name, u.email
    """);

query.unwrap(org.hibernate.query.NativeQuery.class)
    .addScalar("id", LongType.INSTANCE)
    .addScalar("name", StringType.INSTANCE)
    .addScalar("email", StringType.INSTANCE)
    .addScalar("order_count", LongType.INSTANCE)
    .addScalar("total_spent", BigDecimalType.INSTANCE)
    .setResultTransformer(Transformers.aliasToBean(UserStatsDTO.class));
```

### 5.3. @SqlResultSetMapping

```java
// Annotation-based result mapping
@Entity
@SqlResultSetMapping(
    name = "UserOrderMapping",
    classes = {
        @ConstructorResult(
            targetClass = UserOrderDTO.class,
            columns = {
                @ColumnResult(name = "id", type = Long.class),
                @ColumnResult(name = "user_name", type = String.class),
                @ColumnResult(name = "order_count", type = Long.class),
                @ColumnResult(name = "total_spent", type = BigDecimal.class)
            }
        )
    }
)
public class User {
    // entity definition
}

// Sử dụng
@NamedNativeQuery(
    name = "findUserOrders",
    query = """
        SELECT u.id, u.name AS user_name,
               COUNT(o.id) as order_count,
               COALESCE(SUM(o.total), 0) as total_spent
        FROM users u
        LEFT JOIN orders o ON u.id = o.user_id
        GROUP BY u.id, u.name
        """,
    resultSetMapping = "UserOrderMapping"
)
```

---

## 6. Best Practices

### 6.1. Khi nào chọn JPA

| Use Case | JPA/JPQL | Native SQL |
|---|---|---|
| Standard CRUD | Tuỳ chọn hàng đầu | Có thể dùng |
| Simple SELECT with filters | JPA Repository methods | Không cần |
| Entity relationships | JPA | Phức tạp |
| Pagination | JpaRepository built-in | Phải tự implement |
| Dynamic queries | Criteria API hoặc QueryDSL | String concatenation nguy hiểm |
| Simple aggregations | JPQL acceptable | OK |
| Cross-DB support | Cần thiết | Không cần |
| Caching (L2 cache) | Hibernate cache | Không có |

### 6.2. Khi nào chọn Native SQL

| Use Case | Native SQL | JPA |
|---|---|---|
| Database-specific features | Bắt buộc | Không hỗ trợ |
| Complex PIVOT/UNPIVOT | Tự nhiên | Rất khó |
| Window Functions (Oracle, PostgreSQL, MySQL 8+) | Tự nhiên | Giới hạn |
| Bulk operations (millions rows) | Tối ưu | Phải cấu hình thêm |
| Complex CTEs (recursive) | Tự nhiên | Khó |
| Stored procedures | Hỗ trợ tốt | Giới hạn |
| Fine-tuned query hints | Đầy đủ | Giới hạn |
| ETL / Data migration | Hiệu quả | Không phù hợp |

### 6.3. Performance Tips

```java
// 1. Use @EntityGraph để tránh N+1
@EntityGraph(attributePaths = {"orders", "orders.items"})
@Query("SELECT u FROM User u WHERE u.id = :id")
Optional<User> findByIdWithOrders(@Param("id") Long id);

// 2. Fetch join cho complex queries
@Query("""
    SELECT DISTINCT u FROM User u
    LEFT JOIN FETCH u.orders o
    LEFT JOIN FETCH o.items
    WHERE u.active = true
    """)
List<User> findActiveWithOrdersAndItems();

// 3. Batch size cho lazy loading
@Entity
@BatchSize(size = 50)
public class Order {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
}

// 4. Projection cho read-only data
public interface UserProjection {
    Long getId();
    String getName();
    String getEmail();
}

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    List<UserProjection> findByActiveTrue();
}

// 5. Sử dụng @Transactional(readOnly = true) cho read queries
@Transactional(readOnly = true)
public List<User> getActiveUsers() {
    return userRepository.findByActiveTrue();
}
```

### 6.4. Security - SQL Injection Prevention

> **Cảnh báo:** Luôn sử dụng parameterized queries. Tuyệt đối không nối chuỗi user input vào SQL string.

```java
// SAFE: Parameterized query
@Query(value = "SELECT * FROM users WHERE email = :email", nativeQuery = true)
User findByEmail(@Param("email") String email);

// UNSAFE: String concatenation (SQL Injection vulnerability!)
// DON'T DO THIS!
String sql = "SELECT * FROM users WHERE email = '" + email + "'";
Query query = entityManager.createNativeQuery(sql);

// SAFE: Dynamic query với Criteria (type-safe, no concatenation)
Predicate predicate = cb.equal(user.get("email"), email);
```

### 6.5. Mixed Approach - Kết hợp JPA và Native

```java
// Repository hybrid approach
public interface OrderRepository extends JpaRepository<Order, Long> {
    // JPA cho standard operations
    List<Order> findByUserIdAndStatus(Long userId, String status);
    Page<Order> findByStatus(String status, Pageable pageable);

    // Native cho complex database-specific queries
    @Query(value = """
        SELECT o.* FROM orders o
        WHERE o.user_id IN (
            SELECT id FROM users WHERE region = :region
        )
        AND o.created_at >= :since
        ORDER BY o.created_at DESC
        LIMIT :limit
        """, nativeQuery = true)
    List<Order> findTopOrdersByRegion(
        @Param("region") String region,
        @Param("since") LocalDateTime since,
        @Param("limit") int limit
    );
}
```

---

## 7. Query Method Naming Conventions

Spring Data JPA cho phép tạo queries tự động từ method names:

```java
public interface UserRepository extends JpaRepository<User, Long> {
    // Basic finders
    Optional<User> findByEmail(String email);
    List<User> findByLastName(String lastName);
    List<User> findByAgeGreaterThan(int age);
    List<User> findByAgeBetween(int minAge, int maxAge);
    List<User> findByNameContaining(String keyword);    // LIKE %keyword%
    List<User> findByNameStartingWith(String prefix);   // LIKE prefix%
    List<User> findByNameEndingWith(String suffix);     // LIKE %suffix
    List<User> findByActiveTrue();                      // active = true
    List<User> findByActiveFalse();                     // active = false
    List<User> findByEmailIn(List<String> emails);      // IN clause

    // Multiple conditions
    List<User> findByNameAndEmail(String name, String email);
    List<User> findByNameOrEmail(String name, String email);

    // Ordering
    List<User> findByActiveTrueOrderByNameAsc();
    List<User> findByActiveTrueOrderByCreatedAtDesc();

    // Pagination (built-in)
    Page<User> findByActiveTrue(Pageable pageable);
    Slice<User> findByAgeGreaterThan(int age, Pageable pageable);

    // Count / Exists
    long countByActiveTrue();
    boolean existsByEmail(String email);

    // Delete
    void deleteByEmail(String email);
    @Modifying
    @Query("DELETE FROM User u WHERE u.lastLogin < :cutoffDate")
    int deleteInactiveUsers(@Param("cutoffDate") LocalDateTime cutoffDate);
}
```

---

## 8. EntityManager Operations

```java
@PersistenceContext
private EntityManager em;

// Find by ID
User user = em.find(User.class, 1L);

// Persist (INSERT)
em.persist(user);
em.flush();  // Sync to DB

// Merge (UPDATE)
User merged = em.merge(user);
em.flush();

// Remove (DELETE)
em.remove(user);
em.flush();

// Flush modes
em.setFlushMode(FlushModeType.COMMIT);  // Chỉ flush khi commit
em.setFlushMode(FlushModeType.AUTO);     // Flush trước query (mặc định)

// Clear
em.clear();  // Detach all entities, clear persistence context

// Refresh
em.refresh(user);  // Reload entity from DB, overwrite local changes

// Contains
boolean exists = em.contains(user);  // Check if entity in persistence context
```

---

## 9. Paging và Sorting

```java
// Pageable với Spring Data JPA
@Service
public class OrderService {
    @Autowired
    private OrderRepository orderRepository;

    public Page<Order> getOrders(Pageable pageable) {
        return orderRepository.findAll(pageable);
    }

    public Page<Order> getUserOrders(Long userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return orderRepository.findByUserId(userId, pageable);
    }

    // Multi-field sort
    public Page<Order> searchOrders(String status, String sortField, Sort.Direction direction) {
        Pageable pageable = PageRequest.of(0, 20,
            Sort.by(direction, sortField).and(Sort.by(Sort.Direction.ASC, "id")));
        return orderRepository.findByStatus(status, pageable);
    }
}

// Custom Pageable for native query
@Query(
    value = "SELECT * FROM orders WHERE status = :status",
    countQuery = "SELECT COUNT(*) FROM orders WHERE status = :status",
    nativeQuery = true
)
Page<Order> findByStatusNative(
    @Param("status") String status,
    Pageable pageable
);
```

---

## 10. Common Pitfalls

### 10.1. N+1 Problem

```java
// PROBLEM: Lazy loading gây N+1 queries
List<User> users = userRepository.findByActiveTrue();
// Nếu code truy cập user.getOrders() trong loop -> N+1!

// SOLUTION 1: Fetch join
@Query("SELECT u FROM User u LEFT JOIN FETCH u.orders WHERE u.active = true")
List<User> findActiveWithOrders();

// SOLUTION 2: Entity graph
@EntityGraph(attributePaths = {"orders"})
@Query("SELECT u FROM User u WHERE u.active = true")
List<User> findActiveWithOrders();

// SOLUTION 3: Batch fetching
@Entity
@BatchSize(size = 100)
public class Order {
    @ManyToOne(fetch = FetchType.LAZY)
    private User user;
}
```

### 10.2. @Transactional Placement

```java
// WRONG: Không có @Transactional cho modify operations
@Service
public class BadUserService {
    @Autowired
    private UserRepository userRepo;

    // Lỗi: EntityManager không được flushed
    public void saveUser(User user) {
        userRepo.save(user);
        // Cần @Transactional + @Modifying
    }
}

// CORRECT
@Service
@Transactional
public class GoodUserService {
    @Autowired
    private UserRepository userRepo;

    @Modifying
    @Query("UPDATE User u SET u.status = :status WHERE u.id = :id")
    int updateStatus(@Param("id") Long id, @Param("status") String status);
}
```

### 10.3. Entity vs DTO for Read Operations

```java
// Best Practice: Dùng Projection/DTO cho read-only queries
// Thay vì load full entity với tất cả fields
@Entity
public class User {
    @Id
    private Long id;
    private String name;
    private String email;
    @Lob
    private String avatar;      // Large field
    @Lob
    private String bio;        // Large field
    @OneToMany
    private List<Order> orders;
    @OneToMany
    private List<Comment> comments;
}

// DTO/Projection cho API response
public interface UserListProjection {
    Long getId();
    String getName();
    String getEmail();
}

public interface UserDetailProjection {
    Long getId();
    String getName();
    String getEmail();
    Integer getOrderCount();  // Computed
}

// Repository
List<UserListProjection> findAllProjectedBy();  // Chỉ load 3 fields
UserDetailProjection findDetailById(Long id);     // Dùng @Query với computed fields
```
