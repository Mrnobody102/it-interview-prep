# Spring Boot Actuator & Monitoring

## 1. Overview

Spring Boot Actuator provides production-ready monitoring and management features via HTTP endpoints and JMX. It exposes health checks, metrics, environment info, and more out of the box.

### 1.1. Dependency

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>

<!-- For Prometheus integration -->
<dependency>
    <groupId>io.micrometer</groupId>
    <artifactId>micrometer-registry-prometheus</artifactId>
</dependency>
```

---

## 2. Key Endpoints

### 2.1. Endpoint Reference

| Endpoint | URL | Description |
|----------|-----|-------------|
| **health** | `/actuator/health` | Application health status |
| **info** | `/actuator/info` | Arbitrary application info |
| **metrics** | `/actuator/metrics/{name}` | Application metrics |
| **env** | `/actuator/env` | Environment properties |
| **loggers** | `/actuator/loggers` | Logger configuration |
| **beans** | `/actuator/beans` | All Spring beans |
| **mappings** | `/actuator/mappings` | All URL mappings |
| **threaddump** | `/actuator/threaddump` | Thread dump |
| **heapdump** | `/actuator/heapdump` | Heap dump (binary) |
| **scheduledtasks** | `/actuator/scheduledtasks` | Scheduled tasks |
| **caches** | `/actuator/caches` | Cache information |

### 2.2. Health Endpoint Details

```bash
# Basic health check
GET /actuator/health

# Response
{
  "status": "UP",
  "components": {
    "db": {
      "status": "UP",
      "details": {
        "database": "PostgreSQL",
        "validationQuery": "isValid()"
      }
    },
    "diskSpace": {
      "status": "UP",
      "details": {
        "total": 500000000000,
        "free": 300000000000,
        "threshold": 10485760
      }
    },
    "ping": { "status": "UP" },
    "redis": {
      "status": "UP",
      "details": { "version": "7.0.0" }
    }
  }
}
```

### 2.3. Metrics Endpoint

```bash
# All available metrics
GET /actuator/metrics

# Specific metric
GET /actuator/metrics/jvm.memory.used
GET /actuator/metrics/http.server.requests
GET /actuator/metrics/process.cpu.usage

# Response for jvm.memory.used
{
  "name": "jvm.memory.used",
  "description": "The amount of used memory",
  "baseUnit": "bytes",
  "measurements": [
    { "statistic": "VALUE", "value": 254321000 }
  ],
  "availableTags": [
    { "tag": "area", "values": ["heap", "nonheap"] },
    { "tag": "id", "values": ["PS Eden Space", "PS Old Gen"] }
  ]
}
```

---

## 3. Configuration

### 3.1. Exposing Endpoints

```yaml
# application.yml
management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics,env,loggers,beans,mappings,threaddump
        exclude: heapdump,threaddump  # Exclude sensitive ones
      base-path: /actuator            # Default: /actuator
  endpoint:
    health:
      show-details: when_authorized   # never | always | when_authorized
      probes:
        enabled: true                 # Liveness and Readiness probes for K8s
    metrics:
      enabled: true
  health:
    db:
      enabled: true
    redis:
      enabled: true
```

### 3.2. Health Check Groups

```yaml
management:
  endpoint:
    health:
      show-details: when_authorized
      group:
        liveness:
          include: livenessState,db,redis
        readiness:
          include: readinessState,db,redis,customReadinessCheck
```

### 3.3. Info Endpoint

```yaml
# application.yml - static info
info:
  app:
    name: itinterviewprep
    version: 1.0.0
    description: IT Interview Preparation App
  build:
    artifact: @project.artifactId@
    name: @project.name@
    version: @project.version@
  java:
    version: @java.version@
    vendor: @java.vendor@
```

```bash
# GET /actuator/info
{
  "app": {
    "name": "itinterviewprep",
    "version": "1.0.0",
    "description": "IT Interview Preparation App"
  },
  "build": {
    "artifact": "itinterviewprep",
    "name": "itinterviewprep",
    "version": "1.0.0"
  },
  "java": {
    "version": "17.0.9",
    "vendor": "Eclipse Adoptium"
  }
}
```

---

## 4. Custom Health Indicators

### 4.1. Custom Health Indicator

```java
@Component
public class CustomHealthIndicator implements HealthIndicator {

    @Autowired
    private EmailService emailService;

    @Override
    public Health health() {
        try {
            boolean emailHealthy = emailService.isServerResponding();

            if (emailHealthy) {
                return Health.up()
                    .withDetail("smtp", "connected")
                    .withDetail("responseTime", "50ms")
                    .build();
            } else {
                return Health.down()
                    .withDetail("error", "SMTP server not responding")
                    .build();
            }
        } catch (Exception e) {
            return Health.down()
                .withException(e)
                .withDetail("error", e.getMessage())
                .build();
        }
    }
}
```

### 4.2. Database Connection Health

```java
@Component
public class DatabaseHealthIndicator extends DataSourceHealthIndicator {

    public DatabaseHealthIndicator(DataSource dataSource) {
        super(dataSource, "Database");
    }
}
```

### 4.3. Reactive Health Indicator

```java
@Component
public class ExternalApiHealthIndicator implements ReactiveHealthIndicator {

    @Autowired
    private WebClient webClient;

    @Override
    public Mono<Health> health() {
        return webClient.get()
            .uri("https://api.example.com/health")
            .retrieve()
            .bodyToMono(String.class)
            .map(response -> Health.up().withDetail("api", "OK").build())
            .onErrorResume(ex -> Mono.just(
                Health.down().withException(ex).build()
            ));
    }
}
```

---

## 5. Custom Metrics with Micrometer

### 5.1. Counter

Tracks how many times something happened.

```java
@Service
public class OrderService {

    private final Counter orderCreatedCounter;
    private final Counter orderFailedCounter;

    public OrderService(MeterRegistry meterRegistry) {
        this.orderCreatedCounter = Counter.builder("orders.created")
            .description("Number of orders created")
            .tag("service", "order-service")
            .register(meterRegistry);

        this.orderFailedCounter = Counter.builder("orders.failed")
            .description("Number of failed orders")
            .tag("service", "order-service")
            .register(meterRegistry);
    }

    @Transactional
    public Order createOrder(OrderDTO dto) {
        try {
            Order order = orderRepository.save(toEntity(dto));
            orderCreatedCounter.increment();
            return order;
        } catch (Exception e) {
            orderFailedCounter.increment();
            throw e;
        }
    }
}
```

### 5.2. Timer / Gauge

```java
@Service
public class ReportService {

    private final Timer reportGenerationTimer;

    public ReportService(MeterRegistry meterRegistry) {
        this.reportGenerationTimer = Timer.builder("report.generation.time")
            .description("Time taken to generate reports")
            .tag("type", "monthly")
            .publishPercentiles(0.5, 0.9, 0.95, 0.99)
            .register(meterRegistry);
    }

    public Report generateMonthlyReport(LocalDate month) {
        return reportGenerationTimer.record(() -> {
            // Report generation logic
            return buildReport(month);
        });
    }
}
```

```java
// Gauge - for monitoring current values
@Component
public class QueueMetrics {

    private final AtomicInteger queueSize = new AtomicInteger(0);

    public QueueMetrics(MeterRegistry meterRegistry) {
        Gauge.builder("queue.size", queueSize, AtomicInteger::get)
            .description("Current queue size")
            .tag("queue", "email")
            .register(meterRegistry);
    }

    public void addToQueue() {
        queueSize.incrementAndGet();
    }

    public void removeFromQueue() {
        queueSize.decrementAndGet();
    }
}
```

### 5.3. Distributed Tracing with Micrometer

```java
@Configuration
public class TracingConfig {

    @Bean
    public ObservationRegistry observationRegistry(ObservationHandler<KafkaTracingObservationHandler> handler) {
        ObservationRegistry registry = ObservationRegistry.create();
        registry.observationConfig().observationHandler(handler);
        return registry;
    }
}

// Using @Observed annotation
@Service
public class UserService {

    @Observed(name = "user.registration", contextualName = "user-registration-process")
    public User registerUser(RegistrationRequest request) {
        // Method execution is traced
        return userRepository.save(toEntity(request));
    }
}
```

---

## 6. Prometheus Integration

### 6.1. Setup

```yaml
management:
  endpoints:
    web:
      exposure:
        include: "*"          # Expose all endpoints
  metrics:
    tags:
      application: ${spring.application.name}
  prometheus:
    metrics:
      export:
        enabled: true
```

### 6.2. Prometheus Scrape Config

```yaml
# prometheus.yml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'spring-boot-app'
    metrics_path: '/actuator/prometheus'
    static_configs:
      - targets: ['localhost:8080']
    relabel_configs:
      - source_labels: [__address__]
        target_label: instance
```

### 6.3. Grafana Dashboard

Create panels for key metrics:

```
# JVM Metrics
jvm_memory_used{area="heap"} / jvm_memory_max{area="heap"} * 100
# Target: < 80%

# HTTP Request Rate
rate(http_server_requests_seconds_count{uri="/api/..."}[5m])
# Target: > 0 for critical endpoints

# HTTP Latency P99
histogram_quantile(0.99, rate(http_server_requests_seconds_sum[5m]) / rate(http_server_requests_seconds_count[5m]))
# Target: < 200ms

# Database Connection Pool
hikaricp_connections_active{pool="HikariPool-1"}
hikaricp_connections_idle{pool="HikariPool-1"}
hikaricp_connections_pending{pool="HikariPool-1"}
# Target: pending < 5

# Custom Business Metrics
orders_created_total
orders_failed_total
```

---

## 7. Logging Configuration

### 7.1. Logback Configuration

```xml
<!-- resources/logback-spring.xml -->
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <include resource="org/springframework/boot/logging/logback/defaults.xml"/>

    <property name="LOG_FILE" value="${LOG_FILE:-${LOG_PATH:-${LOG_TEMP:-${java.io.tmpdir:-/tmp}}}/spring.log}"/>
    <property name="CONSOLE_LOG_PATTERN" value="%d{yyyy-MM-dd HH:mm:ss.SSS} %highlight(%-5level) [%thread] %cyan(%logger{36}) - %msg%n"/>
    <property name="FILE_LOG_PATTERN" value="%d{yyyy-MM-dd HH:mm:ss.SSS} %-5level [%thread] %logger{36} - %msg%n"/>

    <!-- Console Appender -->
    <appender name="CONSOLE" class="ch.qos.logback.core.ConsoleAppender">
        <encoder>
            <pattern>${CONSOLE_LOG_PATTERN}</pattern>
        </encoder>
    </appender>

    <!-- File Appender with rolling -->
    <appender name="FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <file>${LOG_FILE}</file>
        <rollingPolicy class="ch.qos.logback.core.rolling.SizeAndTimeBasedRollingPolicy">
            <fileNamePattern>${LOG_FILE}.%d{yyyy-MM-dd}.%i.gz</fileNamePattern>
            <maxFileSize>100MB</maxFileSize>
            <maxHistory>30</maxHistory>
            <totalSizeCap>3GB</totalSizeCap>
        </rollingPolicy>
        <encoder>
            <pattern>${FILE_LOG_PATTERN}</pattern>
        </encoder>
    </appender>

    <!-- JSON Appender for ELK Stack -->
    <appender name="JSON_CONSOLE" class="ch.qos.logback.core.ConsoleAppender">
        <encoder class="ch.qos.logback.classic.encoder.PatternLayoutEncoder">
            <pattern>{"timestamp":"%d{yyyy-MM-dd'T'HH:mm:ss.SSSZ}","level":"%level","logger":"%logger{36}","thread":"%thread","message":"%msg","context":"application"}%n</pattern>
        </encoder>
    </appender>

    <!-- Async Appender for performance -->
    <appender name="ASYNC_FILE" class="ch.qos.logback.classic.AsyncAppender">
        <appender-ref ref="FILE"/>
        <queueSize>512</queueSize>
        <discardingThreshold>0</discardingThreshold>
    </appender>

    <!-- Spring profile-specific logging -->
    <springProfile name="dev">
        <root level="INFO">
            <appender-ref ref="CONSOLE"/>
        </root>
        <logger name="com.example" level="DEBUG"/>
        <logger name="org.springframework.web" level="DEBUG"/>
        <logger name="org.hibernate.SQL" level="DEBUG"/>
    </springProfile>

    <springProfile name="prod">
        <root level="WARN">
            <appender-ref ref="ASYNC_FILE"/>
        </root>
        <logger name="com.example" level="INFO"/>
        <logger name="org.springframework.web" level="WARN"/>
        <logger name="org.hibernate" level="WARN"/>
    </springProfile>
</configuration>
```

### 7.2. Application.yml Logging Config

```yaml
logging:
  level:
    root: INFO
    com.example: DEBUG
    org.springframework.web: DEBUG
    org.hibernate.SQL: DEBUG
    org.hibernate.type.descriptor.sql.BasicBinder: TRACE
  pattern:
    console: "%d{yyyy-MM-dd HH:mm:ss} %-5level [%thread] %logger{36} - %msg%n"
    file: "%d{yyyy-MM-dd HH:mm:ss.SSS} %-5level [%thread] %logger{36} - %msg%n"
  file:
    name: logs/application.log
    max-size: 100MB
    max-history: 30
```

### 7.3. Dynamic Logging via Actuator

```bash
# Set logger level
POST /actuator/loggers/com.example.service
Content-Type: application/json

{"configuredLevel": "DEBUG"}

# Reset to default
POST /actuator/loggers/com.example.service
Content-Type: application/json

{"configuredLevel": null}
```

---

## 8. Thread Dump & Analysis

### 8.1. Thread Dump Endpoint

```bash
GET /actuator/threaddump

# Response structure
{
  "threads": [
    {
      "threadName": "http-nio-8080-exec-1",
      "threadId": 34,
      "blockedTime": -1,
      "blockedCount": 0,
      "waitedTime": -1,
      "waitedCount": 0,
      "lockName": null,
      "lockOwnerId": -1,
      "lockOwnerName": null,
      "state": "RUNNABLE",
      "stackTrace": [
        {
          "className": "java.net.SocketInputStream",
          "methodName": "socketRead0",
          "fileName": "SocketInputStream.java",
          "lineNumber": -2
        }
      ],
      "lockedMonitors": [],
      "lockedSynchronizers": []
    }
  ]
}
```

### 8.2. Common Thread Analysis Patterns

| Pattern | Description | Severity |
|---------|-------------|---------|
| **RUNNABLE** | Actively executing | Normal |
| **BLOCKED** | Waiting for monitor lock | High - investigate |
| **WAITING** | Waiting indefinitely (Object.wait, LockSupport.park) | Medium |
| **TIMED_WAITING** | Waiting with timeout | Low |
| **DEADLOCK** | Two or more threads waiting for each other's locks | Critical |

---

## 9. Production Monitoring Checklist

### 9.1. Essential Endpoints to Expose

```yaml
management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics,env,loggers,beans,mappings
  health:
    db:
      enabled: true
    redis:
      enabled: true
  endpoint:
    health:
      show-details: when_authorized
      probes:
        enabled: true  # K8s liveness/readiness
```

### 9.2. Alerting Rules (Prometheus)

```yaml
# alerts.yml
groups:
  - name: spring-boot-alerts
    rules:
      - alert: HighMemoryUsage
        expr: jvm_memory_used{area="heap"} / jvm_memory_max{area="heap"} > 0.85
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "JVM heap usage above 85%"

      - alert: HighResponseTime
        expr: histogram_quantile(0.95, rate(http_server_requests_seconds_sum[5m]) / rate(http_server_requests_seconds_count[5m])) > 1
        for: 5m
        labels:
          severity: critical

      - alert: DatabaseConnectionPoolExhausted
        expr: hikaricp_connections_pending > 5
        for: 2m
        labels:
          severity: critical
```

### 9.3. Kubernetes Probes

```yaml
# deployment.yaml
livenessProbe:
  httpGet:
    path: /actuator/health/liveness
    port: 8080
  initialDelaySeconds: 30
  periodSeconds: 10

readinessProbe:
  httpGet:
    path: /actuator/health/readiness
    port: 8080
  initialDelaySeconds: 5
  periodSeconds: 5
```
