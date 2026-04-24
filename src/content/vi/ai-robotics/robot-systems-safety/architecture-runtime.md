# Production Architecture & Runtime Boundaries

## Tổng quan

Robot safety bắt đầu từ architecture, không chỉ bắt đầu từ emergency stop logic.

Mục này tập trung vào:

- process boundaries
- execution ownership
- edge vs cloud split
- failure containment

---

## Runtime Boundaries

Các câu hỏi quan trọng:

- cái gì chạy onboard?
- cái gì chấp nhận được cloud latency?
- module nào sở hữu final actuation?
- failures được cô lập ra sao?

Ranh giới tốt sẽ giảm blast radius của sai sót.

---

## Edge khác Cloud thế nào

Thông thường, các chức năng low-latency và safety-critical nên nằm gần robot hơn.

Cloud hoặc hệ remote có thể hỗ trợ:

- analytics
- heavy planning
- fleet coordination
- long-horizon optimization

Nhưng robot không nên phụ thuộc vào remote systems cho mọi critical reflex.

---

## Failure Containment

Các nguyên tắc kiến trúc hữu ích:

- ownership tường minh
- watchdog processes
- degraded modes
- giảm phụ thuộc trong các safety-critical loops

Production robots nên fail theo cách có thể dự đoán, chứ không fail một cách sáng tạo.

---

## Câu hỏi Phỏng vấn

### 1) Vì sao runtime boundaries quan trọng?

Vì chúng định nghĩa failure nào có thể lan rộng và module nào được phép ảnh hưởng tới hành vi safety-critical.

### 2) Vì sao edge compute nên xử lý các chức năng critical?

Vì network delay hoặc outages có thể khiến phụ thuộc remote trở nên quá rủi ro cho real-time control và safety.

### 3) Failure containment là gì?

Đó là thiết kế hệ sao cho một thành phần lỗi không tự động làm mất ổn định cả robot.
