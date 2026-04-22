# Jobs & Workflows

## 1. Overview

Real backends are not only request/response systems. Many tasks need to run in the background:

- email sending
- indexing
- imports and exports
- file parsing
- offline inference
- document ingestion for RAG

That makes jobs, queues, and workflows a separate topic.

## 2. When should work move to the background?

If a task has one of these signs, it usually belongs in the background:

- it runs for more than a few seconds
- it needs retries
- it does not need an immediate response
- it depends on fragile downstreams
- it should scale separately from the API

## 3. Celery

### 3.1. Why is Celery common?

`Celery` is still one of the most common choices in the Python ecosystem.

```python
from celery import Celery

celery_app = Celery("tasks", broker="redis://localhost:6379/0")

@celery_app.task(bind=True, autoretry_for=(Exception,), retry_backoff=True)
def build_embeddings(self, document_id: str) -> None:
    ...
```

### 3.2. What does Celery fit well?

- automatic retries
- dedicated worker pools
- long-running tasks
- Redis or RabbitMQ integration

### 3.3. What does it not fit well?

- extremely short tasks that can stay inline
- highly complex workflows with no clear state model
- orchestration-heavy pipelines with unclear boundaries

## 4. Good job design

A production job should have:

- idempotency
- timeouts
- retry policy
- dead-letter strategy
- structured logs
- metrics

Without these, queue systems quickly become error sinks.

## 5. Common workflows in AI systems

### 5.1. Document ingestion

1. upload file
2. parse text
3. chunk content
4. build embeddings
5. index into a vector DB

### 5.2. Offline scoring

1. load a batch of records
2. extract features
3. run the model
4. persist scores
5. emit audit logs

### 5.3. Training trigger

1. detect new data
2. prepare a dataset
3. launch training
4. evaluate
5. publish an artifact

## 6. What should be clearly separated?

Separate:

- API request path
- background job path
- model worker path
- scheduler/orchestrator path

Do not write routes that execute long pipelines directly and wait for them to finish.

## 7. Common pitfalls

- non-idempotent jobs
- retries with no limit
- unbounded queues
- no clear job states
- jobs doing too many things at once

## 8. Best practices

- each job should be small enough to retry safely
- job status should be explicit
- long jobs should log progress or emit events
- DLQ and alerting should exist for important work
- orchestration logic should stay separate from worker logic

## 9. Common interview questions

### 9.1. When should you use a queue instead of handling work in the request?

When the task is long-running, retryable, does not need an immediate response, or should scale separately.

### 9.2. What is idempotency and why does it matter?

It is the ability to run the same job again without producing incorrect duplicate side effects. It matters because queues and retries can cause repeated execution.

### 9.3. Is Celery the right answer for every workflow?

No. It is pragmatic for many use cases, but very complex workflows may need stronger orchestration models.
