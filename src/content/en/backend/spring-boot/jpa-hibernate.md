# Spring Data JPA

## 1. Repository Interface

Spring Data JPA simplifies data access operations with JPA.

### 1.1. Core Interfaces

| Interface | Extends | Description |
|-----------|---------|-------------|
| `CrudRepository` | — | Basic CRUD |
| `PagingAndSortingRepository` | CrudRepository | Adds paging and sorting |
| `JpaRepository` | PagingAndSortingRepository | Full JPA features |

```java
public interface UserRepository extends JpaRepository<User, Long> {
    // Built-in methods:
    // save(), findById(), findAll(), deleteById(), count(), exists()
    // findAll(Pageable), saveAll()
}
```

## 2. Query Method Naming

Auto-generates queries from method names.

### 2.1. Query by Property

| Method | Query |
|--------|-------|
| `findByUsername(String)` | `WHERE username = ?` |
| `findByEmailAndStatus(String, String)` | `WHERE email = ? AND status = ?` |
| `existsByEmail(String)` | `SELECT COUNT(*) > 0 WHERE email = ?` |
| `deleteById(Long)` | `DELETE WHERE id = ?` |

### 2.2. Advanced Keywords

| Keyword | Example | Meaning |
|---------|---------|---------|
| `GreaterThan` | `findByAgeGreaterThan(int age)` | `WHERE age > ?` |
| `Between` | `findByCreatedDateBetween(Date, Date)` | Between range |
| `Containing` | `findByNameContaining(String)` | LIKE '%value%' |
| `IgnoreCase` | `findByEmailContainingIgnoreCase(String)` | LIKE (case-insensitive) |
| `OrderBy` | `findTop5ByStatusOrderByCreatedDateDesc(String)` | Sorting |
| `Optional` | `findByUsername(String)` → `Optional<User>` | Null-safe |

## 3. Custom Query

### 3.1. @Query with JPQL

```java
@Query("SELECT u FROM User u WHERE u.email = :email")
Optional<User> findByEmail(@Param("email") String email);
```

### 3.2. @Query with Native Query

```java
@Query(value = "SELECT * FROM users WHERE status = :status",
       nativeQuery = true)
List<User> findByStatusNative(@Param("status") String status);
```

### 3.3. @Modifying for Update/Delete

```java
@Modifying
@Query("UPDATE User u SET u.status = :status WHERE u.id = :id")
int updateUserStatus(@Param("id") Long id, @Param("status") String status);
```

> **Important**: Must combine with `@Transactional` in Service layer.

## 4. Paging & Sorting

```java
Page<User> findByStatus(String status, Pageable pageable);

// Usage
Pageable pageable = PageRequest.of(0, 10, Sort.by("createdDate").descending());
Page<User> page = userRepository.findByStatus("ACTIVE", pageable);

// Return types
// Page<T>: Full info (total count, total pages)
// Slice<T>: Only knows if there's a next page (more efficient)
// List<T>: Just the result list
```

## 5. DTO Projection

Returns only needed fields instead of full entity.

### 5.1. Constructor Expression

```java
@Query("SELECT new com.example.UserDTO(u.id, u.name, u.email) " +
       "FROM User u WHERE u.active = true")
List<UserDTO> findActiveUserDTOs();
```

### 5.2. Interface-based Projection

```java
interface UserNameOnly {
    String getName();
    String getEmail();
}

List<UserNameOnly> findByActiveTrue();
```

## 6. Entity Relationships & FetchType

### 6.1. FetchType

| FetchType | Default | Behavior |
|-----------|---------|----------|
| **EAGER** | `@ManyToOne`, `@OneToOne` | Load immediately when querying parent |
| **LAZY** | `@OneToMany`, `@ManyToMany` | Load only when accessed |

```java
@ManyToOne(fetch = FetchType.EAGER) // Default — load immediately
private Department department;

@OneToMany(fetch = FetchType.LAZY)   // Default — load only when getter called
private List<Order> orders;
```

> **Note**: Only use EAGER when you truly always need child data. Prefer LAZY.

### 6.2. Cascade Types

| Cascade Type | Effect |
|--------------|--------|
| `ALL` | All operations cascade |
| `PERSIST` | Save new child with parent |
| `MERGE` | Merge child with parent |
| `REMOVE` | Delete child with parent |
| `REFRESH` | Refresh child with parent |
| `DETACH` | Detach child with parent |

```java
@OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
private List<Order> orders;
```

## 7. N+1 Query Problem

When fetching N parent entities and accessing M child entities → generates **1 + N** queries.

### 7.1. FETCH JOIN

```java
@Query("SELECT u FROM User u LEFT JOIN FETCH u.addresses")
List<User> findAllWithAddresses();
```

### 7.2. @EntityGraph

```java
@EntityGraph(attributePaths = {"addresses", "roles"})
@Query("SELECT u FROM User u")
List<User> findAllWithDetails();
```

### 7.3. @BatchSize

```java
@OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
@BatchSize(size = 20)
private List<Address> addresses;

// Or global config
// spring.jpa.properties.hibernate.default_batch_fetch_size=20
```

## 8. Batch Insert/Update

```java
// Config
// spring.jpa.properties.hibernate.jdbc.batch_size=50
// spring.jpa.show_sql=true
// spring.jpa.properties.hibernate.format_sql=true

// Code
List<User> users = createUsers(); // 1000 records
userRepository.saveAll(users);

// For large data (tens of thousands)
for (int i = 0; i < users.size(); i += 50) {
    entityManager.flush();
    entityManager.clear();
}
```

## 9. Auditing

Auto-save created/modified time and creator.

```java
// 1. Enable auditing
@Configuration
@EnableJpaAuditing
public class JpaConfig { }

// 2. Declare audit fields in entity
@Entity
@EntityListeners(AuditingEntityListener.class)
public class User {
    @Id private Long id;

    @CreatedDate
    private LocalDateTime createdDate;

    @LastModifiedDate
    private LocalDateTime lastModifiedDate;

    @CreatedBy
    private String createdBy;

    @LastModifiedBy
    private String lastModifiedBy;
}
```

## 10. Entity Lifecycle Callbacks

```java
@Entity
@EntityListeners(UserListener.class)
public class User {
    @Id @GeneratedValue
    private Long id;

    @PrePersist   // Before insert
    public void beforeInsert() { /* ... */ }

    @PostPersist  // After insert
    public void afterInsert() { /* ... */ }

    @PreUpdate    // Before update
    public void beforeUpdate() { /* ... */ }

    @PostUpdate   // After update
    public void afterUpdate() { /* ... */ }

    @PreRemove    // Before delete
    public void beforeDelete() { /* ... */ }

    @PostRemove   // After delete
    public void afterDelete() { /* ... */ }
}
```

## 11. Transaction in Spring Data JPA

| Attribute | Default | Description |
|-----------|---------|-------------|
| **Propagation** | REQUIRED | Use current or create new |
| **Rollback** | RuntimeException, Error | Only rollback on unchecked exception |
| **readOnly** | false | Optimize for read-only queries |

```java
@Transactional
public void updateUser(Long id, String name) {
    User user = userRepository.findById(id)
        .orElseThrow(() -> new NotFoundException("User not found"));
    user.setName(name);
    // No need to call save() — JPA auto-persists on transaction commit
}
```

## 12. Commonly Used Annotations

| Annotation | Purpose |
|------------|---------|
| `@Entity` | Marks class as JPA entity |
| `@Table(name = "...")` | Specifies table name |
| `@Id` | Primary key |
| `@GeneratedValue` | Auto-generate ID |
| `@Column(nullable = false, unique = true)` | Column constraints |
| `@Enumerated` | Enum mapping (ORDINAL/STRING) |
| `@Temporal` | Date/Time mapping |
| `@Transient` | Exclude from persistence |
| `@Lob` | Large object (CLOB/BLOB) |

## 13. LazyInitializationException

Occurs when accessing a lazy-loaded association outside of an active Hibernate session.

### 13.1. Problem

```java
@Transactional(readOnly = true)
public List<User> getAllUsers() {
    List<User> users = userRepository.findAll();
    return users;  // Entities returned but session closed
}

// In controller or view layer
List<User> users = userService.getAllUsers();
for (User user : users) {
    System.out.println(user.getOrders().size());  // LazyInitializationException!
    // No active session - getOrders() was not fetched
}
```

### 13.2. Solutions

**Solution 1: Open Session in View (not recommended)**

```yaml
# application.yml
spring:
  jpa:
    properties:
      hibernate:
        open_in_view: true  # Default: true (but disables lazy loading safely)
```

> **Warning:** This keeps the session open until the view is rendered. Can cause lazy loading issues to surface at the presentation layer.

**Solution 2: Fetch Join (recommended)**

```java
@Transactional(readOnly = true)
public List<User> getAllUsersWithOrders() {
    return userRepository.findAllWithOrders();
}

@Query("SELECT u FROM User u LEFT JOIN FETCH u.orders")
List<User> findAllWithOrders();
```

**Solution 3: @Transactional on the calling method**

```java
@Service
public class UserService {

    @Transactional
    public List<UserDTO> getUsersWithDetails() {
        // This entire method runs inside one transaction
        List<User> users = userRepository.findAll();
        return users.stream()
            .map(this::toDTO)  // Accessing lazy fields is safe here
            .collect(Collectors.toList());
    }
}
```

**Solution 4: EntityGraph (declarative)**

```java
@EntityGraph(attributePaths = {"orders", "addresses"})
Optional<User> findById(Long id);
```

**Solution 5: Use DTO projection (best for read-only)**

```java
// Return DTO instead of entity
@Query("SELECT new com.example.UserDTO(u.id, u.name, u.email, COUNT(o)) " +
       "FROM User u LEFT JOIN u.orders o GROUP BY u.id, u.name, u.email")
List<UserDTO> findAllUserDTOs();
```

---

## 14. Testing with @DataJpaTest

`@DataJpaTest` provides a sliced test context with an embedded database (H2 by default) and auto-configures repositories.

### 14.1. Basic Repository Test

```java
@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TestEntityManager entityManager;

    @Test
    void findByEmail_WhenUserExists_ReturnsUser() {
        User user = new User();
        user.setEmail("test@example.com");
        user.setName("Test User");
        entityManager.persistAndFlush(user);

        Optional<User> found = userRepository.findByEmail("test@example.com");

        assertThat(found).isPresent();
        assertThat(found.get().getName()).isEqualTo("Test User");
    }

    @Test
    void findByEmail_WhenUserNotExists_ReturnsEmpty() {
        Optional<User> found = userRepository.findByEmail("nonexistent@example.com");
        assertThat(found).isEmpty();
    }
}
```

### 14.2. Testing with a Real Database

```java
@DataJpaTest
@SpringBootTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@TestPropertySource(locations = "classpath:application-test.yml")
class UserRepositoryIntegrationTest {

    @Autowired
    private UserRepository userRepository;

    @Test
    void findByStatus_JPQLQuery_Works() {
        User activeUser = new User();
        activeUser.setEmail("active@test.com");
        activeUser.setStatus("ACTIVE");
        userRepository.save(activeUser);

        User inactiveUser = new User();
        inactiveUser.setEmail("inactive@test.com");
        inactiveUser.setStatus("INACTIVE");
        userRepository.save(inactiveUser);

        List<User> activeUsers = userRepository.findByStatus("ACTIVE");

        assertThat(activeUsers).hasSize(1);
        assertThat(activeUsers.get(0).getEmail()).isEqualTo("active@test.com");
    }
}
```

### 14.3. Testing N+1 Solutions

```java
@DataJpaTest
class UserRepositoryN1Test {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TestEntityManager em;

    @Test
    void fetchJoin_LoadsOrdersInSingleQuery() {
        User user = new User("user1@test.com");
        em.persist(user);

        Order order1 = new Order(user, new BigDecimal("100"));
        Order order2 = new Order(user, new BigDecimal("200"));
        em.persist(order1);
        em.persist(order2);
        em.flush();
        em.clear();

        // Use fetch join to load orders
        List<User> users = userRepository.findAllWithOrders();

        // Accessing orders should NOT trigger additional queries
        for (User u : users) {
            assertThat(u.getOrders()).hasSize(2);  // No N+1!
        }

        // Verify single query was executed
        // (use sql() matcher from AssertJ or check statistics)
    }
}
```

### 14.4. Repository Configuration

```java
@DataJpaTest
@Import(UserRepositoryTestConfig.class)
class UserRepositoryAdvancedTest {

    @Configuration
    static class UserRepositoryTestConfig {
        @Bean
        public UserRepository userRepository(JpaContext context) {
            return new CustomUserRepositoryImpl(context);
        }
    }
}
```

---

## 15. Aggregate Queries

### 15.1. Native Query for Aggregation

```java
@Query(value = """
    SELECT u.region,
           COUNT(u.id) AS user_count,
           SUM(o.total) AS total_sales,
           AVG(o.total) AS avg_order_value
    FROM users u
    LEFT JOIN orders o ON u.id = o.user_id
    WHERE u.created_at >= :startDate
    GROUP BY u.region
    ORDER BY total_sales DESC
    """, nativeQuery = true)
List<Object[]> getSalesByRegion(@Param("startDate") LocalDateTime startDate);
```

```java
@Service
public class ReportService {

    public List<SalesRegionDTO> getSalesByRegion(LocalDateTime startDate) {
        List<Object[]> results = userRepository.getSalesByRegion(startDate);
        return results.stream()
            .map(row -> new SalesRegionDTO(
                (String) row[0],      // region
                ((Number) row[1]).longValue(),  // userCount
                (BigDecimal) row[2],  // totalSales
                (BigDecimal) row[3]  // avgOrderValue
            ))
            .collect(Collectors.toList());
    }
}
```

### 15.2. JPA Constructor Expression

```java
@Query("SELECT new com.example.SalesRegionDTO(" +
       "  u.region, COUNT(u), SUM(o.total), AVG(o.total)) " +
       "FROM User u LEFT JOIN u.orders o " +
       "GROUP BY u.region ORDER BY SUM(o.total) DESC")
List<SalesRegionDTO> getSalesByRegionJpql();
```

### 15.3. Database Views

```sql
-- Create view for pre-aggregated data
CREATE VIEW sales_by_region AS
SELECT
    u.region,
    COUNT(u.id) AS user_count,
    SUM(o.total) AS total_sales,
    AVG(o.total) AS avg_order_value,
    COUNT(o.id) AS order_count
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
GROUP BY u.region;
```

```java
@Entity
@Table(name = "sales_by_region")
@Immutable  // Read-only from view
public class SalesByRegion {
    @Id
    private String region;

    @Column(name = "user_count")
    private Long userCount;

    @Column(name = "total_sales")
    private BigDecimal totalSales;

    @Column(name = "avg_order_value")
    private BigDecimal avgOrderValue;
}

@Repository
public interface SalesByRegionRepository extends JpaRepository<SalesByRegion, String> {
    List<SalesByRegion> findAllByOrderByTotalSalesDesc();
}
```

---

## 16. MyBatis as Alternative ORM

### 16.1. JPA vs MyBatis Comparison

| Aspect | JPA / Hibernate | MyBatis |
|--------|-----------------|---------|
| **Paradigm** | Object-relational mapping | SQL-centric, data mapper |
| **Query control** | Automatic (JPQL/HQL) | Full SQL control |
| **Learning curve** | Steeper | Gentler |
| **Performance tuning** | Less predictable | Highly predictable |
| **Dynamic SQL** | Limited | Excellent (XML/annotation) |
| **Best for** | Domain-driven, CRUD-heavy | Complex queries, reports |
| **N+1 problem** | Exists (solutions needed) | Avoided by design |
| **Schema changes** | Auto-DDL | Manual migration |
| **Ecosystem** | Rich (Data JPA) | XML + Annotations |

### 16.2. MyBatis Workflow

```
1. Define SQL in XML mapper or annotations
2. Create mapper interface with method signatures
3. MyBatis creates proxy implementation
4. Call mapper method from service layer
```

**Mapper XML:**

```xml
<!-- resources/mappers/UserMapper.xml -->
<mapper namespace="com.example.mapper.UserMapper">
    <select id="findByEmail" resultType="User">
        SELECT id, name, email, status, created_at AS createdAt
        FROM users
        WHERE email = #{email}
    </select>

    <select id="findWithOrders" resultType="UserWithOrders">
        SELECT
            u.id, u.name, u.email,
            o.id AS order_id, o.total, o.created_at AS order_date
        FROM users u
        LEFT JOIN orders o ON u.id = o.user_id
        WHERE u.status = 'ACTIVE'
        ORDER BY u.id, o.created_at
    </select>

    <insert id="insert" useGeneratedKeys="true" keyProperty="id">
        INSERT INTO users (name, email, status, created_at)
        VALUES (#{name}, #{email}, #{status}, #{createdAt})
    </insert>

    <update id="update">
        UPDATE users
        SET name = #{name}, email = #{email}, status = #{status}
        WHERE id = #{id}
    </update>
</mapper>
```

**Mapper Interface:**

```java
@Mapper
public interface UserMapper {
    User findByEmail(@Param("email") String email);
    List<UserWithOrders> findWithOrders();
    void insert(User user);
    void update(User user);
}
```

**Service Layer:**

```java
@Service
@RequiredArgsConstructor
public class UserService {
    private final UserMapper userMapper;

    public User findByEmail(String email) {
        return userMapper.findByEmail(email);
    }
}
```

### 16.3. MyBatis with Spring Boot

```yaml
# application.yml
mybatis:
  mapper-locations: classpath:mappers/*.xml
  type-aliases-package: com.example.entity
  configuration:
    map-underscore-to-camel-case: true
    log-impl: org.apache.ibatis.logging.stdout.StdOutImpl
```

```java
@SpringBootApplication
@MapperScan("com.example.mapper")  // Auto-scan mapper interfaces
public class Application { }
```

> **When to choose MyBatis:** Complex stored procedures, heavy reporting, performance-critical queries where you need full SQL control. **When to choose JPA:** CRUD-heavy applications, domain-driven design, need for portable queries.

---

## 17. Database Migrations

### 17.1. Flyway vs Liquibase

| Feature | Flyway | Liquibase |
|---------|--------|-----------|
| **Format** | SQL scripts | XML/YAML/JSON/JSON |
| **DBAL** | Simple, uses raw SQL | Abstraction layer |
| **Rollback** | Limited (paid) | Full undo support |
| **Change tracking** | Version-based | Changelog-based |
| **Best for** | SQL-first teams | Multi-DB, complex changes |

### 17.2. Flyway Configuration

```yaml
# application.yml
spring:
  flyway:
    enabled: true
    baseline-on-migrate: true
    locations: classpath:db/migration
    sql-migration-prefix: V
    sql-migration-separator: __
    sql-migration-suffixes: .sql
```

```sql
-- resources/db/migration/V1__create_users_table.sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_status ON users(status);
```

```sql
-- resources/db/migration/V2__add_orders_table.sql
CREATE TABLE orders (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id),
    total DECIMAL(12, 2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
```

### 17.3. Liquibase Configuration

```yaml
spring:
  liquibase:
    change-log: classpath:db/changelog/master.xml
```

```xml
<!-- resources/db/changelog/master.xml -->
<databaseChangeLog xmlns="http://www.liquibase.org/xml/ns/dbchangelog">
    <include file="classpath:db/changelog/V1__create_users.xml"/>
    <include file="classpath:db/changelog/V2__add_orders.xml"/>
</databaseChangeLog>
```

```xml
<!-- V1__create_users.xml -->
<changeSet id="V1" author="dev">
    <createTable tableName="users">
        <column name="id" type="BIGINT" autoIncrement="true">
            <constraints primaryKey="true"/>
        </column>
        <column name="name" type="VARCHAR(100)">
            <constraints nullable="false"/>
        </column>
        <column name="email" type="VARCHAR(255)">
            <constraints nullable="false" unique="true"/>
        </column>
        <column name="status" type="VARCHAR(20)" defaultValue="ACTIVE"/>
        <column name="created_at" type="TIMESTAMP" defaultValueComputed="CURRENT_TIMESTAMP"/>
    </createTable>
    <rollback>
        <dropTable tableName="users"/>
    </rollback>
</changeSet>
```

---

## 18. Full-Text Search

### 18.1. PostgreSQL Full-Text with JPA

```sql
-- Add search vector column
ALTER TABLE products ADD COLUMN search_vector tsvector;

-- Create GIN index
CREATE INDEX idx_products_search ON products USING GIN(search_vector);

-- Update trigger for auto-updating search vector
CREATE OR REPLACE FUNCTION products_search_trigger() RETURNS trigger AS $$
BEGIN
    NEW.search_vector :=
        setweight(to_tsvector('english', coalesce(NEW.name, '')), 'A') ||
        setweight(to_tsvector('english', coalesce(NEW.description, '')), 'B');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER products_search_update
    BEFORE INSERT OR UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION products_search_trigger();
```

```java
@Entity
@Table(name = "products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;

    @Column(columnDefinition = "tsvector", insertable = false, updatable = false)
    private String searchVector;  // Not persistable, read-only
}

// Repository with full-text search
@Query(value = """
    SELECT p.* FROM products p
    WHERE p.search_vector @@ plainto_tsquery('english', :query)
    ORDER BY ts_rank(p.search_vector, plainto_tsquery('english', :query)) DESC
    """, nativeQuery = true)
List<Product> fullTextSearch(@Param("query") String query);
```

### 18.2. MySQL Full-Text Search

```sql
-- Create full-text index
ALTER TABLE products ADD FULLTEXT INDEX ft_products (name, description);

-- Search
SELECT *, MATCH(name, description) AGAINST('spring framework' IN NATURAL LANGUAGE MODE) AS relevance
FROM products
WHERE MATCH(name, description) AGAINST('spring framework' IN NATURAL LANGUAGE MODE)
ORDER BY relevance DESC;
```

```java
@Query(value = """
    SELECT p.*,
           MATCH(p.name, p.description) AGAINST(:keyword IN NATURAL LANGUAGE MODE) AS relevance
    FROM products p
    WHERE MATCH(p.name, p.description) AGAINST(:keyword IN NATURAL LANGUAGE MODE)
    ORDER BY relevance DESC
    """, nativeQuery = true)
List<Product> searchByKeyword(@Param("keyword") String keyword);
```
