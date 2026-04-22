# Spring -> Async & Scheduler

## 1. @Async

`@Async` cho phép chạy method trên thread pool nền thay vì thread đang xử lý request.

### 1.1. Bật & sử dụng cơ bản

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

    @Async
    public void sendEmail(String to, String subject) {
        // tác vụ nền
    }

    @Async
    public CompletableFuture<String> fetchData(String url) {
        String result = restTemplate.getForObject(url, String.class);
        return CompletableFuture.completedFuture(result);
    }
}
```

### 1.2. Cấu hình thread pool

```properties
spring.task.execution.pool.core-size=4
spring.task.execution.pool.max-size=10
spring.task.execution.pool.queue-capacity=100
spring.task.execution.thread-name-prefix=async-
```

### 1.3. Xử lý exception

```java
@Async
public CompletableFuture<Result> computeSomething() {
    try {
        return CompletableFuture.completedFuture(doWork());
    } catch (Exception e) {
        return CompletableFuture.failedFuture(e);
    }
}
```

Với method `void`, exception dễ bị nuốt nếu không cấu hình `AsyncUncaughtExceptionHandler`.

### 1.4. Lưu ý quan trọng

- `@Async` không hoạt động với method `private`
- self-invocation sẽ bỏ qua proxy
- không nên dùng thread pool mặc định một cách mù quáng
- cần quan sát queue size, timeout, rejection policy

## 2. @Scheduled

`@Scheduled` dùng cho các tác vụ chạy định kỳ.

### 2.1. Bật & cơ bản

```java
@Configuration
@EnableScheduling
public class SchedulerConfig {
}

@Scheduled(fixedRate = 5000)
public void runEveryFiveSeconds() { }

@Scheduled(fixedDelay = 60000)
public void runAfterPreviousFinished() { }
```

### 2.2. Biểu thức cron

```java
@Scheduled(cron = "0 0 2 * * ?")
public void runEveryDayAt2am() { }

@Scheduled(cron = "0 0/30 * * * ?")
public void runEvery30Minutes() { }
```

### 2.3. Multiple schedules và dynamic scheduling

```java
@Scheduled(cron = "0 0 8 * * MON-FRI")
@Scheduled(cron = "0 0 20 * * MON-FRI")
public void sendReminder() { }
```

```java
@Component
public class DynamicJobRegistrar {

    private final TaskScheduler taskScheduler;

    public DynamicJobRegistrar(TaskScheduler taskScheduler) {
        this.taskScheduler = taskScheduler;
    }

    public void register(Duration delay) {
        taskScheduler.schedule(
            () -> System.out.println("run dynamic job"),
            Instant.now().plus(delay)
        );
    }
}
```

Mẫu này phù hợp khi lịch chạy được lấy từ config hoặc database ở runtime.

## 3. Kết hợp @Async + @Scheduled

```java
@Scheduled(cron = "0 0 3 * * ?")
@Async
public void generateDailyReport() {
    // tác vụ nặng
}
```

## 4. Use Cases

| Tác vụ | Gợi ý |
|---|---|
| Gửi email | `@Async` |
| Refresh cache | `@Scheduled` |
| Batch processing | `@Async` + thread pool riêng |
| Daily report | `@Scheduled` + `@Async` |

## 5. Spring `@EventListener` để giảm coupling

```java
@Service
public class OrderService {

    private final ApplicationEventPublisher publisher;

    public OrderService(ApplicationEventPublisher publisher) {
        this.publisher = publisher;
    }

    public void createOrder(Order order) {
        publisher.publishEvent(new OrderCreatedEvent(order));
    }
}

@Component
public class OrderEventHandler {

    @Async
    @EventListener
    public void handleOrderCreated(OrderCreatedEvent event) {
        emailService.sendConfirmation(event.getOrder());
    }
}
```

Đây là cách tốt để tách nghiệp vụ chính khỏi side effects như gửi mail, audit log, analytics.

## 6. Câu hỏi phỏng vấn thường gặp

### 6.1. Khi nào `@Async` là đủ và khi nào cần message queue?

`@Async` đủ cho background work trong cùng process khi yêu cầu reliability còn vừa phải. Cần message queue khi phải có durable delivery, retry qua lần restart, backpressure hoặc tách service rõ hơn.

### 6.2. Vì sao nên cấu hình custom executor cho async work?

Vì executor mặc định thường quá chung chung. Hệ thống thực tế thường cần pool size, queue capacity, thread naming và rejection policy rõ ràng.

### 6.3. Khi nào `@EventListener` kết hợp tốt với xử lý async?

Khi nghiệp vụ chính chỉ nên publish event, còn side effect như email, analytics, notification cần tách khỏi luồng transaction chính.
