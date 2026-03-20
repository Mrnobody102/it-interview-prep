# Spring → Async & Scheduler

## 1. @Async

Chạy method trong thread pool nền thay vì thread gọi.

### 1.1. Bật & Sử dụng cơ bản

```java
@Configuration
@EnableAsync
public class AsyncConfig {

    @Bean(name = "taskExecutor")
    public Executor taskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(4);
        executor.setMaxPoolSize(10);
        executor.setQueueCapacity(100);
        executor.setThreadNamePrefix("async-");
        executor.initialize();
        return executor;
    }
}

@Service
public class EmailService {

    @Async  // Chạy trong thread riêng
    public void sendEmail(String to, String subject) {
        // Tác vụ tốn thời gian
    }

    // Trả CompletableFuture để xử lý reactive
    @Async
    public CompletableFuture<String> fetchData(String url) {
        String result = restTemplate.getForObject(url, String.class);
        return CompletableFuture.completedFuture(result);
    }
}
```

### 1.2. Cấu hình Thread Pool

```properties
# application.yml
spring.task.execution.pool.core-size=4
spring.task.execution.pool.max-size=10
spring.task.execution.pool.queue-capacity=100
spring.task.execution.thread-name-prefix=async-
```

### 1.3. Xử lý Exception

```java
@Async
@SneakyThrows  // Lombok
public void doSomething() {
    throw new IOException("Error");
}

// Với CompletableFuture
@Async
public CompletableFuture<Result> computeSomething() {
    try {
        return CompletableFuture.completedFuture(doWork());
    } catch (Exception e) {
        return CompletableFuture.failedFuture(e);
    }
}
```

### 1.4. Lưu ý quan trọng

```java
// ❌ SAI: @Async trên method private
private @Async void doSomething() { }  // Không hoạt động!

// ❌ SAI: Self-invocation bỏ qua proxy
@Service
public class MyService {
    public void caller() {
        this.asyncMethod();  // Bỏ qua proxy → chạy đồng bộ!
    }

    @Async
    public void asyncMethod() { }
}

// ✅ ĐÚNG: Inject self để gọi qua proxy
@Service
public class MyService {
    @Autowired
    private MyService self;

    public void caller() {
        self.asyncMethod();  // Qua proxy → async!
    }

    @Async
    public void asyncMethod() { }
}
```

## 2. @Scheduled

Chạy method theo interval cố định hoặc với biểu thức cron.

### 2.1. Bật & Cơ bản

```java
@Configuration
@EnableScheduling
public class SchedulerConfig { }

// Mỗi 5 giây
@Scheduled(fixedRate = 5000)
public void doEveryFiveSeconds() { }

// Fixed delay (đợi task trước xong)
@Scheduled(fixedDelay = 60000)
public void doAfter60SecondsFromCompletion() { }

// Initial delay
@Scheduled(initialDelay = 10000, fixedRate = 30000)
public void doAfter10SecThenEvery30Sec() { }
```

### 2.2. Biểu thức Cron

```java
// Cron: second minute hour day month weekday
@Scheduled(cron = "0 0 2 * * ?")        // Mỗi ngày lúc 2 AM
@Scheduled(cron = "0 0/30 * * * ?")      // Mỗi 30 phút
@Scheduled(cron = "0 0 9-17 * * MON-FRI") // Mỗi giờ 9-5h, T2-T6
@Scheduled(cron = "0 0 1 1 * ?")        // Ngày đầu mỗi tháng lúc 1 AM
```

| Trường | Giá trị | Đặc biệt |
|--------|---------|-----------|
| Second | 0-59 | — |
| Minute | 0-59 | — |
| Hour | 0-23 | — |
| Day | 1-31 | — |
| Month | 1-12 | — |
| Weekday | 1-7 (CN-T7) | — |

## 3. Kết hợp @Async + @Scheduled

```java
@Scheduled(cron = "0 0 3 * * ?")  // Mỗi ngày lúc 3 AM
@Async  // Chạy trong thread pool async
public void dailyReportGeneration() {
    // Tạo report nặng
    // Gửi email
}
```

## 4. Use Cases

| Tác vụ | Khuyến nghị |
|--------|-------------|
| Gửi email | `@Async` |
| Tạo report | `@Async` |
| Batch processing | `@Async` với thread pool |
| Refresh cache | `@Scheduled` |
| Cleanup dữ liệu cũ | `@Scheduled` |
| Thống kê hàng ngày | `@Scheduled` |
| Gửi nhắc nhở | `@Scheduled` + `@Async` |

## 5. Spring @EventListener để giảm coupling

```java
// Publish event
@Service
public class OrderService {
    @Autowired
    private ApplicationEventPublisher publisher;

    public void createOrder(Order order) {
        orderRepository.save(order);
        publisher.publishEvent(new OrderCreatedEvent(order));
    }
}

// Listen và xử lý async
@Component
public class OrderEventHandler {
    @Async
    @EventListener
    public void handleOrderCreated(OrderCreatedEvent event) {
        emailService.sendConfirmation(event.getOrder());
    }
}
```
