# Spring Core

## 1. Overview

Spring Core is the foundation of the Spring ecosystem. The most important concepts are **IoC**, **DI**, **Bean lifecycle**, **bean metadata**, and **AOP**. If these pieces are clear, the rest of Spring Boot becomes much easier to reason about.

Most "Spring magic" becomes much less mysterious once you understand that the container is mostly doing three things repeatedly:

- creating beans
- wiring dependencies
- applying infrastructure behavior such as proxies and lifecycle callbacks

That is also why most Spring debugging eventually reduces to a few recurring questions:

- how was this bean created?
- how was it selected for injection?
- is a proxy involved?

Once those questions are answered, many "mysterious" Spring behaviors become straightforward.

## 2. IoC (Inversion of Control)

### 2.1. Concept

With IoC, application code no longer owns object creation and wiring. The Spring container creates objects, resolves dependencies, and manages lifecycle.

That inversion is a design shift, not just a framework trick. Instead of classes pulling their dependencies from the world, the container pushes dependencies into them.

When this model is applied consistently, application code becomes easier to test outside the framework as well.

That is the best sign that Spring is helping rather than being tightly coupled to your domain code.

### 2.2. Benefits of IoC

- Reduces tight coupling between components
- Makes testing easier because dependencies can be replaced by mocks or stubs
- Centralizes configuration and lifecycle management
- Improves maintainability when implementations change

It also makes cross-cutting platform defaults easier to apply consistently across an application.

That is one reason large organizations standardize on dependency injection containers instead of manual object graphs.

Consistency at the object graph level creates consistency everywhere else.

### 2.3. Two IoC Container Types

| Container | Description |
|---|---|
| `BeanFactory` | Lightweight root container with basic bean management |
| `ApplicationContext` | Richer container with events, AOP, i18n, environment, and Boot integration |

In interviews, the key point is that `ApplicationContext` is what almost all modern Spring Boot applications actually use.

So although both abstractions matter conceptually, `BeanFactory` is mostly background knowledge while `ApplicationContext` is operational reality.

## 3. DI (Dependency Injection)

### 3.1. Concept

Dependency Injection is the main mechanism Spring uses to implement IoC: dependencies are supplied by the container instead of being created manually with `new`.

This is what allows the same service class to work with different implementations in dev, test, and production without code changes.

It also enables decorator-style infrastructure, where a service can receive a tracing client, cached client, or mock implementation with no change to its own code.

```java
// Tight coupling
public class UserService {
    private final UserRepository repo = new MySqlUserRepository();
}

// Loose coupling with DI
public class UserService {
    private final UserRepository repo;

    public UserService(UserRepository repo) {
        this.repo = repo;
    }
}
```

### 3.2. Three Injection Types

| Type | Description | Recommendation |
|---|---|---|
| Constructor injection | Dependencies arrive through the constructor | Preferred for required dependencies |
| Setter injection | Dependencies arrive through setter methods | Useful for optional dependencies |
| Field injection | Dependencies are injected directly into fields | Avoid in production code |

#### 3.2.1. Constructor Injection (Recommended)

```java
@Service
public class UserService {
    private final UserRepository userRepository;
    private final EmailService emailService;

    public UserService(UserRepository userRepository, EmailService emailService) {
        this.userRepository = userRepository;
        this.emailService = emailService;
    }
}
```

Constructor injection makes dependencies explicit and supports immutable fields.

It also makes invalid object states harder to create because required collaborators must exist up front.

That is why constructor injection and immutable fields often go together naturally.

The design tends to be clearer even before Spring enters the picture.

#### 3.2.2. Setter Injection

```java
@Service
public class NotificationService {
    private SmsService smsService;

    @Autowired(required = false)
    public void setSmsService(SmsService smsService) {
        this.smsService = smsService;
    }
}
```

Setter injection is a reasonable choice for optional or reconfigurable dependencies.

It should be the exception, not the default, because too many setter dependencies make object state harder to reason about.

It is most defensible when a dependency is truly optional or must change after construction.

#### 3.2.3. Field Injection (Avoid)

```java
@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
}
```

Field injection hides dependencies, complicates tests, and encourages mutable design.

It also makes plain constructor-based instantiation outside the Spring container awkward, which is a bad sign for testability.

If a class is hard to instantiate in a plain unit test, that is often a signal that its dependency design should be reconsidered.

### 3.3. Detailed Comparison of Injection Styles

| Criteria | Constructor | Setter | Field |
|---|---|---|---|
| Required dependencies | Excellent | Acceptable | Weak |
| Immutability | Excellent | Poor | Poor |
| Testability | Excellent | Good | Poor |
| Clarity | Excellent | Medium | Poor |
| Circular dependency detection | Early | Later | Later |

## 4. Bean Lifecycle

### 4.1. Lifecycle Flow

```
Instantiate bean
  -> inject dependencies
  -> aware callbacks
  -> @PostConstruct / init method
  -> bean ready
  -> @PreDestroy / destroy method
```

Understanding this order matters when debugging initialization bugs, resource management, and proxy-related surprises.

It also explains why some beans fail at startup while others appear fine until they are first used.

It also explains why post-processing hooks, proxy creation, and configuration property binding can all affect the final bean instance you observe at runtime.

If the object you injected does not behave like the object you expected, lifecycle and proxy timing are good places to investigate first.

### 4.2. Callback Methods

```java
@Component
public class CacheClient {
    @PostConstruct
    public void init() {
        System.out.println("Initialize connection");
    }

    @PreDestroy
    public void cleanup() {
        System.out.println("Release resources");
    }
}
```

Spring also supports `InitializingBean`, `DisposableBean`, and custom `initMethod` / `destroyMethod`.

`@PostConstruct` and `@PreDestroy` are usually the clearest options for application code unless a special framework integration requires another hook.

Those callbacks should stay lightweight. Expensive network warmups or complex orchestration during bean creation can slow startup and complicate failure handling.

Startup hooks are best used for initialization, not business workflows.

They should prepare the bean, not quietly perform application-level jobs.

### 4.3. Bean Scopes

| Scope | Meaning |
|---|---|
| `singleton` | One instance per container |
| `prototype` | New instance every time |
| `request` | One instance per HTTP request |
| `session` | One instance per HTTP session |
| `application` | One instance per servlet context |
| `websocket` | One instance per WebSocket lifecycle |

Most backend beans should stay `singleton`. Non-singleton scopes are useful, but they add lifecycle complexity and should be introduced deliberately.

That is especially true in APIs and microservices, where stateless singleton services are usually the simplest and most predictable option.

### 4.4. Lazy Initialization

Use `@Lazy` when bean creation is expensive or only needed on specific code paths.

```java
@Lazy
@Service
public class HeavyReportService {
}
```

Lazy initialization can reduce startup work, but overusing it may move failures from startup time to runtime traffic, which is often worse operationally.

As a rule, defer expensive optional infrastructure, not critical core dependencies.

Failing fast at startup is often safer than failing late under real traffic.

Operationally, startup failure is often easier to detect and safer to roll back.

## 5. @Bean and @Configuration

### 5.1. @Component vs @Bean

| Annotation | Use When |
|---|---|
| `@Component` | Spring should discover and instantiate your class automatically |
| `@Bean` | You need explicit control over bean creation, often for third-party classes |

```java
@Component
public class EmailSender {
}

@Configuration
public class AppConfig {
    @Bean
    public ObjectMapper objectMapper() {
        return new ObjectMapper();
    }
}
```

### 5.2. @Configuration in Detail

`@Configuration` classes are special component classes used for bean definitions. Spring enhances them with proxies so repeated `@Bean` calls still return the managed singleton instance.

This is also where `@Profile`, conditional configuration, and environment-specific wiring usually belong:

```java
@Bean
@Profile("prod")
public DataSource prodDataSource() {
    return DataSourceBuilder.create().build();
}
```

Because `@Configuration` classes are proxied, calling one `@Bean` method from another inside the same class still returns the managed bean rather than creating a fresh unmanaged object.

That detail is easy to miss and frequently appears in deeper Spring interviews.

### 5.3. Bean Aliasing and Primary

When multiple beans of the same type exist, Spring needs a resolution rule.

```java
@Bean("primaryClock")
@Primary
public Clock systemClock() {
    return Clock.systemUTC();
}

@Bean("localClock")
public Clock localClock() {
    return Clock.systemDefaultZone();
}
```

Use `@Qualifier` for explicit injection and `@Primary` for a default candidate.

That becomes important once an application has multiple implementations of the same abstraction, such as mock, local, and cloud-backed clients.

If bean resolution feels ambiguous, it is usually better to make that ambiguity explicit with naming or qualifiers than rely on accident.

Spring should help make object wiring explicit, not obscure it.

## 6. ApplicationContext vs BeanFactory

| Feature | `BeanFactory` | `ApplicationContext` |
|---|---|---|
| Bean creation | Basic | Full-featured |
| AOP support | Limited | Yes |
| Events | No | Yes |
| i18n | No | Yes |
| Typical use | Rare, low-level | Standard Spring and Spring Boot |

In modern Spring Boot applications, `ApplicationContext` is the normal choice.

`BeanFactory` is still conceptually important because it is the root abstraction, but it is rarely the practical endpoint of application design.

In other words: know `BeanFactory`, use `ApplicationContext`.

## 7. AOP (Aspect-Oriented Programming)

### 7.1. Concept

AOP separates cross-cutting concerns such as logging, transactions, security, metrics, and retries from business logic.

The real value is not "more abstraction". The value is keeping business services focused while infrastructure concerns remain reusable and centralized.

That becomes especially compelling for transactions, retries, authorization, metrics, and consistent logging.

### 7.2. Core Concepts

| Concept | Description |
|---|---|
| Aspect | Module for cross-cutting behavior |
| Advice | Action executed before/after/around join points |
| Join point | Executable point such as a method call |
| Pointcut | Expression selecting join points |
| Weaving | Process of applying aspects to target code |

### 7.3. Advice Types

| Advice | When It Runs |
|---|---|
| `@Before` | Before method execution |
| `@After` | After method execution |
| `@AfterReturning` | After successful completion |
| `@AfterThrowing` | After exception |
| `@Around` | Wraps the whole call |

### 7.4. Example

```java
@Aspect
@Component
public class LoggingAspect {
    @Around("execution(* com.example.service..*(..))")
    public Object logTime(ProceedingJoinPoint pjp) throws Throwable {
        long start = System.nanoTime();
        Object result = pjp.proceed();
        long elapsed = System.nanoTime() - start;
        System.out.println(pjp.getSignature() + " took " + elapsed + "ns");
        return result;
    }
}
```

### 7.5. Common Use Cases of AOP

- Logging and tracing
- Transaction boundaries
- Authorization checks
- Retry and resilience policies
- Performance timing and metrics

Spring AOP uses proxies, so only external method calls on Spring-managed beans are intercepted. Internal self-invocation bypasses the proxy.

That single detail explains many confusing cases where `@Transactional`, retry logic, or custom aspects appear not to work.

If an aspect-based feature behaves strangely, self-invocation should be one of the first things you check.

## 8. Stereotype Annotations

| Annotation | Role |
|---|---|
| `@Component` | Generic managed bean |
| `@Service` | Business service |
| `@Repository` | Data access component with exception translation |
| `@Controller` | MVC controller |
| `@RestController` | REST controller |
| `@Configuration` | Bean configuration class |

These are mostly semantic specializations of `@Component`, but the semantics matter for readability and framework behavior.

Codebases become easier to navigate when the stereotype actually matches the responsibility of the class.

`@Repository` is especially worth remembering because it also participates in exception translation, which is one of the few stereotypes with meaningful runtime impact beyond naming.

## 9. Component Scanning

### 9.1. Default Behavior

`@SpringBootApplication` includes `@ComponentScan`, which scans the package of the main application class and its subpackages.

That means package layout matters: if a service is outside the scanned package tree, Spring will not register it.

This is one of the first things to check when a bean "mysteriously" does not exist.

The second thing to check is whether conditional configuration or profile activation excluded it.

### 9.2. Filters in Component Scan

You can customize scanning with include and exclude filters.

```java
@ComponentScan(
    basePackages = "com.example",
    excludeFilters = @ComponentScan.Filter(
        type = FilterType.REGEX,
        pattern = "com\\.example\\.legacy\\..*"
    )
)
public class AppConfig {
}
```

In practice, heavy customization of component scanning is usually a signal that package boundaries or configuration layout may need cleanup.

The simplest Boot applications tend to keep scanning rules boring and explicit.

## 10. Spring Expression Language (SpEL)

SpEL lets Spring evaluate expressions inside configuration and annotations.

```java
@Value("#{systemProperties['user.timezone']}")
private String timezone;

@Value("#{2 * 60 * 1000}")
private int timeoutMs;
```

Use it carefully. For most application code, type-safe Java configuration is easier to maintain.

SpEL is powerful, but heavy use tends to hide logic in strings and weaken refactoring support.

That is why modern Spring code usually prefers typed configuration classes and plain Java logic wherever possible.

SpEL is most defensible for small wiring expressions, conditional bean metadata, or integrating with framework features that already expect expressions.

## 11. Important Comparison Summary

### 11.1. Constructor vs Setter vs Field Injection

Constructor injection is the default recommendation for required dependencies. Setter injection is reasonable for optional dependencies. Field injection should usually be avoided in production code.

If a team follows only one Spring Core rule consistently, this is usually the most valuable one.

It improves clarity, testability, and long-term maintainability more than almost any other day-to-day Spring convention.

A surprising amount of good Spring code starts with this one discipline.

It is a small convention with outsized long-term payoff.

### 11.2. BeanFactory vs ApplicationContext

`BeanFactory` is the minimal container API. `ApplicationContext` adds the features real applications need and is what Spring Boot uses.

### 11.3. AOP Advice Types

Choose `@Around` when you need full control over timing, arguments, or return values. Use narrower advice types such as `@Before` or `@AfterReturning` when simpler behavior is enough.

## 12. Common interview questions

### 12.1. Why is constructor injection usually preferred?

Because it makes dependencies explicit, supports immutability, and keeps classes easier to test.

### 12.2. What is the difference between `BeanFactory` and `ApplicationContext`?

`BeanFactory` is the minimal IoC container. `ApplicationContext` builds on it with features real applications usually need, such as events, resource loading, and message resolution.

### 12.3. Why do Spring AOP limitations matter?

Because Spring AOP is proxy-based. That affects self-invocation, final methods, and expectations around which method calls are actually intercepted.
