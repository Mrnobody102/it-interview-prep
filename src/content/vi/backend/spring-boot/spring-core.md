# Spring Core - IoC, DI và Spring Bean

## 1. Tổng quan

**Spring Core** là phần lõi nền tảng của Spring Framework, bao gồm các khái niệm và cơ chế quan trọng nhất: **IoC (Inversion of Control)**, **DI (Dependency Injection)**, **Bean Lifecycle** và **AOP**. Nắm vững Spring Core là điều kiện tiên quyết để hiểu mọi module khác của Spring.

---

## 2. IoC (Inversion of Control)

### 2.1. Khái niệm

**IoC (Inversion of Control)** — Đảo ngược quyền điều khiển luồng chương trình. Thay vì lập trình viên tự quản lý vòng đời và phụ thuộc của đối tượng bằng `new`, thì **IoC Container** (Spring Container) sẽ đảm nhiệm việc đó.

> Nói cách khác: **"Don't call us, we'll call you."** — Framework gọi code của lập trình viên, chứ không phải ngược lại.

### 2.2. Lợi ích của IoC

- **Giảm coupling** giữa các đối tượng — các class không phụ thuộc trực tiếp vào implementation cụ thể
- **Dễ kiểm thử** — phụ thuộc có thể dễ dàng mock hoặc thay thế
- **Dễ bảo trì** — thay đổi implementation không ảnh hưởng nhiều đến các class khác
- **Quản lý phụ thuộc tập trung** — IoC Container kiểm soát toàn bộ lifecycle của beans
- **Tái sử dụng cao** — các component có thể dùng lại trong nhiều ngữ cảnh khác nhau

### 2.3. Hai loại IoC Container

| Loại | Mô tả |
|------|-------|
| **BeanFactory** | Interface cơ bản, nhẹ, lazy loading |
| **ApplicationContext** | Mở rộng BeanFactory, eager loading, nhiều tính năng hơn (mặc định trong Spring Boot) |

---

## 3. DI (Dependency Injection)

### 3.1. Khái niệm

**DI (Dependency Injection)** là cơ chế cụ thể để implement IoC: các phụ thuộc được **tiêm (inject)** bởi IoC Container thay vì đối tượng tự tạo bằng `new`.

```java
// ❌ Không có DI — tight coupling, khó test
public class UserService {
    private UserRepository userRepository = new MySQLUserRepository();
    // muốn đổi sang MongoDB? phải sửa class này
}

// ✅ Có DI — loose coupling, dễ test
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    // MongoDB, MySQL, mock — tất cả đều hoạt động
}
```

### 3.2. Ba loại Injection

| Loại | Annotation | Mô tả | Khuyến nghị |
|------|-----------|--------|-------------|
| **Constructor Injection** | `@Autowired` trên constructor | Phụ thuộc qua constructor, được tiêm khi tạo bean | **Ưu tiên số 1** — immutable |
| **Setter Injection** | `@Autowired` trên setter | Phụ thuộc qua setter | Chỉ dùng khi phụ thuộc là **tùy chọn** |
| **Field Injection** | `@Autowired` trên field | Inject trực tiếp vào field | **Không nên dùng** — khó test |

#### Constructor Injection (Khuyến nghị)

```java
// ✅ Tiêm qua constructor — đây là cách tốt nhất
@Service
public class UserService {
    private final UserRepository userRepository;
    private final EmailService emailService;

    // Spring tự động tiêm qua constructor (từ Spring 4.3 không cần @Autowired)
    public UserService(UserRepository userRepository, EmailService emailService) {
        this.userRepository = userRepository;
        this.emailService = emailService;
    }
}

// ✅ Với Lombok — code ngắn gọn hơn
@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final EmailService emailService;
}
```

#### Setter Injection

```java
// ⚠️ Tiêm qua setter — chỉ dùng khi cần optional dependency
@Service
public class NotificationService {
    private SmsService smsService;

    @Autowired(required = false)
    public void setSmsService(SmsService smsService) {
        this.smsService = smsService;
    }
}
```

#### Field Injection (Tránh dùng)

```java
// ❌ Tiêm trực tiếp vào field — KHÔNG NÊN dùng
@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;  // Khó test, không immutable
}
```

### 3.3. So sánh chi tiết ba loại Injection

| Tiêu chí | Constructor | Setter | Field |
|----------|------------|--------|-------|
| **Immutability** | ✅ Final field | ❌ Có thể thay đổi | ❌ |
| **Testability** | ✅ Dễ mock | ✅ Có thể mock | ⚠️ Cần reflection/framework |
| **Optional dependency** | ⚠️ Cần @Nullable | ✅ Dễ xử lý | ✅ |
| **Circular dependency** | ⚠️ Có thể xảy ra | ✅ Tránh được | ❌ |
| **Visibility of dependencies** | ✅ Rõ ràng ngay constructor | ⚠️ Ẩn trong code | ❌ |
| **Circular dependency detection** | ✅ Phát hiện sớm lúc build | ⚠️ Chỉ phát hiện lúc runtime | ❌ |

---

## 4. Vòng đời Bean (Bean Lifecycle)

### 4.1. Lifecycle Flow

```
1. Instantiate Bean
         │
         ▼
2. Populate Properties (Setter Injection)
         │
         ▼
3. BeanNameAware.setBeanName()
         │
         ▼
4. BeanFactoryAware.setBeanFactory()
         │
         ▼
5. ApplicationContextAware.setApplicationContext()
         │
         ▼
6. @PostConstruct callback
         │
         ▼
7. InitializingBean.afterPropertiesSet()
         │
         ▼
8. Custom init-method
         │
         ▼
         │ ◄── Bean READY to use
         │
9. Container Shutdown
         │
         ▼
10. @PreDestroy callback
         │
         ▼
11. DisposableBean.destroy()
         │
         ▼
12. Custom destroy-method
         │
         ▼
         │ ◄── Bean DESTROYED
```

### 4.2. Callback Methods

```java
@Component
public class DataService implements InitializingBean, DisposableBean {

    @Autowired
    private DatabaseConnection connection;

    // Cách 1: @PostConstruct / @PreDestroy (ưu tiên)
    @PostConstruct
    public void init() {
        System.out.println("@PostConstruct: Kết nối database sau khi khởi tạo và tiêm phụ thuộc");
        connection.connect();
    }

    @PreDestroy
    public void cleanup() {
        System.out.println("@PreDestroy: Dọn dẹp tài nguyên trước khi bean bị hủy");
        connection.disconnect();
    }

    // Cách 2: InitializingBean / DisposableBean (ít dùng hơn)
    @Override
    public void afterPropertiesSet() {
        System.out.println("InitializingBean: Chạy sau khi properties được set");
    }

    @Override
    public void destroy() {
        System.out.println("DisposableBean: Chạy khi container shutdown");
    }
}
```

```java
// Cách 3: XML / Java Config với init-method / destroy-method
@Configuration
public class AppConfig {
    @Bean(initMethod = "startup", destroyMethod = "shutdown")
    public NetworkClient networkClient() {
        return new NetworkClient();
    }
}
```

### 4.3. Bean Scopes

| Scope | Mô tả | Use case |
|-------|-------|----------|
| **singleton** | Một instance cho mỗi Spring container (default) | Các service, repository dùng chung |
| **prototype** | Instance mới mỗi lần request/inject | Đối tượng trạng thái độc lập |
| **request** | Một instance cho mỗi HTTP request | Web request-scoped beans |
| **session** | Một instance cho mỗi HTTP session | Session-scoped beans |
| **application** | Một instance cho ServletContext | Ứng dụng web |
| **websocket** | Một instance cho WebSocket lifecycle | WebSocket |

```java
@Scope("prototype")
@Component
public class PrototypeBean {
    // Instance mới mỗi lần được inject
}

@Scope("request")
@Component
public class RequestScopedBean {
    // Mỗi HTTP request có một instance riêng
}
```

### 4.4. Lazy Initialization

```java
// Chỉ khởi tạo bean khi được sử dụng lần đầu
@Lazy
@Service
public class HeavyService {
    // Bean này không được tạo ngay khi container start
}

// Hoặc cấu hình toàn cục
@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        SpringApplication app = new SpringApplication(Application.class);
        app.setLazyInitialization(true);
        app.run(args);
    }
}
```

---

## 5. @Bean và @Configuration

### 5.1. @Component vs @Bean

| Tiêu chí | `@Component` | `@Bean` |
|----------|--------------|--------|
| **Nơi đặt** | Trên class | Trên method trong `@Configuration` |
| **Tự động quét** | Có (qua `@ComponentScan`) | Không — phải khai báo thủ công |
| **Dùng khi** | Class do mình viết | Third-party class, complex logic |
| **Tên bean** | Theo class name (có thể chỉnh) | Theo method name |

```java
// @Component — cho class do mình viết
@Component
public class UserService {
    // Tự động được quét và đăng ký
}

// @Configuration + @Bean — cho third-party class
@Configuration
public class AppConfig {

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplateBuilder()
            .setConnectTimeout(Duration.ofSeconds(5))
            .setReadTimeout(Duration.ofSeconds(10))
            .build();
    }

    @Bean
    @Scope("prototype")
    public ObjectFactory<SomeObject> someObjectProvider() {
        return () -> new SomeObject();
    }
}
```

### 5.2. @Configuration chi tiết

```java
@Configuration
public class DatabaseConfig {

    @Value("${db.url}")
    private String url;

    @Bean
    public DataSource dataSource() {
        return DataSourceBuilder.create()
            .url(url)
            .driverClassName("org.postgresql.Driver")
            .build();
    }

    @Bean
    public TransactionManager transactionManager(DataSource dataSource) {
        return new DataSourceTransactionManager(dataSource);
    }
}
```

### 5.3. Bean Aliasing và Primary

```java
// Đặt tên khác cho bean
@Bean("customDataSource")
public DataSource dataSource() { ... }

// Đánh dấu bean ưu tiên khi có nhiều bean cùng kiểu
@Primary
@Bean
public DataSource primaryDataSource() { ... }

// @Qualifier để chỉ định bean cụ thể
@Service
public class SomeService {
    @Autowired
    @Qualifier("secondaryDataSource")
    private DataSource dataSource;
}
```

---

## 6. ApplicationContext vs BeanFactory

| Tính năng | BeanFactory | ApplicationContext |
|-----------|-----------|-------------------|
| Lazy/ Eager loading | Lazy loading | **Eager loading** (default) |
| i18n (Internationalization) | Không | Có |
| AOP (Aspect-Oriented Programming) | Không | Có |
| Events & Multicast | Không | Có |
| Web applications | Không | Có |
| Resource loading | Cơ bản | Có thêm classpath, filesystem, URLs |
| Mặc định trong Spring | Không | **Có (Spring Boot dùng mặc định)** |

> **Trong thực tế**, luôn dùng **ApplicationContext** vì nó mở rộng BeanFactory và cung cấp nhiều tính năng cần thiết cho ứng dụng hiện đại.

---

## 7. AOP (Aspect-Oriented Programming)

### 7.1. Khái niệm

**AOP** là paradigm cho phép tách các **cross-cutting concerns** (logging, transaction, security, caching, retry) ra khỏi business logic chính. Thay vì code logging ở mọi nơi, ta định nghĩa một **aspect** duy nhất và áp dụng tự động.

### 7.2. Các khái niệm cốt lõi

| Khái niệm | Tiếng Việt | Mô tả |
|-----------|-----------|--------|
| **Aspect** | Aspect | Module đóng gói cross-cutting behavior (class Java thông thường có `@Aspect`) |
| **Advice** | Advice | Action được thực hiện bởi aspect tại join point cụ thể |
| **JoinPoint** | JoinPoint | Điểm trong code nơi advice có thể áp dụng (method execution, constructor, field access) |
| **Pointcut** | Pointcut | Biểu thức regex/logic match các JoinPoint cụ thể |
| **Weaving** | Weaving | Quá trình liên kết aspects với target objects (compile-time, load-time, runtime) |

### 7.3. Các loại Advice

| Annotation | Thời điểm thực thi | Mô tả |
|-----------|---------------------|--------|
| `@Before` | Trước khi method chạy | Dùng cho validation, logging đầu vào |
| `@After` | Sau khi method chạy (finally) | Dùng cho cleanup, logging luôn |
| `@AfterReturning` | Sau khi return thành công | Dùng cho post-processing kết quả |
| `@AfterThrowing` | Sau khi ném exception | Dùng cho error handling |
| `@Around` | Bao quanh method hoàn toàn | Có thể sửa args, return value, prevent execution |

### 7.4. Ví dụ

```java
@Aspect
@Component
public class LoggingAspect {

    // Pointcut: match mọi public method trong package service
    @Pointcut("execution(public * com.example.service.*.*(..))")
    public void serviceLayer() {}

    @Pointcut("@annotation(org.springframework.transaction.annotation.Transactional)")
    public void transactional() {}

    // Around advice — đo thời gian thực thi
    @Around("serviceLayer()")
    public Object logExecutionTime(ProceedingJoinPoint joinPoint) throws Throwable {
        long start = System.currentTimeMillis();
        String methodName = joinPoint.getSignature().toShortString();

        try {
            Object result = joinPoint.proceed();
            long duration = System.currentTimeMillis() - start;
            System.out.printf("✅ %s executed in %dms%n", methodName, duration);
            return result;
        } catch (Throwable ex) {
            long duration = System.currentTimeMillis() - start;
            System.out.printf("❌ %s FAILED after %dms: %s%n", methodName, duration, ex.getMessage());
            throw ex;
        }
    }

    // Before advice — kiểm tra quyền
    @Before("serviceLayer() && @annotation(requiresAuth)")
    public void checkAuthentication(JoinPoint jp, RequiresAuth requiresAuth) {
        // Lấy user từ SecurityContext và kiểm tra quyền
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            throw new UnauthorizedException("Authentication required");
        }
    }
}
```

### 7.5. Use Cases phổ biến của AOP

| Use case | Mô tả | Ví dụ annotation |
|---------|-------|-----------------|
| **Logging** | Ghi log mọi method calls | Custom `@Loggable` |
| **Transaction** | Quản lý transaction tự động | `@Transactional` |
| **Security** | Kiểm tra quyền truy cập | `@PreAuthorize` |
| **Performance** | Đo thời gian thực thi | `@Timed` |
| **Retry** | Thử lại khi thất bại | `@Retryable` |
| **Caching** | Cache kết quả method | `@Cacheable` |
| **Validation** | Validate input tự động | `@Valid` |

---

## 8. Stereotype Annotations

| Annotation | Mục đích | Chi tiết |
|-----------|---------|----------|
| `@Component` | Bean Spring chung | Annotation base — mọi stereotype đều là `@Component` |
| `@Service` | Layer business logic | Alias ngữ nghĩa của `@Component` |
| `@Repository` | Layer data access | Alias ngữ nghĩa của `@Component` |
| `@Controller` | Web controller | DispatcherServlet nhận diện qua annotation này |
| `@RestController` | REST API controller | Kết hợp `@Controller` + `@ResponseBody` |
| `@Configuration` | Class cấu hình | Định nghĩa beans bằng `@Bean` |

```java
// @Component — generic bean
@Component
public class AppMetrics { }

// @Service — business logic layer
@Service
public class OrderService {
    // Nghiệp vụ xử lý đơn hàng
}

// @Repository — data access layer
@Repository
public class UserRepository {
    // Truy vấn database
}

// @Controller — web controller
@Controller
public class WebController {
    // Trả về View (JSP, Thymeleaf)
}

// @RestController — REST API
@RestController
@RequestMapping("/api/users")
public class UserApiController {
    // Trả về JSON/XML
}

// @Configuration — configuration class
@Configuration
public class SecurityConfig {
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
```

---

## 9. Component Scanning

### 9.1. Cấu hình mặc định

```java
@SpringBootApplication
// Quét từ package chứa Application class trở xuống
public class Application { }

// Hoặc chỉ định rõ package cần quét
@ComponentScan(basePackages = {
    "com.example.service",
    "com.example.repository",
    "com.example.config"
})
@SpringBootApplication
public class Application { }
```

### 9.2. Filter trong Component Scan

```java
@ComponentScan(
    basePackages = "com.example",
    includeFilters = @ComponentScan.Filter(
        type = FilterType.ANNOTATION,
        classes = MyCustomAnnotation.class
    ),
    excludeFilters = @ComponentScan.Filter(
        type = FilterType.REGEX,
        pattern = ".*Test.*"
    )
)
```

---

## 10. Spring Expression Language (SpEL)

```java
@Value("#{systemProperties['user.region'] ?: 'VN'}")
private String region;

@Value("#{ T(java.lang.Math).random() * 100 }")
private double randomValue;

@Value("#{ @dataSource.url }")
private String dbUrl;

@Value("#{ ${app.max-retries:3} * ${app.retry-delay:1000} }")
private int totalRetryDelay;
```

---

## 11. Tóm tắt so sánh quan trọng

### Constructor vs Setter vs Field Injection

| Tiêu chí | Constructor | Setter | Field |
|----------|------------|--------|-------|
| **Immutability** | ✅ | ❌ | ❌ |
| **Testability** | ✅✅ | ✅ | ❌ |
| **Optional dependency** | `@Nullable` | ✅ | ✅ |
| **Khuyến nghị** | **✅ Ưu tiên** | Khi cần optional | **❌ Tránh** |

### BeanFactory vs ApplicationContext

| Tiêu chí | BeanFactory | ApplicationContext |
|----------|------------|-------------------|
| Khuyến nghị | Cho resource-constrained | **✅ Mặc định** |

### AOP Advice Types

| Type | Chặn được execution? | Sửa được return? | Sửa được args? |
|------|---------------------|-----------------|---------------|
| `@Before` | ❌ | ❌ | ❌ |
| `@After` | ❌ | ❌ | ❌ |
| `@AfterReturning` | ❌ | ✅ | ❌ |
| `@AfterThrowing` | ❌ | ❌ | ❌ |
| `@Around` | ✅ | ✅ | ✅ |
