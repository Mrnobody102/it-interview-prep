# Retrieval Foundations & RAG Architecture

## Tổng quan

RAG bắt đầu từ một ý tưởng rất cơ bản: model không nên chỉ dựa vào parametric memory khi kiến thức mới hoặc domain-specific thực sự quan trọng.

Mục này tập trung vào phần retrieval của agent systems:

- indexing
- chunking
- embeddings
- ranking
- response grounding

---

## Pipeline RAG cốt lõi

Một pipeline RAG thực dụng thường có:

1. document ingestion
2. chunking và gắn metadata
3. embedding và indexing
4. retrieval và reranking
5. answer synthesis với citations hoặc grounded context

Sai lầm lớn nhất là coi retrieval như "chỉ cần thêm vector DB" mà không thiết kế chunking và evaluation cho tử tế.

---

## Điều gì quyết định retrieval tốt

Chất lượng retrieval phụ thuộc vào:

- kích thước chunk và ranh giới ngữ nghĩa
- metadata filters
- lựa chọn embedding model
- hybrid retrieval giữa lexical và semantic
- chất lượng reranking

Retriever yếu sẽ biến model mạnh thành máy trả lời thiếu tin cậy.

---

## Failure Modes phổ biến

RAG fail khi:

- chunks quá lớn hoặc quá vụn
- indexing bỏ qua cấu trúc tài liệu
- retrieval miss nguồn đúng
- tài liệu stale vẫn còn active
- answer generation nói quá mức so với bằng chứng đã retrieve

Đó là lý do groundedness và retrieval recall quan trọng không kém fluent output.

---

## Câu hỏi Phỏng vấn

### 1) Vì sao chunking quan trọng trong RAG?

Vì chunking quyết định đơn vị nào có thể được retrieve, bao nhiêu context được giữ lại, và retriever có tìm ra đúng evidence hay không.

### 2) Vì sao nên kết hợp vector retrieval và keyword retrieval?

Vì semantic similarity giúp tìm theo nghĩa, còn lexical retrieval giữ được exact terms, IDs, và các cụm hiếm.

### 3) Vì sao LLM mạnh vẫn có thể hallucinate trong RAG?

Vì retriever có thể bỏ sót evidence đúng, hoặc generator có thể suy diễn vượt quá phần thực sự đã retrieve.
