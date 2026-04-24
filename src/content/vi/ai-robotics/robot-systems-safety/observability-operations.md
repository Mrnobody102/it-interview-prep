# Observability, Incident Response & Operations

## Tổng quan

Deploy an toàn đòi hỏi biết robot đang làm gì, vì sao nó làm như vậy, và cách điều tra failures sau đó.

Mục này tập trung vào:

- telemetry
- logging
- replay
- incident response

---

## Các nền tảng của Observability

Những tín hiệu hữu ích gồm:

- CPU, memory, và thermal state
- sensor health
- localization quality
- controller saturation
- task và safety events

Operational visibility nên bao phủ cả sức khỏe phần mềm lẫn hành vi thật của robot.

---

## Incident Response

Một team trưởng thành nên có thể:

- phát hiện incident nhanh
- thu đúng logs cần thiết
- replay cửa sổ thời gian liên quan
- cô lập root cause
- đưa fix quay ngược vào test và deployment gates

Không có kỷ luật incident, cùng một failure sẽ lặp lại nhiều lần.

---

## Fleet Operations

Fleet operations thêm các bài toán:

- remote diagnostics
- version tracking
- staged updates
- fleet health dashboards

Gánh nặng vận hành tăng rất nhanh khi số robot tăng lên.

---

## Câu hỏi Phỏng vấn

### 1) Vì sao observability quan trọng trong robotics?

Vì robot failures thường phân tán qua sensing, planning, control, và runtime infrastructure chứ không nằm ở một code path rõ ràng duy nhất.

### 2) Vì sao replay giúp incident response?

Vì nó cho team một góc nhìn lặp lại được về failure thay vì phải dựa vào trí nhớ rời rạc của con người.

### 3) Điều gì làm fleet operations khó hơn single-robot operation?

Vì software versions, môi trường, khác biệt phần cứng, và remote troubleshooting đều scale độ phức tạp lên nhanh chóng.
