# Spring → Cloud

## 1. Tổng quan

Spring Cloud cung cấp các công cụ để xây dựng các patterns phổ biến trong hệ thống phân tán.

### 1.1. Các Patterns chính

| Pattern | Spring Cloud | Mô tả |
|---------|-------------|--------|
| **Config** | Spring Cloud Config | Cấu hình tập trung |
| **Discovery** | Netflix Eureka | Service registration & discovery |
| **Gateway** | Spring Cloud Gateway | API routing, filtering |
| **Circuit Breaker** | Resilience4j | Fault tolerance |
| **Load Balancing** | Spring Cloud LoadBalancer | Client-side LB |
| **Tracing** | Spring Cloud Sleuth | Distributed tracing |
| **Messaging** | Spring Cloud Stream | Event-driven microservices |

## 2. Spring Cloud Config Server

Quản lý cấu hình tập trung.

### 2.1. Server Setup

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-config-server</artifactId>
</dependency>
```

```java
@SpringBootApplication
@EnableConfigServer
public class ConfigServerApplication { }
```

```properties
# application.properties
spring.application.name=config-server
spring.cloud.config.server.git.uri=https://github.com/your-org/config-repo
spring.cloud.config.server.git.default-label=main
spring.cloud.config.server.git.search-paths=configs/{application}
```

### 2.2. Client Setup

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-config</artifactId>
</dependency>
```

```properties
# bootstrap.properties (load trước application.properties)
spring.application.name=user-service
spring.cloud.config.uri=http://localhost:8888
spring.cloud.config.profile=prod
spring.cloud.config.label=main
```

## 3. Service Discovery (Eureka)

### 3.1. Eureka Server

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-eureka-server</artifactId>
</dependency>
```

```java
@SpringBootApplication
@EnableEurekaServer
public class EurekaServerApplication { }
```

```properties
spring.application.name=eureka-server
server.port=8761
eureka.client.register-with-eureka=false
eureka.client.fetch-registry=false
```

### 3.2. Eureka Client

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
</dependency>
```

```properties
spring.application.name=user-service
eureka.client.service-url.defaultZone=http://localhost:8761/eureka
```

```java
@RestController
public class UserController {
    @Autowired
    private RestTemplate restTemplate;

    // Dùng service name thay vì IP/port
    public Order getOrder(Long orderId) {
        return restTemplate.getForObject(
            "http://order-service/api/orders/" + orderId, Order.class);
    }
}
```

## 4. Spring Cloud Gateway

API Gateway cho routing và filtering.

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-gateway</artifactId>
</dependency>
```

```properties
spring.cloud.gateway.routes:
  - id: user-service
    uri: http://user-service:8080
    predicates:
      - Path=/api/users/**
    filters:
      - StripPrefix=1
      - name: RequestRateLimiter
        args:
          redis-rate-limiter.replenishRate: 10
          redis-rate-limiter.burstCapacity: 20

  - id: order-service
    uri: lb://order-service
    predicates:
      - Header=X-API-Key, .+
    filters:
      - name: CircuitBreaker
        args:
          name: orderCircuitBreaker
          fallbackUri: forward:/fallback
```

```java
@Configuration
public class GatewayConfig {

    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
            .route("user-route", r -> r.path("/users/**")
                .filters(f -> f.stripPrefix(1).addRequestHeader("X-Gateway", "true"))
                .uri("lb://user-service"))
            .build();
    }
}

// Global filter
@Component
public class AuthenticationFilter implements GlobalFilter {
    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        String token = exchange.getRequest().getHeaders().getFirst("Authorization");
        if (token == null) {
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }
        return chain.filter(exchange);
    }
}
```

## 5. Circuit Breaker (Resilience4j)

```xml
<dependency>
    <groupId>io.github.resilience4j</groupId>
    <artifactId>resilience4j-spring-boot3</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-circuitbreaker-resilience4j</artifactId>
</dependency>
```

```properties
resilience4j.circuitbreaker:
  instances:
    orderService:
      slidingWindowSize: 10
      failureRateThreshold: 50
      waitDurationInOpenState: 10s
      permittedNumberOfCallsInHalfOpenState: 3
      automaticTransitionFromOpenToHalfOpenEnabled: true

resilience4j.retry:
  instances:
    orderService:
      maxAttempts: 3
      waitDuration: 500ms
      enableExponentialBackoff: true
      exponentialBackoffMultiplier: 2

resilience4j.timelimiter:
  instances:
    orderService:
      timeoutDuration: 3s
```

```java
@Service
public class OrderClient {

    @CircuitBreaker(name = "orderService", fallbackMethod = "getOrderFallback")
    @Retry(name = "orderService")
    public Order getOrder(Long id) {
        return restTemplate.getForObject("http://order-service/orders/" + id, Order.class);
    }

    // Fallback method phải cùng signature + Throwable parameter
    public Order getOrderFallback(Long id, Throwable t) {
        log.error("Order service failed: {}", t.getMessage());
        return new Order(id, "Order unavailable", "FALLBACK");
    }
}

// Bulkhead
@Bulkhead(name = "orderService", fallbackMethod = "bulkheadFallback")
public Order getOrder(Long id) { }
```

## 6. Spring Cloud LoadBalancer

Client-side load balancing (thay thế Netflix Ribbon).

```java
@Configuration
public class LoadBalancerConfig {
    @Bean
    public ReactorLoadBalancer<ServiceInstance> randomLoadBalancer(
            Environment environment,
            LoadBalancerClientFactory factory) {
        String name = environment.getProperty(
            LoadBalancerClientFactory.PROPERTY_NAME);
        return new RandomLoadBalancer(
            factory.getLazyProvider(name, ServiceInstanceListSupplier.class),
            name);
    }
}

// Usage
@Service
public class UserService {
    @Autowired
    private LoadBalancerClient loadBalancer;

    public String getServiceUrl() {
        ServiceInstance instance = loadBalancer.choose("order-service");
        return instance.getUri().toString();
    }
}
```

## 7. Spring Cloud OpenFeign

Declarative HTTP client.

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-openfeign</artifactId>
</dependency>
```

```java
@EnableFeignClients
@SpringBootApplication
public class Application { }

// Define client
@FeignClient(name = "order-service", url = "http://order-service:8080")
public interface OrderClient {

    @GetMapping("/api/orders/{id}")
    Order getOrder(@PathVariable("id") Long id);

    @PostMapping("/api/orders")
    Order createOrder(@RequestBody CreateOrderRequest request);

    @GetMapping("/api/orders")
    List<Order> getOrders(@RequestParam("userId") Long userId);
}

// Use
@Service
public class UserService {
    @Autowired
    private OrderClient orderClient;

    public List<Order> getUserOrders(Long userId) {
        return orderClient.getOrders(userId);
    }
}
```

## 8. Spring Cloud Stream (Messaging)

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-stream</artifactId>
</dependency>
```

```properties
spring.cloud.stream:
  bindings:
    output:
      destination: orders
      content-type: application/json
    input:
      destination: notifications
      group: notification-group
  binders:
    kafka:
      type: kafka
      environment:
        spring.cloud.stream.kafka.binder.brokers: localhost:9092
```

```java
// Producer
@EnableBinding(Source.class)
public class OrderPublisher {

    @Autowired
    private Source source;

    public void publishOrder(Order order) {
        source.output().send(MessageBuilder
            .withPayload(order)
            .setHeader("partitionKey", order.getUserId())
            .build());
    }
}

// Consumer
@EnableBinding(Sink.class)
public class NotificationConsumer {

    @StreamListener(Sink.INPUT)
    public void handleOrder(@Payload Order order) {
        emailService.sendConfirmation(order);
    }
}
```

## 9. Spring Cloud Sleuth (Distributed Tracing)

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-sleuth</artifactId>
</dependency>
```

Tự động thêm trace ID và span ID vào logs:
```
2024-01-15 10:30:00.001 INFO  [user-service,abc123,def456] - Processing order
2024-01-15 10:30:00.005 INFO  [order-service,abc123,ghi789] - Creating order
```
