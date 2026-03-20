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
