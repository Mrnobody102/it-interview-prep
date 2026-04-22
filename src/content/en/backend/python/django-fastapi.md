# Django / FastAPI

## 1. Overview

This is the most important framework topic under `Python Backend`. The two frameworks usually serve two different kinds of problems:

- `Django`: business apps, admin, backoffice, data-heavy portals
- `FastAPI`: typed APIs, async services, model serving, microservices

## 2. Quick comparison

| Category | Django | FastAPI |
|---|---|---|
| Philosophy | full-stack, opinionated | API-first, lightweight, typed |
| Admin | very strong | no built-in admin |
| ORM | built-in ORM | usually SQLAlchemy |
| Async | available, but not its historical strength | core use case |
| AI serving | possible | usually the better fit |

## 3. When should you choose Django?

### 3.1. Good use cases

- fast admin and backoffice delivery
- built-in auth and session support
- business workflows with many forms and models
- teams wanting a batteries-included framework

### 3.2. Real project strengths

- the admin saves a lot of time
- migrations and ORM are strong enough for many business systems
- the package ecosystem is mature
- it fits internal tools, CMS-like systems, and operations portals

### 3.3. Things you must know in Django

- `select_related`
- `prefetch_related`
- how to avoid `N+1`
- transaction boundaries
- where caching actually helps

```python
products = (
    Product.objects
    .select_related("category")
    .prefetch_related("tags")
    .only("id", "name", "price", "category__name")
)
```

## 4. When should you choose FastAPI?

### 4.1. Good use cases

- clearly typed APIs
- async I/O
- automatic OpenAPI docs
- inference APIs
- smaller services with explicit contracts

### 4.2. Real project strengths

- strong validation through `Pydantic`
- clean dependency injection
- async-native design
- very good fit for services calling multiple downstreams

```python
from fastapi import Depends, FastAPI
from pydantic import BaseModel

app = FastAPI()

class EmbeddingRequest(BaseModel):
    texts: list[str]

def get_service() -> "EmbeddingService":
    return EmbeddingService()

@app.post("/embed")
async def embed(
    payload: EmbeddingRequest,
    service: "EmbeddingService" = Depends(get_service),
):
    return await service.embed(payload.texts)
```

### 4.3. Things to be careful about

- async routes are not automatically fast
- do not stuff business logic into handlers
- timeout, retries, and concurrency limits still need explicit design

## 5. Django and FastAPI in AI systems

### 5.1. Where does Django fit?

Django fits well when AI is only one part of a larger business platform:

- document upload portals
- model output review dashboards
- moderation and backoffice tools
- data workflow management

### 5.2. Where does FastAPI fit?

FastAPI is a strong fit for:

- embedding APIs
- reranking APIs
- model gateways
- LLM streaming APIs
- RAG orchestrators

## 6. Can both be used together?

Yes. Real systems can absolutely have:

- `Django` for admin, operations portals, and data curation
- `FastAPI` for public APIs or inference services

That architecture is very natural in larger AI/business platforms.

## 7. Best practices

- choose the framework based on product shape, not trendiness
- if the app is heavy on business workflows, do not force everything into FastAPI
- if the service is mostly API and inference, do not pull in full Django just out of habit
- keep routes/controllers thin; keep the logic in services

## 8. Common interview questions

### 8.1. When do you choose Django vs FastAPI?

Django fits business apps, admin, and backoffice. FastAPI fits typed APIs, async services, model serving, and microservices.

### 8.2. Is FastAPI async always faster?

No. It is stronger mainly when the workload is I/O-bound.

### 8.3. Can Django and FastAPI live in the same system?

Yes, as long as they serve clearly different roles and boundaries are explicit.
