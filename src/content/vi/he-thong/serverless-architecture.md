# Kiến trúc Serverless

## Tổng quan

Không cần quản lý server — chỉ tập trung vào code. Cloud provider (AWS Lambda, Azure Functions, GCP Cloud Functions) tự động quản lý infrastructure bên dưới bao gồm provisioning, scaling, và server maintenance.

### Khái niệm cốt lõi

- **FaaS (Function as a Service):** Chạy code dựa trên events; chỉ trả tiền cho thời gian thực thi
- **BaaS (Backend as a Service):** Sử dụng dịch vụ bên thứ ba (Auth0, Firebase) cho chức năng backend
- **Stateless:** Mỗi function invocation độc lập; không có state được lưu giữa các calls
- **Auto-scaling:** Tự động scale từ 0 đến hàng nghìn concurrent executions

### Đặc điểm

| Thuộc tính | Mô tả |
|---|---|
| **Quản lý server** | Không — do cloud provider quản lý |
| **Scaling** | Tự động, event-driven |
| **Billing** | Trả theo invocation (không phải per hour) |
| **Cold Start** | Invocation đầu tiên có thể có latency |
| **State** | Mặc định stateless |

### Ưu điểm

- **Không quản lý server:** Developers hoàn toàn tập trung vào business logic
- **Chi phí hiệu quả:** Chỉ trả khi code chạy — lý tưởng cho traffic pattern không đều
- **Scaling tự động:** Xử lý traffic spike đột ngột mà không cần cấu hình
- **Giảm operational overhead:** Không cần DevOps team quản lý server
- **Deployment nhanh:** Upload function code là lập tức live

### Nhược điểm

- **Cold start latency:** Invocation đầu tiên (hoặc sau idle) có thể chậm (100ms–10s)
- **Vendor lock-in:** Kiến trúc gắn chặt với cloud provider cụ thể
- **Giới hạn execution time:** Functions có giới hạn runtime tối đa (ví dụ: Lambda: 15 phút)
- **Khó debug và monitor:** Distributed tracing phức tạp hơn
- **Stateless complexity:** Phải externalize state sang databases hoặc caches
- **Không phù hợp cho long-running processes:** Dùng containers hoặc VMs thay thế

### Use cases phổ biến

| Use Case | Service |
|---|---|
| **API backends** | AWS Lambda + API Gateway |
| **Xử lý file** | S3 trigger → Lambda |
| **Scheduled tasks** | CloudWatch Events → Lambda |
| **Xử lý dữ liệu realtime** | Kinesis → Lambda |
| **IoT backends** | IoT Core → Lambda |

### Ví dụ: AWS Lambda Function

```javascript
// handler.js
exports.helloWorld = async (event) => {
  const { name = 'World' } = event.queryStringParameters || {};

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: `Xin chào, ${name}!`,
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
  region: ap-southeast-1

functions:
  hello:
    handler: handler.helloWorld
    events:
      - http:
          path: hello
          method: get
```

### Thực hành tốt

- **Giữ functions nhỏ và tập trung:** Nguyên lý Single Responsibility áp dụng
- **Tối thiểu dependencies:** Package nhỏ = cold start nhanh hơn
- **Sử dụng connection pooling:** Database connections nên được reuse across invocations
- **Implement error handling đúng cách:** Dead letter queues cho các invocation thất bại
- **Monitor cold starts:** Dùng CloudWatch metrics và custom dashboards

> **Lưu ý:** Serverless không có nghĩa là "không có server." Nó có nghĩa là "không quản lý server." Servers vẫn tồn tại — chúng chỉ được trừu tượng hóa đi.
