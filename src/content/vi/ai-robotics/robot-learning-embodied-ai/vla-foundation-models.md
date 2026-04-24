# VLA Models, World Models & Embodied FMs

## Tổng quan

Làn sóng embodied foundation models trong 2025-2026 ngày càng xoay quanh:

- vision-language-action models
- world models
- action chunking
- latent planning

Các model này cố nối perception và language với action ở quy mô lớn.

---

## VLA Models

Vision-language-action models thường kết hợp:

- visual tokens
- language instructions
- action prediction

Lời hứa của chúng là generalization rộng qua nhiều task, nhưng thách thức là execution đáng tin dưới noise của thế giới thật.

---

## World Models

World models cố học:

- latent dynamics
- các tương lai khả dĩ
- action-conditioned transitions

Điều này có thể giúp planning, error detection, và policy improvement.

Nhưng world models chỉ hữu ích nếu chúng bám được môi trường thật.

---

## Điều gì thay đổi trong 2025-2026

Những chuyển dịch gần đây gồm:

- nhiều policy dựa trên action-token và chunking hơn
- backbone pretrained đa phương thức lớn hơn
- sự quan tâm mạnh hơn tới embodied foundation-model evaluation
- nhấn mạnh vào deployment realism thay vì demo-only results

Lĩnh vực này đang đi từ benchmark thắng lẻ sang tích hợp hệ thống rộng hơn.

---

## Câu hỏi Phỏng vấn

### 1) VLA model là gì?

Đó là model kết hợp vision, language, và action trong cùng một kiến trúc policy hoặc decision.

### 2) Vì sao world models thú vị trong robotics?

Vì chúng có thể biểu diễn future dynamics và hỗ trợ planning hoặc lựa chọn action an toàn hơn.

### 3) Vì sao embodied foundation models vẫn khó deploy?

Vì robot thật áp đặt ràng buộc về latency, safety, calibration, và distribution shift khắc nghiệt hơn rất nhiều so với bối cảnh demo.
