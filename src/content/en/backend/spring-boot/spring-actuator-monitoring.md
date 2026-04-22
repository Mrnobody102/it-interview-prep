# Spring Actuator & Monitoring

## 1. Overview

Actuator exposes production-focused endpoints for health, metrics, logging, environment inspection, and operational visibility.

### 1.1. Setup

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

```properties
management.endpoints.web.exposure.include=health,info,metrics,prometheus,loggers
management.endpoint.health.show-details=when_authorized
management.info.env.enabled=true
```

In production, teams usually expose only a controlled subset of endpoints and treat Actuator as operational infrastructure, not as a public application API.

The better you separate business traffic from operational traffic, the easier it is to secure and reason about both.

That separation also makes incident handling cleaner because operational tooling is not mixed with user-facing endpoints.

It also makes it easier to apply different authentication and network policies.

## 2. Built-in Endpoints

### 2.1. Summary table

| Endpoint | Path | Description |
|---|---|---|
| health | `/actuator/health` | Overall health |
| info | `/actuator/info` | App metadata |
| metrics | `/actuator/metrics` | Metric registry |
| prometheus | `/actuator/prometheus` | Prometheus scrape output |
| env | `/actuator/env` | Environment properties |
| loggers | `/actuator/loggers` | Runtime log levels |
| beans | `/actuator/beans` | Bean graph |
| mappings | `/actuator/mappings` | Request mappings |

### 2.2. Basic usage examples

```bash
curl http://localhost:8080/actuator/health
curl http://localhost:8080/actuator/info
curl http://localhost:8080/actuator/metrics/http.server.requests
```

In day-to-day operations, these endpoints are useful for very different audiences:

- `health` for orchestrators and load balancers
- `info` for humans during deploy and incident checks
- `metrics` for dashboards and alerting systems

Treating them as separate operational surfaces usually leads to cleaner security decisions.

### 2.3. Default health indicators

Common default indicators include:

- database
- disk space
- Redis
- RabbitMQ
- custom infrastructure clients if registered

The exact list depends on what is on the classpath.

That is a useful debugging clue: adding a dependency can also add new health contributors or metrics automatically.

It also means operational behavior can change after dependency upgrades even when no application code changed.

For observability-heavy systems, that is useful but worth validating during upgrade testing.

Operational surprises are still surprises, even when they come from helpful defaults.

It is also worth deciding which indicators are critical and which are informational.

Not every degraded dependency should necessarily make the whole service "down" from the point of view of traffic routing.

## 3. Custom Health Indicator

### 3.1. Synchronous (blocking)

```java
@Component
public class DatabaseHealthIndicator implements HealthIndicator {

    private final DataSource dataSource;

    public DatabaseHealthIndicator(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Override
    public Health health() {
        try (Connection ignored = dataSource.getConnection()) {
            return Health.up().withDetail("database", "reachable").build();
        } catch (SQLException ex) {
            return Health.down().withDetail("error", ex.getMessage()).build();
        }
    }
}
```

### 3.2. Reactive (non-blocking)

```java
@Component
public class SearchServiceHealthIndicator implements ReactiveHealthIndicator {

    @Override
    public Mono<Health> health() {
        return pingSearchService()
            .map(result -> Health.up().withDetail("search", result).build())
            .onErrorResume(ex -> Mono.just(
                Health.down().withDetail("error", ex.getMessage()).build()
            ));
    }
}
```

### 3.3. Health groups

```properties
management.endpoint.health.group.readiness.include=db,redis
management.endpoint.health.group.liveness.include=ping
```

Health groups are especially useful for Kubernetes probes and gateway-facing readiness checks.

They let you answer different operational questions separately, for example:

- is the process alive?
- is it ready to receive traffic?
- are optional downstream systems degraded?

That difference is critical in container platforms where restart policy and routing policy are not the same thing.

Healthy probe design is therefore part of deployment architecture, not just a monitoring checkbox.

Bad probe semantics can create restart storms or route traffic too early.

For example, a readiness probe may reasonably depend on the primary database, while liveness should usually avoid dependencies that would cause unnecessary restart loops.

## 4. Custom Metrics

### 4.1. Micrometer - common metrics interface

Micrometer is the metrics facade used by Spring Boot. It lets you publish metrics to Prometheus, Datadog, New Relic, and others without changing application code heavily.

This separation matters because instrumentation code should ideally stay stable even if the monitoring backend changes later.

That keeps application code portable and avoids vendor lock-in leaking into business logic.

It also encourages teams to think in terms of metrics semantics rather than one vendor's dashboard vocabulary.

That usually leads to cleaner instrumentation over time.

### 4.2. Counter

```java
Counter.builder("orders.created")
    .description("Number of created orders")
    .tag("source", "api")
    .register(meterRegistry)
    .increment();
```

Counters work best for monotonic business events such as created orders, login failures, or retry attempts.

They become much less useful when teams try to use them for values that should really be sampled or timed.

If a value can go up and down naturally, it is usually not a good counter candidate.

### 4.3. Timer

```java
Timer timer = Timer.builder("orders.processing.time")
    .register(meterRegistry);

timer.record(() -> orderService.process(order));
```

Timers are usually more valuable than raw counters for backend latency analysis.

They are especially important for p95 and p99 latency tracking, where averages hide the real user experience.

For user-facing APIs, percentiles are usually more actionable than averages.

Average latency can look acceptable even when a small but important portion of requests is very slow.

Tail latency is often where user pain actually shows up.

That is why timers should usually be attached to meaningful business or API boundaries rather than tiny internal methods that create noisy low-value telemetry.

### 4.4. Gauge

```java
Gauge.builder("queue.pending.size", queue, Queue::size)
    .register(meterRegistry);
```

Use gauges only for values that can be sampled meaningfully at read time.

They are often appropriate for queue depth, connection pool size, or cache size, but less useful for values that only make sense as deltas over time.

Choosing the wrong meter type creates noisy dashboards and weak incident signals.

Good observability is not about collecting everything. It is about collecting the right things in the right shape.

More telemetry is only better if it remains understandable.

A good rule is to choose tags that operators would realistically filter by during an incident.

If nobody would ever dashboard or alert on that dimension, it may not deserve to be a tag.

### 4.5. Distribution summary

```java
DistributionSummary.builder("orders.amount")
    .register(meterRegistry)
    .record(orderAmount);
```

This is useful for payload sizes, amounts, batch sizes, and similar non-duration distributions.

### 4.6. Tags

Tags are essential for slicing metrics, but high-cardinality tags are dangerous.

Good tags:

- endpoint
- status code class
- tenant tier
- queue name

Bad tags:

- user id
- request id
- random UUID

High-cardinality tags can destroy metric system performance and storage efficiency, so tag design is a real production concern, not a cosmetic detail.

Good observability design is therefore partly a modeling exercise, not just a tooling exercise.

Teams that treat metrics as a product usually get better dashboards and faster incident triage.

Naming, tagging, and documentation all matter.

## 5. Custom Info Contributor

### 5.1. Via `application.properties`

```properties
info.app.name=User Service
info.app.version=1.0.0
info.app.owner=Platform Team
```

### 5.2. Programmatic `InfoContributor`

```java
@Component
public class BuildInfoContributor implements InfoContributor {

    @Override
    public void contribute(Info.Builder builder) {
        builder.withDetail("build", Map.of("commit", "abc123", "region", "ap-southeast-1"));
    }
}
```

### 5.3. Git commit info

Expose build and revision metadata so operators can tell exactly what is deployed.

This becomes critical during incident response, rollback verification, and multi-environment comparison.

Version metadata is especially helpful when several service revisions are deployed gradually during a rollout.

It becomes much easier to answer whether a bug is code-related, environment-related, or rollout-related.

That saves time during the most expensive part of incident response.

This is one of those tiny features that looks optional until the first confusing multi-version incident.

## 6. Logging Configuration

### 6.1. `application.properties`

```properties
logging.level.root=INFO
logging.level.com.example=DEBUG
logging.pattern.console=%d{yyyy-MM-dd HH:mm:ss} %-5level %logger - %msg%n
```

### 6.2. Changing log level at runtime

```bash
curl -X POST http://localhost:8080/actuator/loggers/com.example.service \
  -H "Content-Type: application/json" \
  -d '{"configuredLevel":"DEBUG"}'
```

This is useful in incident response, but it should be secured and audited.

If runtime log-level changes are allowed, they should also have a rollback path because leaving noisy levels enabled in production can create secondary problems.

Excessive logging can increase storage cost, reduce signal quality, and even affect latency under heavy load.

Runtime log tuning should be temporary, targeted, and reversible.

Logs are a debugging tool, not an excuse to avoid proper metrics and tracing.

It is also wise to document who is allowed to change log levels and how those changes are audited.

That small governance detail matters a lot in regulated or noisy production environments.

## 7. Prometheus Integration

### 7.1. Setup

```xml
<dependency>
    <groupId>io.micrometer</groupId>
    <artifactId>micrometer-registry-prometheus</artifactId>
</dependency>
```

```yaml
scrape_configs:
  - job_name: 'spring-boot-app'
    metrics_path: '/actuator/prometheus'
    static_configs:
      - targets: ['localhost:8080']
```

### 7.2. Important metrics

Important production metrics often include:

- `http_server_requests_seconds`
- `jvm_memory_used_bytes`
- `jvm_gc_pause_seconds`
- `hikaricp_connections_active`
- `process_uptime_seconds`

Most teams also pair these with service-specific business metrics such as checkout attempts, queue consumer lag, or failed downstream calls.

Infrastructure telemetry tells you the service is stressed. Business telemetry tells you whether that stress is hurting outcomes.

You generally need both to understand impact.

One tells you system state, the other tells you business consequence.

That pairing is what turns monitoring into decision support rather than just chart collection.

A practical dashboard question is always: which metrics would tell us whether customers are actually being affected right now?

## 8. Grafana Dashboard

### 8.1. JVM metrics dashboard

Typical JVM panels:

- heap usage
- GC pause time
- thread count
- CPU load

A good JVM dashboard answers one question quickly: is the process unhealthy because of memory, CPU, thread pressure, or GC behavior?

That kind of fast triage is one of the main reasons dashboards need discipline instead of becoming metric graveyards.

The best dashboards reduce time-to-understanding, not just display large numbers of charts.

If a dashboard cannot guide action, it is mostly decoration.

This is why many teams maintain separate dashboards for service overview, JVM internals, and one or two business-critical flows instead of one giant everything-dashboard.

Smaller dashboards with clear ownership are usually easier to keep healthy over time.

### 8.2. HTTP request dashboard

Typical API panels:

- request rate
- p95 / p99 latency
- error rate
- top slow endpoints

For public APIs, it is also common to break these panels down by method, status code class, and route template.

Without that breakdown, teams often know the API is slower but not which route is responsible.

Per-route visibility is often where performance tuning actually begins.

Global averages rarely tell you which code path to fix.

Route templates are usually a better metric label than raw URLs because they preserve cardinality while still being operationally useful.

The same low-cardinality principle also applies to tenant labels, error categories, and queue names.

## 9. Distributed Tracing with Micrometer + Zipkin

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
management.tracing.sampling.probability=1.0
spring.zipkin.base-url=http://localhost:9411
```

### 9.2. Custom span

```java
Span span = tracer.nextSpan().name("checkout-flow");
try (Tracer.SpanInScope ignored = tracer.withSpan(span.start())) {
    checkoutService.execute();
} finally {
    span.end();
}
```

Tracing is most useful when it aligns with request IDs, logs, and metrics.

On its own, tracing is just another stream of telemetry. Its real value comes from correlation across the whole observability stack.

Trace IDs become far more valuable when they are also present in logs and error responses.

Correlation is what turns separate signals into one usable operational story.

Without correlation, each tool answers only part of the question.

That is also why tracing should be sampled intentionally.

Full sampling is useful in local or staging environments, but production often needs a balance between visibility and cost.

Sampling strategy should be intentional enough that teams know what kinds of incidents tracing can and cannot answer reliably.

## 10. Security Considerations

### 10.1. Securing Actuator endpoints

Actuator endpoints should not be exposed casually.

Recommended practices:

- expose only what is needed
- protect sensitive endpoints with Spring Security
- keep `/heapdump`, `/env`, `/beans` internal
- separate public app traffic from ops traffic when possible

Many production systems expose Actuator on a separate port or an internal network path instead of the same public ingress as user traffic.

That architectural separation reduces the blast radius of accidental exposure.

It also gives infrastructure teams more freedom to enforce different access controls on operational surfaces.

That matters more as systems become more regulated or more public.

If Actuator is reachable from the public internet, the default assumption should be that the exposure is wrong unless explicitly justified.

Operational endpoints deserve the same threat modeling discipline as admin APIs.

## 11. Kubernetes Probes

Actuator health groups are a natural fit for:

- liveness probes
- readiness probes
- startup probes

```properties
management.endpoint.health.probes.enabled=true
management.health.livenessstate.enabled=true
management.health.readinessstate.enabled=true
```

This makes Spring Boot applications much easier to integrate cleanly into Kubernetes rollout and recovery behavior.

It also helps prevent false positives where a process is technically up but not actually ready to serve traffic safely.

This is one of the simplest ways to make rolling deployments safer and recovery behavior less noisy.

Probe design is often underestimated until the first bad rollout or cascading restart loop.

Once teams experience that failure mode, health semantics stop feeling like a minor detail.

The practical goal is simple: let the platform make good routing and restart decisions without teaching Kubernetes your whole application architecture.

Good probes stay simple, stable, and aligned with what the orchestrator is actually expected to decide.

If a probe requires reading a runbook to understand, it is probably too complicated.

Probe semantics should stay obvious to both developers and platform operators.

That clarity is part of operational resilience.

## 12. Common interview questions

### 12.1. What is the difference between liveness and readiness probes?

Liveness answers whether the process should be restarted. Readiness answers whether the instance should receive traffic right now.

### 12.2. Why should actuator endpoints be secured?

Because they expose operational details, environment state, metrics, or mappings that can become sensitive in production.

### 12.3. When should you add custom metrics?

When platform metrics are not enough to explain business throughput, queue depth, cache hit rate, or domain-specific failure patterns.
