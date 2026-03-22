# Database -> MyBatis

## MyBatis vs JPA/Hibernate

### Triết lý: SQL-Centric vs ORM

**JPA/Hibernate** coi database như một object store. Nó abstract hoàn toàn SQL -- bạn làm việc với objects, và ORM tự generate SQL. Điều này tốt cho CRUD đơn giản nhưng trở nên phức tạp khi cần truy vấn phức tạp, báo cáo, hoặc tối ưu hiệu năng chi tiết.

**MyBatis** tiếp cận theo hướng ngược lại. Nó mang tính SQL-centric: bạn tự viết SQL, MyBatis map kết quả sang objects. Điều này cho bạn toàn quyền kiểm soát truy vấn trong khi loại bỏ boilerplate của result-set handling.

| Khía cạnh | MyBatis | JPA/Hibernate |
|-----------|---------|---------------|
| **Kiểm soát SQL** | Toàn quyền -- bạn viết SQL | Provider tự generate |
| **Đường cong học** | Cần kiến thức SQL | Cần hiểu khái niệm ORM |
| **Tối ưu hiệu năng** | Tối ưu truy vấn trực tiếp | Phải hiểu internals Hibernate |
| **Linh hoạt** | Cao -- mọi SQL đều hoạt động | Bị giới hạn bởi JPQL/HQL |
| **Boilerplate** | Tối thiểu (chỉ result mapping) | Tối thiểu (không cần mapping) |
| **Thay đổi Schema** | Chịu đựng tốt hơn | Entity phải khớp với schema |
| **Báo cáo phức tạp** | SQL tự nhiên | Có thể awkward |

> **Khi nào chọn MyBatis**: Truy vấn báo cáo phức tạp, stored procedure, sự tham gia của DBA nhiều, OLTP đòi hiệu năng cao, và khi cần kiểm soát chính xác SQL được generate.

> **Khi nào chọn JPA/Hibernate**: Ứng dụng CRUD nặng, ưu tiên năng suất developer, schema được generate từ entities, và thoải mái với các pattern ORM.

---

## XML Mapper

MyBatis sử dụng file XML để định nghĩa câu lệnh SQL và result mappings. Mỗi mapper file được liên kết với một interface DAO/Mapper.

### Cấu trúc Mapper File

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
  "http://mybatis.org/dtd/mybatis-3-mapper.dtd">

<mapper namespace="com.example.mapper.UserMapper">

  <resultMap id="UserResultMap" type="com.example.entity.User">
    <id property="id" column="user_id"/>
    <result property="username" column="username"/>
    <result property="email" column="email"/>
    <result property="createdAt" column="created_at"/>
  </resultMap>

  <select id="findById" resultMap="UserResultMap">
    SELECT user_id, username, email, created_at
    FROM users
    WHERE user_id = #{id}
  </select>

  <select id="findAll" resultMap="UserResultMap">
    SELECT user_id, username, email, created_at
    FROM users
    ORDER BY created_at DESC
  </select>

  <insert id="insert" useGeneratedKeys="true" keyProperty="id">
    INSERT INTO users (username, email, created_at)
    VALUES (#{username}, #{email}, #{createdAt})
  </insert>

  <update id="update">
    UPDATE users
    SET username = #{username},
        email = #{email}
    WHERE user_id = #{id}
  </update>

  <delete id="delete">
    DELETE FROM users WHERE user_id = #{id}
  </delete>

</mapper>
```

### Mapper Interface

```java
package com.example.mapper;

public interface UserMapper {
    User findById(Long id);
    List<User> findAll();
    int insert(User user);
    int update(User user);
    int delete(Long id);
}
```

```java
// Usage
try (SqlSession session = sqlSessionFactory.openSession()) {
    UserMapper mapper = session.getMapper(UserMapper.class);
    User user = mapper.findById(1L);
}
```

---

## Interface-Based Mapper (Annotations)

Thay vì XML, bạn có thể định nghĩa SQL trực tiếp trên interface mapper bằng annotations. Cách này giữ mọi thứ ở một chỗ và được ưa chuộng cho các truy vấn đơn giản.

### Các Annotation Cốt lõi

```java
package com.example.mapper;

@Mapper
public interface UserMapper {

    @Select("SELECT * FROM users WHERE user_id = #{id}")
    User findById(Long id);

    @Insert("INSERT INTO users (username, email, created_at) " +
            "VALUES (#{username}, #{email}, #{createdAt})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(User user);

    @Update("UPDATE users SET username = #{username}, email = #{email} " +
            "WHERE user_id = #{id}")
    int update(User user);

    @Delete("DELETE FROM users WHERE user_id = #{id}")
    int delete(Long id);
}
```

### Result Mapping với Annotations

```java
@Results({
    @Result(id = true, property = "id", column = "user_id"),
    @Result(property = "username", column = "username"),
    @Result(property = "email", column = "email"),
    @Result(property = "createdAt", column = "created_at")
})
@Select("SELECT user_id, username, email, created_at FROM users WHERE user_id = #{id}")
User findById(Long id);
```

### One-to-Many và Many-to-One

```java
// One-to-Many: User -> Orders
@Select("SELECT * FROM users")
@Results({
    @Result(id = true, property = "id", column = "user_id"),
    @Result(property = "username", column = "username"),
    @Result(property = "orders", column = "user_id",
            many = @Many(select = "com.example.mapper.OrderMapper.findByUserId"))
})
List<User> findAllWithOrders();

// Many-to-One: Order -> User
@Select("SELECT * FROM orders WHERE order_id = #{id}")
@Results({
    @Result(id = true, property = "id", column = "order_id"),
    @Result(property = "total", column = "total"),
    @Result(property = "user", column = "user_id",
            one = @One(select = "com.example.mapper.UserMapper.findById"))
})
Order findById(Long id);
```

---

## Dynamic SQL

Dynamic SQL tags của MyBatis là một trong những tính năng mạnh nhất. Chúng cho phép bạn build truy vấn có điều kiện tại runtime, loại bỏ nhu cầu nhiều nhánh if/else trong Java code.

### `<if>` -- Bao gồm có điều kiện

```xml
<select id="search" resultType="User">
  SELECT * FROM users
  WHERE 1=1
  <if test="username != null">
    AND username LIKE #{username}
  </if>
  <if test="email != null">
    AND email = #{email}
  </if>
  <if test="minAge != null">
    AND age >= #{minAge}
  </if>
</select>
```

### `<choose>` (when/otherwise) -- Điều kiện loại trừ lẫn nhau

```xml
<select id="searchByRole" resultType="User">
  SELECT * FROM users
  <where>
    <choose>
      <when test="role == 'admin'">
        AND is_admin = true
      </when>
      <when test="role == 'guest'">
        AND is_admin = false AND verified = false
      </when>
      <otherwise>
        AND verified = true
      </otherwise>
    </choose>
  </where>
</select>
```

### `<where>` -- Tự động xử lý WHERE

```xml
<!-- Tự động loại bỏ AND/OR đầu tiên -->
<select id="findByCriteria" resultType="User">
  SELECT * FROM users
  <where>
    <if test="username != null">
      AND username = #{username}
    </if>
    <if test="city != null">
      AND city = #{city}
    </if>
  </where>
</select>
```

### `<set>` -- Dynamic UPDATE SET

```xml
<update id="updateSelective">
  UPDATE users
  <set>
    <if test="username != null">username = #{username},</if>
    <if test="email != null">email = #{email},</if>
    <if test="phone != null">phone = #{phone},</if>
  </set>
  WHERE user_id = #{id}
</update>
```

### `<trim>` -- Xử lý Prefix/Suffix tùy chỉnh

```xml
<!-- Tương đương với <where>: loại bỏ AND/OR đầu -->
<trim prefix="WHERE" prefixOverrides="AND |OR ">
  <if test="condition != null">AND status = #{condition}</if>
</trim>

<!-- Thêm SET prefix, loại bỏ dấu phẩy cuối -->
<trim prefix="SET" suffixOverrides=",">
  <if test="name != null">name = #{name},</if>
  <if test="email != null">email = #{email},</if>
</trim>
```

### `<foreach>` -- Batch Operations và IN Clauses

```xml
<!-- IN clause -->
<select id="findByIds" resultType="User">
  SELECT * FROM users
  WHERE user_id IN
  <foreach item="id" collection="ids" open="(" separator="," close=")">
    #{id}
  </foreach>
</select>

<!-- Batch insert -->
<insert id="batchInsert">
  INSERT INTO users (username, email) VALUES
  <foreach item="user" collection="users" separator=",">
    (#{user.username}, #{user.email})
  </foreach>
</insert>

<!-- Batch delete -->
<delete id="batchDelete">
  DELETE FROM users WHERE user_id IN
  <foreach item="id" collection="ids" open="(" separator="," close=")">
    #{id}
  </foreach>
</delete>
```

```java
// Java usage
List<Long> ids = Arrays.asList(1L, 2L, 3L, 4L, 5L);
List<User> users = userMapper.findByIds(ids);
// Batch insert
List<User> newUsers = Arrays.asList(new User("alice"), new User("bob"));
userMapper.batchInsert(newUsers);
```

---

## TypeHandlers

MyBatis sử dụng TypeHandlers để chuyển đổi giữa Java types và JDBC types. Nó có sẵn handlers cho tất cả các loại phổ biến (String, Integer, Date, Boolean, ...). Bạn có thể tạo custom TypeHandlers cho các chuyển đổi riêng.

### Built-in TypeHandlers

MyBatis tự động xử lý các chuyển đổi như `VARCHAR -> String`, `INTEGER -> Integer`, `TIMESTAMP -> Date`, `BOOLEAN -> Boolean`, và `JSON -> String` (với thư viện JSON).

### Custom TypeHandler

```java
@MappedTypes(String[].class)
@MappedJdbcTypes(JdbcType.VARCHAR)
public class StringArrayTypeHandler extends BaseTypeHandler<String[]> {

    @Override
    public void setNonNullParameter(PreparedStatement ps, int i,
            String[] params, JdbcType jdbcType) throws SQLException {
        ps.setString(i, String.join(",", params));
    }

    @Override
    public String[] getNullableResult(ResultSet rs, String columnName)
            throws SQLException {
        String value = rs.getString(columnName);
        return value != null ? value.split(",") : null;
    }

    @Override
    public String[] getNullableResult(ResultSet rs, int columnIndex)
            throws SQLException {
        String value = rs.getString(columnIndex);
        return value != null ? value.split(",") : null;
    }

    @Override
    public String[] getNullableResult(CallableStatement cs, int columnIndex)
            throws SQLException {
        String value = cs.getString(columnIndex);
        return value != null ? value.split(",") : null;
    }
}
```

### Enum TypeHandler

```java
public enum Status {
    ACTIVE, INACTIVE, SUSPENDED
}

@MappedTypes(Status.class)
public class StatusTypeHandler extends BaseTypeHandler<Status> {

    @Override
    public void setNonNullParameter(PreparedStatement ps, int i,
            Status status, JdbcType jdbcType) throws SQLException {
        ps.setString(i, status.name());
    }

    @Override
    public Status getNullableResult(ResultSet rs, String columnName)
            throws SQLException {
        return Status.valueOf(rs.getString(columnName));
    }

    @Override
    public Status getNullableResult(ResultSet rs, int columnIndex)
            throws SQLException {
        return Status.valueOf(rs.getString(columnIndex));
    }

    @Override
    public Status getNullableResult(CallableStatement cs, int columnIndex)
            throws SQLException {
        return Status.valueOf(cs.getString(columnIndex));
    }
}
```

Đăng ký trong `mybatis-config.xml` hoặc qua annotation `@Component`:

```xml
<typeHandlers>
  <typeHandler handler="com.example.handler.StatusTypeHandler"/>
</typeHandlers>
```

---

## Relationships: Nested Select vs Nested Result Mapping

### Nested Select (Vấn đề N+1)

```xml
<!-- Mỗi order trigger thêm 1 query cho user -->
<resultMap id="OrderResultMap" type="Order">
  <id property="id" column="order_id"/>
  <result property="total" column="total"/>
  <result property="userId" column="user_id"/>
  <association property="user" column="user_id"
               select="com.example.mapper.UserMapper.findById"/>
</resultMap>
```

```java
// Nếu fetch 100 orders, MyBatis thực thi:
// 1 query cho orders
// + 100 queries cho mỗi user = 101 queries total (N+1 problem)
List<Order> orders = orderMapper.findAll();
```

### Nested Result Mapping (Dựa trên JOIN, Hiệu quả hơn)

```xml
<!-- Một câu JOIN duy nhất, map kết quả trong một lần -->
<resultMap id="OrderResultMap" type="Order">
  <id property="id" column="order_id"/>
  <result property="total" column="total"/>
  <result property="userId" column="user_id"/>
  <association property="user" column="user_id"
               resultMap="UserResultMap" notNullColumn="user_id"/>
</resultMap>

<resultMap id="OrderWithUserResultMap" type="Order">
  <id property="id" column="order_id"/>
  <result property="total" column="total"/>
  <association property="user" javaType="User">
    <id property="id" column="user_id"/>
    <result property="username" column="username"/>
    <result property="email" column="email"/>
  </association>
</resultMap>

<select id="findAllWithUser" resultMap="OrderWithUserResultMap">
  SELECT o.order_id, o.total,
         u.user_id, u.username, u.email
  FROM orders o
  JOIN users u ON o.user_id = u.user_id
  ORDER BY o.order_id
</select>
```

| Cách tiếp cận | Số Queries | Phù hợp khi |
|--------------|-----------|-------------|
| Nested Select | N+1 (1 + N) | Association hiếm khi cần, lazy loading |
| Nested Result | 1 (JOIN) | Luôn cần, hiệu năng tốt hơn |

> **Best Practice**: Dùng nested result mapping khi bạn luôn cần dữ liệu associated. Dùng nested select khi association hiếm khi cần (lazy loading).

---

## Transaction Management

### SqlSession (Thủ công)

```java
try (SqlSession session = sqlSessionFactory.openSession()) {
    try {
        UserMapper userMapper = session.getMapper(UserMapper.class);
        OrderMapper orderMapper = session.getMapper(OrderMapper.class);

        User user = new User("alice", "alice@example.com");
        userMapper.insert(user);

        Order order = new Order(user.getId(), 150.00);
        orderMapper.insert(order);

        session.commit();  // commit or rollback
    } catch (Exception e) {
        session.rollback();
        throw e;
    }
}
```

### @Transactional (Tích hợp Spring)

```java
@Service
public class OrderService {

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private OrderMapper orderMapper;

    @Transactional
    public void createOrder(Long userId, BigDecimal total) {
        User user = userMapper.findById(userId);
        if (user == null) {
            throw new UserNotFoundException(userId);
        }

        Order order = new Order(userId, total);
        orderMapper.insert(order);

        // Nếu có exception, toàn bộ transaction sẽ rollback
        updateUserStatistics(userId);
    }
}
```

### Transaction Propagation

```java
@Transactional(propagation = Propagation.REQUIRED)       // default
@Transactional(propagation = Propagation.REQUIRES_NEW)   // tạo transaction mới
@Transactional(propagation = Propagation.NESTED)          // savepoint (JDBC)
@Transactional(propagation = Propagation.SUPPORTS)       // không tạo transaction mới
```

---

## Integration với Spring Boot

### Maven Dependencies

```xml
<dependency>
    <groupId>org.mybatis.spring.boot</groupId>
    <artifactId>mybatis-spring-boot-starter</artifactId>
    <version>3.0.3</version>
</dependency>
```

### Cấu hình (application.yml)

```yaml
mybatis:
  mapper-locations: classpath:mapper/*.xml
  type-aliases-package: com.example.entity
  configuration:
    map-underscore-to-camel-case: true
    cache-enabled: true
    log-impl: org.apache.ibatis.logging.stdout.StdOutImpl  # for debugging
  config-location: classpath:mybatis-config.xml
```

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/mydb
    username: postgres
    password: secret
    driver-class-name: org.postgresql.Driver
```

### Auto-Discovery của Mapper Interfaces

```java
@SpringBootApplication
@MapperScan("com.example.mapper")  // scans and registers mappers
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
```

### Lưu ý Spring Boot 3.x

Spring Boot 3.x (với Jakarta EE) yêu cầu MyBatis 3.5.x+ và dùng các package `jakarta.*` thay vì `javax.*`.

---

## Câu hỏi phỏng vấn thường gặp

> **MyBatis vs Hibernate: Khi nào bạn thích MyBatis hơn?**
>
> MyBatis được ưa chuộng khi cần kiểm soát chi tiết SQL (báo cáo phức tạp, stored procedure, schema do DBA quản lý), khi hiệu năng query quan trọng và muốn tune từng query, hoặc khi làm việc với database legacy mà schema không khớp với mô hình hướng đối tượng. Hibernate tỏa sáng trong các dự án greenfield với domain model sạch và workflow CRUD tiêu chuẩn.

> **Làm thế nào xử lý N+1 queries trong MyBatis?**
>
> Dùng nested result mapping (JOIN) thay vì nested select. Với collections, dùng `<collection>` với `select` cho lazy loading (chấp nhận được nếu association là optional) hoặc dùng `resultMap` với explicit column mappings cho eager loading. Luôn đo bằng explain plans.

> **MyBatis ngăn chặn SQL injection bằng cách nào?**
>
> MyBatis dùng `#{}` placeholders, được compile thành prepared statement parameters. Giá trị không bao giờ được nối trực tiếp vào chuỗi SQL. Chỉ dùng `${}` cho column/table name động khi không thể dùng prepared statement parameters, và không bao giờ dùng `${}` với user input.

> **Có thể dùng MyBatis với NoSQL databases không?**
>
> Có, MyBatis không giới hạn ở SQL databases. Nó có thể map bất kỳ data source nào (REST APIs, CSV, Redis) qua cơ chế generic TypeHandler. Tuy nhiên, thiết kế chính của nó là cho relational databases.
