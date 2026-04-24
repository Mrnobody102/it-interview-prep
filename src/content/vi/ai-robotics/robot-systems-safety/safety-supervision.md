# Safety Layers, Guardrails & Supervision

## Tổng quan

Hành vi được plan hoặc được học không nên bị tin tưởng tuyệt đối nếu không có supervision.

Mục này tập trung vào:

- layered safety
- runtime checks
- fallback logic
- supervisor design

---

## Các lớp Safety

Những lớp phổ biến gồm:

- hard physical stop conditions
- controller-level limits
- motion guards
- perception confidence thresholds
- high-level task supervision

Safety không nên phụ thuộc vào một cơ chế duy nhất.

---

## Runtime Guardrails

Những runtime checks hữu ích:

- collision proximity thresholds
- force hoặc torque anomalies
- mất độ tin cậy localization
- planner divergence
- watchdog heartbeat failure

Guardrails chỉ hữu ích nếu chúng có thể can thiệp đủ nhanh.

---

## Fallback và Recovery

Một hệ tốt nên biết:

- khi nào phải chậm lại
- khi nào phải dừng
- khi nào phải xin trợ giúp
- khi nào phải chuyển sang degraded mode

Recovery là một phần của safety, không phải phần phụ được nghĩ tới sau.

---

## Câu hỏi Phỏng vấn

### 1) Vì sao layered safety quan trọng?

Vì bất kỳ safeguard đơn lẻ nào cũng có thể fail, và mỗi loại failure lại xuất hiện ở một tầng khác nhau của hệ.

### 2) Runtime guardrail là gì?

Đó là điều kiện hoặc cơ chế theo dõi hành vi đang chạy và can thiệp khi các ràng buộc an toàn hoặc tính hợp lệ bị vi phạm.

### 3) Vì sao fallback behavior là một phần của safety?

Vì hệ không thể degrade an toàn thường sẽ biến lỗi nhỏ thành outcome không an toàn.
