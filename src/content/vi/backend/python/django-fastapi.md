# Django / FastAPI

## 1. Tổng quan

Đây là nhóm kiến thức framework quan trọng nhất của `Python Backend`. Hai framework này thường phục vụ hai kiểu bài toán khác nhau:

- `Django`: business app, admin, backoffice, data-heavy portal
- `FastAPI`: typed API, async service, model serving, microservice

## 2. So sánh nhanh

| Tiêu chí | Django | FastAPI |
|---|---|---|
| Triết lý | full-stack, opinionated | API-first, nhẹ, typed |
| Admin | rất mạnh | không có sẵn |
| ORM | built-in ORM | thường dùng SQLAlchemy |
| Async | có nhưng không phải điểm mạnh lịch sử | là use case chính |
| AI serving | dùng được | thường hợp hơn |

## 3. Khi nào chọn Django?

### 3.1. Use case phù hợp

- admin/backoffice nhanh
- auth/session built-in
- business workflow nhiều form và nhiều model
- team muốn framework đầy đủ sẵn pin

### 3.2. Các điểm mạnh thực chiến

- admin rất tiết kiệm thời gian
- migration và ORM đủ mạnh cho nhiều hệ business
- ecosystem package lâu năm
- hợp với internal tools, CMS, operations portal

### 3.3. Những thứ phải biết khi dùng Django

- `select_related`
- `prefetch_related`
- tránh `N+1`
- transaction boundary
- cache đúng chỗ

```python
products = (
    Product.objects
    .select_related("category")
    .prefetch_related("tags")
    .only("id", "name", "price", "category__name")
)
```

## 4. Khi nào chọn FastAPI?

### 4.1. Use case phù hợp

- API typed rõ ràng
- async I/O
- OpenAPI docs tự sinh
- inference API
- microservice nhỏ, rõ contract

### 4.2. Các điểm mạnh thực chiến

- `Pydantic` validation tốt
- dependency injection rõ ràng
- async-native
- rất hợp cho service gọi nhiều downstream

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

### 4.3. Những chỗ phải cẩn thận

- đừng nhầm async route với auto-fast
- đừng để business logic dồn hết vào route
- phải quản lý timeout, retries và concurrency limit rõ ràng

## 5. Django và FastAPI trong hệ thống AI

### 5.1. Django hợp ở đâu?

Django hợp khi AI chỉ là một phần của business platform:

- portal upload tài liệu
- dashboard review kết quả model
- moderation/backoffice
- workflow quản trị dữ liệu

### 5.2. FastAPI hợp ở đâu?

FastAPI rất hợp cho:

- embedding API
- reranking API
- model gateway
- LLM streaming API
- RAG orchestrator

## 6. Có thể dùng cả hai cùng lúc không?

Có. Trong thực tế hoàn toàn có thể có:

- `Django` cho admin, operations portal, data curation
- `FastAPI` cho API public hoặc inference service

Đây là kiến trúc khá tự nhiên trong hệ AI/business platform lớn.

## 7. Best practices

- chọn framework theo sản phẩm, không theo trend
- nếu app nặng business workflow, đừng cố ép mọi thứ vào FastAPI
- nếu service chủ yếu là API/inference, đừng kéo cả Django vào chỉ vì quen tay
- route/controller phải mỏng, service layer mới là nơi chứa logic

## 8. Câu hỏi phỏng vấn hay gặp

### 8.1. Khi nào chọn Django, khi nào chọn FastAPI?

Django hợp cho business app, admin, backoffice. FastAPI hợp cho typed API, async service, model serving, microservice.

### 8.2. FastAPI async có luôn nhanh hơn không?

Không. Nó mạnh hơn khi workload chủ yếu là I/O-bound.

### 8.3. Có nên dùng Django và FastAPI cùng trong một hệ thống không?

Có, nếu chúng phục vụ hai vai trò khác nhau và boundary rõ ràng.
