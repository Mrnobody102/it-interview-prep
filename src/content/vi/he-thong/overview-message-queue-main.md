# Message Queue

### Tổng quan

**Message queue** là một thành phần trung gian cho phép giao tiếp bất đồng bộ giữa các hệ thống qua messages. Nó decouples producers (senders) khỏi consumers (receivers), cho phép họ hoạt động độc lập.

### Core Concepts

| Khái niệm | Mô tả |
|---|---|
| **Producer** | Gửi messages đến queue |
| **Consumer** | Đọc và xử lý messages từ queue |
| **Message** | Payload data được gửi qua queue |
| **Queue** | Channel giữ messages cho đến khi được consume |
| **Broker** | Server/service chứa message queue |
| **Topic** | Category/stream cho messages (pub/sub) |
| **Partition** | Log segment được ordered, immutable (Kafka) |

---

### Point-to-Point vs. Pub/Sub

| Pattern | Mô tả | Ví dụ |
|---|---|---|
| **Point-to-Point** | Một producer gửi đến một consumer. Message consumed một lần. | Task queue, order processing |
| **Pub/Sub** | Một producer publish đến topic; nhiều subscribers nhận | Notifications, event streaming |

---

### Message Queue Solutions

| Queue | Loại | Throughput | Persistence | Phù hợp cho |
|---|---|---|---|---|
| **Apache Kafka** | Distributed log | Rất cao (MB/s+) | Configurable, dài hạn | Event streaming, analytics, logs |
| **RabbitMQ** | Traditional broker | Trung bình | Có | Business workflows, task queues |
| **AWS SQS** | Managed service | Cao | Có (managed) | Simple queuing, AWS ecosystem |
| **AWS SNS** | Pub/Sub | Cao | Không (ephemeral) | Fan-out notifications |
| **ActiveMQ** | Traditional broker | Trung bình | Có | Java ecosystem integration |
| **Redis (Streams)** | In-memory + persistence | Rất cao | Optional | Low-latency, simple needs |
| **NATS** | Lightweight pub/sub | Rất cao | Optional | Microservices, IoT |

---

### Kafka vs. RabbitMQ

| Khía cạnh | Apache Kafka | RabbitMQ |
|---|---|---|
| **Architecture** | Distributed commit log (append-only) | Message broker với queues |
| **Message retention** | Dài hạn (configurable, days/weeks) | Ngắn hạn (xóa sau khi consume) |
| **Ordering** | Per partition | Per queue |
| **Replay** | Có (đọc lại từ offset) | Không (messages xóa sau ack) |
| **Throughput** | Hàng triệu events/sec | Hàng chục nghìn/sec |
| **Use case weight** | Event streaming, data pipelines | Task queues, business logic |
| **Routing** | Topic/partition-based | Flexible exchange bindings |
| **Message model** | Streaming (log-based) | Queue (broker-based) |

---

### Common Use Cases

| Use Case | Queue phù hợp |
|---|---|
| **Order processing pipeline** | Kafka hoặc RabbitMQ |
| **Background job processing** | RabbitMQ, SQS, Redis |
| **Real-time analytics** | Kafka |
| **Email/notification sending** | RabbitMQ, SQS |
| **Microservices event bus** | Kafka, NATS |
| **IoT data ingestion** | Kafka, NATS |
| **Log aggregation** | Kafka (ELK stack) |

---

### Patterns và Best Practices

#### Dead Letter Queue (DLQ)

Messages thất bại được gửi đến DLQ để phân tích và xử lý lại sau.

#### Idempotency

Vì messages có thể delivered nhiều lần, làm operations idempotent:

```typescript
async function processOrder(order: Order): Promise<void> {
  // Check đã được xử lý chưa
  const existing = await db.orderEvents.findOne({
    orderId: order.id,
    eventType: 'ORDER_PROCESSED',
  });

  if (existing) {
    console.log(`Order ${order.id} đã xử lý, bỏ qua`);
    return;
  }

  await db.orderEvents.create({
    orderId: order.id,
    eventType: 'ORDER_PROCESSED',
    processedAt: new Date(),
  });
}
```

#### Delivery Guarantees

| Delivery Guarantee | Mô tả |
|---|---|
| **At-most-once** | Message có thể bị mất, không bao giờ bị duplicate |
| **At-least-once** | Message không bao giờ bị mất, có thể duplicate |
| **Exactly-once** | Message được xử lý đúng một lần (cần coordination) |

---

### Retry Pattern với Exponential Backoff

```typescript
async function processWithRetry(
  fn: () => Promise<void>,
  maxRetries: number = 3
): Promise<void> {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      await fn();
      return;
    } catch (error) {
      if (attempt === maxRetries) throw error;

      const delay = Math.min(1000 * Math.pow(2, attempt), 30000);
      console.log(`Retry ${attempt + 1}/${maxRetries} sau ${delay}ms...`);
      await sleep(delay);
    }
  }
}
```

> **Tip:** Sự khác biệt giữa Kafka và RabbitMQ thường nằm ở **khả năng replay**. Nếu cần đọc lại messages trong quá khứ (event sourcing, analytics), dùng Kafka. Nếu cần simple task queuing với flexible routing, dùng RabbitMQ.
