# Spring Actuator & Monitoring

## 1. Setup

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

```properties
# application.properties
management.endpoints.web.exposure.include=health,info,metrics,prometheus
management.endpoint.health.show-details=when_authorized
management.info.env.enabled=true
```

## 2. Built-in Endpoints

| Endpoint | Path | Description |
|---------|------|-------------|
| health | `/actuator/health` | Application health status |
| info | `/actuator/info` | Arbitrary app info |
| metrics | `/actuator/metrics/{name}` | Metrics (JVM, HTTP, DB) |
| prometheus | `/actuator/prometheus` | Prometheus-format metrics |
| env | `/actuator/env` | Environment properties |
| beans | `/actuator/beans` | All Spring beans |
| mappings | `/actuator/mappings` | All @RequestMapping paths |
| configprops | `/actuator/configprops` | @ConfigurationProperties |
| loggers | `/actuator/loggers/{name}` | Logger levels |
| heapdump | `/actuator/heapdump` | Heap dump (Hprof) |
| threaddump | `/actuator/threaddump` | Thread dump |
| shutdown | `/actuator/shutdown` | Graceful shutdown (disabled by default) |

```bash
curl http://localhost:8080/actuator/health
# {"status":"UP"}

curl http://localhost:8080/actuator/metrics/http.server.requests
curl http://localhost:8080/actuator/metrics/jvm.memory.used
```

## 3. Custom Health Indicator

```java
@Component
public class DatabaseHealthIndicator implements HealthIndicator {

    @Autowired
    private DataSource dataSource;

    @Override
    public Health health() {
        try (Connection conn = dataSource.getConnection()) {
            return Health.up()
                .withDetail("database", conn.getCatalog())
                .withDetail("connection", "active")
                .build();
        } catch (SQLException e) {
            return Health.down()
                .withDetail("error", e.getMessage())
                .build();
        }
    }
}

// Reactive
@Component
public class CustomServiceHealthIndicator
        implements ReactiveHealthIndicator {

    @Override
    public Mono<Health> health() {
        return checkCustomService()
            .map(s -> Health.up().withDetail("service", s).build())
            .onErrorResume(e -> Mono.just(
                Health.down().withDetail("error", e.getMessage()).build()));
    }
}
```

## 4. Custom Metrics

```java
@Service
public class OrderService {

    private final MeterRegistry meterRegistry;

    public OrderService(MeterRegistry meterRegistry) {
        this.meterRegistry = meterRegistry;
    }

    public void placeOrder(Order order) {
        // Counter
        Counter.builder("orders.created")
            .description("Number of orders created")
            .tag("status", order.getStatus())
            .register(meterRegistry)
            .increment();

        // Timer
        Timer timer = Timer.builder("orders.processing.time")
            .description("Order processing time")
            .register(meterRegistry);

        timer.record(() -> {
            // Processing logic
        });

        // Gauge
        Gauge.builder("orders.pending", pendingOrders, List::size)
            .register(meterRegistry);

        // Summary / Distribution Summary
        DistributionSummary.builder("orders.amount")
            .description("Order amount distribution")
            .register(meterRegistry)
            .record(order.getAmount().doubleValue());
    }
}
```

## 5. Custom Info Contributor

```properties
# application.properties
info.app.name=My Application
info.app.version=1.0.0
info.app.description=User management service
```

```java
// Programmatic
@Component
public class CustomInfoContributor implements InfoContributor {

    @Override
    public void contribute(Info.Builder builder) {
        builder.withDetail("custom",
            Map.of("key", "value", "build", getBuildInfo()));
    }
}

// Git info
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-git-commit-id-starter</artifactId>
</dependency>
```

## 6. Logging Configuration

```properties
# application.properties
logging.level.root=INFO
logging.level.com.example=DEBUG
logging.level.org.springframework.web=WARN
logging.pattern.console=%d{yyyy-MM-dd HH:mm:ss} - %msg%n
```

```bash
# Change log level at runtime
curl -X POST http://localhost:8080/actuator/loggers/com.example.service \
  -H "Content-Type: application/json" \
  -d '{"configuredLevel":"DEBUG"}'
```

## 7. Prometheus & Grafana

### 7.1. Prometheus Setup

```xml
<dependency>
    <groupId>io.micrometer</groupId>
    <artifactId>micrometer-registry-prometheus</artifactId>
</dependency>
```

```yaml
# prometheus.yml
scrape_configs:
  - job_name: 'spring-boot-app'
    metrics_path: '/actuator/prometheus'
    static_configs:
      - targets: ['localhost:8080']
```

### 7.2. Grafana Dashboard

Popular Spring Boot metrics:
- `http_server_requests_seconds` — HTTP request duration
- `jvm_memory_used_bytes` — JVM memory usage
- `jvm_gc_pause_seconds` — GC pause times
- `hikaricp_connections_active` — DB connection pool
- `process_uptime_seconds` — Application uptime

## 8. Distributed Tracing (Micrometer + Zipkin)

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
management.tracing.sampling.probability=1.0
spring.zipkin.base-url=http://localhost:9411
```

## 9. Health Groups

```properties
management.endpoint.health.group.custom.include=db,redis,customService
management.endpoint.health.group.custom.show-details=always
```

```bash
curl http://localhost:8080/actuator/health/custom
```
