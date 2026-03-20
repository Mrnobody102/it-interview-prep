# Spring Core

## 1. IoC (Inversion of Control)

Inverts the control of program flow: instead of the programmer managing object lifecycle and dependencies, the framework (IoC Container) does it.

**Benefits:**
- Loose coupling between objects
- Easy to test (dependencies can be mocked)
- Easy to maintain
- Dependency management is centralized

## 2. DI (Dependency Injection)

The specific mechanism to implement IoC: dependencies are injected by the IoC Container instead of objects creating them with `new`.

### 2.1. Injection Types

| Type | Description | Recommendation |
|------|-------------|----------------|
| **Constructor Injection** | Dependencies via constructor | **Preferred** — immutable |
| **Setter Injection** | Dependencies via setter methods | For optional dependencies |
| **Field Injection** | Direct field annotation | **Avoid** — hard to test |

```java
// ✅ Constructor Injection (Recommended)
@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
}

// ✅ Constructor injection with Lombok
@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
}

// ⚠️ Setter Injection
@Service
public class UserService {
    private UserRepository userRepository;

    @Autowired
    public void setUserRepository(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
}

// ❌ Field Injection (Avoid)
@Service
public class UserService {
    @Autowired
    private UserRepository userRepository; // Hard to test
}
```

## 3. Bean Lifecycle & Scope

### 3.1. Lifecycle

```
Bean Created → Dependencies Injected →
Init Methods → Bean Ready → Use →
Destroy Methods → Bean Destroyed
```

```java
@PostConstruct       // After construction & injection
public void init() { }

@PreDestroy         // Before destruction
public void cleanup() { }
```

### 3.2. Bean Scopes

| Scope | Description |
|-------|-------------|
| **Singleton** | One instance per Spring container (default) |
| **Prototype** | New instance each time requested |
| **Request** | One instance per HTTP request (web) |
| **Session** | One instance per HTTP session (web) |
| **Application** | One instance per ServletContext (web) |
| **WebSocket** | One instance per WebSocket |

```java
@Scope("prototype")  // New instance each time
@Component
public class PrototypeBean { }
```

## 4. ApplicationContext vs BeanFactory

| Feature | BeanFactory | ApplicationContext |
|---------|-----------|-------------------|
| Lazy/ eager loading | Lazy | Eager |
| i18n | No | Yes |
| AOP | No | Yes |
| Events | No | Yes |
| Web apps | No | Yes |
| Default in Spring | No | **Yes (Boot)** |

**BeanFactory:** Base interface, lightweight, lazy loading.
**ApplicationContext:** Extends BeanFactory, preloads all singletons, rich features. Spring Boot uses it by default.

## 5. AOP (Aspect Oriented Programming)

Separates cross-cutting concerns from business logic.

### 5.1. Core Concepts

| Concept | Description |
|---------|-------------|
| **Aspect** | Module that encapsulates cross-cutting behavior |
| **Advice** | Action taken by an aspect (@Before, @After, @Around) |
| **JoinPoint** | Point in code where advice can be applied |
| **Pointcut** | Expression that matches JoinPoints |
| **Weaving** | Process of linking aspects with target objects |

### 5.2. Advice Types

| Annotation | When |
|-----------|------|
| `@Before` | Before method execution |
| `@After` | After method execution (finally) |
| `@AfterReturning` | After successful return |
| `@AfterThrowing` | After exception thrown |
| `@Around` | Wraps method (can modify args, return value) |

### 5.3. Example

```java
@Aspect
@Component
public class LoggingAspect {

    @Around("execution(* com.example.service.*.*(..))")
    public Object logExecutionTime(ProceedingJoinPoint joinPoint) throws Throwable {
        long start = System.currentTimeMillis();
        Object result = joinPoint.proceed();
        long duration = System.currentTimeMillis() - start;

        System.out.println(joinPoint.getSignature() + " took " + duration + "ms");
        return result;
    }
}
```

### 5.4. Common Use Cases

- **Logging:** Track method calls
- **Transaction:** @Transactional
- **Security:** @PreAuthorize
- **Performance:** Measure execution time
- **Retry:** Retry on failure

## 6. Stereotype Annotations

| Annotation | Purpose |
|-----------|---------|
| `@Component` | Generic Spring-managed bean |
| `@Service` | Business logic layer (semantic alias of @Component) |
| `@Repository` | Data access layer (semantic alias of @Component) |
| `@Controller` | Web controller |
| `@RestController` | REST API controller (@Controller + @ResponseBody) |
| `@Configuration` | Configuration class (defines beans) |
