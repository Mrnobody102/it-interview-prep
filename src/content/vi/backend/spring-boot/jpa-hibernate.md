# Spring Data JPA

## 1. Repository Interface

Spring Data JPA giúp đơn giản hóa tầng truy xuất dữ liệu bằng cách cung cấp repository abstraction trên JPA/Hibernate. Thay vì viết lặp đi lặp lại các thao tác CRUD với `EntityManager`, lập trình viên có thể khai báo interface và để framework sinh phần triển khai cơ bản.

Trong backend thực tế, repository thường là điểm giao giữa:

- domain/service layer
- transaction boundary
- ORM mapping
- query tối ưu cho từng use case

### 1.1. Các interface chính

| Interface | Mở rộng từ | Mô tả |
|---|---|---|
| `CrudRepository` | - | CRUD cơ bản |
| `PagingAndSortingRepository` | `CrudRepository` | Thêm paging và sorting |
| `JpaRepository` | `PagingAndSortingRepository` | Bổ sung các tiện ích JPA phổ biến |

```java
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
}
```

Thực tế thường dùng `JpaRepository` vì nó đã bao phủ gần như toàn bộ nhu cầu CRUD, paging, flush, batch save phổ biến trong service nghiệp vụ.

## 2. Query Method Naming

Spring Data JPA có thể tự sinh query từ tên method. Đây là cơ chế rất hữu ích khi query đơn giản, rõ nghĩa, không cần join hoặc aggregate phức tạp.

### 2.1. Query theo thuộc tính

| Method | Ý nghĩa |
|---|---|
| `findByUsername(String username)` | Tìm theo username |
| `findByEmailAndStatus(String email, Status status)` | Tìm theo nhiều điều kiện |
| `existsByEmail(String email)` | Kiểm tra tồn tại |
| `deleteById(Long id)` | Xóa theo ID |

```java
Optional<User> findByEmail(String email);
List<User> findByDepartmentId(Long departmentId);
boolean existsByUsername(String username);
```

Query method naming rất hợp với các câu hỏi dạng:

- tìm theo một vài field
- kiểm tra tồn tại
- load danh sách nhỏ theo điều kiện đơn giản

### 2.2. Từ khóa nâng cao

| Từ khóa | Ví dụ | Ý nghĩa |
|---|---|---|
| `GreaterThan` | `findByAgeGreaterThan(int age)` | `>` |
| `Between` | `findByCreatedAtBetween(...)` | Trong khoảng |
| `Containing` | `findByNameContaining(String keyword)` | `LIKE %...%` |
| `IgnoreCase` | `findByEmailIgnoreCase(String email)` | Không phân biệt hoa thường |
| `OrderBy` | `findTop5ByStatusOrderByCreatedAtDesc(...)` | Sắp xếp |

```java
List<User> findTop10ByStatusOrderByCreatedAtDesc(Status status);
List<User> findByNameContainingIgnoreCase(String keyword);
List<Order> findByCreatedAtBetween(LocalDateTime from, LocalDateTime to);
```

Quy tắc thực chiến:

- tên method ngắn, rõ: dùng query method naming
- tên method quá dài: chuyển sang `@Query`
- query có join/aggregate/window/full-text: nên viết rõ ràng hơn bằng `@Query` hoặc native SQL

## 3. Custom Query

Khi query method naming bắt đầu dài, khó đọc hoặc không diễn đạt được đúng ý định business, nên viết query tường minh.

### 3.1. `@Query` với JPQL

```java
@Query("SELECT u FROM User u WHERE u.email = :email")
Optional<User> findByEmail(@Param("email") String email);
```

JPQL làm việc trên entity và field name thay vì table/column name. Nó thường dễ maintain hơn native SQL vì:

- ít phụ thuộc vendor cụ thể
- đọc gần với mô hình object hơn
- dễ refactor khi đổi tên entity field

### 3.2. `@Query` với native query

```java
@Query(value = "SELECT * FROM users WHERE status = :status", nativeQuery = true)
List<User> findByStatusNative(@Param("status") String status);
```

Native query phù hợp khi:

- cần dùng CTE, window function, full-text search
- cần tối ưu rất sát database
- query dùng syntax đặc thù PostgreSQL/MySQL/Oracle

### 3.3. `@Modifying` cho update/delete

```java
@Modifying
@Query("UPDATE User u SET u.status = :status WHERE u.id = :id")
int updateStatus(@Param("id") Long id, @Param("status") String status);
```

Các query thay đổi dữ liệu nên đi cùng `@Transactional`.

Ngoài ra cần lưu ý:

- bulk update/delete có thể bỏ qua persistence context hiện tại
- entity đang được giữ trong memory có thể bị stale
- đôi khi cần `clearAutomatically = true` hoặc tự `clear()` để tránh đọc dữ liệu cũ

## 4. Paging & Sorting

```java
Page<User> findByStatus(Status status, Pageable pageable);

Pageable pageable = PageRequest.of(0, 20, Sort.by("createdAt").descending());
Page<User> page = userRepository.findByStatus(Status.ACTIVE, pageable);
```

Kiểu kết quả thường gặp:

- `Page<T>`: có tổng số phần tử, tổng số trang
- `Slice<T>`: nhẹ hơn, chỉ quan tâm có trang tiếp theo hay không
- `List<T>`: chỉ lấy danh sách dữ liệu

Trong API thực tế:

- admin search thường cần `Page<T>`
- infinite scroll hoặc feed có thể dùng `Slice<T>`
- dashboard nhỏ hoặc dropdown có thể đủ với `List<T>`

Một lỗi phổ biến là dùng `Page<T>` cho mọi trường hợp rồi vô tình tạo thêm `count query` tốn kém không cần thiết.

## 5. DTO Projection

Projection giúp chỉ lấy các cột cần thiết thay vì toàn bộ entity. Đây là một trong những tối ưu quan trọng nhất để giảm:

- lượng dữ liệu truyền từ DB lên app
- chi phí hydration entity
- nguy cơ load thừa quan hệ

### 5.1. Constructor Expression

```java
@Query("""
    SELECT new com.example.UserDto(u.id, u.name, u.email)
    FROM User u
    WHERE u.active = true
    """)
List<UserDto> findActiveUserDtos();
```

Constructor projection phù hợp khi DTO cố định, cần rõ ràng và muốn giữ query ở mức tường minh.

### 5.2. Interface-based Projection

```java
public interface UserSummary {
    String getName();
    String getEmail();
}

List<UserSummary> findByActiveTrue();
```

Interface projection rất gọn cho read-only API, nhưng nên dùng có kiểm soát để tránh tạo quá nhiều projection rời rạc khó quản lý.

Projection đặc biệt hữu ích cho:

- màn hình danh sách
- dashboard summary
- response overview
- query trả về read model

## 6. Entity Relationships & FetchType

Đây là phần rất hay gây lỗi hiệu năng nếu dùng theo mặc định mà không hiểu rõ.

### 6.1. FetchType

| FetchType | Mặc định | Hành vi |
|---|---|---|
| `EAGER` | `@ManyToOne`, `@OneToOne` | Load ngay |
| `LAZY` | `@OneToMany`, `@ManyToMany` | Chỉ load khi truy cập |

```java
@ManyToOne(fetch = FetchType.LAZY)
private Department department;

@OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
private List<Order> orders;
```

Trong backend API, `LAZY` thường an toàn hơn vì tránh load dư dữ liệu. Tuy nhiên `LAZY` không phải "miễn phí":

- có thể gây N+1
- có thể gây `LazyInitializationException`
- có thể làm developer chủ quan rằng query đã tối ưu

### 6.2. Cascade Types

| Cascade Type | Ý nghĩa |
|---|---|
| `PERSIST` | Lưu con khi lưu cha |
| `MERGE` | Merge con khi merge cha |
| `REMOVE` | Xóa con khi xóa cha |
| `REFRESH` | Refresh con khi refresh cha |
| `DETACH` | Detach con khi detach cha |
| `ALL` | Áp dụng tất cả |

```java
@OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
private List<OrderItem> items = new ArrayList<>();
```

`CascadeType.ALL` chỉ nên dùng khi vòng đời entity con thực sự phụ thuộc vào entity cha. Nếu child có vòng đời riêng, dùng cascade bừa bãi có thể gây:

- xóa dữ liệu ngoài ý muốn
- update lan truyền khó đoán
- bug rất khó trace trong production

## 7. N+1 Query Problem

N+1 xảy ra khi query danh sách entity cha, sau đó mỗi entity lại trigger thêm query cho quan hệ con. Đây là lỗi ORM kinh điển.

Ví dụ:

1. query 1 lần lấy 100 user
2. mỗi user gọi `getOrders()`
3. phát sinh thêm 100 query nữa

### 7.1. `FETCH JOIN`

```java
@Query("SELECT u FROM User u LEFT JOIN FETCH u.addresses")
List<User> findAllWithAddresses();
```

`FETCH JOIN` là cách trực diện để nói rõ: query này phải kéo cả quan hệ liên quan cùng lúc.

Nhược điểm:

- có thể nhân bản dòng khi join collection
- phân trang phức tạp hơn
- dễ viết query nặng nếu join quá nhiều

### 7.2. `@EntityGraph`

```java
@EntityGraph(attributePaths = {"addresses", "roles"})
List<User> findAllByActiveTrue();
```

`@EntityGraph` giúp tách fetch strategy ra khỏi nội dung query. Đây là cách khá "sạch" khi muốn giữ repository method dễ đọc nhưng vẫn tối ưu quan hệ cần load.

### 7.3. `@BatchSize`

```java
@OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
@BatchSize(size = 20)
private List<Address> addresses;
```

`@BatchSize` không loại bỏ hoàn toàn N+1 như `FETCH JOIN`, nhưng giảm số query phải bắn ra bằng cách load theo lô. Rất hữu ích cho các tình huống:

- danh sách lớn
- cần giữ `LAZY`
- không muốn join nặng

## 8. Batch Insert/Update

```properties
spring.jpa.properties.hibernate.jdbc.batch_size=50
spring.jpa.properties.hibernate.order_inserts=true
spring.jpa.properties.hibernate.order_updates=true
```

```java
for (int i = 0; i < users.size(); i++) {
    entityManager.persist(users.get(i));
    if (i > 0 && i % 50 == 0) {
        entityManager.flush();
        entityManager.clear();
    }
}
```

Với dữ liệu lớn, `flush()` và `clear()` định kỳ giúp tránh phình persistence context. Đây là kỹ thuật rất quan trọng khi:

- import dữ liệu
- sync batch từ file/message queue
- migrate dữ liệu nội bộ

Nếu không kiểm soát persistence context, memory sẽ tăng dần và hiệu năng tụt rất mạnh.

## 9. Auditing

```java
@Configuration
@EnableJpaAuditing
public class JpaConfig {
}
```

```java
@Entity
@EntityListeners(AuditingEntityListener.class)
public class User {

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    @CreatedBy
    private String createdBy;

    @LastModifiedBy
    private String updatedBy;
}
```

Auditing rất hữu ích cho:

- trace thay đổi dữ liệu
- debug production issue
- hiển thị metadata "ai tạo, ai sửa"
- điều tra sự cố khi dữ liệu bị thay đổi bất thường

Nếu hệ thống có yêu cầu compliance hoặc audit trail, đây thường là tính năng bắt buộc ngay từ đầu.

## 10. Entity Lifecycle Callbacks

| Callback | Khi nào chạy |
|---|---|
| `@PrePersist` | Trước insert |
| `@PostPersist` | Sau insert |
| `@PreUpdate` | Trước update |
| `@PostUpdate` | Sau update |
| `@PreRemove` | Trước delete |
| `@PostRemove` | Sau delete |
| `@PostLoad` | Sau khi entity được load |

```java
@Entity
public class User {

    @PrePersist
    void beforeInsert() {
        System.out.println("before insert");
    }

    @PreUpdate
    void beforeUpdate() {
        System.out.println("before update");
    }
}
```

Chỉ nên dùng callback cho logic nhẹ như:

- set default value
- normalize dữ liệu đơn giản
- ghi log kỹ thuật

Không nên nhồi business logic phức tạp vào đây vì:

- khó test
- khó trace
- dễ tạo side effect không mong muốn

## 11. Transaction trong Spring Data JPA

| Thuộc tính | Mặc định | Ý nghĩa |
|---|---|---|
| Propagation | `REQUIRED` | Dùng transaction hiện tại hoặc tạo mới |
| Rollback | `RuntimeException`, `Error` | Mặc định rollback với unchecked exception |
| `readOnly` | `false` | Tối ưu cho luồng chỉ đọc |

```java
@Transactional
public void updateUser(Long id, String name) {
    User user = userRepository.findById(id)
        .orElseThrow(() -> new NotFoundException("User not found"));
    user.setName(name);
}
```

JPA sẽ tự dirty-check và flush khi transaction commit.

Điểm dễ nhầm:

- sửa field trong transaction chưa chắc bắn SQL ngay
- `save()` không phải lúc nào cũng là lúc query được gửi xuống DB
- rollback mặc định không áp dụng cho checked exception nếu không cấu hình thêm

Trong service thực tế, nên đặt transaction ở service layer thay vì controller hoặc repository usage rải rác.

Ngoài ra cần nhớ một số điểm thực chiến:

- transaction boundary nên bọc trọn một use case nghiệp vụ, không nên quá nhỏ
- method `readOnly = true` giúp thể hiện ý định rõ ràng và có thể hỗ trợ tối ưu ở một số driver/provider
- không nên kéo transaction qua network call dài, ví dụ gọi API ngoài rồi mới commit DB
- transaction càng dài thì lock giữ càng lâu, nguy cơ contention và deadlock càng cao

Một anti-pattern phổ biến là mở transaction rồi làm quá nhiều việc không liên quan:

1. đọc entity
2. gọi nhiều downstream service
3. xử lý dữ liệu nặng trong memory
4. cuối cùng mới ghi DB

Thiết kế như vậy vừa làm transaction lâu, vừa khó rollback/retry an toàn.

## 12. Commonly Used Annotations

| Annotation | Dùng cho |
|---|---|
| `@Entity` | Đánh dấu entity |
| `@Table` | Tên bảng, index, constraint |
| `@Id` | Khóa chính |
| `@GeneratedValue` | Sinh ID |
| `@Column` | Cấu hình cột |
| `@Enumerated` | Mapping enum |
| `@OneToMany`, `@ManyToOne` | Quan hệ |
| `@JoinColumn` | Foreign key |
| `@Version` | Optimistic locking |
| `@EntityGraph` | Điều khiển fetch graph |

Điều quan trọng không chỉ là nhớ tên annotation, mà là hiểu annotation đó ảnh hưởng đến:

- mapping
- fetch
- lifecycle
- locking
- transaction behavior

## 13. `LazyInitializationException`

### 13.1. Vấn đề

`LazyInitializationException` xuất hiện khi truy cập quan hệ `LAZY` sau khi transaction/persistence context đã đóng.

```java
User user = userRepository.findById(id).orElseThrow();
return user.getOrders().size();
```

Đây là lỗi rất hay gặp khi:

- trả entity thẳng ra controller
- serialize entity sang JSON
- mapping DTO sau khi transaction đã kết thúc

### 13.2. Cách xử lý

- dùng DTO projection
- dùng `FETCH JOIN`
- dùng `@EntityGraph`
- map dữ liệu trong transaction
- tránh bật `EAGER` tràn lan

Giải pháp bền vững nhất thường là:

1. xác định rõ dữ liệu API cần gì
2. query đúng lượng dữ liệu đó
3. map sang DTO trong boundary phù hợp

Không nên chọn giải pháp "bật `EAGER` cho đỡ lỗi" như phản xạ mặc định, vì thường chỉ chuyển lỗi từ correctness sang performance.

Trong code review, nếu thấy entity bị trả thẳng ra controller hoặc serialize trực tiếp, đó là tín hiệu cần kiểm tra rất kỹ nguy cơ `LazyInitializationException`.

## 14. Testing với `@DataJpaTest`

### 14.1. Basic Repository Test

```java
@DataJpaTest
class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    @Test
    void shouldFindUserByEmail() {
        User user = new User();
        user.setEmail("alice@example.com");
        userRepository.save(user);

        assertTrue(userRepository.findByEmail("alice@example.com").isPresent());
    }
}
```

### 14.2. Testing với database thật

Các query quan trọng, nhất là native query, nên được test với database thật hoặc Testcontainers thay vì chỉ H2/in-memory DB.

Lý do:

- syntax khác nhau giữa DB thật và H2
- behavior index có thể khác
- JSON/full-text/window function có thể không tương thích

Với repository quan trọng, Testcontainers thường đáng giá vì giúp test sát production hơn:

- đúng dialect
- đúng kiểu dữ liệu
- đúng transaction behavior
- đúng execution plan ở mức gần thực tế hơn

Một chiến lược hay là chia test persistence thành 2 lớp:

- test nhanh với `@DataJpaTest` cho query/repository phổ biến
- test chậm hơn với database thật cho native query, migration-sensitive query, và behavior phụ thuộc vendor

### 14.3. Testing giải pháp chống N+1

Không chỉ assert business result. Nên quan sát:

- số query
- SQL generated
- performance profile

vì nhiều lỗi ORM không làm sai dữ liệu, nhưng làm sai hiệu năng.

Nếu có thể, hãy bật SQL log hoặc Hibernate statistics trong test để nhìn rõ số query phát sinh thay vì chỉ đoán.

Khi nghi ngờ N+1, chỉ assert dữ liệu đúng là chưa đủ. Cần nhìn cả cost để tránh việc test pass nhưng production chậm dần theo volume.

### 14.4. Repository Configuration

Hãy test riêng:

- query methods
- projections
- pagination
- sorting
- edge cases transaction

Ngoài ra có thể test thêm:

- optimistic locking
- audit field
- lazy loading strategy
- duplicate/null edge cases

Khi repository chứa native query hoặc projection phức tạp, nên coi test của nó gần như contract test cho tầng persistence.

Điều này đặc biệt đúng với các query dùng:

- pagination tùy biến
- join nhiều bảng
- aggregate/reporting
- full-text search
- vendor-specific syntax

## 15. Aggregate Queries

### 15.1. Native Query for Aggregation

```java
@Query(value = """
    SELECT status, COUNT(*) AS total
    FROM orders
    GROUP BY status
    """, nativeQuery = true)
List<Object[]> countOrdersByStatus();
```

### 15.2. JPA Constructor Expression

```java
@Query("""
    SELECT new com.example.OrderSummary(o.status, COUNT(o))
    FROM Order o
    GROUP BY o.status
    """)
List<OrderSummary> summarizeOrders();
```

### 15.3. Database Views

Với báo cáo aggregate phức tạp, database view hoặc materialized view thường dễ maintain hơn việc nhồi toàn bộ logic vào repository code.

Đây là quyết định kiến trúc quan trọng:

- query nghiệp vụ đơn giản: giữ trong app
- read model tổng hợp nặng: cân nhắc view/materialized view
- reporting riêng biệt: có thể tách subsystem đọc riêng

Đừng cố nhồi mọi báo cáo vào repository CRUD chính nếu nhu cầu đọc đã khác hoàn toàn mô hình ghi.

Ở các hệ thống lớn, read model tối ưu riêng thường sạch hơn và rẻ hơn về vận hành.

Tách read model cũng giúp team tránh việc chỉnh sửa một entity/domain model chỉ vì nhu cầu của một màn hình báo cáo.

## 16. MyBatis as Alternative ORM

### 16.1. JPA vs MyBatis Comparison

| Tiêu chí | JPA/Hibernate | MyBatis |
|---|---|---|
| Mô hình | ORM | SQL mapper |
| SQL viết tay | Ít hơn | Nhiều hơn |
| Tốc độ CRUD thường gặp | Tốt | Trung bình |
| Kiểm soát query phức tạp | Vừa phải | Rất tốt |

### 16.2. MyBatis Workflow

MyBatis phù hợp hơn khi:

- query SQL quá phức tạp
- cần tối ưu rất sát database
- dùng nhiều vendor-specific SQL hoặc stored procedure

Ngược lại, JPA/Hibernate mạnh ở:

- CRUD domain-centric
- dirty checking
- aggregate update
- transaction unit-of-work

Nói ngắn gọn:

- nếu muốn tối ưu tốc độ phát triển CRUD và mô hình domain rõ ràng: JPA rất mạnh
- nếu muốn kiểm soát SQL cực sát, query report phức tạp, hoặc DB-specific feature dày đặc: MyBatis thường dễ thở hơn

Trong phỏng vấn, câu trả lời tốt thường không cực đoan "JPA luôn tốt hơn" hay "MyBatis luôn nhanh hơn", mà phải gắn với loại bài toán.

### 16.3. MyBatis với Spring Boot

Nhiều hệ thống thực tế dùng JPA cho CRUD thông thường và MyBatis cho reporting hoặc query nặng SQL.

Đây không phải "chọn một bỏ một". Trong một số hệ thống lớn, kết hợp hai cách tiếp cận lại hợp lý hơn cố ép mọi use case vào một ORM.

Điều quan trọng là phải phân vai rõ:

- JPA cho write model hoặc CRUD business thường xuyên
- MyBatis cho query report, export, dashboard, search query nặng

Nếu ranh giới này mơ hồ, codebase rất dễ bị trùng logic truy vấn ở nhiều nơi.

Khi dùng song song, cần thống nhất rõ nơi nào là source of truth cho từng kiểu truy vấn để tránh tình trạng service gọi lẫn lộn cả repository JPA và mapper MyBatis cho cùng một use case.

## 17. Database Migrations

### 17.1. Flyway vs Liquibase

| Tool | Điểm mạnh |
|---|---|
| Flyway | Đơn giản, SQL-first, dễ adopt |
| Liquibase | Mạnh hơn với changelog và workflow enterprise |

### 17.2. Flyway Configuration

```properties
spring.flyway.enabled=true
spring.flyway.locations=classpath:db/migration
```

### 17.3. Liquibase Configuration

```properties
spring.liquibase.change-log=classpath:/db/changelog/db.changelog-master.yaml
```

Migration phải được review như application code. Không nên dựa vào `ddl-auto=update` trên production.

Rule thực chiến:

- migration có version rõ ràng
- migration được review
- migration được test rollout/backward compatibility
- rollback plan được cân nhắc trước khi release

Ngoài ra nên tránh:

- sửa trực tiếp migration đã chạy ở production
- phụ thuộc vào `ddl-auto=update` như công cụ migration thật
- gộp quá nhiều thay đổi schema nguy hiểm vào một lần deploy

Schema change cũng là production change, nên cần cùng mức kỷ luật như code application.

Với thay đổi lớn như rename cột, tách bảng, backfill dữ liệu, nên nghĩ theo nhiều bước deploy thay vì một migration "all-in-one".

## 18. Full-Text Search

### 18.1. PostgreSQL Full-Text với JPA

```java
@Query(value = """
    SELECT *
    FROM articles
    WHERE to_tsvector('simple', title || ' ' || content)
          @@ plainto_tsquery('simple', :keyword)
    """, nativeQuery = true)
List<Article> searchArticles(@Param("keyword") String keyword);
```

### 18.2. MySQL Full-Text Search

MySQL có thể dùng `FULLTEXT INDEX` cùng `MATCH ... AGAINST`, nhưng nếu bài toán search phát triển mạnh, thường nên tách ra Elasticsearch/OpenSearch thay vì cố đẩy hết vào database giao dịch.

Nguyên tắc thực tế:

- search đơn giản, volume vừa: database FTS có thể đủ
- search nhiều tiêu chí, ranking, typo tolerance, analytics: nên có search engine riêng

Khi thiết kế search, hãy phân biệt rõ:

- transactional query
- filter/search cơ bản
- search experience nâng cao

Ba nhu cầu này thường trông giống nhau ở đầu dự án nhưng tách rất nhanh khi sản phẩm lớn lên.

Đó là lý do nhiều hệ thống ban đầu dùng database FTS khá ổn, nhưng về sau phải tách sang Elasticsearch/OpenSearch khi yêu cầu ranking, typo tolerance, suggest, analytics và multi-field boosting tăng lên.

Nói cách khác, lựa chọn công cụ search nên đi theo độ phức tạp của trải nghiệm tìm kiếm, không chỉ theo sở thích công nghệ của team.

Đó cũng là lý do nên thiết kế abstraction hợp lý ngay từ đầu nếu biết bài toán tìm kiếm có khả năng lớn dần.

Làm vậy sẽ giảm chi phí chuyển đổi khi cần thay backend search ở giai đoạn sau.

Nếu đợi đến lúc search đã trở thành phần cốt lõi của sản phẩm mới nghĩ tới chuyện này, chi phí refactor thường sẽ cao hơn nhiều.

Chuẩn bị sớm luôn rẻ hơn vá muộn.

## 19. Câu hỏi phỏng vấn thường gặp

### 19.1. Các trạng thái chính của entity trong JPA là gì?

Các trạng thái cốt lõi là transient, persistent, detached và removed. Hiểu rõ cách chuyển giữa chúng rất quan trọng để giải thích flush behavior và những update ngoài ý muốn.

### 19.2. N+1 query problem xuất hiện do đâu?

Nó xuất hiện khi query cha kéo theo rất nhiều query con bổ sung trong lúc lazy loading, thường vì fetch strategy không được thiết kế theo access pattern thật.

### 19.3. Có nên mặc định dùng `FetchType.EAGER` để tránh lazy issue không?

Không. `EAGER` thường chỉ che lỗi trước mắt nhưng lại tạo vấn đề lớn hơn về query và bộ nhớ. Thường nên giữ lazy và fetch tường minh cho từng use case.
