# Serverless Architecture

## 

### Overview

No need to manage servers — focus purely on code. The cloud provider (AWS Lambda, Azure Functions, GCP Cloud Functions) automatically manages the underlying infrastructure including provisioning, scaling, and server maintenance.

### Core Concepts

- **FaaS (Function as a Service):** Run code based on events; pay only for execution time
- **BaaS (Backend as a Service):** Use third-party services (Auth0, Firebase) for backend functionality
- **Stateless:** Each function invocation is independent; no persisted state between calls
- **Auto-scaling:** Automatically scale from zero to thousands of concurrent executions

### Characteristics

| Property | Description |
|---|---|
| **Server Management** | None — managed by cloud provider |
| **Scaling** | Automatic, event-driven |
| **Billing** | Pay-per-invocation (not per hour) |
| **Cold Start** | Initial invocation may have latency |
| **State** | Stateless by default |

### Advantages

- **Zero server management:** Developers focus entirely on business logic
- **Cost efficiency:** Pay only when code runs — ideal for sporadic traffic patterns
- **Automatic scaling:** Handle sudden traffic spikes without configuration
- **Reduced operational overhead:** No need for DevOps teams to manage servers
- **Faster deployment:** Upload function code and it is live

### Disadvantages

- **Cold start latency:** First invocation (or after idle period) can be slow (100ms–10s)
- **Vendor lock-in:** Architecture tightly coupled to specific cloud provider's API and features
- **Limited execution time:** Functions have maximum runtime limits (e.g., Lambda: 15 minutes)
- **Hard to debug and monitor:** Distributed tracing is more complex
- **Stateless complexity:** Must externalize state to databases or caches
- **Not suitable for long-running processes:** Use containers or VMs instead

### Common Use Cases

| Use Case | Service |
|---|---|
| **API backends** | AWS Lambda + API Gateway |
| **File processing** | S3 trigger → Lambda |
| **Scheduled tasks** | CloudWatch Events → Lambda |
| **Real-time data processing** | Kinesis → Lambda |
| **IoT backends** | IoT Core → Lambda |

### Example: AWS Lambda Function

```javascript
// handler.js
exports.helloWorld = async (event) => {
  const { name = 'World' } = event.queryStringParameters || {};

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: `Hello, ${name}!`,
      timestamp: new Date().toISOString(),
    }),
  };
};
```

```yaml
# serverless.yml (Serverless Framework)
service: my-service

provider:
  name: aws
  runtime: nodejs18.x
  region: us-east-1

functions:
  hello:
    handler: handler.helloWorld
    events:
      - http:
          path: hello
          method: get
```

### Best Practices

- **Keep functions small and focused:** Single responsibility principle applies
- **Minimize dependencies:** Smaller package = faster cold starts
- **Use connection pooling:** Database connections should be reused across invocations
- **Implement proper error handling:** Dead letter queues for failed invocations
- **Monitor cold starts:** Use CloudWatch metrics and custom dashboards

> **Note:** Serverless does not mean "no servers." It means "no server management." Servers still exist — they are just abstracted away.
