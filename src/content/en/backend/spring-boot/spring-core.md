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

## 6. AOP Weaving Mechanisms

### 6.1. Weaving Types

AOP **weaving** is the process of linking aspects with target objects. Spring AOP supports three weaving mechanisms:

| Weaving Type | When | Pros | Cons |
|-------------|------|------|------|
| **Compile-time (CTW)** | During compilation | Best performance, no runtime overhead | Requires AspectJ compiler (ajc) |
| **Load-time (LTW)** | During class loading | No recompilation needed | JVM agent required, slight startup cost |
| **Runtime (RTW)** | During execution | Simplest setup, Spring-managed | Runtime overhead per call |

```java
// AspectJ annotation-style (works with Spring AOP runtime weaving)
@Aspect
@Component
public class PerformanceAspect {

    @Around("execution(* com.example..*.*(..))")
    public Object measureTime(ProceedingJoinPoint pjp) throws Throwable {
        long start = System.nanoTime();
        Object result = pjp.proceed();
        long elapsed = System.nanoTime() - start;
        log.info("{} executed in {}ms", pjp.getSignature(), elapsed / 1_000_000);
        return result;
    }
}
```

### 6.2. Compile-Time Weaving (AspectJ CTW)

Requires AspectJ compiler (`ajc`) and `aspectj-maven-plugin`:

```xml
<dependency>
    <groupId>org.aspectj</groupId>
    <artifactId>aspectjweaver</artifactId>
</dependency>
```

```xml
<plugin>
    <groupId>org.codehaus.mojo</groupId>
    <artifactId>aspectj-maven-plugin</artifactId>
    <configuration>
        <complianceLevel>17</complianceLevel>
        <source>17</source>
        <target>17</target>
        <weaveDependencies>
            <weaveDependency>
                <groupId>org.springframework</groupId>
                <artifactId>spring-aspects</artifactId>
            </weaveDependency>
        </weaveDependencies>
    </configuration>
</plugin>
```

### 6.3. Load-Time Weaving (LTW)

Uses a Java agent to weave at class loading time:

```properties
# application.properties
spring.aop.proxy-target-class=true
-javaagent:${HOME}/.m2/repository/org/aspectj/aspectjweaver/1.9.19/aspectjweaver-1.9.19.jar

# META-INF/aop.xml
<!DOCTYPE aspectj PUBLIC "-//AspectJ//DTD//EN" "http://www.eclipse.org/aspectj/dtd/aspectj.dtd">
<aspectj>
    <weaver>
        <include within="com.example..*"/>
    </weaver>
    <aspects>
        <aspect name="com.example.aop.TransactionalAspect"/>
    </aspects>
</aspectj>
```

### 6.4. Spring AOP Proxy Mechanism

Spring AOP uses **JDK dynamic proxies** (interfaces) or **CGLIB proxies** (classes without interfaces) by default.

```java
// Target interface
public interface UserService {
    void createUser(User user);
}

// Spring creates a proxy wrapping the actual UserServiceImpl
// Method calls go through the proxy, which applies advice before/after
```

```properties
# Force CGLIB (creates subclass proxies)
spring.aop.proxy-target-class=true

# Default: use JDK proxy if interface exists, else CGLIB
```

**Key difference**: Spring AOP only intercepts **method executions** on Spring-managed beans. AspectJ (with CTW/LTW) can intercept field access, constructor calls, static initializers, and more.

### 6.5. Pointcut Expressions Reference

```java
// Method execution
@Around("execution(public * com.example..*.*(..))")

// Named pointcut
@Pointcut("execution(* com.example.service.*.*(..))")
public void serviceMethods() {}

@Pointcut("execution(* com.example.repository.*.*(..))")
public void repositoryMethods() {}

@Around("serviceMethods() && !repositoryMethods()")

// Annotation-based
@Around("@annotation(org.springframework.transaction.annotation.Transactional)")
public Object transactionalOperation(ProceedingJoinPoint pjp) throws Throwable { }

// Within
@Around("within(com.example.service..*)")

// Bean name pattern
@Around("bean(userService*)")

// Args
@Around("execution(* *.findById(Long))")  // Specific Long argument
@Around("execution(* *.*(String, ..))")  // String as first arg

// This/Target
@Around("target(com.example.service.UserService)")
@Around("this(com.example.service.UserService)")
```

### 6.6. Real-World AOP Examples

```java
// Retry aspect
@Aspect
@Component
public class RetryAspect {

    @Around("@annotation(retryable)")
    public Object retry(ProceedingJoinPoint jp, Retryable retryable) throws Throwable {
        int maxAttempts = retryable.maxAttempts();
        long delay = retryable.delay();

        for (int i = 1; i <= maxAttempts; i++) {
            try {
                return jp.proceed();
            } catch (Exception e) {
                if (i == maxAttempts) throw e;
                Thread.sleep(delay);
                log.warn("Retry {} for {}", i, jp.getSignature());
            }
        }
        throw new IllegalStateException("Should not reach here");
    }
}

@Retryable(maxAttempts = 3, delay = 1000)
public void callExternalService() { }

// Cache aspect
@Aspect
@Component
public class CacheAspect {

    private final CacheManager cacheManager;

    @Around("@annotation(cacheable)")
    public Object checkCache(ProceedingJoinPoint jp, Cacheable cacheable) throws Throwable {
        String cacheName = cacheable.value();
        String key = cacheable.key();

        Cache cache = cacheManager.getCache(cacheName);
        if (cache != null) {
            Object cached = cache.get(key);
            if (cached != null) return cached;
        }

        Object result = jp.proceed();

        if (cache != null) {
            cache.put(key, result);
        }
        return result;
    }
}
```

---

## 7. Bean Definition and Profiles

### 7.1. @Profile

```java
@Bean
@Profile("dev")
public DataSource devDataSource() {
    return new EmbeddedDatabaseBuilder().build();
}

@Bean
@Profile("prod")
public DataSource prodDataSource() {
    return DataSourceBuilder.create()
        .url(env.getProperty("db.prod.url"))
        .username(env.getProperty("db.prod.username"))
        .build();
}
```

### 7.2. @Conditional

```java
@Bean
@ConditionalOnProperty(name = "feature.new-checkout", havingValue = "true")
public CheckoutService newCheckoutService() { }

@Bean
@ConditionalOnMissingBean(NotificationService.class)
public NotificationService defaultNotificationService() { }

@Bean
@ConditionalOnClass(name = "org.elasticsearch.client.ElasticsearchClient")
public SearchService elasticsearchService() { }
```

---

## 8. Circular Dependency

### 8.1. How Spring Resolves

Spring resolves circular dependencies by using **partial beans** — one bean is created first with a placeholder for the circular reference, and the reference is injected after construction.

### 8.2. Solutions

```java
// Solution 1: @Lazy
@Service
public class A {
    @Autowired
    public A(@Lazy B b) { }
}

// Solution 2: Setter injection (one side)
@Service
public class A {
    private B b;
    @Autowired
    public void setB(B b) { this.b = b; }
}

// Solution 3: @PostConstruct (both sides use setter)
@Service
public class A {
    @Autowired
    private B b;

    @PostConstruct
    public void init() { b.setA(this); }
}
```

---

## 9. Stereotype Annotations

| Annotation | Purpose | Details |
|-----------|---------|---------|
| `@Component` | Generic Spring-managed bean | Base annotation — all stereotypes are `@Component` |
| `@Service` | Business logic layer | Semantic alias of `@Component` |
| `@Repository` | Data access layer | Semantic alias + exception translation |
| `@Controller` | Web controller | DispatcherServlet recognition |
| `@RestController` | REST API controller | Combines `@Controller` + `@ResponseBody` |
| `@Configuration` | Configuration class | Defines beans via `@Bean` |

### 9.1. @Repository Exception Translation

Spring automatically translates database exceptions (SQLException, HibernateException) into Spring's DataAccessException hierarchy:

```java
@Repository
public class UserDao {

    @PersistenceExceptionTranslationPostProcessor  // Auto-registered by Spring Boot
    public class Dao { }

    // SQLException thrown here -> DataAccessException wrapped
    public User findById(Long id) { /* ... */ }
}
```

---

## 10. Common Interview Questions

**Q: What is the difference between Spring AOP and AspectJ?**
Spring AOP: Runtime weaving via proxies, only method-level, limited pointcuts (execution only), easier to use. AspectJ: Compile-time or load-time weaving, field/constructor/static, all pointcut designators, more powerful but complex.

**Q: Why prefer constructor injection over field injection?**
Constructor injection makes dependencies explicit, enables immutability (final fields), makes testing trivial (just pass mocks to constructor), and detects circular dependencies early at build time.

**Q: What is the difference between @Bean and @Component?**
`@Component` auto-scanned and registered by the container. `@Bean` explicitly declared in a `@Configuration` class — better for third-party classes, complex instantiation logic, or fine-grained control over bean creation.

**Q: What happens if two beans of the same type exist and only one is needed?**
Spring throws `NoUniqueBeanDefinitionException`. Solutions: use `@Primary` on one bean, use `@Qualifier` to specify which one to inject, or use `@Profile` to activate only one.

**Q: How does @Transactional work internally?**
Spring creates a proxy around the bean. On method entry, the proxy starts a transaction. On method exit (normal or exception), the proxy commits or rolls back. Internal calls within the same class bypass the proxy — this is why self-invocation doesn't trigger transactions.

**Q: BeanFactory vs ApplicationContext — which to use and when?**
Use `ApplicationContext` in virtually all cases. Use `BeanFactory` only in very memory-constrained environments (mobile, applets) where lazy loading is critical.
