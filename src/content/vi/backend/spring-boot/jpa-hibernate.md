# Spring Data JPA

## 1. Repository Interface

Spring Data JPA giúp đơn giản hóa thao tác truy xuất dữ liệu với JPA.

### 1.1. Các interface chính

| Interface | Mở rộng | Mô tả |
|-----------|---------|--------|
| `CrudRepository` | — | CRUD cơ bản |
| `PagingAndSortingRepository` | CrudRepository | Thêm paging và sorting |
| `JpaRepository` | PagingAndSortingRepository | Đầy đủ tính năng JPA |

```java
public interface UserRepository extends JpaRepository<User, Long> {
    // Các method được cung cấp sẵn:
    // save(), findById(), findAll(), deleteById(), count(), exists()
    // findAll(Pageable), saveAll()
}
```

## 2. Query Method Naming

Tự động tạo query dựa trên tên method.

### 2.1. Query theo thuộc tính

| Method | Query |
|--------|-------|
| `findByUsername(String)` | `WHERE username = ?` |
| `findByEmailAndStatus(String, String)` | `WHERE email = ? AND status = ?` |
| `existsByEmail(String)` | `SELECT COUNT(*) > 0 WHERE email = ?` |
| `deleteById(Long)` | `DELETE WHERE id = ?` |

### 2.2. Từ khóa nâng cao

| Từ khóa | Ví dụ | Ý nghĩa |
|---------|-------|---------|
| `GreaterThan` | `findByAgeGreaterThan(int age)` | `WHERE age > ?` |
| `Between` | `findByCreatedDateBetween(Date, Date)` | Trong khoảng |
| `Containing` | `findByNameContaining(String)` | LIKE '%value%' |
| `IgnoreCase` | `findByEmailContainingIgnoreCase(String)` | LIKE (case-insensitive) |
| `OrderBy` | `findTop5ByStatusOrderByCreatedDateDesc(String)` | Sắp xếp |
| `Optional` | `findByUsername(String)` → `Optional<User>` | Null-safe |

## 3. Custom Query

### 3.1. @Query với JPQL

```java
@Query("SELECT u FROM User u WHERE u.email = :email")
Optional<User> findByEmail(@Param("email") String email);
```

### 3.2. @Query với Native Query

```java
@Query(value = "SELECT * FROM users WHERE status = :status",
       nativeQuery = true)
List<User> findByStatusNative(@Param("status") String status);
```

### 3.3. @Modifying cho Update/Delete

```java
@Modifying
@Query("UPDATE User u SET u.status = :status WHERE u.id = :id")
int updateUserStatus(@Param("id") Long id, @Param("status") String status);
```

> **Quan trọng**: Phải kết hợp với `@Transactional` ở Service.

## 4. Paging & Sorting

```java
Page<User> findByStatus(String status, Pageable pageable);

// Sử dụng
Pageable pageable = PageRequest.of(0, 10, Sort.by("createdDate").descending());
Page<User> page = userRepository.findByStatus("ACTIVE", pageable);

// Các kiểu trả về
// Page<T>: Đầy đủ thông tin (tổng số phần tử, số trang)
// Slice<T>: Chỉ biết có trang tiếp theo (tối ưu hơn)
// List<T>: Chỉ danh sách kết quả
```

## 5. DTO Projection

Chỉ trả về các trường cần thiết thay vì toàn bộ entity.

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

| FetchType | Mặc định | Hành vi |
|-----------|---------|---------|
| **EAGER** | `@ManyToOne`, `@OneToOne` | Load ngay lập tức khi query cha |
| **LAZY** | `@OneToMany`, `@ManyToMany` | Chỉ load khi truy cập |

```java
@ManyToOne(fetch = FetchType.EAGER) // Mặc định — load ngay
private Department department;

@OneToMany(fetch = FetchType.LAZY)   // Mặc định — chỉ load khi gọi getter
private List<Order> orders;
```

> **Lưu ý**: Chỉ dùng EAGER khi thực sự luôn cần dữ liệu con. Thường nên dùng LAZY.

## 7. N+1 Query Problem

Khi lấy N entity cha, rồi truy cập M entity con → tạo ra **1 + N** truy vấn.

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

// Hoặc cấu hình toàn cục
// spring.jpa.properties.hibernate.default_batch_fetch_size=20
```

## 8. Batch Insert/Update

```java
// Cấu hình
// spring.jpa.properties.hibernate.jdbc.batch_size=50
// spring.jpa.show_sql=true
// spring.jpa.properties.hibernate.format_sql=true

// Code
List<User> users = createUsers(); // 1000 bản ghi
userRepository.saveAll(users);

// Với dữ liệu lớn (hàng chục nghìn)
for (int i = 0; i < users.size(); i += 50) {
    entityManager.flush();
    entityManager.clear();
}
```

## 9. Auditing

Tự động lưu thời gian tạo/cập nhật và người tạo.

```java
// 1. Bật auditing
@Configuration
@EnableJpaAuditing
public class JpaConfig { }

// 2. Khai báo trường audit trong entity
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

## 10. Transaction trong Spring Data JPA

| Thuộc tính | Giá trị mặc định | Ý nghĩa |
|-----------|------------------|---------|
| **Propagation** | REQUIRED | Dùng chung transaction hiện tại, hoặc tạo mới |
| **Rollback** | RuntimeException, Error | Chỉ rollback với unchecked exception |
| **readOnly** | false | Tối ưu hóa cho query chỉ đọc |

```java
@Transactional
public void updateUser(Long id, String name) {
    User user = userRepository.findById(id)
        .orElseThrow(() -> new NotFoundException("User not found"));
    user.setName(name);
    // Không cần gọi save() — JPA tự động persist khi transaction commit
}
```
