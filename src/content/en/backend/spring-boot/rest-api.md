# Spring MVC (REST API)

## 1. @RestController

Combines `@Controller` and `@ResponseBody` — returns JSON/XML instead of view names.

```java
@RestController
@RequestMapping("/api/users")
public class UserController {

    @GetMapping("/{id}")
    public User getUser(@PathVariable Long id) {
        return userService.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public User createUser(@RequestBody @Valid UserDto dto) {
        return userService.create(dto);
    }

    @PutMapping("/{id}")
    public User updateUser(@PathVariable Long id, @RequestBody @Valid UserDto dto) {
        return userService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteUser(@PathVariable Long id) {
        userService.delete(id);
    }
}
```

## 2. Request Mapping

| Annotation | HTTP Method |
|-----------|------------|
| `@GetMapping` | GET |
| `@PostMapping` | POST |
| `@PutMapping` | PUT |
| `@PatchMapping` | PATCH |
| `@DeleteMapping` | DELETE |

### 2.1. Path Variables & Query Params

```java
@GetMapping("/users/{id}")                    // /users/123
public User getUser(@PathVariable Long id) { }

@GetMapping("/users")                         // /users?status=ACTIVE&page=0
public Page<User> getUsers(
    @RequestParam(required = false) String status,
    @RequestParam(defaultValue = "0") int page) { }

@PostMapping("/users/{id}/roles/{roleId}")
public void addRole(
    @PathVariable Long id,
    @PathVariable Long roleId) { }

// Multiple values
@GetMapping("/users")
public List<User> getUsers(@RequestParam List<Long> ids) {
    // /users?ids=1,2,3
}
```

### 2.2. Request Body & Headers

```java
@PostMapping
public User create(@RequestBody @Valid UserDto dto) {
    // @Valid triggers Bean Validation
}

@GetMapping
public List<User> getUsers(
    @RequestHeader("Authorization") String auth,
    @RequestHeader(value = "X-Custom", required = false) String custom) { }

// Cookie
@GetMapping
public void doSomething(@CookieValue("session") String sessionId) { }
```

## 3. Content Negotiation

Auto-selects response format based on `Accept` header.

```properties
# application.properties
spring.mvc.contentnegotiation.favor-parameter=true
spring.mvc.contentnegotiation.media-types.json=application/json
spring.mvc.contentnegotiation.media-types.xml=application/xml
```

```bash
curl -H "Accept: application/json" /api/users   # Returns JSON
curl -H "Accept: application/xml" /api/users   # Returns XML
curl "/api/users?format=xml"                   # With parameter
```

Add XML support:
```xml
<dependency>
    <groupId>com.fasterxml.jackson.dataformat</groupId>
    <artifactId>jackson-dataformat-xml</artifactId>
</dependency>
```

## 4. Exception Handling

### 4.1. @RestControllerAdvice

Centralized exception handling returning standard error responses.

```java
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(NotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ErrorResponse handleNotFound(NotFoundException ex) {
        return new ErrorResponse("NOT_FOUND", ex.getMessage());
    }

    @ExceptionHandler(ValidationException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleValidation(ValidationException ex) {
        return new ErrorResponse("VALIDATION_ERROR", ex.getMessage());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleMethodArgumentNotValid(
            MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error ->
            errors.put(error.getField(), error.getDefaultMessage()));
        return new ErrorResponse("VALIDATION_ERROR", "Invalid input", errors);
    }

    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ErrorResponse handleGeneric(Exception ex) {
        return new ErrorResponse("INTERNAL_ERROR", "Something went wrong");
    }
}

// Standard error response format
public record ErrorResponse(String code, String message) { }
public record ErrorResponse(String code, String message, Map<String, String> errors) { }
```

## 5. Validation

### 5.1. Bean Validation Constraints

```java
public class UserDto {
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

    @Pattern(regexp = "\\d{10,12}")
    private String phone;

    @Past
    private LocalDate birthDate;

    @AssertTrue(message = "Terms must be accepted")
    private boolean termsAccepted;
}
```

### 5.2. Validation Groups

```java
// Define groups
public interface OnCreate { }
public interface OnUpdate { }

// Use in DTO
public class UserDto {
    @NotBlank(groups = OnCreate.class)  // Required only on create
    private String name;

    @Email(groups = OnCreate.class)
    private String email;
}

// Use in Controller
public User create(@RequestBody @Validated(OnCreate.class) UserDto dto) { }
public User update(@PathVariable Long id,
                   @RequestBody @Validated(OnUpdate.class) UserDto dto) { }
```

## 6. HTTP Status Codes

| Status | When to Use |
|--------|------------|
| **200 OK** | Successful GET, PUT, PATCH |
| **201 Created** | Successful POST creating resource |
| **204 No Content** | Successful DELETE, POST returning nothing |
| **400 Bad Request** | Invalid input, validation failure |
| **401 Unauthorized** | Not authenticated |
| **403 Forbidden** | Authenticated but no permission |
| **404 Not Found** | Resource not found |
| **409 Conflict** | Duplicate resource, version conflict |
| **422 Unprocessable Entity** | Valid format but semantic errors |
| **500 Internal Server Error** | Server-side error |

## 7. REST Best Practices

```
GET    /api/users          — List users
GET    /api/users/{id}    — Get single user
POST   /api/users          — Create user
PUT    /api/users/{id}    — Full update
PATCH  /api/users/{id}    — Partial update
DELETE /api/users/{id}    — Delete user

GET    /api/users/{id}/orders        — Get user's orders
POST   /api/users/{id}/orders        — Add order to user
```

### 7.1. Pagination Response

```json
{
  "content": [...],
  "pageable": { "pageNumber": 0, "pageSize": 20 },
  "totalElements": 100,
  "totalPages": 5,
  "last": false,
  "first": true,
  "numberOfElements": 20,
  "empty": false
}
```

### 7.2. Error Response

```json
{
  "code": "VALIDATION_ERROR",
  "message": "Invalid input",
  "errors": {
    "email": "must be a valid email",
    "age": "must be at least 18"
  },
  "timestamp": "2024-01-15T10:30:00Z",
  "path": "/api/users"
}
```
