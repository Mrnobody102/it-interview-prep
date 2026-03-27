# Message Queue

### Overview

A **message queue** is an intermediate component that enables asynchronous communication between systems via messages. It decouples producers (senders) from consumers (receivers), allowing them to operate independently.

### Core Concepts

| Concept | Description |
|---|---|
| **Producer** | Sends messages to the queue |
| **Consumer** | Reads and processes messages from the queue |
| **Message** | Data payload sent through the queue |
| **Queue** | Channel that holds messages until consumed |
| **Broker** | The message queue server/service |
| **Topic** | A category/stream for messages (pub/sub) |
| **Partition** | Ordered, immutable log segment (Kafka) |

### Point-to-Point vs. Pub/Sub

| Pattern | Description | Example |
|---|---|---|
| **Point-to-Point** | One producer sends to one consumer. Message consumed once. | Task queue, order processing |
| **Pub/Sub** | One producer publishes to topic; multiple subscribers receive | Notifications, event streaming |

### Message Queue Solutions

| Queue | Type | Throughput | Persistence | Best For |
|---|---|---|---|---|
| **Apache Kafka** | Distributed log | Very high (MB/s+) | Configurable, long-term | Event streaming, analytics, logs |
| **RabbitMQ** | Traditional broker | Medium | Yes | Business workflows, task queues |
| **AWS SQS** | Managed service | High | Yes (managed) | Simple queuing, AWS ecosystem |
| **AWS SNS** | Pub/Sub | High | No (ephemeral) | Fan-out notifications |
| **ActiveMQ** | Traditional broker | Medium | Yes | Java ecosystem integration |
| **Redis (Streams)** | In-memory + persistence | Very high | Optional | Low-latency, simple needs |
| **NATS** | Lightweight pub/sub | Very high | Optional | Microservices, IoT |

### Kafka vs. RabbitMQ

| Aspect | Apache Kafka | RabbitMQ |
|---|---|---|
| **Architecture** | Distributed commit log (append-only) | Message broker with queues |
| **Message retention** | Long-term (configurable, days/weeks) | Short-term (deleted after consume) |
| **Ordering** | Per partition | Per queue |
| **Replay** | Yes (re-read from offset) | No (messages deleted after ack) |
| **Throughput** | Millions of events/sec | Tens of thousands/sec |
| **Use case weight** | Event streaming, data pipelines | Task queues, business logic |
| **Routing** | Topic/partition-based | Flexible exchange bindings |
| **Message model** | Streaming (log-based) | Queue (broker-based) |

#### Kafka Example

```javascript
// Producer
const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['kafka-1:9092', 'kafka-2:9092'],
});

const producer = kafka.producer();

async function sendOrderEvent(order) {
  await producer.send({
    topic: 'order-events',
    messages: [
      {
        key: order.userId,
        value: JSON.stringify({
          eventType: 'ORDER_CREATED',
          orderId: order.id,
          total: order.total,
          timestamp: Date.now(),
        }),
      },
    ],
  });
}
```

```javascript
// Consumer (with consumer group)
const consumer = kafka.consumer({ groupId: 'order-processor' });

await consumer.connect();
await consumer.subscribe({ topic: 'order-events', fromBeginning: false });

await consumer.run({
  eachMessage: async ({ topic, partition, message }) => {
    const event = JSON.parse(message.value.toString());
    console.log(`Processing: ${event.eventType} for order ${event.orderId}`);

    // Process the event...
    // On success, commit offset (automatic in run())
  },
});
```

#### RabbitMQ Example

```javascript
// Connection and channel
const connection = await amqp.connect('amqp://guest:guest@localhost:5672');
const channel = await connection.createChannel();

// Declare exchange and queue
await channel.assertExchange('orders', 'direct', { durable: true });
await channel.assertQueue('order-processing', { durable: true });
await channel.bindQueue('order-processing', 'orders', 'new-order');

// Producer
async function publishOrder(order) {
  channel.publish(
    'orders',
    'new-order',
    Buffer.from(JSON.stringify(order)),
    { persistent: true } // Message survives broker restart
  );
}

// Consumer
channel.consume('order-processing', async (msg) => {
  if (msg !== null) {
    const order = JSON.parse(msg.content.toString());
    try {
      await processOrder(order);
      channel.ack(msg); // Acknowledge — remove from queue
    } catch (error) {
      channel.nack(msg, false, true); // Negative ack — requeue
    }
  }
});
```

### Patterns and Best Practices

#### Dead Letter Queue (DLQ)

Messages that fail processing are sent to a DLQ for later analysis and reprocessing.

```javascript
// Kafka: Configure dead letter topic
await channel.sendBatch({
  topicMessages: [{
    topic: 'order-events',
    messages: [{
      key: order.id,
      value: JSON.stringify(order),
      headers: {
        'max-retries': '3',
      },
    }],
  }],
});
```

#### Idempotency

Since messages may be delivered more than once, make operations idempotent:

```typescript
// Idempotent order processing
async function processOrder(order: Order): Promise<void> {
  // Check if already processed using a unique constraint
  const existing = await db.orderEvents.findOne({
    orderId: order.id,
    eventType: 'ORDER_PROCESSED',
  });

  if (existing) {
    console.log(`Order ${order.id} already processed, skipping`);
    return;
  }

  // Process the order...
  await db.orderEvents.create({
    orderId: order.id,
    eventType: 'ORDER_PROCESSED',
    processedAt: new Date(),
  });
}
```

#### Exactly-Once Semantics

| Delivery Guarantee | Description |
|---|---|
| **At-most-once** | Message may be lost, never duplicated |
| **At-least-once** | Message never lost, may be duplicated |
| **Exactly-once** | Message processed exactly once (requires coordination) |

Kafka achieves exactly-once via **transactions** with idempotent producers and consumers.

### Common Use Cases

| Use Case | Recommended Queue |
|---|---|
| **Order processing pipeline** | Kafka or RabbitMQ |
| **Background job processing** | RabbitMQ, SQS, Redis |
| **Real-time analytics** | Kafka |
| **Email/notification sending** | RabbitMQ, SQS |
| **Microservices event bus** | Kafka, NATS |
| **IoT data ingestion** | Kafka, NATS |
| **Log aggregation** | Kafka (ELK stack) |

> **Tip:** The choice between Kafka and RabbitMQ often comes down to **replay capability**. If you need to re-read past messages (event sourcing, analytics), use Kafka. If you need simple task queuing with flexible routing, use RabbitMQ.
