# Python Core

## 1. Tổng quan

Đây là phần nền tảng nhất của `Python Backend`. Nếu phần này yếu thì lên `FastAPI`, `Django`, `Celery` hay AI serving rất dễ viết code rối, thiếu type, khó test và khó maintain.

## 2. Type hints

### 2.1. Vì sao type hints quan trọng?

Type hints không biến Python thành static language hoàn toàn, nhưng nó giúp:

- API rõ hơn
- IDE/autocomplete tốt hơn
- review code dễ hơn
- `mypy` phát hiện lỗi sớm
- team đọc contract nhanh hơn

```python
from collections.abc import Iterable

def average(values: Iterable[float]) -> float:
    items = list(values)
    return sum(items) / len(items)
```

### 2.2. Nên type rõ những chỗ nào?

- request DTO
- response DTO
- service input/output
- repository contract
- config object
- async function trả về kiểu gì

### 2.3. Lỗi hay gặp

- để `dict` chung chung khắp nơi
- route trả lúc là ORM object, lúc là dict
- function public không có type nhưng logic lại phức tạp

## 3. `dataclass`

### 3.1. Khi nào nên dùng?

`dataclass` rất hợp cho object dữ liệu nội bộ, nhất là ở service layer.

```python
from dataclasses import dataclass
from datetime import datetime

@dataclass(slots=True)
class AuditEvent:
    request_id: str
    user_id: str
    created_at: datetime
```

### 3.2. Dùng `dataclass` để làm gì trong backend?

- truyền dữ liệu giữa service và repository
- model hóa internal command/query
- biểu diễn domain object đơn giản
- gom dữ liệu trace/audit

### 3.3. Khi nào không nên dùng?

- khi object đã là ORM model
- khi object cần validation mạnh từ framework
- khi data shape thay đổi quá linh hoạt

## 4. Context manager

### 4.1. Ý nghĩa

Context manager rất quan trọng với resource lifecycle:

- file
- DB transaction
- lock
- network connection
- trace span

```python
with open("app.log", "a", encoding="utf-8") as f:
    f.write("request completed\n")
```

### 4.2. Tư duy quan trọng

Bất cứ thứ gì có pattern:

1. acquire
2. use
3. release

thì đều nên nghĩ tới context manager.

### 4.3. Ứng dụng trong dự án thật

- transaction scope
- tracing span
- file/object streaming
- lock bảo vệ tài nguyên dùng chung

## 5. Generator và iterator

### 5.1. Vì sao quan trọng?

Generator giúp xử lý data theo kiểu streaming thay vì load tất cả vào RAM.

```python
def iter_lines(path: str):
    with open(path, "r", encoding="utf-8") as f:
        for line in f:
            yield line.rstrip("\n")
```

### 5.2. Use case thực tế

- ETL
- export/import dữ liệu lớn
- log processing
- chunking tài liệu
- batch inference

### 5.3. Lỗi hay gặp

- convert generator thành list quá sớm
- generator làm side effect khó đoán
- không hiểu lúc nào data thật sự được tính

## 6. `Decimal`, `datetime`, `UUID`

### 6.1. `Decimal`

Dùng cho:

- tiền tệ
- billing
- score cần chính xác số học

Tránh dùng `float` cho tiền.

### 6.2. `datetime`

Backend hầu như luôn cần:

- created/updated timestamps
- audit log
- TTL
- scheduling

Nên ưu tiên timezone-aware datetime.

### 6.3. `UUID`

Phù hợp cho:

- public id
- distributed systems
- event id
- request correlation

## 7. Cách tổ chức code Python backend

Một structure dễ sống lâu thường là:

```text
app/
  api/
  schemas/
  services/
  repositories/
  models/
  workers/
  core/
```

Ý tưởng:

- `api`: route handler mỏng
- `schemas`: input/output model
- `services`: business logic
- `repositories`: DB/external access
- `workers`: background jobs
- `core`: config, logging, auth helpers

## 8. Common pitfalls

- business logic nhét hết vào route
- không dùng type hints
- object trả về không nhất quán
- helper functions rải lung tung
- util module phình to thành bãi rác

## 9. Best practices

- type public API rõ ràng
- route handler phải mỏng
- dùng `dataclass` hoặc schema object thay vì chuyền `dict` lung tung
- timezone phải nhất quán
- tách data model nội bộ với ORM model nếu domain phức tạp

## 10. Câu hỏi phỏng vấn hay gặp

### 10.1. Type hints có làm Python chạy nhanh hơn không?

Không trực tiếp. Giá trị chính của type hints là readability, tool support và bắt lỗi sớm.

### 10.2. Khi nào nên dùng `dataclass`?

Khi object chủ yếu chứa dữ liệu, không cần ORM behavior, và bạn muốn code gọn, rõ, dễ test.

### 10.3. Generator khác list ở điểm nào?

Generator tạo dữ liệu theo kiểu lazy, tiết kiệm memory hơn, phù hợp cho stream và dataset lớn.
