# RAG, Agents & Tool Use

## Tổng quan

Agent systems hiện đại rộng hơn nhiều so với "LLM cộng retrieval".

Trong thực tế, mảng này tách tự nhiên thành bốn lớp kết nối:

1. retrieval foundations và kiến trúc RAG
2. tool calling và hành động có cấu trúc ra bên ngoài
3. agent orchestration qua các workflow nhiều bước
4. memory, context management, và evaluation

Đó là lý do chủ đề này được tách thành các mục con riêng.

---

## Vì sao nó quan trọng với AI-Robotics

Agentic systems giờ hỗ trợ:

- workflow tri thức trong doanh nghiệp
- coding và operations copilots
- giao diện planning cho embodied systems
- hệ quyết định nhiều bước có tool và có state

Trong robotics, các ý tưởng tương tự xuất hiện khi language interface, scene understanding, planning tools, và execution constraints phải phối hợp với nhau.

---

## Bản đồ các mục con

### 1. Retrieval Foundations & RAG Architecture

Trọng tâm:

- indexing, chunking, embeddings, và retrieval quality
- thiết kế pipeline RAG
- retrieval failure modes và ranh giới với hallucination
- khi nào retrieval hiệu quả hơn việc tăng long context đơn thuần

### 2. Tool Calling, APIs & Structured Actions

Trọng tâm:

- function calling và thiết kế tool schema
- external APIs, planners, và execution boundaries
- structured arguments và validation
- khi nào tool call an toàn hơn free-form text

### 3. Agent Orchestration & Multi-Step Systems

Trọng tâm:

- planning loops và luồng điều phối agent
- decomposition, delegation, và tool sequencing
- stateful workflows và task routing
- vì sao orchestration nhiều khi quan trọng hơn raw model quality

### 4. Memory, Context & Agent Evaluation

Trọng tâm:

- short-term context và long-term memory
- retrieval khác memory và state tracking thế nào
- agent evaluation, reliability, và cost
- cách test agent systems theo workflow thực tế

---

## Thứ tự học gợi ý

Với đa số engineers, thứ tự thực dụng là:

1. retrieval foundations
2. tool calling và structured actions
3. orchestration patterns
4. memory và evaluation

Thứ tự này giúp tách bạch điều model biết với phần mà hệ xung quanh phải gánh.

---

## Liên hệ với các topic AI-Robotics khác

Phần này có giao nhau, nhưng không thay thế:

- **NLP, LLMs & Transformers** cho tầng model
- **MLOps & AI Production** cho deployment và monitoring
- **Computer Vision** và **Robot Perception** khi tool phải tác động lên world state có grounding
- **Robot Learning & Embodied AI** khi agent phải nối ngôn ngữ với hành động

Agent systems là hệ orchestration quanh model, không chỉ là model bản thân nó.

---

## Câu hỏi Phỏng vấn

### 1) Vì sao nên tách RAG và agents thành nhiều mục nhỏ?

Vì retrieval, tool use, orchestration, và evaluation là các bài toán engineering riêng với failure modes khác nhau.

### 2) Vì sao tool use thường an toàn hơn free-form generation?

Vì tool calls ép hệ dùng hành động có cấu trúc, arguments tường minh, và ranh giới validation rõ ràng nên giảm ambiguity.

### 3) Vì sao agents lại liên quan tới robotics?

Vì robotics ngày càng cần planning có điều kiện ngôn ngữ, truy cập tool bên ngoài, memory, và luồng quyết định nhiều bước có kiểm soát.
