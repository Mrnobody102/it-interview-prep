# Spring Boot Basics

## 1. Overview

Spring Boot is built on top of Spring to reduce boilerplate and make it easier to build production-ready applications quickly.

### 1.1. Key features

| Feature | Description |
|---|---|
| Auto-configuration | Configures beans based on dependencies and environment |
| Starter dependencies | Curated dependency bundles |
| Embedded server | Run with embedded Tomcat, Jetty, or Undertow |
| Externalized config | Config through files, env vars, CLI, secrets |
| Production readiness | Actuator, metrics, health checks, logging integration |

Spring Boot matters because it shifts effort from framework setup to application design. Instead of spending time wiring the web container, dependency tree, and default infrastructure, teams can spend that time on API design, persistence, security, and operations.

That is why Spring Boot remains a common default for internal business services, CRUD-heavy platforms, and service-oriented architectures.

Its value is cumulative: each small convenience adds up across configuration, testing, deployment, and operations.

That compounding effect is why teams often underestimate Boot at first and appreciate it more as systems mature.

## 2. `@SpringBootApplication`

`@SpringBootApplication` is the main convenience annotation.

```java
@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
```

It combines:

- `@Configuration`
- `@EnableAutoConfiguration`
- `@ComponentScan`

That single annotation is also why package structure matters so much in Boot applications. If the main application class sits too low or too high in the package tree, component scanning may become confusing.

Many startup issues that look mysterious are actually just scanning or configuration-boundary problems.

Understanding the annotation composition helps you debug those issues faster.

It also helps explain why moving one class across package boundaries can unexpectedly change runtime behavior.

## 3. Auto-configuration

Spring Boot checks the classpath, properties, and environment, then wires sensible defaults.

```properties
spring.autoconfigure.exclude=org.springframework.boot.autoconfigure.data.redis.RedisAutoConfiguration
```

Typical examples:

- add `spring-boot-starter-web` -> DispatcherServlet, Jackson, embedded server
- add `spring-boot-starter-data-jpa` -> DataSource, JPA infrastructure
- add `spring-boot-starter-security` -> security filter chain

This convention-over-configuration model is a major productivity gain, but it also means engineers need to understand what Boot is auto-creating on their behalf when debugging startup or bean conflicts.

The faster a framework is at creating defaults, the more important it becomes to understand those defaults when production behavior is not what you expected.

Auto-configuration is productive precisely because it removes boilerplate, but it never removes the need to reason about behavior.

The best Spring Boot engineers are usually the ones who understand both the convenience layer and the underlying Spring mechanics.

### 3.1. Custom auto-configuration

In larger platforms, teams can publish internal starters or custom auto-configuration modules to standardize:

- logging
- tracing
- security defaults
- database wiring
- shared SDK clients

That is a common enterprise pattern: build company-specific starters so every new service inherits the same observability, security, and operational defaults.

It keeps teams from rewriting the same bootstrap code in every service and reduces drift across the platform.

This is one of the clearest ways platform engineering adds leverage in large Spring estates.

Shared starters turn repeated setup into reusable policy.

## 4. Starter Dependencies

Starters reduce dependency management friction.

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>

<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>
```

### 4.1. Common starter categories

- web: `spring-boot-starter-web`, `spring-boot-starter-webflux`
- data: `spring-boot-starter-data-jpa`, `spring-boot-starter-data-redis`
- security: `spring-boot-starter-security`
- ops: `spring-boot-starter-actuator`
- testing: `spring-boot-starter-test`

The important point is not just convenience. Starters also reduce version mismatch risk because the Boot BOM manages a compatible dependency set.

That dependency management role is a large part of why Boot upgrades matter and why mixing unmanaged versions casually can create subtle runtime issues.

Version alignment is often invisible when it works and extremely painful when it does not.

That is why dependency management should be treated as part of architecture, not just build tooling.

This is also why teams should be cautious about copying one-off dependency overrides from old tickets or Stack Overflow answers without understanding the compatibility impact.

One local fix to one library version can easily destabilize the rest of the application graph.

## 5. Externalized Configuration

Configuration should stay outside code as much as possible.

### 5.1. Configuration files

| File | Purpose |
|---|---|
| `application.properties` | Basic key-value configuration |
| `application.yml` | Hierarchical YAML config |
| `application-{profile}.properties` | Profile-specific overrides |

```yaml
server:
  port: 8080

spring:
  application:
    name: user-service
```

For real systems, configuration usually expands quickly into:

- server and thread pool settings
- datasource and cache settings
- feature flags
- observability endpoints
- downstream client URLs and credentials

As the application grows, configuration quality becomes architecture quality. Poorly modeled config leads to brittle deployments and confusing environment behavior.

Typed configuration and clear precedence rules are therefore operational concerns, not just coding style preferences.

Misconfigured systems often fail operationally before they fail logically.

As a service portfolio grows, teams usually also separate configuration into a few categories:

- application behavior
- infrastructure connectivity
- secrets and credentials
- feature flags
- observability settings

That separation makes reviews and incident debugging much easier.

### 5.2. Environment variables and CLI arguments

```bash
SERVER_PORT=9000 java -jar app.jar
java -jar app.jar --server.port=9000
```

Precedence matters. In production, runtime environment often overrides defaults from packaged config files.

This is why debugging config issues often starts with one question: which property source actually won?

Without that mental model, engineers often edit the right property in the wrong source and wonder why nothing changed.

The problem is usually not the value itself. It is where that value came from.

Tracing property origin is a core Spring Boot debugging skill.

### 5.3. `@ConfigurationProperties`

Use `@ConfigurationProperties` for structured, typed configuration.

```java
@ConfigurationProperties(prefix = "app")
public class AppProperties {
    private String name;
    private int maxUsers;

    // getters and setters
}
```

This is usually better than scattering config keys across many `@Value` annotations.

It also improves validation, IDE support, and refactoring safety when configuration grows.

It is also easier to document one typed configuration object than dozens of scattered string keys.

That becomes especially helpful when multiple teams consume the same shared configuration surface.

It also makes configuration review much easier.

In production systems, pairing `@ConfigurationProperties` with validation annotations is a very cheap way to fail fast on invalid deployment input.

That is often better than discovering a bad value only after the first real request hits the service.

### 5.4. `@Value`

`@Value` is useful for small, isolated values but becomes hard to maintain when overused.

```java
@Value("${app.name}")
private String appName;
```

Use it sparingly for simple cases, not for large config groups.

A good rule is: if several keys belong to one concept, prefer a dedicated properties class.

This usually results in cleaner startup validation and fewer configuration mistakes reaching runtime.

Invalid config should ideally fail fast before the service begins accepting traffic.

Configuration validation is one of the cheapest reliability wins in a Boot service.

## 6. Profiles

Profiles let one codebase run with different environment-specific behavior.

```properties
# application-dev.properties
logging.level.root=DEBUG

# application-prod.properties
logging.level.root=WARN
```

### 6.1. Profile-specific configuration files

Typical profile split:

- `dev`
- `test`
- `staging`
- `prod`

Each should override only what needs to differ.

Overusing profile-specific config tends to create environments that drift apart, so keep the delta small and explicit.

Production reliability improves when environments differ mainly by values, not by entirely different behavior trees.

The more behavior differences are hidden inside profiles, the harder deployments become to predict.

Values should vary more often than behavior.

If one profile begins to require many special cases, that is often a sign that the application is carrying environment-specific design debt.

Profiles should clarify deployment shape, not become a second branching architecture.

### 6.2. `@Profile` annotation

```java
@Profile("prod")
@Bean
public PaymentClient paymentClient() {
    return new RealPaymentClient();
}
```

This is useful when wiring different beans by environment, though overusing profiles can make behavior harder to reason about.

For many cases, plain property-based branching or externalized configuration is simpler than deep profile trees.

Profiles are useful, but they are not a substitute for clear environment design.

Use them intentionally rather than as a catch-all for every environment difference.

Otherwise profiles become a second hidden code path.

## 7. Banner

Spring Boot can print a startup banner from `src/main/resources/banner.txt`.

### 7.1. Disabling the banner

```properties
spring.main.banner-mode=off
```

Banner customization is cosmetic, but disabling it can make CI logs cleaner.

Teams sometimes also customize the banner to print build or environment metadata during local startup.

That is cosmetic, but it can still be handy when developers run many services locally and need quick visual identification.

It can also help verify at a glance that the expected profile or build is running.

Small feedback loops like that reduce environment confusion during development.

## 8. `SpringApplication` run flow

At a high level, startup flow looks like this:

1. read application configuration
2. prepare environment
3. create application context
4. register beans and auto-configuration
5. refresh context
6. start embedded server
7. publish startup events

Understanding this helps when diagnosing slow startup, bean conflicts, or profile-specific bugs.

It also helps explain where hooks such as `ApplicationRunner`, `CommandLineRunner`, listeners, and lifecycle callbacks fit into startup.

Those hooks are often the right place for warmup logic, seed data, or startup diagnostics when used carefully.

The wrong startup hook, however, can make service startup slow and fragile.

Hooks are powerful, but they should stay observable and predictable.

This is also why startup timing and readiness checks belong together.

A service is not really "up" just because the JVM started. It is up when critical initialization finished and the instance is safe to receive traffic.

## 9. Common important annotations

Common Spring Boot annotations include:

- `@SpringBootApplication`
- `@RestController`
- `@Service`
- `@Repository`
- `@Configuration`
- `@Bean`
- `@ConfigurationProperties`
- `@Transactional`
- `@Profile`

These annotations are simple individually, but together they define most application structure.

A lot of Spring Boot fluency is really about understanding how these annotations interact rather than memorizing them one by one.

Experienced Spring engineers usually think in terms of composition and lifecycle, not isolated annotations.

That mindset is what separates memorization from real framework fluency.

Spring knowledge scales better when it is model-based rather than annotation-by-annotation trivia.

That is also why many interview discussions eventually drift from "what does this annotation do?" toward "where should this concern live in a real service?".

## 10. Common use cases

### 10.1. Building a REST controller quickly

```java
@RestController
@RequestMapping("/users")
public class UserController {

    @GetMapping("/{id}")
    public UserDto getUser(@PathVariable Long id) {
        return new UserDto(id, "Alice");
    }
}
```

Spring Boot is especially strong when teams need to move quickly from:

- HTTP endpoint
- validation
- service layer
- persistence
- observability

That is why it remains such a common default for internal business services and CRUD-heavy backend platforms.

Boot is rarely the most minimal option, but it is often the most productive option once you include testing, observability, configuration, and long-term maintenance.

That trade-off is why it persists even in organizations that could technically choose many lighter frameworks.

Productivity under operational complexity often matters more than minimalism on paper.

This is especially true when a platform needs common defaults for security, metrics, tracing, and deployment behavior across many services.

The framework value is not just faster coding. It is more repeatable service construction.

That repeatability is often what makes a service portfolio sustainable after the first ten or twenty services, not just the first one.

At scale, that consistency also improves template generation, internal platform support, and cross-team incident handling.

That is often where Spring Boot starts paying back far beyond its startup convenience.

It helps organizations scale service creation without scaling framework chaos.

That is a major reason it stays relevant in long-lived backend ecosystems.

### 10.2. Global exception handling

```java
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<Map<String, String>> handleNotFound(NotFoundException ex) {
        return ResponseEntity.status(404).body(Map.of("error", ex.getMessage()));
    }
}
```

This is one of the first patterns that should be standardized in a real backend codebase.

Once exception handling, validation, and configuration are standardized, a Spring Boot service becomes much easier to scale across teams.

That standardization is a major part of why Spring ecosystems perform well in large organizations with many services and many contributors.

Once those conventions are shared, each new service becomes easier to start and easier to operate.

That is one reason large Spring ecosystems can move quickly despite having many services.

At that point, a Spring Boot service stops being just "an app with annotations" and starts becoming a predictable production unit that platform teams can reason about consistently.

## 11. Common interview questions

### 11.1. What does `@SpringBootApplication` include?

It combines `@Configuration`, `@EnableAutoConfiguration`, and `@ComponentScan`, which is why one annotation can bootstrap most applications.

### 11.2. Why is auto-configuration useful?

Because it removes repetitive setup and gives sensible defaults based on the classpath and application properties, while still allowing overrides when needed.

### 11.3. Why should configuration be externalized?

Because environments differ. Keeping secrets, ports, URLs, and feature toggles outside the codebase makes deployments safer and easier to operate.
