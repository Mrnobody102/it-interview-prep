# Spring MVC (REST API)

## 1. `@RestController`

`@RestController` combines `@Controller` and `@ResponseBody`, so methods return JSON or XML instead of view names.

```java
@RestController
@RequestMapping("/api/users")
public class UserController {

    @GetMapping("/{id}")
    public UserDto getUser(@PathVariable Long id) {
        return userService.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public UserDto createUser(@RequestBody @Valid CreateUserRequest dto) {
        return userService.create(dto);
    }
}
```

## 2. Request Mapping

### 2.1. HTTP methods

| Annotation | HTTP Method |
|---|---|
| `@GetMapping` | GET |
| `@PostMapping` | POST |
| `@PutMapping` | PUT |
| `@PatchMapping` | PATCH |
| `@DeleteMapping` | DELETE |

### 2.2. Path variables and request params

```java
@GetMapping("/{id}")
public UserDto getUser(@PathVariable Long id) { }

@GetMapping
public Page<UserDto> getUsers(
    @RequestParam(required = false) String status,
    @RequestParam(defaultValue = "0") int page,
    @RequestParam(defaultValue = "20") int size) { }
```

### 2.3. Request body and headers

```java
@PostMapping
public UserDto create(@RequestBody @Valid CreateUserRequest dto) { }

@GetMapping("/profile")
public UserProfile getProfile(
    @RequestHeader("Authorization") String authHeader,
    @RequestHeader(value = "X-Trace-Id", required = false) String traceId) { }
```

## 3. Content Negotiation

Spring MVC can negotiate content type based on headers, converters, and config.

```properties
spring.mvc.contentnegotiation.favor-parameter=true
spring.mvc.contentnegotiation.media-types.json=application/json
spring.mvc.contentnegotiation.media-types.xml=application/xml
```

```bash
curl -H "Accept: application/json" http://localhost:8080/api/users
curl -H "Accept: application/xml" http://localhost:8080/api/users
```

## 4. Exception Handling

### 4.1. `@RestControllerAdvice`

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
        return new ErrorResponse("VALIDATION_ERROR", "Invalid input");
    }
}
```

### 4.2. Error response format

```json
{
  "code": "VALIDATION_ERROR",
  "message": "Invalid input",
  "errors": {
    "email": "must be a valid email"
  },
  "timestamp": "2026-04-22T10:30:00Z",
  "path": "/api/users"
}
```

A consistent error contract matters more than the exact JSON shape.

## 5. Validation

### 5.1. DTO with constraints

```java
public class CreateUserRequest {

    @NotBlank
    @Size(min = 2, max = 50)
    private String name;

    @NotBlank
    @Email
    private String email;

    @Min(18)
    @Max(100)
    private Integer age;
}
```

### 5.2. Common annotations

Common validation annotations:

- `@NotNull`
- `@NotBlank`
- `@Size`
- `@Email`
- `@Min`
- `@Max`
- `@Pattern`
- `@Past`
- `@Future`

### 5.3. Custom validator

```java
@Target({ ElementType.FIELD })
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = CompanyEmailValidator.class)
public @interface CompanyEmail {
    String message() default "email must belong to company domain";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
```

Custom validation is useful when rules are domain-specific and reused across multiple DTOs.

## 6. HTTP Status Codes

| Status | Typical usage |
|---|---|
| `200 OK` | Successful read/update |
| `201 Created` | Resource created |
| `204 No Content` | Successful delete |
| `400 Bad Request` | Invalid input |
| `401 Unauthorized` | Not authenticated |
| `403 Forbidden` | No permission |
| `404 Not Found` | Resource missing |
| `409 Conflict` | Duplicate or version conflict |
| `500 Internal Server Error` | Unexpected server failure |

## 7. REST Best Practices

### 7.1. URL naming

Prefer:

- nouns over verbs
- plural resource names
- consistent nesting only when ownership is real

Examples:

- `GET /api/users`
- `GET /api/users/{id}`
- `GET /api/users/{id}/orders`

### 7.2. Versioning

Common options:

- URI versioning: `/api/v1/users`
- header versioning
- media type versioning

URI versioning is usually the simplest for interview prep and small-to-medium systems.

### 7.3. Filtering and field selection

Useful patterns:

- `GET /api/users?status=ACTIVE`
- `GET /api/users?sort=createdAt,desc`
- `GET /api/users?fields=id,name,email`

Only expose field selection if the API really needs it.

## 8. Pagination Response

```json
{
  "content": [],
  "page": 0,
  "size": 20,
  "totalElements": 125,
  "totalPages": 7,
  "hasNext": true
}
```

Good pagination responses should make client navigation obvious without leaking framework internals unnecessarily.

## 9. File Upload/Download

```java
@PostMapping("/avatar")
public ResponseEntity<Void> upload(@RequestParam("file") MultipartFile file) {
    storageService.store(file);
    return ResponseEntity.accepted().build();
}

@GetMapping("/files/{id}")
public ResponseEntity<Resource> download(@PathVariable String id) {
    Resource resource = storageService.load(id);
    return ResponseEntity.ok()
        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=data.pdf")
        .body(resource);
}
```

This area often needs:

- size limits
- content-type validation
- antivirus scanning
- object storage integration

## 10. REST Security Basics

Even a well-designed controller layer is unsafe without basic API security discipline.

Baseline concerns:

- authentication
- authorization
- input validation
- CORS policy
- rate limiting
- audit logging
- sensitive data redaction

REST design and security should not be treated as separate topics in production systems.

## 11. Common interview questions

### 11.1. When should you return `201 Created` instead of `200 OK`?

Return `201 Created` when the request creates a new resource and the server can identify it, often with a `Location` header.

### 11.2. What is the difference between `@RequestBody` and `@ModelAttribute`?

`@RequestBody` binds structured payloads such as JSON. `@ModelAttribute` is commonly used for form-style parameters or query and form binding.

### 11.3. Why should pagination be part of REST design early?

Because collection endpoints often grow quickly. Pagination, sorting, and filtering conventions are much harder to retrofit after clients depend on the first version.
