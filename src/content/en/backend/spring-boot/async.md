# Spring Async & Scheduler

## 1. @Async

Run methods in a background thread pool instead of the caller thread.

### 1.1. Enable & Basic Usage

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

    @Async  // Runs in separate thread
    public void sendEmail(String to, String subject) {
        // Time-consuming operation
        // ...
    }

    // Return CompletableFuture for reactive handling
    @Async
    public CompletableFuture<String> fetchData(String url) {
        String result = restTemplate.getForObject(url, String.class);
        return CompletableFuture.completedFuture(result);
    }
}
```

### 1.2. Thread Pool Configuration

```properties
# application.yml
spring.task.execution.pool.core-size=4
spring.task.execution.pool.max-size=10
spring.task.execution.pool.queue-capacity=100
spring.task.execution.thread-name-prefix=async-
```

### 1.3. Exception Handling

```java
@Async
@SneakyThrows  // Lombok - throws declared exceptions
public void doSomething() {
    throw new IOException("Error");
}

// With CompletableFuture
@Async
public CompletableFuture<Result> computeSomething() {
    try {
        return CompletableFuture.completedFuture(doWork());
    } catch (Exception e) {
        return CompletableFuture.failedFuture(e);
    }
}

// Dedicated exception handler
@Component
public class AsyncExceptionHandler implements AsyncUncaughtExceptionHandler {
    @Override
    public void handleUncaughtException(Throwable ex, Method method, Object... params) {
        log.error("Exception in async method {}: {}", method.getName(), ex.getMessage());
    }
}

@EnableAsync(exceptionHandler = AsyncExceptionHandler.class)
public class AsyncConfig { }
```

### 1.4. Common Pitfalls

```java
// ❌ DON'T: @Async on private method
private @Async void doSomething() { }  // Won't work!

// ❌ DON'T: Self-invocation bypasses proxy
@Service
public class MyService {
    public void caller() {
        this.asyncMethod();  // Bypasses proxy → runs synchronously!
    }

    @Async
    public void asyncMethod() { }
}

// ✅ DO: Inject self to call through proxy
@Service
public class MyService {
    @Autowired
    private MyService self;

    public void caller() {
        self.asyncMethod();  // Through proxy → async!
    }

    @Async
    public void asyncMethod() { }
}

// ❌ DON'T: Return transactional entity from @Async
@Async
public User findUser(Long id) {
    return userRepository.findById(id).orElseThrow();
    // ⚠️ Entity may be detached after transaction closes
}
```

## 2. @Scheduled

Run methods at fixed intervals or with cron expressions.

### 2.1. Enable & Basic Usage

```java
@Configuration
@EnableScheduling
public class SchedulerConfig { }

// Run every 5 seconds
@Scheduled(fixedRate = 5000)
public void doEveryFiveSeconds() { }

// Fixed delay (waits for previous to finish)
@Scheduled(fixedDelay = 60000)
public void doAfter60SecondsFromCompletion() { }

// Initial delay
@Scheduled(initialDelay = 10000, fixedRate = 30000)
public void doAfter10SecThenEvery30Sec() { }
```

### 2.2. Cron Expression

```java
// Cron: second minute hour day month weekday
@Scheduled(cron = "0 0 2 * * ?")        // Every day at 2 AM
@Scheduled(cron = "0 0/30 * * * ?")      // Every 30 minutes
@Scheduled(cron = "0 0 9-17 * * MON-FRI") // Every hour 9-5, Mon-Fri
@Scheduled(cron = "0 0 1 1 * ?")        // First day of every month at 1 AM
```

| Field | Allowed Values | Special |
|-------|--------------|---------|
| Second | 0-59 | — |
| Minute | 0-59 | — |
| Hour | 0-23 | — |
| Day | 1-31 | — |
| Month | 1-12 | — |
| Weekday | 1-7 (SUN-SAT) | — |

### 2.3. Multiple Schedules & Dynamic Scheduling

```java
// Multiple schedules on one method
@Scheduled(cron = "${schedule.cron}")
public void dynamicSchedule() { }

// Dynamic scheduling at runtime
@Service
public class DynamicScheduler {
    @Autowired
    private TaskScheduler taskScheduler;

    public void scheduleTask(Runnable task, Date startTime) {
        taskScheduler.schedule(task, startTime);
    }
}
```

## 3. Combining @Async + @Scheduled

```java
@Scheduled(cron = "0 0 3 * * ?")  // Daily at 3 AM
@Async  // Run in async thread pool
public void dailyReportGeneration() {
    // Heavy computation
    // Email sending
    // ...
}
```

## 4. Use Cases

| Task | Recommendation |
|------|---------------|
| Send email | `@Async` |
| Generate report | `@Async` |
| Batch processing | `@Async` with thread pool |
| Cache refresh | `@Scheduled` |
| Cleanup old data | `@Scheduled` |
| Daily statistics | `@Scheduled` |
| Send reminders | `@Scheduled` + `@Async` |

## 5. Spring @EventListener for Decoupling

```java
// Publish event (fire and forget)
@Service
public class OrderService {
    @Autowired
    private ApplicationEventPublisher publisher;

    public void createOrder(Order order) {
        orderRepository.save(order);
        publisher.publishEvent(new OrderCreatedEvent(order));
    }
}

// Listen and handle asynchronously
@Component
public class OrderEventHandler {
    @Async
    @EventListener
    public void handleOrderCreated(OrderCreatedEvent event) {
        // Send confirmation email
        // Update inventory
        // Send to analytics
    }
}
```
