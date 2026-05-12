# Spring Boot Actuator & Monitoring

## 1. Tổng quan

**Spring Boot Actuator** cung cấp các endpoint để kiểm tra và quan sát ứng dụng khi chạy production: app còn sống không, có sẵn nhận traffic không, dùng bao nhiêu memory, route nào đang có, log level hiện tại là gì.

Nói đơn giản: Actuator là "bảng điều khiển kỹ thuật" của Spring Boot app. Kubernetes, Prometheus hoặc operator có thể gọi các endpoint này để health check và giám sát.

### 1.1. Dependency

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>

<!-- Tích hợp Prometheus -->
<dependency>
    <groupId>io.micrometer</groupId>
    <artifactId>micrometer-registry-prometheus</artifactId>
</dependency>
```

---

## 2. Các Endpoint chính

**Endpoint** ở đây là URL do Actuator mở ra, ví dụ `/actuator/health`.

### 2.1. Bảng tham chiếu Endpoint

| Endpoint | URL | Mô tả |
|----------|-----|-------|
| **health** | `/actuator/health` | Trạng thái sức khỏe ứng dụng |
| **info** | `/actuator/info` | Thông tin ứng dụng tùy ý |
| **metrics** | `/actuator/metrics/{name}` | Chỉ số của ứng dụng |
| **env** | `/actuator/env` | Thuộc tính môi trường |
| **loggers** | `/actuator/loggers` | Cấu hình logger |
| **beans** | `/actuator/beans` | Tất cả Spring beans |
| **mappings** | `/actuator/mappings` | Tất cả URL mappings |
| **threaddump** | `/actuator/threaddump` | Thread dump |
| **heapdump** | `/actuator/heapdump` | Heap dump file, có thể rất nhạy cảm |
| **scheduledtasks** | `/actuator/scheduledtasks` | Các task chạy định kỳ |
| **caches** | `/actuator/caches` | Thông tin cache |

### 2.2. Chi tiết Health Endpoint

```bash
# Kiểm tra sức khỏe cơ bản
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
# Tat ca metrics co san
GET /actuator/metrics

# Metric cu the
GET /actuator/metrics/jvm.memory.used
GET /actuator/metrics/http.server.requests
GET /actuator/metrics/process.cpu.usage

# Response cho jvm.memory.used
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

## 3. Cấu hình

### 3.1. Exposing Endpoints

```yaml
# application.yml
management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics,env,loggers,beans,mappings,threaddump
        exclude: heapdump,threaddump  # Loại bỏ những endpoint nhạy cảm
      base-path: /actuator            # Mac dinh: /actuator
  endpoint:
    health:
      show-details: when_authorized   # never | always | when_authorized
      probes:
        enabled: true                 # Liveness va Readiness probes cho K8s
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
# application.yml - thông tin tĩnh
info:
  app:
    name: itinterviewprep
    version: 1.0.0
    description: Ứng dụng ôn tập phỏng vấn IT
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
    "description": "Ứng dụng ôn tập phỏng vấn IT"
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

## 5. Custom metrics với Micrometer

### 5.1. Counter

Theo dõi số lần xuất hiện của một sự kiện.

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
// Gauge - cho giá trị hiện tại
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

### 5.3. Distributed tracing với Micrometer

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

// Dùng @Observed annotation
@Service
public class UserService {

    @Observed(name = "user.registration", contextualName = "user-registration-process")
    public User registerUser(RegistrationRequest request) {
        // Method execution được trace
        return userRepository.save(toEntity(request));
    }
}
```

---

## 6. Tích hợp Prometheus

### 6.1. Setup

```yaml
management:
  endpoints:
    web:
      exposure:
        include: "*"          # Expose tất cả endpoints
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

Tạo các panel cho metrics chính:

```
# JVM Metrics
jvm_memory_used{area="heap"} / jvm_memory_max{area="heap"} * 100
# Mục tiêu: < 80%

# HTTP Request Rate
rate(http_server_requests_seconds_count{uri="/api/..."}[5m])
# Mục tiêu: > 0 cho các endpoint quan trọng

# HTTP Latency P99
histogram_quantile(0.99, rate(http_server_requests_seconds_sum[5m]) / rate(http_server_requests_seconds_count[5m]))
# Mục tiêu: < 200ms

# Database Connection Pool
hikaricp_connections_active{pool="HikariPool-1"}
hikaricp_connections_idle{pool="HikariPool-1"}
hikaricp_connections_pending{pool="HikariPool-1"}
# Mục tiêu: pending < 5

# Custom Business Metrics
orders_created_total
orders_failed_total
```

---

## 7. Cấu hình logging

### 7.1. Cấu hình Logback

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

    <!-- File Appender với rolling -->
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

    <!-- JSON Appender cho ELK Stack -->
    <appender name="JSON_CONSOLE" class="ch.qos.logback.core.ConsoleAppender">
        <encoder class="ch.qos.logback.classic.encoder.PatternLayoutEncoder">
            <pattern>{"timestamp":"%d{yyyy-MM-dd'T'HH:mm:ss.SSSZ}","level":"%level","logger":"%logger{36}","thread":"%thread","message":"%msg","context":"application"}%n</pattern>
        </encoder>
    </appender>

    <!-- Async Appender de cai thien hieu suat -->
    <appender name="ASYNC_FILE" class="ch.qos.logback.classic.AsyncAppender">
        <appender-ref ref="FILE"/>
        <queueSize>512</queueSize>
        <discardingThreshold>0</discardingThreshold>
    </appender>

    <!-- Logging theo Spring profile -->
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

### 7.3. Dynamic Logging qua Actuator

```bash
# Dat muc do logger
POST /actuator/loggers/com.example.service
Content-Type: application/json

{"configuredLevel": "DEBUG"}

# Reset về mặc định
POST /actuator/loggers/com.example.service
Content-Type: application/json

{"configuredLevel": null}
```

---

## 8. Thread dump & phân tích

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

### 8.2. Các mẫu phân tích thread thường gặp

| Mẫu | Mô tả | Mức độ |
|---------|-------------|---------|
| **RUNNABLE** | Đang thực thi tích cực | Bình thường |
| **BLOCKED** | Đang chờ monitor lock | Cao - cần tìm hiểu |
| **WAITING** | Đang chờ vô hạn (Object.wait, LockSupport.park) | Trung bình |
| **TIMED_WAITING** | Đang chờ với timeout | Thấp |
| **DEADLOCK** | Hai hoặc nhiều thread đang chờ nhau | Nghiêm trọng |

---

## 9. Checklist Monitoring Production

### 9.1. Các endpoint cần expose

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

### 9.2. Quy tắc alerting (Prometheus)

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
