# Spring Actuator - Monitoring và Health Checks

## 1. Tổng quan

**Spring Actuator** là module cung cấp các **production-ready endpoints** giúp theo dõi và quản lý ứng dụng Spring Boot trong môi trường production. Actuator giúp developers và operators có cái nhìn tổng quan về trạng thái ứng dụng, metrics, logging, và nhiều thông tin khác mà không cần phải tự implement.

### 1.1. Setup

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

```properties
# application.properties
# Bật các endpoints cần thiết
management.endpoints.web.exposure.include=health,info,metrics,prometheus,loggers,beans,env

# Chi tiết health endpoint
management.endpoint.health.show-details=when_authorized
management.endpoint.health.show-components=when_authorized

# Base path cho actuator (mặc định là /actuator)
management.endpoints.web.base-path=/actuator

# Enable info endpoint
management.info.env.enabled=true
management.info.build.enabled=true

# Prometheus endpoint
management.endpoint.prometheus.enabled=true
management.metrics.export.prometheus.enabled=true
```

---

## 2. Các Endpoint có sẵn

### 2.1. Bảng tổng hợp

| Endpoint | Path | Method | Mô tả |
|---------|------|--------|-------|
| `health` | `/actuator/health` | GET | Trạng thái sức khỏe ứng dụng |
| `info` | `/actuator/info` | GET | Thông tin ứng dụng tùy ý |
| `metrics` | `/actuator/metrics/{name}` | GET | Metrics (JVM, HTTP, DB...) |
| `prometheus` | `/actuator/prometheus` | GET | Metrics định dạng Prometheus |
| `env` | `/actuator/env` | GET/POST | Environment properties |
| `beans` | `/actuator/beans` | GET | Tất cả Spring beans trong container |
| `mappings` | `/actuator/mappings` | GET | Tất cả @RequestMapping paths |
| `configprops` | `/actuator/configprops` | GET | Tất cả @ConfigurationProperties |
| `loggers` | `/actuator/loggers/{name}` | GET/POST | Logger levels |
| `heapdump` | `/actuator/heapdump` | GET | Heap dump file (HPROF) |
| `threaddump` | `/actuator/threaddump` | GET | Thread dump |
| `shutdown` | `/actuator/shutdown` | POST | Graceful shutdown (disabled default) |
| `scheduledtasks` | `/actuator/scheduledtasks` | GET | Scheduled tasks |
| `caches` | `/actuator/caches` | GET/DELETE | Cache information |

### 2.2. Ví dụ sử dụng cơ bản

```bash
# Health check — quan trọng nhất
curl http://localhost:8080/actuator/health
# Response: {"status":"UP"}

# Chi tiết health
curl http://localhost:8080/actuator/health/liveness
curl http://localhost:8080/actuator/health/readiness

# Metrics
curl http://localhost:8080/actuator/metrics/http.server.requests
curl http://localhost:8080/actuator/metrics/jvm.memory.used
curl http://localhost:8080/actuator/metrics/jvm.gc.pause
curl http://localhost:8080/actuator/metrics/hikaricp.connections.active

# Beans — xem tất cả beans
curl http://localhost:8080/actuator/beans | jq '.beanDefinitions[] | .resource'

# Mappings — xem tất cả HTTP routes
curl http://localhost:8080/actuator/mappings | jq '.mappings[].pathPatterns'
```

### 2.3. Các nhóm Health Indicator mặc định

| Tên | Mô tả |
|-----|-------|
| **DB** | Kiểm tra DataSource |
| **DiskSpace** | Kiểm tra dung lượng đĩa |
| **Ping** | Luôn trả về UP |
| **Redis** | Kiểm tra kết nối Redis |
| **Mongo** | Kiểm tra kết nối MongoDB |
| **Rabbit** | Kiểm tra kết nối RabbitMQ |
| **Elasticsearch** | Kiểm tra cluster Elasticsearch |

---

## 3. Custom Health Indicator

### 3.1. Synchronous (Blocking)

```java
@Component
public class DatabaseHealthIndicator implements HealthIndicator {

    @Autowired
    private DataSource dataSource;

    @Override
    public Health health() {
        try (Connection conn = dataSource.getConnection()) {
            DatabaseMetaData meta = conn.getMetaData();
            return Health.up()
                .withDetail("database", meta.getDatabaseProductName())
                .withDetail("version", meta.getDatabaseProductVersion())
                .withDetail("url", conn.getMetaData().getURL())
                .withDetail("connection", "active")
                .withDetail("thread", Thread.currentThread().getName())
                .build();
        } catch (SQLException e) {
            return Health.down()
                .withDetail("error", e.getClass().getSimpleName())
                .withDetail("message", e.getMessage())
                .build();
        }
    }
}
```

### 3.2. Reactive (Non-blocking)

```java
@Component
public class CustomServiceHealthIndicator implements ReactiveHealthIndicator {

    private final WebClient webClient;

    public CustomServiceHealthIndicator(WebClient.Builder builder) {
        this.webClient = builder.baseUrl("https://api.example.com").build();
    }

    @Override
    public Mono<Health> health() {
        return checkExternalService()
            .map(status -> Health.up()
                .withDetail("service", "external-api")
                .withDetail("status", status)
                .build())
            .onErrorResume(e -> Mono.just(
                Health.down()
                    .withDetail("service", "external-api")
                    .withDetail("error", e.getMessage())
                    .build()));
    }

    private Mono<String> checkExternalService() {
        return webClient.get()
            .uri("/health")
            .retrieve()
            .bodyToMono(String.class);
    }
}
```

### 3.3. Health Groups

```properties
# Tạo nhóm health tùy chỉnh
management.endpoint.health.group.custom.include=db,redis,customService
management.endpoint.health.group.custom.show-details=always
management.endpoint.health.group.custom.show-components=always

# Nhóm liveness (Kubernetes)
management.endpoint.health.group.liveness.include=ping
management.endpoint.health.group.liveness.show-details=always

# Nhóm readiness (Kubernetes)
management.endpoint.health.group.readiness.include=db,redis,customService
management.endpoint.health.group.readiness.show-details=always
```

```bash
curl http://localhost:8080/actuator/health/custom
curl http://localhost:8080/actuator/health/liveness
curl http://localhost:8080/actuator/health/readiness
```

---

## 4. Custom Metrics

### 4.1. Micrometer — Common Metrics Interface

Spring Actuator sử dụng **Micrometer** là abstraction layer cho metrics, cho phép plug-in nhiều monitoring systems khác nhau (Prometheus, Datadog, Graphite...).

### 4.2. Counter

Đếm số lần xảy ra sự kiện:

```java
@Service
@RequiredArgsConstructor
public class OrderService {

    private final MeterRegistry meterRegistry;
    private final Counter createdCounter;
    private final Counter failedCounter;

    public OrderService(MeterRegistry meterRegistry) {
        this.meterRegistry = meterRegistry;
        this.createdCounter = Counter.builder("orders.created")
            .description("Number of orders created")
            .tag("application", "order-service")
            .register(meterRegistry);
        this.failedCounter = Counter.builder("orders.failed")
            .description("Number of failed orders")
            .register(meterRegistry);
    }

    public void placeOrder(Order order) {
        try {
            // Xử lý đơn hàng
            validateOrder(order);
            persistOrder(order);
            sendConfirmation(order);
            createdCounter.increment();
        } catch (Exception e) {
            failedCounter.increment();
            throw e;
        }
    }
}
```

### 4.3. Timer

Đo thời gian thực thi:

```java
@Service
@RequiredArgsConstructor
public class ReportService {

    private final MeterRegistry meterRegistry;

    public Report generateReport(String reportType) {
        Timer timer = Timer.builder("report.generation.time")
            .description("Time to generate a report")
            .tag("type", reportType)
            .publishPercentiles(0.5, 0.9, 0.95, 0.99) // p50, p90, p95, p99
            .publishPercentileHistogram()
            .register(meterRegistry);

        return timer.record(() -> {
            // Logic tạo report
            return doGenerateReport(reportType);
        });
    }
}
```

### 4.4. Gauge

Theo dõi giá trị hiện tại:

```java
@Service
public class MonitoringService {

    private final Queue<String> pendingTasks = new ConcurrentLinkedQueue<>();
    private final MeterRegistry meterRegistry;

    public MonitoringService(MeterRegistry meterRegistry) {
        this.meterRegistry = meterRegistry;

        // Gauge — theo dõi số lượng pending tasks
        Gauge.builder("tasks.pending", pendingTasks, Queue::size)
            .description("Number of pending tasks")
            .register(meterRegistry);

        // Gauge — theo dõi cache size
        Gauge.builder("cache.size", this::getCacheSize)
            .description("Current cache size")
            .register(meterRegistry);
    }
}
```

### 4.5. Distribution Summary

Phân phối giá trị (không phải thời gian):

```java
@Service
@RequiredArgsConstructor
public class PaymentService {

    private final MeterRegistry meterRegistry;

    public void processPayment(Payment payment) {
        DistributionSummary.builder("payment.amount")
            .description("Payment amount distribution")
            .tag("currency", payment.getCurrency())
            .publishPercentiles(0.5, 0.9, 0.99)
            .publishPercentileHistogram()
            .baseUnit("currency.unit")
            .register(meterRegistry)
            .record(payment.getAmount().doubleValue());
    }
}
```

### 4.6. Tags và Tags

```java
// CommonTags — áp dụng cho TẤT CẢ metrics
@Bean
public MeterRegistryCustomizer<MeterRegistry> metricsCommonTags() {
    return registry -> registry.config()
        .commonTags("application", springApplicationName)
        .commonTags("environment", environment)
        .commonTags("region", awsRegion);
}
```

---

## 5. Custom Info Contributor

### 5.1. Qua application.properties

```properties
# application.yml
info:
  app:
    name: ${spring.application.name}
    version: 1.0.0
    description: User management microservice
    contact:
      name: Dev Team
      email: dev@example.com
  git:
    enabled: true
  build:
    enabled: true
```

### 5.2. Programmatic InfoContributor

```java
@Component
public class CustomInfoContributor implements InfoContributor {

    private final Environment environment;

    public CustomInfoContributor(Environment environment) {
        this.environment = environment;
    }

    @Override
    public void contribute(Info.Builder builder) {
        builder.withDetail("custom",
            Map.of(
                "feature-flags", Map.of(
                    "new-checkout", true,
                    "beta-api", false
                ),
                "environment", environment.getProperty("spring.profiles.active", "default"),
                "java-version", System.getProperty("java.version")
            ));
    }
}
```

### 5.3. Git Commit Info

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-git-commit-id-starter</artifactId>
</dependency>
```

```properties
management.info.git.mode=full
management.info.git.enabled=true
```

---

## 6. Logging Configuration

### 6.1. Cấu hình trong application.properties

```properties
# Root logger
logging.level.root=INFO

# Package-specific levels
logging.level.com.example=DEBUG
logging.level.org.springframework.web=WARN
logging.level.org.springframework.security=INFO
logging.level.org.hibernate.SQL=DEBUG
logging.level.org.hibernate.type.descriptor.sql.BasicBinder=TRACE

# Pattern
logging.pattern.console=%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{36} - %msg%n
logging.pattern.file=%d{yyyy-MM-dd HH:mm:ss.SSS} [%thread] %-5level %logger{60} - %msg%n

# File logging
logging.file.name=logs/application.log
logging.file.max-size=10MB
logging.file.max-history=30
```

### 6.2. Thay đổi Log Level khi Runtime

```bash
# Xem log level hiện tại
curl http://localhost:8080/actuator/loggers/com.example.service

# Đặt log level
curl -X POST http://localhost:8080/actuator/loggers/com.example.service \
  -H "Content-Type: application/json" \
  -d '{"configuredLevel":"DEBUG"}'

# Xóa configured level (quay về default)
curl -X POST http://localhost:8080/actuator/loggers/com.example.service \
  -H "Content-Type: application/json" \
  -d '{"configuredLevel":null}'
```

---

## 7. Prometheus Integration

### 7.1. Setup

```xml
<dependency>
    <groupId>io.micrometer</groupId>
    <artifactId>micrometer-registry-prometheus</artifactId>
</dependency>
```

```yaml
# prometheus.yml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: 'spring-boot-app'
    metrics_path: '/actuator/prometheus'
    static_configs:
      - targets: ['localhost:8080']
    scrape_interval: 5s

  - job_name: 'spring-boot-app-prod'
    metrics_path: '/actuator/prometheus'
    static_configs:
      - targets: ['prod-server-1:8080', 'prod-server-2:8080']
```

### 7.2. Các Metrics quan trọng

| Metric | Mô tả |
|--------|-------|
| `http_server_requests_seconds` | Thời gian HTTP request (có labels: uri, method, status) |
| `jvm_memory_used_bytes` | JVM memory đã sử dụng (có labels: area, id) |
| `jvm_gc_pause_seconds` | GC pause times |
| `hikaricp_connections_active` | Số kết nối DB đang active |
| `hikaricp_connections_idle` | Số kết nối DB đang idle |
| `process_uptime_seconds` | Thời gian uptime của ứng dụng |
| `process_files_open_files` | Số file đang mở |
| `logback_events_total` | Số log events theo level |
| `thread_pool_executor_active_threads` | Số thread đang active trong executor |

---

## 8. Grafana Dashboard

### 8.1. JVM Metrics Dashboard

```
# JVM Memory Usage
jvm_memory_used_bytes{area="heap"} / jvm_memory_max_bytes{area="heap"}
-> Heap usage percentage

# GC Pause Time
rate(jvm_gc_pause_seconds_sum[5m]) / rate(jvm_gc_pause_seconds_count[5m])
-> Average GC pause time

# Thread Count
jvm_threads_live_threads
-> Current live threads
```

### 8.2. HTTP Request Dashboard

```
# Request Rate (per second)
rate(http_server_requests_seconds_count[1m])

# Error Rate
rate(http_server_requests_seconds_count{status=~"5.."}[1m])

# Latency P99
histogram_quantile(0.99, rate(http_server_requests_seconds_bucket[5m]))

# Latency P95
histogram_quantile(0.95, rate(http_server_requests_seconds_bucket[5m]))
```

---

## 9. Distributed Tracing với Micrometer + Zipkin

### 9.1. Setup

```xml
<dependency>
    <groupId>io.micrometer</groupId>
    <artifactId>micrometer-tracing-bridge-brave</artifactId>
</dependency>
<dependency>
    <groupId>io.zipkin.reporter2</groupId>
    <artifactId>zipkin-reporter-brave</artifactId>
</dependency>
```

```properties
# Distributed tracing configuration
management.tracing.sampling.probability=1.0
spring.zipkin.base-url=http://localhost:9411
spring.zipkin.compression.enabled=true
spring.sleuth.propagation.type=W3C,B3
```

### 9.2. Custom Span

```java
@Service
@RequiredArgsConstructor
public class OrderProcessingService {

    private final Tracer tracer;

    public void processOrder(Order order) {
        // Tạo span con
        Span span = tracer.nextSpan().name("processOrder").start();

        try (Tracer.SpanInScope ignored = tracer.withSpanInScope(span)) {
            span.tag("order.id", order.getId().toString());
            span.tag("order.amount", order.getAmount().toString());

            validateOrder(order);
            chargePayment(order);
            fulfillOrder(order);

        } catch (Exception e) {
            span.error(e);
            throw e;
        } finally {
            span.end();
        }
    }
}
```

---

## 10. Security Considerations

### 10.1. Bảo mật Actuator Endpoints

```properties
# Chỉ expose endpoints an toàn
management.endpoints.web.exposure.include=health,info,metrics,prometheus
management.endpoints.web.exposure.exclude=env,beans,configprops,heapdump,threaddump

# Chi tiết health chỉ cho admin
management.endpoint.health.show-details=when_authorized

# Disable sensitive endpoints hoàn toàn
management.endpoint.shutdown.enabled=false
management.endpoint.env.enabled=false
management.endpoint.heapdump.enabled=false
```

```java
@Configuration
public class ActuatorSecurityConfig {

    @Bean
    public SecurityFilterChain actuatorSecurityFilterChain(HttpSecurity http) throws Exception {
        http
            .requestMatcher(EndpointRequest.to("health", "info", "metrics", "prometheus"))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/actuator/health/**").permitAll()
                .requestMatchers("/actuator/info").permitAll()
                .requestMatchers("/actuator/metrics").hasRole("ADMIN")
                .requestMatchers("/actuator/prometheus").hasRole("ADMIN")
            );
        return http.build();
    }
}
```

---

## 11. Kubernetes Probes

```yaml
# Kubernetes deployment.yaml
livenessProbe:
  httpGet:
    path: /actuator/health/liveness
    port: 8080
  initialDelaySeconds: 30
  periodSeconds: 10
  timeoutSeconds: 5
  failureThreshold: 3

readinessProbe:
  httpGet:
    path: /actuator/health/readiness
    port: 8080
  initialDelaySeconds: 10
  periodSeconds: 5
  timeoutSeconds: 3
  failureThreshold: 3
```

> **Lưu ý**: Trong Kubernetes, `livenessProbe` kiểm tra xem app có cần restart không. `readinessProbe` kiểm tra xem app có sẵn sàng nhận traffic không.
