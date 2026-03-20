# Spring Boot - Kiến thức cơ bản

## 1. Tổng quan

**Spring Boot** là framework được xây dựng trên **Spring Framework**, giúp tạo ứng dụng sản xuất (production-ready) nhanh chóng với cơ chế **auto-configuration**. Mục tiêu chính là giảm thiểu cấu hình thủ công, cho phép lập trình viên tập trung vào logic nghiệp vụ.

### 1.1. Tính năng chính

| Tính năng | Mô tả |
|-----------|--------|
| **Auto-configuration** | Tự động cấu hình beans dựa trên classpath dependencies |
| **Starter Dependencies** | Các gói dependency đóng gói sẵn theo use case |
| **Embedded Server** | Chạy ứng dụng với Tomcat, Jetty hoặc Undertow tích hợp |
| **Production-ready** | Tích hợp Actuator, health checks, metrics |
| **Convention over Configuration** | Cấu hình mặc định hợp lý, tối thiểu hóa config thủ công |

---

## 2. @SpringBootApplication

Annotation chính, kết hợp ba annotation nền tảng:

```java
@SpringBootApplication  // = @Configuration + @EnableAutoConfiguration + @ComponentScan
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
```

| Annotation | Mục đích |
|-----------|-----------|
| `@Configuration` | Đánh dấu class là nguồn định nghĩa beans cho IoC Container |
| `@EnableAutoConfiguration` | Bật cơ chế auto-configuration của Spring Boot |
| `@ComponentScan` | Quét và đăng ký các components, configurations, services |

> **Lưu ý**: `@SpringBootApplication` có tham số `scanBasePackages` để chỉ định package gốc cần quét.

---

## 3. Auto-configuration

Spring Boot tự động cấu hình beans dựa trên các dependency có trong classpath. Quá trình này diễn ra theo thứ tự:

1. **Load** các auto-configuration classes từ `META-INF/spring.factories`
2. **Kiểm tra** điều kiện (`@ConditionalOnClass`, `@ConditionalOnProperty`, ...)
3. **Áp dụng** cấu hình nếu điều kiện thỏa mãn

```properties
# Loại trừ auto-configuration cụ thể
spring.autoconfigure.exclude=\
  org.springframework.boot.autoconfigure.data.redis.RedisAutoConfiguration,\
  org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration
```

| Dependency | Được auto-configure |
|-----------|-------------------|
| `spring-boot-starter-web` | Tomcat, DispatcherServlet, Jackson JSON |
| `spring-boot-starter-data-jpa` | JPA, DataSource, EntityManagerFactory |
| `spring-boot-starter-data-redis` | Redis connection factory, RedisTemplate |
| `spring-boot-starter-security` | Security filter chain, default security rules |
| `spring-boot-starter-validation` | Bean validation (Hibernate Validator) |
| `spring-boot-starter-data-mongodb` | MongoDB, MongoClient |

### 3.1. Custom Auto-configuration

```java
@Configuration
@ConditionalOnClass(DataSource.class)
@ConditionalOnProperty(name = "app.datasource.enabled", havingValue = "true", matchIfMissing = true)
public class CustomDataSourceAutoConfiguration {

    @Bean
    @ConditionalOnMissingBean
    public DataSource customDataSource() {
        // custom logic
        return new HikariDataSource();
    }
}
```

---

## 4. Starter Dependencies

Starter là các gói dependency được **đóng gói sẵn** cho các use case phổ biến. Mỗi starter bao gồm tất cả dependency cần thiết và tự động được auto-configure.

```xml
<!-- 1. Web application -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>

<!-- 2. JPA / Database -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>

<!-- 3. Security -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>

<!-- 4. Validation -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-validation</artifactId>
</dependency>

<!-- 5. Actuator (monitoring) -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>

<!-- 6. Test -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-test</artifactId>
</dependency>

<!-- 7. Cache -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-cache</artifactId>
</dependency>

<!-- 8. OAuth2 Resource Server -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-oauth2-resource-server</artifactId>
</dependency>
```

### 4.1. Các loại Starter

| Loại | Prefix | Ví dụ |
|------|--------|-------|
| **Official starters** | `spring-boot-starter-*` | web, data-jpa, security |
| **Production starters** | `spring-boot-starter-actuator` | monitoring, health checks |
| **Technical starters** | `spring-boot-starter-*` | tomcat, jetty, undertow |

---

## 5. Externalized Configuration

Spring Boot hỗ trợ nhiều nguồn cấu hình với thứ tự ưu tiên từ cao đến thấp.

### 5.1. Các file cấu hình

| File | Format | Độ ưu tiên | Mô tả |
|------|--------|------------|-------|
| `application.properties` | Key=value | Mặc định | Cấu hình chính |
| `application.yml` | YAML (nested) | Override `.properties` | Cấu hình chính |
| `application-{profile}.properties` | Profile-specific | Override default | Theo môi trường |

**application.properties:**
```properties
# Server
server.port=8080
server.servlet.context-path=/api

# Application
spring.application.name=my-app

# Logging
logging.level.root=INFO
logging.level.org.springframework=DEBUG
logging.pattern.console=%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{36} - %msg%n

# DataSource
spring.datasource.url=jdbc:postgresql://localhost:5432/mydb
spring.datasource.username=admin
spring.datasource.password=secret
spring.datasource.driver-class-name=org.postgresql.Driver

# JPA
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true

# Jackson
spring.jackson.serialization.write-dates-as-timestamps=false
spring.jackson.default-property-inclusion=non_null
```

**application.yml:**
```yaml
# application.yml
server:
  port: 8080
  servlet:
    context-path: /api

spring:
  application:
    name: my-app

logging:
  level:
    root: INFO
    org.springframework: DEBUG
  pattern:
    console: "%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{36} - %msg%n"

# Cấu hình theo môi trường (dev, prod, staging)
---
spring:
  config:
    activate:
      on-profile: dev
  datasource:
    url: jdbc:h2:mem:devdb
    driver-class-name: org.h2.Driver
  jpa:
    hibernate:
      ddl-auto: create-drop
  h2:
    console:
      enabled: true

---
spring:
  config:
    activate:
      on-profile: prod
  datasource:
    url: jdbc:postgresql://prod-server:5432/mydb
    hikari:
      maximum-pool-size: 20
      minimum-idle: 5
  jpa:
    hibernate:
      ddl-auto: validate
  logging:
    level:
      root: WARN
      com.example: INFO
```

### 5.2. Environment Variables & CLI Arguments

```bash
# Environment variable (snake_case hoặc SCREAMING_SNAKE_CASE)
SERVER_PORT=9000 java -jar app.jar
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost/mydb java -jar app.jar

# Command line argument
java -jar app.jar --server.port=9000 --spring.profiles.active=prod

# Random port cho testing
server.port=${random.int(8000, 9999)}
```

### 5.3. @ConfigurationProperties

Bind properties vào typed object với validation:

```java
// AppProperties.java
@ConfigurationProperties(prefix = "app")
@Validated
public class AppProperties {

    @NotBlank
    private String name;

    @Min(1)
    @Max(10000)
    private int maxUsers = 100;

    private List<String> allowedOrigins = new ArrayList<>();

    private MailProperties mail = new MailProperties();

    // Getters & Setters (hoặc dùng Lombok @Data)
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public int getMaxUsers() { return maxUsers; }
    public void setMaxUsers(int maxUsers) { this.maxUsers = maxUsers; }
    public List<String> getAllowedOrigins() { return allowedOrigins; }
    public void setAllowedOrigins(List<String> allowedOrigins) { this.allowedOrigins = allowedOrigins; }
    public MailProperties getMail() { return mail; }
    public void setMail(MailProperties mail) { this.mail = mail; }

    public static class MailProperties {
        private String host = "localhost";
        private int port = 587;

        public String getHost() { return host; }
        public void setHost(String host) { this.host = host; }
        public int getPort() { return port; }
        public void setPort(int port) { this.port = port; }
    }
}
```

```java
// Kích hoạt trong main class hoặc config class
@EnableConfigurationProperties(AppProperties.class)
@SpringBootApplication
public class Application { }
```

```yaml
# application.yml
app:
  name: My Application
  max-users: 1000
  allowed-origins:
    - https://example.com
    - https://app.example.com
  mail:
    host: smtp.gmail.com
    port: 587
```

### 5.4. @Value Annotation

Dùng cho các giá trị đơn lẻ:

```java
@Value("${app.name:Default App}")
private String appName;

@Value("${app.max-users:100}")
private int maxUsers;

@Value("${app.features.enabled:false}")
private boolean featureEnabled;

// SpEL expression
@Value("#{systemProperties['user.region'] ?: 'VN'}")
private String region;
```

---

## 6. Profiles

Profiles cho phép tách biệt cấu hình theo môi trường (dev, test, staging, prod).

```java
// Kích hoạt profile trong test
@ActiveProfile("dev")
@SpringBootTest
class UserServiceTest { }
```

```bash
# Kích hoạt khi chạy
java -jar app.jar --spring.profiles.active=prod

# Multiple profiles
java -jar app.jar --spring.profiles.active=prod,secure
```

### 6.1. Profile-specific Configuration Files

```
src/main/resources/
├── application.yml           # Default
├── application-dev.yml       # Development
├── application-staging.yml   # Staging
└── application-prod.yml      # Production
```

### 6.2. @Profile Annotation

Chỉ đăng ký bean khi profile active:

```java
@Profile("dev")
@Configuration
public class DevDatabaseConfig {
    @Bean
    public DataSource devDataSource() {
        return new EmbeddedDatabaseBuilder()
            .setType(EmbeddedDatabaseType.H2)
            .build();
    }
}

@Profile("prod")
@Configuration
public class ProdDatabaseConfig {
    @Bean
    public DataSource prodDataSource() {
        HikariDataSource ds = new HikariDataSource();
        ds.setJdbcUrl("jdbc:postgresql://prod-server:5432/mydb");
        ds.setUsername("admin");
        ds.setPassword("secret");
        return ds;
    }
}
```

---

## 7. Banner

Tùy chỉnh banner khởi động trong `src/main/resources/banner.txt`:

```
 _____           _        ____                  _
|_   _|__   ___ | | __   |  _ \ ___  __ _  _ __| |_ _   _
  | |/ _ \ / _ \| |/ /   | |_) / _ \/ _` || '__| __| | | |
  | | (_) | (_) |   <    |  _ <  __/ (_| || |  | |_| |_| |
  |_|\___/ \___/|_|\_\   |_| \_\___|\__,_||_|   \__|\__, |
                                                     |___/
:: Spring Boot ::        (v${spring-boot.formatted-version})
```

### 7.1. Tắt banner

```java
SpringApplication app = new SpringApplication(MyApp.class);
app.setBannerMode(Banner.Mode.OFF);
app.run(args);
```

```properties
# Hoặc trong properties
spring.main.banner-mode=off
```

---

## 8. SpringApplication Run Flow

```
main(String[] args)
    │
    ├── createApplicationContext()    // Tạo context
    │
    ├── prepareContext()               // Load environment, profiles
    │
    ├── refreshContext()               // KHỞI TẠO BEANS
    │       │
    │       ├── ComponentScan
    │       ├── AutoConfiguration
    │       ├── PropertySources
    │       └── BeanFactoryPostProcessor
    │
    ├── afterRefresh()                 // Gọi ApplicationRunner/CommandLineRunner
    │
    └── return context                 // Ứng dụng đã sẵn sàng
```

```java
// CommandLineRunner — chạy sau khi Spring context sẵn sàng
@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Override
    public void run(String... args) {
        if (userRepository.count() == 0) {
            userRepository.save(new User("admin", "admin@example.com"));
            System.out.println("Initial data created");
        }
    }
}

// ApplicationRunner — tương tự nhưng nhận ApplicationArguments
@Component
public class StartupRunner implements ApplicationRunner {

    @Override
    public void run(ApplicationArguments args) {
        System.out.println("Options: " + args.getOptionNames());
    }
}
```

---

## 9. Các annotation quan trọng thường dùng

| Annotation | Mô tả |
|-----------|--------|
| `@SpringBootApplication` | Main annotation — kết hợp 3 annotation nền tảng |
| `@ComponentScan` | Quét các class có `@Component`, `@Service`, `@Repository`, `@Controller` |
| `@Configuration` | Định nghĩa beans thủ công (thay vì `@Component`) |
| `@Bean` | Khai báo bean từ method trong `@Configuration` |
| `@ConfigurationProperties` | Bind external properties vào object |
| `@EnableConfigurationProperties` | Kích hoạt `@ConfigurationProperties` |
| `@PropertySource` | Load file properties vào Environment |
| `@Profile` | Chỉ active khi profile được bật |
| `@Conditional` | Chỉ đăng ký bean khi điều kiện thỏa mãn |
| `@Lazy` | Lazy initialization của bean |
| `@Primary` | Bean ưu tiên khi có nhiều bean cùng loại |

---

## 10. Common Use Cases

### 10.1. Tạo REST Controller nhanh

```java
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/{id}")
    public ResponseEntity<UserDto> getUser(@PathVariable Long id) {
        return userService.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<UserDto> createUser(@Valid @RequestBody CreateUserRequest request) {
        UserDto created = userService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
}
```

### 10.2. Exception Handling toàn cục

```java
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(ResourceNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(new ErrorResponse("NOT_FOUND", ex.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException ex) {
        String errors = ex.getBindingResult().getFieldErrors().stream()
            .map(e -> e.getField() + ": " + e.getDefaultMessage())
            .collect(Collectors.joining(", "));
        return ResponseEntity.badRequest()
            .body(new ErrorResponse("VALIDATION_ERROR", errors));
    }

    public record ErrorResponse(String code, String message) {}
}
```
