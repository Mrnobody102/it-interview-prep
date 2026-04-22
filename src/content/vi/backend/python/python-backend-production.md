# Production & Best Practices

## 1. Tổng quan

Một Python backend dùng được trong dự án thật phải xử lý tốt ba việc:

- codebase rõ ràng cho team
- runtime ổn định cho production
- vận hành được khi traffic tăng

## 2. Tooling tối thiểu nên có

- `ruff`
- `mypy`
- `pytest`
- `pytest-asyncio`
- `pre-commit`

Nếu thiếu các công cụ này thì code Python rất dễ trôi về trạng thái khó đoán, đặc biệt ở codebase nhiều người sửa.

## 3. Project structure và configuration

### 3.1. Structure

Một cấu trúc phổ biến:

```text
app/
  api/
  services/
  repositories/
  schemas/
  workers/
  core/
```

### 3.2. Configuration

Nên dùng env-based config và load qua settings object.

```python
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    app_name: str = "ai-api"
    redis_url: str
    model_name: str
```

Tránh:

- hard-code secret
- rải `os.getenv()` khắp codebase
- config không có validation

## 4. Observability

Cần có tối thiểu:

- structured logging
- request ID / trace ID
- p50/p95/p99 latency
- error rate
- queue depth
- model latency
- CPU/RAM/GPU metrics nếu có AI

## 5. Security

Những điều tối thiểu:

- validate input kỹ
- timeout cho mọi outbound call
- rate limit
- secret qua env hoặc vault
- auth cho internal APIs
- không log PII, document nhạy cảm, prompt nhạy cảm bừa bãi

## 6. Deployment patterns

Các pattern phổ biến:

- FastAPI + Uvicorn/Gunicorn
- Django + Gunicorn/Uvicorn
- Celery worker riêng
- Redis/Kafka/RabbitMQ
- model worker riêng nếu có GPU
- Kubernetes khi cần scale rõ

## 7. Common pitfalls

- route handler quá dày
- external call không có timeout
- không giới hạn concurrency
- không tách job dài khỏi request path
- không warm-up model khi startup
- log quá ít hoặc quá nhiều

## 8. Best practices

- service layer giữ business logic
- repository layer giữ data access
- route handler mỏng
- external call luôn có timeout
- queue cho long-running work
- version model/prompt/config rõ ràng
- support canary hoặc rollback

## 9. Câu hỏi phỏng vấn hay gặp

### 9.1. Production Python backend cần metric gì?

Tối thiểu cần request rate, error rate, p50/p95/p99 latency, queue depth và resource usage.

### 9.2. Vì sao mọi external call đều cần timeout?

Vì nếu không có timeout, downstream chậm có thể kéo sập toàn bộ request path và làm thread/event loop bị giữ quá lâu.

### 9.3. Python backend production cần gì ngoài code chạy đúng?

Cần observability, security, deployment discipline, concurrency control và khả năng rollback.
