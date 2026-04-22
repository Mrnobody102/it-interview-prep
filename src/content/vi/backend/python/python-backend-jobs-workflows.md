# Jobs & Workflows

## 1. Tổng quan

Backend thực tế không chỉ có request/response. Rất nhiều việc phải chạy nền:

- gửi email
- indexing
- import/export dữ liệu
- parse file
- offline inference
- document ingestion cho RAG

Vì vậy `jobs`, `queue` và `workflow` là một mảng riêng.

## 2. Khi nào phải dùng background job?

Nếu tác vụ có một trong các dấu hiệu sau thì nên đẩy nền:

- chạy lâu hơn vài giây
- cần retry
- không cần trả kết quả ngay
- dễ fail do phụ thuộc downstream
- cần scale tách khỏi API

## 3. Celery

### 3.1. Vì sao Celery phổ biến?

`Celery` vẫn là lựa chọn rất phổ biến trong Python ecosystem.

```python
from celery import Celery

celery_app = Celery("tasks", broker="redis://localhost:6379/0")

@celery_app.task(bind=True, autoretry_for=(Exception,), retry_backoff=True)
def build_embeddings(self, document_id: str) -> None:
    ...
```

### 3.2. Celery phù hợp cho gì?

- retry tự động
- queue worker riêng
- tác vụ dài
- tích hợp Redis/RabbitMQ

### 3.3. Celery không hợp cho gì?

- tác vụ cực ngắn mà request handler xử lý được ngay
- workflow cần state machine rất phức tạp
- logic orchestration dài nhiều bước nhưng không có thiết kế rõ

## 4. Thiết kế job đúng

Một job production nên có:

- idempotency
- timeout
- retry policy
- dead-letter strategy
- structured log
- metrics

Nếu thiếu mấy thứ này, hệ thống queue rất nhanh biến thành nơi nuốt lỗi.

## 5. Workflow thường gặp trong AI systems

### 5.1. Document ingestion

1. upload file
2. parse text
3. chunk
4. embed
5. index vào vector DB

### 5.2. Offline scoring

1. lấy batch records
2. feature extraction
3. chạy model
4. lưu score
5. audit/log

### 5.3. Training trigger

1. detect data mới
2. chuẩn bị dataset
3. launch training
4. evaluate
5. publish artifact

## 6. Điều cần tách rõ

Nên phân biệt:

- API request path
- background job path
- model worker path
- scheduler/orchestrator path

Tránh viết kiểu route gọi thẳng cả pipeline dài rồi chờ response.

## 7. Common pitfalls

- job không idempotent
- retry nhưng không giới hạn
- queue vô hạn, không backpressure
- không có trạng thái job rõ ràng
- job làm quá nhiều thứ, khó resume

## 8. Best practices

- mỗi job nên làm một việc đủ nhỏ để retry được
- phải có job status rõ
- job dài nên log progress hoặc emit event
- DLQ và alerting phải có nếu job quan trọng
- tách orchestration logic khỏi worker logic

## 9. Câu hỏi phỏng vấn hay gặp

### 9.1. Khi nào nên dùng queue thay vì xử lý trực tiếp trong request?

Khi tác vụ dài, retryable, không cần trả kết quả ngay, hoặc cần scale riêng.

### 9.2. Idempotency là gì và vì sao quan trọng?

Là khả năng chạy lại cùng một job mà không tạo ra side effect sai. Nó rất quan trọng vì queue và retry luôn có thể làm job chạy nhiều lần.

### 9.3. Celery có phải giải pháp cho mọi workflow không?

Không. Nó rất thực dụng cho nhiều case, nhưng workflow cực phức tạp có thể cần orchestration rõ hơn.
