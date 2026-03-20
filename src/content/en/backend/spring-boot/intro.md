# Spring Boot Basics

## 1. Overview

Spring Boot is a framework built on top of Spring that makes it quick to create production-ready applications with auto-configuration.

### 1.1. Key Features

| Feature | Description |
|---------|-------------|
| **Auto-configuration** | Automatically configures beans based on dependencies |
| **Starter Dependencies** | Convenient dependency bundles |
| **Embedded Server** | Runs with embedded Tomcat/Jetty/Undertow |
| **Production-ready** | Actuator, health checks, metrics |
| **Convention over Config** | Sensible defaults, minimal configuration |

## 2. @SpringBootApplication

The main annotation that combines three:

```java
@SpringBootApplication  // = @Configuration + @EnableAutoConfiguration + @ComponentScan
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
```

| Annotation | Purpose |
|-----------|---------|
| `@Configuration` | Marks class as source of bean definitions |
| `@EnableAutoConfiguration` | Enable Spring Boot auto-configuration |
| `@ComponentScan` | Scan for components, configurations, services |

## 3. Auto-configuration

Automatically configures beans based on what's on the classpath.

```properties
# Disable specific auto-configuration
spring.autoconfigure.exclude=org.springframework.boot.autoconfigure.data.redis.RedisAutoConfiguration
```

| Dependency Added | Auto-configured |
|-----------------|-----------------|
| `spring-boot-starter-web` | Tomcat, DispatcherServlet, Jackson |
| `spring-boot-starter-data-jpa` | JPA, DataSource, EntityManagerFactory |
| `spring-boot-starter-data-redis` | Redis connection factory |
| `spring-boot-starter-security` | Security filter chain |
| `spring-boot-starter-validation` | Bean validation (Hibernate Validator) |

## 4. Starter Dependencies

Pre-packaged dependency sets for common use cases.

```xml
<!-- Web application -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>

<!-- JPA / Database -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>

<!-- Security -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>

<!-- Validation -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-validation</artifactId>
</dependency>

<!-- Actuator (monitoring) -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>

<!-- Test -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-test</artifactId>
</dependency>
```

## 5. Externalized Configuration

### 5.1. Configuration Files

| File | Format | Priority |
|------|--------|----------|
| `application.properties` | Key=value | Default |
| `application.yml` | YAML | Overrides .properties |
| `application-{profile}.properties` | Profile-specific | Overrides default |

```properties
# application.properties
server.port=8080
spring.application.name=my-app
logging.level.org.springframework=INFO
```

```yaml
# application.yml
server:
  port: 8080
spring:
  application:
    name: my-app
logging:
  level:
    org.springframework: INFO
```

### 5.2. Environment Variables & CLI

```bash
# Environment variable
SERVER_PORT=9000 java -jar app.jar

# Command line
java -jar app.jar --server.port=9000
```

### 5.3. @ConfigurationProperties

Bind properties to a typed object.

```java
// properties
@ConfigurationProperties(prefix = "app")
public class AppProperties {
    private String name;
    private int maxUsers;

    // getters & setters
}

@EnableConfigurationProperties(AppProperties.class)
@SpringBootApplication
public class Application { }
```

```properties
# application.yml
app:
  name: My Application
  max-users: 100
```

## 6. Profiles

Environment-specific configuration.

```java
// Activate profile
@ActiveProfile("dev")  // In tests
```

```properties
# application-dev.properties
spring.datasource.url=jdbc:h2:mem:devdb
logging.level=DEBUG

# application-prod.properties
spring.datasource.url=jdbc:postgresql://prod:5432/mydb
logging.level=WARN
```

```bash
# Activate at runtime
java -jar app.jar --spring.profiles.active=prod
```

## 7. Banner

Customize startup banner in `src/main/resources/banner.txt`.
