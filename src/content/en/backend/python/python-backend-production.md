# Production & Best Practices

## 1. Overview

A Python backend that survives real production work needs three things:

- a codebase that scales with the team
- a runtime setup that stays stable
- operational discipline under load

## 2. Minimal toolchain

- `ruff`
- `mypy`
- `pytest`
- `pytest-asyncio`
- `pre-commit`

Without these, Python codebases drift into inconsistency very quickly, especially with multiple contributors.

## 3. Project structure and configuration

### 3.1. Structure

A common structure:

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

Use environment-based configuration through a settings object.

```python
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    app_name: str = "ai-api"
    redis_url: str
    model_name: str
```

Avoid:

- hard-coded secrets
- scattering `os.getenv()` everywhere
- config without validation

## 4. Observability

At minimum you want:

- structured logging
- request IDs and trace IDs
- p50/p95/p99 latency
- error rate
- queue depth
- model latency
- CPU/RAM/GPU metrics for AI systems

## 5. Security

Minimum baseline:

- strict input validation
- timeouts on all outbound calls
- rate limiting
- secrets stored in env or a vault
- auth for internal APIs
- no careless logging of PII, sensitive documents, or prompts

## 6. Deployment patterns

Common patterns:

- FastAPI + Uvicorn/Gunicorn
- Django + Gunicorn/Uvicorn
- separate Celery workers
- Redis/Kafka/RabbitMQ
- separate model workers if GPUs are involved
- Kubernetes when scaling needs are explicit

## 7. Common pitfalls

- very fat route handlers
- external calls without timeouts
- no concurrency limits
- long jobs mixed into the request path
- no model warm-up at startup
- too little or too much logging

## 8. Best practices

- keep business logic in services
- keep data access in repositories
- keep route handlers thin
- put timeouts on every external call
- move long-running work into queues
- version models, prompts, and configs clearly
- support canary and rollback strategies

## 9. Common interview questions

### 9.1. What metrics should a production Python backend expose?

At minimum: request rate, error rate, p50/p95/p99 latency, queue depth, and resource usage.

### 9.2. Why should every external call have a timeout?

Because a slow downstream can otherwise hold request threads or the event loop for too long and damage the whole request path.

### 9.3. What does a production Python backend need besides correct code?

Observability, security, deployment discipline, concurrency control, and rollback capability.
