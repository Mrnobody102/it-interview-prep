# Java Concurrency

## 1. Thread vs Process

| Aspect | Process | Thread |
|--------|---------|--------|
| **Definition** | A running program with its own memory/resources | Lightweight execution unit within a process |
| **Memory** | Isolated memory space | Shares memory (heap) with other threads in the same process |
| **Creation** | Heavyweight, OS-level | Lightweight, managed by JVM |
| **Communication** | IPC (pipes, sockets, etc.) | Direct memory access (shared data) |
| **Failure isolation** | Crashing one process does not crash others | One thread crashing can kill the entire process |

```java
// Process example (running a new JVM process)
ProcessBuilder pb = new ProcessBuilder("notepad.exe");
Process p = pb.start();
```

---

## 2. Runnable vs Thread

### 2.1. Runnable

- An **interface** with a single method: `void run()`
- Used to **define the task** (what to execute)
- Preferred in most cases

### 2.2. Thread

- A **class** that implements `Runnable`
- Has both `run()` (defines task) and `start()` (starts execution)
- Couples task definition with thread management

> **Tip:** Use **Runnable** (or `ExecutorService`) over extending `Thread`. Runnable allows a class to implement other interfaces and separates task definition from thread management.

```java
// Using Runnable
Runnable task = () -> {
    System.out.println("Running in: " + Thread.currentThread().getName());
};
Thread t = new Thread(task);
t.start();

// Using Thread subclass (less flexible)
class MyThread extends Thread {
    @Override
    public void run() {
        System.out.println("MyThread running");
    }
}
new MyThread().start();
```

---

## 3. Thread Lifecycle

```
NEW → RUNNABLE → RUNNING → BLOCKED/WAITING/TIMED_WAITING → TERMINATED
```

| State | Description |
|-------|-------------|
| **NEW** | Created but not started |
| **RUNNABLE** | Ready to run or running (JVM decides) |
| **RUNNING** | Executing on CPU |
| **BLOCKED** | Waiting for a monitor lock (e.g., `synchronized`) |
| **WAITING** | Waiting indefinitely (`wait()`, `join()`, `park()`) |
| **TIMED_WAITING** | Waiting with a timeout (`sleep`, `wait(timeout)`, `join(timeout)`) |
| **TERMINATED** | Completed execution |

---

## 4. synchronized vs volatile

| Aspect | `synchronized` | `volatile` |
|--------|---------------|------------|
| **Purpose** | Mutual exclusion + visibility | Visibility only |
| **Atomicity** | Guarantees both visibility and atomicity | Only visibility guarantee |
| **Performance** | Higher overhead (acquires/releases lock) | Lower overhead (direct memory access) |
| **Applies to** | Methods and blocks | Variables only |
| **Use case** | Complex operations, multiple steps | Simple flags, boolean flags |

### 4.1. synchronized

```java
// Synchronized method
public synchronized void increment() {
    count++;
}

// Synchronized block
public void increment() {
    synchronized (this) {
        count++;
    }
}
```

### 4.2. volatile

```java
private volatile boolean running = true;

public void stop() {
    running = false;  // Visible to all threads immediately
}
```

> **Note:** `volatile` alone does NOT make `count++` thread-safe. Use `synchronized` or `AtomicInteger` for compound operations.

---

## 5. wait(), notify(), notifyAll()

These methods are used for **thread communication** and **must** be called inside a `synchronized` block.

| Method | Description |
|--------|-------------|
| `wait()` | Current thread pauses and releases the lock, waiting for `notify()` |
| `notify()` | Wakes **one** waiting thread (JVM chooses) |
| `notifyAll()` | Wakes **all** waiting threads |

```java
synchronized (lock) {
    while (conditionIsFalse) {
        lock.wait();  // Release lock and wait
    }
    // Do work
    lock.notifyAll();  // Notify waiting threads
}
```

---

## 6. Thread Pools & Executor Framework

Instead of creating threads manually, use an **ExecutorService** to manage a pool of threads.

### 6.1. Key Interfaces/Classes

| Type | Description |
|------|-------------|
| `Executor` | Basic interface, executes `Runnable` |
| `ExecutorService` | Extends `Executor`, supports `Callable`, `Future`, shutdown |
| `ThreadPoolExecutor` | Common implementation with configurable pool size |
| `Executors` | Factory class to create common executor types |

### 6.2. Common Factory Methods

| Method | Pool Type |
|--------|-----------|
| `Executors.newFixedThreadPool(n)` | Fixed-size pool |
| `Executors.newCachedThreadPool()` | Dynamic pool (grows/shrinks) |
| `Executors.newSingleThreadExecutor()` | Single thread |
| `Executors.newWorkStealingPool()` | Work-stealing (Java 8+) |

```java
ExecutorService executor = Executors.newFixedThreadPool(4);

for (int i = 0; i < 10; i++) {
    final int taskId = i;
    executor.submit(() -> {
        System.out.println("Task " + taskId + " in " + Thread.currentThread().getName());
    });
}

executor.shutdown();  // No new tasks accepted
executor.awaitTermination(60, TimeUnit.SECONDS);  // Wait for completion
```

---

## 7. Callable vs Future

| Aspect | `Callable<T>` | `Runnable` |
|--------|--------------|-----------|
| **Method** | `T call()` | `void run()` |
| **Return value** | Returns `T` | No return value |
| **Checked exceptions** | Can throw checked exceptions | Cannot throw checked exceptions |
| **Used with** | `Future<T>`, `ExecutorService.submit()` | `Thread`, `ExecutorService.submit()` |

```java
Callable<Integer> task = () -> {
    Thread.sleep(1000);
    return 42;
};

Future<Integer> future = executor.submit(task);
Integer result = future.get();       // Blocks until result is available
Integer result = future.get(5, TimeUnit.SECONDS);  // With timeout
boolean done = future.isDone();
boolean cancelled = future.cancel(true);
```

---

## 8. Concurrent Collections

Java provides thread-safe collections in `java.util.concurrent`.

| Collection | Description | Use Case |
|------------|-------------|----------|
| `ConcurrentHashMap` | High-performance thread-safe map | Concurrent read/write |
| `CopyOnWriteArrayList` | Optimized for read-heavy, write-light | Listener lists, caches |
| `BlockingQueue<T>` | Queue with blocking put/take | Producer-consumer problems |
| `ConcurrentLinkedQueue` | Non-blocking unbounded queue | High-throughput scenarios |
| `Collections.synchronizedMap()` | Synchronized wrapper (legacy) | Simple thread safety |

```java
// Producer-Consumer with BlockingQueue
BlockingQueue<Integer> queue = new ArrayBlockingQueue<>(100);

Producer p = new Producer(queue);
Consumer c = new Consumer(queue);

new Thread(p).start();
new Thread(c).start();

class Producer implements Runnable {
    private final BlockingQueue<Integer> queue;
    Producer(BlockingQueue<Integer> q) { this.queue = q; }

    public void run() {
        try {
            queue.put(42);  // Blocks if queue is full
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }
}

class Consumer implements Runnable {
    private final BlockingQueue<Integer> queue;
    Consumer(BlockingQueue<Integer> q) { this.queue = q; }

    public void run() {
        try {
            Integer value = queue.take();  // Blocks if queue is empty
            System.out.println("Consumed: " + value);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }
}
```

---

## 9. Atomic Variables

Atomic classes (`AtomicInteger`, `AtomicLong`, `AtomicBoolean`, `AtomicReference<T>`) use **CAS (Compare-And-Swap)** — a hardware-level atomic instruction that is lock-free and faster than `synchronized`.

```java
AtomicInteger counter = new AtomicInteger(0);

counter.incrementAndGet();   // ++i
counter.getAndAdd(5);        // return old value, then add 5
counter.compareAndSet(10, 20); // CAS: if current == 10, set to 20
```

| Method | Description |
|--------|-------------|
| `incrementAndGet()` | Atomically increments and returns new value |
| `getAndSet(val)` | Atomically sets and returns old value |
| `compareAndSet(expected, updated)` | CAS: succeeds only if current == expected |

---

## 10. Synchronizers

High-level concurrency utilities that manage thread coordination.

| Synchronizer | Description | Key Method |
|-------------|-------------|------------|
| `CountDownLatch` | Threads wait until countdown reaches zero (one-shot) | `countDown()`, `await()` |
| `CyclicBarrier` | Threads wait for each other at a barrier point (reusable) | `await()` |
| `Semaphore` | Controls access to a shared resource (permits) | `acquire()`, `release()` |
| `Exchanger<V>` | Two threads exchange data | `exchange()` |

### 10.1. CountDownLatch

```java
CountDownLatch latch = new CountDownLatch(3);

for (int i = 0; i < 3; i++) {
    new Thread(() -> {
        System.out.println("Task completed");
        latch.countDown();
    }).start();
}

latch.await();  // Wait for all 3 tasks
System.out.println("All tasks done!");
```

### 10.2. CyclicBarrier

```java
CyclicBarrier barrier = new CyclicBarrier(3, () ->
    System.out.println("All parties arrived, starting!"));

for (int i = 0; i < 3; i++) {
    final int id = i;
    new Thread(() -> {
        System.out.println("Party " + id + " working...");
        barrier.await();  // Wait for all parties
        System.out.println("Party " + id + " continuing...");
    }).start();
}
```

---

## 11. Fork/Join Framework

`ForkJoinPool` is designed for **divide-and-conquer** tasks — large tasks are split into subtasks (fork), results are combined (join). Optimized for modern multi-core CPUs.

```java
class SumTask extends RecursiveTask<Long> {
    private final long[] array;
    private final int start, end;
    private static final int THRESHOLD = 10_000;

    SumTask(long[] array, int start, int end) {
        this.array = array;
        this.start = start;
        this.end = end;
    }

    @Override
    protected Long compute() {
        if (end - start <= THRESHOLD) {
            long sum = 0;
            for (int i = start; i < end; i++) sum += array[i];
            return sum;
        }
        int mid = (start + end) / 2;
        SumTask left = new SumTask(array, start, mid);
        SumTask right = new SumTask(array, mid, end);
        left.fork();
        return right.compute() + left.join();
    }
}

// Usage
ForkJoinPool pool = new ForkJoinPool();
long result = pool.invoke(new SumTask(array, 0, array.length));
```

---

## 12. Deadlock & Livelock

### 12.1. Deadlock

Two or more threads wait indefinitely because each holds a lock the other needs.

```java
// Classic deadlock
Object lockA = new Object();
Object lockB = new Object();

Thread t1 = new Thread(() -> {
    synchronized (lockA) {
        synchronized (lockB) {  // Never reached
            System.out.println("Thread 1");
        }
    }
});

Thread t2 = new Thread(() -> {
    synchronized (lockB) {
        synchronized (lockA) {  // Never reached
            System.out.println("Thread 2");
        }
    }
});
```

#### Prevention Strategies

| Strategy | Description |
|----------|-------------|
| **Lock ordering** | Always acquire locks in the same order across all threads |
| **tryLock with timeout** | Use `ReentrantLock.tryLock(long timeout, TimeUnit unit)` |
| **Avoid nested locks** | Don't hold a lock while calling external code |
| **Single lock** | Use a single lock instead of multiple |

### 12.2. Livelock

Threads keep changing state but make no forward progress — often because they constantly yield to each other.

> **Example:** Two people trying to pass each other in a hallway, each stepping aside the same way repeatedly.

---

## 13. Best Practices

- **Use Thread Pools** instead of creating threads manually (`ExecutorService`)
- **Design immutable objects** when possible (`final` fields, no setters)
- **Minimize shared mutable state** — prefer thread-local data or concurrent collections
- **Handle exceptions in each thread** — uncaught exceptions kill threads silently
- **Always close resources** with `try-with-resources`
- **Prefer higher-level concurrency utilities** (ExecutorService, ConcurrentHashMap, BlockingQueue) over `synchronized`/`wait`/`notify`
- **Use atomic variables** for simple counters/flags instead of `synchronized`
