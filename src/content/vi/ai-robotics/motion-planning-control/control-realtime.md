# Control, Real-Time Systems & Execution

## Tổng quan

Planned motion chỉ trở thành real motion qua closed-loop execution.

Mục này tập trung vào:

- control laws
- timing constraints
- execution monitoring
- real-time behavior

---

## Các chiến lược Control

Những family quan trọng gồm:

- PID
- feedforward cộng feedback control
- model predictive control
- tracking controllers cho trajectories

Controller phù hợp phụ thuộc vào dynamics của robot, latency tolerance, và độ chính xác của task.

---

## Ràng buộc Real-Time

Control loops rất nhạy với:

- update frequency
- sensor latency
- actuator delay
- jitter trong tính toán

Planner đẹp vẫn có thể fail nếu timing không ổn định.

---

## Execution Monitoring

Các runtime checks hữu ích:

- tracking error thresholds
- contact hoặc force events bất thường
- lệch khỏi trajectory mong đợi
- controller saturation

Execution monitoring là cầu nối giữa sự lạc quan của planner và thực tế vật lý.

---

## Câu hỏi Phỏng vấn

### 1) Vì sao control khác planning?

Vì planning đề xuất chuyển động mong muốn, còn control liên tục sửa execution bằng feedback từ hệ thật.

### 2) Vì sao timing quan trọng đến vậy trong control?

Vì feedback trễ hoặc jitter lớn có thể làm loop mất ổn định và giảm chất lượng tracking.

### 3) Lợi ích của MPC là gì?

Nó có thể tối ưu các control actions tương lai dưới ràng buộc, rất hữu ích khi robot phải cân bằng dynamics với giới hạn vật lý.
