# Spring → MVC (REST API)

## 1. @RestController

Annotation cốt lõi để xây dựng REST API.

```java
@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    // Trả về JSON tự động, tương đương @ResponseBody trên mỗi method
    @GetMapping("/{id}")
    public User getUser(@PathVariable Long id) {
        return userService.findById(id);
    }
}
```

So sánh `@RestController` vs `@Controller`:

| Annotation | Trả về | Cần @ResponseBody |
|-----------|--------|-------------------|
| `@Controller` | View (HTML) | Có |
| `@RestController` | JSON/XML | Mặc định |

## 2. Request Mapping

### 2.1. HTTP Methods

```java
@GetMapping("/users")           // Lấy danh sách/tìm kiếm
@PostMapping("/users")          // Tạo mới
@PutMapping("/users/{id}")      // Cập nhật toàn phần
@PatchMapping("/users/{id}")    // Cập nhật từng phần
@DeleteMapping("/users/{id}")   // Xóa

// Hoặc dùng @RequestMapping với method cụ thể
@RequestMapping(value = "/users", method = RequestMethod.GET)
```

### 2.2. Path Variables & Request Params

```java
// Path variable
@GetMapping("/users/{id}")
public User getUser(@PathVariable("id") Long id) {
    return userService.findById(id);
}

// Query params
@GetMapping("/users")
public Page<User> searchUsers(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(required = false) String status) {
    return userService.search(status, page, size);
}

// Multiple path vars
@GetMapping("/companies/{companyId}/departments/{deptId}/employees")
public List<Employee> getEmployees(
        @PathVariable Long companyId,
        @PathVariable Long deptId) { }
```

### 2.3. Request Body & Headers

```java
@PostMapping("/users")
public ResponseEntity<User> createUser(
        @Valid @RequestBody CreateUserRequest request,
        @RequestHeader("X-Request-Id") String requestId) {

    User user = userService.create(request);
    return ResponseEntity
        .created(URI.create("/api/users/" + user.getId()))
        .body(user);
}

// Cookie
@GetMapping("/orders")
public List<Order> getOrders(@CookieValue("session_id") String sessionId) { }
```

## 3. Content Negotiation

Tự động trả về JSON hoặc XML dựa trên `Accept` header.

```xml
<!-- Thêm dependency để hỗ trợ XML -->
<dependency>
    <groupId>com.fasterxml.jackson.dataformat</groupId>
    <artifactId>jackson-dataformat-xml</artifactId>
</dependency>
```

```properties
# Chỉ định format mặc định
spring.mvc.contentnegotiation.favor-parameter=true
spring.mvc.contentnegotiation.media-types.xml=application/xml
```

```bash
curl -H "Accept: application/json" /api/users/1   # JSON response
curl -H "Accept: application/xml"  /api/users/1   # XML response
```

## 4. Exception Handling

### 4.1. @RestControllerAdvice

Xử lý lỗi tập trung, trả về JSON nhất quán.

```java
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(NotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ErrorResponse handleNotFound(NotFoundException ex) {
        return new ErrorResponse("NOT_FOUND", ex.getMessage());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleValidation(MethodArgumentNotValidException ex) {
        List<String> errors = ex.getBindingResult()
            .getFieldErrors()
            .stream()
            .map(e -> e.getField() + ": " + e.getDefaultMessage())
            .toList();
        return new ErrorResponse("VALIDATION_ERROR", String.join("; ", errors));
    }

    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ErrorResponse handleGeneral(Exception ex) {
        return new ErrorResponse("INTERNAL_ERROR", "Something went wrong");
    }
}
```

### 4.2. Error Response Format

```java
public record ErrorResponse(
    String code,
    String message,
    LocalDateTime timestamp,
    String path,
    Map<String, String> details
) {
    public ErrorResponse(String code, String message) {
        this(code, message, LocalDateTime.now(), null, null);
    }
}
```

## 5. Validation

### 5.1. DTO với Constraints

```java
public class CreateUserRequest {

    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 50)
    private String name;

    @NotBlank
    @Email
    private String email;

    @NotNull
    @Min(18)
    @Max(100)
    private Integer age;

    @Pattern(regexp = "\\d{10,11}")
    private String phone;
}
```

### 5.2. Các Annotation phổ biến

| Annotation | Kiểm tra |
|-----------|--------|
| `@NotNull` | Không null |
| `@NotBlank` | Không null, không empty string, không chỉ whitespace |
| `@NotEmpty` | Không null, không empty collection |
| `@Email` | Định dạng email hợp lệ |
| `@Min`, `@Max` | Giá trị số tối thiểu/tối đa |
| `@Size` | Độ dài string/collection |
| `@Pattern` | Regex pattern |
| `@Positive`, `@Negative` | Số dương/âm |
| `@Past`, `@Future` | Thời gian trong quá khứ/tương lai |

### 5.3. Custom Validator

```java
// Annotation
@Target({FIELD})
@Retention(RUNTIME)
@Constraint(validatedBy = StrongPasswordValidator.class)
public @interface StrongPassword {
    String message() default "Password must be strong";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}

// Validator
public class StrongPasswordValidator
        implements ConstraintValidator<StrongPassword, String> {

    @Override
    public boolean isValid(String value, ConstraintValidatorContext ctx) {
        if (value == null) return false;
        return value.matches(".*[A-Z].*")   // Có chữ hoa
            && value.matches(".*[a-z].*")   // Có chữ thường
            && value.matches(".*\\d.*")     // Có số
            && value.matches(".*[!@#$].*")  // Có ký tự đặc biệt
            && value.length() >= 8;
    }
}
```

## 6. HTTP Status Codes

| Status | Dùng khi |
|--------|---------|
| **200 OK** | GET thành công, PUT/PATCH cập nhật |
| **201 Created** | POST tạo resource mới |
| **204 No Content** | DELETE thành công (không trả body) |
| **400 Bad Request** | Validation lỗi, request không hợp lệ |
| **401 Unauthorized** | Chưa đăng nhập |
| **403 Forbidden** | Không có quyền truy cập |
| **404 Not Found** | Resource không tồn tại |
| **409 Conflict** | Trùng lặp resource |
| **500 Internal Server Error** | Lỗi phía server |

```java
@PostMapping("/users")
public ResponseEntity<User> create(@Valid @RequestBody CreateUserRequest req) {
    User user = userService.create(req);
    return ResponseEntity.status(HttpStatus.CREATED).body(user);
}

@DeleteMapping("/users/{id}")
public ResponseEntity<Void> delete(@PathVariable Long id) {
    userService.delete(id);
    return ResponseEntity.noContent().build();
}
```

## 7. REST Best Practices

### 7.1. URL Naming

```
✅ GET    /api/users           // Danh sách users (dùng danh từ số nhiều)
✅ GET    /api/users/123       // User cụ thể
✅ POST   /api/users           // Tạo user mới
✅ PUT    /api/users/123       // Cập nhật user
✅ DELETE /api/users/123       // Xóa user
✅ GET    /api/users/123/orders // Orders của user

❌ GET    /api/getUsers        // Dùng động từ
❌ POST   /api/createUser      // Dùng động từ
❌ GET    /api/user/123        // Không nhất quán số nhiều
```

### 7.2. Versioning

```java
// Header versioning
@GetMapping(value = "/users", headers = "X-API-Version=1")

// URL versioning (phổ biến nhất)
@RequestMapping("/api/v1/users")
public class UserControllerV1 { }

@RequestMapping("/api/v2/users")
public class UserControllerV2 { }
```

### 7.3. Filtering & Field Selection

```java
@GetMapping("/users")
public List<User> getUsers(
        @RequestParam(required = false) String status,
        @RequestParam(defaultValue = "id,name,email") String fields) {
    // fields=id,name,email — chỉ trả các trường cần thiết
    return userService.findAll(status, fields);
}
```

## 8. Pagination Response

```java
// Page<User> → chuyển sang DTO
public record PageResponse<T>(
    List<T> content,
    int page,
    int size,
    long totalElements,
    int totalPages,
    boolean first,
    boolean last
) {
    public static <T> PageResponse<T> from(Page<T> page) {
        return new PageResponse<>(
            page.getContent(),
            page.getNumber(),
            page.getSize(),
            page.getTotalElements(),
            page.getTotalPages(),
            page.isFirst(),
            page.isLast()
        );
    }
}

@GetMapping("/users")
public PageResponse<UserDto> getUsers(Pageable pageable) {
    Page<User> page = userService.findAll(pageable);
    return PageResponse.from(page.map(UserDto::fromEntity));
}
```

## 9. File Upload/Download

```java
// Upload
@PostMapping("/upload")
public ResponseEntity<String> upload(@RequestParam("file") MultipartFile file) {
    String path = fileStorageService.store(file);
    return ResponseEntity.ok(path);
}

// Download
@GetMapping("/files/{filename}")
public ResponseEntity<Resource> download(@PathVariable String filename) {
    Resource file = fileStorageService.load(filename);
    return ResponseEntity.ok()
        .contentType(MediaType.APPLICATION_OCTET_STREAM)
        .header(HttpHeaders.CONTENT_DISPOSITION,
            "attachment; filename=\"" + file.getFilename() + "\"")
        .body(file);
}
```

## 10. REST Security Basics

```java
// Chặn truy cập API từ trình duyệt (chống CSRF cho stateless REST)
@Configuration
public class SecurityConfig {
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/public/**").permitAll()
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            );
        return http.build();
    }
}
```
